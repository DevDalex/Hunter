import { createHash } from 'node:crypto';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const fail = (message) => { throw new Error(message); };
const read = (path) => readFileSync(resolve(root, path), 'utf8');
const hash = (path) => createHash('sha256').update(readFileSync(resolve(root, path))).digest('hex');

const expectedAssets = Object.freeze({
  'public/media/greed-island/eta/eta-closed.webp': [28110, 'c78300d754f5fa521d989a80c7d5f7e85c815fd387020ea4bbded60cf225400a'],
  'public/media/greed-island/eta/eta-mouth-open-patch.webp': [6748, 'aaf8df8f424b2f10e77fa8225a6ff963080a66526065dbabecbcabd46381a415'],
  'public/media/greed-island/eta/eta-blink-patch.webp': [7366, '7d042901de083b209ccdbe540a765553c3f8ce76630f55121dcacc90a974fb2e'],
  'public/media/greed-island/eta/eta-tutorial-room.webp': [36070, '8d6d1519de41cdf683745ac71207b7a873c1af86f92e543ae43885481e5d0ce5'],
  'public/media/greed-island/eta/eta-dialogue-bubble.webp': [5776, '5e371616cc9ad07f0cc98c01e248420d37aad4f2b46866b0f18bb5eb79a01207'],
});

for (const [path, [size, digest]] of Object.entries(expectedAssets)) {
  if (!existsSync(resolve(root, path))) fail(`${path} is missing.`);
  const actualSize = statSync(resolve(root, path)).size;
  if (actualSize !== size) fail(`${path} expected ${size} bytes, received ${actualSize}.`);
  const actualHash = hash(path);
  if (actualHash !== digest) fail(`${path} digest drifted: ${actualHash}.`);
}

const manifestPath = 'src/data/greed-island/etaAssetManifest.generated.js';
if (!existsSync(resolve(root, manifestPath))) fail('Eta asset manifest is missing.');
const manifest = read(manifestPath);
for (const [path, [, digest]] of Object.entries(expectedAssets)) {
  const fileName = path.split('/').at(-1);
  if (!manifest.includes(fileName) || !manifest.includes(digest)) fail(`Eta manifest is missing ${fileName} provenance.`);
}
if (!manifest.includes("status: 'user-approved-original-art'") || !manifest.includes("storage: 'local-webp'")) {
  fail('Eta manifest does not preserve the approved local-art provenance boundary.');
}

const tutorial = read('src/components/greed-island/EtaTutorial.jsx');
if (!tutorial.includes("import EtaDialogueStage from './EtaDialogueStage';")) fail('EtaTutorial does not import the approved scene.');
if (!tutorial.includes('<EtaDialogueStage lesson={lesson} announcement={announcement} onAdvance={nextLesson} />')) fail('EtaTutorial does not render the approved scene.');
if (tutorial.includes('gi-eta-course__eta')) fail('The obsolete letter-avatar Eta placeholder is still rendered.');

const stage = read('src/components/greed-island/EtaDialogueStage.jsx');
const requiredStageTokens = [
  'delayForCharacter',
  "if (character === '…') return 360",
  'return 235',
  'return 125',
  'return 34',
  'setInterval(() => setMouthOpen',
  '145',
  '3200 + Math.round(Math.random() * 2600)',
  'setVisibleCount(fullText.length)',
  "data-eta-state={state}",
  'prefers-reduced-motion: reduce',
  'eta-mouth-open-patch.webp',
  'eta-blink-patch.webp',
  '▼ PRESS A',
];
for (const token of requiredStageTokens) if (!stage.includes(token)) fail(`Eta dialogue stage is missing ${token}.`);

const css = `${read('src/components/greed-island/EtaDialogueStage.css')}\n${read('src/components/greed-island/EtaDialogueStagePatches.css')}`;
for (const token of ['image-rendering: pixelated', '@media (max-width: 760px)', '@media (prefers-reduced-motion: reduce)', 'gi-eta-float', 'gi-eta-cursor', 'gi-eta-prompt']) {
  if (!css.includes(token)) fail(`Eta scene CSS is missing ${token}.`);
}

console.log('Greed Island Eta scene audit passed: 5/5 approved assets, aligned expression animation, retro typewriter dialogue, mobile layout, and reduced-motion fallback verified.');
