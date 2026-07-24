import { arcs } from './arcs';
import { chapters, LATEST_CHAPTER } from './chapters';
import { characters } from './characters';
import { successionRoster } from './successionRoster';
import { successionDays, timelineEventCount } from './successionTimeline';
import { blackWhaleRooms } from './blackWhale';
import { referenceEntityRecords, sourceRegistry } from './referenceEntities';
import { ARCHIVE_BOUNDARY, ARCHIVE_REVIEW_DATE, SITE_STATS } from './archiveMeta';
import { canonicalEntityName, entityRegistry, entityRegistryStats } from './entityRegistry';
import { guardianBeasts, princeDossiers } from './successionDossier';
import { successionChapterResearch } from './succession/successionResearch';
import { roomAssignmentLedger } from './successionArchive';
import { phaseCoverageNumbers, seriesArcDossiers } from './seriesArcDossiers';
import { generalCharacterSnapshot } from './generalCharacterSnapshot';
import { encyclopediaCategories, encyclopediaRecords, encyclopediaStats } from './encyclopedia';
import { preSuccessionChapterResearch, seriesChronology, seriesResearchStats } from './seriesResearch';
import { mediaCoverageByCategory, mediaRegistry, mediaRegistryStats } from './mediaRegistry';
import { locationCategorySource, worldAtlasSource, worldAtlasZones, worldJourney, worldLocations, worldLocationsById } from './worldAtlas';
import { placementStates, worldMapAssets, worldMapLocations, worldMapLocationsById, worldMapRoutes, worldMapUnplacedLocations } from './worldMap';
import { institutionCharts, institutionalRelationships, objectTrails, relationTypes, systemsDeskSources } from './systemsDesk';
import { homeHighlights } from './homeHighlights';
import { archiveDesignSystemStats } from './archiveDesignSystem';
import { completionCriteria, implementationSections, maintenanceMatrix, releaseChecklist } from './implementationNotes';
import { routeManifest, routeManifestStats } from './routeManifest';
import { releaseGates, releaseStats } from './releaseReadiness';

const allowedHosts = new Set(['hunterxhunter.fandom.com', 'static.wikia.nocookie.net']);
const validUrl = (value) => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' && allowedHosts.has(parsed.hostname);
  } catch { return false; }
};
const validImageReference = (value) => String(value || '').startsWith('/media/') || validUrl(value);
const unique = (values) => new Set(values).size === values.length;
const chapterNumbers = chapters.map((chapter) => chapter.number);
const expectedNumbers = Array.from({ length: ARCHIVE_BOUNDARY }, (_, index) => index + 1);
const arcCoverage = arcs.flatMap((arc) => Array.from({ length: arc.chapters[1] - arc.chapters[0] + 1 }, (_, index) => arc.chapters[0] + index));
const sourceUrls = [
  ...chapters.map((record) => record.sourceUrl), ...arcs.map((record) => record.source),
  ...characters.map((record) => record.source), ...successionRoster.map((record) => record.source),
  ...blackWhaleRooms.map((record) => record.source), ...referenceEntityRecords.map((record) => record.source),
  ...sourceRegistry.map((record) => record.source),
  ...encyclopediaRecords.map((record) => record.source),
  ...worldLocations.map((record) => record.source), worldAtlasSource, locationCategorySource,
  ...worldMapLocations.map((record) => record.source), ...worldMapUnplacedLocations.map((record) => record.source), ...Object.values(worldMapAssets).map((record) => record.source),
  ...institutionCharts.map((record) => record.source), ...institutionalRelationships.map((record) => record.source), ...objectTrails.map((record) => record.source), ...Object.values(systemsDeskSources),
  ...seriesArcDossiers.flatMap((record) => [record.source, ...record.phases.map((item) => item.source), ...record.characterJourneys.map((item) => item.source), ...record.conflicts.map((item) => item.source)]),
].filter(Boolean);
const imageUrls = [...characters.map((record) => record.image), ...successionRoster.map((record) => record.image), ...blackWhaleRooms.map((record) => record.image), ...encyclopediaRecords.map((record) => record.image)].filter(Boolean);
const phaseContextChapters = chapters.filter((chapter) => chapter.researchStatus === 'Arc-phase study record').length;
const detailedChapters = chapters.filter((chapter) => chapter.researchStatus !== 'Catalogue record' && chapter.researchStatus !== 'Arc-phase study record').length;
const locallyStructuredChapters = chapters.filter((chapter) => chapter.researchStatus !== 'Catalogue record').length;
const expectedEncyclopediaCharacters = new Set([...generalCharacterSnapshot, ...entityRegistry].map((record) => canonicalEntityName(record.name)));
const encyclopediaCharacterRecords = encyclopediaRecords.filter((record) => record.category === 'characters');
const localPriorityCharacters = characters.filter((record) => record.media?.storage === 'local');
const worldHierarchyIsValid = worldLocations.every((record) => {
  const seen = new Set([record.id]);
  let parent = record.parent;
  while (parent) {
    if (seen.has(parent) || !worldLocationsById.has(parent)) return false;
    seen.add(parent);
    parent = worldLocationsById.get(parent)?.parent || '';
  }
  return true;
});
const worldJourneyStops = worldJourney.flatMap((leg) => leg.stops);
const worldMapRouteStops = worldMapRoutes.flatMap((route) => route.stops);

