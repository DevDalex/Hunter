import { createServer } from 'node:http';
import { access, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const root = process.cwd();
const dist = path.join(root, 'dist/client');
const output = path.join(root, '.timeline-map-qa');
const viewport = { width: 1600, height: 1000 };
const expectedLenses = ['Story', 'Characters', 'Locations', 'Organizations', 'Nen', 'Knowledge'];
const assert = (condition, message) => { if (!condition) throw new Error(message); };

const mime = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
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

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
const server = await serve();
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport });
const page = await context.newPage();
const runtimeErrors = [];
page.on('pageerror', (error) => runtimeErrors.push(error.message));

const report = {
  route: '/succession/timeline',
  viewport,
  assertions: [],
  runtimeErrors,
};

const check = (condition, message) => {
  assert(condition, message);
  report.assertions.push(message);
};

try {
  await page.goto(`${base}/#/succession/timeline`, { waitUntil: 'domcontentloaded', timeout: 20_000 });
  await page.waitForSelector('.timeline-story-field', { state: 'visible', timeout: 20_000 });
  await page.waitForSelector('.timeline-context-navigator', { state: 'visible', timeout: 20_000 });
  await page.waitForTimeout(350);

  const initial = await page.evaluate(({ expectedLenses }) => {
    const isVisible = (element) => {
      if (!element) return false;
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== 'none'
        && style.visibility !== 'hidden'
        && Number(style.opacity) !== 0
        && rect.width > 0
        && rect.height > 0;
    };
    const lensLabels = [...document.querySelectorAll('.tsf-lensbar button')].map((button) => button.textContent.trim());
    const tinyText = [...document.querySelectorAll('.timeline-context-navigator :is(span, small, button), .timeline-story-field :is(span, small, button, strong, em)')]
      .filter((element) => isVisible(element) && !element.matches('.sr-only, .sr-only *'))
      .map((element) => ({ text: element.textContent.trim().replace(/\s+/g, ' ').slice(0, 80), size: Number.parseFloat(getComputedStyle(element).fontSize) }))
      .filter((row) => Number.isFinite(row.size) && row.size < 11);
    return {
      mapVisible: isVisible(document.querySelector('.timeline-story-field')),
      navigatorVisible: isVisible(document.querySelector('.timeline-context-navigator')),
      lanesVisible: isVisible(document.querySelector('.tsf-lanes')),
      viewportVisible: isVisible(document.querySelector('.tsf-viewport')),
      chapterGrid: document.querySelectorAll('.tsf-chapter-grid > i').length,
      laneCount: document.querySelectorAll('.tsf-lanes > button').length,
      nodeCount: document.querySelectorAll('.tsf-node').length,
      contextCursor: isVisible(document.querySelector('.tsf-context-line')),
      lensLabels,
      lensContract: expectedLenses.every((label) => lensLabels.includes(label)),
      genericExplorerPresent: Boolean(document.querySelector('.succession-explorer-surface[data-explorer-route="timeline"], .succession-explorer-surface')),
      tinyText,
      bodyOverflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
    };
  }, { expectedLenses });

  check(initial.mapVisible, 'Timeline Map is visible');
  check(initial.navigatorVisible, 'full-arc navigator is visible');
  check(initial.lanesVisible && initial.laneCount >= 4, 'fixed lane index is visible');
  check(initial.viewportVisible, 'chronology viewport is visible');
  check(initial.chapterGrid >= 5, 'chapter ruler/grid is rendered');
  check(initial.contextCursor, 'active chapter cursor is rendered');
  check(initial.nodeCount > 0, 'timeline event marks are rendered');
  check(initial.lensContract, `Arrange by exposes ${expectedLenses.join(', ')}`);
  check(!initial.genericExplorerPresent, 'generic Connected Explorer is absent from the primary Timeline route');
  check(initial.tinyText.length === 0, `Timeline text floor stays at 11px (${JSON.stringify(initial.tinyText.slice(0, 5))})`);
  check(initial.bodyOverflow <= 2, `Timeline does not spill outside the desktop viewport (${initial.bodyOverflow}px)`);

  const clock = page.locator('.tcn-head__clock small');
  const beforeZoom = (await clock.textContent())?.trim() || '';
  const zoomIn = page.getByRole('button', { name: 'Zoom Timeline in' });
  if (await zoomIn.isEnabled()) {
    await zoomIn.click();
    await page.waitForTimeout(220);
    const afterZoom = (await clock.textContent())?.trim() || '';
    check(afterZoom !== beforeZoom, `semantic zoom changes the visible chapter window (${beforeZoom} → ${afterZoom})`);
  } else {
    report.assertions.push('semantic zoom already at minimum window');
  }

  await page.getByRole('button', { name: 'Full arc' }).click();
  await page.waitForTimeout(220);
  await page.locator('.tsf-depth button', { hasText: 'complete' }).click();
  await page.waitForTimeout(220);

  for (const label of expectedLenses) {
    const button = page.locator('.tsf-lensbar button', { hasText: label }).first();
    await button.click();
    await page.waitForTimeout(180);
    const state = await page.evaluate((expected) => {
      const active = document.querySelector('.tsf-lensbar button.is-active')?.textContent.trim();
      const lanes = document.querySelectorAll('.tsf-lanes > button').length;
      const marks = document.querySelectorAll('.tsf-node').length;
      const heading = document.querySelector('.tsf-head > div:first-child > span')?.textContent || '';
      return { active, lanes, marks, heading, matches: active === expected };
    }, label);
    check(state.matches, `${label} projection becomes active`);
    check(state.lanes > 0, `${label} projection renders lanes`);
    check(state.marks > 0, `${label} projection renders chronology marks`);
    check(state.heading.toUpperCase().includes(label.toUpperCase()), `${label} projection updates the map identity`);
  }

  check(runtimeErrors.length === 0, `Timeline has no runtime errors (${runtimeErrors.join(' | ')})`);
  await page.screenshot({ path: path.join(output, 'timeline-map.png'), fullPage: false });
  report.status = 'passed';
  await writeFile(path.join(output, 'results.json'), `${JSON.stringify(report, null, 2)}\n`);
  process.stdout.write(`Timeline Map QA passed: ${report.assertions.length} assertions across the primary map and six projections.\n`);
} catch (error) {
  report.status = 'failed';
  report.error = error.message;
  await page.screenshot({ path: path.join(output, 'timeline-map-failure.png'), fullPage: false }).catch(() => {});
  await writeFile(path.join(output, 'results.json'), `${JSON.stringify(report, null, 2)}\n`);
  throw error;
} finally {
  await context.close();
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
