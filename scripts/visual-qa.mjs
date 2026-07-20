import { createServer } from 'node:http';
import { access, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { routeManifest } from '../src/data/routeManifest.js';

const root = process.cwd();
const dist = path.join(root, 'dist/client');
const output = path.resolve(root, process.env.VISUAL_QA_OUTPUT || '.visual-qa');
const screenshotMode = process.env.VISUAL_QA_SCREENSHOTS || 'failures';
const strictTouch = process.env.VISUAL_QA_STRICT_TOUCH !== '0';
const selectedViewport = process.env.VISUAL_QA_VIEWPORT || 'all';
const selectedRoute = process.env.VISUAL_QA_ROUTE || '';
const playwrightSpecifier = process.env.PLAYWRIGHT_CORE_PATH || 'playwright-core';
const executablePath = process.env.CHROMIUM_PATH;
const approvedExternalMediaHosts = new Set(['hunterxhunter.fandom.com', 'static.wikia.nocookie.net']);

const viewports = [
  { id: 'desktop', width: 1440, height: 1000 },
  { id: 'tablet', width: 768, height: 1024 },
  { id: 'mobile', width: 390, height: 844 },
].filter((item) => selectedViewport === 'all' || item.id === selectedViewport);

const routePath = ({ view, target }) => {
  if (view === 'home') return 'home/';
  if (view === 'series') return target ? `series/${target}` : 'series/';
  return `${view}/${target}`;
};
const routes = routeManifest.map((route, index) => ({
  ...route,
  path: routePath(route),
  file: `${String(index + 1).padStart(2, '0')}-${routePath(route).replace(/\/$/, 'home').replaceAll('/', '-')}`,
})).filter((route) => !selectedRoute || route.path === selectedRoute.replace(/^#?\/?/, ''));

if (!routes.length) throw new Error(`No visual-QA route matched “${selectedRoute}”.`);

const isApprovedExternalMediaRequest = (request) => {
  if (request.resourceType() !== 'image') return false;
  try {
    const url = new URL(request.url());
    return url.protocol === 'https:' && approvedExternalMediaHosts.has(url.hostname);
  } catch {
    return false;
  }
};

const mime = {
  '.css': 'text/css; charset=utf-8', '.gif': 'image/gif', '.html': 'text/html; charset=utf-8',
  '.jpeg': 'image/jpeg', '.jpg': 'image/jpeg', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml',
  '.webp': 'image/webp', '.zip': 'application/zip',
};

const resolvePlaywright = async () => {
  try {
    return await import(playwrightSpecifier.startsWith('/') ? pathToFileURL(playwrightSpecifier).href : playwrightSpecifier);
  } catch (error) {
    throw new Error(`Visual QA requires playwright-core. Install it temporarily with "npm install --no-save playwright-core @sparticuz/chromium", or set PLAYWRIGHT_CORE_PATH. (${error.message})`);
  }
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
      try { await access(candidate); return { executablePath: candidate, args: [] }; } catch { /* try the next browser */ }
    }
    throw new Error('No Chromium executable was found. Set CHROMIUM_PATH or install @sparticuz/chromium temporarily.');
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

const inspectPage = () => {
  const visible = (element) => {
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) !== 0 && rect.width > 0 && rect.height > 0;
  };
  const selector = (element) => {
    let value = element.tagName.toLowerCase();
    if (element.id) value += `#${element.id}`;
    if (element.classList.length) value += `.${[...element.classList].slice(0, 4).join('.')}`;
    return value;
  };
  const hasScrollAncestor = (element) => {
    for (let parent = element.parentElement; parent; parent = parent.parentElement) {
      const overflow = getComputedStyle(parent).overflowX;
      if (/(auto|scroll)/.test(overflow) && parent.scrollWidth > parent.clientWidth + 1) return true;
    }
    return false;
  };
  const bodyOverflow = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth;
  const spill = [...document.querySelectorAll('main *')]
    .filter((element) => visible(element) && !element.matches('.sr-only, .sr-only *'))
    .filter((element) => {
      const rect = element.getBoundingClientRect();
      return (rect.left < -1 || rect.right > innerWidth + 1) && !hasScrollAncestor(element);
    })
    .slice(0, 30)
    .map((element) => {
      const rect = element.getBoundingClientRect();
      return {
        selector: selector(element),
        parent: element.parentElement ? selector(element.parentElement) : null,
        text: (element.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 100),
        left: Math.round(rect.left),
        right: Math.round(rect.right),
      };
    });
  const brokenImages = [...document.images]
    .filter((image) => visible(image) && image.complete && image.naturalWidth === 0)
    .map((image) => ({ alt: image.alt, src: image.currentSrc || image.src }));
  const pendingImages = [...document.images]
    .filter((image) => visible(image) && !image.complete)
    .map((image) => ({ alt: image.alt, src: image.currentSrc || image.src }));
  const emptyFrames = [...document.querySelectorAll('[data-image-frame]')]
    .filter((frame) => visible(frame) && !frame.querySelector('img, .safe-image-placeholder, .source-portrait--missing'))
    .map(selector);
  const mediaTextOverlaps = [...document.querySelectorAll('.room-card, .world-gallery-grid article, .entity-record__identity, .world-place-inspector')]
    .map((container) => {
      const media = container.querySelector(':scope > figure, :scope > .fandom-image');
      const copy = container.querySelector(container.matches('.world-place-inspector') ? ':scope > header' : ':scope > div');
      if (!media || !copy || !visible(media) || !visible(copy)) return null;
      const mediaRect = media.getBoundingClientRect();
      const copyRect = copy.getBoundingClientRect();
      const overlapWidth = Math.min(mediaRect.right, copyRect.right) - Math.max(mediaRect.left, copyRect.left);
      const overlapHeight = Math.min(mediaRect.bottom, copyRect.bottom) - Math.max(mediaRect.top, copyRect.top);
      return overlapWidth > 1 && overlapHeight > 1
        ? { selector: selector(container), overlapWidth: Math.round(overlapWidth), overlapHeight: Math.round(overlapHeight) }
        : null;
    })
    .filter(Boolean);
  const tinyText = [...document.querySelectorAll('main :is(p, li, dd, dt, small, span, figcaption, th, td)')]
    .filter((element) => visible(element) && !element.matches('.sr-only, .sr-only *'))
    .map((element) => ({ element, size: Number.parseFloat(getComputedStyle(element).fontSize) }))
    .filter(({ size }) => size < 11)
    .slice(0, 30)
    .map(({ element, size }) => ({
      selector: selector(element),
      parent: element.parentElement ? selector(element.parentElement) : null,
      text: (element.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 80),
      size,
    }));
  const smallTargets = [...document.querySelectorAll('button, input, select, textarea, [role="button"]')]
    .filter((element) => visible(element) && !element.disabled && !element.matches('.sr-only, .skip-link:not(:focus)'))
    .map((element) => ({ element, rect: element.getBoundingClientRect() }))
    .filter(({ rect }) => rect.width < 43.5 || rect.height < 43.5)
    .slice(0, 40)
    .map(({ element, rect }) => ({ selector: selector(element), width: Math.round(rect.width), height: Math.round(rect.height), label: (element.getAttribute('aria-label') || element.textContent || '').trim().slice(0, 80) }));
  const deathMarks = [...document.querySelectorAll('.death-mark')].filter(visible).length;
  const statusLabels = [...document.querySelectorAll('[class*="deceased"], [data-status="deceased"]')].filter(visible).length;
  return {
    title: document.title,
    bodyOverflow,
    height: document.documentElement.scrollHeight,
    spill,
    brokenImages,
    pendingImages,
    emptyFrames,
    mediaTextOverlaps,
    tinyText,
    smallTargets,
    deathMarks,
    statusLabels,
  };
};

const settlePage = async (page) => {
  await page.waitForSelector('main', { timeout: 8_000 });
  await page.waitForFunction(() => !document.querySelector('.route-loading'), null, { timeout: 8_000 }).catch(() => {});
  await page.waitForTimeout(700);
  await page.evaluate(async () => {
    // A full-page visual audit must exercise images below the initial viewport,
    // even when the production component correctly opts into native lazy loading.
    [...document.images].forEach((image) => { image.loading = 'eager'; });
    const step = Math.max(420, Math.round(innerHeight * .8));
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 12));
    }
    window.scrollTo(0, 0);
    await Promise.race([
      Promise.all([...document.images].map((image) => image.complete ? null : new Promise((resolve) => { image.addEventListener('load', resolve, { once: true }); image.addEventListener('error', resolve, { once: true }); }))),
      new Promise((resolve) => setTimeout(resolve, 2_500)),
    ]);
  });
  await page.waitForTimeout(180);
};

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
const { chromium } = await resolvePlaywright();
const browserConfig = await resolveBrowser();
const browserLaunchOptions = {
  headless: true,
  executablePath: browserConfig.executablePath,
  args: [...browserConfig.args, '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--no-zygote'],
};
const server = await serve();
const base = `http://127.0.0.1:${server.address().port}`;
const report = [];
let browser;
let page;
let checksInBrowser = 0;

