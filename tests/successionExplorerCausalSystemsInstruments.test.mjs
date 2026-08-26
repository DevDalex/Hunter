import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(path, import.meta.url), 'utf8');
const [instrument, host, css, closure, capabilities] = await Promise.all([
  read('../src/components/succession/SuccessionExplorerCausalSystemsInstruments.jsx'),
  read('../src/components/succession/SuccessionExplorerRoutePanelHost.jsx'),
  read('../src/components/succession/SuccessionExplorerCausalSystemsInstruments.css'),
  read('../src/components/succession/SuccessionExplorerCausalSystemsClosure.css'),
  read('../src/data/succession/explorerCapabilities.js'),
]);

test('chapter gateway preserves the archive causal classifier and chronology-only fallback', () => {
  for (const token of [
    'ChapterCausalGatewayInstrument',
    'getChapterDeltaBrief',
    'direct-cause',
    'enabling-condition',
    'constraint',
    'contextual-link',
    'sequence-only',
    'evidenceState',
    'sourceRecords',
    'does not manufacture one from chronology alone',
  ]) assert.ok(instrument.includes(token), `chapter causal gateway is missing ${token}`);
  assert.ok(host.includes("chapterCausalViews = new Set(['previously', 'impact'])"));
  assert.ok(host.includes('<ChapterCausalGatewayInstrument'));
  assert.ok(capabilities.includes("capability('previously'"));
  assert.ok(capabilities.includes("capability('forward-impact'"));
});

test('Guardian Beast ecology keeps known, suspected, derived, host, and ritual states separate', () => {
  for (const token of [
    'GuardianBeastEcologyInstrument',
    'getGuardianBeastDossier',
    'knownAbilityIds',
    'suspectedAbilityIds',
    'Derived chapter state',
    'Shared ritual systems',
    'Documented rules',
    'No chapter-visible ability record',
  ]) assert.ok(instrument.includes(token), `Guardian Beast ecology is missing ${token}`);
  assert.ok(host.includes("guardianEcologyViews = new Set(['ecology', 'hosts', 'ritual', 'mechanics'])"));
  assert.ok(host.includes('<GuardianBeastEcologyInstrument'));
  assert.ok(capabilities.includes("capability('host-orbit'"));
  assert.ok(capabilities.includes("capability('ritual-rules'"));
  assert.ok(!instrument.includes('suspected = known'), 'suspected abilities must never be promoted to known');
});

test('organization topology exposes documented operating links without declaring every link indispensable', () => {
  for (const token of [
    'OrganizationDependencyInstrument',
    'getOrganizationDossier',
    "id: 'hierarchy'",
    "id: 'people'",
    "id: 'territory'",
    "id: 'relationships'",
    "id: 'assignments'",
    "id: 'events'",
    'does not infer that every linked record is a necessary dependency',
  ]) assert.ok(instrument.includes(token), `organization topology is missing ${token}`);
  assert.ok(host.includes("organizationTopologyViews = new Set(['hierarchy', 'territory', 'dependencies'])"));
  assert.ok(host.includes('<OrganizationDependencyInstrument'));
  assert.ok(capabilities.includes("capability('dependency-graph'"));
});

test('causal systems retain text cues, 44px interaction sizing, reduced motion, and forced-colors focus', () => {
  assert.ok(css.includes('sequence only, not causal'));
  assert.ok(css.includes('font-size: 11px'));
  assert.ok(css.includes('@media (prefers-reduced-motion: reduce)'));
  assert.ok(css.includes('@media (forced-colors: active)'));
  assert.ok(closure.includes('min-height: 44px'));
  assert.ok(closure.includes(':focus-visible'));
});
