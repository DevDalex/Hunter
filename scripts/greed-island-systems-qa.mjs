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

const openSystems = async (page, base, view = 'map') => {
  await page.goto(`${base}/#/series/greed-island/island/${view}`, { waitUntil: 'domcontentloaded', timeout: 20_000 });
  await page.waitForSelector(`.gi-systems[data-island-system-view="${view}"]`, { timeout: 15_000 });
  await page.waitForFunction(() => !document.querySelector('.route-loading'), null, { timeout: 12_000 }).catch(() => {});
  await page.locator('.gi-systems').scrollIntoViewIfNeeded();
};

const assertMapGeometry = async (systems, viewportLabel) => {
  const geometry = await systems.locator('.gi-systems-map').evaluate((map) => {
    const mapRect = map.getBoundingClientRect();
    const labels = [...map.querySelectorAll('button[data-location-id]')].map((button) => {
      const rect = button.getBoundingClientRect();
      return {
        id: button.dataset.locationId,
        left: rect.left,
        right: rect.right,
        top: rect.top,
        bottom: rect.bottom,
      };
    });
    const collisions = [];
    for (let first = 0; first < labels.length; first += 1) {
      for (let second = first + 1; second < labels.length; second += 1) {
        const a = labels[first];
        const b = labels[second];
        const overlapX = Math.min(a.right, b.right) - Math.max(a.left, b.left);
        const overlapY = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
        if (overlapX > 1 && overlapY > 1) collisions.push(`${a.id}/${b.id}`);
      }
    }
    const clipped = labels
      .filter((label) => label.left < mapRect.left - 1 || label.right > mapRect.right + 1 || label.top < mapRect.top - 1 || label.bottom > mapRect.bottom + 1)
      .map((label) => label.id);
    return { collisions, clipped };
  });

  if (geometry.collisions.length) throw new Error(`${viewportLabel} map labels overlap: ${geometry.collisions.join(', ')}`);
  if (geometry.clipped.length) throw new Error(`${viewportLabel} map labels are clipped: ${geometry.clipped.join(', ')}`);
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
  await record('Island map and location route', desktop, async () => {
    await openSystems(desktop, base, 'map');
    const systems = desktop.locator('.gi-systems');
    if (await systems.locator('.gi-systems-map button').count() !== 9) throw new Error('Island map does not expose 9 locations/facilities');
    if (await systems.locator('.gi-systems-locations, .gi-systems-quests, .gi-systems-player, .gi-systems-gm').count()) throw new Error('Inactive island system views remain mounted on the map route');
    const metrics = await systems.locator('.gi-systems__metrics').innerText();
    if (!metrics.includes('9') || !metrics.includes('8') || !metrics.includes('6')) throw new Error('Island system metrics are incomplete');
    if (await systems.locator('.gi-systems-overview .safe-image, .gi-systems-overview .safe-image-placeholder').count() < 1) throw new Error('Island overview visual is missing');
    if (await systems.locator('.gi-systems-map__connections line').count() < 8) throw new Error('Island map connection layer is incomplete');
    await assertMapGeometry(systems, 'desktop');

    await systems.locator('[data-location-id="port"]').click();
    const portText = (await systems.locator('.gi-systems-location-card').innerText()).toLowerCase();
    if (!portText.includes('only port') || !portText.includes('transport ticket')) throw new Error('Port location record is incomplete');
    if (await systems.locator('.gi-systems-location-card__visual .safe-image, .gi-systems-location-card__visual .safe-image-placeholder').count() < 1) throw new Error('Selected location visual is missing');

    await systems.locator('.gi-systems__search input').fill('love');
    const header = await systems.locator('.gi-systems__map-header').innerText();
    if (!header.includes('1 matching map records')) throw new Error(`Location search did not narrow to Aiai: ${header}`);
  });
  await desktop.close();

  const locations = await browser.newPage({ viewport: { width: 1366, height: 920 } });
  await record('Visual location directory route', locations, async () => {
    await openSystems(locations, base, 'locations');
    const systems = locations.locator('.gi-systems');
    if (await systems.locator('[data-location-directory-id]').count() !== 9) throw new Error('Location directory does not expose 9 verified records');
    if (await systems.locator('.gi-systems-map, .gi-systems-quests, .gi-systems-player, .gi-systems-gm').count()) throw new Error('Inactive island system views remain mounted on the locations route');
    if (await systems.locator('.gi-systems-locations__grid .safe-image, .gi-systems-locations__grid .safe-image-placeholder').count() !== 9) throw new Error('Location directory does not expose one visual per record');

    await systems.locator('[data-location-directory-id="masadora"]').click();
    let panelText = (await systems.locator('.gi-systems-location-card').innerText()).toLowerCase();
    if (!panelText.includes('masadora') || !panelText.includes('magic city') || !panelText.includes('spell card')) throw new Error('Masadora location detail is incomplete');

    await systems.locator('.gi-systems__search input').fill('love');
    if (await systems.locator('[data-location-directory-id]').count() !== 1) throw new Error('Location directory search did not narrow to one record');
    if (await systems.locator('[data-location-directory-id="aiai"]').count() !== 1) throw new Error('Location directory search did not expose Aiai');
    await systems.locator('[data-location-directory-id="aiai"]').click();
    panelText = (await systems.locator('.gi-systems-location-card').innerText()).toLowerCase();
    if (!panelText.includes('aiai') || !panelText.includes('city of love')) throw new Error('Aiai location detail is incomplete');
  });
  await locations.close();

  const quests = await browser.newPage({ viewport: { width: 1366, height: 920 } });
  await record('Quest route isolation and source records', quests, async () => {
    await openSystems(quests, base, 'quests');
    const systems = quests.locator('.gi-systems');
    if (await systems.locator('.gi-systems-map, .gi-systems-locations, .gi-systems-player, .gi-systems-gm').count()) throw new Error('Map, locations, players, or Game Master controls remain mounted on the quest route');
    await systems.locator('[data-quest-id="soufrabi-plot-of-beach"]').click();
    const questText = (await systems.locator('.gi-systems-quest-record').innerText()).toLowerCase();
    if (!questText.includes('plot of beach') || !questText.includes('razor') || !questText.includes('soufrabi')) throw new Error('Soufrabi quest record is incomplete');
    if (await systems.locator('.gi-systems-quest-record__visual .safe-image, .gi-systems-quest-record__visual .safe-image-placeholder').count() < 1) throw new Error('Quest location visual is missing');
    if (await systems.locator('a', { hasText: 'Open quest source' }).count() < 1) throw new Error('Quest source link is missing');
  });
  await quests.close();

  const desktopControls = await browser.newPage({ viewport: { width: 1366, height: 920 } });
  await record('Player Binder and Game Master direct routes', desktopControls, async () => {
    await openSystems(desktopControls, base, 'players');
    let systems = desktopControls.locator('.gi-systems');
    if (await systems.locator('.gi-systems-map, .gi-systems-locations, .gi-systems-quests, .gi-systems-gm').count()) throw new Error('Inactive island systems remain mounted on the players route');
    await systems.locator('.gi-systems-player__controls label').filter({ hasText: 'Known record' }).locator('select').selectOption('genthru');
    await systems.locator('.gi-systems-player__controls label').filter({ hasText: 'Binder system' }).locator('select').selectOption('attack-risk');
    const playerText = (await systems.locator('.gi-systems-player').innerText()).toLowerCase();
    if (!playerText.includes('genthru') || !playerText.includes('attack-spell risk state') || !playerText.includes('selected archive target')) throw new Error('Player Binder attack-risk simulation is incomplete');

    await systems.locator('.gi-systems-player__controls label').filter({ hasText: 'Known record' }).locator('select').selectOption('razor');
    const blockedText = (await systems.locator('.gi-systems-player__outcome').innerText()).toLowerCase();
    if (!blockedText.includes('blocks normal player-target assumptions')) throw new Error('Game Master player-target block is missing');

    await desktopControls.goto(`${base}/#/series/greed-island/island/game-masters`, { waitUntil: 'domcontentloaded' });
    await desktopControls.waitForSelector('.gi-systems[data-island-system-view="game-masters"]');
    systems = desktopControls.locator('.gi-systems');
    if (await systems.locator('.gi-systems-map, .gi-systems-locations, .gi-systems-quests, .gi-systems-player').count()) throw new Error('Inactive island systems remain mounted on the Game Masters route');
    await systems.locator('[data-gm-control="negative-card-console"]').click();
    const gmText = (await systems.locator('.gi-systems-gm__record').innerText()).toLowerCase();
    if (!gmText.includes('game master-only') || !gmText.includes('eliminate') || !gmText.includes('-003')) throw new Error('GM-only negative card console is incomplete');

    await systems.locator('[data-gm-control="razor-intruder-defense"]').click();
    const razorText = (await systems.locator('.gi-systems-gm__record').innerText()).toLowerCase();
    if (!razorText.includes('intruders') || !razorText.includes('eliminate')) throw new Error('Razor intruder defense control is incomplete');
  });
  await desktopControls.close();

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  await record('Island map mobile containment and reduced motion', mobile, async () => {
    await openSystems(mobile, base, 'map');
    const systems = mobile.locator('.gi-systems');
    await assertMapGeometry(systems, 'mobile');
    await systems.locator('.gi-systems__search input').fill('limeiro');
    await systems.locator('[data-location-id="limeiro"]').click();
    const mobileText = (await systems.innerText()).toLowerCase();
    if (!mobileText.includes('limeiro') || !mobileText.includes('capital')) throw new Error('Mobile map view did not expose Limeiro');

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

  const mobileLocations = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  await record('Location directory mobile containment', mobileLocations, async () => {
    await openSystems(mobileLocations, base, 'locations');
    const systems = mobileLocations.locator('.gi-systems');
    if (await systems.locator('[data-location-directory-id]').count() !== 9) throw new Error('Mobile location directory is incomplete');
    await systems.locator('[data-location-directory-id="starting-point"]').click();
    const panelText = (await systems.locator('.gi-systems-location-card').innerText()).toLowerCase();
    if (!panelText.includes('starting point') || !panelText.includes('entry zone')) throw new Error('Mobile Starting Point detail is incomplete');
    const overflow = await mobileLocations.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth);
    if (overflow > 1) throw new Error(`location directory overflowed mobile viewport by ${overflow}px`);
  });
  await mobileLocations.close();
} finally {
  await browser.close().catch(() => {});
  await new Promise((resolve) => server.close(resolve));
}

const summary = { generatedAt: new Date().toISOString(), checks: results.length, passed: results.length - failures.length, failed: failures.length };
await writeFile(path.join(output, 'systems-report.json'), `${JSON.stringify({ summary, results }, null, 2)}\n`);
await writeFile(path.join(output, 'systems-summary.json'), `${JSON.stringify(summary, null, 2)}\n`);
console.log(`\nGreed Island systems QA: ${summary.passed}/${summary.checks} browser checks passed.`);
if (failures.length) process.exitCode = 1;