const renewBrowser = async (viewport) => {
  if (browser) await browser.close().catch(() => {});
  browser = await chromium.launch(browserLaunchOptions);
  page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
  checksInBrowser = 0;
};

try {
  for (const viewport of viewports) {
    const screenDir = path.join(output, 'screens', viewport.id);
    await mkdir(screenDir, { recursive: true });
    for (const route of routes) {
      if (!page || checksInBrowser >= 5) await renewBrowser(viewport);
      else await page.setViewportSize({ width: viewport.width, height: viewport.height });
      const runtimeErrors = [];
      const failedRequests = [];
      const approvedExternalMediaFailures = [];
      const onPageError = (error) => runtimeErrors.push(error.message);
      const onRequestFailed = (request) => {
        const record = `${request.url()} · ${request.failure()?.errorText || 'failed'}`;
        if (isApprovedExternalMediaRequest(request)) approvedExternalMediaFailures.push(record);
        else failedRequests.push(record);
      };
      page.on('pageerror', onPageError);
      page.on('requestfailed', onRequestFailed);
      try {
        await page.goto(`${base}/#/${route.path}`, { waitUntil: 'domcontentloaded', timeout: 15_000 });
        await settlePage(page);
        const audit = await page.evaluate(inspectPage);
        const defects = runtimeErrors.length + failedRequests.length + audit.spill.length + audit.brokenImages.length + audit.pendingImages.length + audit.emptyFrames.length + audit.mediaTextOverlaps.length + audit.tinyText.length + (audit.bodyOverflow > 1 ? 1 : 0) + (strictTouch && viewport.id !== 'desktop' ? audit.smallTargets.length : 0);
        const row = { viewport: viewport.id, route: route.path, label: route.label, runtimeErrors, failedRequests, approvedExternalMediaFailures, ...audit, defects };
        report.push(row);
        if (screenshotMode === 'all' || (screenshotMode === 'failures' && defects)) {
          await page.screenshot({ path: path.join(screenDir, `${route.file}.png`), fullPage: true });
        }
        process.stdout.write(`${defects ? '✗' : '✓'} ${viewport.id.padEnd(7)} ${route.path}\n`);
      } catch (error) {
        report.push({ viewport: viewport.id, route: route.path, label: route.label, runtimeErrors: [...runtimeErrors, error.message], failedRequests, approvedExternalMediaFailures, defects: 1 });
        await page.screenshot({ path: path.join(screenDir, `${route.file}-fatal.png`), fullPage: true }).catch(() => {});
        process.stdout.write(`✗ ${viewport.id.padEnd(7)} ${route.path} · ${error.message}\n`);
      } finally {
        page.off('pageerror', onPageError);
        page.off('requestfailed', onRequestFailed);
        await page.goto('about:blank').catch(() => {});
        checksInBrowser += 1;
      }
    }
  }
} finally {
  if (browser) await browser.close().catch(() => {});
  await new Promise((resolve) => server.close(resolve));
}

const failures = report.filter((row) => row.defects);
const approvedExternalMediaFailureCount = report.reduce((total, row) => total + (row.approvedExternalMediaFailures?.length || 0), 0);
const summary = {
  generatedAt: new Date().toISOString(),
  routes: routes.length,
  viewports: viewports.map(({ id, width, height }) => ({ id, width, height })),
  checks: report.length,
  passed: report.length - failures.length,
  failed: failures.length,
  approvedExternalMediaFailureCount,
  strictTouch,
};
await writeFile(path.join(output, 'report.json'), `${JSON.stringify({ summary, results: report }, null, 2)}\n`);
await writeFile(path.join(output, 'summary.json'), `${JSON.stringify(summary, null, 2)}\n`);
console.log(`\nVisual QA: ${summary.passed}/${summary.checks} route/viewport renders passed. Approved external media availability events: ${approvedExternalMediaFailureCount}. Report: ${path.relative(root, path.join(output, 'report.json'))}`);
if (failures.length) {
  for (const failure of failures) console.error(`- ${failure.viewport} ${failure.route}: ${failure.defects} defect signal(s)`);
  process.exitCode = 1;
}
