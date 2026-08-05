import { createServer } from 'node:http';
import { access, mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const root = process.cwd();
const dist = path.join(root, 'dist/client');
const output = path.resolve(root, process.env.SUCCESSION_PHASE_4_QA_OUTPUT || '.visual-qa/succession-phase-4-intelligence');
const requestedExecutable = process.env.CHROMIUM_PATH || '';
const results = [];
const failures = [];
const mime = {
  '.css': 'text/css; charset=utf-8', '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.json': 'application/json; charset=utf-8',
};

const firstAvailable = async (candidates) => {
  for (const candidate of candidates.filter(Boolean)) {
    try { await access(candidate); return candidate; } catch { /* continue */ }
  }
  return '';
};

const serve = async () => {
  await access(path.join(dist, 'index.html'));
  const server = createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
      let filename = path.join(dist, pathname === '/' ? 'index.html' : pathname);
      if (!filename.startsWith(dist)) throw new Error('Invalid path');
      try { if ((await stat(filename)).isDirectory()) filename = path.join(filename, 'index.html'); } catch { filename = path.join(dist, 'index.html'); }
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

const cases = Object.freeze([
  { id: 'overview', path: '/succession/research?mode=overview', selector: '.succession-intelligence-overview', text: 'Six tools built on the same canonical graph.' },
  { id: 'diff-403-404', path: '/succession/research?mode=diff&from=403&to=404', selector: '.succession-intelligence-diff', text: 'What changed between two chapter boundaries?' },
  { id: 'knowledge', path: '/succession/research?mode=knowledge', selector: '.succession-intelligence-knowledge', text: 'Who knows what, and who does not?' },
  { id: 'protocols', path: '/succession/research?mode=protocols', selector: '.succession-intelligence-protocols', text: 'Do not mix legal orders with Nen conditions.' },
  { id: 'seed-urn', path: '/succession/research?mode=artifacts&entity=object%3Aseed-urn', selector: '.succession-intelligence-detail', text: 'Seed Urn' },
  { id: 'compare-objects', path: '/succession/research?mode=compare&type=object&compare=object%3Aseed-urn%2Cobject%3Azhang-lei-coins', selector: '.succession-intelligence-table', text: 'Seed Urn' },
  { id: 'changes', path: '/succession/research?mode=changes', selector: '.succession-intelligence-changes', text: 'Editorial change log' },
]);

const inspect = (page) => page.evaluate(() => {
  const workbench = document.querySelector('.succession-intelligence-workbench');
  if (!workbench) return { exists: false };
  const rect = workbench.getBoundingClientRect();
  const style = getComputedStyle(workbench);
  const visible = style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) !== 0 && rect.width > 0 && rect.height > 0;
  const tiny = [...workbench.querySelectorAll('p, span, small, dt, dd, strong, b, button, label, th, td')]
    .filter((element) => {
      const elementStyle = getComputedStyle(element);
      const elementRect = element.getBoundingClientRect();
      return elementStyle.display !== 'none' && elementStyle.visibility !== 'hidden' && elementRect.width > 0 && elementRect.height > 0;
    })
    .map((element) => ({ text: (element.textContent || '').trim().slice(0, 90), size: Number.parseFloat(getComputedStyle(element).fontSize) }))
    .filter((record) => record.size < 11);
  return {
    exists: true,
    visible,
    width: Math.round(rect.width),
    tiny,
    overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
    tabCount: workbench.querySelectorAll('.succession-intelligence-tabs button').length,
    text: (workbench.textContent || '').replace(/\s+/g, ' ').trim(),
  };
});

await mkdir(output, { recursive: true });
const executablePath = await firstAvailable([
  requestedExecutable,
  chromium.executablePath(),
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
]);
if (!executablePath) throw new Error('No Chromium executable is available.');

const browser = await chromium.launch({
  headless: true,
  executablePath,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--no-zygote'],
});
const server = await serve();
const base = `http://127.0.0.1:${server.address().port}`;

try {
  for (const record of cases) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const runtimeErrors = [];
    const consoleErrors = [];
    page.on('pageerror', (error) => runtimeErrors.push(error.message));
    page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
    try {
      await page.goto(`${base}${record.path}`, { waitUntil: 'domcontentloaded', timeout: 30_000 });
      await page.waitForSelector('.succession-intelligence-workbench', { state: 'visible', timeout: 20_000 });
      const view = page.locator(record.selector).first();
      await view.waitFor({ state: 'visible', timeout: 20_000 });
      await view.getByText(record.text, { exact: false }).first().waitFor({ state: 'visible', timeout: 10_000 });
      const state = await inspect(page);
      if (!state.exists || !state.visible) throw new Error('Phase 4 workbench is not visible');
      if (state.tabCount !== 7) throw new Error(`Expected seven intelligence tabs, found ${state.tabCount}`);
      if (state.tiny.length) throw new Error(`Workbench contains text below 11px: ${JSON.stringify(state.tiny.slice(0, 6))}`);
      if (state.overflow > 1) throw new Error(`Desktop page overflows horizontally by ${state.overflow}px`);
      if (runtimeErrors.length) throw new Error(`Runtime errors: ${runtimeErrors.join(' | ')}`);
      if (consoleErrors.length) throw new Error(`Console errors: ${consoleErrors.join(' | ')}`);
      const screenshot = path.join(output, `${record.id}.png`);
      await page.screenshot({ path: screenshot, fullPage: true });
      results.push({ id: record.id, status: 'passed', screenshot: path.relative(root, screenshot), state });
      console.log(`✓ ${record.id}`);
    } catch (error) {
      const screenshot = path.join(output, `${record.id}-failure.png`);
      await page.screenshot({ path: screenshot, fullPage: true }).catch(() => {});
      const failure = { id: record.id, status: 'failed', error: error.message, screenshot: path.relative(root, screenshot), runtimeErrors, consoleErrors };
      failures.push(failure);
      results.push(failure);
      console.log(`✗ ${record.id} · ${error.message}`);
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
  desktopCases: cases.length,
  passed: cases.length - failures.length,
  failed: failures.length,
});
await writeFile(path.join(output, 'report.json'), `${JSON.stringify({ summary, results }, null, 2)}\n`);
await writeFile(path.join(output, 'summary.json'), `${JSON.stringify(summary, null, 2)}\n`);
console.log(`\nSuccession Phase 4 workbench QA: ${summary.passed}/${summary.desktopCases} desktop views passed.`);
if (failures.length) process.exitCode = 1;
