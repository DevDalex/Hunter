import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { isApprovedSourceUrl } from '../src/data/sourcePolicy.js';
import { yorknewPrototype, yorknewPrototypeStats } from '../src/data/yorknewPrototype.js';
import { earlyArcPrototypes, earlyArcPrototypeIds, earlyArcPrototypeStats } from '../src/data/earlyArcPrototypes.js';
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
import {
  parseCleanRoute,
  parseLegacyHashRoute,
  routeToCleanPath,
  routeToLegacyHash,
} from '../src/lib/appRouter.js';

const assert = (condition, message) => {
  if (!condition) throw new Error(`Story architecture audit failed: ${message}`);
};
const unique = (values) => new Set(values).size === values.length;
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);

assert(/^\d{4}-\d{2}-\d{2}$/.test(STORY_ARCHITECTURE_VERSION), 'architecture version must be an ISO date');
assert(storyDesignDirection.identity === 'The Black Archive', 'visual identity must remain The Black Archive');
assert(storyDesignDirection.shell === 'hybrid-dark-shell-warm-paper', 'the approved hybrid shell changed');
assert(storyDesignDirection.mobileStatus === 'deferred', 'mobile work must remain deferred until explicitly reopened');
assert(storyDesignDirection.prototypeArcId === 'yorknew-city', 'Yorknew City must remain the first implementation prototype');
assert(storyDesignDirection.palette.primary.toUpperCase() === '#A12A38', 'crimson must remain the global active accent');
assert(!Object.keys(storyDesignDirection.palette).some((key) => /green|forest/i.test(key)), 'green must not return as a global palette token');

assert(storyRoutePolicy.hubRoute === '/story', 'Story hub route must be /story');
assert(storyRoutePolicy.routeMode === 'clean-history-paths', 'target routing model must use clean history paths');
assert(storyRoutePolicy.currentMode === 'clean-history-router-live', 'Batch 2 must mark clean history routing as live');
assert(storyRoutePolicy.directReloadRequired && storyRoutePolicy.historyFallbackRequired, 'clean routes must support reload and hosting fallback');
assert(storyRoutePolicy.preserveLegacyHashes && storyRoutePolicy.preserveQueryParameters && storyRoutePolicy.preserveSpoilerBoundary, 'routing preservation flags must remain enabled');

