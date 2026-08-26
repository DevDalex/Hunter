import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'vite';

const root = process.cwd();
const output = path.resolve(root, process.env.SUCCESSION_VISIBILITY_AUDIT_OUTPUT || '.succession-339-417-visibility-audit');
const reportPath = path.join(output, 'report.json');
const START = 339;
const SUCCESSION_START = 340;
const END = 417;

const normalize = (value) => String(value || '')
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[’‘]/g, "'")
  .replace(/[“”]/g, '"')
  .replace(/[^a-zA-Z0-9]+/g, ' ')
  .trim()
  .toLocaleLowerCase('en-US');

const failures = [];
const warnings = [];
const passes = [];
const domains = new Map();
const addDomain = (domain, status) => {
  const row = domains.get(domain) || { checked: 0, visible: 0, warnings: 0, failures: 0 };
  row.checked += 1;
  if (status === 'visible') row.visible += 1;
  if (status === 'warning') row.warnings += 1;
  if (status === 'failure') row.failures += 1;
  domains.set(domain, row);
};
const pass = (domain, id, message, extra = {}) => {
  passes.push({ domain, id, status: 'VISIBLE', message, ...extra });
  addDomain(domain, 'visible');
};
const warn = (domain, id, classification, message, extra = {}) => {
  warnings.push({ domain, id, status: classification, message, ...extra });
  addDomain(domain, 'warning');
};
const fail = (domain, id, classification, message, extra = {}) => {
  failures.push({ domain, id, status: classification, message, ...extra });
  addDomain(domain, 'failure');
};

