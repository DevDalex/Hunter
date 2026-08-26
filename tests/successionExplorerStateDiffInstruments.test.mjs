import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(path, import.meta.url), 'utf8');
const [instrument, host, css, closure, capabilities] = await Promise.all([
  read('../src/components/succession/SuccessionExplorerStateDiffInstruments.jsx'),
  read('../src/components/succession/SuccessionExplorerRoutePanelHost.jsx'),
  read('../src/components/succession/SuccessionExplorerStateDiffInstruments.css'),
  read('../src/components/succession/SuccessionExplorerStateDiffInstrumentsClosure.css'),
  read('../src/data/succession/explorerCapabilities.js'),
]);

test('character temporal dossier uses structured state selectors instead of event counts', () => {
  for (const token of [
    'CharacterStateEvolutionInstrument',
    'getCharacterStateTimeline',
    'getCharacterStateAtChapter',
    'getCharacterAffiliationsAtChapter',
    'getCharacterRoleProfile',
    'Explicit state ribbons',
    'No synthetic transition is inserted into the timeline',
  ]) assert.ok(instrument.includes(token), `character state evolution is missing ${token}`);
  assert.ok(host.includes("routeId === 'characters' && view === 'timeline'"));
  assert.ok(capabilities.includes("capability('temporal-dossier'"));
});

test('chapter diff is selector-level and hides unchanged records', () => {
  for (const token of [
    'ChapterStateDiffInstrument',
    'getChapterStateDiff',
    '{ changedOnly: true }',
    'Added',
    'Modified',
    'Removed',
    'field changes',
    'unchanged hidden',
  ]) assert.ok(instrument.includes(token), `chapter state diff is missing ${token}`);
  assert.ok(host.includes("routeId === 'timeline' && view === 'diff'"));
  assert.ok(host.includes("routeId === 'chapters' && view === 'diff'"));
  assert.ok(capabilities.includes("capability('state-diff'"));
});

test('research topology preserves explicit versus inherited provenance semantics', () => {
  for (const token of [
    'ResearchEvidenceTopologyInstrument',
    'getClaimProvenanceProfile',
    'getProvenanceCoverageReport',
    'Entity source chain inherited',
    'Explicit claim-level source',
    'No published source chain',
    'inheritedSourceChain',
  ]) assert.ok(instrument.includes(token), `research evidence topology is missing ${token}`);
  assert.ok(host.includes("researchEvidenceViews.has(view)"));
  assert.ok(capabilities.includes("capability('evidence-graph'"));
  assert.ok(!instrument.includes('direct evidence proves'), 'instrument must not invent evidentiary strength language');
});

test('new instruments keep desktop interaction and accessibility contracts', () => {
  assert.ok(css.includes('font-size: 11px'));
  assert.ok(css.includes('@media (prefers-reduced-motion: reduce)'));
  assert.ok(css.includes('@media (forced-colors: active)'));
  assert.ok(closure.includes('min-height: 44px'));
  assert.ok(closure.includes(':focus-visible'));
});
