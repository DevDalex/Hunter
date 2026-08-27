import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const shell = readFileSync(new URL('../src/components/succession/SuccessionArchiveShell.jsx', import.meta.url), 'utf8');
const workspace = readFileSync(new URL('../src/components/TimelineWorkspace.jsx', import.meta.url), 'utf8');
const switcher = readFileSync(new URL('../src/components/TimelineWorkspaceSwitcher.jsx', import.meta.url), 'utf8');
const primaryCss = readFileSync(new URL('../src/components/TimelinePrimaryAtlas.css', import.meta.url), 'utf8');

test('Timeline route is an immersive map rather than a generic Explorer dashboard', () => {
  assert.match(shell, /const immersiveTimeline = route\.id === 'timeline'/);
  assert.match(shell, /!immersiveTimeline && <Suspense[\s\S]*?<SuccessionExplorerSurface/);
  assert.match(shell, /immersiveTimeline && <h1 className="sr-only">Voyage Timeline<\/h1>/);
  assert.match(shell, /succession-archive--timeline-map/);
});

test('cartographic story field is mounted before secondary Timeline modes', () => {
  const mapIndex = workspace.indexOf('{storyActive && <TimelineStoryField');
  const switcherIndex = workspace.indexOf('<TimelineWorkspaceSwitcher');
  assert.ok(mapIndex >= 0, 'primary TimelineStoryField is missing');
  assert.ok(switcherIndex >= 0, 'workspace switcher is missing');
  assert.ok(mapIndex < switcherIndex, 'secondary mode switcher appears before the primary map');
  assert.match(workspace, /timeline-workspace--primary-map/);
});

test('Timeline naming makes the cartographic map primary and research atlas secondary', () => {
  assert.match(switcher, /id: 'story', label: 'Timeline Map', note: 'Primary cartographic chronology'/);
  assert.match(switcher, /id: 'atlas', label: 'Research Atlas'/);
  assert.match(switcher, /The map is the Timeline\./);
});

test('primary map owns the full Timeline workspace and keeps an accessible text floor', () => {
  assert.match(primaryCss, /\.succession-archive--timeline-map \.succession-archive__content/);
  assert.match(primaryCss, /min-height: calc\(100vh - 118px\)/);
  assert.match(primaryCss, /\.tsf-shell[\s\S]*grid-template-columns: 236px minmax\(0, 1fr\)/);
  assert.match(primaryCss, /font-size: 11px/);
});
