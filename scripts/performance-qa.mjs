import { createServer } from 'node:http';
import { access, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const dist = path.join(root, 'dist/client');
const output = path.resolve(root, process.env.PERFORMANCE_QA_OUTPUT || '.performance-qa');
const playwrightSpecifier = process.env.PLAYWRIGHT_CORE_PATH || 'playwright-core';
const executablePath = process.env.CHROMIUM_PATH;
const manifest = JSON.parse(await readFile(path.join(dist, '.vite/manifest.json'), 'utf8'));
const dynamicFiles = new Set(Object.values(manifest).filter((record) => record.isDynamicEntry).map((record) => `/${record.file}`));
const clsBudget = 0.15;
const designSystemDebtClsRoutes = new Set(['series-research']);
const approvedExternalMediaHosts = new Set(['hunterxhunter.fandom.com', 'static.wikia.nocookie.net']);

const routes = [
  { id: 'home', hash: 'succession/archive', readySelector: '.succession-command-home' },
  { id: 'series-research', hash: 'series/research' },
  { id: 'family-tree', hash: 'succession/family-tree' },
  { id: 'black-whale', hash: 'succession/black-whale' },
  { id: 'encyclopedia', hash: 'reference/encyclopedia' },
  { id: 'hisoka-chrollo', hash: 'reference/hisoka-chrollo' },
];

const profiles = [
  { id: 'desktop', viewport: { width: 1440, height: 1000 }, constrained: false },
  { id: 'constrained-mobile', viewport: { width: 390, height: 844 }, constrained: true },
];

const mime = {
  '.css': 'text/css; charset=utf-8', '.gif': 'image/gif', '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.jpeg': 'image/jpeg', '.jpg': 'image/jpeg', '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp',
};

const isApprovedExternalMediaFailure = (url) => {
  try { return approvedExternalMediaHosts.has(new URL(url).hostname); }
  catch { return false; }
};

const resolvePlaywright = async () => {
  try { return await import(playwrightSpecifier.startsWith('/') ? pathToFileURL(playwrightSpecifier).href : playwrightSpecifier); }
  catch (error) { throw new Error(`Performance QA requires playwright-core. (${error.message})`); }
};

const resolveBrowser = async () => {
  if (executablePath) return { executablePath, args: [] };
  try {
    const sparticuz = (await import('@sparticuz/chromium')).default;
    return { executablePath: await sparticuz.executablePath(), args: sparticuz.args };
  } catch {
    for (const candidate of ['/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser']) {
      try { await access(candidate); return { executablePath: candidate, args: [] }; } catch { /* try next */ }
    }
    throw new Error('No Chromium executable was found.');
  }
};

const serve = async () => {
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
const results = [];
const page = await browser.newPage({ viewport: profiles[0].viewport });
const session = await page.context().newCDPSession(page);
await session.send('Network.enable');
await page.addInitScript(() => {
  window.__resetArchiveVitals = () => { window.__archiveVitals = { cls: 0, longTasks: 0 }; };
  window.__resetArchiveVitals();
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__archiveVitals.cls += entry.value;
  }).observe({ type: 'layout-shift', buffered: true });
  new PerformanceObserver((list) => { window.__archiveVitals.longTasks += list.getEntries().length; }).observe({ type: 'longtask', buffered: true });
});

