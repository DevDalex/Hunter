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

const report = { route: '/timeline', viewport, assertions: [], runtimeErrors };
const check = (condition, message) => {
  assert(condition, message);
  report.assertions.push(message);
};

try {
  await page.goto(`${base}/timeline`, { waitUntil: 'domcontentloaded', timeout: 20_000 });
  await page.waitForSelector('.timeline-archive-explorer', { state: 'visible', timeout: 20_000 });
  await page.waitForSelector('.timeline-workspace-switcher', { state: 'visible', timeout: 20_000 });

  const initial = await page.evaluate(() => {
    const graph = document.querySelector('.tae-density-graph');
    return {
      phases: document.querySelectorAll('.tae-phase-strip button').length,
      densityVisible: graph ? getComputedStyle(graph).display !== 'none' : false,
      events: document.querySelectorAll('.tae-event').length,
      modes: [...document.querySelectorAll('.tws-modes button strong')].map((node) => node.textContent.trim()),
      overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
    };
  });
  check(initial.phases === 7, `seven maintained phases render (${initial.phases})`);
  check(!initial.densityVisible, 'orange density graph is removed from the visible minimap');
  check(initial.events > 0 && initial.events <= 120, `Archive keeps the first event batch bounded (${initial.events})`);
  check(['Archive', 'Compare', 'Research', 'Space'].every((label) => initial.modes.includes(label)), 'four Timeline lenses are visible');
  check(!initial.modes.includes('Map'), 'Map lens is retired');
  check(initial.overflow <= 2, `Timeline does not spill outside the desktop viewport (${initial.overflow}px)`);

  await page.getByRole('button', { name: /^Full$/ }).click();
  await page.waitForTimeout(120);
  const fullRows = await page.locator('.tae-event').count();
  check(fullRows > 0 && fullRows <= 120, `Full chronology remains bounded to 120 first-batch rows (${fullRows})`);
  check(await page.locator('.tae-sequence').count() > 0, 'Archive events render inside sequence clusters');

  await page.locator('.tae-event').first().click();
  await page.waitForSelector('.tae-inspector__record', { state: 'visible' });
  let current = new URL(page.url());
  check(Boolean(current.searchParams.get('event') && current.searchParams.get('chapter')), 'selected event creates an addressable deep link');
  check(await page.getByRole('button', { name: /Open full dossier/i }).count() === 1, 'persistent inspector exposes the full dossier');

  await page.getByRole('button', { name: /Open full dossier/i }).click();
  await page.waitForSelector('.timeline-system-event-drawer .timeline-event-focus', { state: 'visible', timeout: 15_000 });
  check(new URL(page.url()).searchParams.get('focus') === 'dossier', 'full dossier state is URL-addressable');
  await page.getByRole('button', { name: /Return to timeline/i }).first().click();
  await page.waitForSelector('.timeline-system-event-drawer', { state: 'detached', timeout: 15_000 });

  const modes = page.locator('.tws-modes');
  check(await modes.getByRole('button', { name: /Map/i }).count() === 0, 'Map control is absent');

  await modes.getByRole('button', { name: /Compare/i }).click();
  await page.waitForSelector('.timeline-system-mode--compare', { state: 'visible', timeout: 15_000 });
  check(await page.locator('.timeline-comparison').count() === 1, 'Compare lens is mounted');

  await modes.getByRole('button', { name: /Research/i }).click();
  await page.waitForSelector('.timeline-system-mode--research', { state: 'visible', timeout: 15_000 });
  check(await page.getByText('See consequence, not just chronology.', { exact: true }).count() === 1, 'Research restores causal and Nen graph intelligence');

  await modes.getByRole('button', { name: /Space/i }).click();
  await page.waitForSelector('.timeline-system-mode--space', { state: 'visible', timeout: 15_000 });
  check(await page.locator('.timeline-spatial-intelligence').count() === 1, 'Space restores Black Whale spatial intelligence');

  await page.goto(`${base}/timeline?mode=story`, { waitUntil: 'domcontentloaded', timeout: 20_000 });
  await page.waitForSelector('.timeline-archive-explorer', { state: 'visible', timeout: 15_000 });
  check(await page.locator('.timeline-system-mode--story').count() === 0, 'legacy Map URLs fall back to Archive');

  await page.goto(`${base}/timeline?mode=archive&density=story&search=Kurapika`, { waitUntil: 'domcontentloaded', timeout: 20_000 });
  await page.waitForSelector('.timeline-archive-explorer', { state: 'visible', timeout: 15_000 });
  check(await page.getByPlaceholder('Search event, character, faction, location…').inputValue() === 'Kurapika', 'fresh navigation rehydrates Archive search state');
  check(await page.locator('.tae-density-modes button[aria-pressed="true"] strong').textContent() === 'Story', 'fresh navigation rehydrates semantic density');

  check(runtimeErrors.length === 0, `Timeline has no runtime errors (${runtimeErrors.join(' | ')})`);
  await page.screenshot({ path: path.join(output, 'timeline-complete-system.png'), fullPage: false });
  report.status = 'passed';
  await writeFile(path.join(output, 'results.json'), `${JSON.stringify(report, null, 2)}\n`);
  process.stdout.write(`Timeline System QA passed: ${report.assertions.length} assertions across Archive, dossier, Compare, Research, Space, legacy Map fallback, and deep-link hydration.\n`);
} catch (error) {
  report.status = 'failed';
  report.error = error.message;
  await page.screenshot({ path: path.join(output, 'timeline-complete-system-failure.png'), fullPage: false }).catch(() => {});
  await writeFile(path.join(output, 'results.json'), `${JSON.stringify(report, null, 2)}\n`);
  throw error;
} finally {
  await context.close();
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
