import { readFile } from 'node:fs/promises';
import {
  sourceImportsDefault,
  sourceRendersRouteWith,
} from './lib/succession-audit-contracts.mjs';

const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession event workspace audit failed: ${message}`);
};

const [workspace, styles, app] = await Promise.all([
  readFile(new URL('../src/components/succession/SuccessionArchiveEventWorkspace.jsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/components/succession/SuccessionArchiveEventWorkspace.css', import.meta.url), 'utf8'),
  readFile(new URL('../src/components/succession/SuccessionArchiveApp.jsx', import.meta.url), 'utf8'),
]);

assert(sourceImportsDefault(app, 'EventsWorkspace', './SuccessionArchiveEventWorkspace'), 'app must load the dedicated canonical event workspace');
assert(!app.includes('  EventsWorkspace,\n  GuardianBeastsWorkspace,'), 'app must not import the legacy event workspace from deep workspaces');
assert(sourceRendersRouteWith(app, 'events', 'EventsWorkspace'), 'events route must render the dedicated canonical workspace');
assert(workspace.includes("getEntitiesByType('event')"), 'workspace must read canonical event entities');
assert(workspace.includes('event.consequenceEventIds'), 'workspace must render event consequence links');
assert(workspace.includes('event.causes'), 'workspace must expose canonical causes');
assert(workspace.includes('event.outcomes'), 'workspace must expose canonical outcomes');
assert(workspace.includes('selected.stateChanges'), 'workspace must expose temporal state changes');
assert(workspace.includes('selected.openQuestions'), 'workspace must expose unresolved research questions');
assert(workspace.includes('participantIds'), 'workspace must link event participants');
assert(workspace.includes('organizationIds'), 'workspace must link event organizations');
assert(workspace.includes('locationIds'), 'workspace must link event locations');
assert(workspace.includes('abilityIds'), 'workspace must link event abilities');
assert(workspace.includes('SourceReference'), 'workspace must display chapter evidence');
assert(workspace.includes('type="number"'), 'workspace must provide chapter filtering');
assert(workspace.includes('All factions'), 'workspace must provide faction filtering');
assert(workspace.includes('All locations'), 'workspace must provide location filtering');
assert(workspace.includes('All abilities'), 'workspace must provide ability filtering');
assert(styles.includes('.succession-event-causality'), 'styles must own the causal presentation');
assert(styles.includes('.succession-event-chain'), 'styles must own predecessor and consequence navigation');
assert(styles.includes('@media (max-width: 820px)'), 'workspace must include responsive layout handling');
assert(styles.includes('@media (prefers-reduced-motion: reduce)'), 'workspace must include reduced-motion handling');

console.log('Succession event workspace audit passed: canonical data, faceted filtering, causality, evidence, cross-links, and responsive presentation are wired.');
