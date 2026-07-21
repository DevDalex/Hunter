import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { isApprovedSourceUrl } from '../src/data/sourcePolicy.js';
import {
  STORY_ARCHITECTURE_VERSION,
  storyArchitectureAcceptance,
  storyContentPolicy,
  storyDesignDirection,
  storyEntries,
  storyRoutePolicy,
  storyUtilityDestinations,
  successionStorySubpages,
} from '../architecture/storyArchitecture.mjs';
import { storyArcPages } from '../src/data/storyArcPages.js';
import { storyArcArtwork } from '../src/data/storyArcArtwork.js';
import {
  volumeZeroChapters,
  volumeZeroGallery,
  volumeZeroPeople,
  volumeZeroSources,
} from '../src/data/volumeZero.js';
import {
  finalOutcomes,
  hunterExamFunnel,
  hunterExamHosts,
  hunterExamPhases,
  hunterExamSources,
  phaseFourApplicants,
} from '../src/data/hunterExam.js';
import {
  earlyApplicantRecords,
  hunterExamAttrition,
  hunterExamChapterMap,
  hunterExamConflicts,
  hunterExamGallery,
  hunterExamHostPortraits,
  hunterExamLocations,
  hunterExamObjectsVisual,
  hunterExamPhaseVisuals,
  hunterExamProgression,
  phaseFourPortraitFiles,
  trickTowerPrisoners,
} from '../src/data/hunterExamVisuals.js';
import { parseCleanRoute, routeToCleanPath } from '../src/lib/appRouter.js';
import { routeManifest, seriesRoutes } from '../src/data/routeManifest.js';

const assert = (condition, message) => {
  if (!condition) throw new Error(`Story architecture audit failed: ${message}`);
};
const unique = (values) => new Set(values).size === values.length;

assert(/^\d{4}-\d{2}-\d{2}$/.test(STORY_ARCHITECTURE_VERSION), 'architecture version must be an ISO date');
assert(storyDesignDirection.identity === 'The Black Archive', 'visual identity must remain The Black Archive');
assert(storyRoutePolicy.hubRoute === '/story' && storyRoutePolicy.routeMode === 'clean-history-paths', 'clean Story routing must remain live');
assert(storyEntries.length === 9 && unique(storyEntries.map((item) => item.id)) && unique(storyEntries.map((item) => item.route)), 'the nine-entry Story taxonomy must remain unique');
assert(storyEntries.every((item) => item.route.startsWith('/story/') && isApprovedSourceUrl(item.source)), 'Story entries need clean routes and approved Hunterpedia sources');
assert(storyArcPages.length === 9 && unique(storyArcPages.map((item) => item.id)), 'all nine Story entries need canonical dedicated arc-page records');
assert(storyArcPages.every((arc) => arc.context && arc.objective && arc.stakes && arc.structure && arc.question), 'every arc needs context and a complete premise contract');
assert(storyArcPages.every((arc) => arc.phases.length >= 3 && arc.characters.length >= 4 && arc.factions.length >= 1 && arc.locations.length >= 2), 'every arc needs timeline, character, faction, and location data');
assert(storyArcPages.every((arc) => arc.nen.length >= 2 && arc.conflicts.length >= 1 && arc.objects.length >= 2 && arc.themes.length >= 3), 'every arc needs Nen, conflict, object, and interpretation records');
assert(storyArcPages.every((arc) => arc.changes.length >= 2 && arc.ending && arc.transition && arc.adaptation.length >= 2), 'every arc needs change, ending, transition, and adaptation sections');
assert(storyArcPages.every((arc) => arc.sources.length >= 2 && arc.sources.every((item) => isApprovedSourceUrl(item.href))), 'every arc needs direct approved Hunterpedia sources');
assert(storyArcPages.every((arc) => arc.visual?.className && arc.visual?.paper && arc.visual?.accent), 'every arc needs its own visual identity');
assert(storyArcArtwork.length === 9 && unique(storyArcArtwork.map((item) => item.id)), 'all nine dedicated arc pages need unique arc-level artwork');
assert(storyArcArtwork.every((item) => item.image && item.fallback && item.alt && item.source && isApprovedSourceUrl(item.source)), 'every arc artwork record needs media, fallback, accessible description, and approved Hunterpedia source');
assert(storyArcArtwork.every((item) => !item.image.includes('/media/portraits/')), 'arc cover artwork must represent the arc rather than use a character portrait as its primary image');
assert(storyArcArtwork.every((item) => storyArcPages.some((arc) => arc.id === item.id)), 'arc artwork IDs must match canonical dedicated arc pages');
assert(storyEntries.some((item) => item.id === 'zoldyck-family' && item.type === 'editorial-story-page'), 'Zoldyck Family must remain an editorial Story page');
assert(seriesRoutes.filter((item) => storyEntries.some((entry) => entry.id === item.target)).length === 9, 'the route manifest must expose all nine dedicated Story pages');
assert(routeManifest.some((item) => item.view === 'series' && item.target === 'succession-contest'), 'Succession Contest must occupy the dedicated arc-page route slot');
assert(!routeManifest.some((item) => item.view === 'succession' && item.target === 'overview'), 'the old Succession overview must not duplicate the dedicated arc page in browser QA');
assert(storyContentPolicy.factualSpine === 'manga' && storyContentPolicy.animeModel === 'inline-2011-adaptation-layer', 'Story content policy changed');
assert(successionStorySubpages.length === 7 && unique(successionStorySubpages.map((item) => item.route)), 'Succession subpages must remain complete and unique');
assert(storyUtilityDestinations.length === 3, 'the three Story utility destinations must remain available');
assert(storyArchitectureAcceptance.length === 10, 'the architecture lock must retain ten acceptance statements');

