import { createServer } from 'node:http';
import { access, mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const root = process.cwd();
const dist = path.join(root, 'dist/client');
const output = path.resolve(root, process.env.GREED_ISLAND_TACTICS_QA_OUTPUT || '.greed-island-tactics-qa');
const requestedExecutable = process.env.CHROMIUM_PATH || '';
const results = [];
const failures = [];
const mime = { '.css': 'text/css; charset=utf-8', '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.json': 'application/json; charset=utf-8' };

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
    const screenshot = path.join(output, `tactics-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`);
    await page.screenshot({ path: screenshot, fullPage: true }).catch(() => {});
    const failure = { name, status: 'failed', error: error.message, screenshot: path.relative(root, screenshot), runtimeErrors };
    failures.push(failure);
    results.push(failure);
    process.stdout.write(`✗ ${name} · ${error.message}\n`);
  }
};

const openTactics = async (page, base) => {
  await page.goto(`${base}/#/series/greed-island`, { waitUntil: 'domcontentloaded', timeout: 20_000 });
  await page.waitForSelector('.gi-tactical', { timeout: 15_000 });
  await page.waitForFunction(() => !document.querySelector('.route-loading'), null, { timeout: 12_000 }).catch(() => {});
  await page.locator('.gi-tactical').scrollIntoViewIfNeeded();
};

await mkdir(output, { recursive: true });
const executablePath = await firstAvailable([requestedExecutable, chromium.executablePath(), '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser']);
if (!executablePath) throw new Error('No Chromium executable is available.');

const browser = await chromium.launch({ headless: true, executablePath, args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--no-zygote'] });
const server = await serve();
const base = `http://127.0.0.1:${server.address().port}`;

try {
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await record('Biscuit training and Razor replay', desktop, async () => {
    await openTactics(desktop, base);
    const tactics = desktop.locator('.gi-tactical');
    const metrics = await tactics.locator('.gi-tactical__metrics').innerText();
    if (!metrics.includes('5') || !metrics.includes('6') || !metrics.includes('3')) throw new Error(`Tactical metrics are incomplete: ${metrics}`);

    await tactics.locator('[data-training-module="gyo-feint-read"]').click();
    const trainingText = (await tactics.locator('.gi-tactical-record').innerText()).toLowerCase();
    if (!trainingText.includes('little flower') || !trainingText.includes('gyo')) throw new Error('Gyo/Little Flower training record is incomplete');

    await tactics.locator('.gi-tactical__tabs button').filter({ hasText: 'Razor dodgeball replay' }).click();
    await tactics.locator('[data-dodgeball-phase="eight-player-rule"]').click();
    const ruleText = (await tactics.locator('.gi-tactical-record').innerText()).toLowerCase();
    if (!ruleText.includes('eight players') || !ruleText.includes('outside')) throw new Error('Eight-player dodgeball rule record is incomplete');
    await tactics.locator('[data-dodgeball-phase="razor-out-of-bounds"]').click();
    const finishText = (await tactics.locator('.gi-tactical-record').innerText()).toLowerCase();
    if (!finishText.includes('bungee gum') || !finishText.includes('out of bounds')) throw new Error('Razor finish record is incomplete');
  });
  await desktop.close();

  const desktopBomber = await browser.newPage({ viewport: { width: 1366, height: 920 } });
  await record('Bomber conditions and final battle split', desktopBomber, async () => {
    await openTactics(desktopBomber, base);
    const tactics = desktopBomber.locator('.gi-tactical');
    await tactics.locator('.gi-tactical__tabs button').filter({ hasText: 'Bomber system' }).click();
    await tactics.locator('[data-bomber-mechanic="countdown-conditions"]').click();
    const countdown = (await tactics.locator('.gi-tactical-record').innerText()).toLowerCase();
    if (!countdown.includes('touch') || !countdown.includes('bomber') || !countdown.includes('explanation')) throw new Error('Countdown condition record is incomplete');

    let status = (await tactics.locator('.gi-tactical-bomber__sim [role="status"]').innerText()).toLowerCase();
    if (!status.includes('remains dangerous')) throw new Error('Initial Countdown state should remain dangerous');
    await tactics.locator('.gi-tactical-bomber__sim label').filter({ hasText: 'Victim touches Genthru' }).locator('input').check();
    await tactics.locator('.gi-tactical-bomber__sim label').filter({ hasText: 'I caught the Bomber' }).locator('input').check();
    status = (await tactics.locator('.gi-tactical-bomber__sim [role="status"]').innerText()).toLowerCase();
    if (!status.includes('countdown disarmed') || !status.includes('release is blocked')) throw new Error(`Disarm simulation failed: ${status}`);

    await tactics.locator('.gi-tactical__tabs button').filter({ hasText: 'Final battle split' }).click();
    await tactics.locator('[data-final-battle="gon-vs-genthru"]').click();
    const gonText = (await tactics.locator('.gi-tactical-record').innerText()).toLowerCase();
    if (!gonText.includes('gasoline') || !gonText.includes('pitfall') || !gonText.includes('rock')) throw new Error('Gon vs Genthru battle record is incomplete');
    await tactics.locator('[data-final-battle="killua-vs-sub"]').click();
    const killuaText = (await tactics.locator('.gi-tactical-record').innerText()).toLowerCase();
    if (!killuaText.includes('split') || !killuaText.includes('sub')) throw new Error('Killua vs Sub battle record is incomplete');
  });
  await desktopBomber.close();

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  await record('Tactical records mobile containment and reduced motion', mobile, async () => {
    await openTactics(mobile, base);
    const tactics = mobile.locator('.gi-tactical');
    await tactics.locator('.gi-tactical__tabs button').filter({ hasText: 'Bomber system' }).click();
    await tactics.locator('[data-bomber-mechanic="caught-bomber-disarm"]').click();
    const mobileText = (await tactics.innerText()).toLowerCase();
    if (!mobileText.includes('caught the bomber') || !mobileText.includes('archive simulation')) throw new Error('Mobile tactical view did not expose Bomber disarm boundary');

    const state = await mobile.evaluate(() => {
      const tactics = document.querySelector('.gi-tactical');
      const tab = document.querySelector('.gi-tactical__tabs button');
      return {
        overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
        reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
        width: tactics?.getBoundingClientRect().width || 0,
        transition: tab ? getComputedStyle(tab).transitionDuration : '',
      };
    });
    if (state.overflow > 1) throw new Error(`tactical records overflowed mobile viewport by ${state.overflow}px`);
    if (!state.reducedMotion) throw new Error('reduced-motion emulation was not active');
    if (state.width > 390.5) throw new Error(`tactical section exceeds mobile viewport at ${state.width}px`);
    const durations = state.transition.split(',').map((value) => Number.parseFloat(value)).filter(Number.isFinite);
    if (durations.some((duration) => duration > 0.001)) throw new Error(`tactical transition remains ${state.transition} under reduced motion`);
  });
  await mobile.close();
} finally {
  await browser.close().catch(() => {});
  await new Promise((resolve) => server.close(resolve));
}

const summary = { generatedAt: new Date().toISOString(), checks: results.length, passed: results.length - failures.length, failed: failures.length };
await writeFile(path.join(output, 'tactics-report.json'), `${JSON.stringify({ summary, results }, null, 2)}\n`);
await writeFile(path.join(output, 'tactics-summary.json'), `${JSON.stringify(summary, null, 2)}\n`);
console.log(`\nGreed Island tactical QA: ${summary.passed}/${summary.checks} browser checks passed.`);
if (failures.length) process.exitCode = 1;
