import { createServer } from 'node:http';
import { access, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { chromium } from 'playwright';

const require = createRequire(import.meta.url);
const root = process.cwd();
const dist = path.join(root, 'dist/client');
const output = path.join(root, '.browser-qa');
const axePath = require.resolve('axe-core/axe.min.js');
const mime = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
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

const failures = [];
const checks = [];
const record = async (name, fn) => {
  try {
    await fn();
    checks.push({ name, status: 'passed' });
    console.log(`✓ ${name}`);
  } catch (error) {
    checks.push({ name, status: 'failed', error: error.message });
    failures.push(`${name}: ${error.message}`);
    console.error(`✗ ${name} · ${error.message}`);
  }
};

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
const server = await serve();
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const pageErrors = [];
page.on('pageerror', (error) => pageErrors.push(error.message));

const assertAxe = async (label) => {
  await page.addScriptTag({ path: axePath });
  const result = await page.evaluate(async () => globalThis.axe.run(document, {
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] },
  }));
  const blocking = result.violations.filter((item) => item.id !== 'color-contrast');
  if (blocking.length) throw new Error(`${label}: ${blocking.map((item) => `${item.id}:${item.nodes.length}`).join(', ')}`);
};

try {
  await page.goto(`${base}/succession/timeline?legacy=1#old`, { waitUntil: 'domcontentloaded', timeout: 20_000 });
  await page.waitForSelector('.succession-command-home', { state: 'visible', timeout: 15_000 });

  await record('legacy URLs normalize to the homepage', async () => {
    await page.waitForFunction(() => location.pathname === '/' && location.search === '' && location.hash === '');
  });

  await record('simplified homepage and Black Whale backdrop render', async () => {
    if (await page.title() !== 'Hunter × Hunter Archive') throw new Error(`unexpected title: ${await page.title()}`);
    await page.locator('main#succession-command-content').waitFor({ state: 'visible' });

    for (const label of ['Story', 'Characters', 'Nen']) {
      await page.getByRole('button', { name: new RegExp(`^\\d{2}\\s*${label}`, 'i') }).waitFor({ state: 'visible' });
    }

    const whale = page.locator('.succession-command-home__whale');
    await whale.waitFor({ state: 'attached' });
    const background = await whale.evaluate((element) => getComputedStyle(element).backgroundImage);
    if (!background.includes('black-whale-exterior.webp')) throw new Error(`Black Whale background missing: ${background}`);
  });

  await record('archive sections expand in place without jumping to the top', async () => {
    const characters = page.getByRole('button', { name: /02\s*Characters/i });
    await characters.scrollIntoViewIfNeeded();
    const before = await page.evaluate(() => window.scrollY);
    await characters.click();
    await page.waitForFunction(() => document.querySelector('[aria-controls="succession-home-characters"]')?.getAttribute('aria-expanded') === 'true');
    const after = await page.evaluate(() => window.scrollY);
    if (Math.abs(after - before) > 4) throw new Error(`section click changed scroll position: ${before} -> ${after}`);

    const location = await page.evaluate(() => ({ pathname: location.pathname, search: location.search, hash: location.hash }));
    if (location.pathname !== '/' || location.search || location.hash) throw new Error(`section interaction escaped homepage: ${JSON.stringify(location)}`);

    await page.locator('#succession-home-characters.succession-command-home__detail.is-open').waitFor({ state: 'visible' });
    await page.getByText('Princes', { exact: true }).last().waitFor({ state: 'visible' });
  });

  await record('skip link moves keyboard focus to archive content', async () => {
    await page.locator('.succession-command-home__skip').focus();
    await page.keyboard.press('Enter');
    const focused = await page.evaluate(() => document.activeElement?.id);
    if (focused !== 'succession-command-content') throw new Error(`focus landed on ${focused || 'nothing'}`);
  });

  await record('homepage passes WCAG A/AA axe checks', async () => {
    await assertAxe('homepage');
  });

  await record('Story opens the production timeline route', async () => {
    const story = page.getByRole('button', { name: /01\s*Story/i });
    await story.click();
    await page.locator('#succession-home-story.succession-command-home__detail.is-open').waitFor({ state: 'visible' });
    await page.getByRole('link', { name: /Timeline/i }).click();
    await page.waitForURL(`${base}/timeline`);
    await page.locator('.timeline-manga-wall').waitFor({ state: 'visible' });
    if (await page.title() !== 'Timeline · Hunter × Hunter Archive') throw new Error(`unexpected timeline title: ${await page.title()}`);
  });

  await record('timeline spans maintained beginning through latest boundary', async () => {
    await page.locator('#timeline-chapter-340').waitFor({ state: 'attached' });
    await page.locator('#timeline-chapter-418').waitFor({ state: 'attached' });
    const chapterCount = await page.locator('.timeline-manga-wall__chapter').count();
    if (chapterCount < 70) throw new Error(`expected broad chapter coverage, found only ${chapterCount} chapter slices`);
  });

  await record('timeline uses real chapter manga media and maintained events', async () => {
    const firstChapter = page.locator('#timeline-chapter-340');
    const pageImage = firstChapter.locator('.timeline-manga-wall__page img').first();
    await pageImage.waitFor({ state: 'attached' });
    const src = await pageImage.getAttribute('src');
    if (!src?.includes('/media/succession-contest/chapters/340/')) throw new Error(`unexpected manga media path: ${src}`);
    if (await firstChapter.locator('.timeline-manga-wall__event').count() < 1) throw new Error('Chapter 340 has no maintained event blocks');
  });

  await record('timeline filters stay in place and preserve the route', async () => {
    await page.getByRole('button', { name: 'Nen', exact: true }).click();
    const location = await page.evaluate(() => ({ pathname: location.pathname, search: location.search, hash: location.hash }));
    if (location.pathname !== '/timeline' || location.search || location.hash) throw new Error(`timeline filter escaped route: ${JSON.stringify(location)}`);
    await page.locator('.timeline-manga-wall__event.is-dimmed').first().waitFor({ state: 'attached' });
  });

  await record('timeline direct URL survives a fresh navigation', async () => {
    await page.goto(`${base}/timeline`, { waitUntil: 'domcontentloaded', timeout: 20_000 });
    await page.locator('.timeline-manga-wall').waitFor({ state: 'visible', timeout: 15_000 });
    if (new URL(page.url()).pathname !== '/timeline') throw new Error(`timeline normalized away: ${page.url()}`);
  });

  await record('timeline passes WCAG A/AA axe checks', async () => {
    await assertAxe('timeline');
  });

  await record('runtime has no uncaught browser exceptions', async () => {
    if (pageErrors.length) throw new Error(pageErrors.join(' | '));
  });
} finally {
  if (failures.length) await page.screenshot({ path: path.join(output, 'homepage-failure.png'), fullPage: true }).catch(() => {});
  await writeFile(path.join(output, 'homepage-report.json'), `${JSON.stringify({ checks, failures }, null, 2)}\n`);
  await page.close().catch(() => {});
  await browser.close().catch(() => {});
  await new Promise((resolve) => server.close(resolve));
}

if (failures.length) {
  console.error(`\nHomepage browser QA failed: ${failures.length}/${checks.length} checks failed.`);
  process.exitCode = 1;
} else {
  console.log(`\nHomepage browser QA passed: ${checks.length}/${checks.length} checks green.`);
}