assert(volumeZeroChapters.length === 2 && volumeZeroChapters.every((chapter) => chapter.scenes.length >= 6), 'Volume 0 needs two complete chapter studies');
assert(volumeZeroChapters.map((chapter) => chapter.id).join('|') === 'part-one|part-two', 'Volume 0 chapter destinations changed');
assert(volumeZeroPeople.length === 3 && volumeZeroPeople.map((item) => item.name).join('|') === 'Kurapika|Pairo|Sheila', 'Volume 0 must keep its three-person emotional center');
assert(volumeZeroGallery.length >= 8, 'Volume 0 needs a curated scene archive');
assert(volumeZeroSources.length >= 8 && volumeZeroSources.every((item) => isApprovedSourceUrl(item.href)), 'Volume 0 needs direct Hunterpedia sources');

assert(hunterExamFunnel.map((item) => item.count).join('|') === '405|404|148|42|40|24|9|7', 'Hunter Exam population funnel changed');
assert(hunterExamPhases.length === 5 && hunterExamPhases.map((item) => item.id).join('|') === 'phase-one|phase-two|phase-three|phase-four|final-phase', 'Hunter Exam needs five formal phases in order');
assert(phaseFourApplicants.length === 24 && unique(phaseFourApplicants.map((item) => item.badge)), 'Zevil Island needs twenty-four unique documented applicant badges');
assert(phaseFourApplicants.filter((item) => item.result === 'Passed').length === 9, 'exactly nine applicants must pass Zevil Island');
assert(phaseFourApplicants.filter((item) => item.result === 'Died').length === 5, 'the documented Zevil Island roster must retain five deaths');
assert(finalOutcomes.find((item) => item.status === 'Licensed')?.count === 7, 'the 287th Exam must retain seven licensed Hunters');
assert(finalOutcomes.find((item) => item.status === 'Disqualified')?.people.join('|') === 'Killua Zoldyck', 'Killua must remain the sole explicit disqualification');
assert(finalOutcomes.find((item) => item.status === 'Killed')?.people.join('|') === 'Bodoro', 'Bodoro must remain recorded as killed, not failed or disqualified');
assert(hunterExamHosts.length === 6, 'Hunter Exam needs preliminary and five formal host records');
assert(hunterExamSources.length >= 6 && hunterExamSources.every((item) => isApprovedSourceUrl(item.href)), 'Hunter Exam needs direct Hunterpedia sources');

