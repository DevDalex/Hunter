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
const expectedNumbers = Array.from({ length: LATEST_CHAPTER }, (_, index) => index + 1);
const expectedSuccessionResearchTotal = Math.max(0, ARCHIVE_BOUNDARY - 340 + 1);
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
    id: 'chapter-boundary', label: 'Chapter boundary', status: chapters.length === LATEST_CHAPTER ? 'pass' : 'fail',
    detail: `${chapters.length} maintained full-series chapter records; current catalogue endpoint Chapter ${LATEST_CHAPTER}.`,
  },
  {
    id: 'chapter-sequence', label: 'Chapter sequence', status: unique(chapterNumbers) && chapterNumbers.every((number, index) => number === expectedNumbers[index]) ? 'pass' : 'fail',
    detail: `Numbers must be unique and continuous from 1 through ${LATEST_CHAPTER}.`,
  },
  {
    id: 'arc-coverage', label: 'Arc ranges', status: unique(arcCoverage) && arcCoverage.length === LATEST_CHAPTER && arcCoverage.every((number, index) => number === expectedNumbers[index]) ? 'pass' : 'fail',
    detail: 'Every maintained full-series chapter must belong to exactly one arc range.',
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
    detail: `${timelineEventCount} selected voyage events contain no chapter beyond the imported Succession boundary.`,
  },
  {
    id: 'succession-chapter-depth', label: 'Succession chapter depth', status: successionChapterResearch.length === expectedSuccessionResearchTotal && successionChapterResearch.every((chapter, index) => chapter.number === 340 + index && chapter.focus && chapter.source) ? 'pass' : 'fail',
    detail: `${successionChapterResearch.length} locally indexed records cover Chapters 340–${ARCHIVE_BOUNDARY} continuously; newly imported releases remain explicitly pending until detailed research is verified.`,
  },
  {
    id: 'succession-chronology-links', label: 'Succession chronology links', status: successionChapterResearch.every((chapter) => chapter.coverage.summary && chapter.coverage.source) ? 'pass' : 'fail',
    detail: 'Every current-arc chapter exposes a local summary, source, and explicit chronology-coverage state.',
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
    id: 'phase6c-world-atlas-schema', label: 'World-atlas schema', status: worldLocations.length >= 50 && worldAtlasZones.length === 7 && unique(worldLocations.map((record) => record.id)) && worldLocations.every((record) => record.name && record.kind && record.zone && record.summary) ? 'pass' : 'fail',
    detail: `${worldLocations.length} structured places are organized into ${worldAtlasZones.length} readable route regions.`,
  },
  {
    id: 'phase6c-world-hierarchy', label: 'World-atlas hierarchy', status: worldHierarchyIsValid && worldLocations.every((record) => worldAtlasZones.some((zone) => zone.id === record.zone)) ? 'pass' : 'fail',
    detail: 'Every parent reference resolves without cycles, and every place belongs to a maintained route region.',
  },
  {
    id: 'phase6c-world-journey', label: 'World journey linkage', status: worldJourney.length === 8 && worldJourneyStops.every((id) => worldLocationsById.has(id)) && worldJourney.every((leg) => leg.stops.length > 0) ? 'pass' : 'fail',
    detail: `${worldJourney.length} story-route legs link ${worldJourneyStops.length} location stops from Chapter 1 through Chapter ${LATEST_CHAPTER}.`,
  },
  {
    id: 'phase6c-world-sources', label: 'World source policy', status: worldLocations.every((record) => validUrl(record.source)) && validUrl(worldAtlasSource) && validUrl(locationCategorySource) ? 'pass' : 'fail',
    detail: 'Every structured place and both master indexes resolve to HTTPS Hunterpedia/Fandom sources.',
  },
  {
    id: 'phase6c-interactive-map', label: 'Interactive map contract', status: worldMapLocations.length >= 25
      && unique(worldMapLocations.map((record) => record.id))
      && worldMapLocations.every((record) => Number.isFinite(record.x) && record.x >= 0 && record.x <= 100 && Number.isFinite(record.y) && record.y >= 0 && record.y <= 100 && placementStates[record.confidence] && validUrl(record.source))
      && worldMapRoutes.length >= 3 && worldMapRouteStops.every((id) => worldMapLocationsById.has(id))
      && worldMapUnplacedLocations.length >= 5 && worldMapUnplacedLocations.every((record) => record.note && validUrl(record.source))
      && Object.values(worldMapAssets).every((asset) => asset.src.startsWith('/') && validUrl(asset.source) && (!asset.imageSource || validUrl(asset.imageSource))) ? 'pass' : 'fail',
    detail: `${worldMapLocations.length} sourced markers, ${worldMapUnplacedLocations.length} deliberately unpinned records, and ${worldMapRoutes.length} curated routes retain bounded coordinates, explicit placement confidence, and resolvable stops.`,
  },
  {
    id: 'phase6d-institution-charts', label: 'Institution chart structure', status: institutionCharts.length === 8 && unique(institutionCharts.map((record) => record.id)) && institutionCharts.every((record) => record.root?.name && record.levels.length >= 3 && record.levels.every((level) => level.label && level.nodes.length)) ? 'pass' : 'fail',
    detail: `${institutionCharts.length} connected organization charts separate authority levels without flattening every faction into one graph.`,
  },
  {
    id: 'phase6d-typed-relations', label: 'Typed institutional relationships', status: institutionalRelationships.length >= 30 && unique(institutionalRelationships.map((record) => record.id)) && institutionalRelationships.every((record) => relationTypes.some(([type]) => type === record.type) && record.from && record.to && record.era && record.chapters) ? 'pass' : 'fail',
    detail: `${institutionalRelationships.length} directional relationships carry a type, story period, time scope, state, and source.`,
  },
  {
    id: 'phase6d-object-trails', label: 'Object and evidence trails', status: objectTrails.length >= 14 && unique(objectTrails.map((record) => record.id)) && objectTrails.every((record) => record.stages.length >= 4 && record.stages.every(([name, note]) => name && note)) ? 'pass' : 'fail',
    detail: `${objectTrails.length} consequential objects have maintained creator, custody, use, effect, or evidence stages.`,
  },
  {
    id: 'phase6d-source-policy', label: 'Systems-desk source policy', status: [...institutionCharts, ...institutionalRelationships, ...objectTrails].every((record) => validUrl(record.source)) && Object.values(systemsDeskSources).every(validUrl) ? 'pass' : 'fail',
    detail: 'Every organization, relationship, and object-trail record resolves to an HTTPS Hunterpedia/Fandom source.',
  },
  {
    id: 'phase6e-shell-stats', label: 'Lightweight shell statistics', status: SITE_STATS.records === encyclopediaStats.records && SITE_STATS.characters === encyclopediaStats.characters && SITE_STATS.successionRoster === successionRoster.length && SITE_STATS.officialArcs === arcs.length && homeHighlights.every((highlight) => characters.some((character) => character.name === highlight.name && character.source === highlight.source && character.image === highlight.image)) ? 'pass' : 'fail',
    detail: 'Home totals and its four lightweight portrait records are checked against the full research datasets without loading those datasets into the startup bundle.',
  },
  {
    id: 'phase6f-implementation-contract', label: 'Implementation handoff', status: implementationSections.length >= 9 && unique(implementationSections.map((record) => record.id)) && maintenanceMatrix.length >= 13 && unique(maintenanceMatrix.map((record) => record.id)) && releaseChecklist.reduce((total, group) => total + group.items.length, 0) >= 15 && completionCriteria.length >= 8 && archiveDesignSystemStats.primitives >= 6 ? 'pass' : 'fail',
    detail: `${implementationSections.length} system notes, ${maintenanceMatrix.length} maintenance runbooks, ${releaseChecklist.reduce((total, group) => total + group.items.length, 0)} release checks, ${completionCriteria.length} completion criteria, and ${archiveDesignSystemStats.primitives} Batch 12 primitives form the current handoff.`,
  },
  {
    id: 'cloudflare-release-contract', label: 'Cloudflare release contract', status: releaseGates.length === 10 && routeManifest.length === 26 && routeManifestStats.screens === releaseStats.routes && releaseStats.chapterBoundary === ARCHIVE_BOUNDARY ? 'pass' : 'fail',
    detail: `${releaseGates.length} active release gates cover ${routeManifest.length} focused reader-facing screens and the Worker-first Cloudflare deployment contract.`,
  },
];

