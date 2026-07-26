import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { access, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const require = createRequire(import.meta.url);
const root = process.cwd();
const dist = path.join(root, 'dist/client');
const axePath = require.resolve('axe-core/axe.min.js');
const routes = [
  'timeline/',
  'succession/story',
  'succession/chapters',
  'succession/timeline',
  'succession/queens',
  'succession/bodyguards',
  'succession/organizations',
  'succession/relationships',
  'succession/locations',
  'succession/black-whale',
  'succession/nen',
  'succession/guardian-spirit-beasts',
  'succession/research',
];

const mime = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
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

const settle = async (page) => {
  await page.waitForSelector('main', { timeout: 12_000 });
  await page.waitForFunction(() => !document.querySelector('.route-loading'), null, { timeout: 10_000 }).catch(() => {});
  await page.waitForTimeout(350);
  await page.evaluate(async () => {
    const maximum = Math.min(document.documentElement.scrollHeight, 9_000);
    for (let y = 0; y < maximum; y += 700) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 12));
    }
    window.scrollTo(0, 0);
    await new Promise((resolve) => setTimeout(resolve, 80));
  });
};

const server = await serve();
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
let failed = 0;

try {
  for (const route of routes) {
    await page.goto(`${base}/#/${route}`, { waitUntil: 'domcontentloaded', timeout: 20_000 });
    await settle(page);
    await page.addScriptTag({ path: axePath });
    const result = await page.evaluate(async () => {
      const axeResult = await globalThis.axe.run(document, {
        runOnly: { type: 'rule', values: ['color-contrast', 'definition-list', 'aria-required-children', 'select-name'] },
      });
      return axeResult.violations.map((violation) => ({
        id: violation.id,
        impact: violation.impact,
        help: violation.help,
        nodes: violation.nodes.map((node) => ({
          target: node.target,
          html: node.html,
          failureSummary: node.failureSummary,
          any: node.any.map((check) => ({ message: check.message, data: check.data })),
          all: node.all.map((check) => ({ message: check.message, data: check.data })),
        })),
      }));
    });
    if (!result.length) {
      console.log(`PASS ${route}`);
      continue;
    }
    failed += result.reduce((sum, violation) => sum + violation.nodes.length, 0);
    console.log(`\nFAIL ${route}`);
    console.log(JSON.stringify(result, null, 2));
  }
} finally {
  await page.close();
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}

if (failed) process.exitCode = 1;
