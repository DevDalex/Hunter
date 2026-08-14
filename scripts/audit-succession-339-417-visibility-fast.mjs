import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'vite';

const root = process.cwd();
const output = path.resolve(root, process.env.SUCCESSION_VISIBILITY_AUDIT_OUTPUT || '.succession-339-417-visibility-audit');
const START = 339;
const SUCCESSION_START = 340;
const END = 417;
const failures = [];
const warnings = [];
const passes = [];
const domains = new Map();

const normalize = (value) => String(value || '')
  .normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
  .replace(/[’‘]/g, "'").replace(/[“”]/g, '"')
  .replace(/[^a-zA-Z0-9]+/g, ' ').trim().toLocaleLowerCase('en-US');
const bump = (domain, key) => {
  const row = domains.get(domain) || { checked: 0, visible: 0, warnings: 0, failures: 0 };
  row.checked += 1;
  row[key] += 1;
  domains.set(domain, row);
};
const pass = (domain, id, message, extra = {}) => { passes.push({ domain, id, status: 'VISIBLE', message, ...extra }); bump(domain, 'visible'); };
const warn = (domain, id, status, message, extra = {}) => { warnings.push({ domain, id, status, message, ...extra }); bump(domain, 'warnings'); };
const fail = (domain, id, status, message, extra = {}) => { failures.push({ domain, id, status, message, ...extra }); bump(domain, 'failures'); };

