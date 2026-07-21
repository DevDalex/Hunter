import { createServer } from 'node:http';
import { access, mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const root = process.cwd();
const dist = path.join(root, 'dist/client');
const output = path.resolve(root, process.env.GREED_ISLAND_QA_OUTPUT || '.greed-island-qa');
const requestedExecutable = process.env.CHROMIUM_PATH || '';
const results = [];
const failures = [];

const mime = {
  '.css': 'text/css; charset=utf-8', '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.json': 'application/json; charset=utf-8',
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

const record = async (name, page, test) => {
  const runtimeErrors = [];
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  try {
    await test();
    if (runtimeErrors.length) throw new Error(`Runtime errors: ${runtimeErrors.join(' | ')}`);
    results.push({ name, status: 'passed' });
    process.stdout.write(`✓ ${name}\n`);
  } catch (error) {
    const screenshot = path.join(output, `archive-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`);
    await page.screenshot({ path: screenshot, fullPage: true }).catch(() => {});
    const failure = { name, status: 'failed', error: error.message, screenshot: path.relative(root, screenshot), runtimeErrors };
    failures.push(failure);
    results.push(failure);
    process.stdout.write(`✗ ${name} · ${error.message}\n`);
  }
};

const openArchive = async (page, base) => {
  await page.goto(`${base}/#/series/greed-island`, { waitUntil: 'domcontentloaded', timeout: 20_000 });
  await page.waitForSelector('.gi-card-archive', { timeout: 15_000 });
  await page.waitForFunction(() => !document.querySelector('.route-loading'), null, { timeout: 12_000 }).catch(() => {});
};

const assertLocalCardImage = async (page) => {
  const image = page.locator('.gi-card-archive__card img[data-card-media="local-webp"]');
  await image.waitFor({ state: 'attached' });
  await image.scrollIntoViewIfNeeded();
  await image.waitFor({ state: 'visible' });
  await page.waitForFunction(() => {
    const element = document.querySelector('.gi-card-archive__card img[data-card-media="local-webp"]');
    return element && element.complete && element.naturalWidth > 0 && element.currentSrc.includes('/media/greed-island/cards/');
  }, null, { timeout: 12_000 });
};

await mkdir(output, { recursive: true });
const executablePath = await firstAvailable([
  requestedExecutable,
  chromium.executablePath(),
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
]);
if (!executablePath) throw new Error('No Chromium executable is available.');

const browser = await chromium.launch({
  headless: true,
  executablePath,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--no-zygote'],
});
const server = await serve();
const base = `http://127.0.0.1:${server.address().port}`;

try {
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await record('Specified archive search, evidence, and local media', desktop, async () => {
    await openArchive(desktop, base);
    const archive = desktop.locator('.gi-card-archive');
    if (await archive.locator('.gi-card-archive__results button').count() !== 100) throw new Error('Archive does not initially expose 100 cards');
    if (!await archive.locator('.gi-card-archive__metrics').innerText().then((text) => text.includes('100 / 100'))) throw new Error('Archive verification metric is missing');
    await assertLocalCardImage(desktop);

    await archive.locator('.gi-card-archive__search input').fill('Blue Planet');
    const bluePlanet = archive.locator('.gi-card-archive__results button').filter({ hasText: 'Blue Planet' });
    await bluePlanet.waitFor();
    await bluePlanet.click();
    await archive.locator('.gi-card-archive__record h3').filter({ hasText: 'Blue Planet' }).waitFor();
    const blueRecord = (await archive.locator('.gi-card-archive__record').innerText()).toLowerCase();
    if (!blueRecord.includes('unknown in source')) throw new Error('Blue Planet acquisition is not identified as explicitly unknown');
    if (!blueRecord.includes('ch. 184') || !blueRecord.includes('ch. 185') || !blueRecord.includes('ep. 75')) throw new Error('Blue Planet story mapping is incomplete');
    if (!blueRecord.includes('gift from space')) throw new Error('Blue Planet verified effect is missing');
    await assertLocalCardImage(desktop);

    await archive.locator('.gi-card-archive__search input').fill('');
    await archive.locator('label').filter({ hasText: 'Material' }).locator('select').selectOption('equipment');
    const paladin = archive.locator('.gi-card-archive__results button').filter({ hasText: "Paladin's Necklace" });
    await paladin.waitFor();
    await paladin.click();
    await archive.locator('.gi-card-archive__check input').check();
    const paladinRecord = (await archive.locator('.gi-card-archive__record').innerText()).toLowerCase();
    if (!paladinRecord.includes('verified') || !paladinRecord.includes('gon freecss')) throw new Error('Paladin story evidence is incomplete');
    if (await archive.locator('a', { hasText: 'Open story source' }).count() !== 1) throw new Error('Card-specific story source is missing');
    if (await archive.locator('a', { hasText: 'Table source' }).count() !== 1) throw new Error('Archive table attribution is missing');
  });
  await desktop.close();

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  await record('Specified archive mobile containment and reduced motion', mobile, async () => {
    await openArchive(mobile, base);
    const archive = mobile.locator('.gi-card-archive');
    await archive.locator('.gi-card-archive__search input').fill('000');
    await archive.locator('.gi-card-archive__results button').filter({ hasText: "Ruler's Blessing" }).click();
    await assertLocalCardImage(mobile);
    const state = await mobile.evaluate(() => {
      const record = document.querySelector('.gi-card-archive__record');
      const card = document.querySelector('.gi-card-archive__card .gi-card');
      return {
        overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
        reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
        recordWidth: record?.getBoundingClientRect().width || 0,
        cardTransition: card ? getComputedStyle(card).transitionDuration : '',
      };
    });
    if (state.overflow > 1) throw new Error(`mobile archive overflowed horizontally by ${state.overflow}px`);
    if (!state.reducedMotion) throw new Error('reduced-motion emulation was not active');
    if (state.recordWidth > 390.5) throw new Error(`archive record exceeds mobile viewport at ${state.recordWidth}px`);
    const durations = state.cardTransition.split(',').map((value) => Number.parseFloat(value)).filter(Number.isFinite);
    if (durations.some((duration) => duration > 0.001)) throw new Error(`archive card transition remains ${state.cardTransition} under reduced motion`);
  });
  await mobile.close();
} finally {
  await browser.close().catch(() => {});
  await new Promise((resolve) => server.close(resolve));
}

const summary = { generatedAt: new Date().toISOString(), checks: results.length, passed: results.length - failures.length, failed: failures.length };
await writeFile(path.join(output, 'archive-report.json'), `${JSON.stringify({ summary, results }, null, 2)}\n`);
await writeFile(path.join(output, 'archive-summary.json'), `${JSON.stringify(summary, null, 2)}\n`);
console.log(`\nGreed Island archive QA: ${summary.passed}/${summary.checks} browser checks passed.`);
if (failures.length) process.exitCode = 1;
