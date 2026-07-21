import { createServer } from 'node:http';
import { access, mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const root = process.cwd();
const dist = path.join(root, 'dist/client');
const output = path.resolve(root, process.env.GREED_ISLAND_COMPLETION_QA_OUTPUT || '.greed-island-completion-qa');
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
    const screenshot = path.join(output, `completion-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`);
    await page.screenshot({ path: screenshot, fullPage: true }).catch(() => {});
    const failure = { name, status: 'failed', error: error.message, screenshot: path.relative(root, screenshot), runtimeErrors };
    failures.push(failure);
    results.push(failure);
    process.stdout.write(`✗ ${name} · ${error.message}\n`);
  }
};

const openCompletion = async (page, base) => {
  await page.goto(`${base}/#/series/greed-island`, { waitUntil: 'domcontentloaded', timeout: 20_000 });
  await page.waitForSelector('.gi-completion', { timeout: 15_000 });
  await page.waitForFunction(() => !document.querySelector('.route-loading'), null, { timeout: 12_000 }).catch(() => {});
  await page.locator('.gi-completion').scrollIntoViewIfNeeded();
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
  await record('Completion quiz and reward sequence', desktop, async () => {
    await openCompletion(desktop, base);
    const completion = desktop.locator('.gi-completion');
    const metrics = await completion.locator('.gi-completion__metrics').innerText();
    if (!metrics.includes('5') || !metrics.includes('3') || !metrics.includes('6')) throw new Error(`Completion metrics are incomplete: ${metrics}`);

    const board = await completion.locator('.gi-completion-quiz__board').innerText();
    if (!board.includes('001–099') || !board.includes('100') || !board.includes('87/100') || !board.includes('000')) throw new Error('Quiz board does not expose the verified completion facts');

    await completion.locator('[data-quiz-record="quiz-content-boundary"]').click();
    const boundaryText = (await completion.locator('.gi-completion-record').innerText()).toLowerCase();
    if (!boundaryText.includes('does not invent') || !boundaryText.includes('100 questions')) throw new Error('Quiz transcript boundary is not visible');

    await completion.locator('[data-completion-tab="rewards"]').click();
    await completion.locator('[data-reward-step="paladins-necklace-conversion"]').click();
    const rewardText = (await completion.locator('.gi-completion-rewards').innerText()).toLowerCase();
    if (!rewardText.includes('paladin') || !rewardText.includes('plot of beach') || !rewardText.includes('accompany') || !rewardText.includes('1039')) throw new Error('Reward sequence does not expose Paladin’s Necklace / Accompany route');
    if (await completion.locator('a', { hasText: 'Open completion source' }).count() < 1) throw new Error('Completion source link is missing');
  });
  await desktop.close();

  const routePage = await browser.newPage({ viewport: { width: 1366, height: 920 } });
  await record('Post-clear route fork and adaptation archive', routePage, async () => {
    await openCompletion(routePage, base);
    const completion = routePage.locator('.gi-completion');

    await completion.locator('[data-completion-tab="route"]').click();
    await completion.locator('[data-route-choice="magnetic-force-to-ging"]').click();
    const magneticText = (await completion.locator('.gi-completion-route').innerText()).toLowerCase();
    if (!magneticText.includes('magnetic force') || !magneticText.includes('ging') || !magneticText.includes('one-on-one')) throw new Error('Magnetic Force route to Ging is incomplete');

    await completion.locator('[data-route-choice="accompany-to-kite"]').click();
    const accompanyText = (await completion.locator('.gi-completion-route').innerText()).toLowerCase();
    if (!accompanyText.includes('accompany') || !accompanyText.includes('kite') || !accompanyText.includes('killua')) throw new Error('Accompany route to Kite is incomplete');
    if (!accompanyText.includes('chimera ant')) throw new Error('Kite handoff does not connect to the next route');

    await completion.locator('[data-completion-tab="adaptation"]').click();
    await completion.locator('[data-adaptation-record="manga-chapter-185"]').click();
    const adaptationText = (await completion.locator('.gi-completion-adaptation').innerText()).toLowerCase();
    if (!adaptationText.includes('chapter 185') || !adaptationText.includes('elena') || !adaptationText.includes('route-fork')) throw new Error('Chapter 185 adaptation record is incomplete');
  });
  await routePage.close();

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  await record('Completion release review mobile containment and reduced motion', mobile, async () => {
    await openCompletion(mobile, base);
    const completion = mobile.locator('.gi-completion');
    await completion.locator('[data-completion-tab="release"]').click();
    const releaseText = (await completion.locator('.gi-completion-release').innerText()).toLowerCase();
    if (!releaseText.includes('full browser qa') || !releaseText.includes('deployment') || !releaseText.includes('not called live')) throw new Error('Release review gates are incomplete');

    await completion.locator('.gi-completion__search input').fill('deployment');
    const filtered = (await completion.locator('.gi-completion__filters').innerText()).toLowerCase();
    if (!filtered.includes('1 matching release review records')) throw new Error(`Release search did not isolate deployment gate: ${filtered}`);

    const state = await mobile.evaluate(() => {
      const completion = document.querySelector('.gi-completion');
      const tab = document.querySelector('.gi-completion__tabs button');
      return {
        overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
        reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
        width: completion?.getBoundingClientRect().width || 0,
        transition: tab ? getComputedStyle(tab).transitionDuration : '',
      };
    });
    if (state.overflow > 1) throw new Error(`completion archive overflowed mobile viewport by ${state.overflow}px`);
    if (!state.reducedMotion) throw new Error('reduced-motion emulation was not active');
    if (state.width > 390.5) throw new Error(`completion section exceeds mobile viewport at ${state.width}px`);
    const durations = state.transition.split(',').map((value) => Number.parseFloat(value)).filter(Number.isFinite);
    if (durations.some((duration) => duration > 0.001)) throw new Error(`completion transition remains ${state.transition} under reduced motion`);
  });
  await mobile.close();
} finally {
  await browser.close().catch(() => {});
  await new Promise((resolve) => server.close(resolve));
}

const summary = { generatedAt: new Date().toISOString(), checks: results.length, passed: results.length - failures.length, failed: failures.length };
await writeFile(path.join(output, 'completion-report.json'), `${JSON.stringify({ summary, results }, null, 2)}\n`);
await writeFile(path.join(output, 'completion-summary.json'), `${JSON.stringify(summary, null, 2)}\n`);
console.log(`\nGreed Island completion QA: ${summary.passed}/${summary.checks} browser checks passed.`);
if (failures.length) process.exitCode = 1;
