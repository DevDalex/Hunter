import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(path, import.meta.url), 'utf8');
const [graphs, host] = await Promise.all([
  read('../src/components/succession/SuccessionExplorerGraphInstruments.jsx'),
  read('../src/components/succession/SuccessionExplorerRoutePanelHost.jsx'),
]);

test('Timeline causality is rendered as a free-moving canonical graph', () => {
  for (const token of [
    'TimelineCausalityGraphInstrument',
    'getStoryCausalGraphAtChapter',
    'SuccessionExplorerCanvas',
    'sourceEventId',
    'targetEventId',
    "kind: 'causes'",
    'Only canonical story-causal links are edges here',
    "cameraKey = 'timeline-causality'",
  ]) assert.ok(graphs.includes(token), `causal graph missing ${token}`);
  assert.ok(host.includes("view === 'causality'"));
});

test('Nen interaction graph separates direct same-event context from structural overlap', () => {
  for (const token of [
    'NenInteractionGraphInstrument',
    'getAbilityInteractionMatrix',
    'directInteractionClaimed',
    "pair.directInteractionClaimed ? 'causes' : 'supports'",
    'structural overlap only',
    "cameraKey = 'nen-interactions'",
  ]) assert.ok(graphs.includes(token), `Nen topology missing ${token}`);
  assert.ok(host.includes("routeId === 'nen' && view === 'interactions'"));
});
