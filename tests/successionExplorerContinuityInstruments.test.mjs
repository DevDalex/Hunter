import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(path, import.meta.url), 'utf8');
const [continuity, host] = await Promise.all([
  read('../src/components/succession/SuccessionExplorerContinuityInstruments.jsx'),
  read('../src/components/succession/SuccessionExplorerRoutePanelHost.jsx'),
]);

test('structured Explorer query parser turns explicit language into deterministic controls', () => {
  for (const token of [
    'parseExplorerQuery',
    'TYPE_RULES',
    'ROUTE_RULES',
    "intent = /\\bwhat changed",
    'searchArchiveProduct',
    'explorer.setChapter(chapter)',
    'explorer.setFilters',
    'does not invent facts or silently rewrite the query',
  ]) assert.ok(continuity.includes(token), `structured query parser missing ${token}`);
  assert.ok(host.includes('<StructuredQueryInstrument'));
  assert.ok(!continuity.includes('ReaderContinuityInstrument'));
  assert.ok(!host.includes("routeId === 'reader'"));
});
