import { createServer } from 'node:http';
import { access, mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const root = process.cwd();
const dist = path.join(root, 'dist/client');
const output = path.resolve(root, process.env.GREED_ISLAND_ROUTING_QA_OUTPUT || '.greed-island-routing-qa');
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
    const screenshot = path.join(output, `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`);
    await page.screenshot({ path: screenshot, fullPage: true }).catch(() => {});
    const failure = { name, status: 'failed', error: error.message, screenshot: path.relative(root, screenshot), runtimeErrors };
    failures.push(failure);
    results.push(failure);
    process.stdout.write(`✗ ${name} · ${error.message}\n`);
  }
};

const activeHeavySelectors = '.gi-eta-course, .gi-binder-section, .gi-card-archive, .gi-card-libraries, .gi-systems, .gi-tactical, .gi-completion, .gi-sources';
const waitForModule = async (page, module) => {
  await page.waitForSelector(`.greed-island-page[data-greed-island-active-module="${module}"]`, { timeout: 15_000 });
  await page.waitForFunction(() => !document.querySelector('.route-loading') && !document.querySelector('.gi-app__loading'), null, { timeout: 15_000 }).catch(() => {});
};

await mkdir(output, { recursive: true });
const executablePath = await firstAvailable([requestedExecutable, chromium.executablePath(), '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser']);
if (!executablePath) throw new Error('No Chromium executable is available.');
const browser = await chromium.launch({ headless: true, executablePath, args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--no-zygote'] });
const server = await serve();
const base = `http://127.0.0.1:${server.address().port}`;

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await record('Hub mounts no heavy Greed Island module', page, async () => {
    await page.goto(`${base}/#/series/greed-island`, { waitUntil: 'domcontentloaded', timeout: 20_000 });
    await waitForModule(page, 'home');
    if (await page.locator('.gi-hub').count() !== 1) throw new Error('Lightweight Greed Island hub is missing.');
    if (await page.locator(activeHeavySelectors).count()) throw new Error('The hub mounted a heavy Greed Island module.');
    if (await page.locator('[data-gi-open-module]').count() !== 7) throw new Error('The hub does not expose seven module choices.');
  });

  await record('Module navigation unmounts previous experience', page, async () => {
    await page.locator('[data-gi-open-module="binder"]').click();
    await waitForModule(page, 'binder');
    if (!page.url().includes('/greed-island/binder')) throw new Error(`Binder URL is incorrect: ${page.url()}`);
    if (await page.locator('.gi-binder-section').count() !== 1) throw new Error('Binder route did not mount Binder.');
    if (await page.locator('.gi-eta-course, .gi-card-archive, .gi-card-libraries, .gi-systems, .gi-tactical, .gi-completion').count()) throw new Error('Binder route retained another heavy module.');

    await page.locator('[data-gi-module-nav="eta"]').click();
    await waitForModule(page, 'eta');
    if (!page.url().includes('/greed-island/eta')) throw new Error(`Eta URL is incorrect: ${page.url()}`);
    if (await page.locator('.gi-eta-course').count() !== 1) throw new Error('Eta route did not mount the tutorial.');
    if (await page.locator('.gi-binder-section').count()) throw new Error('Binder remained mounted after navigating to Eta.');

    await page.goBack({ waitUntil: 'domcontentloaded' });
    await waitForModule(page, 'binder');
    if (await page.locator('.gi-binder-section').count() !== 1 || await page.locator('.gi-eta-course').count()) throw new Error('Browser Back did not restore Binder exclusively.');
    await page.goForward({ waitUntil: 'domcontentloaded' });
    await waitForModule(page, 'eta');
    if (await page.locator('.gi-eta-course').count() !== 1 || await page.locator('.gi-binder-section').count()) throw new Error('Browser Forward did not restore Eta exclusively.');
  });
  await page.close();

  const direct = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await record('Nested direct links preserve subviews', direct, async () => {
    const cases = [
      ['cards/game-master', 'cards', 'game-master', '.gi-card-libraries[data-card-library="gm"]'],
      ['island/game-masters', 'island', 'game-masters', '.gi-systems[data-island-system-view="game-masters"]'],
      ['tactics/final-battles', 'tactics', 'final-battles', '.gi-tactical[data-tactical-collection="battles"]'],
      ['completion/route', 'completion', 'route', '.gi-completion[data-completion-collection="route"]'],
      ['sources', 'sources', '', '.gi-sources[data-greed-island-module="sources"]'],
    ];
    for (const [route, module, subview, selector] of cases) {
      await direct.goto(`${base}/#/series/greed-island/${route}`, { waitUntil: 'domcontentloaded', timeout: 20_000 });
      await waitForModule(direct, module);
      await direct.waitForSelector(selector, { timeout: 15_000 });
      const shellSubview = await direct.locator('.greed-island-page').getAttribute('data-greed-island-active-subview');
      if (shellSubview !== subview) throw new Error(`${route} resolved to subview “${shellSubview}” instead of “${subview}”.`);
    }
  });
  await direct.close();

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  await record('Mobile module drawer stays contained', mobile, async () => {
    await mobile.goto(`${base}/#/series/greed-island`, { waitUntil: 'domcontentloaded', timeout: 20_000 });
    await waitForModule(mobile, 'home');
    await mobile.locator('.gi-app__mobile-menu').click();
    const state = await mobile.evaluate(() => {
      const nav = document.querySelector('.gi-app__nav');
      return {
        overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
        navLeft: nav?.getBoundingClientRect().left || 0,
        navRight: nav?.getBoundingClientRect().right || 0,
        reduced: matchMedia('(prefers-reduced-motion: reduce)').matches,
      };
    });
    if (state.overflow > 1 || state.navLeft < -0.5 || state.navRight > 390.5) throw new Error(`Mobile module drawer escaped the viewport: ${JSON.stringify(state)}.`);
    if (!state.reduced) throw new Error('Reduced-motion emulation was not active.');
  });
  await mobile.close();
} finally {
  await browser.close().catch(() => {});
  await new Promise((resolve) => server.close(resolve));
}

const summary = { generatedAt: new Date().toISOString(), checks: results.length, passed: results.length - failures.length, failed: failures.length };
await writeFile(path.join(output, 'routing-report.json'), `${JSON.stringify({ summary, results }, null, 2)}\n`);
await writeFile(path.join(output, 'routing-summary.json'), `${JSON.stringify(summary, null, 2)}\n`);
console.log(`\nGreed Island routing QA: ${summary.passed}/${summary.checks} browser checks passed.`);
if (failures.length) process.exitCode = 1;
