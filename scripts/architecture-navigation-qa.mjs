import { createServer } from 'node:http';
import { access, mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const root = process.cwd();
const dist = path.join(root, 'dist/client');
const output = path.resolve(root, process.env.ARCHITECTURE_QA_OUTPUT || '.architecture-navigation-qa');
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
      try { if ((await stat(filename)).isDirectory()) filename = path.join(dist, 'index.html'); } catch { filename = path.join(dist, 'index.html'); }
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

const record = async (name, page, test) => {
  const runtimeErrors = [];
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  try {
    await test();
    if (runtimeErrors.length) throw new Error(`Runtime errors: ${runtimeErrors.join(' | ')}`);
    results.push({ name, status: 'passed' });
    process.stdout.write(`✓ ${name}\n`);
  } catch (error) {
    const screenshot = path.join(output, `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`);
    await page.screenshot({ path: screenshot, fullPage: true }).catch(() => {});
    const failure = { name, status: 'failed', error: error.message, screenshot: path.relative(root, screenshot), runtimeErrors };
    failures.push(failure);
    results.push(failure);
    process.stdout.write(`✗ ${name} · ${error.message}\n`);
  }
};

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
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

  await record('Global Timeline owns series and Succession chronology', page, async () => {
    await page.goto(`${base}/timeline`, { waitUntil: 'domcontentloaded', timeout: 20_000 });
    await page.waitForSelector('.timeline-workspace', { timeout: 15_000 });
    const active = await page.locator('.header-links a[aria-current="page"]').innerText();
    if (active.trim() !== 'Timeline') throw new Error(`Primary navigation highlights ${active} instead of Timeline`);
    if (await page.locator('.timeline-workspace').count() !== 1) throw new Error('Timeline shell is duplicated');

    await page.locator('.timeline-workspace__arc-rail button').filter({ hasText: 'Succession Contest' }).click();
    await page.getByRole('button', { name: 'Detailed events' }).click();
    await page.waitForSelector('.timeline-section', { timeout: 15_000 });
    if (!page.url().includes('arc=succession-contest') || !page.url().includes('scope=events')) throw new Error(`Succession detail route was not preserved: ${page.url()}`);
    if (await page.locator('.timeline-workspace').count() !== 1) throw new Error('Detailed events replaced the global Timeline shell');
  });

  await record('Legacy Succession timeline route resolves into global Timeline', page, async () => {
    await page.goto(`${base}/story/succession-contest/timeline`, { waitUntil: 'domcontentloaded', timeout: 20_000 });
    await page.waitForSelector('.timeline-workspace .timeline-section', { timeout: 15_000 });
    const active = await page.locator('.header-links a[aria-current="page"]').innerText();
    if (active.trim() !== 'Timeline') throw new Error('Legacy voyage route still presents itself as Story');
  });

  await record('Organizations retains one shell across domain views', page, async () => {
    await page.goto(`${base}/organizations?view=institutions`, { waitUntil: 'domcontentloaded', timeout: 20_000 });
    await page.waitForSelector('.organization-workspace__institutions', { timeout: 15_000 });
    const active = await page.locator('.header-links a[aria-current="page"]').innerText();
    if (active.trim() !== 'Organizations') throw new Error(`Primary navigation highlights ${active} instead of Organizations`);
    if (await page.locator('.organization-workspace').count() !== 1) throw new Error('Organization shell is missing or duplicated');
    if (await page.locator('.systems-desk, .organization-archive').count()) throw new Error('Legacy conditional organization components are still mounted');

    await page.getByRole('button', { name: 'Factions' }).click();
    await page.waitForSelector('.organization-workspace__factions', { timeout: 15_000 });
    if (!page.url().includes('view=factions')) throw new Error('Organization view change did not update the route');
    if (await page.locator('.organization-workspace').count() !== 1) throw new Error('Changing organization views replaced the page shell');
  });

  await record('Misplaced conflict route moves to Fights', page, async () => {
    await page.goto(`${base}/organizations?view=conflicts`, { waitUntil: 'domcontentloaded', timeout: 20_000 });
    await page.waitForSelector('.conflict-archive', { timeout: 15_000 });
    const active = await page.locator('.header-links a[aria-current="page"]').innerText();
    if (active.trim() !== 'Fights') throw new Error(`Legacy conflict route highlights ${active} instead of Fights`);
    if (await page.locator('.organization-workspace').count()) throw new Error('Conflict anatomy remains mounted inside Organizations');
  });

  await page.close();
} finally {
  await browser.close().catch(() => {});
  await new Promise((resolve) => server.close(resolve));
}

const summary = { generatedAt: new Date().toISOString(), checks: results.length, passed: results.length - failures.length, failed: failures.length };
await writeFile(path.join(output, 'report.json'), `${JSON.stringify({ summary, results }, null, 2)}\n`);
await writeFile(path.join(output, 'summary.json'), `${JSON.stringify(summary, null, 2)}\n`);
console.log(`\nArchitecture navigation QA: ${summary.passed}/${summary.checks} checks passed.`);
if (failures.length) process.exitCode = 1;
