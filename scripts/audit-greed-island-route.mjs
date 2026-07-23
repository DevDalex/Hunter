#!/usr/bin/env node

import { readFile } from 'node:fs/promises';

const workspace = await readFile('src/components/SeriesWorkspace.jsx', 'utf8');
const page = await readFile('src/components/GreedIslandPrototypePage.jsx', 'utf8');
const fail = (message) => { throw new Error(`Greed Island audit failed: ${message}`); };
const dedicated = "if (routeTarget === 'greed-island')";
const generic = 'if (storyArcIds.has(routeTarget))';

if (!workspace.includes("const GreedIslandPrototypePage = lazy(() => import('./GreedIslandPrototypePage'))")) fail('dedicated page is not lazy-loaded');
if (!workspace.includes(dedicated)) fail('dedicated route is missing');
if (workspace.indexOf(dedicated) > workspace.indexOf(generic)) fail('generic arc route captures Greed Island first');
if (!workspace.includes('<GreedIslandPrototypePage onNavigate={onNavigate} />')) fail('dedicated page is not rendered');
if (!page.includes('function CardCatalogue()')) fail('card catalogue is missing');
if (!page.includes('eyebrow="Binder catalogue"')) fail('Binder catalogue is missing');
if (!page.includes('greedIslandCardGroups.map')) fail('Binder filters are missing');
if (!page.includes('filteredCards.map')) fail('Binder records are missing');

console.log('Greed Island audit passed: the dedicated page and Binder catalogue are reachable before the generic arc renderer.');
