import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { chimeraAntPhases, chimeraAntSectionOrder, chimeraAntDesktopContract } from '../src/data/chimeraAntExperience.js';
import { chimeraAntPhaseScaffold } from '../src/data/chimeraAntPhaseScaffold.js';
import { chimeraAntPalaceInvasionSystem } from '../src/data/chimeraAntPalaceInvasionSystem.js';
import { chimeraAntEndgameSystems } from '../src/data/chimeraAntEndgameSystems.js';
import { chimeraAntSupportingArchive } from '../src/data/chimeraAntSupportingArchive.js';
import { chimeraAntReferenceArchive } from '../src/data/chimeraAntReferenceArchive.js';

const assert = (condition, message) => {
  if (!condition) throw new Error(`Chimera Ant final audit failed: ${message}`);
};

const readProjectFile = (relativePath) => readFileSync(
  fileURLToPath(new URL(`../${relativePath}`, import.meta.url)),
  'utf8',
);

const pageSource = readProjectFile('src/components/ChimeraAntPage.jsx');
const archiveSource = readProjectFile('src/components/ChimeraAntPhaseArchive.jsx');
const supportingSource = readProjectFile('src/components/ChimeraAntSupportingArchivePortals.jsx');
const referenceSource = readProjectFile('src/components/ChimeraAntReferenceArchivePortals.jsx');
const cssFiles = [
  'src/components/ChimeraAntPage.css',
  'src/components/ChimeraAntBatch3.css',
  'src/components/ChimeraAntPhaseArchive.css',
  'src/components/ChimeraAntBatch5.css',
  'src/components/ChimeraAntPalaceInvasionSystem.css',
  'src/components/ChimeraAntEndgameSystems.css',
  'src/components/ChimeraAntSupportingArchive.css',
  'src/components/ChimeraAntReferenceArchive.css',
].map((path) => ({ path, source: readProjectFile(path) }));

assert(chimeraAntDesktopContract.mobileLayout === false, 'desktop contract unexpectedly enables mobile layout');
assert(chimeraAntDesktopContract.minimumSupportedWidth === 1180, 'minimum desktop width drifted');
assert(chimeraAntDesktopContract.preferredMaxWidth === 1760, 'preferred desktop maximum drifted');
assert(chimeraAntSectionOrder.length === 15, `expected 15 sections, found ${chimeraAntSectionOrder.length}`);
assert(new Set(chimeraAntSectionOrder).size === 15, 'section ids must be unique');
assert(chimeraAntPhases.length === 7, `expected 7 phases, found ${chimeraAntPhases.length}`);
assert(chimeraAntPhaseScaffold.length === 7, `expected 7 phase scaffold records, found ${chimeraAntPhaseScaffold.length}`);

let expectedEpisode = 76;
for (const phase of chimeraAntPhases) {
  assert(phase.episodes[0] === expectedEpisode, `phase ${phase.id} starts at ${phase.episodes[0]} instead of ${expectedEpisode}`);
  expectedEpisode = phase.episodes[1] + 1;
}
assert(expectedEpisode === 137, `phase coverage ends at ${expectedEpisode - 1} instead of 136`);

const episodeGroups = chimeraAntPhaseScaffold.flatMap((phase) => phase.episodeGroups.map((group) => ({ phase: phase.id, range: group.range })));
assert(episodeGroups.length === 20, `expected 20 episode groups, found ${episodeGroups.length}`);
let groupEpisode = 76;
for (const group of episodeGroups) {
  assert(group.range[0] === groupEpisode, `${group.phase} episode-group coverage breaks at ${group.range[0]} instead of ${groupEpisode}`);
  groupEpisode = group.range[1] + 1;
}
assert(groupEpisode === 137, 'episode groups do not cover Episodes 76–136 contiguously');

assert(chimeraAntPalaceInvasionSystem.palace.zones.length === 7, 'palace schematic must retain seven zones');
assert(chimeraAntPalaceInvasionSystem.palace.vectors.length === 6, 'palace schematic must retain six vectors');
assert(chimeraAntPalaceInvasionSystem.lanes.length === 7, 'palace invasion must retain seven parallel lanes');
assert(chimeraAntPalaceInvasionSystem.clock.length === 6, 'palace invasion must retain six relative clock records');
assert(Object.keys(chimeraAntEndgameSystems).join(',') === 'two-endgames,poison-memory-homecoming', 'endgame systems drifted');

