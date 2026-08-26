import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { access, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';
import { successionReleaseRoutes } from '../src/data/routeManifest.js';

const require = createRequire(import.meta.url);
const root = process.cwd();
const dist = path.join(root, 'dist/client');
const output = path.join(root, '.succession-final-qa');
const axePath = require.resolve('axe-core/axe.min.js');
const desktopViewport = { width: 1440, height: 1000 };
const routes = [
  { id: 'global-timeline', path: 'timeline/', label: 'Global timeline' },
  ...successionReleaseRoutes.map((route) => ({ id: route.id, path: `succession/${route.id}`, label: route.title })),
];
const approvedExternalMediaHosts = new Set(['hunterxhunter.fandom.com', 'static.wikia.nocookie.net']);
const mime = {
  '.css': 'text/css; charset=utf-8', '.gif': 'image/gif', '.html': 'text/html; charset=utf-8',
  '.jpeg': 'image/jpeg', '.jpg': 'image/jpeg', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml',
  '.webp': 'image/webp', '.zip': 'application/zip',
};
const assert = (condition, message) => { if (!condition) throw new Error(message); };

const serve = async () => {
  await access(path.join(dist, 'index.html'));
  const server = createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
      let filename = path.join(dist, pathname === '/' ? 'index.html' : pathname);
      if (!filename.startsWith(dist)) throw new Error('Invalid path');
      try { if ((await stat(filename)).isDirectory()) filename = path.join(dist, 'index.html'); }
      catch { filename = path.join(dist, 'index.html'); }
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

const approvedExternalFailure = (url) => {
  try { return approvedExternalMediaHosts.has(new URL(url).hostname); }
  catch { return false; }
};

const settle = async (page) => {
  await page.waitForSelector('main', { timeout: 12_000 });
  await page.waitForFunction(() => !document.querySelector('.route-loading'), null, { timeout: 10_000 }).catch(() => {});
  await page.waitForTimeout(420);
  await page.evaluate(async () => {
    const step = Math.max(520, Math.round(innerHeight * .9));
    const maximum = Math.min(document.documentElement.scrollHeight, 9_000);
    for (let y = 0; y < maximum; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 16));
    }
    window.scrollTo(0, 0);
    await new Promise((resolve) => setTimeout(resolve, 120));
  });
};

const inspect = () => {
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
      const style = getComputedStyle(parent);
      if (/(auto|scroll)/.test(style.overflowX) && parent.scrollWidth > parent.clientWidth + 1) return true;
    }
    return false;
  };
  const spill = [...document.querySelectorAll('main *')]
    .filter((element) => visible(element) && !element.matches('.sr-only, .sr-only *'))
    .filter((element) => {
      const rect = element.getBoundingClientRect();
      return (rect.left < -1 || rect.right > innerWidth + 1) && !hasScrollAncestor(element);
    })
    .slice(0, 30)
    .map((element) => ({ selector: selector(element), text: (element.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 90) }));
  const tinyText = [...document.querySelectorAll('main :is(p, li, dd, dt, small, span, figcaption, th, td)')]
    .filter((element) => visible(element) && !element.matches('.sr-only, .sr-only *'))
    .map((element) => ({ element, size: Number.parseFloat(getComputedStyle(element).fontSize) }))
    .filter(({ size }) => size < 11)
    .slice(0, 30)
    .map(({ element, size }) => ({ selector: selector(element), size, text: (element.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 80) }));
  const duplicateIds = [...document.querySelectorAll('[id]')]
    .map((element) => element.id)
    .filter((id, index, ids) => id && ids.indexOf(id) !== index)
    .filter((id, index, ids) => ids.indexOf(id) === index);
  const brokenImages = [...document.images]
    .filter((image) => visible(image) && image.complete && image.naturalWidth === 0)
    .map((image) => ({ alt: image.alt, src: image.currentSrc || image.src }));
  const main = document.querySelector('main');
  const workspace = document.querySelector('.succession-archive__content');
  return {
    bodyOverflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
    spill,
    tinyText,
    duplicateIds,
    brokenImages,
    h1Count: document.querySelectorAll('main h1').length,
    mainVisible: Boolean(main && visible(main)),
    workspaceRegion: Boolean(workspace?.getAttribute('role') === 'region' && workspace?.getAttribute('aria-label')),
    contentVisibilitySupported: CSS.supports('content-visibility', 'auto'),
    cls: Number(globalThis.__successionCLS || 0),
    height: document.documentElement.scrollHeight,
  };
};

await rm(output, { recursive: true, force: true });
await mkdir(path.join(output, 'screens', 'desktop'), { recursive: true });
const server = await serve();
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ headless: true });
const results = [];
const interactions = [];

const context = await browser.newContext({ viewport: desktopViewport });
await context.addInitScript(() => {
  globalThis.__successionCLS = 0;
  try {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) globalThis.__successionCLS += entry.value;
      }
    }).observe({ type: 'layout-shift', buffered: true });
  } catch { /* LayoutShift API is optional in older engines. */ }
});

const page = await context.newPage();
const runInteraction = async (name, route, test) => {
  try {
    await page.setViewportSize(desktopViewport);
    await page.goto(`${base}/#/${route}`, { waitUntil: 'domcontentloaded', timeout: 20_000 });
    await settle(page);
    await test(page);
    interactions.push({ name, status: 'passed' });
    process.stdout.write(`✓ interaction ${name}\n`);
  } catch (error) {
    interactions.push({ name, status: 'failed', error: error.message });
    process.stdout.write(`✗ interaction ${name} · ${error.message}\n`);
  } finally {
    await page.emulateMedia({ reducedMotion: 'no-preference', forcedColors: 'none' }).catch(() => {});
    await page.goto('about:blank').catch(() => {});
  }
};

