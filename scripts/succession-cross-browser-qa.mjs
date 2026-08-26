import { createServer } from 'node:http';
import { access, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { firefox, webkit } from 'playwright';

const root = process.cwd();
const dist = path.join(root, 'dist/client');
const output = path.join(root, '.succession-cross-browser-qa');
const browsers = [
  { id: 'firefox', engine: firefox },
  { id: 'webkit', engine: webkit },
];
const viewport = { id: 'desktop', width: 1440, height: 1000 };
const routes = [
  ['story', 'succession/story'],
  ['chapters', 'succession/chapters'],
  ['timeline', 'succession/timeline'],
  ['characters', 'succession/characters'],
  ['relationships', 'succession/relationships'],
  ['black-whale', 'succession/black-whale'],
  ['assignments', 'succession/bodyguards'],
  ['nen', 'succession/nen'],
  ['locations', 'succession/locations'],
];
const approvedExternalMediaHosts = new Set(['hunterxhunter.fandom.com', 'static.wikia.nocookie.net']);
const mime = {
  '.css': 'text/css; charset=utf-8', '.gif': 'image/gif', '.html': 'text/html; charset=utf-8',
  '.jpeg': 'image/jpeg', '.jpg': 'image/jpeg', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml',
  '.webp': 'image/webp', '.zip': 'application/zip',
};

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

const inspect = () => {
  const visible = (element) => {
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) !== 0 && rect.width > 0 && rect.height > 0;
  };
  const hasScrollAncestor = (element) => {
    for (let parent = element.parentElement; parent; parent = parent.parentElement) {
      const overflow = getComputedStyle(parent).overflowX;
      if (/(auto|scroll)/.test(overflow) && parent.scrollWidth > parent.clientWidth + 1) return true;
    }
    return false;
  };
  const spill = [...document.querySelectorAll('main *')]
    .filter((element) => visible(element) && !element.matches('.sr-only, .sr-only *'))
    .filter((element) => {
      const rect = element.getBoundingClientRect();
      return (rect.left < -1 || rect.right > innerWidth + 1) && !hasScrollAncestor(element);
    })
    .slice(0, 20)
    .map((element) => ({ tag: element.tagName.toLowerCase(), className: element.className, text: (element.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 80) }));
  const brokenImages = [...document.images]
    .filter((image) => visible(image) && image.complete && image.naturalWidth === 0)
    .map((image) => ({ alt: image.alt, src: image.currentSrc || image.src }));
  const firstControl = document.querySelector('main :is(button, a[href], input, select, summary)');
  return {
    bodyOverflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
    spill,
    brokenImages,
    mainVisible: Boolean(document.querySelector('main') && visible(document.querySelector('main'))),
    h1Count: document.querySelectorAll('main h1').length,
    workspaceRegion: Boolean(document.querySelector('.succession-archive__content[role="region"][aria-label]')),
    firstControlLabel: firstControl ? (firstControl.getAttribute('aria-label') || firstControl.textContent || '').trim().slice(0, 80) : '',
  };
};

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
const server = await serve();
const base = `http://127.0.0.1:${server.address().port}`;
const results = [];

