#!/usr/bin/env node

import { access, readFile } from 'node:fs/promises';

const workspace = await readFile('src/components/SeriesWorkspace.jsx', 'utf8');
const page = await readFile('src/components/GreedIslandPage.jsx', 'utf8');
const eta = await readFile('src/components/greed-island/EtaDialogueStage.jsx', 'utf8');
const fail = (message) => { throw new Error(`Greed Island audit failed: ${message}`); };
const dedicated = "if (routeTarget === 'greed-island')";
const generic = 'if (storyArcIds.has(routeTarget))';

if (!workspace.includes("const GreedIslandPage = lazy(() => import('./GreedIslandPage'))")) fail('complete page is not lazy-loaded');
if (!workspace.includes(dedicated)) fail('dedicated route is missing');
if (workspace.indexOf(dedicated) > workspace.indexOf(generic)) fail('generic arc route captures Greed Island first');
if (!workspace.includes('<GreedIslandPage onNavigate={onNavigate} routeParams={routeParams} />')) fail('complete page is not rendered');
if ((page.match(/lazy\(\(\) => import\('\.\/greed-island\//g) || []).length !== 8) fail('the eight archive modules are not preserved');
for (const token of ['EtaTutorial', 'GreedIslandBinder', 'SpecifiedCardArchive', 'GreedIslandCardLibraries', 'GreedIslandSystems', 'GreedIslandTacticalRecords', 'GreedIslandCompletionArchive']) if (!page.includes(token)) fail(`${token} is missing`);
for (const asset of ['eta-tutorial-room.webp', 'eta-closed.webp', 'eta-mouth-open-patch.webp', 'eta-blink-patch.webp', 'eta-dialogue-bubble.webp']) {
  if (!eta.includes(asset)) fail(`${asset} is not wired into the Eta scene`);
  await access(`public/media/greed-island/eta/${asset}`);
}
console.log('Greed Island audit passed: complete archive, Eta scene, Binder, media, systems, tactics, and completion route are live before the generic renderer.');
