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
const viewports = [
  { id: 'desktop', width: 1440, height: 1000 },
  { id: 'tablet', width: 768, height: 1024 },
  { id: 'mobile', width: 390, height: 844 },
];
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
  const insideScaledWorld = (element) => Boolean(element.closest(
    '[data-qa-pan-zoom-canvas="true"] [data-qa-scaled-canvas="true"], .succession-architecture__sheet',
  ));
  const hasHorizontalScroll = (element) => {
    for (let candidate = element; candidate; candidate = candidate.parentElement) {
      const style = getComputedStyle(candidate);
      if (/(auto|scroll)/.test(style.overflowX) && candidate.scrollWidth > candidate.clientWidth + 1) return true;
    }
    return false;
  };
  const visibleMainElements = [...document.querySelectorAll('main *')]
    .filter((element) => visible(element) && !element.matches('.sr-only, .sr-only *'));
  const spillCandidates = visibleMainElements.filter((element) => {
    const rect = element.getBoundingClientRect();
    return rect.left < -1 || rect.right > innerWidth + 1;
  });
  const scaledCanvasSpillExemptions = spillCandidates.filter(insideScaledWorld).length;
  const spill = spillCandidates
    .filter((element) => !insideScaledWorld(element) && !hasHorizontalScroll(element))
    .slice(0, 30)
    .map((element) => ({ selector: selector(element), text: (element.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 90) }));
  const textNodes = [...document.querySelectorAll('main :is(p, li, dd, dt, small, span, figcaption, th, td)')]
    .filter((element) => visible(element) && !element.matches('.sr-only, .sr-only *'));
  const scaledCanvasTinyTextExemptions = textNodes
    .filter(insideScaledWorld)
    .filter((element) => Number.parseFloat(getComputedStyle(element).fontSize) < 11)
    .length;
  const tinyText = textNodes
    .filter((element) => !insideScaledWorld(element))
    .map((element) => ({ element, size: Number.parseFloat(getComputedStyle(element).fontSize) }))
    .filter(({ size }) => size < 11)
    .slice(0, 30)
    .map(({ element, size }) => ({ selector: selector(element), size, text: (element.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 80) }));
  const targetNodes = [...document.querySelectorAll('main :is(button, input, select, textarea, [role="button"], [role="tab"])')]
    .filter((element) => visible(element) && !element.disabled && !element.matches('.sr-only'));
  const scaledCanvasSmallTargetExemptions = targetNodes
    .filter(insideScaledWorld)
    .map((element) => element.getBoundingClientRect())
    .filter((rect) => rect.width < 43.5 || rect.height < 43.5)
    .length;
  const smallTargets = targetNodes
    .filter((element) => !insideScaledWorld(element))
    .map((element) => ({ element, rect: element.getBoundingClientRect() }))
    .filter(({ rect }) => rect.width < 43.5 || rect.height < 43.5)
    .slice(0, 40)
    .map(({ element, rect }) => ({ selector: selector(element), width: Math.round(rect.width), height: Math.round(rect.height), label: (element.getAttribute('aria-label') || element.textContent || '').trim().slice(0, 80) }));
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
    smallTargets,
    duplicateIds,
    brokenImages,
    scaledCanvasSpillExemptions,
    scaledCanvasTinyTextExemptions,
    scaledCanvasSmallTargetExemptions,
    h1Count: document.querySelectorAll('main h1').length,
    mainVisible: Boolean(main && visible(main)),
    workspaceRegion: Boolean(workspace?.getAttribute('role') === 'region' && workspace?.getAttribute('aria-label')),
    contentVisibilitySupported: CSS.supports('content-visibility', 'auto'),
    cls: Number(globalThis.__successionCLS || 0),
    height: document.documentElement.scrollHeight,
  };
};

await rm(output, { recursive: true, force: true });
await mkdir(path.join(output, 'screens'), { recursive: true });
const server = await serve();
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ headless: true });
const results = [];
const interactions = [];