try {
  await page.setViewportSize(desktopViewport);
  for (const route of routes) {
    const runtimeErrors = [];
    const failedRequests = [];
    const onPageError = (error) => runtimeErrors.push(error.message);
    const onRequestFailed = (request) => {
      if (!approvedExternalFailure(request.url())) failedRequests.push(`${request.url()} · ${request.failure()?.errorText || 'failed'}`);
    };
    page.on('pageerror', onPageError);
    page.on('requestfailed', onRequestFailed);
    try {
      await page.goto(`${base}/#/${route.path}`, { waitUntil: 'domcontentloaded', timeout: 20_000 });
      await settle(page);
      const audit = await page.evaluate(inspect);
      await page.addScriptTag({ path: axePath });
      const axe = await page.evaluate(async () => globalThis.axe.run(document, {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] },
      }));
      const axeViolations = axe.violations.map((violation) => ({
        id: violation.id,
        impact: violation.impact,
        nodes: violation.nodes.length,
        samples: violation.nodes.slice(0, 12).map((node) => ({
          target: node.target,
          html: node.html.slice(0, 260),
          failureSummary: node.failureSummary,
        })),
      }));
      const requiresWorkspaceRegion = route.path.startsWith('succession/') && !['story', 'archive'].includes(route.id);
      const defects = [
        ...runtimeErrors,
        ...failedRequests,
        ...audit.spill,
        ...audit.tinyText,
        ...audit.brokenImages,
        ...audit.duplicateIds,
        ...axeViolations,
        ...(audit.bodyOverflow > 1 ? [{ bodyOverflow: audit.bodyOverflow }] : []),
        ...(!audit.mainVisible ? [{ mainVisible: false }] : []),
        ...(requiresWorkspaceRegion && !audit.workspaceRegion ? [{ workspaceRegion: false }] : []),
        ...(audit.h1Count !== 1 ? [{ h1Count: audit.h1Count }] : []),
        ...(audit.cls > .18 ? [{ cls: audit.cls }] : []),
      ];
      const result = { viewport: 'desktop', route: route.path, label: route.label, runtimeErrors, failedRequests, axeViolations, ...audit, defects };
      results.push(result);
      await page.screenshot({ path: path.join(output, 'screens', 'desktop', `${route.id}.jpg`), type: 'jpeg', quality: 72, fullPage: false });
      process.stdout.write(`${defects.length ? '✗' : '✓'} desktop ${route.path} · CLS ${audit.cls.toFixed(3)}${defects.length ? ` · ${defects.length} defect(s)` : ''}\n`);
    } catch (error) {
      results.push({ viewport: 'desktop', route: route.path, label: route.label, error: error.message, defects: [{ error: error.message }] });
      process.stdout.write(`✗ desktop ${route.path} · ${error.message}\n`);
    } finally {
      page.off('pageerror', onPageError);
      page.off('requestfailed', onRequestFailed);
      await page.goto('about:blank').catch(() => {});
    }
  }

  await runInteraction('desktop Story command home opens Timeline and focuses the workspace', 'succession/story', async (page) => {
    const timeline = page.getByRole('link', { name: 'Timeline', exact: true });
    await timeline.focus();
    await page.keyboard.press('Enter');
    await page.waitForSelector('.succession-archive[data-archive-route="timeline"][data-archive-hub="story"]', { timeout: 10_000 });
    await page.waitForFunction(() => document.activeElement?.id === 'succession-workspace-content');
  });

  await runInteraction('assignment result modes are keyboard operable', 'succession/bodyguards', async (page) => {
    const table = page.getByRole('button', { name: 'Table', exact: true });
    await table.focus();
    await page.keyboard.press('Enter');
    await page.waitForSelector('.succession-assignment-table');
    const ledger = page.getByRole('button', { name: 'Ledger', exact: true });
    await ledger.focus();
    await page.keyboard.press('Enter');
    await page.waitForSelector('.succession-assignment-ledger');
  });

  await runInteraction('reduced motion removes meaningful transition duration', 'succession/timeline', async (page) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const duration = await page.locator('.succession-button').first().evaluate((node) => Math.max(...getComputedStyle(node).transitionDuration.split(',').map((value) => Number.parseFloat(value) || 0)));
    assert(duration <= .02, `reduced-motion transition remained ${duration}s`);
  });

  await runInteraction('forced colors retains visible keyboard focus', 'succession/timeline', async (page) => {
    await page.emulateMedia({ forcedColors: 'active' });
    const button = page.locator('.succession-button').first();
    await button.focus();
    const outline = await button.evaluate((node) => ({ style: getComputedStyle(node).outlineStyle, width: Number.parseFloat(getComputedStyle(node).outlineWidth) || 0 }));
    assert(outline.style !== 'none' && outline.width >= 2, 'forced-colors focus outline was not visible');
  });
} finally {
  await page.close().catch(() => {});
  await context.close().catch(() => {});
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}

const failedRoutes = results.filter((result) => result.error || result.defects?.length);
const failedInteractions = interactions.filter((result) => result.status === 'failed');
const summary = {
  generatedAt: new Date().toISOString(),
  routeChecks: results.length,
  routePasses: results.length - failedRoutes.length,
  interactionChecks: interactions.length,
  interactionPasses: interactions.length - failedInteractions.length,
  expectedRouteChecks: routes.length,
  failed: failedRoutes.length + failedInteractions.length,
};
await writeFile(path.join(output, 'results.json'), `${JSON.stringify({ summary, routes: results, interactions }, null, 2)}\n`);
process.stdout.write(`\nSuccession desktop release QA: ${summary.routePasses}/${summary.routeChecks} route renders and ${summary.interactionPasses}/${summary.interactionChecks} interactions passed.\n`);
if (summary.failed) process.exitCode = 1;