try {
  for (const browserRecord of browsers) {
    const browser = await browserRecord.engine.launch({ headless: true });
    try {
      const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
      const page = await context.newPage();

      // Measure common archive cold boot separately from route-specific rendering. The first
      // heavy archive route causes Firefox/WebKit to compile the shared Succession application
      // chunk; treating that one-time startup cost as a Chapters defect made the route matrix
      // order-dependent. The warm-up remains strict: the real shell and workspace must appear.
      await page.goto(`${base}/#/succession/timeline`, { waitUntil: 'domcontentloaded', timeout: 25_000 });
      await page.waitForSelector('main h1', { timeout: 45_000 });
      await page.waitForSelector('.succession-archive__content[role="region"][aria-label]', { timeout: 45_000 });
      await page.goto('about:blank');

      for (const [routeId, route] of routes) {
        const runtimeErrors = [];
        const failedRequests = [];
        const consoleErrors = [];
        const onPageError = (error) => runtimeErrors.push(error.message);
        const onRequestFailed = (request) => {
          if (!approvedExternalFailure(request.url())) failedRequests.push(`${request.url()} · ${request.failure()?.errorText || 'failed'}`);
        };
        const onConsole = (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); };
        page.on('pageerror', onPageError);
        page.on('requestfailed', onRequestFailed);
        page.on('console', onConsole);
        try {
          await page.goto(`${base}/#/${route}`, { waitUntil: 'domcontentloaded', timeout: 25_000 });
          await page.waitForSelector('main', { timeout: 15_000 });
          await page.waitForFunction(() => !document.querySelector('.route-loading'), null, { timeout: 15_000 }).catch(() => {});
          await page.waitForSelector('main h1', { timeout: 15_000 });
          if (routeId !== 'story') {
            await page.waitForSelector('.succession-archive__content[role="region"][aria-label]', { timeout: 15_000 });
          }
          await page.waitForTimeout(120);
          const audit = await page.evaluate(inspect);
          const firstControl = page.locator('main :is(button, a[href], input, select, summary)').first();
          if (await firstControl.count()) {
            await firstControl.focus();
            const focusVisible = await firstControl.evaluate((node) => {
              const style = getComputedStyle(node);
              return style.outlineStyle !== 'none' && Number.parseFloat(style.outlineWidth) >= 2;
            });
            if (!focusVisible) runtimeErrors.push('first interactive control has no visible focus outline');
          }
          if (routeId === 'assignments') {
            const table = page.getByRole('button', { name: 'Table', exact: true });
            await table.click();
            await page.waitForSelector('.succession-assignment-table', { timeout: 8_000 });
          }
          if (routeId === 'black-whale') {
            const occupancy = page.getByRole('button', { name: /Occupancy/i }).first();
            if (await occupancy.count()) await occupancy.click();
          }
          const requiresWorkspaceRegion = routeId !== 'story';
          const defects = [
            ...runtimeErrors,
            ...failedRequests,
            ...consoleErrors,
            ...audit.spill,
            ...audit.brokenImages,
            ...(audit.bodyOverflow > 1 ? [{ bodyOverflow: audit.bodyOverflow }] : []),
            ...(!audit.mainVisible ? [{ mainVisible: false }] : []),
            ...(audit.h1Count !== 1 ? [{ h1Count: audit.h1Count }] : []),
            ...(requiresWorkspaceRegion && !audit.workspaceRegion ? [{ workspaceRegion: false }] : []),
          ];
          results.push({ browser: browserRecord.id, viewport: viewport.id, route, runtimeErrors, failedRequests, consoleErrors, ...audit, defects });
          process.stdout.write(`${defects.length ? '✗' : '✓'} ${browserRecord.id.padEnd(7)} ${route}${defects.length ? ` · ${defects.length} defect(s)` : ''}\n`);
        } catch (error) {
          results.push({ browser: browserRecord.id, viewport: viewport.id, route, error: error.message, defects: [{ error: error.message }] });
          process.stdout.write(`✗ ${browserRecord.id.padEnd(7)} ${route} · ${error.message}\n`);
        } finally {
          page.off('pageerror', onPageError);
          page.off('requestfailed', onRequestFailed);
          page.off('console', onConsole);
          await page.goto('about:blank').catch(() => {});
        }
      }
      await page.close();
      await context.close();
    } finally {
      await browser.close();
    }
  }
} finally {
  await new Promise((resolve) => server.close(resolve));
}

const failures = results.filter((result) => result.error || result.defects?.length);
const summary = {
  generatedAt: new Date().toISOString(),
  checks: results.length,
  passes: results.length - failures.length,
  expectedChecks: browsers.length * routes.length,
  failed: failures.length,
};
await writeFile(path.join(output, 'report.json'), `${JSON.stringify({ summary, results }, null, 2)}\n`);
console.log(`\nSuccession desktop cross-browser QA: ${summary.passes}/${summary.checks} Firefox/WebKit route renders passed.`);
if (summary.failed) process.exitCode = 1;