const routeForType = Object.freeze({
  character: 'characters', organization: 'organizations', ability: 'nen', 'guardian-beast': 'guardian-spirit-beasts',
  location: 'locations', 'location-history': 'locations', event: 'events', assignment: 'bodyguards', chapter: 'chapters',
  relationship: 'relationships', source: 'research', 'knowledge-record': 'research', protocol: 'research', object: 'research',
  document: 'research', 'evidence-item': 'research',
});
const researchSearchTypes = new Set(['knowledge-record', 'protocol', 'object', 'document', 'evidence-item']);

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const [runtime, research, seriesResearch, chaptersModule, archiveMeta, routes, inventory, router] = await Promise.all([
    vite.ssrLoadModule('/src/data/succession/successionData.js'),
    vite.ssrLoadModule('/src/data/succession/successionResearch.js'),
    vite.ssrLoadModule('/src/data/seriesResearch.js'),
    vite.ssrLoadModule('/src/data/chapters.js'),
    vite.ssrLoadModule('/src/data/archiveMeta.js'),
    vite.ssrLoadModule('/src/data/succession/archiveRoutes.js'),
    vite.ssrLoadModule('/src/data/succession/productInventory.js'),
    vite.ssrLoadModule('/src/lib/appRouter.js'),
  ]);
  const [archiveEntry, dossierEntry, routeSource] = await Promise.all([
    readFile(path.join(root, 'src/data/successionArchive.js'), 'utf8'),
    readFile(path.join(root, 'src/data/successionDossier.js'), 'utf8'),
    readFile(path.join(root, 'src/data/succession/archiveRoutes.js'), 'utf8'),
  ]);

  archiveEntry.includes('successionArchiveThrough417.js') ? pass('entrypoints', 'archive', 'Archive targets Through417.') : fail('entrypoints', 'archive', 'WRONG-BOUNDARY', 'Archive does not target Through417.');
  dossierEntry.includes('successionDossierThrough417.js') ? pass('entrypoints', 'dossier', 'Dossier targets Through417.') : fail('entrypoints', 'dossier', 'WRONG-BOUNDARY', 'Dossier does not target Through417.');
  if (/latest imported reader release/i.test(routeSource)) warn('copy', 'route:chapters:description', 'MISLEADING-BOUNDARY-COPY', 'Chapter route copy ties research coverage to the reader-media ceiling even though research extends through 417 and local media through 416.');

  for (const [id, value] of [
    ['ARCHIVE_BOUNDARY', archiveMeta.ARCHIVE_BOUNDARY],
    ['ARCHIVE_DETAILED_BOUNDARY', archiveMeta.ARCHIVE_DETAILED_BOUNDARY],
    ['LATEST_SUCCESSION_RESEARCH_CHAPTER', research.LATEST_SUCCESSION_RESEARCH_CHAPTER],
  ]) Number(value) === END ? pass('boundaries', id, `${id} = ${END}.`) : fail('boundaries', id, 'WRONG-BOUNDARY', `${id} = ${value}, expected ${END}.`);

  const chapter339Research = seriesResearch.getPreSuccessionResearch(START);
  const chapter339 = chaptersModule.chapters.find((record) => record.number === START);
  chapter339Research && chapter339 ? pass('chapter-339', 'chapter:339:data', 'Chapter 339 is maintained in series research/catalogue.') : fail('chapter-339', 'chapter:339:data', 'ORPHANED', 'Chapter 339 data is missing.');
  const destination339 = router.normalizeDestination('series', 'chapters', { chapter: START });
  destination339.view === 'not-found'
    ? fail('chapter-339', 'chapter:339:route', 'DEAD-ROUTE', 'Chapter 339 still points to the retired series view and is unreachable in the released app.', { destination339 })
    : pass('chapter-339', 'chapter:339:route', `Chapter 339 resolves to ${destination339.view}/${destination339.target}.`, { destination339 });

  const maintained = research.successionChapterResearch.filter((record) => record.number >= SUCCESSION_START && record.number <= END);
  const expectedNumbers = Array.from({ length: END - SUCCESSION_START + 1 }, (_, index) => SUCCESSION_START + index);
  const actualNumbers = maintained.map((record) => record.number);
  JSON.stringify(actualNumbers) === JSON.stringify(expectedNumbers)
    ? pass('chapters', 'maintained:340-417', `All ${expectedNumbers.length} maintained chapters are contiguous.`)
    : fail('chapters', 'maintained:340-417', 'ORPHANED', 'Maintained chapter chain is not contiguous.', { actualNumbers });

  const activeRouteIds = new Set(routes.successionArchiveRoutes.filter((record) => record.status === 'active').map((record) => record.id));
  const inventoryRouteIds = new Set([
    ...inventory.successionProductInventory.authoritativeWorkspaces,
    ...inventory.successionProductInventory.preservedVisualTools,
  ].map((record) => record.routeId));

  for (const number of expectedNumbers) {
    const chapter = runtime.getChapter(number);
    const dossier = runtime.getChapterStoryDossier(number);
    const evidence = runtime.getChapterEvidenceProfile(number);
    if (!chapter) { fail('chapters', `chapter:${number}`, 'ORPHANED', 'Maintained chapter has no canonical chapter entity.'); continue; }
    if (!dossier) { fail('chapters', chapter.id, 'NO-UI-SURFACE', 'Canonical chapter has no Story dossier.'); continue; }
    if (!evidence) { fail('chapters', chapter.id, 'NO-UI-SURFACE', 'Canonical chapter has no Research evidence profile.'); continue; }
    const search = runtime.searchArchiveProduct(`Chapter ${number}`, { chapter: END, limit: 100 }).find((item) => item.id === chapter.id);
    if (!search) fail('chapters', chapter.id, 'REACHABLE-BUT-HIDDEN', 'Canonical chapter is missing from Global Search.');
    else if (search.route !== 'chapters') fail('chapters', chapter.id, 'WRONG-LINK', `Chapter search routes to ${search.route}.`, { search });
    else pass('chapters', chapter.id, 'Chapter has canonical entity, Story dossier, Research evidence profile, and Search route.');
  }

  for (const record of maintained) {
    const canonicalEvents = runtime.getEventsForChapter(record.number);
    const names = new Set(canonicalEvents.map((event) => normalize(event.name)));
    const ids = new Set(canonicalEvents.flatMap((event) => [event.id, event.slug, event.id?.replace(/^event:/, '')]).filter(Boolean));
    for (const beat of [...(record.events || []), ...(record.prelude || [])]) {
      const title = beat.title || beat.name || '';
      const matched = [beat.id, beat.id && `event:${beat.id}`].filter(Boolean).some((id) => ids.has(id)) || names.has(normalize(title));
      matched
        ? pass('maintained-beats', `chapter:${record.number}:${beat.id || normalize(title)}`, 'Maintained beat has an exact canonical event match.', { chapter: record.number, title })
        : warn('maintained-beats', `chapter:${record.number}:${beat.id || normalize(title)}`, 'POTENTIALLY-HIDDEN', 'Maintained beat has no exact canonical event ID/title match.', { chapter: record.number, title, canonicalEventCount: canonicalEvents.length });
    }
  }

  // Every canonical record must resolve by ID and have a released owner route. Browser QA proves directory rendering exhaustively.
  for (const [entityType, routeId] of Object.entries(routeForType)) {
    for (const entity of runtime.getEntitiesByType(entityType)) {
      if (entity.publicationStatus === 'hidden') { warn(`entities:${entityType}`, entity.id, 'INTENTIONALLY-HIDDEN', 'Explicitly hidden publication record.'); continue; }
      if (entity.publicationStatus === 'draft') { warn(`entities:${entityType}`, entity.id, 'DRAFT-NOT-PUBLISHED', 'Explicit draft record.'); continue; }
      if (!runtime.getEntityById(entity.id)) { fail(`entities:${entityType}`, entity.id, 'ORPHANED', 'Collection record does not resolve by canonical ID.'); continue; }
      if (!activeRouteIds.has(routeId) || !inventoryRouteIds.has(routeId)) { fail(`entities:${entityType}`, entity.id, 'DEAD-ROUTE', `Owning route ${routeId} is not released.'); continue; }
      if (entityType === 'location-history') {
        const history = runtime.getLocationHistoryForCharacter(entity.characterId);
        history.some((item) => item.id === entity.id)
          ? pass(`entities:${entityType}`, entity.id, 'Location history is reachable through character/location selectors.')
          : fail(`entities:${entityType}`, entity.id, 'NO-UI-SURFACE', 'Location history is absent from the character/location history selector.');
        continue;
      }
      if (researchSearchTypes.has(entityType)) {
        const search = runtime.searchArchiveProduct(entity.name, { chapter: END, limit: 100 }).find((item) => item.id === entity.id);
        if (!search) fail(`entities:${entityType}`, entity.id, 'REACHABLE-BUT-HIDDEN', `${entityType} has no Global Search result.`);
        else if (search.route !== 'research') fail(`entities:${entityType}`, entity.id, 'WRONG-LINK', `${entityType} search routes to ${search.route}.`, { search });
        else pass(`entities:${entityType}`, entity.id, 'Research intelligence record resolves by ID, route, and Global Search.');
      } else pass(`entities:${entityType}`, entity.id, `Canonical record resolves and owns active route ${routeId}.`);
    }
  }

  for (const [characterId, records] of Object.entries(runtime.successionArchiveData.characterStateProfiles || {})) {
    const timelineIds = new Set(runtime.getCharacterStateTimeline(characterId).map((record) => record.id));
    for (const record of records) timelineIds.has(record.id) ? pass('character-states', record.id, 'State is in the character dossier timeline.') : fail('character-states', record.id, 'NO-UI-SURFACE', 'State is missing from character dossier timeline.', { characterId });
  }
  for (const [organizationId, records] of Object.entries(runtime.successionArchiveData.organizationStateProfiles || {})) {
    const timelineIds = new Set(runtime.getOrganizationStateTimeline(organizationId).map((record) => record.id));
    for (const record of records) timelineIds.has(record.id) ? pass('organization-states', record.id, 'State is in the organization dossier timeline.') : fail('organization-states', record.id, 'NO-UI-SURFACE', 'State is missing from organization dossier timeline.', { organizationId });
  }
  for (const [abilityId, records] of Object.entries(runtime.successionArchiveData.abilityKnowledgeOverrides || {})) {
    for (const record of records) {
      const chapter = Number(record.chapterRange?.start || END);
      runtime.getAbilityKnowledgeAtChapter(abilityId, chapter)?.known
        ? pass('ability-knowledge', record.id, `Ability knowledge is reachable at Chapter ${chapter}.`, { abilityId })
        : fail('ability-knowledge', record.id, 'NO-UI-SURFACE', `Ability knowledge is not reachable at Chapter ${chapter}.`, { abilityId });
    }
  }
  for (const [beastId, records] of Object.entries(runtime.successionArchiveData.guardianBeastStateProfiles || {})) {
    const timelineIds = new Set(runtime.getGuardianBeastStateTimeline(beastId).map((record) => record.id));
    for (const record of records) timelineIds.has(record.id) ? pass('guardian-beast-states', record.id, 'Guardian Beast state is in its dossier timeline.') : fail('guardian-beast-states', record.id, 'NO-UI-SURFACE', 'Guardian Beast state is missing from its dossier timeline.', { beastId });
  }

  for (const profile of Object.values(runtime.successionArchiveData.storyPhaseProfiles || {})) {
    const chapter = Math.min(END, profile.chapterRange?.end ?? END);
    const dossier = runtime.getStoryPhaseDossier(profile.id, chapter);
    const search = runtime.searchArchiveProduct(profile.name, { chapter: END, limit: 100 }).find((item) => item.id === profile.id);
    dossier && search ? pass('story-phases', profile.id, 'Story phase has dossier and Search visibility.') : fail('story-phases', profile.id, 'REACHABLE-BUT-HIDDEN', 'Story phase is missing dossier or Search visibility.', { dossier: Boolean(dossier), search: Boolean(search) });
  }
  for (const profile of Object.values(runtime.successionArchiveData.storyLaneProfiles || {})) {
    const dossier = runtime.getStoryLaneDossier(profile.id, END);
    const search = runtime.searchArchiveProduct(profile.name, { chapter: END, limit: 100 }).find((item) => item.id === profile.id);
    dossier && search ? pass('story-lanes', profile.id, 'Story lane has dossier and Search visibility.') : fail('story-lanes', profile.id, 'REACHABLE-BUT-HIDDEN', 'Story lane is missing dossier or Search visibility.', { dossier: Boolean(dossier), search: Boolean(search) });
  }
  for (const profile of Object.values(runtime.successionArchiveData.storyThreadProfiles || {})) {
    const dossier = runtime.getStoryThreadDossier(profile.id, END);
    const search = runtime.searchArchiveProduct(profile.name, { chapter: END, limit: 100 }).find((item) => item.id === profile.id);
    dossier && search ? pass('story-threads', profile.id, 'Story thread has dossier and Search visibility.') : fail('story-threads', profile.id, 'REACHABLE-BUT-HIDDEN', 'Story thread is missing dossier or Search visibility.', { dossier: Boolean(dossier), search: Boolean(search) });
  }
  const causalIds = new Set(runtime.getStoryCausalLinksAtChapter(END).map((record) => record.id));
  for (const record of Object.values(runtime.successionArchiveData.storyCausalLinksById || {})) causalIds.has(record.id) ? pass('story-causal-links', record.id, 'Causal link is visible in Story graph at 417.') : warn('story-causal-links', record.id, 'BOUNDARY-HIDDEN', 'Causal link is not visible at Chapter 417; verify its endpoints are legitimately outside the boundary.');

  for (const profile of runtime.getNenSystemsAtChapter(END)) {
    const dossier = runtime.getNenSystemDossier(profile.id, END);
    const search = runtime.searchArchiveProduct(profile.name, { chapter: END, limit: 100 }).find((item) => item.id === profile.id && item.route === 'nen');
    dossier && search ? pass('nen-systems', profile.id, 'Nen system has dossier and Search visibility.') : fail('nen-systems', profile.id, 'REACHABLE-BUT-HIDDEN', 'Nen system is missing dossier or Search visibility.', { dossier: Boolean(dossier), search: Boolean(search) });
  }
  for (const entry of runtime.getGlossaryEntriesAtChapter(END)) {
    const search = runtime.searchArchiveProduct(entry.term, { chapter: END, limit: 100 }).find((item) => item.id === entry.id && item.route === 'glossary');
    search ? pass('glossary', entry.id, 'Glossary entry is searchable.') : fail('glossary', entry.id, 'REACHABLE-BUT-HIDDEN', 'Glossary entry is not surfaced by Search.');
  }
  for (const media of runtime.getMediaRecordsAtChapter(END)) {
    const search = runtime.searchArchiveProduct(media.label, { chapter: END, limit: 100 }).find((item) => item.id === media.id && item.route === 'research');
    search ? pass('media', media.id, 'Media record is reachable through Research/Search.') : fail('media', media.id, 'REACHABLE-BUT-HIDDEN', 'Media record is not surfaced by Research/Search.');
  }

  const closure = runtime.getFoundationClosureReport();
  for (const id of closure.orphanedEntityIds || []) fail('closure', id, 'ORPHANED', 'Foundation closure reports an orphaned published record.');
  for (const id of closure.missingSourceEntityIds || []) fail('closure', id, 'MISSING-SOURCE', 'Foundation closure reports a missing source.');
  for (const id of closure.brokenSourceEntityIds || []) fail('closure', id, 'BROKEN-SOURCE', 'Foundation closure reports a broken source.');
  for (const chapter of closure.chaptersWithoutStructuredLinks || []) warn('closure', `chapter:${chapter}`, 'STRUCTURALLY-SPARSE', 'Chapter has no structured graph links.');
  for (const chapter of closure.chaptersMissingReaderBridge || []) {
    chapter > 416
      ? warn('closure', `chapter:${chapter}`, 'EXPECTED-NO-LOCAL-MEDIA', 'Published research exists but local reader media is not imported yet.')
      : fail('closure', `chapter:${chapter}`, 'MISSING-READER-BRIDGE', 'Expected local reader bridge is missing.');
  }

  const summary = {
    generatedAt: new Date().toISOString(), scope: { start: START, successionStart: SUCCESSION_START, end: END },
    status: failures.length ? 'visibility-gaps-found' : warnings.length ? 'visible-with-warnings' : 'fully-visible',
    totals: {
      passes: passes.length, warnings: warnings.length, failures: failures.length,
      maintainedChapters: maintained.length,
      maintainedBeats: maintained.reduce((sum, record) => sum + (record.events?.length || 0) + (record.prelude?.length || 0), 0),
    },
    domains: Object.fromEntries([...domains.entries()].sort(([a], [b]) => a.localeCompare(b))),
  };
  await mkdir(output, { recursive: true });
  await writeFile(path.join(output, 'report.json'), `${JSON.stringify({ summary, failures, warnings, passes }, null, 2)}\n`);
  console.log(`Succession 339–417 fast visibility audit: ${passes.length} visible, ${warnings.length} warnings, ${failures.length} failures.`);
  console.log(`Inventory: ${maintained.length} maintained Succession chapters / ${summary.totals.maintainedBeats} maintained beats + Chapter 339 handoff.`);
  if (failures.length) {
    console.error('\nVisibility failures:');
    for (const item of failures) console.error(`- [${item.status}] ${item.domain} · ${item.id}: ${item.message}`);
    process.exitCode = 1;
  }
  if (warnings.length) {
    console.warn('\nVisibility warnings:');
    for (const item of warnings.slice(0, 80)) console.warn(`- [${item.status}] ${item.domain} · ${item.id}: ${item.message}`);
    if (warnings.length > 80) console.warn(`- … ${warnings.length - 80} more warnings in the JSON ledger.`);
  }
} finally {
  await vite.close();
}
