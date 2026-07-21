import { createServer } from 'node:http';
import { access, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const root = process.cwd();
const dist = path.join(root, 'dist/client');
const output = path.resolve(root, process.env.GREED_ISLAND_QA_OUTPUT || '.greed-island-qa');
const requestedExecutable = process.env.CHROMIUM_PATH || '';

const mime = {
  '.css': 'text/css; charset=utf-8', '.gif': 'image/gif', '.html': 'text/html; charset=utf-8',
  '.jpeg': 'image/jpeg', '.jpg': 'image/jpeg', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml',
  '.webp': 'image/webp', '.zip': 'application/zip',
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

const results = [];
const failures = [];
const record = async (name, page, test) => {
  const runtimeErrors = [];
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  try {
    await test();
    if (runtimeErrors.length) throw new Error(`Runtime errors: ${runtimeErrors.join(' | ')}`);
    results.push({ name, status: 'passed' });
    process.stdout.write(`✓ ${name}\n`);
  } catch (error) {
    const screenshot = path.join(output, `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`);
    await page.screenshot({ path: screenshot, fullPage: true }).catch(() => {});
    const failure = { name, status: 'failed', error: error.message, screenshot: path.relative(root, screenshot), runtimeErrors };
    failures.push(failure);
    results.push(failure);
    process.stdout.write(`✗ ${name} · ${error.message}\n`);
  }
};

const openGreedIsland = async (page, base) => {
  await page.goto(`${base}/#/series/greed-island`, { waitUntil: 'domcontentloaded', timeout: 20_000 });
  await page.waitForSelector('.greed-island-page', { timeout: 12_000 });
  await page.waitForFunction(() => !document.querySelector('.route-loading'), null, { timeout: 12_000 }).catch(() => {});
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

try {
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await record('Greed Island Binder keyboard and persistence', desktop, async () => {
    await openGreedIsland(desktop, base);
    await desktop.locator('.gi-book-gate button').click();
    await desktop.waitForSelector('.gi-binder-section');

    const lockedReward = desktop.getByRole('button', { name: /Specified Slot 000 locked/i });
    if (await lockedReward.count() !== 1) throw new Error('Specified Slot 000 is not visibly locked at initial state');

    const plotOfBeach = desktop.locator('.gi-card-tray .gi-card').filter({ hasText: 'Plot of Beach' });
    await plotOfBeach.focus();
    await desktop.keyboard.press('Enter');
    const slot002 = desktop.getByRole('button', { name: 'Insert held card into Specified Slot 002' });
    await slot002.focus();
    await desktop.keyboard.press('Enter');
    await desktop.getByRole('button', { name: /Lift 002, Plot of Beach/i }).waitFor();
    if (!(await desktop.locator('.gi-progress').innerText()).includes('001 / 100')) throw new Error('Binder progress did not advance to 001 / 100');

    const card003 = desktop.locator('.gi-card-tray .gi-card').filter({ hasText: 'Pitcher of Eternal Water' });
    await card003.click();
    await desktop.getByRole('button', { name: 'Insert held card into Specified Slot 004' }).click();
    const etaText = await desktop.locator('.gi-eta-status').innerText();
    if (!etaText.includes('belongs in Specified Slot 003, not 004')) throw new Error('Eta did not reject the mismatched slot');
    if (!(await desktop.locator('.gi-progress').innerText()).includes('001 / 100')) throw new Error('Invalid insertion changed Binder progress');

    await desktop.locator('.gi-binder-toolbar input').fill('Blue Planet');
    await desktop.locator('.gi-binder-toolbar form button').click();
    await desktop.locator('.gi-book__pages > header b').filter({ hasText: '080–089' }).waitFor();

    await desktop.reload({ waitUntil: 'domcontentloaded' });
    await desktop.waitForSelector('.greed-island-page');
    await desktop.locator('.gi-book-gate button').click();
    await desktop.getByRole('button', { name: /Lift 002, Plot of Beach/i }).waitFor();
    await desktop.getByRole('button', { name: /Reset simulation/i }).click();
    if (!(await desktop.locator('.gi-progress').innerText()).includes('000 / 100')) throw new Error('Reset did not clear Binder progress');
  });
  await desktop.close();

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  await record('Greed Island mobile and reduced motion', mobile, async () => {
    await openGreedIsland(mobile, base);
    await mobile.getByRole('button', { name: /Free Exploration/i }).click();
    await mobile.waitForSelector('.gi-binder-section');
    const state = await mobile.evaluate(() => {
      const card = document.querySelector('.gi-card');
      return {
        overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
        reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
        transitionDuration: card ? getComputedStyle(card).transitionDuration : '',
        liveRegion: document.querySelector('.gi-eta-status')?.getAttribute('aria-live'),
      };
    });
    if (state.overflow > 1) throw new Error(`mobile page overflowed horizontally by ${state.overflow}px`);
    if (!state.reducedMotion) throw new Error('reduced-motion emulation was not active');
    if (state.transitionDuration !== '0s') throw new Error(`card transition remains ${state.transitionDuration} under reduced motion`);
    if (state.liveRegion !== 'polite') throw new Error('Eta status is not exposed as a polite live region');

    await mobile.locator('.gi-card-tray .gi-card').filter({ hasText: 'Plot of Beach' }).click();
    await mobile.getByRole('button', { name: 'Insert held card into Specified Slot 002' }).click();
    await mobile.getByRole('button', { name: /Lift 002, Plot of Beach/i }).waitFor();
  });
  await mobile.close();
} finally {
  await browser.close().catch(() => {});
  await new Promise((resolve) => server.close(resolve));
}

const summary = { generatedAt: new Date().toISOString(), checks: results.length, passed: results.length - failures.length, failed: failures.length };
await writeFile(path.join(output, 'report.json'), `${JSON.stringify({ summary, results }, null, 2)}\n`);
await writeFile(path.join(output, 'summary.json'), `${JSON.stringify(summary, null, 2)}\n`);
console.log(`\nGreed Island QA: ${summary.passed}/${summary.checks} browser checks passed.`);
if (failures.length) process.exitCode = 1;
