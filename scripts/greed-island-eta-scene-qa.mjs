import { createServer } from 'node:http';
import { access, mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const root = process.cwd();
const dist = path.join(root, 'dist/client');
const output = path.resolve(root, process.env.GREED_ISLAND_ETA_QA_OUTPUT || '.greed-island-eta-qa');
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
    const screenshot = path.join(output, `eta-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`);
    await page.screenshot({ path: screenshot, fullPage: true }).catch(() => {});
    const failure = { name, status: 'failed', error: error.message, screenshot: path.relative(root, screenshot), runtimeErrors };
    failures.push(failure);
    results.push(failure);
    process.stdout.write(`✗ ${name} · ${error.message}\n`);
  }
};

const openEta = async (page, base) => {
  await page.goto(`${base}/#/series/greed-island`, { waitUntil: 'domcontentloaded', timeout: 20_000 });
  await page.waitForSelector('[data-eta-scene]', { timeout: 15_000 });
  await page.waitForFunction(() => !document.querySelector('.route-loading'), null, { timeout: 12_000 }).catch(() => {});
  await page.locator('[data-eta-scene]').scrollIntoViewIfNeeded();
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
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await record('Eta retro dialogue and speaking synchronization', desktop, async () => {
    await openEta(desktop, base);
    const scene = desktop.locator('[data-eta-scene]');
    const imageState = await scene.evaluate((element) => {
      const images = [...element.querySelectorAll('img')];
      return images.map((image) => ({ src: image.getAttribute('src'), width: image.naturalWidth, complete: image.complete }));
    });
    const missing = imageState.filter((image) => !image.complete || image.width < 1);
    if (missing.length) throw new Error(`Eta scene images did not load: ${JSON.stringify(missing)}`);
    for (const required of ['eta-tutorial-room.webp', 'eta-closed.webp', 'eta-mouth-open-patch.webp', 'eta-blink-patch.webp']) {
      if (!imageState.some((image) => image.src?.includes(required))) throw new Error(`Eta scene is missing ${required}.`);
    }
    const bubbleResponse = await desktop.request.get(`${base}/media/greed-island/eta/eta-dialogue-bubble.webp`);
    if (!bubbleResponse.ok()) throw new Error(`Eta dialogue bubble returned ${bubbleResponse.status()}.`);

    if ((await scene.getAttribute('data-eta-state')) !== 'speaking') throw new Error('Eta did not begin in speaking state.');
    const text = scene.locator('.gi-eta-scene__text');
    const firstLength = (await text.innerText()).length;
    await desktop.waitForTimeout(260);
    const secondLength = (await text.innerText()).length;
    if (secondLength <= firstLength) throw new Error(`Typewriter did not advance: ${firstLength} → ${secondLength}.`);
    await desktop.waitForFunction(() => document.querySelector('.gi-eta-scene__expression--mouth')?.classList.contains('is-visible'), null, { timeout: 1500 });

    await scene.locator('[data-eta-dialogue]').click();
    await desktop.waitForFunction(() => document.querySelector('[data-eta-scene]')?.getAttribute('data-eta-state') === 'idle', null, { timeout: 1500 });
    const completedText = await text.innerText();
    if (completedText.length < 40) throw new Error(`Reveal action produced an incomplete line: ${completedText}`);
    if (!(await scene.locator('.gi-eta-scene__prompt').getAttribute('class'))?.includes('is-ready')) throw new Error('Continue prompt did not appear after the line completed.');

    await scene.locator('[data-eta-dialogue]').click();
    await desktop.waitForFunction(() => document.querySelector('.gi-eta-scene__lesson')?.textContent?.includes('LESSON 02'), null, { timeout: 2500 });
  });
  await desktop.close();

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await record('Eta mobile scene containment', mobile, async () => {
    await openEta(mobile, base);
    const state = await mobile.evaluate(() => {
      const scene = document.querySelector('[data-eta-scene]');
      const dialogue = document.querySelector('[data-eta-dialogue]');
      return {
        overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
        sceneWidth: scene?.getBoundingClientRect().width || 0,
        dialogueWidth: dialogue?.getBoundingClientRect().width || 0,
        dialogueLeft: dialogue?.getBoundingClientRect().left || 0,
        dialogueRight: dialogue?.getBoundingClientRect().right || 0,
      };
    });
    if (state.overflow > 1) throw new Error(`Eta scene overflowed the mobile viewport by ${state.overflow}px.`);
    if (state.sceneWidth > 390.5 || state.dialogueWidth > 390.5 || state.dialogueLeft < -0.5 || state.dialogueRight > 390.5) {
      throw new Error(`Eta mobile containment failed: ${JSON.stringify(state)}.`);
    }
  });
  await mobile.close();

  const reduced = await browser.newPage({ viewport: { width: 1024, height: 768 }, reducedMotion: 'reduce' });
  await record('Eta reduced-motion fallback', reduced, async () => {
    await openEta(reduced, base);
    const scene = reduced.locator('[data-eta-scene]');
    if ((await scene.getAttribute('data-eta-state')) !== 'reduced-motion') throw new Error('Eta scene did not enter reduced-motion state.');
    const state = await scene.evaluate((element) => {
      const text = element.querySelector('.gi-eta-scene__text')?.textContent || '';
      const sprite = element.querySelector('.gi-eta-scene__sprite');
      const mouth = element.querySelector('.gi-eta-scene__expression--mouth');
      const blink = element.querySelector('.gi-eta-scene__expression--blink');
      return {
        textLength: text.length,
        spriteAnimation: sprite ? getComputedStyle(sprite).animationName : '',
        mouthDisplay: mouth ? getComputedStyle(mouth).display : '',
        blinkDisplay: blink ? getComputedStyle(blink).display : '',
        reduced: matchMedia('(prefers-reduced-motion: reduce)').matches,
      };
    });
    if (!state.reduced) throw new Error('Reduced-motion emulation was not active.');
    if (state.textLength < 40) throw new Error(`Reduced-motion text was not immediately complete: ${state.textLength}.`);
    if (state.spriteAnimation !== 'none') throw new Error(`Eta sprite still animates under reduced motion: ${state.spriteAnimation}.`);
    if (state.mouthDisplay !== 'none' || state.blinkDisplay !== 'none') throw new Error(`Eta expression patches remain active: ${JSON.stringify(state)}.`);
  });
  await reduced.close();
} finally {
  await browser.close().catch(() => {});
  await new Promise((resolve) => server.close(resolve));
}

const summary = { generatedAt: new Date().toISOString(), checks: results.length, passed: results.length - failures.length, failed: failures.length };
await writeFile(path.join(output, 'eta-report.json'), `${JSON.stringify({ summary, results }, null, 2)}\n`);
await writeFile(path.join(output, 'eta-summary.json'), `${JSON.stringify(summary, null, 2)}\n`);
console.log(`\nGreed Island Eta scene QA: ${summary.passed}/${summary.checks} browser checks passed.`);
if (failures.length) process.exitCode = 1;