try {
  for (const profile of profiles) {
    await page.setViewportSize(profile.viewport);
    await session.send('Network.emulateNetworkConditions', profile.constrained ? {
      offline: false,
      latency: 100,
      downloadThroughput: 1_600_000 / 8,
      uploadThroughput: 750_000 / 8,
      connectionType: 'cellular4g',
    } : {
      offline: false,
      latency: 0,
      downloadThroughput: -1,
      uploadThroughput: -1,
      connectionType: 'none',
    });
    await session.send('Emulation.setCPUThrottlingRate', { rate: profile.constrained ? 4 : 1 });
    for (const route of routes) {
      const runtimeErrors = [];
      const failedRequests = [];
      const approvedExternalFailures = [];
      const requestedPaths = [];
      const onPageError = (error) => runtimeErrors.push(error.message);
      const onRequestFailed = (request) => {
        const failure = `${request.url()} · ${request.failure()?.errorText || 'failed'}`;
        if (isApprovedExternalMediaFailure(request.url())) approvedExternalFailures.push(failure);
        else failedRequests.push(failure);
      };
      const onRequest = (request) => requestedPaths.push(new URL(request.url()).pathname);
      page.on('pageerror', onPageError);
      page.on('requestfailed', onRequestFailed);
      page.on('request', onRequest);
      await session.send('Network.clearBrowserCache');
      const started = Date.now();
      let readyMs = 0;
      let fatal = '';
      try {
        await page.goto(`${base}/#/${route.hash}`, { waitUntil: 'domcontentloaded', timeout: 15_000 });
        await page.waitForSelector('main', { timeout: 8_000 });
        await page.waitForFunction(() => !document.querySelector('.route-loading'), null, { timeout: 12_000 });
        if (route.readySelector) await page.waitForSelector(route.readySelector, { timeout: 8_000 });
        readyMs = Date.now() - started;
        await page.evaluate(() => window.__resetArchiveVitals?.());
        await page.waitForTimeout(550);
      } catch (error) {
        readyMs = Date.now() - started;
        fatal = error.message;
      }
      const metrics = fatal ? {} : await page.evaluate(async () => {
        const navigation = performance.getEntriesByType('navigation')[0];
        const resources = performance.getEntriesByType('resource');
        const highPriorityImages = [...document.images].filter((image) => image.fetchPriority === 'high' || image.getAttribute('fetchpriority') === 'high').length;
        return {
          domContentLoadedMs: Math.round(navigation?.domContentLoadedEventEnd || 0),
          loadMs: Math.round(navigation?.loadEventEnd || 0),
          transferBytes: Math.round(resources.reduce((total, entry) => total + (entry.transferSize || 0), 0)),
          resourceCount: resources.length,
          cls: Number((window.__archiveVitals?.cls || 0).toFixed(4)),
          longTasks: window.__archiveVitals?.longTasks || 0,
          highPriorityImages,
          serviceWorkers: navigator.serviceWorker ? (await navigator.serviceWorker.getRegistrations()).length : 0,
          mainText: document.querySelector('main')?.innerText.trim().length || 0,
        };
      });
      const dynamicRequests = requestedPaths.filter((pathname) => dynamicFiles.has(pathname));
      const clsDebt = metrics.cls > clsBudget && designSystemDebtClsRoutes.has(route.id) ? `settled CLS ${metrics.cls} exceeds ${clsBudget}; tracked for Batch 12 design-system cleanup` : null;
      const defects = [
        ...(fatal ? [fatal] : []),
        ...runtimeErrors,
        ...failedRequests,
        ...(readyMs > 13_000 ? [`route ready time ${readyMs}ms exceeds 13,000ms`] : []),
        ...(metrics.mainText === 0 ? ['main content is empty'] : []),
        ...(metrics.cls > clsBudget && !designSystemDebtClsRoutes.has(route.id) ? [`settled CLS ${metrics.cls} exceeds ${clsBudget}`] : []),
        ...(route.id === 'home' && metrics.highPriorityImages !== 1 ? [`home has ${metrics.highPriorityImages} high-priority images; expected 1`] : []),
        ...(metrics.serviceWorkers ? [`${metrics.serviceWorkers} service worker registration(s) found`] : []),
      ];
      results.push({ profile: profile.id, route: route.id, readyMs, dynamicRequests, runtimeErrors, failedRequests, approvedExternalFailures, clsDebt, ...metrics, defects });
      process.stdout.write(`${defects.length ? '✗' : '✓'} ${profile.id.padEnd(18)} ${route.id.padEnd(18)} ${readyMs}ms${clsDebt ? ' · CLS debt' : ''}${approvedExternalFailures.length ? ` · approved external media:${approvedExternalFailures.length}` : ''}\n`);
      if (defects.length) await page.screenshot({ path: path.join(output, `${profile.id}-${route.id}.png`), fullPage: true }).catch(() => {});
      page.off('pageerror', onPageError);
      page.off('requestfailed', onRequestFailed);
      page.off('request', onRequest);
      await page.goto('about:blank').catch(() => {});
    }
  }
} finally {
  await page.close().catch(() => {});
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}

const failures = results.filter((record) => record.defects.length);
const clsDebt = results.filter((record) => record.clsDebt);
const approvedExternalFailures = results.reduce((total, record) => total + record.approvedExternalFailures.length, 0);
const summary = {
  generatedAt: new Date().toISOString(),
  routes: routes.length,
  profiles: profiles.length,
  checks: results.length,
  passed: results.length - failures.length,
  failed: failures.length,
  clsDebt: clsDebt.length,
  approvedExternalFailures,
  slowestReadyMs: Math.max(...results.map((record) => record.readyMs)),
};
await writeFile(path.join(output, 'report.json'), `${JSON.stringify({ summary, results }, null, 2)}\n`);
await writeFile(path.join(output, 'summary.json'), `${JSON.stringify(summary, null, 2)}\n`);
console.log(`\nPerformance QA: ${summary.passed}/${summary.checks} route/profile checks passed; ${summary.clsDebt} CLS debt item(s); ${summary.approvedExternalFailures} approved external media availability event(s); slowest ready state ${summary.slowestReadyMs}ms.`);
if (failures.length) process.exitCode = 1;