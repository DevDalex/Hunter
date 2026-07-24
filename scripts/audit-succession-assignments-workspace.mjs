import { readFile } from 'node:fs/promises';
import { createServer } from 'vite';
import {
  declarationIncludesLiteral,
  sourceImportsDefault,
  sourceRendersRouteWith,
} from './lib/succession-audit-contracts.mjs';

const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession assignment workspace audit failed: ${message}`);
};

const [workspace, styles, app, foundation, expansion, selectors, indexes] = await Promise.all([
  readFile(new URL('../src/components/succession/SuccessionArchiveAssignmentWorkspace.jsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/components/succession/SuccessionArchiveAssignmentWorkspace.css', import.meta.url), 'utf8'),
  readFile(new URL('../src/components/succession/SuccessionArchiveApp.jsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/data/succession/entitiesAssignmentFoundation.js', import.meta.url), 'utf8'),
  readFile(new URL('../src/data/succession/assignmentFoundationExpansion.js', import.meta.url), 'utf8'),
  readFile(new URL('../src/data/succession/selectors.js', import.meta.url), 'utf8'),
  readFile(new URL('../src/data/succession/indexes.js', import.meta.url), 'utf8'),
]);

assert(sourceImportsDefault(app, 'AssignmentsWorkspace', './SuccessionArchiveAssignmentWorkspace'), 'app must load the dedicated assignment workspace');
assert(!app.includes('  BodyguardsWorkspace,'), 'app must not import the legacy bodyguard matrix into the active route');
assert(sourceRendersRouteWith(app, 'bodyguards', 'AssignmentsWorkspace'), 'bodyguards route must render the dedicated assignment workspace');
assert(declarationIncludesLiteral(app, 'specializedRecordRoute', 'bodyguards'), 'assignment and personnel entities must remain in the dedicated route');
assert(foundation.includes('assignmentEnrichment'), 'existing assignments must receive normalized objectives and event links');
assert(expansion.includes('assignmentFoundationExpansion'), 'expanded assignment records must be published');
assert(expansion.includes('furykov-observes-room-1014-class'), 'Furykov’s class observation must be indexed');
assert(expansion.includes('rihan-analyzes-sale-sale'), 'Rihan’s analysis assignment must be indexed');
assert(expansion.includes('balsamilco-targets-halkenburg'), 'Balsamilco’s poisoning operation must be indexed');
assert(expansion.includes('melody-protects-fugetsu'), 'Melody’s post-Kacho protection assignment must be indexed');
assert(expansion.includes('moswana-have-not-curse-deployment'), 'Camilla’s curse network must retain an unknown-target assignment record');
assert(selectors.includes('getAssignmentSnapshot'), 'selectors must expose entity assignment snapshots');
assert(selectors.includes('getAssignmentChain'), 'selectors must expose predecessor and replacement chains');
assert(selectors.includes('getActiveAssignmentsAtChapter'), 'selectors must expose chapter-specific operational snapshots');
assert(selectors.includes('getAssignmentsReportingTo'), 'selectors must expose reporting chains');
assert(indexes.includes('assignmentsByAllegiance'), 'indexes must track allegiance separately from principal and subject');
assert(indexes.includes('assignmentsByReporting'), 'indexes must track reporting lines');
assert(indexes.includes('assignmentsByEvent'), 'indexes must connect assignments to events');
assert(indexes.includes('assignmentsByChapter'), 'indexes must support chapter snapshots');
assert(workspace.includes("getEntitiesByType('assignment')"), 'workspace must read canonical assignment entities');
assert(workspace.includes('Filter the assignment graph'), 'workspace must provide operational filters');
assert(workspace.includes('Who acts, for whom, against whom, and where'), 'workspace must render the command and obligation chain');
assert(workspace.includes('Previous and replacement records'), 'workspace must render assignment succession');
assert(workspace.includes('Assignment sources'), 'workspace must render evidence references');
assert(styles.includes('.succession-assignment-command-chain'), 'styles must own command-chain presentation');
assert(styles.includes('@media (max-width: 820px)'), 'workspace must include responsive layout handling');
assert(styles.includes('@media (prefers-reduced-motion: reduce)'), 'workspace must include reduced-motion handling');

const vite = await createServer({
  appType: 'custom',
  logLevel: 'error',
  server: { middlewareMode: true },
});

try {
  const archiveModule = await vite.ssrLoadModule('/src/data/succession/successionData.js');
  const {
    getActiveAssignmentsAtChapter,
    getAssignmentChain,
    getAssignmentSnapshot,
    getAssignmentsForAllegiance,
    getAssignmentsForChapter,
    getAssignmentsForEvent,
    getAssignmentsReportingTo,
    getEntitiesByType,
    getEntityById,
    searchSuccessionArchive,
    successionArchiveValidation,
  } = archiveModule;

  assert(successionArchiveValidation.valid, 'expanded canonical data must pass schema validation');
  const assignments = getEntitiesByType('assignment');
  assert(assignments.length >= 37, `assignment foundation must retain at least 37 records, found ${assignments.length}`);
  assert(assignments.every((assignment) => assignment.objective), 'every assignment must publish an objective');
  assert(assignments.every((assignment) => assignment.authorityBasis), 'every assignment must publish an authority basis');
  assert(assignments.every((assignment) => Array.isArray(assignment.operationalNotes)), 'every assignment must publish an operational-notes array');
  assert(assignments.every((assignment) => Array.isArray(assignment.relatedEventIds)), 'every assignment must publish related-event IDs');
  assert(assignments.every((assignment) => assignment.certainty), 'every assignment must publish certainty');

  for (const assignment of assignments) {
    for (const eventId of assignment.relatedEventIds || []) {
      assert(getEntityById(eventId)?.entityType === 'event', `${assignment.id} references missing event ${eventId}`);
    }
    if (assignment.supersedesAssignmentId) {
      assert(getEntityById(assignment.supersedesAssignmentId)?.entityType === 'assignment', `${assignment.id} references missing predecessor ${assignment.supersedesAssignmentId}`);
    }
    if (assignment.replacedByAssignmentId) {
      assert(getEntityById(assignment.replacedByAssignmentId)?.entityType === 'assignment', `${assignment.id} references missing replacement ${assignment.replacedByAssignmentId}`);
    }
  }

  const rihanChain = getAssignmentChain('assignment:rihan-analyzes-sale-sale');
  assert(rihanChain?.person?.id === 'character:rihan', 'Rihan assignment must resolve its operative');
  assert(rihanChain?.subject?.id === 'character:sale-sale-hui-guo-rou', 'Rihan assignment must resolve Sale-sale as its subject');
  assert(rihanChain?.successor?.id === 'assignment:yushohi-eliminates-sale-sale', 'Rihan assignment must link to Yushohi’s replacement operation');

  const melodyChain = getAssignmentChain('assignment:melody-protects-fugetsu');
  assert(melodyChain?.predecessor?.id === 'assignment:melody-protects-kacho', 'Melody’s Fugetsu role must supersede her Kacho assignment');
  assert(melodyChain?.location?.id === 'location:black-whale:tier-1:justice-bureau:medical-wing', 'Melody’s continued protection must resolve the Justice medical wing');

  const saleSaleAssignments = new Set(getAssignmentsForEvent('event:sale-sale-elimination').map((assignment) => assignment.id));
  assert(saleSaleAssignments.has('assignment:rihan-analyzes-sale-sale'), 'Sale-sale event must expose Rihan’s analysis assignment');
  assert(saleSaleAssignments.has('assignment:yushohi-eliminates-sale-sale'), 'Sale-sale event must expose Yushohi’s terminal assignment');

  const benjaminReporting = new Set(getAssignmentsReportingTo('character:benjamin-hui-guo-rou').map((assignment) => assignment.id));
  assert(benjaminReporting.has('assignment:furykov-observes-room-1014-class'), 'Benjamin reporting chain must include Furykov');
  assert(benjaminReporting.has('assignment:balsamilco-targets-halkenburg'), 'Benjamin reporting chain must include Balsamilco’s operation');

  const benjaminAllegiance = new Set(getAssignmentsForAllegiance('character:benjamin-hui-guo-rou').map((assignment) => assignment.id));
  assert(benjaminAllegiance.has('assignment:rihan-analyzes-sale-sale'), 'Benjamin allegiance index must include Rihan');
  assert(benjaminAllegiance.has('assignment:vict-targets-halkenburg'), 'Benjamin allegiance index must include Vict');

  const chapter381 = new Set(getAssignmentsForChapter(381).map((assignment) => assignment.id));
  assert(chapter381.has('assignment:rihan-analyzes-sale-sale'), 'Chapter 381 snapshot must include Rihan’s analysis phase');
  assert(chapter381.has('assignment:yushohi-eliminates-sale-sale'), 'Chapter 381 snapshot must include Yushohi’s follow-on phase');

  const chapter411 = new Set(getActiveAssignmentsAtChapter(411).map((assignment) => assignment.id));
  assert(chapter411.has('assignment:sarahell-infiltrates-woble'), 'Chapter 411 snapshot must include Sarahell’s infiltration');
  assert(chapter411.has('assignment:furykov-observes-room-1014-class'), 'Chapter 411 snapshot must include Furykov’s observation role');
  assert(chapter411.has('assignment:melody-protects-fugetsu'), 'Chapter 411 snapshot must include Melody’s Fugetsu protection');

  const wobleSnapshot = getAssignmentSnapshot('character:woble-hui-guo-rou', 411);
  const wobleAssignmentIds = new Set(wobleSnapshot.assignments.map((assignment) => assignment.id));
  assert(wobleAssignmentIds.has('assignment:kurapika-protects-woble'), 'Woble snapshot must include Kurapika’s protection');
  assert(wobleAssignmentIds.has('assignment:sarahell-infiltrates-woble'), 'Woble snapshot must include the covert curse threat');
  assert(wobleSnapshot.byRole.subject.length >= 8, 'Woble snapshot must preserve the mixed protection and surveillance network');

  assert(searchSuccessionArchive('death-powered curse operation').some(({ entity }) => entity.id === 'assignment:moswana-have-not-curse-deployment'), 'global search must resolve assignment objectives and notes');
  assert(searchSuccessionArchive('Furykov Nen-class observation').some(({ entity }) => entity.id === 'assignment:furykov-observes-room-1014-class'), 'global search must resolve assignment aliases');

  console.log(`Succession assignment workspace audit passed: ${assignments.length} assignments, chapter snapshots, allegiance, reporting, event links, succession chains, objectives, evidence, and responsive presentation are wired.`);
} finally {
  await vite.close();
}
