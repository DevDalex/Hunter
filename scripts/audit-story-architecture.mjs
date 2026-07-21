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
assert(volumeZeroPeople.length === 3 && volumeZeroPeople.map((item) => item.name).join('|') === 'Kurapika|Pairo|Sheila', 'Volume 0 must keep its three-person emotional center');
assert(volumeZeroGallery.length >= 8, 'Volume 0 needs a curated scene archive');
assert(volumeZeroSources.length >= 8 && volumeZeroSources.every((item) => isApprovedSourceUrl(item.href)), 'Volume 0 needs direct Hunterpedia sources');

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
const server = await readFile(path.resolve('server/index.js'), 'utf8');
assert(app.includes('onPrefetch={preloadRoute}'), 'Story workspace must receive route prefetch support');
assert(seriesWorkspace.includes('storyArcIds.has(routeTarget)') && seriesWorkspace.includes('<ArcPage'), 'SeriesWorkspace must route each standard arc to the dedicated renderer');
assert(seriesWorkspace.includes("routeTarget === 'volume-0'") && seriesWorkspace.includes('<VolumeZeroPage'), 'Volume 0 must bypass the generic arc renderer');
assert(seriesWorkspace.includes('<StoryHub') && !seriesWorkspace.includes('StoryFoundationLayout'), 'the Story hub must replace the old shared foundation shell');
for (const section of ['context', 'premise', 'chronology', 'characters', 'factions', 'locations', 'nen', 'conflicts', 'objects', 'themes', 'changes', 'ending', 'transition', 'adaptation', 'records', 'sources']) {
  assert(arcPage.includes(`id="${section}"`), `ArcPage is missing the ${section} section`);
}
for (const section of ['overview', 'part-one', 'part-two', 'people', 'settlement', 'examination', 'promise', 'aftermath', 'sources']) {
  assert(volumeZeroPage.includes(`id="${section}"`), `VolumeZeroPage is missing the ${section} destination`);
}
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
  'src/components/ArcPage.jsx',
  'src/components/ArcPage.css',
  'src/components/StoryArcArtwork.css',
  'src/components/StoryHub.jsx',
  'src/components/StoryHub.css',
  'src/components/StoryUtilities.css',
  'src/components/VolumeZeroPage.jsx',
  'src/components/VolumeZeroPage.css',
]) await access(path.resolve(file));

console.log(`Story architecture audit passed: nine dedicated arc routes, a purpose-built Volume 0 memory-book experience, nine arc-specific artwork records, sixteen standard arc sections plus hero, three separate utilities, preserved Succession subpages, clean routing, direct reload fallback, and retired Notebook route.`);