assert(hunterExamLocations.length === 13 && unique(hunterExamLocations.map((item) => item.id)), 'Hunter Exam needs thirteen unique illustrated route records');
assert(hunterExamLocations.every((item) => item.image && item.alt && item.source && isApprovedSourceUrl(item.source)), 'every Hunter Exam location needs artwork, accessible text, and a Hunterpedia source');
assert(hunterExamPhaseVisuals.length === 6 && hunterExamPhaseVisuals.every((item) => item.images.length >= 2), 'preliminary screening and all five phases need dedicated visual records');
assert(Object.keys(phaseFourPortraitFiles).length === 24 && phaseFourApplicants.every((item) => phaseFourPortraitFiles[item.badge]), 'all twenty-four Zevil applicants need portrait mappings');
assert(earlyApplicantRecords.length >= 5 && earlyApplicantRecords.every((item) => item.image && isApprovedSourceUrl(item.source)), 'named earlier applicants need visual elimination records');
assert(hunterExamProgression.length >= 15, 'Hunter Exam needs a notable-applicant progression matrix');
assert(hunterExamAttrition.length === 7 && hunterExamAttrition.every((item) => item.entered >= item.passed), 'Hunter Exam needs a seven-stage attrition ledger');
assert(hunterExamHostPortraits.length === 12 && hunterExamHostPortraits.every((item) => item.image && isApprovedSourceUrl(item.source)), 'Hunter Exam needs twelve illustrated authority records');
assert(trickTowerPrisoners.length === 5 && unique(trickTowerPrisoners.map((item) => item.name)), 'Trick Tower needs five prisoner portrait records');
assert(hunterExamObjectsVisual.length === 10 && hunterExamObjectsVisual.every((item) => item.image && isApprovedSourceUrl(item.source)), 'Hunter Exam needs a ten-object visual museum');
assert(hunterExamConflicts.length === 8 && hunterExamConflicts.every((item) => item.image && isApprovedSourceUrl(item.source)), 'Hunter Exam needs eight illustrated conflict records');
assert(hunterExamChapterMap.length === 7, 'Hunter Exam needs seven phase-specific chapter and episode records');
assert(hunterExamGallery.length >= 15 && hunterExamGallery.every((item) => item.image && item.alt && isApprovedSourceUrl(item.source)), 'Hunter Exam needs a sourced curated visual gallery');

assert(routeToCleanPath('series') === '/story', 'Story hub route changed');
for (const entry of storyEntries) {
  assert(routeToCleanPath('series', entry.id) === entry.route, `${entry.shortTitle} clean route must remain live`);
  const parsed = parseCleanRoute(entry.route, '');
  assert(parsed.view === 'series' && parsed.target === entry.id, `${entry.shortTitle} clean route must parse as a dedicated Story page`);
}
assert(parseCleanRoute('/story/succession-contest/timeline', '').view === 'succession', 'deep Succession subpages must remain preserved');
assert(parseCleanRoute('/notebook', '').view === 'not-found', 'retired Notebook route must stay unavailable');

