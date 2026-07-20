import { access, readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist/client');
const manifestPath = path.join(dist, '.vite/manifest.json');
const assert = (condition, message) => { if (!condition) throw new Error(`Performance audit failed: ${message}`); };

await access(manifestPath);
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const entry = manifest['index.html'];
assert(entry?.isEntry, 'the production manifest has no index.html entry');

const imported = new Set();
const collectImports = (key) => {
  if (!key || imported.has(key)) return;
  imported.add(key);
  for (const dependency of manifest[key]?.imports || []) collectImports(dependency);
};
collectImports('index.html');

const sizeOf = async (file) => (await stat(path.join(dist, file))).size;
const startupFiles = [...imported].map((key) => manifest[key]?.file).filter(Boolean);
const startupJs = (await Promise.all(startupFiles.map(sizeOf))).reduce((total, bytes) => total + bytes, 0);
const entryJs = await sizeOf(entry.file);
const startupCss = (await Promise.all((entry.css || []).map(sizeOf))).reduce((total, bytes) => total + bytes, 0);
const dynamicEntries = Object.values(manifest).filter((record) => record.isDynamicEntry);
const javascriptFiles = Object.values(manifest).map((record) => record.file).filter((file) => file?.endsWith('.js'));
const javascriptSizes = await Promise.all(javascriptFiles.map(async (file) => ({ file, bytes: await sizeOf(file) })));
const largestJavascript = javascriptSizes.sort((a, b) => b.bytes - a.bytes)[0];

assert(entryJs <= 58_000, `startup application chunk is ${entryJs} bytes; budget is 58,000`);
assert(startupJs <= 270_000, `startup JavaScript closure is ${startupJs} bytes; budget is 270,000`);
assert(startupCss <= 390_000, `startup stylesheet is ${startupCss} bytes; budget is 390,000`);
assert(largestJavascript.bytes <= 220_000, `${largestJavascript.file} is ${largestJavascript.bytes} bytes; per-chunk budget is 220,000`);
assert(dynamicEntries.length === 17, `expected 17 route/search dynamic entries, found ${dynamicEntries.length}`);
assert(entry.dynamicImports?.length === dynamicEntries.length, 'the entry manifest must expose every dynamic route/search boundary');

const homeHighlights = await readFile(path.join(root, 'src/data/homeHighlights.js'), 'utf8');
const app = await readFile(path.join(root, 'src/App.jsx'), 'utf8');
const routePreload = await readFile(path.join(root, 'src/lib/routePreload.js'), 'utf8');
const safeImage = await readFile(path.join(root, 'src/components/SafeImage.jsx'), 'utf8');
const siteHome = await readFile(path.join(root, 'src/components/SiteHome.jsx'), 'utf8');
const packageJson = await readFile(path.join(root, 'package.json'), 'utf8');

assert(!/from ['"]\.\/characters['"]/.test(homeHighlights), 'the homepage must not import the complete character registry');
assert(!/priorityMedia\.generated/.test(homeHighlights), 'the homepage must not import the complete priority-media registry');
assert(!/from ['"].*\/(chapters|encyclopedia|successionDossier|successionRoster|seriesResearch)['"]/.test(app), 'App.jsx imports a heavy research dataset');
assert((routePreload.match(/\(\) => import\(/g) || []).length === 17, 'the route loader registry must own 17 dynamic module boundaries');
assert(safeImage.includes("priority || (eager ? 'high' : 'auto')"), 'SafeImage must support explicit fetch priority');
assert(siteHome.includes("index === 0 ? 'high' : 'auto'"), 'only the first homepage portrait must receive high fetch priority');
assert(!/vite-plugin-pwa|workbox|serviceWorker\.register|manifest\.webmanifest/.test(`${packageJson}\n${app}\n${routePreload}`), 'PWA or service-worker behavior is outside the website scope');

const portraitsDir = path.join(root, 'public/media/portraits');
const portraitFiles = await readdir(portraitsDir);
const portraitSizes = await Promise.all(portraitFiles.map(async (file) => ({ file, bytes: (await stat(path.join(portraitsDir, file))).size })));
const portraitBytes = portraitSizes.reduce((total, record) => total + record.bytes, 0);
const largestPortrait = portraitSizes.sort((a, b) => b.bytes - a.bytes)[0];
assert(largestPortrait.bytes <= 160_000, `${largestPortrait.file} is ${largestPortrait.bytes} bytes; local portrait ceiling is 160,000`);
assert(portraitBytes <= 2_200_000, `local portrait library is ${portraitBytes} bytes; budget is 2,200,000`);

console.log(`Performance audit passed: ${entryJs} byte entry; ${startupJs} byte startup JS closure; ${startupCss} byte CSS; ${dynamicEntries.length} lazy entries; ${portraitBytes} portrait bytes.`);
