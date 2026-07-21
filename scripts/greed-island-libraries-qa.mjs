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
    const screenshot = path.join(output, `libraries-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`);
    await page.screenshot({ path: screenshot, fullPage: true }).catch(() => {});
    const failure = { name, status: 'failed', error: error.message, screenshot: path.relative(root, screenshot), runtimeErrors };
    failures.push(failure);
    results.push(failure);
    process.stdout.write(`✗ ${name} · ${error.message}\n`);
  }
};

const openLibraries = async (page, base, collection = 'spells') => {
  await page.goto(`${base}/#/series/greed-island/cards/${collection}`, { waitUntil: 'domcontentloaded', timeout: 20_000 });
  await page.waitForSelector('.gi-card-libraries', { timeout: 15_000 });
  await page.waitForFunction(() => !document.querySelector('.route-loading'), null, { timeout: 12_000 }).catch(() => {});
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
  await record('Card libraries search, classes, spell route, and spell lab', desktop, async () => {
    await openLibraries(desktop, base, 'spells');
    const library = desktop.locator('.gi-card-libraries');
    if ((await library.getAttribute('data-card-library')) !== 'spell') throw new Error('Spell route did not select the Spell Card collection');
    const metrics = await library.locator('.gi-card-libraries__metrics').innerText();
    if (!metrics.includes('40') || !metrics.includes('20') || !metrics.includes('4')) throw new Error(`library metrics are incomplete: ${metrics}`);
    if (await library.locator('.gi-card-libraries__results button').count() !== 40) throw new Error('Spell library does not expose 40 records by default');

    await library.locator('.gi-card-libraries__search input').fill('Mug');
    await library.locator('.gi-card-libraries__results button').filter({ hasText: 'Mug' }).click();
    const mug = (await library.locator('.gi-card-libraries__record').innerText()).toLowerCase();
    if (!mug.includes('take one chosen card') || !mug.includes('attack spell')) throw new Error('Mug record is missing attack details');

    await library.locator('.gi-card-libraries__search input').fill('');
    await library.locator('label').filter({ hasText: 'Class' }).locator('select').selectOption('AS');
    if (await library.locator('.gi-card-libraries__results button').count() !== 10) throw new Error('Attack Spell class filter did not return 10 records');
    await library.locator('label').filter({ hasText: 'Class' }).locator('select').selectOption('all');

    const lab = library.locator('.gi-card-libraries__lab');
    await lab.locator('select').nth(0).selectOption('1029');
    await lab.locator('select').nth(1).selectOption('1035');
    const protectedOutcome = (await lab.locator('.gi-card-libraries__outcome').innerText()).toLowerCase();
    if (!protectedOutcome.includes('15-second') || !protectedOutcome.includes('fortress')) throw new Error('Spell lab does not apply Fortress in the response window');
    await lab.locator('input[type="checkbox"]').uncheck();
    const closedOutcome = (await lab.locator('.gi-card-libraries__outcome').innerText()).toLowerCase();
    if (!closedOutcome.includes('binder closed')) throw new Error('Spell lab does not explain closed-Binder behavior');
  });
  await desktop.close();

  const freeAndGm = await browser.newPage({ viewport: { width: 1280, height: 940 } });
  await record('Free Slot and Game Master direct route boundaries', freeAndGm, async () => {
    await openLibraries(freeAndGm, base, 'free-slot');
    let library = freeAndGm.locator('.gi-card-libraries');
    if ((await library.getAttribute('data-card-library')) !== 'free') throw new Error('Free Slot route did not select the documented Free Slot collection');
    if (await library.locator('.gi-card-libraries__results button').count() !== 20) throw new Error('Free Slot library does not expose 20 documented records');
    if (await library.locator('.gi-card-libraries__lab').count()) throw new Error('Spell lab remained mounted on the Free Slot route');
    await library.locator('.gi-card-libraries__search input').fill('Chidon');
    await library.locator('.gi-card-libraries__results button').filter({ hasText: 'Chidon' }).click();
    const chidon = (await library.locator('.gi-card-libraries__record').innerText()).toLowerCase();
    if (!chidon.includes('chapter 172') || !chidon.includes('fish')) throw new Error('Chidon record lost its documented debut/effect boundary');

    await freeAndGm.goto(`${base}/#/series/greed-island/cards/game-master`, { waitUntil: 'domcontentloaded' });
    await freeAndGm.waitForSelector('.gi-card-libraries[data-card-library="gm"]');
    library = freeAndGm.locator('.gi-card-libraries');
    if (await library.locator('.gi-card-libraries__results button').count() !== 4) throw new Error('GM library does not expose four records');
    if (await library.locator('.gi-card-libraries__lab').count()) throw new Error('Spell lab remained mounted on the Game Master route');
    await library.locator('.gi-card-libraries__results button').filter({ hasText: 'Eliminate' }).click();
    const eliminate = (await library.locator('.gi-card-libraries__record').innerText()).toLowerCase();
    if (!eliminate.includes('game master only') || !eliminate.includes('azian continent')) throw new Error('Eliminate record lost restricted-access boundary');
    if (await library.locator('a', { hasText: 'Open table source' }).count() < 1) throw new Error('Library source link is missing');
  });
  await freeAndGm.close();

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  await record('Card libraries mobile containment and reduced motion', mobile, async () => {
    await openLibraries(mobile, base, 'spells');
    const state = await mobile.evaluate(() => {
      const library = document.querySelector('.gi-card-libraries');
      const recordPanel = document.querySelector('.gi-card-libraries__record');
      return {
        overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
        reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
        libraryWidth: library?.getBoundingClientRect().width || 0,
        recordWidth: recordPanel?.getBoundingClientRect().width || 0,
      };
    });
    if (state.overflow > 1) throw new Error(`card libraries overflowed mobile viewport by ${state.overflow}px`);
    if (!state.reducedMotion) throw new Error('reduced-motion emulation was not active');
    if (state.libraryWidth > 390.5 || state.recordWidth > 390.5) throw new Error(`library panels exceed mobile width: ${JSON.stringify(state)}`);
  });
  await mobile.close();
} finally {
  await browser.close().catch(() => {});
  await new Promise((resolve) => server.close(resolve));
}

const summary = { generatedAt: new Date().toISOString(), checks: results.length, passed: results.length - failures.length, failed: failures.length };
await writeFile(path.join(output, 'libraries-report.json'), `${JSON.stringify({ summary, results }, null, 2)}\n`);
await writeFile(path.join(output, 'libraries-summary.json'), `${JSON.stringify(summary, null, 2)}\n`);
console.log(`\nGreed Island card libraries QA: ${summary.passed}/${summary.checks} browser checks passed.`);
if (failures.length) process.exitCode = 1;
