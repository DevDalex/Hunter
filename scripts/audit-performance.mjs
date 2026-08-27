import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import {
  formatPerformanceBudget,
  performanceBudgets as budgets,
} from '../src/data/performanceBudgets.js';

const root = process.cwd();
const dist = path.join(root, 'dist/client');
const manifest = JSON.parse(await readFile(path.join(dist, '.vite/manifest.json'), 'utf8'));
const assert = (condition, message) => {
  if (!condition) throw new Error(`Performance audit failed: ${message}`);
};
const sizeOf = async (file) => (await stat(path.join(dist, file))).size;

const entry = manifest['index.html'];
assert(entry?.isEntry, 'the production manifest has no index.html entry');

const imported = new Set();
const collectImports = (key) => {
  if (!key || imported.has(key)) return;
  imported.add(key);
  for (const dependency of manifest[key]?.imports || []) collectImports(dependency);
};
collectImports('index.html');

const startupFiles = [...imported].map((key) => manifest[key]?.file).filter(Boolean);
const startupJs = (await Promise.all(startupFiles.map(sizeOf))).reduce((total, bytes) => total + bytes, 0);
const entryJs = await sizeOf(entry.file);
const startupCss = (await Promise.all((entry.css || []).map(sizeOf))).reduce((total, bytes) => total + bytes, 0);
const javascriptFiles = Object.values(manifest).map((record) => record.file).filter((file) => file?.endsWith('.js'));
const javascriptSizes = await Promise.all(javascriptFiles.map(async (file) => ({ file, bytes: await sizeOf(file) })));
const largestJavascript = javascriptSizes.sort((a, b) => b.bytes - a.bytes)[0];

assert(entryJs <= budgets.entryJs, `startup application chunk is ${entryJs} bytes; budget is ${formatPerformanceBudget(budgets.entryJs)}`);
assert(startupJs <= budgets.startupJs, `startup JavaScript closure is ${startupJs} bytes; budget is ${formatPerformanceBudget(budgets.startupJs)}`);
assert(startupCss <= budgets.startupCss, `startup stylesheet is ${startupCss} bytes; budget is ${formatPerformanceBudget(budgets.startupCss)}`);
assert(largestJavascript?.bytes <= budgets.javascriptChunkEmergency, `${largestJavascript?.file || 'largest JS chunk'} exceeds the emergency ceiling of ${formatPerformanceBudget(budgets.javascriptChunkEmergency)}`);

const [app, packageText] = await Promise.all([
  readFile(path.join(root, 'src/App.jsx'), 'utf8'),
  readFile(path.join(root, 'package.json'), 'utf8'),
]);
assert(app.includes('SuccessionCommandHome'), 'production App must retain the homepage boundary');
assert(!app.includes('SuccessionArchiveApp'), 'production App must not eagerly restore the retired archive application');
assert(!/vite-plugin-pwa|workbox|serviceWorker\.register|manifest\.webmanifest/.test(`${packageText}\n${app}`), 'PWA or service-worker behavior is outside the current website scope');

const portraitsDir = path.join(root, 'public/media/portraits');
const portraitFiles = await readdir(portraitsDir);
const portraitSizes = await Promise.all(portraitFiles.map(async (file) => ({ file, bytes: (await stat(path.join(portraitsDir, file))).size })));
const portraitBytes = portraitSizes.reduce((total, record) => total + record.bytes, 0);
const largestPortrait = portraitSizes.sort((a, b) => b.bytes - a.bytes)[0];
assert(largestPortrait.bytes <= budgets.portrait, `${largestPortrait.file} is ${largestPortrait.bytes}; portrait ceiling is ${formatPerformanceBudget(budgets.portrait)}`);
assert(portraitBytes <= budgets.portraitLibrary, `portrait library is ${portraitBytes} bytes; budget is ${formatPerformanceBudget(budgets.portraitLibrary)}`);

if (largestJavascript.bytes > budgets.javascriptChunk) {
  console.warn(`Performance warning: ${largestJavascript.file} is ${largestJavascript.bytes} bytes; preferred target is ${formatPerformanceBudget(budgets.javascriptChunk)}.`);
}

console.log(`Performance audit passed: entry JS ${entryJs}/${formatPerformanceBudget(budgets.entryJs)}; startup JS ${startupJs}/${formatPerformanceBudget(budgets.startupJs)}; startup CSS ${startupCss}/${formatPerformanceBudget(budgets.startupCss)}; largest JS ${largestJavascript.file} at ${largestJavascript.bytes}; portrait library ${portraitBytes} bytes.`);