const expectedRouteByType = Object.freeze({
  character: 'characters',
  organization: 'organizations',
  ability: 'nen',
  'guardian-beast': 'guardian-spirit-beasts',
  location: 'locations',
  'location-history': 'locations',
  event: 'events',
  assignment: 'bodyguards',
  chapter: 'chapters',
  relationship: 'relationships',
  source: 'research',
  'knowledge-record': 'research',
  protocol: 'research',
  object: 'research',
  document: 'research',
  'evidence-item': 'research',
});
const directEntityTypes = new Set([
  'character', 'organization', 'ability', 'guardian-beast', 'location', 'event',
  'assignment', 'chapter', 'relationship', 'source', 'knowledge-record', 'protocol',
  'object', 'document', 'evidence-item',
]);

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const [
    runtime,
    research,
    seriesResearch,
    seriesChapters,
    archiveMeta,
    routes,
    productInventory,
    router,
  ] = await Promise.all([
    vite.ssrLoadModule('/src/data/succession/successionData.js'),
    vite.ssrLoadModule('/src/data/succession/successionResearch.js'),
    vite.ssrLoadModule('/src/data/seriesResearch.js'),
    vite.ssrLoadModule('/src/data/chapters.js'),
    vite.ssrLoadModule('/src/data/archiveMeta.js'),
    vite.ssrLoadModule('/src/data/succession/archiveRoutes.js'),
    vite.ssrLoadModule('/src/data/succession/productInventory.js'),
    vite.ssrLoadModule('/src/lib/appRouter.js'),
  ]);

  const [archiveEntry, dossierEntry] = await Promise.all([
    readFile(path.join(root, 'src/data/successionArchive.js'), 'utf8'),
    readFile(path.join(root, 'src/data/successionDossier.js'), 'utf8'),
  ]);

  if (archiveEntry.includes("successionArchiveThrough417.js")) pass('entrypoints', 'archive', 'Active Archive entrypoint targets Through417.');
  else fail('entrypoints', 'archive', 'WRONG-BOUNDARY', 'Active Archive entrypoint is not Through417.');
  if (dossierEntry.includes("successionDossierThrough417.js")) pass('entrypoints', 'dossier', 'Active Dossier entrypoint targets Through417.');
  else fail('entrypoints', 'dossier', 'WRONG-BOUNDARY', 'Active Dossier entrypoint is not Through417.');

  for (const [id, value] of [
    ['ARCHIVE_BOUNDARY', archiveMeta.ARCHIVE_BOUNDARY],
    ['ARCHIVE_DETAILED_BOUNDARY', archiveMeta.ARCHIVE_DETAILED_BOUNDARY],
    ['LATEST_SUCCESSION_RESEARCH_CHAPTER', research.LATEST_SUCCESSION_RESEARCH_CHAPTER],
  ]) {
    if (Number(value) === END) pass('boundaries', id, `${id} resolves to Chapter ${END}.`);
    else fail('boundaries', id, 'WRONG-BOUNDARY', `${id} resolves to ${value}, expected ${END}.`);
  }

  const chapter339Research = seriesResearch.getPreSuccessionResearch(START);
  const chapter339Catalogue = seriesChapters.chapters.find((record) => record.number === START);
  if (chapter339Research && chapter339Catalogue) {
    pass('chapter-339', 'chapter:339:data', 'Chapter 339 exists in the series research and chapter catalogue.');
  } else {
    fail('chapter-339', 'chapter:339:data', 'ORPHANED', 'Chapter 339 is missing from series research or the chapter catalogue.');
  }
  const route339 = router.normalizeDestination('series', 'chapters', { chapter: START });
  if (route339.view === 'not-found') {
    fail('chapter-339', 'chapter:339:route', 'DEAD-ROUTE', 'Chapter 339 search/research data targets the retired series view, which normalizes to not-found.', { normalizedRoute: route339 });
  } else {
    pass('chapter-339', 'chapter:339:route', `Chapter 339 resolves through ${route339.view}/${route339.target}.`, { normalizedRoute: route339 });
  }

  const maintained = research.successionChapterResearch.filter((record) => record.number >= SUCCESSION_START && record.number <= END);
  const maintainedNumbers = maintained.map((record) => record.number);
  const expectedNumbers = Array.from({ length: END - SUCCESSION_START + 1 }, (_, index) => SUCCESSION_START + index);
  if (JSON.stringify(maintainedNumbers) === JSON.stringify(expectedNumbers)) {
    pass('chapters', 'maintained:340-417', `Maintained research is contiguous across all ${expectedNumbers.length} Succession chapters.`);
  } else {
    fail('chapters', 'maintained:340-417', 'ORPHANED', 'Maintained Succession research is not contiguous from 340 through 417.', { maintainedNumbers });
  }

  const canonicalChapters = runtime.getEntitiesByType('chapter')
    .filter((record) => record.number >= SUCCESSION_START && record.number <= END)
    .sort((left, right) => left.number - right.number);
  if (JSON.stringify(canonicalChapters.map((record) => record.number)) === JSON.stringify(expectedNumbers)) {
    pass('chapters', 'canonical:340-417', `Canonical graph contains all ${expectedNumbers.length} Chapter 340–417 entities.`);
  } else {
    fail('chapters', 'canonical:340-417', 'ORPHANED', 'Canonical chapter graph is missing one or more maintained chapters.', { canonicalNumbers: canonicalChapters.map((record) => record.number) });
  }

  const activeRouteIds = new Set(routes.successionArchiveRoutes.filter((record) => record.status === 'active').map((record) => record.id));
  const inventoryRouteIds = new Set([
    ...productInventory.successionProductInventory.authoritativeWorkspaces,
    ...productInventory.successionProductInventory.preservedVisualTools,
  ].map((record) => record.routeId));

  const exactSearch = (entity, chapter = END) => {
    const query = entity.name || entity.label || entity.title || entity.id;
    if (!query) return null;
    return runtime.searchArchiveProduct(query, { chapter, limit: 1000 }).find((result) => result.id === entity.id) || null;
  };

  for (const number of expectedNumbers) {
    const chapter = runtime.getChapter(number);
    const dossier = runtime.getChapterStoryDossier(number);
    const evidence = runtime.getChapterEvidenceProfile(number);
    if (!chapter) {
      fail('chapters', `chapter:${number}`, 'ORPHANED', `Chapter ${number} has maintained research but no canonical chapter entity.`);
      continue;
    }
    if (!dossier) fail('chapters', chapter.id, 'NO-UI-SURFACE', `Chapter ${number} cannot produce a Chapter Story dossier.`);
    else if (!evidence) fail('chapters', chapter.id, 'NO-UI-SURFACE', `Chapter ${number} cannot produce an Evidence profile.`);
    else {
      const searchResult = runtime.searchArchiveProduct(`Chapter ${number}`, { chapter: END, limit: 1000 }).find((result) => result.id === chapter.id);
      if (!searchResult) fail('chapters', chapter.id, 'REACHABLE-BUT-HIDDEN', `Chapter ${number} exists in dossiers but global Search cannot surface it.`);
      else if (searchResult.route !== 'chapters') fail('chapters', chapter.id, 'WRONG-LINK', `Chapter ${number} search result routes to ${searchResult.route} instead of chapters.`, { searchResult });
      else pass('chapters', chapter.id, `Chapter ${number} resolves through canonical chapter dossier, evidence, and Search.`);
    }
  }

  // Reconcile every maintained timeline/prelude beat against the canonical event graph.
  for (const record of maintained) {
    const canonicalEvents = runtime.getEventsForChapter(record.number);
    const canonicalNames = new Map(canonicalEvents.map((event) => [normalize(event.name), event]));
    const canonicalIds = new Set(canonicalEvents.flatMap((event) => [event.id, event.slug, event.id?.replace(/^event:/, '')]).filter(Boolean));
    const beats = [
      ...(record.events || []).map((beat) => ({ ...beat, beatKind: 'event' })),
      ...(record.prelude || []).map((beat) => ({ ...beat, beatKind: 'prelude' })),
    ];
    for (const beat of beats) {
      const idCandidates = [beat.id, `event:${beat.id}`].filter(Boolean);
      const title = beat.title || beat.name || '';
      const matched = idCandidates.some((id) => canonicalIds.has(id)) || canonicalNames.has(normalize(title));
      if (matched) pass('maintained-beats', `chapter:${record.number}:${beat.id || normalize(title)}`, `Maintained ${beat.beatKind} beat is represented by a canonical Chapter ${record.number} event.`, { chapter: record.number, title });
      else warn('maintained-beats', `chapter:${record.number}:${beat.id || normalize(title)}`, 'POTENTIALLY-HIDDEN', `Maintained ${beat.beatKind} beat has no exact canonical event ID/title match.`, {
        chapter: record.number,
        title,
        canonicalEventCount: canonicalEvents.length,
        canonicalEventNames: canonicalEvents.map((event) => event.name),
      });
    }
  }

  // Direct canonical entities must resolve to an active owning workspace and, where Search supports them, to an exact result.
  for (const [entityType, expectedRoute] of Object.entries(expectedRouteByType)) {
    const entities = runtime.getEntitiesByType(entityType);
    for (const entity of entities) {
      if (entity.publicationStatus === 'hidden') {
        warn(`entities:${entityType}`, entity.id, 'INTENTIONALLY-HIDDEN', 'Entity is explicitly publicationStatus=hidden.', { expectedRoute });
        continue;
      }
      if (entity.publicationStatus === 'draft') {
        warn(`entities:${entityType}`, entity.id, 'DRAFT-NOT-PUBLISHED', 'Entity is explicitly publicationStatus=draft.', { expectedRoute });
        continue;
      }
      if (!runtime.getEntityById(entity.id)) {
        fail(`entities:${entityType}`, entity.id, 'ORPHANED', 'Entity is present in a collection but cannot be resolved by canonical ID.');
        continue;
      }
      if (!activeRouteIds.has(expectedRoute) || !inventoryRouteIds.has(expectedRoute)) {
        fail(`entities:${entityType}`, entity.id, 'DEAD-ROUTE', `Owning route ${expectedRoute} is not both active and present in the product inventory.`);
        continue;
      }
      if (entityType === 'location-history') {
        const history = runtime.getLocationHistoryForCharacter(entity.characterId);
        if (!history.some((record) => record.id === entity.id)) fail(`entities:${entityType}`, entity.id, 'NO-UI-SURFACE', 'Location-history record is not reachable from the character location-history selector.');
        else pass(`entities:${entityType}`, entity.id, `Location-history record is reachable through ${expectedRoute} and character history selectors.`);
        continue;
      }
      if (directEntityTypes.has(entityType)) {
        const result = exactSearch(entity);
        if (!result) fail(`entities:${entityType}`, entity.id, 'REACHABLE-BUT-HIDDEN', `Published ${entityType} resolves canonically but exact global Search cannot surface it.`, { name: entity.name, expectedRoute });
        else if (result.route !== expectedRoute) fail(`entities:${entityType}`, entity.id, 'WRONG-LINK', `Global Search routes this ${entityType} to ${result.route}, expected ${expectedRoute}.`, { name: entity.name, result });
        else pass(`entities:${entityType}`, entity.id, `Published ${entityType} resolves through ${expectedRoute} and exact global Search.`);
      }
    }
  }

  for (const [characterId, records] of Object.entries(runtime.successionArchiveData.characterStateProfiles || {})) {
    const timeline = runtime.getCharacterStateTimeline(characterId);
    for (const record of records) {
      if (!timeline.some((item) => item.id === record.id)) fail('character-states', record.id, 'NO-UI-SURFACE', `Character state ${record.id} is absent from the character dossier timeline.`, { characterId });
      else pass('character-states', record.id, 'Character state is reachable through the character dossier timeline.', { characterId });
    }
  }

  for (const [organizationId, records] of Object.entries(runtime.successionArchiveData.organizationStateProfiles || {})) {
    const timeline = runtime.getOrganizationStateTimeline(organizationId);
    for (const record of records) {
      if (!timeline.some((item) => item.id === record.id)) fail('organization-states', record.id, 'NO-UI-SURFACE', `Organization state ${record.id} is absent from the organization dossier timeline.`, { organizationId });
      else pass('organization-states', record.id, 'Organization state is reachable through the organization dossier timeline.', { organizationId });
    }
  }

  for (const [abilityId, records] of Object.entries(runtime.successionArchiveData.abilityKnowledgeOverrides || {})) {
    for (const record of records) {
      const probeChapter = Number(record.chapterRange?.start || END);
      const knowledge = runtime.getAbilityKnowledgeAtChapter(abilityId, probeChapter);
      if (!knowledge?.known) fail('ability-knowledge', record.id, 'NO-UI-SURFACE', `Ability knowledge override is not reachable at Chapter ${probeChapter}.`, { abilityId });
      else pass('ability-knowledge', record.id, `Ability knowledge override is reachable through Nen dossier at Chapter ${probeChapter}.`, { abilityId });
    }
  }

  for (const [beastId, records] of Object.entries(runtime.successionArchiveData.guardianBeastStateProfiles || {})) {
    const timeline = runtime.getGuardianBeastStateTimeline(beastId);
    for (const record of records) {
      if (!timeline.some((item) => item.id === record.id)) fail('guardian-beast-states', record.id, 'NO-UI-SURFACE', 'Guardian Beast state is absent from its dossier timeline.', { beastId });
      else pass('guardian-beast-states', record.id, 'Guardian Beast state is reachable through its dossier timeline.', { beastId });
    }
  }

  for (const profile of Object.values(runtime.successionArchiveData.storyPhaseProfiles || {})) {
    const chapter = Math.min(END, profile.chapterRange?.end ?? END);
    const dossier = runtime.getStoryPhaseDossier(profile.id, chapter);
    if (!dossier) fail('story-phases', profile.id, 'NO-UI-SURFACE', 'Story phase profile has no reachable dossier.');
    else {
      const result = runtime.searchArchiveProduct(profile.name, { chapter: END, limit: 1000 }).find((item) => item.id === profile.id);
      if (!result) fail('story-phases', profile.id, 'REACHABLE-BUT-HIDDEN', 'Story phase has a dossier but global Search cannot surface it.');
      else pass('story-phases', profile.id, 'Story phase is reachable through Story Intelligence and Search.');
    }
  }

  for (const profile of Object.values(runtime.successionArchiveData.storyLaneProfiles || {})) {
    const dossier = runtime.getStoryLaneDossier(profile.id, END);
    if (!dossier) fail('story-lanes', profile.id, 'NO-UI-SURFACE', 'Story lane profile has no reachable dossier at Chapter 417.');
    else {
      const result = runtime.searchArchiveProduct(profile.name, { chapter: END, limit: 1000 }).find((item) => item.id === profile.id);
      if (!result) fail('story-lanes', profile.id, 'REACHABLE-BUT-HIDDEN', 'Story lane has a dossier but global Search cannot surface it.');
      else pass('story-lanes', profile.id, 'Story lane is reachable through Story Intelligence and Search.');
    }
  }

  for (const profile of Object.values(runtime.successionArchiveData.storyThreadProfiles || {})) {
    const dossier = runtime.getStoryThreadDossier(profile.id, END);
    if (!dossier) fail('story-threads', profile.id, 'NO-UI-SURFACE', 'Story thread profile has no reachable dossier at Chapter 417.');
    else {
      const result = runtime.searchArchiveProduct(profile.name, { chapter: END, limit: 1000 }).find((item) => item.id === profile.id);
      if (!result) fail('story-threads', profile.id, 'REACHABLE-BUT-HIDDEN', 'Story thread has a dossier but global Search cannot surface it.');
      else pass('story-threads', profile.id, 'Story thread is reachable through Story Intelligence and Search.');
    }
  }

  const visibleCausalIds = new Set(runtime.getStoryCausalLinksAtChapter(END).map((record) => record.id));
  for (const record of Object.values(runtime.successionArchiveData.storyCausalLinksById || {})) {
    if (visibleCausalIds.has(record.id)) pass('story-causal-links', record.id, 'Causal link is reachable through the Chapter 417 Story Intelligence graph.');
    else warn('story-causal-links', record.id, 'BOUNDARY-HIDDEN', 'Causal link is not visible at Chapter 417; verify whether its event endpoints legitimately fall outside the publication boundary.');
  }

  for (const profile of runtime.getNenSystemsAtChapter(END)) {
    const dossier = runtime.getNenSystemDossier(profile.id, END);
    const result = runtime.searchArchiveProduct(profile.name, { chapter: END, limit: 1000 }).find((item) => item.id === profile.id);
    if (!dossier) fail('nen-systems', profile.id, 'NO-UI-SURFACE', 'Nen system is active but has no dossier.');
    else if (!result || result.route !== 'nen') fail('nen-systems', profile.id, 'REACHABLE-BUT-HIDDEN', 'Nen system has a dossier but Search does not route it to Nen.', { result });
    else pass('nen-systems', profile.id, 'Nen system is reachable through Nen dossier and Search.');
  }

  for (const entry of runtime.getGlossaryEntriesAtChapter(END)) {
    const result = runtime.searchArchiveProduct(entry.name || entry.term || entry.label || entry.id, { chapter: END, limit: 1000 }).find((item) => item.id === entry.id);
    if (!result || result.route !== 'glossary') fail('glossary', entry.id, 'REACHABLE-BUT-HIDDEN', 'Glossary entry cannot be surfaced by exact Search.', { result });
    else pass('glossary', entry.id, 'Glossary entry is reachable through Glossary and Search.');
  }

  for (const media of runtime.getMediaRecordsAtChapter(END)) {
    const result = runtime.searchArchiveProduct(media.label, { chapter: END, limit: 1000 }).find((item) => item.id === media.id);
    if (!result || result.route !== 'research') fail('media', media.id, 'REACHABLE-BUT-HIDDEN', 'Media record cannot be surfaced through Research/Search.', { result });
    else pass('media', media.id, 'Media record is reachable through Research and Search.');
  }

  const closure = runtime.getFoundationClosureReport();
  for (const id of closure.orphanedEntityIds || []) fail('closure', id, 'ORPHANED', 'Foundation closure reports this published record as orphaned.');
  for (const id of closure.missingSourceEntityIds || []) fail('closure', id, 'MISSING-SOURCE', 'Foundation closure reports a missing source link.');
  for (const id of closure.brokenSourceEntityIds || []) fail('closure', id, 'BROKEN-SOURCE', 'Foundation closure reports a broken source link.');
  for (const chapter of closure.chaptersWithoutStructuredLinks || []) warn('closure', `chapter:${chapter}`, 'STRUCTURALLY-SPARSE', 'Foundation closure reports no structured graph links for this chapter.');
  for (const chapter of closure.chaptersMissingReaderBridge || []) {
    const classification = chapter > 416 ? 'EXPECTED-NO-LOCAL-MEDIA' : 'MISSING-READER-BRIDGE';
    if (classification === 'EXPECTED-NO-LOCAL-MEDIA') warn('closure', `chapter:${chapter}`, classification, 'Published research exists without local page media; this is expected for Chapter 417 until media is imported.');
    else fail('closure', `chapter:${chapter}`, classification, 'Chapter should have an imported reader bridge but foundation closure reports it missing.');
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    scope: { start: START, successionStart: SUCCESSION_START, end: END },
    status: failures.length ? 'visibility-gaps-found' : warnings.length ? 'visible-with-warnings' : 'fully-visible',
    totals: {
      passes: passes.length,
      warnings: warnings.length,
      failures: failures.length,
      maintainedChapters: maintained.length,
      canonicalChapters: canonicalChapters.length,
      maintainedBeats: maintained.reduce((sum, record) => sum + (record.events?.length || 0) + (record.prelude?.length || 0), 0),
    },
    domains: Object.fromEntries([...domains.entries()].sort(([left], [right]) => left.localeCompare(right))),
  };

  await mkdir(output, { recursive: true });
  await writeFile(reportPath, `${JSON.stringify({ summary, failures, warnings, passes }, null, 2)}\n`);

  console.log(`Succession 339–417 visibility audit: ${summary.totals.passes} visible, ${summary.totals.warnings} warnings, ${summary.totals.failures} failures.`);
  console.log(`Maintained source inventory: ${summary.totals.maintainedChapters} Succession chapters and ${summary.totals.maintainedBeats} maintained beats, plus Chapter 339 series handoff.`);
  if (failures.length) {
    console.error('\nVisibility failures:');
    for (const item of failures) console.error(`- [${item.status}] ${item.domain} · ${item.id}: ${item.message}`);
    process.exitCode = 1;
  }
  if (warnings.length) {
    console.warn('\nVisibility warnings:');
    for (const item of warnings.slice(0, 100)) console.warn(`- [${item.status}] ${item.domain} · ${item.id}: ${item.message}`);
    if (warnings.length > 100) console.warn(`- … ${warnings.length - 100} additional warnings are in ${path.relative(root, reportPath)}`);
  }
} finally {
  await vite.close();
}