export const integrityChecks = [
  {
    id: 'chapter-boundary', label: 'Chapter boundary', status: LATEST_CHAPTER === ARCHIVE_BOUNDARY && chapters.length === ARCHIVE_BOUNDARY ? 'pass' : 'fail',
    detail: `${chapters.length} numbered records; configured endpoint Chapter ${LATEST_CHAPTER}.`,
  },
  {
    id: 'chapter-sequence', label: 'Chapter sequence', status: unique(chapterNumbers) && chapterNumbers.every((number, index) => number === expectedNumbers[index]) ? 'pass' : 'fail',
    detail: `Numbers must be unique and continuous from 1 through ${ARCHIVE_BOUNDARY}.`,
  },
  {
    id: 'arc-coverage', label: 'Arc ranges', status: unique(arcCoverage) && arcCoverage.length === ARCHIVE_BOUNDARY && arcCoverage.every((number, index) => number === expectedNumbers[index]) ? 'pass' : 'fail',
    detail: 'Every numbered chapter must belong to exactly one maintained arc range.',
  },
  {
    id: 'source-links', label: 'Source-link structure', status: sourceUrls.every(validUrl) ? 'pass' : 'fail',
    detail: `${sourceUrls.length} stored links checked for HTTPS and the Hunterpedia/Fandom host policy.`,
  },
  {
    id: 'image-links', label: 'Image-link structure', status: imageUrls.every(validImageReference) ? 'pass' : 'fail',
    detail: `${imageUrls.length} local or explicitly sourced Hunterpedia image references checked; load failures collapse safely in the interface.`,
  },
  {
    id: 'identity-registry', label: 'Central identity registry', status: entityRegistry.length > 0 && unique(entityRegistry.map((record) => record.id)) ? 'pass' : 'fail',
    detail: `${entityRegistryStats.records} canonical records resolve shared portraits, sources, and written states.`,
  },
  {
    id: 'timeline-boundary', label: 'Timeline boundary', status: successionDays.every((day) => day.events.every((event) => event.chapter <= ARCHIVE_BOUNDARY)) ? 'pass' : 'fail',
    detail: `${timelineEventCount} selected voyage events contain no chapter beyond the maintained boundary.`,
  },
  {
    id: 'succession-chapter-depth', label: 'Succession chapter depth', status: successionChapterResearch.length === 75 && successionChapterResearch.every((chapter, index) => chapter.number === 340 + index && chapter.focus && chapter.source) ? 'pass' : 'fail',
    detail: `${successionChapterResearch.length} locally indexed records cover Chapters 340–414 continuously; unsupported Chapter 414 scene claims remain explicitly pending.`,
  },
  {
    id: 'succession-chronology-links', label: 'Succession chronology links', status: successionChapterResearch.every((chapter) => chapter.coverage.summary && chapter.coverage.source) ? 'pass' : 'fail',
    detail: 'Every current-arc chapter exposes a local research state, source, and explicit chronology-coverage state.',
  },
  {
    id: 'royal-system', label: 'Royal-system completeness', status: princeDossiers.length === 14 && roomAssignmentLedger.length === 14 ? 'pass' : 'fail',
    detail: `${princeDossiers.length} prince dossiers and ${roomAssignmentLedger.length} household room records.`,
  },
  {
    id: 'guardian-beasts', label: 'Guardian Beast host index', status: guardianBeasts.length === 15 && unique(guardianBeasts.map((record) => record.host)) ? 'pass' : 'fail',
    detail: `${guardianBeasts.length} host records include the king and all fourteen prince lines.`,
  },
  {
    id: 'pre-succession-arc-dossiers', label: 'Completed-arc dossiers', status: seriesArcDossiers.length === 6 && unique(seriesArcDossiers.map((record) => record.id)) ? 'pass' : 'fail',
    detail: `${seriesArcDossiers.length} completed pre-Succession arcs have local phase, character, conflict, chronology, and source records.`,
  },
  {
    id: 'pre-succession-phase-coverage', label: 'Pre-Succession phase coverage', status: phaseCoverageNumbers.length === 339 && unique(phaseCoverageNumbers) && phaseCoverageNumbers.every((number, index) => number === index + 1) ? 'pass' : 'fail',
    detail: `${phaseCoverageNumbers.length} chapter positions are assigned once to a continuous study phase from Chapter 1 through 339.`,
  },
  {
    id: 'encyclopedia-schema', label: 'Unified encyclopedia schema', status: encyclopediaCategories.length === 8 && unique(encyclopediaRecords.map((record) => record.id)) && encyclopediaCategories.every((category) => category.count > 0) ? 'pass' : 'fail',
    detail: `${encyclopediaStats.records} stable records span ${encyclopediaCategories.length} populated entity categories.`,
  },
  {
    id: 'encyclopedia-character-coverage', label: 'Encyclopedia character coverage', status: encyclopediaCharacterRecords.length === expectedEncyclopediaCharacters.size && encyclopediaCharacterRecords.every((record) => record.source && record.researchLevel) ? 'pass' : 'fail',
    detail: `${encyclopediaCharacterRecords.length} unique names reconcile the general source snapshot with the maintained identity registry.`,
  },
  {
    id: 'encyclopedia-status-sync', label: 'Encyclopedia status sync', status: entityRegistry.filter((record) => record.status === 'deceased').every((record) => encyclopediaCharacterRecords.find((item) => item.name === record.name)?.statusCode === 'deceased') ? 'pass' : 'fail',
    detail: 'Every centrally confirmed death resolves to the same written status and red-overlay rule in the encyclopedia.',
  },
  {
    id: 'phase5-pre-succession-records', label: 'Pre-Succession chapter context', status: preSuccessionChapterResearch.length === 339 && preSuccessionChapterResearch.every((record, index) => record.number === index + 1 && record.phaseTitle && record.phaseSource && record.source) ? 'pass' : 'fail',
    detail: `${preSuccessionChapterResearch.length} continuous chapter positions carry an arc-phase record, direct chapter source, and separate phase source.`,
  },
  {
    id: 'phase5-chapter-linkage', label: 'Chapter research linkage', status: chapters.slice(0, 339).every((chapter) => chapter.research?.number === chapter.number && chapter.research?.title === chapter.title) ? 'pass' : 'fail',
    detail: 'Every completed-arc chapter resolves to exactly one maintained research record without replacing chapter-specific evidence.',
  },
  {
    id: 'phase5-chronology', label: 'Full-series chronology structure', status: seriesChronology.length === 39 && unique(seriesChronology.map((record) => record.id)) && seriesChronology.every((record) => record.range[0] <= record.range[1] && record.source) ? 'pass' : 'fail',
    detail: `${seriesChronology.length} sourced story blocks connect 36 completed-arc phases to three current-arc periods.`,
  },
  {
    id: 'phase5-depth-language', label: 'Research-depth truthfulness', status: locallyStructuredChapters === seriesResearchStats.indexedChapters && detailedChapters === seriesResearchStats.locallyChapterSpecific && phaseContextChapters === 301 ? 'pass' : 'fail',
    detail: `${detailedChapters} chapter-specific local accounts and ${phaseContextChapters} explicitly labeled arc-phase context records.`,
  },
  {
    id: 'hunter-exam-chapter-depth', label: 'Hunter Exam chapter depth', status: chapters.slice(0, 38).every((chapter, index) => chapter.number === index + 1 && chapter.researchStatus === 'Hunterpedia chapter-specific record' && chapter.summary && chapter.characters.length && chapter.locations.length && chapter.releaseDate && chapter.adaptations.length) ? 'pass' : 'fail',
    detail: 'Chapters 1–38 continuously carry chapter-specific summaries, ordered appearances, locations, publication dates, and adaptation mappings.',
  },
  {
    id: 'phase6-media-registry', label: 'Media registry', status: mediaRegistry.length === encyclopediaRecords.length && mediaRegistryStats.uniqueIds ? 'pass' : 'fail',
    detail: `${mediaRegistry.length} encyclopedia records have one honest media state: locally stored, verified remote, or intentionally text-only.`,
  },
  {
    id: 'phase6-media-hosts', label: 'Media host policy', status: mediaRegistryStats.allowedHosts ? 'pass' : 'fail',
    detail: `${mediaRegistryStats.local} local files retain Hunterpedia image sources; ${mediaRegistryStats.verifiedRemote} explicit remote images use only approved Hunterpedia/Fandom hosts.`,
  },
  {
    id: 'phase6-media-coverage', label: 'Media coverage accounting', status: mediaCoverageByCategory.length === encyclopediaCategories.length && mediaCoverageByCategory.every((record) => record.local + record.verifiedRemote + record.textOnly === record.total) ? 'pass' : 'fail',
    detail: `${mediaRegistryStats.characters.local}/${mediaRegistryStats.characters.total} character portraits and ${mediaRegistryStats.locations.local}/${mediaRegistryStats.locations.total} location images are locally stored; ${mediaRegistryStats.locations.verifiedRemote} location records still depend on remote images.`,
  },
  {
    id: 'phase7b-character-media-stability', label: 'Priority portrait stability', status: mediaRegistryStats.characters.local === localPriorityCharacters.length && mediaRegistryStats.runtimeResolution === mediaRegistryStats.characters.textOnly && mediaRegistryStats.localMetadataComplete && mediaRegistryStats.uniqueLocalPaths ? 'pass' : 'fail',
    detail: `${localPriorityCharacters.length} priority portraits are locally stored with intrinsic dimensions, focal points, article sources, and image sources; ${mediaRegistryStats.runtimeResolution} remaining identities use explicit text-only fallback rather than runtime filename guessing.`,
  },
  {
    id: 'phase6b-character-story-groups', label: 'Character story grouping', status: encyclopediaCharacterRecords.every((record) => record.facts.some((fact) => fact.label === 'Indexed under' && fact.value)) ? 'pass' : 'fail',
    detail: `All ${encyclopediaCharacterRecords.length} character records can enter the unified portrait, research-index, and story-group views.`,
  },
  {
    id: 'phase6c-world-atlas-schema', label: 'World-atlas schema', status: worldLocations.length >= 50 && worldAtlasZones.length === 7 && unique(worldLocations.map((record) => record.id)) && worldHierarchyIsValid ? 'pass' : 'fail',
    detail: `${worldLocations.length} canonical locations form a cycle-free hierarchy across ${worldAtlasZones.length} atlas zones.`,
  },
  {
    id: 'phase6c-world-atlas-routes', label: 'World journey routes', status: worldJourney.length >= 5 && worldJourneyStops.every((stop) => worldLocationsById.has(stop)) ? 'pass' : 'fail',
    detail: `${worldJourney.length} ordered routes connect only known world-atlas locations.`,
  },
  {
    id: 'phase6c-world-map-assets', label: 'World map assets', status: Object.values(worldMapAssets).every((record) => validImageReference(record.path) && validUrl(record.source)) ? 'pass' : 'fail',
    detail: `${Object.keys(worldMapAssets).length} map and room-diagram assets retain local paths or approved remote sources.`,
  },
  {
    id: 'phase6c-world-map-placement', label: 'World map placement', status: worldMapLocations.length >= 35 && worldMapLocations.every((record) => worldLocationsById.has(record.id) && placementStates.includes(record.placementState)) && worldMapUnplacedLocations.every((record) => worldLocationsById.has(record.id) && record.placementState === 'unplaced') ? 'pass' : 'fail',
    detail: `${worldMapLocations.length} mapped and ${worldMapUnplacedLocations.length} intentionally unplaced locations carry explicit placement states.`,
  },
  {
    id: 'phase6c-world-map-routes', label: 'World map route geometry', status: worldMapRoutes.length >= 5 && worldMapRouteStops.every((stop) => worldMapLocationsById.has(stop)) ? 'pass' : 'fail',
    detail: `${worldMapRoutes.length} map routes reference only placed map nodes.`,
  },
  {
    id: 'phase6d-systems-desk', label: 'Systems desk', status: institutionCharts.length >= 5 && institutionalRelationships.length >= 20 && objectTrails.length >= 8 && relationTypes.length >= 5 ? 'pass' : 'fail',
    detail: `${institutionCharts.length} institutions, ${institutionalRelationships.length} typed links, and ${objectTrails.length} object trails form the maintained systems desk.`,
  },
  {
    id: 'phase7-home-highlights', label: 'Home highlight structure', status: homeHighlights.length >= 6 && unique(homeHighlights.map((record) => record.id)) ? 'pass' : 'fail',
    detail: `${homeHighlights.length} home modules point into maintained archive areas.`,
  },
  {
    id: 'phase7-design-system', label: 'Design-system registry', status: archiveDesignSystemStats.tokens >= 30 && archiveDesignSystemStats.components >= 10 ? 'pass' : 'fail',
    detail: `${archiveDesignSystemStats.tokens} tokens and ${archiveDesignSystemStats.components} reusable component patterns are documented.`,
  },
  {
    id: 'phase7-implementation-notes', label: 'Implementation notes', status: implementationSections.length >= 8 && maintenanceMatrix.length >= 5 && completionCriteria.length >= 8 && releaseChecklist.length >= 8 ? 'pass' : 'fail',
    detail: `${implementationSections.length} implementation sections, ${maintenanceMatrix.length} maintenance rows, ${completionCriteria.length} completion criteria, and ${releaseChecklist.length} release checks are maintained.`,
  },
  {
    id: 'phase7-route-manifest', label: 'Route manifest', status: routeManifest.length >= 15 && routeManifestStats.uniquePaths && routeManifestStats.uniqueIds ? 'pass' : 'fail',
    detail: `${routeManifest.length} stable routes are registered without duplicate IDs or paths.`,
  },
  {
    id: 'phase7-release-gates', label: 'Release gates', status: releaseGates.length >= 8 && releaseStats.required === releaseGates.length ? 'pass' : 'fail',
    detail: `${releaseGates.length} required release gates track the archive’s final readiness.`,
  },
];

export const assertContentIntegrity = () => {
  const failures = integrityChecks.filter((check) => check.status !== 'pass');
  if (failures.length) throw new Error(`Content integrity failure: ${failures.map((check) => `${check.id} — ${check.detail}`).join(' | ')}`);
  return {
    total: integrityChecks.length,
    passed: integrityChecks.length,
    chapterCatalogue: chapters.length,
    locallyStructuredChapters,
    detailedChapters,
    phaseContextChapters,
    localEntityMedia: entityRegistryStats.localMedia,
    verifiedRemoteEntityMedia: entityRegistryStats.verifiedRemoteMedia,
    reviewDate: ARCHIVE_REVIEW_DATE,
    siteStats: SITE_STATS,
  };
};
