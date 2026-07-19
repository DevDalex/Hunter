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
const selectedViewport = process.env.ACCESSIBILITY_QA_VIEWPORT || 'all';
const axePath = process.env.AXE_CORE_PATH || (() => {
  try { return require.resolve('axe-core/axe.min.js'); }
  catch { return ''; }
})();

const viewports = [
  { id: 'desktop', width: 1440, height: 1000 },
  { id: 'mobile', width: 390, height: 844 },
].filter((item) => selectedViewport === 'all' || item.id === selectedViewport);
const routePath = ({ view, target }) => view === 'home' ? 'home/' : view === 'series' ? (target ? `series/${target}` : 'series/') : `${view}/${target}`;
const routes = routeManifest.map((route) => ({ ...route, path: routePath(route) }))
  .filter((route) => !selectedRoute || route.path === selectedRoute.replace(/^#?\/?/, ''));
const mime = {
  '.css': 'text/css; charset=utf-8', '.gif': 'image/gif', '.html': 'text/html; charset=utf-8',
  '.jpeg': 'image/jpeg', '.jpg': 'image/jpeg', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml',
  '.webp': 'image/webp', '.zip': 'application/zip',
};

if (!routes.length || !viewports.length) throw new Error('No accessibility-QA route or viewport matched the requested filter.');
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
const page = await browser.newPage({ viewport: { width: viewports[0].width, height: viewports[0].height } });

const recordInteraction = async (name, viewport, route, test) => {
  try {
    await page.setViewportSize(viewport);
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
  for (const viewport of viewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    for (const route of routes) {
      try {
        await page.goto(`${base}/#/${route.path}`, { waitUntil: 'domcontentloaded', timeout: 15_000 });
        await settle(page);
        await page.addScriptTag({ path: axePath });
        const result = await page.evaluate(async () => globalThis.axe.run(document, {
          runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] },
        }));
        const violations = result.violations.map((item) => ({
          id: item.id,
          impact: item.impact,
          help: item.help,
          nodes: item.nodes.map((node) => ({ target: node.target, html: node.html, failureSummary: node.failureSummary })),
        }));
        routeResults.push({ viewport: viewport.id, route: route.path, violations });
        process.stdout.write(`${violations.length ? '✗' : '✓'} ${viewport.id.padEnd(7)} ${route.path}${violations.length ? ` · ${violations.map((item) => `${item.id}:${item.nodes.length}`).join(', ')}` : ''}\n`);
      } catch (error) {
        routeResults.push({ viewport: viewport.id, route: route.path, error: error.message, violations: [] });
        process.stdout.write(`✗ ${viewport.id.padEnd(7)} ${route.path} · ${error.message}\n`);
      } finally { await page.goto('about:blank').catch(() => {}); }
    }
  }

  if (selectedRoute === '' && selectedViewport === 'all') {
    await recordInteraction('skip link moves focus to main', { width: 1440, height: 1000 }, 'home/', async (page) => {
      await page.keyboard.press('Tab');
      if (!await page.locator('.skip-link').evaluate((node) => node === document.activeElement)) throw new Error('skip link did not receive first focus');
      await page.keyboard.press('Enter');
      if (!await page.locator('#main-content').evaluate((node) => node === document.activeElement)) throw new Error('main content did not receive focus');
    });
    await recordInteraction('archive search traps and restores focus', { width: 1440, height: 1000 }, 'home/', async (page) => {
      const trigger = page.locator('.header-search-button');
      await trigger.click();
      await page.waitForSelector('.archive-search-dialog[role="dialog"]');
      if (!await page.locator('.archive-search-input input').evaluate((node) => node === document.activeElement)) throw new Error('search input did not receive focus');
      await page.keyboard.press('Escape');
      await page.waitForSelector('.archive-search-dialog', { state: 'detached' });
      if (!await trigger.evaluate((node) => node === document.activeElement)) throw new Error('search trigger did not regain focus');
    });
    await recordInteraction('mobile-browser menu contains and restores focus', { width: 390, height: 844 }, 'home/', async (page) => {
      const trigger = page.locator('.mobile-menu-button');
      await trigger.click();
      await page.waitForFunction(() => document.activeElement?.matches('.header-links a'));
      await page.keyboard.press('Shift+Tab');
      if (!await trigger.evaluate((node) => node === document.activeElement)) throw new Error('Shift+Tab escaped the open menu');
      await page.keyboard.press('Tab');
      if (!await page.locator('.header-links a').first().evaluate((node) => node === document.activeElement)) throw new Error('Tab did not wrap to the first menu link');
      await page.keyboard.press('Escape');
      if (await trigger.getAttribute('aria-expanded') !== 'false') throw new Error('Escape did not close the menu');
      if (!await trigger.evaluate((node) => node === document.activeElement)) throw new Error('menu trigger did not regain focus');
    });
    await recordInteraction('family-tree tabs support arrow keys', { width: 1440, height: 1000 }, 'succession/family-tree', async (page) => {
      await page.locator('#tree-tab-royal').focus();
      await page.keyboard.press('ArrowRight');
      if (await page.locator('#tree-tab-political').getAttribute('aria-selected') !== 'true') throw new Error('political tree did not activate');
      if (!await page.locator('#tree-tab-political').evaluate((node) => node === document.activeElement)) throw new Error('focus did not move with the family-tree tab');
    });
    await recordInteraction('grouped Succession sections support arrow keys', { width: 1440, height: 1000 }, 'succession/beasts', async (page) => {
      const tabs = page.locator('.section-tabs button');
      await tabs.nth(0).focus();
      await page.keyboard.press('ArrowRight');
      await page.waitForSelector('.section-tabs button[aria-current="page"]');
      if (await tabs.nth(1).getAttribute('aria-current') !== 'page') throw new Error('the next grouped view did not activate');
      if (!await tabs.nth(1).evaluate((node) => node === document.activeElement)) throw new Error('focus did not move with the grouped view');
    });
    await recordInteraction('chapter drawer traps and restores focus', { width: 1440, height: 1000 }, 'series/chapters', async (page) => {
      const opener = page.locator('.chapter-row').first();
      await opener.focus();
      await opener.click();
      await page.waitForSelector('.chapter-drawer[role="dialog"]');
      if (!await page.locator('.chapter-drawer__top button').evaluate((node) => node === document.activeElement)) throw new Error('drawer close button did not receive focus');
      await page.keyboard.press('Escape');
      await page.waitForSelector('.chapter-drawer', { state: 'detached' });
      if (!await opener.evaluate((node) => node === document.activeElement)) throw new Error('chapter opener did not regain focus');
    });
    await recordInteraction('Black Whale manifest accepts keyboard focus', { width: 390, height: 844 }, 'succession/black-whale', async (page) => {
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
const summary = {
  generatedAt: new Date().toISOString(),
  routeChecks: routeResults.length,
  routePasses: routeResults.length - failedRoutes.length,
  interactionChecks: interactionResults.length,
  interactionPasses: interactionResults.length - failedInteractions.length,
  failed: failedRoutes.length + failedInteractions.length,
};
await writeFile(path.join(output, 'report.json'), `${JSON.stringify({ summary, routes: routeResults, interactions: interactionResults }, null, 2)}\n`);
console.log(`\nAccessibility QA: ${summary.routePasses}/${summary.routeChecks} route/viewport renders and ${summary.interactionPasses}/${summary.interactionChecks} keyboard flows passed.`);
if (summary.failed) process.exitCode = 1;
