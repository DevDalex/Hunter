import { createServer } from 'node:http';
import { access, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const root = process.cwd();
const dist = path.join(root, 'dist/client');
const output = path.resolve(root, process.env.INTERACTION_QA_OUTPUT || '.interaction-qa');
const requestedExecutable = process.env.CHROMIUM_PATH || '';

const mime = {
  '.css': 'text/css; charset=utf-8', '.gif': 'image/gif', '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.jpeg': 'image/jpeg', '.jpg': 'image/jpeg', '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml',
  '.webp': 'image/webp', '.zip': 'application/zip',
};

const firstAvailable = async (candidates) => {
  for (const candidate of candidates.filter(Boolean)) {
    try { await access(candidate); return candidate; } catch { /* continue */ }
  }
  return '';
};

const resolveExecutable = async () => firstAvailable([
  requestedExecutable,
  chromium.executablePath(),
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
]);

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

const settle = async (page) => {
  await page.waitForSelector('main', { timeout: 10_000 });
  await page.waitForFunction(() => !document.querySelector('.route-loading'), null, { timeout: 12_000 }).catch(() => {});
  await page.waitForTimeout(250);
};

const pageHealth = async (page, selector = 'main') => page.evaluate((rootSelector) => {
  const visible = (element) => {
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) !== 0 && rect.width > 0 && rect.height > 0;
  };
  const rootNode = document.querySelector(rootSelector);
  const brokenImages = [...document.images]
    .filter((image) => visible(image) && image.complete && image.naturalWidth === 0)
    .map((image) => ({ alt: image.alt, src: image.currentSrc || image.src }));
  const unavailable = [...document.querySelectorAll('.safe-image-placeholder')]
    .filter(visible)
    .map((element) => element.getAttribute('aria-label') || element.textContent.trim());
  const bodyOverflow = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth;
  const rootRect = rootNode?.getBoundingClientRect();
  return { brokenImages, unavailable, bodyOverflow, rootRect: rootRect ? { left: rootRect.left, right: rootRect.right, width: rootRect.width } : null };
}, selector);

const expectedApplications = { Ten: 4, Zetsu: 2, Ren: 4, Hatsu: 1 };
const results = [];
const failures = [];

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
const executablePath = await resolveExecutable();
if (!executablePath) throw new Error('No Chromium executable is available. Run "npm run browser:install" or set CHROMIUM_PATH.');

const browser = await chromium.launch({
  headless: true,
  executablePath,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--no-zygote'],
});
const server = await serve();
const base = `http://127.0.0.1:${server.address().port}`;

const run = async (name, viewport, route, test) => {
  const page = await browser.newPage({ viewport });
  const runtimeErrors = [];
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  try {
    await page.goto(`${base}/#/${route}`, { waitUntil: 'domcontentloaded', timeout: 20_000 });
    await settle(page);
    await test(page);
    if (runtimeErrors.length) throw new Error(`Runtime errors: ${runtimeErrors.join(' | ')}`);
    results.push({ name, status: 'passed' });
    process.stdout.write(`✓ ${name}\n`);
  } catch (error) {
    const screenshot = path.join(output, `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`);
    await page.screenshot({ path: screenshot, fullPage: true }).catch(() => {});
    const failure = { name, status: 'failed', error: error.message, screenshot: path.relative(root, screenshot), runtimeErrors };
    results.push(failure);
    failures.push(failure);
    process.stdout.write(`✗ ${name} · ${error.message}\n`);
  } finally {
    await page.close().catch(() => {});
  }
};

