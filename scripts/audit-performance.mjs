import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import {
  formatPerformanceBudget,
  performanceBudgets as budgets,
} from '../src/data/performanceBudgets.js';

const root = process.cwd();
const dist = path.join(root, 'dist/client');
const manifest = JSON.parse(await readFile(path.join(dist, '.vite/manifest.json'), 'utf8'));

const fail = (message) => {
  console.error(`Performance audit failed: ${message}`);
  process.exitCode = 1;
};
const sizeOf = async (file) => (await stat(path.join(dist, file))).size;

const entry = manifest['index.html'];
if (!entry?.isEntry || !entry.file) {
  fail('the production manifest has no index.html entry');
} else {
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
  const javascriptFiles = [...new Set(Object.values(manifest).map((record) => record.file).filter((file) => file?.endsWith('.js')))];
  const javascriptSizes = await Promise.all(javascriptFiles.map(async (file) => ({ file, bytes: await sizeOf(file) })));
  const largestJavascript = javascriptSizes.sort((a, b) => b.bytes - a.bytes)[0];

  if (entryJs > budgets.entryJs) fail(`startup application chunk is ${entryJs} bytes; budget is ${formatPerformanceBudget(budgets.entryJs)}`);
  if (startupJs > budgets.startupJs) fail(`startup JavaScript closure is ${startupJs} bytes; budget is ${formatPerformanceBudget(budgets.startupJs)}`);
  if (startupCss > budgets.startupCss) fail(`startup stylesheet is ${startupCss} bytes; budget is ${formatPerformanceBudget(budgets.startupCss)}`);
  if (largestJavascript?.bytes > budgets.javascriptChunkEmergency) {
    fail(`${largestJavascript.file} exceeds the emergency ceiling of ${formatPerformanceBudget(budgets.javascriptChunkEmergency)}`);
  } else if (largestJavascript?.bytes > budgets.javascriptChunk) {
    console.warn(`Performance warning: ${largestJavascript.file} is ${largestJavascript.bytes} bytes; preferred target is ${formatPerformanceBudget(budgets.javascriptChunk)}.`);
  }

  if (!process.exitCode) console.log(`Performance audit passed: entry JS ${entryJs}, startup JS ${startupJs}, startup CSS ${startupCss}, largest JS ${largestJavascript?.bytes || 0} bytes.`);
}
