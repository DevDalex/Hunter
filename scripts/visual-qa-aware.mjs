import { createServer } from 'node:http';
import { access, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { routeManifest } from '../src/data/routeManifest.js';

const root = process.cwd();
const dist = path.join(root, 'dist/client');
const output = path.resolve(root, process.env.VISUAL_QA_OUTPUT || '.visual-qa');
const screenshotMode = process.env.VISUAL_QA_SCREENSHOTS || 'failures';
const requestedViewport = process.env.VISUAL_QA_VIEWPORT || 'desktop';
const selectedRoute = process.env.VISUAL_QA_ROUTE || '';
const playwrightSpecifier = process.env.PLAYWRIGHT_CORE_PATH || 'playwright-core';
const executablePath = process.env.CHROMIUM_PATH;
const desktop = Object.freeze({ id: 'desktop', width: 1440, height: 1000 });
const approvedExternalMediaHosts = new Set(['hunterxhunter.fandom.com', 'static.wikia.nocookie.net']);

if (requestedViewport !== 'desktop') {
  throw new Error(`Visual QA supports the desktop contract only. Received “${requestedViewport}”.`);
}

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

const mime = {
  '.css': 'text/css; charset=utf-8', '.gif': 'image/gif', '.html': 'text/html; charset=utf-8',
  '.jpeg': 'image/jpeg', '.jpg': 'image/jpeg', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml',
  '.webp': 'image/webp', '.zip': 'application/zip',
};

const isApprovedExternalMediaRequest = (request) => {
  if (request.resourceType() !== 'image') return false;
  try {
    const url = new URL(request.url());
    return url.protocol === 'https:' && approvedExternalMediaHosts.has(url.hostname);
  } catch {
    return false;
  }
};

const resolvePlaywright = async () => {
  try {
    return await import(playwrightSpecifier.startsWith('/') ? pathToFileURL(playwrightSpecifier).href : playwrightSpecifier);
  } catch (error) {
    throw new Error(`Visual QA requires Playwright. Set PLAYWRIGHT_CORE_PATH when using a nonstandard install. (${error.message})`);
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
      try {
        await access(candidate);
        return { executablePath: candidate, args: [] };
      } catch {
        // Try the next desktop Chromium candidate.
      }
    }
    throw new Error('No Chromium executable was found. Set CHROMIUM_PATH.');
  }
};

const serve = async () => {
  await access(path.join(dist, 'index.html'));
  const server = createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
      let filename = path.join(dist, pathname === '/' ? 'index.html' : pathname);
      if (!filename.startsWith(dist)) throw new Error('Invalid path');
      try {
        if ((await stat(filename)).isDirectory()) filename = path.join(dist, 'index.html');
      } catch {
        filename = path.join(dist, 'index.html');
      }
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
  const insideDeclaredScaledWorld = (element) => Boolean(element.closest('[data-qa-pan-zoom-canvas="true"] [data-qa-scaled-canvas="true"]'));
  const bodyOverflow = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth;
  const scaledCanvasSpillExemptions = [...document.querySelectorAll('main *')]
    .filter((element) => visible(element) && insideDeclaredScaledWorld(element))
    .filter((element) => {
      const rect = element.getBoundingClientRect();
      return rect.left < -1 || rect.right > innerWidth + 1;
    }).length;
  const spill = [...document.querySelectorAll('main *')]
    .filter((element) => visible(element) && !element.matches('.sr-only, .sr-only *'))
    .filter((element) => !insideDeclaredScaledWorld(element))
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
    scaledCanvasSpillExemptions,
    deathMarks,
    statusLabels,
  };
};

const settlePage = async (page) => {
  await page.waitForSelector('main', { timeout: 8_000 });
  await page.waitForFunction(() => !document.querySelector('.route-loading'), null, { timeout: 8_000 }).catch(() => {});
  await page.waitForTimeout(700);
  await page.evaluate(async () => {
    [...document.images].forEach((image) => { image.loading = 'eager'; });
    const step = Math.max(420, Math.round(innerHeight * .8));
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 12));
    }
    window.scrollTo(0, 0);
    await Promise.race([
      Promise.all([...document.images].map((image) => image.complete ? null : new Promise((resolve) => {
        image.addEventListener('load', resolve, { once: true });
        image.addEventListener('error', resolve, { once: true });
      }))),
      new Promise((resolve) => setTimeout(resolve, 2_500)),
    ]);
  });
  await page.waitForTimeout(180);
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
const page = await browser.newPage({ viewport: { width: desktop.width, height: desktop.height } });
const server = await serve();
const base = `http://127.0.0.1:${server.address().port}`;
const report = [];

try {
  for (const route of routes) {
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
      const defects = runtimeErrors.length
        + failedRequests.length
        + audit.spill.length
        + audit.brokenImages.length
        + audit.pendingImages.length
        + audit.emptyFrames.length
        + audit.mediaTextOverlaps.length
        + audit.tinyText.length
        + (audit.bodyOverflow > 1 ? 1 : 0);
      const row = { viewport: desktop.id, route: route.path, label: route.label, runtimeErrors, failedRequests, approvedExternalMediaFailures, ...audit, defects };
      report.push(row);
      if (screenshotMode === 'all' || (screenshotMode === 'failures' && defects)) {
        const screenDir = path.join(output, 'screens', desktop.id);
        await mkdir(screenDir, { recursive: true });
        await page.screenshot({ path: path.join(screenDir, `${route.file}.png`), fullPage: true });
      }
      process.stdout.write(`${defects ? '✗' : '✓'} ${desktop.id.padEnd(7)} ${route.path}\n`);
    } catch (error) {
      report.push({ viewport: desktop.id, route: route.path, label: route.label, runtimeErrors: [...runtimeErrors, error.message], failedRequests, approvedExternalMediaFailures, defects: 1 });
      process.stdout.write(`✗ ${desktop.id.padEnd(7)} ${route.path} · ${error.message}\n`);
    } finally {
      page.off('pageerror', onPageError);
      page.off('requestfailed', onRequestFailed);
      await page.goto('about:blank').catch(() => {});
    }
  }
} finally {
  await browser.close().catch(() => {});
  await new Promise((resolve) => server.close(resolve));
}

const failures = report.filter((row) => row.defects);
const approvedExternalMediaFailureCount = report.reduce((total, row) => total + (row.approvedExternalMediaFailures?.length || 0), 0);
const scaledCanvasSpillExemptions = report.reduce((total, row) => total + (row.scaledCanvasSpillExemptions || 0), 0);
const summary = {
  generatedAt: new Date().toISOString(),
  routes: routes.length,
  viewports: [desktop],
  checks: report.length,
  passed: report.length - failures.length,
  failed: failures.length,
  approvedExternalMediaFailureCount,
  scaledCanvasSpillExemptions,
  report,
};
await writeFile(path.join(output, 'report.json'), `${JSON.stringify(summary, null, 2)}\n`);

console.log(`\nVisual QA: ${summary.passed}/${summary.checks} desktop route render(s) passed. Approved external media availability events: ${approvedExternalMediaFailureCount}. Scaled-canvas spill exemptions: ${scaledCanvasSpillExemptions}. Report: ${path.relative(root, path.join(output, 'report.json'))}`);
for (const failure of failures) console.error(`- ${failure.route}: ${failure.defects} defect signal(s)`);
if (failures.length) process.exitCode = 1;