const app = await readFile(path.resolve('src/App.jsx'), 'utf8');
const seriesWorkspace = await readFile(path.resolve('src/components/SeriesWorkspace.jsx'), 'utf8');
const arcPage = await readFile(path.resolve('src/components/ArcPage.jsx'), 'utf8');
const storyHub = await readFile(path.resolve('src/components/StoryHub.jsx'), 'utf8');
const volumeZeroPage = await readFile(path.resolve('src/components/VolumeZeroPage.jsx'), 'utf8');
const hunterExamPage = await readFile(path.resolve('src/components/HunterExamPage.jsx'), 'utf8');
const hunterExamVisualArchive = await readFile(path.resolve('src/components/HunterExamVisualArchive.jsx'), 'utf8');
const server = await readFile(path.resolve('server/index.js'), 'utf8');
assert(app.includes('onPrefetch={preloadRoute}'), 'Story workspace must receive route prefetch support');
assert(seriesWorkspace.includes('storyArcIds.has(routeTarget)') && seriesWorkspace.includes('<ArcPage'), 'SeriesWorkspace must route each standard arc to the dedicated renderer');
assert(seriesWorkspace.includes("routeTarget === 'volume-0'") && seriesWorkspace.includes('<VolumeZeroPage'), 'Volume 0 must bypass the generic arc renderer');
assert(seriesWorkspace.includes("routeTarget === 'hunter-exam'") && seriesWorkspace.includes('<HunterExamPage'), 'Hunter Exam must bypass the generic arc renderer');
assert(seriesWorkspace.includes('<StoryHub') && !seriesWorkspace.includes('StoryFoundationLayout'), 'the Story hub must replace the old shared foundation shell');
for (const section of ['context', 'premise', 'chronology', 'characters', 'factions', 'locations', 'nen', 'conflicts', 'objects', 'themes', 'changes', 'ending', 'transition', 'adaptation', 'records', 'sources']) {
  assert(arcPage.includes(`id="${section}"`), `ArcPage is missing the ${section} section`);
}
for (const section of ['overview', 'people', 'settlement', 'examination', 'promise', 'aftermath', 'sources']) {
  assert(volumeZeroPage.includes(`id="${section}"`), `VolumeZeroPage is missing the ${section} destination`);
}
for (const section of ['overview', 'route', 'phase-three', 'phase-four', 'final-phase', 'applicants', 'examiners', 'outcomes', 'adaptation', 'sources']) {
  assert(hunterExamPage.includes(`id="${section}"`), `HunterExamPage is missing the ${section} destination`);
}
for (const section of ['locations', 'phase-visuals', 'portraits', 'progression', 'examiner-portraits', 'tower-blueprint', 'zevil-network', 'final-bracket', 'objects', 'conflicts', 'records', 'visuals']) {
  assert(hunterExamVisualArchive.includes(`id="${section}"`), `HunterExamVisualArchive is missing the ${section} destination`);
}
assert(hunterExamPage.includes('<HunterExamVisualArchive />'), 'Hunter Exam must render the complete visual archive');
assert(hunterExamPage.includes('phase={hunterExamPhases[0]}') && hunterExamPage.includes('phase={hunterExamPhases[1]}'), 'Hunter Exam must render Phase One and Phase Two from canonical phase IDs');
assert(hunterExamPage.includes('phaseFourApplicants.map') && hunterExamPage.includes('finalMatches.map'), 'Hunter Exam must render the Zevil roster and Final Phase sequence');
assert(hunterExamPage.includes('Failure is not the same as disqualification.'), 'Hunter Exam must preserve explicit outcome terminology');
assert(hunterExamVisualArchive.includes('portraitForBadge') && hunterExamVisualArchive.includes('targetBadgeFrom'), 'Hunter Exam must render portraits and the interactive target network');
assert(volumeZeroPage.includes('id={chapter.id}') && volumeZeroPage.includes('volumeZeroChapters[0]') && volumeZeroPage.includes('volumeZeroChapters[1]'), 'Volume 0 chapter destinations must render from canonical chapter IDs');
assert(volumeZeroPage.includes('The Scarlet Eyes are not presented here as a Nen ability.'), 'Volume 0 must distinguish the Scarlet Eyes from Nen');
assert(volumeZeroPage.includes('<details className="v0-aftermath__details">'), 'graphic source context must remain collapsed by default');
assert(arcPage.includes('storyArcArtworkById') && storyHub.includes('storyArcArtworkById'), 'both dedicated arc heroes and Story directory cards must use the arc-artwork registry');
assert(storyHub.includes('Nine dedicated destinations') && storyHub.includes('Story reference tools'), 'StoryHub must separate arc routes from utility pages');
assert(server.includes("fallbackUrl.pathname = '/index.html'"), 'static worker must keep direct-reload fallback');

for (const file of [
  'docs/STORY-ARCHITECTURE.md',
  'src/data/storyArcPages.js',
  'src/data/storyArcArtwork.js',
  'src/data/volumeZero.js',
  'src/data/hunterExam.js',
  'src/data/hunterExamVisuals.js',
  'src/components/ArcPage.jsx',
  'src/components/ArcPage.css',
  'src/components/StoryArcArtwork.css',
  'src/components/StoryHub.jsx',
  'src/components/StoryHub.css',
  'src/components/StoryUtilities.css',
  'src/components/VolumeZeroPage.jsx',
  'src/components/VolumeZeroPage.css',
  'src/components/HunterExamPage.jsx',
  'src/components/HunterExamPage.css',
  'src/components/HunterExamVisualArchive.jsx',
  'src/components/HunterExamVisualArchive.css',
]) await access(path.resolve(file));

console.log(`Story architecture audit passed: nine dedicated arc routes, purpose-built Volume 0 and Hunter Exam experiences, a locked 405-to-7 examination funnel, twenty-four Zevil participants and portraits, thirteen illustrated locations, phase visuals, progression and attrition ledgers, examiner and prisoner portraits, object and conflict archives, a target network, Final Phase bracket, reading map, curated gallery, three separate utilities, preserved Succession subpages, clean routing, direct reload fallback, and retired Notebook route.`);
