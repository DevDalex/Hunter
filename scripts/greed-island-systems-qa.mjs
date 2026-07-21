import { createServer } from 'node:http';
import { access, mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const root = process.cwd();
const dist = path.join(root, 'dist/client');
const output = path.resolve(root, process.env.GREED_ISLAND_SYSTEMS_QA_OUTPUT || '.greed-island-systems-qa');
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
    const screenshot = path.join(output, `systems-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`);
    await page.screenshot({ path: screenshot, fullPage: true }).catch(() => {});
    const failure = { name, status: 'failed', error: error.message, screenshot: path.relative(root, screenshot), runtimeErrors };
    failures.push(failure);
    results.push(failure);
    process.stdout.write(`✗ ${name} · ${error.message}\n`);
  }
};

const openSystems = async (page, base) => {
  await page.goto(`${base}/#/series/greed-island`, { waitUntil: 'domcontentloaded', timeout: 20_000 });
  await page.waitForSelector('.gi-systems', { timeout: 15_000 });
  await page.waitForFunction(() => !document.querySelector('.route-loading'), null, { timeout: 12_000 }).catch(() => {});
  await page.locator('.gi-systems').scrollIntoViewIfNeeded();
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
  await record('Island map, locations, and quests', desktop, async () => {
    await openSystems(desktop, base);
    const systems = desktop.locator('.gi-systems');
    if (await systems.locator('.gi-systems-map button').count() !== 9) throw new Error('Island map does not expose 9 locations/facilities');
    const metrics = await systems.locator('.gi-systems__metrics').innerText();
    if (!metrics.includes('9') || !metrics.includes('8') || !metrics.includes('6')) throw new Error('Island system metrics are incomplete');

    await systems.locator('[data-location-id="port"]').click();
    const portText = (await systems.locator('.gi-systems-location-card').innerText()).toLowerCase();
    if (!portText.includes('only port') || !portText.includes('transport ticket')) throw new Error('Port location record is incomplete');

    await systems.locator('[data-quest-id="soufrabi-plot-of-beach"]').click();
    const questText = (await systems.locator('.gi-systems-quest-record').innerText()).toLowerCase();
    if (!questText.includes('plot of beach') || !questText.includes('razor') || !questText.includes('soufrabi')) throw new Error('Soufrabi quest record is incomplete');
    if (await systems.locator('a', { hasText: 'Open quest source' }).count() < 1) throw new Error('Quest source link is missing');

    await systems.locator('.gi-systems__search input').fill('love');
    const header = await systems.locator('.gi-systems__map-header').innerText();
    if (!header.includes('1 matching map records')) throw new Error(`Location search did not narrow to Aiai: ${header}`);
  });
  await desktop.close();

  const desktopControls = await browser.newPage({ viewport: { width: 1366, height: 920 } });
  await record('Player Binder and Game Master controls', desktopControls, async () => {
    await openSystems(desktopControls, base);
    const systems = desktopControls.locator('.gi-systems');

    await systems.locator('.gi-systems-player__controls label').filter({ hasText: 'Known record' }).locator('select').selectOption('genthru');
    await systems.locator('.gi-systems-player__controls label').filter({ hasText: 'Binder system' }).locator('select').selectOption('attack-risk');
    const playerText = (await systems.locator('.gi-systems-player').innerText()).toLowerCase();
    if (!playerText.includes('genthru') || !playerText.includes('attack-spell risk state') || !playerText.includes('selected archive target')) throw new Error('Player Binder attack-risk simulation is incomplete');

    await systems.locator('.gi-systems-player__controls label').filter({ hasText: 'Known record' }).locator('select').selectOption('razor');
    const blockedText = (await systems.locator('.gi-systems-player__outcome').innerText()).toLowerCase();
    if (!blockedText.includes('blocks normal player-target assumptions')) throw new Error('Game Master player-target block is missing');

    await systems.locator('[data-gm-control="negative-card-console"]').click();
    const gmText = (await systems.locator('.gi-systems-gm__record').innerText()).toLowerCase();
    if (!gmText.includes('game master-only') || !gmText.includes('eliminate') || !gmText.includes('-003')) throw new Error('GM-only negative card console is incomplete');

    await systems.locator('[data-gm-control="razor-intruder-defense"]').click();
    const razorText = (await systems.locator('.gi-systems-gm__record').innerText()).toLowerCase();
    if (!razorText.includes('intruders') || !razorText.includes('eliminate')) throw new Error('Razor intruder defense control is incomplete');
  });
  await desktopControls.close();

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  await record('Island systems mobile containment and reduced motion', mobile, async () => {
    await openSystems(mobile, base);
    const systems = mobile.locator('.gi-systems');
    await systems.locator('.gi-systems__search input').fill('limeiro');
    await systems.locator('[data-location-id="limeiro"]').click();
    await systems.locator('[data-gm-control="list-dwun-castle"]').click();
    const mobileText = (await systems.innerText()).toLowerCase();
    if (!mobileText.includes('limeiro') || !mobileText.includes('capital') || !mobileText.includes('list / dwun')) throw new Error('Mobile systems view did not expose Limeiro and GM castle records');

    const state = await mobile.evaluate(() => {
      const systems = document.querySelector('.gi-systems');
      const mapButton = document.querySelector('.gi-systems-map button');
      return {
        overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
        reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
        width: systems?.getBoundingClientRect().width || 0,
        transition: mapButton ? getComputedStyle(mapButton).transitionDuration : '',
      };
    });
    if (state.overflow > 1) throw new Error(`island systems overflowed mobile viewport by ${state.overflow}px`);
    if (!state.reducedMotion) throw new Error('reduced-motion emulation was not active');
    if (state.width > 390.5) throw new Error(`systems section exceeds mobile viewport at ${state.width}px`);
    const durations = state.transition.split(',').map((value) => Number.parseFloat(value)).filter(Number.isFinite);
    if (durations.some((duration) => duration > 0.001)) throw new Error(`systems transition remains ${state.transition} under reduced motion`);
  });
  await mobile.close();
} finally {
  await browser.close().catch(() => {});
  await new Promise((resolve) => server.close(resolve));
}

const summary = { generatedAt: new Date().toISOString(), checks: results.length, passed: results.length - failures.length, failed: failures.length };
await writeFile(path.join(output, 'systems-report.json'), `${JSON.stringify({ summary, results }, null, 2)}\n`);
await writeFile(path.join(output, 'systems-summary.json'), `${JSON.stringify(summary, null, 2)}\n`);
console.log(`\nGreed Island systems QA: ${summary.passed}/${summary.checks} browser checks passed.`);
if (failures.length) process.exitCode = 1;
