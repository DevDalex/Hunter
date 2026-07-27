import { createServer } from 'node:http';
import { access, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const root = process.cwd();
const dist = path.join(root, 'dist/client');
const output = path.resolve(root, process.env.CHIMERA_ANT_QA_OUTPUT || '.chimera-ant-qa');
const requestedExecutable = process.env.CHROMIUM_PATH || '';
const widths = [1366, 1600, 1920, 2560];
const sectionEvidenceIds = [
  'overview', 'before-the-arc', 'premise', 'episode-phases', 'characters', 'factions', 'locations',
  'nen', 'conflicts', 'objects', 'ending', 'adaptation', 'records', 'sources',
];

const mime = {
  '.css': 'text/css; charset=utf-8', '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif',
};

const firstAvailable = async (candidates) => {
  for (const candidate of candidates.filter(Boolean)) {
    try { await access(candidate); return candidate; } catch { /* continue */ }
  }
  return '';
};

const serve = async () => {
  await access(path.join(dist, 'index.html'));
  const server = createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
      let filename = path.join(dist, pathname === '/' ? 'index.html' : pathname);
      if (!filename.startsWith(dist)) throw new Error('Invalid path');
      try { if ((await stat(filename)).isDirectory()) filename = path.join(dist, 'index.html'); } catch { filename = path.join(dist, 'index.html'); }
      response.setHeader('content-type', mime[path.extname(filename).toLowerCase()] || 'application/octet-stream');
      response.setHeader('cache-control', 'no-store');
      response.end(await readFile(filename));
    } catch (error) {
      response.statusCode = 500;
      response.end(error.message);
    }
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  return server;
};

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

const executablePath = await firstAvailable([
  requestedExecutable,
  chromium.executablePath(),
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
]);
if (!executablePath) throw new Error('No Chromium executable is available. Run "npm run browser:install" or set CHROMIUM_PATH.');

const browser = await chromium.launch({
  headless: true,
  executablePath,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--no-zygote'],
});
const server = await serve();
const base = `http://127.0.0.1:${server.address().port}`;
const report = { widths: [], failures: [] };

const assert = (condition, message) => { if (!condition) throw new Error(message); };

