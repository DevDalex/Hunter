import { createServer } from 'node:http';
import { access, mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const root = process.cwd();
const dist = path.join(root, 'dist/client');
const output = path.resolve(root, process.env.BLACK_WHALE_3D_QA_OUTPUT || '.black-whale-3d-qa');
const requestedExecutable = process.env.CHROMIUM_PATH || '';
const results = [];
const failures = [];
const mime = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

const firstAvailable = async (candidates) => {
  for (const candidate of candidates.filter(Boolean)) {
    try {
      await access(candidate);
      return candidate;
    } catch {
      // Continue to the next browser candidate.
    }
  }
  return '';
};

const resolveFile = async (pathname) => {
  const relative = pathname.replace(/^\/+/, '');
  const candidate = path.resolve(dist, relative || 'index.html');
  if (!candidate.startsWith(path.resolve(dist))) throw new Error('Invalid request path.');
  try {
    const information = await stat(candidate);
    if (information.isDirectory()) return path.join(candidate, 'index.html');
    return candidate;
  } catch {
    const directoryIndex = path.join(candidate, 'index.html');
    try {
      await access(directoryIndex);
      return directoryIndex;
    } catch {
      return path.join(dist, 'index.html');
    }
  }
};

const serve = async () => {
  await access(path.join(dist, 'succession/black-whale-3d/index.html'));
  const server = createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
      const filename = await resolveFile(pathname);
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
  try {
    await test();
    results.push({ name, status: 'passed' });
    process.stdout.write(`✓ ${name}\n`);
  } catch (error) {
    const screenshot = path.join(output, `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`);
    await page.screenshot({ path: screenshot, fullPage: true }).catch(() => {});
    const failure = {
      name,
      status: 'failed',
      error: error.message,
      screenshot: path.relative(root, screenshot),
    };
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
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, reducedMotion: 'reduce' });
  const runtimeErrors = [];
  const consoleErrors = [];
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });

  await record('Phase 7 dashboard and viewers survive full load', page, async () => {
    await page.goto(`${base}/succession/black-whale-3d`, { waitUntil: 'domcontentloaded', timeout: 30_000 });
    await page.waitForSelector('#status', { timeout: 30_000 });
    await page.waitForSelector('#spatial-graph', { timeout: 30_000 });
    await page.waitForSelector('#exterior-blockout', { timeout: 30_000 });
    await page.waitForSelector('#tier-blockout', { timeout: 30_000 });
    await page.waitForTimeout(2_000);

    for (const selector of ['#status', '#spatial-graph', '#exterior-blockout', '#tier-blockout']) {
      if (await page.locator(selector).count() !== 1) throw new Error(`${selector} was removed or duplicated after full load.`);
    }
    if (runtimeErrors.length) throw new Error(`Runtime errors: ${runtimeErrors.join(' | ')}`);
    if (consoleErrors.length) throw new Error(`Console errors: ${consoleErrors.join(' | ')}`);

    const bodyText = await page.locator('body').innerText();
    if (!bodyText.includes('Evidence foundation complete. Exterior refinement active.')) throw new Error('Current Phase 7 status copy is missing.');
    const refinementKicker = (await page.locator('#exterior-blockout .kicker').innerText()).toLowerCase();
    const refinementHeading = (await page.locator('#exterior-blockout h2').innerText()).toLowerCase();
    if (!refinementKicker.includes('phase 7.3r') || !refinementKicker.includes('exterior refinement')) throw new Error(`Phase 7.3R kicker is incorrect: ${refinementKicker}`);
    if (!refinementHeading.includes('recognizable whale silhouette')) throw new Error(`Phase 7.3R heading is incorrect: ${refinementHeading}`);
    if (bodyText.includes('Geometry remains at zero')) throw new Error('Stale zero-geometry copy is still visible.');
    if (bodyText.includes('Phase 7.2 remains blocked')) throw new Error('Stale Phase 7.2 block is still visible.');
  });

  await record('Refined exterior canvas renders and responds', page, async () => {
    const canvas = page.locator('#exterior-canvas');
    await canvas.waitFor({ state: 'visible', timeout: 15_000 });
    const initialSignature = await canvas.evaluate((element) => {
      const context = element.getContext('2d');
      const colors = new Set();
      for (let y = 20; y < element.height; y += 60) {
        for (let x = 20; x < element.width; x += 60) {
          const pixel = context.getImageData(x, y, 1, 1).data;
          colors.add(`${pixel[0]},${pixel[1]},${pixel[2]},${pixel[3]}`);
        }
      }
      return { colors: colors.size, image: element.toDataURL() };
    });
    if (initialSignature.colors < 8) throw new Error(`Refined canvas has insufficient visual variation: ${initialSignature.colors} sampled colors.`);

    await page.locator('#exterior-blockout [data-view="side"]').click();
    const sideImage = await canvas.evaluate((element) => element.toDataURL());
    if (sideImage === initialSignature.image) throw new Error('Side-view control did not redraw the refined hull.');

    await page.locator('#cutaway-toggle').check();
    const cutawayImage = await canvas.evaluate((element) => element.toDataURL());
    if (cutawayImage === sideImage) throw new Error('Cutaway control did not redraw the refined hull.');

    await page.locator('#exterior-object-select').selectOption('bw3d.refinement.whale-head-mass');
    const evidenceText = await page.locator('#exterior-evidence').innerText();
    if (!evidenceText.includes('bw3d.refinement.whale-head-mass')) throw new Error('Whale-head refinement evidence record did not open.');
    if (!evidenceText.includes('No canonical mouth dimensions')) throw new Error('Whale-head uncertainty prohibition is missing.');
  });

  await record('Tier and graph viewers remain interactive beside refinement', page, async () => {
    if (await page.locator('#tier-canvas').count() !== 1) throw new Error('Tier canvas is missing.');
    if (await page.locator('#spatial-graph details').count() < 3) throw new Error('Spatial graph analytical panels are missing.');
    const tierCanvas = page.locator('#tier-canvas');
    const before = await tierCanvas.evaluate((element) => element.toDataURL());
    await page.locator('#tier-blockout [data-tier-view="exploded"]').click();
    const after = await tierCanvas.evaluate((element) => element.toDataURL());
    if (before === after) throw new Error('Exploded-tier control did not redraw the tier viewer.');
  });

  await page.locator('#cutaway-toggle').uncheck();
  await page.locator('#tiers-toggle').uncheck();
  await page.locator('#unknown-toggle').uncheck();
  await page.locator('#exterior-blockout [data-view="hero"]').click();
  await page.locator('#exterior-object-select').selectOption('bw3d.refinement.head-identity-cues');
  await page.locator('#exterior-blockout').screenshot({ path: path.join(output, 'refined-exterior-hero.png') });
  await page.screenshot({ path: path.join(output, 'refined-exterior-full-page.png'), fullPage: true });
  await page.close();
} finally {
  await browser.close().catch(() => {});
  await new Promise((resolve) => server.close(resolve));
}

const summary = {
  generatedAt: new Date().toISOString(),
  checks: results.length,
  passed: results.length - failures.length,
  failed: failures.length,
};
await writeFile(path.join(output, 'report.json'), `${JSON.stringify({ summary, results }, null, 2)}\n`);
await writeFile(path.join(output, 'summary.json'), `${JSON.stringify(summary, null, 2)}\n`);
console.log(`\nBlack Whale 3D browser QA: ${summary.passed}/${summary.checks} checks passed.`);
if (failures.length) process.exitCode = 1;
