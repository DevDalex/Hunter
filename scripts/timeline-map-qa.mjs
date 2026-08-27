import { createServer } from 'node:http';
import { access, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const root = process.cwd();
const dist = path.join(root, 'dist/client');
const output = path.join(root, '.timeline-map-qa');
const viewport = { width: 1600, height: 1000 };
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
  await page.waitForSelector('.timeline-archive-explorer', { state: 'visible', timeout: 20_000 });
  await page.waitForSelector('.tae-stream', { state: 'visible', timeout: 20_000 });
  await page.waitForSelector('.tae-inspector', { state: 'visible', timeout: 20_000 });
  await page.waitForTimeout(300);

  const initial = await page.evaluate(() => {
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
    const densityLabels = [...document.querySelectorAll('.tae-density-modes button strong')].map((node) => node.textContent.trim());
    return {
      explorerVisible: isVisible(document.querySelector('.timeline-archive-explorer')),
      streamVisible: isVisible(document.querySelector('.tae-stream')),
      inspectorVisible: isVisible(document.querySelector('.tae-inspector')),
      phaseCount: document.querySelectorAll('.tae-phase-strip button').length,
      densityBars: document.querySelectorAll('.tae-density-graph > span').length,
      eventRows: document.querySelectorAll('.tae-event').length,
      densityLabels,
      genericExplorerPresent: Boolean(document.querySelector('.succession-explorer-surface[data-explorer-route="timeline"], .succession-explorer-surface')),
      bodyOverflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
    };
  });

  check(initial.explorerVisible, 'Timeline archive explorer is visible');
  check(initial.streamVisible, 'chronology stream is visible');
  check(initial.inspectorVisible, 'persistent event inspector is visible');
  check(initial.phaseCount === 7, `seven maintained story phases are visible (${initial.phaseCount})`);
  check(initial.densityBars === 48, `density graph renders 48 bounded buckets (${initial.densityBars})`);
  check(initial.eventRows > 0, 'recap view renders story-defining events');
  check(['Recap', 'Story', 'Full'].every((label) => initial.densityLabels.includes(label)), 'Recap, Story, and Full density modes are available');
  check(!initial.genericExplorerPresent, 'generic Connected Explorer is absent from the primary Timeline route');
  check(initial.bodyOverflow <= 2, `Timeline does not spill outside the desktop viewport (${initial.bodyOverflow}px)`);

  await page.getByRole('button', { name: /Full Complete chronology/i }).click();
  await page.waitForTimeout(220);
  const fullState = await page.evaluate(() => ({
    rows: document.querySelectorAll('.tae-event').length,
    loadMoreVisible: Boolean(document.querySelector('.tae-load-more')),
    streamStatus: document.querySelector('.tae-stream__head p')?.textContent || '',
  }));
  check(fullState.rows > 0 && fullState.rows <= 120, `Full mode bounds first DOM batch to at most 120 rows (${fullState.rows})`);
  check(fullState.loadMoreVisible, 'Full mode exposes progressive loading for the 1,555-event archive');
  check(/matching/.test(fullState.streamStatus), 'Full mode reports the complete filtered result count');

  const beforeLoad = fullState.rows;
  await page.locator('.tae-load-more').click();
  await page.waitForTimeout(180);
  const afterLoad = await page.locator('.tae-event').count();
  check(afterLoad > beforeLoad, `progressive loading expands the DOM batch (${beforeLoad} → ${afterLoad})`);

  const firstEvent = page.locator('.tae-event').first();
  await firstEvent.click();
  await page.waitForTimeout(160);
  const inspector = await page.evaluate(() => ({
    title: document.querySelector('.tae-inspector__title h2')?.textContent?.trim() || '',
    record: document.querySelector('.tae-inspector__description p')?.textContent?.trim() || '',
    facts: document.querySelectorAll('.tae-inspector__facts > div').length,
  }));
  check(Boolean(inspector.title), 'selecting an event opens its title in the persistent inspector');
  check(Boolean(inspector.record), 'selected event keeps its complete description in the inspector');
  check(inspector.facts >= 4, 'selected event exposes location, timing, evidence, and chapter metadata');

  const firstPhase = page.locator('.tae-phase-strip button').first();
  await firstPhase.click();
  await page.waitForTimeout(160);
  const activePhaseCount = await page.locator('.tae-phase-strip button.is-active').count();
  check(activePhaseCount === 1, 'story minimap can isolate one maintained phase');

  const search = page.locator('.tae-search input');
  await search.fill('Kurapika');
  await page.waitForTimeout(220);
  const searchedRows = await page.locator('.tae-event').count();
  check(searchedRows > 0, `timeline search returns matching events (${searchedRows})`);

  check(runtimeErrors.length === 0, `Timeline has no runtime errors (${runtimeErrors.join(' | ')})`);
  await page.screenshot({ path: path.join(output, 'timeline-explorer.png'), fullPage: false });
  report.status = 'passed';
  await writeFile(path.join(output, 'results.json'), `${JSON.stringify(report, null, 2)}\n`);
  process.stdout.write(`Timeline Explorer QA passed: ${report.assertions.length} assertions across the minimap, density modes, bounded event stream, search, and inspector.\n`);
} catch (error) {
  report.status = 'failed';
  report.error = error.message;
  await page.screenshot({ path: path.join(output, 'timeline-explorer-failure.png'), fullPage: false }).catch(() => {});
  await writeFile(path.join(output, 'results.json'), `${JSON.stringify(report, null, 2)}\n`);
  throw error;
} finally {
  await context.close();
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