assert(storyEntries.length === 9, 'the locked Story taxonomy must contain nine entries including Volume 0 and the editorial Zoldyck page');
assert(unique(storyEntries.map((item) => item.id)), 'Story entry IDs must be unique');
assert(unique(storyEntries.map((item) => item.route)), 'Story routes must be unique');
assert(same(storyEntries.map((item) => item.order), [...storyEntries.keys()]), 'Story order must remain continuous from 0 through 8');
assert(storyEntries.every((item) => item.route.startsWith('/story/') && !item.route.includes('#')), 'every entry must use a clean /story path');
assert(storyEntries.every((item) => item.title && item.shortTitle && item.accent?.name && /^#[0-9A-F]{6}$/i.test(item.accent?.value || '')), 'every entry needs complete title and accent metadata');
assert(storyEntries.every((item) => isApprovedSourceUrl(item.source)), 'every Story entry must retain an approved Hunterpedia source');

for (const item of storyEntries) {
  if (item.previousId) {
    const previous = storyEntries.find((candidate) => candidate.id === item.previousId);
    assert(previous, `${item.id} points to a missing previous entry`);
    assert(previous.nextId === item.id, `${item.id} and ${previous.id} do not have reciprocal navigation`);
  }
  if (item.nextId) {
    const next = storyEntries.find((candidate) => candidate.id === item.nextId);
    assert(next, `${item.id} points to a missing next entry`);
    assert(next.previousId === item.id, `${item.id} and ${next.id} do not have reciprocal navigation`);
  }
}

const expectedOfficialArcIds = [
  'hunter-exam',
  'heavens-arena',
  'yorknew-city',
  'greed-island',
  'chimera-ant',
  'chairman-election',
  'succession-contest',
];
const representedOfficialArcIds = storyEntries.filter((item) => item.officialArcId).map((item) => item.officialArcId);
assert(same(representedOfficialArcIds, expectedOfficialArcIds), 'all seven official arcs must appear once and in series order');

const volumeZero = storyEntries.find((item) => item.id === 'volume-0');
assert(volumeZero.type === 'prologue' && volumeZero.order === 0 && volumeZero.officialArcId === null, 'Volume 0 must remain an unnumbered prologue');

const hunterExam = storyEntries.find((item) => item.id === 'hunter-exam');
const zoldyck = storyEntries.find((item) => item.id === 'zoldyck-family');
assert(same(hunterExam.manga.officialRange, [1, 43]) && same(hunterExam.anime2011.officialRange, [1, 26]), 'official Hunter Exam boundaries must remain visible');
assert(zoldyck.type === 'editorial-story-page' && zoldyck.officialArcId === null && zoldyck.parentOfficialArcId === 'hunter-exam', 'Zoldyck Family must be explicitly editorial rather than presented as an official arc');
assert(same(zoldyck.manga.pageRange, [39, 43]) && same(zoldyck.anime2011.pageRange, [22, 25]) && same(zoldyck.anime2011.supplementalEpisodes, [26]), 'the editorial Zoldyck page boundary changed');

const standardSinglePages = ['volume-0', 'hunter-exam', 'zoldyck-family', 'heavens-arena', 'yorknew-city', 'greed-island', 'chairman-election'];
assert(standardSinglePages.every((id) => storyEntries.find((item) => item.id === id)?.pageDepth === 'single-page'), 'standard Story entries must remain comprehensive single pages');
assert(storyEntries.find((item) => item.id === 'chimera-ant')?.pageDepth === 'expandable', 'Chimera Ant must remain expandable rather than prematurely split');
assert(storyEntries.find((item) => item.id === 'succession-contest')?.pageDepth === 'multi-page', 'Succession Contest must retain multi-page depth');

assert(storyContentPolicy.factualSpine === 'manga', 'manga must remain the factual spine');
assert(storyContentPolicy.animeModel === 'inline-2011-adaptation-layer', 'the 2011 adaptation must remain an inline layer');
for (const section of ['overview', 'context', 'chronology', 'characters', 'conflicts', 'nen', 'aftermath', 'adaptation', 'sources']) {
  assert(storyContentPolicy.standardSections.includes(section), `standard arc sections are missing ${section}`);
}
assert(storyContentPolicy.analysisSeparation.length === 5 && unique(storyContentPolicy.analysisSeparation), 'factual, analytical, unresolved, and adaptation layers must stay distinct');

assert(successionStorySubpages.length === 7, 'Succession Contest must retain seven deep subpages');
assert(unique(successionStorySubpages.map((item) => item.id)) && unique(successionStorySubpages.map((item) => item.route)), 'Succession subpage IDs and routes must be unique');
assert(successionStorySubpages.every((item) => item.route.startsWith('/story/succession-contest/') && item.legacyRoute.startsWith('#/succession/')), 'Succession subpages need clean routes and legacy mappings');

const legacyRoutes = [
  ...storyEntries.flatMap((item) => item.legacyRoutes),
  ...successionStorySubpages.map((item) => item.legacyRoute),
  ...storyUtilityDestinations.map((item) => item.legacyRoute),
];
assert(unique(legacyRoutes), 'legacy redirect sources must be unique');
assert(legacyRoutes.every((route) => route.startsWith('#/')), 'legacy redirect sources must remain explicit hash routes');
assert(storyUtilityDestinations.length === 3 && storyUtilityDestinations.every((item) => item.route.startsWith('/story?view=')), 'chronology, chapters, and adaptation must remain Story utilities');

assert(routeToCleanPath('series') === '/story', 'series hub must navigate to /story');
assert(routeToCleanPath('series', 'yorknew-city') === '/story/yorknew-city', 'Yorknew must navigate to its clean Story path');
assert(routeToCleanPath('series', 'zoldyck-family') === '/story/zoldyck-family', 'Zoldyck Family clean route must be live');
assert(routeToCleanPath('series', 'chapters', { arc: 'yorknew-city' }) === '/story?view=chapters&arc=yorknew-city', 'Story utility queries must be preserved');
assert(routeToCleanPath('succession', 'black-whale', { room: 'tier-1' }) === '/story/succession-contest/black-whale?room=tier-1', 'Succession subpages must use nested Story paths');
assert(routeToCleanPath('reference', 'encyclopedia', { category: 'characters' }) === '/characters?category=characters', 'primary reference routes should use clean top-level paths');
assert(routeToLegacyHash('series', 'yorknew-city', { chapter: 100 }) === '#/series/yorknew-city?chapter=100', 'legacy hash serialization must remain available');

const cleanYorknew = parseCleanRoute('/story/yorknew-city', '?chapter=100');
assert(cleanYorknew.view === 'series' && cleanYorknew.target === 'yorknew-city' && cleanYorknew.params.chapter === '100', 'clean Yorknew route must parse with query');
const cleanZoldyck = parseCleanRoute('/story/zoldyck-family', '');
assert(cleanZoldyck.view === 'series' && cleanZoldyck.target === 'zoldyck-family', 'clean Zoldyck route must parse');
const cleanUtility = parseCleanRoute('/story', '?view=adaptation');
assert(cleanUtility.view === 'series' && cleanUtility.target === 'adaptation', 'Story utility route must parse');
const cleanSuccession = parseCleanRoute('/story/succession-contest/power-blocs', '?panel=justice');
assert(cleanSuccession.view === 'succession' && cleanSuccession.target === 'mafia' && cleanSuccession.params.panel === 'justice', 'clean Succession subpage must parse');
const cleanCharacters = parseCleanRoute('/characters', '?search=Gon');
assert(cleanCharacters.view === 'reference' && cleanCharacters.target === 'encyclopedia' && cleanCharacters.params.category === 'characters' && cleanCharacters.params.search === 'Gon', 'clean character directory route must parse');
const unknownRoute = parseCleanRoute('/not-a-real-route', '');
assert(unknownRoute.view === 'not-found' && unknownRoute.params.attemptedPath === '/not-a-real-route', 'unknown routes must not silently open home');

const legacyYorknew = parseLegacyHashRoute('#/series/yorknew-city?chapter=100');
assert(legacyYorknew.view === 'series' && legacyYorknew.target === 'yorknew-city' && legacyYorknew.params.chapter === '100', 'legacy Yorknew hash must still parse');
assert(routeToCleanPath(legacyYorknew.view, legacyYorknew.target, legacyYorknew.params) === '/story/yorknew-city?chapter=100', 'legacy Yorknew hash must upgrade to clean path');

const server = await readFile(path.resolve('server/index.js'), 'utf8');
assert(server.includes("fallbackUrl.pathname = '/index.html'"), 'static worker must keep the direct-reload SPA fallback');

const storyFoundation = await readFile(path.resolve('src/components/StoryFoundation.jsx'), 'utf8');
assert(storyFoundation.includes('StoryFoundationLayout') && storyFoundation.includes('StoryHubFoundation') && storyFoundation.includes('StoryArcFoundation') && storyFoundation.includes('ZoldyckStoryBridge'), 'Story foundation components must remain exported from StoryFoundation.jsx');
assert(storyFoundation.includes('storyEntries.map') && storyFoundation.includes('storyContentPolicy.standardSections'), 'Story foundation must render taxonomy and standard section rails from canonical architecture data');

const seriesWorkspace = await readFile(path.resolve('src/components/SeriesWorkspace.jsx'), 'utf8');
assert(seriesWorkspace.includes('StoryFoundationLayout') && seriesWorkspace.includes('StoryHubFoundation') && seriesWorkspace.includes('StoryArcFoundation'), 'SeriesWorkspace must render through the shared Story foundation');
assert(seriesWorkspace.includes("{ id: 'zoldyck-family', label: 'Zoldyck Family' }"), 'Series workspace navigation must include the Zoldyck editorial destination');
assert(seriesWorkspace.includes('EarlyArcPrototypePage') && seriesWorkspace.includes('earlyArcPrototypePage ?') && seriesWorkspace.includes('hasEarlyArcPrototype'), 'Hunter Exam, Zoldyck Family, and Heavens Arena must route through the early arc prototype page');
assert(!seriesWorkspace.includes('ZoldyckStoryBridge onNavigate'), 'Zoldyck Family must no longer render the temporary bridge after the Early Arcs batch');
assert(seriesWorkspace.includes('YorknewPrototypePage') && seriesWorkspace.includes('yorknewPrototypePage ?'), 'Yorknew must route through its dedicated prototype page');

const yorknewComponent = await readFile(path.resolve('src/components/YorknewPrototypePage.jsx'), 'utf8');
assert(yorknewComponent.includes('YorknewHero') && yorknewComponent.includes('Chronology') && yorknewComponent.includes('Factions') && yorknewComponent.includes('TroupeBoard') && yorknewComponent.includes('ChainInspector') && yorknewComponent.includes('ConflictLedger') && yorknewComponent.includes('FortuneMatrix') && yorknewComponent.includes('ObjectLedger'), 'Yorknew prototype must retain the required page modules');
assert(yorknewComponent.includes("import './YorknewPrototypePage.css'"), 'Yorknew prototype must import its page stylesheet');

const earlyArcComponent = await readFile(path.resolve('src/components/EarlyArcPrototypePage.jsx'), 'utf8');
assert(earlyArcComponent.includes('EarlyArcHero') && earlyArcComponent.includes('Chronology') && earlyArcComponent.includes('Systems') && earlyArcComponent.includes('CharacterBoard') && earlyArcComponent.includes('ConflictLedger') && earlyArcComponent.includes('Mechanics'), 'early arc prototype must retain the required page modules');
assert(earlyArcComponent.includes("import './EarlyArcPrototypePage.css'"), 'early arc prototype must import its page stylesheet');

assert(yorknewPrototype.id === storyDesignDirection.prototypeArcId, 'Yorknew prototype data must match the architecture prototype ID');
assert(yorknewPrototype.sections.length >= 11 && yorknewPrototype.overview.length >= 4, 'Yorknew prototype needs overview and section coverage');
assert(yorknewPrototypeStats.chronology >= 10 && yorknewPrototypeStats.factions >= 6 && yorknewPrototypeStats.chains >= 6 && yorknewPrototypeStats.conflicts >= 7 && yorknewPrototypeStats.sources >= 8, 'Yorknew prototype content groups are incomplete');
assert(yorknewPrototype.sources.every((source) => isApprovedSourceUrl(source.href)), 'Yorknew prototype sources must follow the approved Hunterpedia/Fandom policy');

assert(same([...earlyArcPrototypeIds], ['hunter-exam', 'zoldyck-family', 'heavens-arena']), 'Early Arc prototype IDs must remain Hunter Exam, Zoldyck Family, and Heavens Arena');
assert(earlyArcPrototypes.every((arc) => arc.sections.length >= 9 && arc.overview.length >= 4 && arc.chronology.length >= 8 && arc.systems.length >= 5 && arc.characters.length >= 6 && arc.conflicts.length >= 5 && arc.mechanics.length >= 5), 'Early Arc prototype groups are incomplete');
for (const [id, stats] of Object.entries(earlyArcPrototypeStats)) {
  assert(stats.sources >= 5, `${id} needs enough approved source links`);
}
assert(earlyArcPrototypes.flatMap((arc) => arc.sources).every((source) => isApprovedSourceUrl(source.href)), 'Early Arc prototype sources must follow the approved Hunterpedia/Fandom policy');

const app = await readFile(path.resolve('src/App.jsx'), 'utf8');
assert(app.includes('onPrefetch={preloadRoute}'), 'Story workspace must receive route prefetch support');
assert(!app.includes("routeTarget === 'zoldyck-family' && <>"), 'Zoldyck route must not bypass the Story foundation in App.jsx');

const routeManifest = await readFile(path.resolve('src/data/routeManifest.js'), 'utf8');
assert(routeManifest.includes("label: 'Pre-Succession overview'") && !routeManifest.includes("target: 'zoldyck-family'"), 'legacy release route manifest must stay stable while clean Story routes remain live');

assert(storyArchitectureAcceptance.length === 10, 'the architecture lock must retain ten acceptance statements');
await access(path.resolve('docs/STORY-ARCHITECTURE.md'));
await access(path.resolve('docs/STORY-FOUNDATION.md'));
await access(path.resolve('docs/YORKNEW-PROTOTYPE.md'));
await access(path.resolve('docs/EARLY-ARCS-PROTOTYPES.md'));
await access(path.resolve('src/lib/appRouter.js'));
await access(path.resolve('src/components/StoryFoundation.css'));
await access(path.resolve('src/components/YorknewPrototypePage.css'));
await access(path.resolve('src/components/EarlyArcPrototypePage.css'));

console.log(`Story architecture audit passed: ${storyEntries.length} Story entries, ${successionStorySubpages.length} Succession subpages, ${storyContentPolicy.standardSections.length} standard sections, clean routing, Story foundation shell, Yorknew prototype page, ${earlyArcPrototypes.length} early arc prototype pages, legacy route inventory stable, direct reload fallback, and mobile deferred.`);
