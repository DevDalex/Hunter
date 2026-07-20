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
import { parseCleanRoute, routeToCleanPath } from '../src/lib/appRouter.js';
import { seriesRoutes } from '../src/data/routeManifest.js';

const assert = (condition, message) => {
  if (!condition) throw new Error(`Story architecture audit failed: ${message}`);
};
const unique = (values) => new Set(values).size === values.length;

assert(/^\d{4}-\d{2}-\d{2}$/.test(STORY_ARCHITECTURE_VERSION), 'architecture version must be an ISO date');
assert(storyDesignDirection.identity === 'The Black Archive', 'visual identity must remain The Black Archive');
assert(storyDesignDirection.shell === 'hybrid-dark-shell-warm-paper', 'the approved hybrid shell changed');
assert(storyDesignDirection.mobileStatus === 'deferred', 'mobile work must remain deferred');
assert(storyDesignDirection.palette.primary.toUpperCase() === '#A12A38', 'crimson must remain the global active accent');
assert(storyRoutePolicy.hubRoute === '/story' && storyRoutePolicy.routeMode === 'clean-history-paths', 'clean Story routing must remain live');

assert(storyEntries.length === 9 && unique(storyEntries.map((item) => item.id)) && unique(storyEntries.map((item) => item.route)), 'the nine-entry Story taxonomy must remain unique');
assert(storyEntries.every((item) => item.route.startsWith('/story/') && isApprovedSourceUrl(item.source)), 'Story entries need clean routes and approved Hunterpedia sources');
assert(storyEntries.some((item) => item.id === 'zoldyck-family' && item.type === 'editorial-story-page'), 'Zoldyck Family must remain an editorial Story page');
assert(seriesRoutes.some((item) => item.target === 'zoldyck-family'), 'the canonical route manifest must include the Zoldyck Family screen');
assert(storyContentPolicy.factualSpine === 'manga' && storyContentPolicy.animeModel === 'inline-2011-adaptation-layer', 'Story content policy changed');
assert(successionStorySubpages.length === 7 && unique(successionStorySubpages.map((item) => item.route)), 'Succession subpages must remain complete and unique');
assert(storyUtilityDestinations.length === 3, 'the three Story utility destinations must remain available');
assert(storyArchitectureAcceptance.length === 10, 'the architecture lock must retain ten acceptance statements');

assert(routeToCleanPath('series') === '/story', 'Story hub route changed');
assert(routeToCleanPath('series', 'zoldyck-family') === '/story/zoldyck-family', 'Zoldyck Family clean route must remain live');
assert(parseCleanRoute('/story/zoldyck-family', '').target === 'zoldyck-family', 'Zoldyck Family clean route must parse');
assert(parseCleanRoute('/notebook', '').view === 'not-found', 'retired Notebook route must stay unavailable');

const app = await readFile(path.resolve('src/App.jsx'), 'utf8');
const seriesWorkspace = await readFile(path.resolve('src/components/SeriesWorkspace.jsx'), 'utf8');
const server = await readFile(path.resolve('server/index.js'), 'utf8');
assert(app.includes('onPrefetch={preloadRoute}'), 'Story workspace must receive route prefetch support');
assert(seriesWorkspace.includes("{ id: 'zoldyck-family', label: 'Zoldyck Family' }"), 'Series navigation must include Zoldyck Family');
assert(server.includes("fallbackUrl.pathname = '/index.html'"), 'static worker must keep direct-reload fallback');

for (const file of [
  'docs/STORY-ARCHITECTURE.md',
  'docs/STORY-FOUNDATION.md',
  'docs/YORKNEW-PROTOTYPE.md',
  'docs/EARLY-ARCS-PROTOTYPES.md',
  'docs/GREED-ISLAND-PROTOTYPE.md',
  'docs/CHIMERA-ANT-PROTOTYPE.md',
  'src/components/StoryFoundation.css',
  'src/components/YorknewPrototypePage.css',
  'src/components/EarlyArcPrototypePage.css',
  'src/components/GreedIslandPrototypePage.css',
  'src/components/ChimeraAntPrototypePage.css',
]) await access(path.resolve(file));

console.log(`Story architecture audit passed: ${storyEntries.length} Story entries, ${successionStorySubpages.length} Succession subpages, clean routing, Zoldyck route inventory, direct reload fallback, retired Notebook route, and mobile deferred.`);