const supportingCounts = {
  characters: 8,
  factions: 5,
  locations: 6,
  nen: 8,
  conflicts: 7,
  objects: 6,
};
for (const [key, expected] of Object.entries(supportingCounts)) {
  assert(chimeraAntSupportingArchive[key].length === expected, `${key} count is ${chimeraAntSupportingArchive[key].length}, expected ${expected}`);
  const ids = chimeraAntSupportingArchive[key].map((record) => record.id);
  assert(new Set(ids).size === ids.length, `${key} ids are not unique`);
}

assert(chimeraAntReferenceArchive.ending.chain.length === 5, 'ending causal chain must retain five records');
assert(chimeraAntReferenceArchive.ending.outcomes.length === 5, 'ending outcome ledger must retain five records');
assert(chimeraAntReferenceArchive.adaptation.correspondence.length === 7, 'adaptation correspondence must retain seven phase rows');
assert(chimeraAntReferenceArchive.records.totals[0].value === '133', 'manga chapter total drifted');
assert(chimeraAntReferenceArchive.records.totals[1].value === '61', 'anime episode total drifted');
assert(chimeraAntReferenceArchive.sources.groups.length === 4, 'source directory must retain four evidence groups');

for (const id of chimeraAntSectionOrder) assert(pageSource.includes(`id="${id}"`) || pageSource.includes(`id={sectionId(id)}`), `page no longer exposes section architecture for ${id}`);
assert(pageSource.includes('<ChimeraAntPhaseArchive'), 'route page does not render the phase archive');
assert(archiveSource.includes('<ChimeraAntSupportingArchivePortals />'), 'supporting archive portals are not integrated');
assert(archiveSource.includes('<ChimeraAntReferenceArchivePortals onNavigate={onNavigate} />'), 'reference archive portals are not integrated');
assert(supportingSource.includes("const TARGET_IDS = Object.freeze(["), 'supporting portal target contract is missing');
assert(referenceSource.includes("const TARGET_IDS = Object.freeze(['ending', 'adaptation', 'records', 'sources'])"), 'reference portal target contract drifted');
assert(referenceSource.includes('fallbackNavigate'), 'record directory navigation lacks a runtime fallback');
assert(referenceSource.includes('window.location.hash'), 'record directory fallback does not use the verified hash router');
assert(referenceSource.includes('target="_blank" rel="noreferrer noopener"'), 'external source link protection is missing');

for (const { path, source } of cssFiles) {
  const widthQueries = [...source.matchAll(/@media\s*\(([^)]+)\)/g)]
    .map((match) => match[1])
    .filter((query) => /(max|min)-width/.test(query));
  assert(widthQueries.length === 0, `${path} contains mobile/responsive width queries: ${widthQueries.join(', ')}`);
}

const allCss = cssFiles.map(({ source }) => source).join('\n');
assert(allCss.includes('92vw'), '92vw desktop canvas contract is missing from CSS');
assert(allCss.includes('1760px'), '1760px preferred maximum is missing from CSS');
assert(allCss.includes('prefers-reduced-motion'), 'reduced-motion handling is missing');
assert(!allCss.includes('overflow-x: hidden'), 'horizontal overflow is being globally concealed instead of fixed');

const allData = JSON.stringify({ chimeraAntPalaceInvasionSystem, chimeraAntEndgameSystems, chimeraAntSupportingArchive, chimeraAntReferenceArchive });
const externalUrls = [...allData.matchAll(/https:\/\/[^"\\]+/g)].map((match) => match[0]);
assert(externalUrls.length > 40, `expected a substantial evidence directory, found ${externalUrls.length} URLs`);
assert(externalUrls.every((url) => url.startsWith('https://hunterxhunter.fandom.com/wiki/')), 'a Batch 4–10 source falls outside the declared Hunterpedia/Fandom boundary');

console.log(`Chimera Ant final static audit passed: ${chimeraAntPhases.length} phases, ${episodeGroups.length} contiguous episode groups, ${Object.values(supportingCounts).reduce((sum, count) => sum + count, 0)} supporting records, ${chimeraAntReferenceArchive.adaptation.correspondence.length} adaptation rows, and ${externalUrls.length} scoped evidence URLs.`);