try {
  await run('Nen principle states remain contained', { width: 1440, height: 1000 }, 'reference/nen', async (page) => {
    await page.waitForSelector('.nen-principle-workbench');
    for (const [principle, expected] of Object.entries(expectedApplications)) {
      const node = page.locator('.nen-principle-node').filter({ hasText: principle }).first();
      await node.click();
      await page.waitForTimeout(80);
      if (await node.getAttribute('aria-pressed') !== 'true') throw new Error(`${principle} did not become active`);
      const state = await page.evaluate(({ expectedCount }) => {
        const map = document.querySelector('.nen-principle-map');
        const mapRect = map.getBoundingClientRect();
        const visible = (element) => {
          const style = getComputedStyle(element);
          const rect = element.getBoundingClientRect();
          return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) !== 0 && rect.width > 0 && rect.height > 0;
        };
        const related = [...document.querySelectorAll('.nen-advanced-node.is-related')].filter(visible);
        const malformed = related.map((element) => {
          const rect = element.getBoundingClientRect();
          return { width: Math.round(rect.width), height: Math.round(rect.height), outside: rect.left < mapRect.left - 2 || rect.right > mapRect.right + 2 || rect.top < mapRect.top - 2 || rect.bottom > mapRect.bottom + 2 };
        }).filter((item) => item.width > 180 || item.height > 100 || item.width < 35 || item.height < 24 || item.outside);
        const inspectorImages = [...document.querySelectorAll('.nen-principle-inspector img')].filter(visible).map((image) => ({ complete: image.complete, naturalWidth: image.naturalWidth }));
        const placeholders = [...document.querySelectorAll('.nen-principle-inspector .safe-image-placeholder')].filter(visible).length;
        return { expectedCount, relatedCount: related.length, malformed, inspectorImages, placeholders };
      }, { expectedCount: expected });
      if (state.relatedCount !== expected) throw new Error(`${principle} shows ${state.relatedCount} related techniques; expected ${expected}`);
      if (state.malformed.length) throw new Error(`${principle} has malformed advanced cards`);
      if (state.placeholders) throw new Error(`${principle} displays unavailable-image placeholders`);
      if (state.inspectorImages.length < 2 || state.inspectorImages.some((image) => !image.complete || image.naturalWidth === 0)) throw new Error(`${principle} inspector images did not render`);
    }
    const health = await pageHealth(page, '.nen-principle-workbench');
    if (health.bodyOverflow > 1) throw new Error(`page overflowed horizontally by ${health.bodyOverflow}px`);
    if (health.brokenImages.length) throw new Error(`broken images: ${JSON.stringify(health.brokenImages)}`);
  });

  await run('Nen advanced gallery renders every visual', { width: 1440, height: 1000 }, 'reference/nen', async (page) => {
    await page.getByRole('button', { name: /Advanced techniques/i }).click();
    await page.waitForSelector('.nen-technique-gallery article');
    const images = page.locator('.nen-technique-gallery article img');
    for (let index = 0; index < await images.count(); index += 1) await images.nth(index).scrollIntoViewIfNeeded();
    await page.waitForFunction(() => {
      const galleryImages = [...document.querySelectorAll('.nen-technique-gallery article img')];
      return galleryImages.length === 7 && galleryImages.every((image) => image.complete && image.naturalWidth > 0);
    }, null, { timeout: 15_000 });
    const health = await pageHealth(page, '.nen-technique-gallery');
    if (health.unavailable.length) throw new Error('advanced gallery displays unavailable-image placeholders');
  });

  await run('Nen mobile state has no horizontal spill', { width: 390, height: 844 }, 'reference/nen', async (page) => {
    await page.waitForSelector('.nen-principle-workbench');
    const health = await pageHealth(page, '.nen-principle-workbench');
    if (health.bodyOverflow > 1) throw new Error(`mobile page overflowed horizontally by ${health.bodyOverflow}px`);
    if (health.brokenImages.length) throw new Error(`mobile broken images: ${JSON.stringify(health.brokenImages)}`);
    if (health.unavailable.length) throw new Error(`mobile unavailable visuals: ${health.unavailable.join(', ')}`);
  });

  await run('Dedicated relationship workspace filters and links remain readable', { width: 1440, height: 1000 }, 'succession/relationships', async (page) => {
    await page.waitForSelector('.succession-canonical-relationships .succession-relationship-network');
    const rootNode = page.locator('.succession-canonical-relationships');
    await rootNode.getByRole('button', { name: /Accessible edge list/i }).click();
    await page.waitForSelector('.succession-relationship-accessible > ol > li');
    const records = rootNode.locator('.succession-relationship-accessible > ol > li');
    const initialCount = await records.count();
    if (initialCount < 20) throw new Error(`relationship edge list is incomplete: ${initialCount} records`);

    const filter = rootNode.locator('.succession-relationship-filter-panel__search input');
    for (const item of [
      { query: 'Kurapika', minimum: 4, label: 'Kurapika relationships' },
      { query: 'Morena', minimum: 3, label: 'Morena relationships' },
      { query: 'Halkenburg', minimum: 3, label: 'Halkenburg relationships' },
    ]) {
      await filter.fill(item.query);
      await page.waitForTimeout(80);
      const count = await records.count();
      if (count < item.minimum) throw new Error(`${item.label} returned ${count}; expected at least ${item.minimum}`);
      const health = await pageHealth(page, '.succession-canonical-relationships');
      if (health.bodyOverflow > 2) throw new Error(`${item.label} overflowed by ${health.bodyOverflow}px`);
    }

    await filter.fill('');
    await page.waitForTimeout(80);
    const kurapikaFocus = rootNode.locator('.succession-relationship-connectivity button').filter({ hasText: /^Kurapika/ }).first();
    await kurapikaFocus.click();
    await page.waitForSelector('.succession-relationship-node-snapshot');
    const focusedCount = Number((await rootNode.locator('.succession-relationship-node-snapshot header dl dd').first().innerText()).trim());
    if (!Number.isFinite(focusedCount) || focusedCount < 4 || focusedCount >= initialCount) throw new Error(`actor focus did not narrow the relationship graph: ${focusedCount} of ${initialCount}`);

    const entityLink = rootNode.locator('.succession-relationship-linked-entity__record').first();
    await entityLink.click();
    await page.waitForSelector('.succession-character-dossier, .succession-organization-dossier', { timeout: 10_000 });
    if (!page.url().includes('entity=character%3A') && !page.url().includes('entity=organization%3A')) throw new Error('relationship node did not preserve a canonical entity ID');
    const health = await pageHealth(page, 'main');
    if (health.bodyOverflow > 1) throw new Error(`relationship-linked canonical dossier overflowed by ${health.bodyOverflow}px`);
  });

  await run('Dedicated relationship workspace remains contained on mobile', { width: 390, height: 844 }, 'succession/relationships', async (page) => {
    await page.waitForSelector('.succession-canonical-relationships .succession-relationship-network');
    const rootNode = page.locator('.succession-canonical-relationships');
    await rootNode.getByRole('button', { name: /Accessible edge list/i }).click();
    await page.waitForSelector('.succession-relationship-accessible > ol > li');
    const health = await pageHealth(page, '.succession-canonical-relationships');
    if (health.bodyOverflow > 1) throw new Error(`relationship workspace overflowed horizontally by ${health.bodyOverflow}px`);
  });
} finally {
  await browser.close().catch(() => {});
  await new Promise((resolve) => server.close(resolve));
}

const summary = { generatedAt: new Date().toISOString(), checks: results.length, passed: results.length - failures.length, failed: failures.length };
await writeFile(path.join(output, 'report.json'), `${JSON.stringify({ summary, results }, null, 2)}\n`);
await writeFile(path.join(output, 'summary.json'), `${JSON.stringify(summary, null, 2)}\n`);
console.log(`\nInteraction QA: ${summary.passed}/${summary.checks} critical state checks passed.`);
if (failures.length) process.exitCode = 1;
