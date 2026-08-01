import { createServer } from 'node:http';
import { access, mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const root = process.cwd();
const dist = path.join(root, 'dist/client');
const output = path.resolve(root, process.env.SUCCESSION_PHASE_5_QA_OUTPUT || '.visual-qa/succession-phase-5-workspaces');
const mime = { '.css': 'text/css; charset=utf-8', '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp' };
const cases = Object.freeze([
  ['story-delta', '/story/succession-contest/story?chapter=404', 'Chapter delta with explicit causality classes'],
  ['chapter-delta', '/story/succession-contest/chapter-records?chapter=404', 'Chapter delta with explicit causality classes'],
  ['relationship-focus', '/story/succession-contest/relationships?focus=character%3Akurapika&depth=2', 'Focused neighborhoods with direction and evidence'],
  ['black-whale-systems', '/story/succession-contest/black-whale?from=403&to=404', 'Ship-state comparison and infrastructure systems'],
  ['nen-matrix', '/story/succession-contest/nen', 'Ability interaction matrix without invented matchups'],
  ['research-provenance', '/story/succession-contest/research?entity=object%3Aseed-urn', 'Claim-level provenance and glossary enforcement'],
]);

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

await mkdir(output, { recursive: true });
const executablePath = process.env.CHROMIUM_PATH || chromium.executablePath();
const browser = await chromium.launch({ headless: true, executablePath, args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--no-zygote'] });
const server = await serve();
const base = `http://127.0.0.1:${server.address().port}`;
const results = [];
const failures = [];

try {
  for (const [id, route, heading] of cases) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const runtimeErrors = [];
    const consoleErrors = [];
    page.on('pageerror', (error) => runtimeErrors.push(error.message));
    page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
    try {
      await page.goto(`${base}${route}`, { waitUntil: 'domcontentloaded', timeout: 30_000 });
      const panel = page.locator('.succession-workspace-refinement');
      await panel.waitFor({ state: 'visible', timeout: 25_000 });
      await page.getByRole('heading', { name: heading, exact: true }).waitFor({ state: 'visible', timeout: 15_000 });
      const inspection = await panel.evaluate((node) => {
        const rect = node.getBoundingClientRect();
        const tiny = [...node.querySelectorAll('p, span, small, dt, dd, strong, button, label')]
          .filter((element) => {
            const style = getComputedStyle(element);
            const box = element.getBoundingClientRect();
            return style.display !== 'none' && style.visibility !== 'hidden' && box.width > 0 && box.height > 0;
          })
          .map((element) => ({ text: (element.textContent || '').trim().slice(0, 90), size: Number.parseFloat(getComputedStyle(element).fontSize) }))
          .filter((record) => record.size < 11);
        return {
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          text: (node.textContent || '').replace(/\s+/g, ' ').trim(),
          tiny,
          overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
          controls: node.querySelectorAll('button, input, select').length,
        };
      });
      if (inspection.width < 700 || inspection.height < 180) throw new Error(`Refinement panel rendered at ${inspection.width}×${inspection.height}`);
      if (inspection.tiny.length) throw new Error(`Text below 11px: ${JSON.stringify(inspection.tiny.slice(0, 5))}`);
      if (inspection.overflow > 1) throw new Error(`Desktop page overflows horizontally by ${inspection.overflow}px`);
      if (inspection.controls < 1) throw new Error('Refinement panel has no interactive controls');
      if (runtimeErrors.length) throw new Error(`Runtime errors: ${runtimeErrors.join(' | ')}`);
      if (consoleErrors.length) throw new Error(`Console errors: ${consoleErrors.join(' | ')}`);
      const screenshot = path.join(output, `${id}.png`);
      await page.screenshot({ path: screenshot, fullPage: true });
      results.push({ id, status: 'passed', route, heading, screenshot: path.relative(root, screenshot), inspection });
      console.log(`✓ ${id}`);
    } catch (error) {
      const screenshot = path.join(output, `${id}-failure.png`);
      await page.screenshot({ path: screenshot, fullPage: true }).catch(() => {});
      const failure = { id, status: 'failed', route, heading, error: error.message, screenshot: path.relative(root, screenshot), runtimeErrors, consoleErrors };
      failures.push(failure);
      results.push(failure);
      console.log(`✗ ${id} · ${error.message}`);
    } finally {
      await page.close();
    }
  }
} finally {
  await browser.close().catch(() => {});
  await new Promise((resolve) => server.close(resolve));
}

const summary = Object.freeze({ generatedAt: new Date().toISOString(), desktopCases: cases.length, passed: cases.length - failures.length, failed: failures.length });
await writeFile(path.join(output, 'report.json'), `${JSON.stringify({ summary, results }, null, 2)}\n`);
await writeFile(path.join(output, 'summary.json'), `${JSON.stringify(summary, null, 2)}\n`);
console.log(`\nSuccession Phase 5 workspace QA: ${summary.passed}/${summary.desktopCases} desktop workspaces passed.`);
if (failures.length) process.exitCode = 1;
