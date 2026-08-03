export const routeModuleLoaders = {
  successionArchive: () => import('../components/succession/SuccessionArchiveEntry'),
  familyTree: () => import('../components/FamilyTree'),
  successionRoster: () => import('../components/SuccessionRoster'),
  successionTimeline: () => import('../components/SuccessionTimeline'),
  successionChapterReader: () => import('../components/SuccessionChapterReader'),
  successionConnections: () => import('../components/SuccessionConnectionBoard'),
  blackWhale: () => import('../components/BlackWhaleGuide'),
  successionDossier: () => import('../components/SuccessionDossier'),
  nen: () => import('../components/NenEncyclopedia'),
  worldAtlas: () => import('../components/WorldAtlas'),
};

const loaderForRoute = (view, target = '') => {
  if (view === 'succession') return routeModuleLoaders.successionArchive;
  if (view === 'reference' && target === 'nen') return routeModuleLoaders.nen;
  if (view === 'reference' && target === 'atlas') return routeModuleLoaders.worldAtlas;
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

// Compatibility export for components that still ask to warm search.
// Search now belongs to the Succession archive route.
export const preloadArchiveSearch = () => preload(routeModuleLoaders.successionArchive);
