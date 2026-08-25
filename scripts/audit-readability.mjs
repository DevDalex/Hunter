import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const read = (relative) => readFile(path.join(root, relative), 'utf8');
const assert = (condition, message) => { if (!condition) throw new Error(`Readability audit failed: ${message}`); };

const css = await read('src/styles.css');
const explicitFontSizes = [...css.matchAll(/font-size:\s*([0-9.]+)px/g)].map((match) => Number(match[1]));
const shorthandFontSizes = [...css.matchAll(/font:\s*([^;]+)/g)].flatMap(([, value]) => [...value.matchAll(/([0-9.]+)px/g)].map((match) => Number(match[1])));
const fontSizes = [...explicitFontSizes, ...shorthandFontSizes];
const unsupportedMaxWidths = [...css.matchAll(/@media[^\n{]*max-width\s*:\s*([0-9.]+)\s*(px|em|rem)/gi)].filter((match) => {
  const px = match[2].toLowerCase() === 'px' ? Number(match[1]) : Number(match[1]) * 16;
  return Number.isFinite(px) && px < 1180;
});

const genericGuidedViews = [
  'src/components/FamilyTree.jsx',
  'src/components/BlackWhaleGuide.jsx',
  'src/components/SystemsDesk.jsx',
  'src/components/SuccessionDossier.jsx',
];
const genericGuidedText = await Promise.all(genericGuidedViews.map(read));
const timelineCartography = await read('src/components/succession/SuccessionExplorerAdvancedInstruments.jsx');

assert(fontSizes.length > 250, 'the explicit typography inventory unexpectedly shrank');
assert(fontSizes.every((size) => Number.isFinite(size) && size > 0), 'explicit pixel type declarations must be positive numeric values');
assert(css.includes('min-width: 1180px') && css.includes('line-height: 1.62'), 'the desktop base reading measure is missing');
assert(!css.includes('--touch-target'), 'desktop-only styles must not restore the touch-target token');
assert(!css.includes('touch-action:'), 'desktop-only styles must not restore touch-action rules');
assert(!css.includes('-webkit-tap-highlight-color'), 'desktop-only styles must not restore tap-highlight rules');
assert(!unsupportedMaxWidths.length, `unsupported narrow-width media rules remain: ${unsupportedMaxWidths.map((match) => match[0]).join(' | ')}`);
assert(css.includes('--content-sticky-top:'), 'the shared sticky-stack offset is missing');
assert(css.includes('.horizontal-scroll-hint'), 'the labelled horizontal-overflow cue is missing');
assert(genericGuidedText.every((text) => text.includes('<HorizontalScrollHint')), 'every retained generic wide research view must expose its horizontal-overflow cue');
assert(timelineCartography.includes('succession-explorer-cartography__scroll'), 'Timeline must retain its dedicated horizontal cartography scroller');
assert(timelineCartography.includes('succession-explorer-cartography__chapter-axis'), 'Timeline cartography must expose a persistent chapter-axis cue');
assert(timelineCartography.includes('Horizontal position is chapter.'), 'Timeline cartography must explain its horizontal reading direction');

const smallestDeclaredSize = Math.min(...fontSizes);
console.log(`Readability audit passed: ${fontSizes.length} explicit type declarations inventoried (smallest ${smallestDeclaredSize}px); ${genericGuidedViews.length} generic scroll-guided research views plus dedicated Timeline cartography; 1180px minimum reading surface enforced with no narrow-width or touch-device contract.`);
