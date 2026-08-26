import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { access, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { routeManifest } from '../src/data/routeManifest.js';

const require = createRequire(import.meta.url);
const root = process.cwd();
const dist = path.join(root, 'dist/client');
const output = path.resolve(root, process.env.ACCESSIBILITY_QA_OUTPUT || '.accessibility-qa');
const playwrightSpecifier = process.env.PLAYWRIGHT_CORE_PATH || 'playwright-core';
const executablePath = process.env.CHROMIUM_PATH;
const selectedRoute = process.env.ACCESSIBILITY_QA_ROUTE || '';
const axePath = process.env.AXE_CORE_PATH || (() => {
  try { return require.resolve('axe-core/axe.min.js'); }
  catch { return ''; }
})();

const desktopViewport = { width: 1440, height: 1000 };
const routePath = ({ view, target }) => view === 'home' ? 'home/' : view === 'series' ? (target ? `series/${target}` : 'series/') : `${view}/${target}`;
const routes = routeManifest.map((route) => ({ ...route, path: routePath(route) }))
  .filter((route) => !selectedRoute || route.path === selectedRoute.replace(/^#?\/?/, ''));
const mime = {
  '.css': 'text/css; charset=utf-8', '.gif': 'image/gif', '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.jpeg': 'image/jpeg', '.jpg': 'image/jpeg', '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml',
  '.webp': 'image/webp', '.zip': 'application/zip',
};

if (!routes.length) throw new Error('No accessibility-QA route matched the requested filter.');
if (!axePath) throw new Error('Accessibility QA requires axe-core. Install it temporarily with "npm install --no-save axe-core", or set AXE_CORE_PATH to axe.min.js.');

const resolvePlaywright = async () => {
  try { return await import(playwrightSpecifier.startsWith('/') ? pathToFileURL(playwrightSpecifier).href : playwrightSpecifier); }
  catch (error) { throw new Error(`Accessibility QA requires playwright-core. Install it temporarily or set PLAYWRIGHT_CORE_PATH. (${error.message})`); }
};
const resolveBrowser = async () => {
  if (executablePath) return { executablePath, args: [] };
  try {
    const sparticuz = (await import('@sparticuz/chromium')).default;
    return { executablePath: await sparticuz.executablePath(), args: sparticuz.args };
  } catch {
    const candidates = process.platform === 'darwin'
      ? ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome']
      : process.platform === 'win32'
        ? ['C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe']
        : ['/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'];
    for (const candidate of candidates) {
      try { await access(candidate); return { executablePath: candidate, args: [] }; } catch { /* continue */ }
    }
    throw new Error('No Chromium executable was found. Set CHROMIUM_PATH or temporarily install @sparticuz/chromium.');
  }
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
  await page.waitForSelector('main', { timeout: 8_000 });
  await page.waitForFunction(() => !document.querySelector('.route-loading'), null, { timeout: 8_000 }).catch(() => {});
  await page.waitForTimeout(120);
};
const settleArchiveWorkspace = async (page, timeout = 30_000) => {
  await page.waitForSelector('main h1', { state: 'visible', timeout });
  await page.waitForSelector('.succession-archive__content[role="region"][aria-label]', { state: 'visible', timeout });
};

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
const { chromium } = await resolvePlaywright();
const browserConfig = await resolveBrowser();
const browser = await chromium.launch({
  headless: true,
  executablePath: browserConfig.executablePath,
  args: [...browserConfig.args, '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--no-zygote'],
});
const server = await serve();
const base = `http://127.0.0.1:${server.address().port}`;
const routeResults = [];
const interactionResults = [];
const page = await browser.newPage({ viewport: desktopViewport });

const recordInteraction = async (name, route, test) => {
  try {
    await page.setViewportSize(desktopViewport);
    await page.goto(`${base}/#/${route}`, { waitUntil: 'domcontentloaded', timeout: 15_000 });
    await settle(page);
    await test(page);
    interactionResults.push({ name, status: 'passed' });
    process.stdout.write(`✓ interaction ${name}\n`);
  } catch (error) {
    interactionResults.push({ name, status: 'failed', error: error.message });
    process.stdout.write(`✗ interaction ${name} · ${error.message}\n`);
  } finally { await page.goto('about:blank').catch(() => {}); }
};

try {
  await page.setViewportSize(desktopViewport);
  for (const route of routes) {
    try {
      await page.goto(`${base}/#/${route.path}`, { waitUntil: 'domcontentloaded', timeout: 15_000 });
      await settle(page);
      await page.addScriptTag({ path: axePath });
      const result = await page.evaluate(async () => globalThis.axe.run(document, {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] },
      }));
      const allViolations = result.violations.map((item) => ({
        id: item.id,
        impact: item.impact,
        help: item.help,
        nodes: item.nodes.map((node) => ({ target: node.target, html: node.html, failureSummary: node.failureSummary })),
      }));
      const contrastWarnings = allViolations.filter((item) => item.id === 'color-contrast');
      const violations = allViolations.filter((item) => item.id !== 'color-contrast');
      routeResults.push({ viewport: 'desktop', route: route.path, violations, contrastWarnings });
      process.stdout.write(`${violations.length ? '✗' : '✓'} desktop ${route.path}${violations.length ? ` · ${violations.map((item) => `${item.id}:${item.nodes.length}`).join(', ')}` : ''}${contrastWarnings.length ? ` · contrast warnings:${contrastWarnings.reduce((total, item) => total + item.nodes.length, 0)}` : ''}\n`);
    } catch (error) {
      routeResults.push({ viewport: 'desktop', route: route.path, error: error.message, violations: [], contrastWarnings: [] });
      process.stdout.write(`✗ desktop ${route.path} · ${error.message}\n`);
    } finally { await page.goto('about:blank').catch(() => {}); }
  }

  if (selectedRoute === '') {
    await recordInteraction('skip link moves focus to main', 'home/', async (page) => {
      await page.keyboard.press('Tab');
      if (!await page.locator('.skip-link').evaluate((node) => node === document.activeElement)) throw new Error('skip link did not receive first focus');
      await page.keyboard.press('Enter');
      if (!await page.locator('#main-content').evaluate((node) => node === document.activeElement)) throw new Error('main content did not receive focus');
    });
    await recordInteraction('archive search routes and autofocuses', 'home/', async (page) => {
      const trigger = page.locator('.header-search-button');
      await trigger.click();
      await page.waitForSelector('.succession-archive[data-archive-route="search"]', { timeout: 10_000 });
      const input = page.locator('.succession-search-workspace input');
      await input.waitFor({ state: 'visible', timeout: 10_000 });
      if (!await input.evaluate((node) => node === document.activeElement)) throw new Error('routed search input did not receive focus');
    });
    await recordInteraction('family-tree queen nodes activate with keyboard', 'succession/princes?view=tree', async (page) => {
      const queens = page.locator('.royal-map__queen-node');
      await queens.first().waitFor({ state: 'visible', timeout: 10_000 });
      if (await queens.count() < 2) throw new Error('family tree did not render multiple queen nodes');
      const nextQueen = queens.nth(1);
      await nextQueen.focus();
      if (!await nextQueen.evaluate((node) => node === document.activeElement)) throw new Error('queen node did not receive focus');
      await page.keyboard.press('Enter');
      if (await nextQueen.getAttribute('aria-pressed') !== 'true') throw new Error('keyboard activation did not pin the queen node');
    });
    await recordInteraction('Succession homepage navigation activates with keyboard', 'succession/story', async (page) => {
      const timelineLink = page.locator('.succession-command-home__rail nav a').filter({ hasText: 'Timeline' });
      await timelineLink.waitFor({ state: 'visible', timeout: 10_000 });
      await timelineLink.focus();
      if (!await timelineLink.evaluate((node) => node === document.activeElement)) throw new Error('homepage Timeline link did not receive focus');
      await page.keyboard.press('Enter');
      await page.waitForSelector('.succession-archive[data-archive-route="timeline"][data-archive-hub="story"]', { timeout: 10_000 });
      await page.waitForFunction(() => document.activeElement?.id === 'succession-workspace-content');
    });
    await recordInteraction('chapter workspace cards activate with keyboard', 'succession/chapters', async (page) => {
      // Chapters is one of the heaviest archive surfaces. Wait for the semantic workspace
      // contract before probing its controls so cold module compilation cannot masquerade as
      // a keyboard failure on slower runners.
      await settleArchiveWorkspace(page);
      const opener = page.locator('.succession-chapter-command__card.is-documented:not([aria-current="page"])').first();
      await opener.waitFor({ state: 'visible', timeout: 30_000 });
      const chapter = (await opener.locator('.succession-chapter-command__number').innerText()).trim();
      await opener.focus();
      if (!await opener.evaluate((node) => node === document.activeElement)) throw new Error('chapter card did not receive focus');
      await page.keyboard.press('Enter');
      const selectedCard = page.locator(`.succession-chapter-command__card[aria-current="page"] .succession-chapter-command__number`).filter({ hasText: chapter });
      await selectedCard.waitFor({ state: 'visible', timeout: 30_000 });
    });
    await recordInteraction('Black Whale manifest accepts keyboard focus', 'succession/black-whale', async (page) => {
      const manifest = page.locator('.ship-manifest__table-wrap');
      await manifest.focus();
      if (!await manifest.evaluate((node) => node === document.activeElement)) throw new Error('manifest scroll region did not receive focus');
    });
  }
} finally {
  await page.close().catch(() => {});
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}

const failedRoutes = routeResults.filter((row) => row.error || row.violations.length);
const failedInteractions = interactionResults.filter((row) => row.status === 'failed');
const contrastWarningCount = routeResults.reduce((total, row) => total + (row.contrastWarnings || []).reduce((nodes, item) => total + item.nodes.length, 0), 0);
const contrastWarningRoutes = routeResults.filter((row) => row.contrastWarnings?.length).length;
const summary = {
  generatedAt: new Date().toISOString(),
  routeChecks: routeResults.length,
  routePasses: routeResults.length - failedRoutes.length,
  interactionChecks: interactionResults.length,
  interactionPasses: interactionResults.length - failedInteractions.length,
  contrastWarningRoutes,
  contrastWarningCount,
  contrastWarningsBlockBuild: false,
  failed: failedRoutes.length + failedInteractions.length,
};
await writeFile(path.join(output, 'report.json'), `${JSON.stringify({ summary, routes: routeResults, interactions: interactionResults }, null, 2)}\n`);
console.log(`\nDesktop accessibility QA: ${summary.routePasses}/${summary.routeChecks} route renders and ${summary.interactionPasses}/${summary.interactionChecks} keyboard flows passed. Contrast warnings: ${contrastWarningCount} node(s) across ${contrastWarningRoutes} render(s), reported but deferred to the design-system contrast batch.`);
if (summary.failed) process.exitCode = 1;
