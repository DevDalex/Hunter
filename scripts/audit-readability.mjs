import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const read = (relative) => readFile(path.join(root, relative), 'utf8');
const assert = (condition, message) => { if (!condition) throw new Error(`Readability audit failed: ${message}`); };

const css = await read('src/styles.css');
const explicitFontSizes = [...css.matchAll(/font-size:\s*([0-9.]+)px/g)].map((match) => Number(match[1]));
const shorthandFontSizes = [...css.matchAll(/font:\s*([^;]+)/g)]
  .flatMap(([, value]) => [...value.matchAll(/([0-9.]+)px/g)].map((match) => Number(match[1])));
const fontSizes = [...explicitFontSizes, ...shorthandFontSizes];
const guidedViews = [
  'src/components/FamilyTree.jsx',
  'src/components/BlackWhaleGuide.jsx',
  'src/components/WorldAtlas.jsx',
  'src/components/SystemsDesk.jsx',
  'src/components/SuccessionDossier.jsx',
  'src/components/EntityEncyclopedia.jsx',
  'src/components/SuccessionTimeline.jsx',
];
const guidedText = await Promise.all(guidedViews.map(read));

assert(fontSizes.length > 250, 'the explicit typography inventory unexpectedly shrank');
assert(Math.min(...fontSizes) >= 11, `visible pixel type must not fall below 11px; found ${Math.min(...fontSizes)}px`);
assert(css.includes('body { margin: 0; min-width: 320px;') && css.includes('line-height: 1.62'), 'the base reading measure is missing');
assert(css.includes('--touch-target: 44px'), 'the 44px touch-target contract is missing');
assert(css.includes('--content-sticky-top:'), 'the shared sticky-stack offset is missing');
assert(css.includes('.horizontal-scroll-hint'), 'the mobile horizontal-scroll cue is missing');
assert(css.includes('@media (max-width: 1100px)') && css.includes('@media (max-width: 900px)') && css.includes('@media (max-width: 640px)') && css.includes('@media (max-width: 420px)'), 'desktop, tablet, phone, and narrow-phone boundaries are required');
assert(/main button, main input, main select, main textarea, \.site-footer button \{ min-width: var\(--touch-target\)(?: !important)?; min-height: var\(--touch-target\)(?: !important)?; \}/.test(css), 'touch layouts must enlarge interactive targets');
assert(guidedText.every((text) => text.includes('<HorizontalScrollHint')), 'every wide research view must expose a mobile scroll cue');

console.log(`Readability audit passed: ${fontSizes.length} explicit type declarations with an ${Math.min(...fontSizes)}px floor; ${guidedViews.length} scroll-guided research views; 44px touch contract.`);
