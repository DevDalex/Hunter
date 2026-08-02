import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'vite';

const root = process.cwd();
const read = (relativePath) => readFile(path.join(root, relativePath), 'utf8');
const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession Phase 5 workspace refinement audit failed: ${message}`);
};

const [appSource, lightRouteSource, deckSource, releaseCss, selectorSource, runtimeSource] = await Promise.all([
  read('src/components/succession/SuccessionArchiveApp.jsx'),
  read('src/components/succession/SuccessionArchiveLightRoute.jsx'),
  read('src/components/succession/SuccessionWorkspaceRefinementDeck.jsx'),
  read('src/components/succession/SuccessionReleaseDesktop.css'),
  read('src/data/succession/workspaceRefinementSelectors.js'),
  read('src/data/succession/workspaceRefinementRuntime.js'),
]);

assert(appSource.includes("import SuccessionWorkspaceRefinementDeck from './SuccessionWorkspaceRefinementDeck'"), 'the archive app must import the Phase 5 refinement deck');
assert(appSource.includes('<SuccessionWorkspaceRefinementDeck routeId={route.id}'), 'the archive app must mount the refinement deck before route workspaces');
assert(lightRouteSource.includes("lazy(() => import('./SuccessionWorkspaceRefinementDeck'))"), 'the lightweight route must defer the Phase 5 refinement deck');
assert(lightRouteSource.includes("window.matchMedia('(min-width: 1024px)')"), 'the lightweight route must avoid loading the hidden desktop deck below its presentation boundary');
assert(lightRouteSource.includes('routeId="black-whale"') && lightRouteSource.indexOf('routeId="black-whale"') < lightRouteSource.indexOf('<BlackWhaleGuide'), 'Black Whale must mount the Phase 5 deck before its preserved atlas on desktop');
assert(deckSource.includes("new Set(['story', 'chapters', 'relationships', 'black-whale', 'nen', 'research'])"), 'the deck must remain scoped to the six approved workspaces');
assert(releaseCss.includes('@media (min-width: 1024px)'), 'Phase 5 presentation must retain its desktop and laptop boundary');
assert(!releaseCss.includes('@media (max-width:'), 'Phase 5 must not introduce tablet or mobile presentation rules');
assert(selectorSource.includes('directInteractionClaimed: basis === \'documented-same-event\''), 'the ability matrix must never claim direct interaction from spatial or mechanical overlap alone');
assert(selectorSource.includes('inheritedSourceChain: true') && selectorSource.includes('claim-source-explicit'), 'claim provenance must distinguish inherited entity sources from explicit claim sources');
assert(selectorSource.includes('aliasOnly') && selectorSource.includes('unresolvedReferences'), 'glossary enforcement must expose alias-only usage and broken references');
assert(runtimeSource.includes("from './successionData.js'"), 'Phase 5 must refine the public runtime rather than add another entity predecessor layer');

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const runtime = await vite.ssrLoadModule('/src/data/succession/workspaceRefinementRuntime.js');
  const archive = await vite.ssrLoadModule('/src/data/succession/successionData.js');
  const latest = archive.successionArchiveData.chapters.at(-1)?.number || 414;
  const previous = Math.max(338, latest - 1);

  const delta = runtime.getChapterDeltaBrief(latest);
  assert(delta.chapter === latest && delta.previousChapter === previous, 'chapter delta must use adjacent bounded chapters');
  assert(Array.isArray(delta.diff.records), 'chapter delta must expose generated state records');
  for (const category of ['direct-cause', 'enabling-condition', 'constraint', 'contextual-link', 'sequence-only']) {
    assert(Array.isArray(delta.causalityGroups[category]), `chapter delta is missing ${category} classification`);
  }
  assert(delta.causalLinks.every((link) => ['confirmed', 'inferred', 'theory'].includes(link.evidenceState)), 'causal links must expose evidence state');

  const relationship = archive.getEntitiesByType('relationship')[0];
  assert(relationship, 'the relationship archive must remain available');
  const focused = runtime.getFocusedRelationshipView(relationship.sourceEntityId, latest, { depth: 2 });
  assert(focused?.focus?.id === relationship.sourceEntityId, 'focused relationship view must preserve its selected center');
  assert(focused.depth === 2, 'focused relationship view must support two-hop neighborhoods');
  assert(Array.isArray(focused.edges) && Array.isArray(focused.nodes), 'focused relationship view must expose nodes and edges');
  assert(focused.edges.every((edge) => Array.isArray(edge.sources)), 'focused relationship edges must expose source records');

  const ship = runtime.getBlackWhaleSnapshotComparison(previous, latest);
  assert(ship.fromChapter === previous && ship.toChapter === latest, 'Black Whale comparison must preserve both chapter boundaries');
  assert(ship.infrastructure.systemCount > 0, 'Black Whale infrastructure index must classify maintained locations');
  assert(Array.isArray(ship.locationChanges) && Array.isArray(ship.movements), 'Black Whale comparison must expose spatial changes and movements');
  assert(Object.values(ship.infrastructure.systems).every((system) => Array.isArray(system.locations)), 'every ship infrastructure system must expose its locations');

  const matrix = runtime.getAbilityInteractionMatrix(latest);
  assert(matrix.summary.abilities > 0, 'ability matrix must include known abilities');
  assert(Array.isArray(matrix.interactions), 'ability matrix must expose interaction records');
  assert(matrix.interactions.every((record) => record.directInteractionClaimed === (record.basis === 'documented-same-event')), 'ability matrix must reserve direct interaction claims for shared events');
  assert(matrix.interactions.every((record) => ['confirmed-context', 'system-linked', 'spatial-context', 'comparative-only'].includes(record.evidenceStrength)), 'ability matrix must expose evidence strength');

  const provenanceTarget = archive.getEntitiesByType('object').find((entity) => /seed urn/i.test(entity.name))
    || archive.getEntitiesByType('protocol')[0]
    || archive.getEntitiesByType('ability')[0];
  assert(provenanceTarget, 'a provenance target must be available');
  const provenance = runtime.getClaimProvenanceProfile(provenanceTarget.id, latest);
  assert(provenance?.claims.length > 0, 'claim provenance must generate field-level claims');
  assert(provenance.claims.every((claim) => ['entity-source-inherited', 'claim-source-explicit', 'source-missing'].includes(claim.provenanceState)), 'every claim must expose a provenance state');
  assert(provenance.claims.every((claim) => Array.isArray(claim.sources)), 'every claim must expose a source list');

  const coverage = runtime.getProvenanceCoverageReport(latest);
  assert(coverage.claims >= provenance.claims.length, 'archive provenance coverage must include the selected record');
  assert(coverage.coverage >= 0 && coverage.coverage <= 100, 'provenance coverage must be a percentage');

  const glossary = runtime.getGlossaryEnforcementReport(latest);
  assert(glossary.entries.length >= 20, 'glossary enforcement must retain the maintained glossary catalogue');
  assert(Array.isArray(glossary.aliasOnly) && Array.isArray(glossary.unlinked) && Array.isArray(glossary.unresolvedReferences), 'glossary enforcement must expose all three review queues');
  assert(glossary.unresolvedReferences.length === 0, `broken glossary references remain: ${glossary.unresolvedReferences.map((record) => `${record.entity.id} -> ${record.glossaryId}`).join(', ')}`);

  const summary = runtime.getWorkspaceRefinementSummary(latest);
  assert(summary.chapter === latest, 'Phase 5 summary must respect the latest chapter boundary');
  assert(summary.infrastructureSystems === ship.infrastructure.systemCount, 'Phase 5 summary must reflect the ship infrastructure index');
  assert(summary.glossaryTerms === glossary.entries.length, 'Phase 5 summary must reflect glossary enforcement');

  console.log(`Succession Phase 5 workspace refinement audit passed: Chapter ${latest} delta and causality, ${focused.nodes.length} focused relationship nodes, ${ship.infrastructure.systemCount} Black Whale systems, ${matrix.interactions.length} ability interaction contexts, ${coverage.claims} provenance claims, and ${glossary.entries.length} glossary terms verified.`);
} finally {
  await vite.close();
}