export const integritySummary = {
  status: integrityChecks.some((check) => check.status === 'fail') ? 'fail' : 'pass',
  passed: integrityChecks.filter((check) => check.status === 'pass').length,
  total: integrityChecks.length,
  reviewed: ARCHIVE_REVIEW_DATE,
  chapterCatalogue: chapters.length,
  locallyStructuredChapters,
  detailedChapters,
  phaseContextChapters,
  catalogueOnlyChapters: chapters.length - locallyStructuredChapters,
  sourceUrls: sourceUrls.length,
  imageUrls: imageUrls.length,
  localEntityMedia: mediaRegistryStats.local,
  verifiedRemoteEntityMedia: mediaRegistryStats.verifiedRemote,
  runtimeResolvedEntityMedia: mediaRegistryStats.runtimeResolution,
  intentionallyTextOnlyMedia: mediaRegistryStats.textOnly,
  picturedCharacters: mediaRegistryStats.characters.pictured,
  totalCharacters: mediaRegistryStats.characters.total,
  picturedLocations: mediaRegistryStats.locations.pictured,
  totalLocations: mediaRegistryStats.locations.total,
  structuredWorldPlaces: worldLocations.length,
  institutionCharts: institutionCharts.length,
  institutionalRelationships: institutionalRelationships.length,
  objectTrails: objectTrails.length,
};

export const assertContentIntegrity = () => {
  const failures = integrityChecks.filter((check) => check.status === 'fail');
  if (failures.length) throw new Error(`Content integrity failed: ${failures.map((check) => check.label).join(', ')}`);
  return integritySummary;
};
