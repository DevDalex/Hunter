import { createServer } from 'node:http';
import { access, mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const root = process.cwd();
const dist = path.join(root, 'dist/client');
const output = path.resolve(root, process.env.SUCCESSION_ARCHITECTURE_HEIGHT_QA_OUTPUT || '.visual-qa/succession-architecture-height');
const mime = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
};
const cases = Object.freeze([
  { id: 'reported-1680x928', width: 1680, height: 928 },
  { id: 'baseline-1440x1000', width: 1440, height: 1000 },
  { id: 'widescreen-1920x1080', width: 1920, height: 1080 },
]);

const serve = async () => {
  await access(path.join(dist, 'index.html'));
  const server = createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
      let filename = path.join(dist, pathname === '/' ? 'index.html' : pathname);
      if (!filename.startsWith(dist)) throw new Error('Invalid path');
      try {
        if ((await stat(filename)).isDirectory()) filename = path.join(filename, 'index.html');
      } catch {
        filename = path.join(dist, 'index.html');
      }
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

await mkdir(output, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROMIUM_PATH || chromium.executablePath(),
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--no-zygote'],
});
const server = await serve();
const base = `http://127.0.0.1:${server.address().port}`;
const results = [];
const failures = [];

try {
  for (const testCase of cases) {
    const page = await browser.newPage({ viewport: { width: testCase.width, height: testCase.height } });
    const runtimeErrors = [];
    page.on('pageerror', (error) => runtimeErrors.push(error.message));

    try {
      await page.goto(`${base}/story/succession-contest`, { waitUntil: 'domcontentloaded', timeout: 30_000 });
      const board = page.locator('.succession-architecture-board');
      await board.waitFor({ state: 'visible', timeout: 20_000 });
      await page.waitForFunction(() => document.querySelector('.succession-architecture-board')?.dataset.architectureHeightFit === 'fitted', null, { timeout: 20_000 });
      await page.waitForTimeout(250);

      const inspection = await board.evaluate((node) => {
        const sheet = node.querySelector('.succession-architecture__sheet');
        const lower = node.querySelector('.succession-architecture__lower-grid');
        const footer = node.querySelector('.succession-architecture__document-footer');
        const sheetRect = sheet.getBoundingClientRect();
        const lowerRect = lower.getBoundingClientRect();
        const footerRect = footer.getBoundingClientRect();
        return {
          fit: node.dataset.architectureHeightFit,
          layoutHeight: Number(node.dataset.architectureLayoutHeight),
          contentHeight: Number(node.dataset.architectureContentHeight),
          sheetClientHeight: sheet.clientHeight,
          sheetScrollHeight: sheet.scrollHeight,
          sheetEdges: {
            top: sheetRect.top,
            right: innerWidth - sheetRect.right,
            bottom: innerHeight - sheetRect.bottom,
            left: sheetRect.left,
          },
          lowerBottomGap: sheetRect.bottom - lowerRect.bottom,
          footerBottomGap: sheetRect.bottom - footerRect.bottom,
          footerViewportGap: innerHeight - footerRect.bottom,
          horizontalOverflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
          verticalOverflow: Math.max(document.documentElement.scrollHeight, document.body.scrollHeight) - innerHeight,
          bodyOverflow: getComputedStyle(document.body).overflow,
        };
      });

      const edgeValues = Object.values(inspection.sheetEdges);
      if (inspection.fit !== 'fitted') throw new Error(`Runtime reports ${inspection.fit}`);
      if (inspection.contentHeight > inspection.layoutHeight + 1) throw new Error(`Content ${inspection.contentHeight}px exceeds layout ${inspection.layoutHeight}px`);
      if (inspection.sheetScrollHeight > inspection.sheetClientHeight + 1) throw new Error(`Sheet clips ${inspection.sheetScrollHeight - inspection.sheetClientHeight}px of internal content`);
      if (edgeValues.some((value) => Math.abs(value) > 1.5)) throw new Error(`Sheet misses viewport edges: ${JSON.stringify(inspection.sheetEdges)}`);
      if (inspection.lowerBottomGap < -1) throw new Error(`Lower band extends ${Math.abs(inspection.lowerBottomGap)}px below sheet`);
      if (inspection.footerBottomGap < -1) throw new Error(`Document footer extends ${Math.abs(inspection.footerBottomGap)}px below sheet`);
      if (inspection.footerViewportGap < -1) throw new Error(`Document footer extends ${Math.abs(inspection.footerViewportGap)}px below viewport`);
      if (inspection.horizontalOverflow > 1 || inspection.verticalOverflow > 1) throw new Error(`Page overflow is ${inspection.horizontalOverflow}px × ${inspection.verticalOverflow}px`);
      if (inspection.bodyOverflow !== 'hidden') throw new Error(`Body overflow is ${inspection.bodyOverflow}`);
      if (runtimeErrors.length) throw new Error(`Runtime errors: ${runtimeErrors.join(' | ')}`);

      const screenshot = path.join(output, `${testCase.id}.png`);
      await page.screenshot({ path: screenshot, fullPage: false });
      results.push({ ...testCase, status: 'passed', inspection, screenshot: path.relative(root, screenshot) });
      console.log(`✓ ${testCase.id} · measured ${inspection.contentHeight}px inside ${inspection.layoutHeight}px`);
    } catch (error) {
      const screenshot = path.join(output, `${testCase.id}-failure.png`);
      await page.screenshot({ path: screenshot, fullPage: false }).catch(() => {});
      failures.push({ ...testCase, error: error.message, runtimeErrors, screenshot: path.relative(root, screenshot) });
      results.push({ ...testCase, status: 'failed', error: error.message, runtimeErrors, screenshot: path.relative(root, screenshot) });
      console.log(`✗ ${testCase.id} · ${error.message}`);
    } finally {
      await page.close();
    }
  }
} finally {
  await browser.close().catch(() => {});
  await new Promise((resolve) => server.close(resolve));
}

const summary = Object.freeze({
  generatedAt: new Date().toISOString(),
  cases: cases.length,
  passed: cases.length - failures.length,
  failed: failures.length,
});
await writeFile(path.join(output, 'report.json'), `${JSON.stringify({ summary, results }, null, 2)}\n`);
console.log(`\nSuccession architecture height QA: ${summary.passed}/${summary.cases} viewport shapes passed.`);
if (failures.length) process.exitCode = 1;
