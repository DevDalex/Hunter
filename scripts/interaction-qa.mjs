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
  await run('Nen hex category focus reveals users and abilities', { width: 1440, height: 1000 }, 'reference/nen', async (page) => {
    await page.waitForSelector('.nen-expansion-map[data-qa-pan-zoom-canvas="true"]');
    const enhancement = page.locator('.nen-pipe-node.is-category').filter({ hasText: 'Enhancement' }).first();
    const clipPath = await enhancement.evaluate((element) => getComputedStyle(element).clipPath);
    if (!clipPath.includes('polygon')) throw new Error(`Enhancement category is not hexagonal: ${clipPath}`);
    if (await page.locator('.nen-pipe-node.is-expanded-user').count()) throw new Error('secondary users are visible before category focus');
    if (await page.locator('.nen-pipe-node.is-named-ability').count()) throw new Error('named abilities are visible before category focus');

    await enhancement.click();
    await page.waitForSelector('.nen-pipe-node.is-expanded-user');
    await page.waitForSelector('.nen-pipe-node.is-named-ability');
    if (await enhancement.getAttribute('aria-expanded') !== 'true') throw new Error('Enhancement did not enter expanded state');
    const expandedUsers = await page.locator('.nen-pipe-node.is-expanded-user').count();
    const expandedAbilities = await page.locator('.nen-pipe-node.is-named-ability').count();
    if (expandedUsers < 3) throw new Error(`Enhancement exposed only ${expandedUsers} secondary users`);
    if (expandedAbilities < 2) throw new Error(`Enhancement exposed only ${expandedAbilities} named abilities`);

    const jajanken = page.locator('.nen-pipe-node.is-named-ability').filter({ hasText: 'Jajanken' }).first();
    await jajanken.click();
    await page.waitForFunction(() => document.querySelector('.nen-pipe-inspector h2')?.textContent?.includes('Jajanken'));
    const inspectorText = await page.locator('.nen-pipe-inspector').innerText();
    for (const label of ['Natural category', 'Supporting categories', 'Activation', 'Cost / restriction']) {
      if (!inspectorText.includes(label)) throw new Error(`Jajanken inspector is missing ${label}`);
    }

    await enhancement.click();
    await page.waitForTimeout(80);
    if (await enhancement.getAttribute('aria-expanded') !== 'false') throw new Error('Enhancement did not collapse');
    if (await page.locator('.nen-pipe-node.is-expanded-user').count()) throw new Error('secondary users remained after collapse');
    if (await page.locator('.nen-pipe-node.is-named-ability').count()) throw new Error('named abilities remained after collapse');
  });

  await run('Nen spectrum markers preserve midpoint and leaning placements', { width: 1440, height: 1000 }, 'reference/nen', async (page) => {
    await page.waitForSelector('.nen-placement-marker');
    const markerCount = await page.locator('.nen-placement-marker').count();
    if (markerCount < 15) throw new Error(`only ${markerCount} spectrum placement markers rendered`);
    const franklin = page.getByRole('button', { name: /Franklin Bordeau.*placed between Emission and Enhancement/i });
    await franklin.click();
    await page.waitForFunction(() => document.querySelector('.nen-pipe-inspector h2')?.textContent?.includes('Franklin Bordeau'));
    const inspector = await page.locator('.nen-pipe-inspector').innerText();
    if (!inspector.includes('Emission') || !inspector.includes('Enhancement')) throw new Error('Franklin placement did not identify both spectrum endpoints');
  });

  await run('Nen pan and zoom canvas stays contained on mobile', { width: 390, height: 844 }, 'reference/nen', async (page) => {
    await page.waitForSelector('.nen-expansion-map[data-qa-pan-zoom-canvas="true"] [data-qa-scaled-canvas="true"]');
    const controls = page.locator('.nen-pipe-controls button');
    if (await controls.count() !== 4) throw new Error('map controls are incomplete');
    for (let index = 0; index < await controls.count(); index += 1) {
      const box = await controls.nth(index).boundingBox();
      if (!box || box.width < 43.5 || box.height < 43.5) throw new Error(`fixed map control ${index + 1} is undersized`);
    }
    const health = await pageHealth(page, '.nen-expansion-map');
    if (health.bodyOverflow > 1) throw new Error(`mobile page overflowed horizontally by ${health.bodyOverflow}px`);
    if (health.brokenImages.length) throw new Error(`mobile broken images: ${JSON.stringify(health.brokenImages)}`);
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