const context = await browser.newContext();
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
const runInteraction = async (name, viewport, route, test) => {
  try {
    await page.setViewportSize(viewport);
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
  for (const viewport of viewports) {
    const screenDir = path.join(output, 'screens', viewport.id);
    await mkdir(screenDir, { recursive: true });
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
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
        let axeViolations = [];
        let contrastWarnings = [];
        if (viewport.id !== 'tablet') {
          await page.addScriptTag({ path: axePath });
          const axe = await page.evaluate(async () => globalThis.axe.run(document, {
            runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] },
          }));
          const normalized = axe.violations.map((violation) => ({ id: violation.id, impact: violation.impact, nodes: violation.nodes.length }));
          contrastWarnings = normalized.filter((violation) => violation.id === 'color-contrast');
          axeViolations = normalized.filter((violation) => violation.id !== 'color-contrast');
        }
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
          ...(route.path.startsWith('succession/') && route.id !== 'archive' && !audit.workspaceRegion ? [{ workspaceRegion: false }] : []),
          ...(audit.h1Count !== 1 ? [{ h1Count: audit.h1Count }] : []),
          ...(viewport.id !== 'desktop' ? audit.smallTargets : []),
          ...(audit.cls > .18 ? [{ cls: audit.cls }] : []),
        ];
        const result = {
          viewport: viewport.id,
          route: route.path,
          label: route.label,
          runtimeErrors,
          failedRequests,
          axeViolations,
          contrastWarnings,
          ...audit,
          defects,
        };
        results.push(result);
        await page.screenshot({ path: path.join(screenDir, `${route.id}.jpg`), type: 'jpeg', quality: 72, fullPage: false });
        process.stdout.write(`${defects.length ? '✗' : '✓'} ${viewport.id.padEnd(7)} ${route.path} · CLS ${audit.cls.toFixed(3)}${contrastWarnings.length ? ` · contrast warnings ${contrastWarnings.reduce((total, warning) => total + warning.nodes, 0)}` : ''}${defects.length ? ` · ${defects.length} defect(s)` : ''}\n`);
      } catch (error) {
        results.push({ viewport: viewport.id, route: route.path, label: route.label, error: error.message, defects: [{ error: error.message }] });
        process.stdout.write(`✗ ${viewport.id.padEnd(7)} ${route.path} · ${error.message}\n`);
      } finally {
        page.off('pageerror', onPageError);
        page.off('requestfailed', onRequestFailed);
        await page.goto('about:blank').catch(() => {});
      }
    }
  }

  await runInteraction('desktop Story hub tab focuses the new workspace', { width: 1440, height: 1000 }, 'succession/story', async (page) => {
    const timeline = page.locator('.succession-hub-tabs a[href*="/timeline"]').first();
    await timeline.waitFor({ state: 'visible', timeout: 10_000 });
    await timeline.focus();
    await page.keyboard.press('Enter');
    await page.waitForSelector('.succession-archive[data-archive-route="timeline"][data-archive-hub="story"]', { timeout: 10_000 });
    await page.waitForFunction(() => document.activeElement?.id === 'succession-workspace-content');
  });

  await runInteraction('mobile archive drawer traps Escape and restores focus', { width: 390, height: 844 }, 'succession/story', async (page) => {
    const trigger = page.locator('.succession-archive__mobile-bar button').first();
    await trigger.click();
    await page.waitForSelector('.succession-drawer [role="dialog"]');
    await page.keyboard.press('Escape');
    await page.waitForSelector('.succession-drawer', { state: 'detached' });
    await page.waitForFunction(() => document.activeElement?.matches('.succession-archive__mobile-bar button:first-child'));
  });

  await runInteraction('assignment result modes are keyboard operable', { width: 1440, height: 1000 }, 'succession/bodyguards', async (page) => {
    const table = page.getByRole('button', { name: 'Table' });
    await table.focus();
    await page.keyboard.press('Enter');
    await page.waitForSelector('.succession-assignment-table');
    const ledger = page.getByRole('button', { name: 'Ledger' });
    await ledger.focus();
    await page.keyboard.press('Enter');
    await page.waitForSelector('.succession-assignment-ledger');
  });

  await runInteraction('reduced motion removes meaningful transition duration', { width: 1440, height: 1000 }, 'succession/story', async (page) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const duration = await page.locator('.succession-button').first().evaluate((node) => Math.max(...getComputedStyle(node).transitionDuration.split(',').map((value) => Number.parseFloat(value) || 0)));
    assert(duration <= .02, `reduced-motion transition remained ${duration}s`);
  });

  await runInteraction('forced colors retains visible keyboard focus', { width: 1440, height: 1000 }, 'succession/story', async (page) => {
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
const contrastWarningCount = results.reduce((total, result) => total + (result.contrastWarnings || []).reduce((nodes, warning) => nodes + warning.nodes, 0), 0);
const scaledCanvasExemptions = results.reduce((totals, result) => ({
  spill: totals.spill + (result.scaledCanvasSpillExemptions || 0),
  text: totals.text + (result.scaledCanvasTinyTextExemptions || 0),
  targets: totals.targets + (result.scaledCanvasSmallTargetExemptions || 0),
}), { spill: 0, text: 0, targets: 0 });
const summary = {
  generatedAt: new Date().toISOString(),
  routeChecks: results.length,
  routePasses: results.length - failedRoutes.length,
  expectedRouteChecks: routes.length * viewports.length,
  interactionChecks: interactions.length,
  interactionPasses: interactions.length - failedInteractions.length,
  maximumCls: Math.max(0, ...results.map((result) => result.cls || 0)),
  contrastWarningCount,
  contrastWarningsBlockBuild: false,
  scaledCanvasExemptions,
  failed: failedRoutes.length + failedInteractions.length,
};
await writeFile(path.join(output, 'report.json'), `${JSON.stringify({ summary, routes: results, interactions }, null, 2)}\n`);
console.log(`\nSuccession final release QA: ${summary.routePasses}/${summary.routeChecks} responsive route renders and ${summary.interactionPasses}/${summary.interactionChecks} interaction flows passed; maximum CLS ${summary.maximumCls.toFixed(3)}; ${contrastWarningCount} contrast warning node(s) reported; scaled-canvas exemptions ${scaledCanvasExemptions.text} text, ${scaledCanvasExemptions.targets} targets, ${scaledCanvasExemptions.spill} spill.`);
if (summary.failed) process.exitCode = 1;