try {
  for (const width of widths) {
    const page = await browser.newPage({ viewport: { width, height: 1000 }, deviceScaleFactor: 1 });
    const runtimeErrors = [];
    const consoleErrors = [];
    page.on('pageerror', (error) => runtimeErrors.push(error.message));
    page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });

    try {
      await page.goto(`${base}/story/chimera-ant`, { waitUntil: 'networkidle', timeout: 45_000 });
      await page.waitForSelector('.chimera-ant-page', { timeout: 20_000 });
      await page.waitForSelector('[data-supporting-archive="characters"]', { timeout: 12_000 });
      await page.waitForSelector('[data-reference-archive="sources"]', { timeout: 12_000 });

      assert(await page.locator('[data-section-id]').count() === 15, 'Expected 15 page sections');
      assert(await page.locator('[data-phase-section="true"]').count() === 7, 'Expected 7 phase sections');
      assert(await page.locator('[data-supporting-archive]').count() === 6, 'Expected 6 supporting archive portals');
      assert(await page.locator('[data-reference-archive]').count() === 4, 'Expected 4 reference archive portals');
      assert(await page.locator('.chimera-ant-phase-rail__segment').count() === 7, 'Expected 7 proportional phase controls');
      assert(await page.locator('.chimera-character-dossier').count() === 8, 'Expected 8 character dossiers');
      assert(await page.locator('.chimera-faction-record').count() === 5, 'Expected 5 faction records');
      assert(await page.locator('.chimera-location-route > ol > li').count() === 6, 'Expected 6 location stops');
      assert(await page.locator('.chimera-nen-matrix__table > article').count() === 8, 'Expected 8 Nen rows');
      assert(await page.locator('.chimera-conflict-operations > ol > li').count() === 7, 'Expected 7 conflict rows');
      assert(await page.locator('.chimera-object-cabinet__grid > article').count() === 6, 'Expected 6 object records');
      assert(await page.locator('.chimera-ending-chain > li').count() === 5, 'Expected 5 ending-chain records');
      assert(await page.locator('.chimera-adaptation-correspondence > article').count() === 7, 'Expected 7 adaptation rows');

      const overflow = await page.evaluate(() => {
        const tolerance = 2;
        const offenders = [];
        for (const element of document.querySelectorAll('.chimera-ant-page *')) {
          const rect = element.getBoundingClientRect();
          if (rect.width <= 0 || rect.height <= 0) continue;
          if (rect.right > window.innerWidth + tolerance || rect.left < -tolerance) {
            offenders.push({ tag: element.tagName, className: String(element.className).slice(0, 140), left: rect.left, right: rect.right });
            if (offenders.length >= 12) break;
          }
        }
        return {
          documentOverflow: document.documentElement.scrollWidth - window.innerWidth,
          offenders,
        };
      });
      assert(overflow.documentOverflow <= 2, `Document overflows horizontally by ${overflow.documentOverflow}px`);
      assert(overflow.offenders.length === 0, `Elements overflow viewport: ${JSON.stringify(overflow.offenders)}`);

      const legacyVisibility = await page.evaluate(() => [
        '.chimera-ant-character-ledger', '.chimera-ant-record-grid', '.chimera-ant-nen-ledger',
        '.chimera-ant-conflict-ledger', '.chimera-ant-ending', '.chimera-ant-adaptation',
        '.chimera-ant-record-summary', '.chimera-ant-source-list',
      ].map((selector) => ({ selector, visible: [...document.querySelectorAll(selector)].some((node) => getComputedStyle(node).display !== 'none') })));
      assert(legacyVisibility.every((record) => !record.visible), `Legacy section bodies remain visible: ${JSON.stringify(legacyVisibility.filter((record) => record.visible))}`);

      const brokenImages = await page.evaluate(() => [...document.images]
        .filter((image) => image.closest('.chimera-ant-page') && image.complete && image.naturalWidth === 0)
        .map((image) => image.currentSrc || image.src));
      assert(brokenImages.length === 0, `Broken images: ${brokenImages.join(', ')}`);

      const duplicateIds = await page.evaluate(() => {
        const counts = new Map();
        for (const node of document.querySelectorAll('[id]')) counts.set(node.id, (counts.get(node.id) || 0) + 1);
        return [...counts.entries()].filter(([, count]) => count > 1);
      });
      assert(duplicateIds.length === 0, `Duplicate ids: ${JSON.stringify(duplicateIds)}`);

      const undersizedText = await page.evaluate(() => {
        const records = [];
        const selector = '.chimera-ant-page :is(dt, small, figcaption, a, button, span, p, li, dd)';
        for (const node of document.querySelectorAll(selector)) {
          const style = getComputedStyle(node);
          const rect = node.getBoundingClientRect();
          if (rect.width <= 0 || rect.height <= 0 || style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) continue;
          const directText = [...node.childNodes]
            .filter((child) => child.nodeType === Node.TEXT_NODE)
            .map((child) => child.textContent)
            .join(' ')
            .replace(/\s+/g, ' ')
            .trim();
          const text = directText || (node.matches('dt, small, a, button, figcaption') ? node.textContent.replace(/\s+/g, ' ').trim() : '');
          if (!text) continue;
          const fontSize = Number.parseFloat(style.fontSize);
          if (fontSize < 11.9) {
            records.push({
              tag: node.tagName,
              className: String(node.className).slice(0, 140),
              text: text.slice(0, 90),
              fontSize,
            });
            if (records.length >= 24) break;
          }
        }
        return records;
      });
      assert(undersizedText.length === 0, `Text below 12px: ${JSON.stringify(undersizedText)}`);

      const lowContrastText = await page.evaluate(() => {
        const parseColor = (value) => {
          const match = value.match(/rgba?\(([^)]+)\)/);
          if (!match) return null;
          const parts = match[1].split(/[ ,/]+/).filter(Boolean).map(Number);
          return { r: parts[0], g: parts[1], b: parts[2], a: Number.isFinite(parts[3]) ? parts[3] : 1 };
        };
        const blend = (foreground, background) => ({
          r: foreground.r * foreground.a + background.r * (1 - foreground.a),
          g: foreground.g * foreground.a + background.g * (1 - foreground.a),
          b: foreground.b * foreground.a + background.b * (1 - foreground.a),
          a: 1,
        });
        const luminance = ({ r, g, b }) => {
          const channel = (value) => {
            const normalized = value / 255;
            return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
          };
          return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
        };
        const ratio = (first, second) => {
          const [light, dark] = [luminance(first), luminance(second)].sort((a, b) => b - a);
          return (light + 0.05) / (dark + 0.05);
        };
        const opaqueBackground = (node) => {
          for (let current = node; current; current = current.parentElement) {
            const parsed = parseColor(getComputedStyle(current).backgroundColor);
            if (parsed && parsed.a >= 0.98) return parsed;
          }
          return { r: 255, g: 255, b: 255, a: 1 };
        };

        const selectors = [
          'dt', 'small', '[class*="__eyebrow"]', '[class*="__kicker"]', '[class*="__label"]',
          '[class*="__meta"]', '[class*="__badge"]', '[class*="__tag"]', '[class*="__ordinal"] > span',
          '[class*="__index"] > span', '.chimera-ant-rail nav button', '.chimera-phase-spread__media figcaption > span',
          '.chimera-phase-spread__media figcaption a', '.chimera-phase-spread__footer span',
        ].join(',');
        const records = [];
        for (const node of document.querySelectorAll(`.chimera-ant-page :is(${selectors})`)) {
          if (node.closest('.chimera-ant-shell-hero')) continue;
          const style = getComputedStyle(node);
          const rect = node.getBoundingClientRect();
          const text = node.textContent.replace(/\s+/g, ' ').trim();
          if (!text || rect.width <= 0 || rect.height <= 0 || style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) continue;
          const foreground = parseColor(style.color);
          const background = opaqueBackground(node);
          if (!foreground || !background) continue;
          const effectiveForeground = foreground.a < 1 ? blend(foreground, background) : foreground;
          const contrast = ratio(effectiveForeground, background);
          const fontSize = Number.parseFloat(style.fontSize);
          const fontWeight = Number.parseInt(style.fontWeight, 10) || 400;
          const isLarge = fontSize >= 24 || (fontSize >= 18.66 && fontWeight >= 700);
          const minimum = isLarge ? 3 : 4.5;
          if (contrast + 0.02 < minimum) {
            records.push({
              tag: node.tagName,
              className: String(node.className).slice(0, 140),
              text: text.slice(0, 90),
              contrast: Number(contrast.toFixed(2)),
              minimum,
              color: style.color,
              background: getComputedStyle(node).backgroundColor,
            });
            if (records.length >= 24) break;
          }
        }
        return records;
      });
      assert(lowContrastText.length === 0, `Low-contrast microcopy: ${JSON.stringify(lowContrastText)}`);

      await page.locator('.chimera-ant-phase-rail__segment').last().click();
      await page.waitForFunction(() => document.querySelector('#chimera-phase-poison-memory-homecoming')?.classList.contains('is-active'), null, { timeout: 8_000 });

      await page.locator('.chimera-ant-rail nav button').filter({ hasText: 'Records' }).click();
      await page.waitForFunction(() => Math.abs(document.querySelector('#chimera-records').getBoundingClientRect().top) < 220, null, { timeout: 8_000 });

      assert(runtimeErrors.length === 0, `Runtime errors: ${runtimeErrors.join(' | ')}`);
      assert(consoleErrors.length === 0, `Console errors: ${consoleErrors.join(' | ')}`);

      const metrics = await page.evaluate(() => {
        const resources = performance.getEntriesByType('resource');
        return {
          domNodes: document.getElementsByTagName('*').length,
          pageHeight: document.documentElement.scrollHeight,
          resources: resources.length,
          transferBytes: resources.reduce((sum, entry) => sum + (entry.transferSize || 0), 0),
        };
      });
      assert(metrics.domNodes < 9000, `DOM node budget exceeded: ${metrics.domNodes}`);
      assert(metrics.transferBytes < 25 * 1024 * 1024, `Transfer budget exceeded: ${metrics.transferBytes} bytes`);

      const screenshots = [];
      const viewportScreenshot = path.join(output, `chimera-ant-${width}-viewport.png`);
      await page.screenshot({ path: viewportScreenshot });
      screenshots.push(path.relative(root, viewportScreenshot));

      if (width === 1600) {
        for (const id of sectionEvidenceIds) {
          const section = page.locator(`[data-section-id="${id}"]`);
          await section.scrollIntoViewIfNeeded();
          const screenshot = path.join(output, `chimera-ant-1600-section-${id}.png`);
          await section.screenshot({ path: screenshot, animations: 'disabled' });
          screenshots.push(path.relative(root, screenshot));
        }

        const phases = page.locator('[data-phase-section="true"]');
        for (let index = 0; index < await phases.count(); index += 1) {
          const phase = phases.nth(index);
          const id = (await phase.getAttribute('id')) || `phase-${index + 1}`;
          await phase.scrollIntoViewIfNeeded();
          const screenshot = path.join(output, `chimera-ant-1600-${id}.png`);
          await phase.screenshot({ path: screenshot, animations: 'disabled' });
          screenshots.push(path.relative(root, screenshot));
        }
      }

      report.widths.push({ width, status: 'passed', metrics, screenshots });
      process.stdout.write(`✓ Chimera Ant desktop QA ${width}px\n`);
    } catch (error) {
      const screenshot = path.join(output, `chimera-ant-${width}-failure.png`);
      await page.screenshot({ path: screenshot }).catch(() => {});
      report.failures.push({ width, error: error.message, runtimeErrors, consoleErrors, screenshot: path.relative(root, screenshot) });
      report.widths.push({ width, status: 'failed', error: error.message });
      process.stdout.write(`✗ Chimera Ant desktop QA ${width}px · ${error.message}\n`);
    } finally {
      await page.close();
    }
  }
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
  await writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2));
}

if (report.failures.length) throw new Error(`${report.failures.length} Chimera Ant desktop QA viewport(s) failed. See ${path.relative(root, output)}/report.json.`);
console.log(`Chimera Ant browser QA passed at ${widths.join(', ')}px.`);
