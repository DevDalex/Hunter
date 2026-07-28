import { preloadArchiveSearchIndex } from '../data/archiveSearch';

/** @typedef {() => Promise<unknown>} RouteModuleLoader */

/** @type {Record<string, RouteModuleLoader>} */
export const routeModuleLoaders = {
  archiveSearch: () => import('../components/ArchiveSearch'),
  series: () => import('../components/SeriesWorkspace'),
  timeline: () => import('../components/TimelineWorkspace'),
  successionArchive: () => import('../components/succession/SuccessionArchiveEntry'),
  familyTree: () => import('../components/FamilyTree'),
  successionRoster: () => import('../components/SuccessionRoster'),
  successionTimeline: () => import('../components/SuccessionTimeline'),
  successionChapterReader: () => import('../components/SuccessionChapterReader'),
  successionConnections: () => import('../components/SuccessionConnectionBoard'),
  blackWhale: () => import('../components/BlackWhaleGuide'),
  successionDossier: () => import('../components/SuccessionDossier'),
  encyclopedia: () => import('../components/EntityEncyclopedia'),
  nen: () => import('../components/NenEncyclopedia'),
  hisokaChrollo: () => import('../components/HisokaChrolloDossier'),
  worldAtlas: () => import('../components/WorldAtlas'),
  organizationWorkspace: () => import('../components/OrganizationWorkspace'),
  conflictArchive: () => import('../components/ConflictArchive'),
};

/**
 * @param {string} view
 * @param {string} [target]
 * @returns {RouteModuleLoader | null}
 */
const loaderForRoute = (view, target = '') => {
  if (view === 'series') return routeModuleLoaders.series;
  if (view === 'timeline') return routeModuleLoaders.timeline;
  if (view === 'succession') return routeModuleLoaders.successionArchive;
  if (view === 'reference') {
    if (!target || target === 'encyclopedia') return routeModuleLoaders.encyclopedia;
    if (target === 'nen') return routeModuleLoaders.nen;
    if (target === 'conflicts') return routeModuleLoaders.conflictArchive;
    if (target === 'hisoka-chrollo') return routeModuleLoaders.hisokaChrollo;
    if (target === 'atlas') return routeModuleLoaders.worldAtlas;
    if (target === 'systems') return routeModuleLoaders.organizationWorkspace;
  }
  return null;
};

/** @type {WeakMap<RouteModuleLoader, Promise<unknown | null>>} */
const inFlight = new WeakMap();

/**
 * @param {RouteModuleLoader | null | undefined} loader
 * @returns {Promise<unknown | null>}
 */
const preload = (loader) => {
  if (!loader) return Promise.resolve(null);
  if (!inFlight.has(loader)) {
    inFlight.set(loader, loader().catch(() => {
      inFlight.delete(loader);
      return null;
    }));
  }
  return inFlight.get(loader) ?? Promise.resolve(null);
};

/** @param {string} view @param {string} [target] */
export const preloadRoute = (view, target = '') => preload(loaderForRoute(view, target));
export const preloadArchiveSearch = () => Promise.all([
  preload(routeModuleLoaders.archiveSearch),
  preloadArchiveSearchIndex(),
]);
