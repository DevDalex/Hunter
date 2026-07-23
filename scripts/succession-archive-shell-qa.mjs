import { createServer } from 'node:http';
import { access, mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const root = process.cwd();
const dist = path.join(root, 'dist/client');
const output = path.resolve(root, process.env.SUCCESSION_ARCHIVE_QA_OUTPUT || '.succession-archive-shell-qa');
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
  requestedExecutable, chromium.executablePath(), '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
]);
if (!executablePath) throw new Error('No Chromium executable is available.');
const browser = await chromium.launch({ headless: true, executablePath, args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--no-zygote'] });
const server = await serve();
const base = `http://127.0.0.1:${server.address().port}`;

try {
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

  await record('Succession root opens the dedicated archive shell', desktop, async () => {
    await desktop.goto(`${base}/story/succession-contest`, { waitUntil: 'domcontentloaded', timeout: 20_000 });
    await desktop.waitForSelector('.succession-archive[data-archive-route="archive"]', { timeout: 15_000 });
    if (await desktop.locator('.succession-archive__sidebar').count() !== 1) throw new Error('Persistent archive sidebar is missing or duplicated');
    const title = await desktop.locator('.succession-page-header h1').innerText();
    if (title.trim() !== 'Succession Contest Archive') throw new Error(`Unexpected archive title: ${title}`);
    if (await desktop.locator('.arc-page--succession-contest').count()) throw new Error('Legacy grouped arc page is still mounted at the archive root');
  });

  await record('Archive navigation opens a canonical character workspace', desktop, async () => {
    await desktop.locator('#succession-desktop-navigation a').filter({ hasText: 'Characters' }).click();
    await desktop.waitForSelector('.succession-directory .succession-entity-grid', { timeout: 15_000 });
    if (!desktop.url().endsWith('/story/succession-contest/characters')) throw new Error(`Characters route did not become canonical: ${desktop.url()}`);
    const cardCount = await desktop.locator('.succession-entity-grid > article').count();
    if (!cardCount) throw new Error('Canonical character cards did not render');
    await desktop.locator('.succession-entity-grid .succession-entity-link').first().click();
    await desktop.waitForSelector('.succession-entity-header', { timeout: 15_000 });
    if (!desktop.url().includes('entity=character%3A')) throw new Error('Entity detail did not preserve the stable namespaced ID in the route');
  });

  await record('Existing chapter reader route remains separate and functional', desktop, async () => {
    await desktop.goto(`${base}/story/succession-contest/chapters?chapter=414`, { waitUntil: 'domcontentloaded', timeout: 20_000 });
    await desktop.waitForSelector('.succession-reader[data-reader-chapter], .succession-reader .succession-reader__reader[data-reader-chapter="414"]', { timeout: 15_000 });
    if (await desktop.locator('.succession-archive').count()) throw new Error('Reference archive shell incorrectly wraps the image reader');
  });

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
  await record('Mobile archive uses an intentional keyboard-safe drawer', mobile, async () => {
    await mobile.goto(`${base}/story/succession-contest/locations`, { waitUntil: 'domcontentloaded', timeout: 20_000 });
    await mobile.waitForSelector('.succession-archive__mobile-bar', { timeout: 15_000 });
    await mobile.getByRole('button', { name: 'Archive' }).click();
    await mobile.waitForSelector('.succession-drawer [role="dialog"]', { timeout: 10_000 });
    const expanded = await mobile.getByRole('button', { name: 'Archive' }).getAttribute('aria-expanded');
    if (expanded !== 'true') throw new Error('Mobile archive button did not expose expanded state');
    await mobile.keyboard.press('Escape');
    await mobile.waitForSelector('.succession-drawer', { state: 'detached', timeout: 10_000 });
  });

  await desktop.close();
  await mobile.close();
} finally {
  await browser.close().catch(() => {});
  await new Promise((resolve) => server.close(resolve));
}

const summary = { generatedAt: new Date().toISOString(), checks: results.length, passed: results.length - failures.length, failed: failures.length };
await writeFile(path.join(output, 'report.json'), `${JSON.stringify({ summary, results }, null, 2)}\n`);
await writeFile(path.join(output, 'summary.json'), `${JSON.stringify(summary, null, 2)}\n`);
console.log(`\nSuccession Archive shell QA: ${summary.passed}/${summary.checks} checks passed.`);
if (failures.length) process.exitCode = 1;
