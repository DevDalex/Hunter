import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { chimeraAntReferenceArchive } from '../src/data/chimeraAntReferenceArchive.js';

const assert = (condition, message) => {
  if (!condition) throw new Error(`Chimera Ant Batch 10 audit failed: ${message}`);
};

const readProjectFile = (relativePath) => readFileSync(fileURLToPath(new URL(`../${relativePath}`, import.meta.url)), 'utf8');
const hunterpediaSource = (href) => href?.startsWith('https://hunterxhunter.fandom.com/wiki/');
const unique = (values, label) => assert(new Set(values).size === values.length, `${label} values must be unique`);

assert(Object.keys(chimeraAntReferenceArchive).join(',') === 'ending,adaptation,records,sources', 'reference collection order drifted');

const { ending, adaptation, records, sources } = chimeraAntReferenceArchive;
assert(ending.chain.length === 5, `expected 5 ending chain records, found ${ending.chain.length}`);
assert(ending.outcomes.length === 5, `expected 5 outcome records, found ${ending.outcomes.length}`);
unique(ending.chain.map((record) => record.index), 'ending indexes');
unique(ending.outcomes.map((record) => record.id), 'outcome ids');
for (const record of ending.chain) {
  assert(record.cause && record.consequence, `${record.index} needs cause and consequence`);
  assert(hunterpediaSource(record.sourceHref), `${record.index} has unsupported evidence`);
}

assert(adaptation.boundaries.manga.count === 133, 'manga chapter count must be 133');
assert(adaptation.boundaries.anime.count === 61, 'anime episode count must be 61');
assert(adaptation.correspondence.length === 7, `expected 7 phase correspondence rows, found ${adaptation.correspondence.length}`);
assert(adaptation.correspondence.map((record) => record.phase).join(',') === 'I,II,III,IV,V,VI,VII', 'phase correspondence order drifted');
assert(adaptation.choices.length === 4, `expected 4 adaptation choice records, found ${adaptation.choices.length}`);
assert(hunterpediaSource(adaptation.sourceHref), 'adaptation overview source is unsupported');

assert(records.totals.length === 4, `expected 4 record totals, found ${records.totals.length}`);
assert(records.boundaryRules.length === 5, `expected 5 boundary rules, found ${records.boundaryRules.length}`);
assert(records.directoryActions.length === 3, `expected 3 directory actions, found ${records.directoryActions.length}`);
unique(records.directoryActions.map((record) => record.id), 'directory action ids');
assert(records.boundaryRules.some((rule) => rule.includes('not official production labels')), 'editorial phase boundary warning is missing');
assert(records.boundaryRules.some((rule) => rule.includes('Chapter 318') && rule.includes('Episode 136')), 'arc endpoint boundary is missing');

assert(sources.groups.length === 4, `expected 4 source groups, found ${sources.groups.length}`);
assert(sources.boundaries.length === 4, `expected 4 source boundary classes, found ${sources.boundaries.length}`);
unique(sources.groups.map((group) => group.id), 'source group ids');
for (const group of sources.groups) {
  assert(group.purpose, `${group.id} needs an evidence purpose`);
  assert(group.sources.length >= 2, `${group.id} needs at least two sources`);
  for (const source of group.sources) assert(hunterpediaSource(source.href), `${group.id}/${source.label} is outside the Hunterpedia boundary`);
}

const componentSource = readProjectFile('src/components/ChimeraAntReferenceArchivePortals.jsx');
const archiveSource = readProjectFile('src/components/ChimeraAntPhaseArchive.jsx');
const cssSource = readProjectFile('src/components/ChimeraAntReferenceArchive.css');

for (const id of ['ending', 'adaptation', 'records', 'sources']) {
  assert(componentSource.includes(`'${id}'`), `${id} portal target is missing`);
  assert(componentSource.includes(`data-reference-archive="${id}"`), `${id} archive marker is missing`);
}
assert(componentSource.includes('role="table"'), 'adaptation correspondence table semantics are missing');
assert(componentSource.includes('Cause'), 'ending causal chain is missing');
assert(componentSource.includes('Evidence classes'), 'source evidence classes are missing');
assert(archiveSource.includes("import ChimeraAntReferenceArchivePortals from './ChimeraAntReferenceArchivePortals';"), 'phase archive does not import Batch 10 portals');
assert(archiveSource.includes('<ChimeraAntReferenceArchivePortals onNavigate={onNavigate} />'), 'phase archive does not render Batch 10 portals');

for (const legacySelector of ['#chimera-ending > .chimera-ant-ending', '#chimera-adaptation > .chimera-ant-adaptation', '#chimera-records > .chimera-ant-record-summary', '#chimera-sources > .chimera-ant-source-list']) {
  assert(cssSource.includes(legacySelector), `legacy wrapper selector missing: ${legacySelector}`);
}
const mediaQueries = [...cssSource.matchAll(/@media\s*\(([^)]+)\)/g)].map((match) => match[1]);
assert(mediaQueries.every((query) => query.includes('prefers-reduced-motion')), `unexpected responsive media query found: ${mediaQueries.join(', ')}`);
assert(cssSource.includes('grid-template-columns: repeat(5, minmax(0, 1fr))'), 'five-column outcome desktop field is missing');
assert(cssSource.includes('grid-template-columns: repeat(4, minmax(0, 1fr))'), 'four-column record/source desktop field is missing');
assert(cssSource.includes('grid-template-columns: repeat(2, minmax(0, 1fr))'), 'two-column adaptation/source desktop field is missing');

console.log('Chimera Ant Batch 10 audit passed: 5 ending links, 5 outcome records, 7 phase correspondence rows, 4 adaptation choices, 4 record totals, 5 boundary rules, 4 source groups, and 4 evidence classes.');
