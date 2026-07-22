import { preloadArchiveSearchIndex } from '../data/archiveSearch';

export const routeModuleLoaders = {
  archiveSearch: () => import('../components/ArchiveSearch'),
  series: () => import('../components/SeriesWorkspace'),
  successionOverview: () => import('../components/SuccessionOverview'),
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
  systems: () => import('../components/SystemsDesk'),
  organizations: () => import('../components/OrganizationArchive'),
  conflictArchive: () => import('../components/ConflictArchive'),
};

const successionDossierTargets = new Set([
  'beasts', 'mafia', 'chapters',
]);

const loaderForRoute = (view, target = '') => {
  if (view === 'series') return routeModuleLoaders.series;
  if (view === 'succession') {
    if (!target || target === 'overview') return routeModuleLoaders.successionOverview;
    if (target === 'family-tree') return routeModuleLoaders.familyTree;
    if (target === 'succession-roster') return routeModuleLoaders.successionRoster;
    if (target === 'succession-timeline') return routeModuleLoaders.successionTimeline;
    if (target === 'black-whale') return routeModuleLoaders.blackWhale;
    if (successionDossierTargets.has(target)) return routeModuleLoaders.successionDossier;
    return null;
  }
  if (view === 'reference') {
    if (!target || target === 'encyclopedia') return routeModuleLoaders.encyclopedia;
    if (target === 'nen') return routeModuleLoaders.nen;
    if (target === 'conflicts') return routeModuleLoaders.conflictArchive;
    if (target === 'hisoka-chrollo') return routeModuleLoaders.hisokaChrollo;
    if (target === 'atlas') return routeModuleLoaders.worldAtlas;
    if (target === 'systems') return routeModuleLoaders.organizations;
  }
  return null;
};

const inFlight = new WeakMap();

const preload = (loader) => {
  if (!loader) return Promise.resolve(null);
  if (!inFlight.has(loader)) {
    inFlight.set(loader, loader().catch(() => {
      inFlight.delete(loader);
      return null;
    }));
  }
  return inFlight.get(loader);
};

export const preloadRoute = (view, target = '') => preload(loaderForRoute(view, target));
export const preloadArchiveSearch = () => Promise.all([
  preload(routeModuleLoaders.archiveSearch),
  preloadArchiveSearchIndex(),
]);
