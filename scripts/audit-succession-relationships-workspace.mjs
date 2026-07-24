import { readFile } from 'node:fs/promises';
import { createServer } from 'vite';

const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession relationship workspace audit failed: ${message}`);
};

const [workspace, styles, app, dataEntry, foundation, expansion, selectors, indexes, registries] = await Promise.all([
  readFile(new URL('../src/components/succession/SuccessionArchiveRelationshipWorkspace.jsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/components/succession/SuccessionArchiveRelationshipWorkspace.css', import.meta.url), 'utf8'),
  readFile(new URL('../src/components/succession/SuccessionArchiveApp.jsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/data/succession/successionData.js', import.meta.url), 'utf8'),
  readFile(new URL('../src/data/succession/entitiesRelationshipFoundation.js', import.meta.url), 'utf8'),
  readFile(new URL('../src/data/succession/relationshipFoundationExpansion.js', import.meta.url), 'utf8'),
  readFile(new URL('../src/data/succession/selectors.js', import.meta.url), 'utf8'),
  readFile(new URL('../src/data/succession/indexes.js', import.meta.url), 'utf8'),
  readFile(new URL('../src/data/succession/registries.js', import.meta.url), 'utf8'),
]);

assert(app.includes("import RelationshipsWorkspace from './SuccessionArchiveRelationshipWorkspace';"), 'app must load the dedicated canonical relationship workspace');
assert(!app.includes('  RelationshipsWorkspace,'), 'app must not import the legacy relationship ledger from deep workspaces');
assert(app.includes("['princes', 'queens', 'chapters', 'locations', 'bodyguards', 'relationships']"), 'relationship records must remain inside the specialized route');
assert(dataEntry.includes("from './entitiesRelationshipFoundation.js'"), 'canonical data entry must activate the relationship foundation');
assert(foundation.includes('relationshipEnrichment'), 'existing relationships must receive normalized graph metadata');
assert(expansion.includes('relationshipFoundationExpansion'), 'expanded relationship records must be published');
assert(expansion.includes('benjamin-balsamilco-command'), 'Benjamin and Balsamilco command relationship must be indexed');
assert(expansion.includes('longhi-kurapika-moonlight-act-treaty'), 'Longhi and Kurapika treaty relationship must be indexed');
assert(expansion.includes('theta-tserriednich-conflicted-instructor'), 'Theta and Tserriednich deception relationship must be indexed');
assert(expansion.includes('phantom-troupe-heil-ly-hostility'), 'Troupe and Heil-Ly hostility must be indexed');
assert(registries.includes("'command'"), 'command must be a registered relationship type');
assert(registries.includes("'deception'"), 'deception must be a registered relationship type');
assert(indexes.includes('relationshipsByChapter'), 'indexes must support chapter relationship snapshots');
assert(indexes.includes('relationshipsByEvent'), 'indexes must connect relationships to events');
assert(indexes.includes('relationshipsBySource'), 'indexes must preserve directed source roles');
assert(indexes.includes('relationshipsByTarget'), 'indexes must preserve directed target roles');
assert(selectors.includes('getRelationshipSnapshot'), 'selectors must expose entity relationship snapshots');
assert(selectors.includes('getRelationshipNeighborhood'), 'selectors must expose local graph neighborhoods');
assert(selectors.includes('getActiveRelationshipsAtChapter'), 'selectors must expose chapter-specific relationship states');
assert(selectors.includes('getRelationshipDetail'), 'selectors must resolve edge endpoints and events');
assert(workspace.includes("getEntitiesByType('relationship')"), 'workspace must read canonical relationship entities');
assert(workspace.includes('Filter relationship states and evidence'), 'workspace must provide relationship filters');
assert(workspace.includes('Source, direction, and target'), 'workspace must render canonical edge direction');
assert(workspace.includes('Events that establish or transform this relationship'), 'workspace must render event evidence');
assert(workspace.includes('Relationship sources'), 'workspace must render source evidence');
assert(styles.includes('.succession-relationship-edge'), 'styles must own edge presentation');
assert(styles.includes('@media (max-width:820px)'), 'workspace must include responsive handling');
assert(styles.includes('@media (prefers-reduced-motion:reduce)'), 'workspace must include reduced-motion handling');

const vite = await createServer({
  appType: 'custom',
  logLevel: 'error',
  server: { middlewareMode: true },
});

try {
  const archiveModule = await vite.ssrLoadModule('/src/data/succession/successionData.js');
  const {
    getActiveRelationshipsAtChapter,
    getEntitiesByType,
    getEntityById,
    getRelationshipDetail,
    getRelationshipNeighborhood,
    getRelationshipSnapshot,
    getRelationshipsForEvent,
    getRelationshipsForType,
    searchSuccessionArchive,
    successionArchiveValidation,
  } = archiveModule;

  assert(successionArchiveValidation.valid, 'expanded canonical data must pass schema validation');
  const relationships = getEntitiesByType('relationship');
  assert(relationships.length >= 54, `relationship foundation must retain at least 54 records, found ${relationships.length}`);
  assert(relationships.every((relationship) => relationship.basis), 'every relationship must publish an evidence basis');
  assert(relationships.every((relationship) => relationship.operationalState), 'every relationship must publish an operational state');
  assert(relationships.every((relationship) => relationship.strength), 'every relationship must publish a strength label');
  assert(relationships.every((relationship) => relationship.certainty), 'every relationship must publish certainty');
  assert(relationships.every((relationship) => Array.isArray(relationship.relatedEventIds)), 'every relationship must publish related-event IDs');
  assert(relationships.every((relationship) => Array.isArray(relationship.evidenceNotes)), 'every relationship must publish evidence-note arrays');

  for (const relationship of relationships) {
    assert(getEntityById(relationship.sourceEntityId), `${relationship.id} references a missing source node`);
    assert(getEntityById(relationship.targetEntityId), `${relationship.id} references a missing target node`);
    for (const eventId of relationship.relatedEventIds || []) {
      assert(getEntityById(eventId)?.entityType === 'event', `${relationship.id} references missing event ${eventId}`);
    }
  }

  const commandTypes = new Set(getRelationshipsForType('command').map((relationship) => relationship.id));
  assert(commandTypes.has('relationship:benjamin-balsamilco-command'), 'command index must include Benjamin and Balsamilco');
  assert(commandTypes.has('relationship:camilla-private-guard-command'), 'command index must include Camilla’s guard network');

  const benjaminBalsamilco = getRelationshipDetail('relationship:benjamin-balsamilco-command');
  assert(benjaminBalsamilco?.source?.id === 'character:benjamin-hui-guo-rou', 'command edge must resolve Benjamin as source');
  assert(benjaminBalsamilco?.target?.id === 'character:balsamilco-might', 'command edge must resolve Balsamilco as target');
  assert(benjaminBalsamilco?.relationship?.status === 'transformed', 'Balsamilco command state must preserve its transformation');
  assert(benjaminBalsamilco?.events.some((event) => event.id === 'event:balsamilco-poisoning-operation'), 'command edge must connect to the poisoning operation');

  const chapter403 = new Set(getActiveRelationshipsAtChapter(403).map((relationship) => relationship.id));
  assert(chapter403.has('relationship:benjamin-balsamilco-command'), 'Chapter 403 must include Benjamin’s command relationship');
  assert(chapter403.has('relationship:benjamin-halkenburg-succession-hostility'), 'Chapter 403 must include Benjamin–Halkenburg hostility');

  const chapter411 = new Set(getActiveRelationshipsAtChapter(411).map((relationship) => relationship.id));
  assert(chapter411.has('relationship:melody-fugetsu-protection'), 'Chapter 411 must include Melody’s Fugetsu protection');
  assert(chapter411.has('relationship:kaiser-fugetsu-protective-custody'), 'Chapter 411 must include Kaiser’s protective custody');
  assert(!chapter411.has('relationship:kacho-fugetsu-twin-bond'), 'the living-character twin edge must end at Kacho’s death rather than remain falsely active');

  const wobleSnapshot = getRelationshipSnapshot('character:woble-hui-guo-rou', 411);
  const wobleEdges = new Set(wobleSnapshot.relationships.map((relationship) => relationship.id));
  assert(wobleEdges.has('relationship:kurapika-woble'), 'Woble snapshot must include Kurapika’s protection');
  assert(wobleEdges.has('relationship:oito-woble-mother-and-protector'), 'Woble snapshot must include Oito’s family and command edge');

  const heilLyNeighborhood = getRelationshipNeighborhood('organization:heil-ly', 400);
  const heilLyEdges = new Set(heilLyNeighborhood.edges.map((relationship) => relationship.id));
  assert(heilLyEdges.has('relationship:xi-yu-heil-ly-open-hostility'), 'Heil-Ly neighborhood must include Xi-Yu hostility');
  assert(heilLyEdges.has('relationship:cha-r-heil-ly-open-hostility'), 'Heil-Ly neighborhood must include Cha-R hostility');
  assert(heilLyEdges.has('relationship:phantom-troupe-heil-ly-hostility'), 'Heil-Ly neighborhood must include Phantom Troupe hostility');

  const balsamilcoEventEdges = new Set(getRelationshipsForEvent('event:balsamilco-poisoning-operation').map((relationship) => relationship.id));
  assert(balsamilcoEventEdges.has('relationship:benjamin-balsamilco-command'), 'poisoning event must expose the command edge');
  assert(balsamilcoEventEdges.has('relationship:benjamin-halkenburg-succession-hostility'), 'poisoning event must expose succession hostility');

  assert(searchSuccessionArchive('Moonlight Act treaty partners').some(({ entity }) => entity.id === 'relationship:longhi-kurapika-moonlight-act-treaty'), 'global search must resolve relationship aliases');
  assert(searchSuccessionArchive('coercive and unstable').some(({ entity }) => entity.id === 'relationship:theta-tserriednich-conflicted-instructor'), 'global search must resolve operational relationship states');

  console.log(`Succession relationship workspace audit passed: ${relationships.length} edges, chapter snapshots, command and deception types, event evidence, directed roles, neighborhoods, search, sources, and responsive presentation are wired.`);
} finally {
  await vite.close();
}
