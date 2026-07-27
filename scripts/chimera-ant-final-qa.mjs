import { createServer } from 'node:http';
import { access, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const root = process.cwd();
const dist = path.join(root, 'dist/client');
const output = path.resolve(root, process.env.CHIMERA_ANT_QA_OUTPUT || '.chimera-ant-qa');
const requestedExecutable = process.env.CHROMIUM_PATH || '';
const widths = [1366, 1600, 1920, 2560];

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

      const screenshot = path.join(output, `chimera-ant-${width}.png`);
      await page.screenshot({ path: screenshot, fullPage: true });
      report.widths.push({ width, status: 'passed', metrics, screenshot: path.relative(root, screenshot) });
      process.stdout.write(`✓ Chimera Ant desktop QA ${width}px\n`);
    } catch (error) {
      const screenshot = path.join(output, `chimera-ant-${width}-failure.png`);
      await page.screenshot({ path: screenshot, fullPage: true }).catch(() => {});
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
