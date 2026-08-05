import { createServer } from 'node:http';
import { access, mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const root = process.cwd();
const dist = path.join(root, 'dist/client');
const output = path.resolve(root, process.env.SUCCESSION_PHASE_3_QA_OUTPUT || '.visual-qa/succession-phase-3-dossiers');
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
  {
    id: 'character-kurapika',
    path: '/succession/characters?entity=kurapika',
    dossierSelector: '.succession-character-dossier',
    expectedName: 'Kurapika',
  },
  {
    id: 'prince-halkenburg',
    path: '/succession/princes?entity=halkenburg-hui-guo-rou',
    dossierSelector: '.succession-prince-dossier',
    expectedName: 'Halkenburg Hui Guo Rou',
  },
  {
    id: 'queen-unma',
    path: '/succession/queens?entity=unma-hui-guo-rou',
    dossierSelector: '.succession-queen-dossier',
    expectedName: 'Unma Hui Guo Rou',
  },
]);

const inspectPanel = (page) => page.evaluate(() => {
  const panel = document.querySelector('.succession-information-consistency');
  if (!panel) return { exists: false };
  const rect = panel.getBoundingClientRect();
  const style = getComputedStyle(panel);
  const visible = style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) !== 0 && rect.width > 0 && rect.height > 0;
  const stateCells = [...panel.querySelectorAll('.succession-information-consistency__states > article')];
  const separation = [...panel.querySelectorAll('.succession-information-consistency__separation > section')];
  const tiny = [...panel.querySelectorAll('p, span, small, dt, dd, strong')]
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
    stateCells: stateCells.length,
    separation: separation.length,
    text: (panel.textContent || '').replace(/\s+/g, ' ').trim(),
    tiny,
    overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
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
      await page.waitForSelector(record.dossierSelector, { timeout: 20_000 });
      await page.waitForSelector('.succession-information-consistency', { state: 'visible', timeout: 20_000 });
      const panel = await inspectPanel(page);
      if (!panel.exists || !panel.visible) throw new Error('Normalized intelligence panel is not visible');
      if (panel.stateCells !== 3) throw new Error(`Expected three separated state cells, found ${panel.stateCells}`);
      if (panel.separation !== 2) throw new Error(`Expected authority and loyalty panels, found ${panel.separation}`);
      for (const label of ['Body', 'Identity', 'Consciousness', 'Official authority', 'Operational loyalty evidence', 'Private intent', 'Not inferred']) {
        if (!panel.text.includes(label)) throw new Error(`Panel is missing “${label}”`);
      }
      if (record.id !== 'character-kurapika' && !panel.text.includes('Royal dossier contract')) throw new Error('Royal dossier contract is missing');
      if (panel.tiny.length) throw new Error(`Panel contains text below 11px: ${JSON.stringify(panel.tiny.slice(0, 5))}`);
      if (panel.overflow > 1) throw new Error(`Desktop page overflows horizontally by ${panel.overflow}px`);
      const heading = page.getByRole('heading', { name: record.expectedName, exact: true }).first();
      await heading.waitFor({ state: 'visible', timeout: 10_000 });
      if (runtimeErrors.length) throw new Error(`Runtime errors: ${runtimeErrors.join(' | ')}`);
      if (consoleErrors.length) throw new Error(`Console errors: ${consoleErrors.join(' | ')}`);
      const screenshot = path.join(output, `${record.id}.png`);
      await page.screenshot({ path: screenshot, fullPage: true });
      results.push({ id: record.id, status: 'passed', screenshot: path.relative(root, screenshot), panel });
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
console.log(`\nSuccession Phase 3 dossier QA: ${summary.passed}/${summary.desktopCases} desktop dossiers passed.`);
if (failures.length) process.exitCode = 1;
