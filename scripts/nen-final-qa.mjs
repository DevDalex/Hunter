import { createServer } from 'node:http';
import { access, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const root = process.cwd();
const dist = path.join(root, 'dist/client');
const output = path.resolve(root, process.env.NEN_FINAL_QA_OUTPUT || '.browser-qa/nen-final');
const requestedExecutable = process.env.CHROMIUM_PATH || '';
const categories = ['Enhancement', 'Transmutation', 'Conjuration', 'Specialization', 'Manipulation', 'Emission'];
const NEN_ROUTE = '/story/succession-contest/nen?scope=encyclopedia';

const mime = {
  '.css': 'text/css; charset=utf-8', '.gif': 'image/gif', '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.jpeg': 'image/jpeg', '.jpg': 'image/jpeg', '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml',
  '.webp': 'image/webp', '.zip': 'application/zip',
};

const firstAvailable = async (candidates) => {
  for (const candidate of candidates.filter(Boolean)) {
    try { await access(candidate); return candidate; } catch { /* continue */ }
  }
  return '';
};

const executablePath = await firstAvailable([
  requestedExecutable,
  chromium.executablePath(),
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
]);
if (!executablePath) throw new Error('No Chromium executable is available for final Nen QA.');

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

const collectRouteDiagnostics = async (page, runtimeErrors = []) => {
  const state = await page.evaluate(() => ({
    href: window.location.href,
    title: document.title,
    bodyText: document.body?.innerText?.slice(0, 1600) || '',
    integratedReference: Boolean(document.querySelector('.succession-integrated-reference')),
    routeLoading: Boolean(document.querySelector('.route-loading')),
    notFound: Boolean(document.body?.innerText?.includes('Route removed')),
    mainHtmlPrefix: document.querySelector('main')?.innerHTML?.slice(0, 1200) || '',
  })).catch((error) => ({ diagnosticError: error.message }));
  return { ...state, runtimeErrors };
};

const waitForNenMap = async (page, runtimeErrors = [], timeout = 12_000) => {
  try {
    await page.waitForSelector('.nen-expansion-map[data-qa-pan-zoom-canvas="true"]', { timeout });
  } catch (error) {
    const diagnostics = await collectRouteDiagnostics(page, runtimeErrors);
    throw new Error(`Nen map did not render: ${JSON.stringify(diagnostics)}; ${error.message}`);
  }
};

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  executablePath,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--no-zygote'],
});
const server = await serve();
const base = `http://127.0.0.1:${server.address().port}`;
const results = [];
const failures = [];

try {
  for (const categoryName of categories) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const runtimeErrors = [];
    page.on('pageerror', (error) => runtimeErrors.push(error.message));
    try {
      await page.goto(`${base}${NEN_ROUTE}`, { waitUntil: 'domcontentloaded', timeout: 20_000 });
      await waitForNenMap(page, runtimeErrors);
      await page.waitForTimeout(180);

      const category = page.locator('.nen-pipe-node.is-category').filter({ hasText: categoryName }).first();
      const clipPath = await category.evaluate((element) => getComputedStyle(element).clipPath);
      if (!clipPath.includes('polygon')) throw new Error(`${categoryName} is not rendered as a hexagonal node`);

      await category.click();
      await page.waitForFunction((name) => {
        const node = [...document.querySelectorAll('.nen-pipe-node.is-category')].find((item) => item.textContent.includes(name));
        return node?.getAttribute('aria-expanded') === 'true';
      }, categoryName);
      await page.waitForSelector('.nen-pipe-node.is-expanded-user');
      await page.waitForSelector('.nen-pipe-node.is-named-ability');

      const userCount = await page.locator('.nen-pipe-node.is-expanded-user').count();
      const abilityCount = await page.locator('.nen-pipe-node.is-named-ability').count();
      if (userCount < 5) throw new Error(`${categoryName} reveals only ${userCount} secondary or placement users`);
      if (abilityCount < 3) throw new Error(`${categoryName} reveals only ${abilityCount} maintained ability cards`);

      const ability = page.locator('.nen-pipe-node.is-named-ability').first();
      await ability.click();
      await page.waitForFunction(() => document.querySelector('.nen-pipe-inspector h2')?.textContent?.trim());
      const inspector = await page.locator('.nen-pipe-inspector').innerText();
      for (const label of ['Natural category', 'Activation', 'Cost / restriction']) {
        if (!inspector.includes(label)) throw new Error(`${categoryName} ability inspector is missing ${label}`);
      }

      await page.keyboard.press('Escape');
      await page.waitForTimeout(80);
      if (await page.locator('.nen-pipe-node.is-expanded-user').count()) throw new Error(`${categoryName} users remained after Escape`);
      if (await page.locator('.nen-pipe-node.is-named-ability').count()) throw new Error(`${categoryName} abilities remained after Escape`);
      if (runtimeErrors.length) throw new Error(`runtime errors: ${runtimeErrors.join(' | ')}`);

      results.push({ category: categoryName, status: 'passed', users: userCount, abilities: abilityCount });
      process.stdout.write(`✓ ${categoryName}: ${userCount} users, ${abilityCount} abilities\n`);
    } catch (error) {
      const screenshot = path.join(output, `${categoryName.toLowerCase()}-failure.png`);
      await page.screenshot({ path: screenshot, fullPage: true }).catch(() => {});
      const failure = { category: categoryName, status: 'failed', error: error.message, screenshot: path.relative(root, screenshot), runtimeErrors };
      results.push(failure);
      failures.push(failure);
      process.stdout.write(`✗ ${categoryName} · ${error.message}\n`);
    } finally {
      await page.close().catch(() => {});
    }
  }

  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const runtimeErrors = [];
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  await page.goto(`${base}${NEN_ROUTE}`, { waitUntil: 'domcontentloaded', timeout: 20_000 });
  await waitForNenMap(page, runtimeErrors, 30_000);
  const markerCount = await page.locator('.nen-placement-marker').count();
  if (markerCount < 18) failures.push({ category: 'spectrum', status: 'failed', error: `only ${markerCount} placement markers rendered` });
  else process.stdout.write(`✓ spectrum: ${markerCount} placement markers\n`);
  await page.close();
} finally {
  await browser.close().catch(() => {});
  await new Promise((resolve) => server.close(resolve));
}

const summary = {
  generatedAt: new Date().toISOString(),
  categories: categories.length,
  passed: results.filter((item) => item.status === 'passed').length,
  failed: failures.length,
};
await writeFile(path.join(output, 'report.json'), `${JSON.stringify({ summary, results, failures }, null, 2)}\n`);
console.log(`\nFinal Nen QA: ${summary.passed}/${summary.categories} category focuses passed.`);
if (failures.length) process.exitCode = 1;
