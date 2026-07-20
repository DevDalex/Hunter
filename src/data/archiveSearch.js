import { dedupeArchiveSearchRecords } from './archiveSearch.shared';

let archiveSearchPromise;

export const loadArchiveSearchIndex = () => {
  if (!archiveSearchPromise) {
    archiveSearchPromise = Promise.all([
      import('./archiveSearch.series'),
      import('./archiveSearch.succession'),
      import('./archiveSearch.reference'),
    ]).then(([series, succession, reference]) => {
      const s = series.seriesSearchGroups;
      const q = succession.successionSearchGroups;
      const r = reference.referenceSearchGroups;
      const index = dedupeArchiveSearchRecords([
        s.directoryRecords,
        r.mappedPlaces,
        r.unplacedMapRecords,
        r.mapRouteRecords,
        q.voyageEventRecords,
        r.encyclopediaEntries,
        s.fightDossier,
        s.implementationNotesRecord,
        s.fightChapterRecords,
        s.chapterRecords,
        q.successionChapters,
        s.arcRecords,
        s.arcPhaseRecords,
        s.arcConflictRecords,
        r.nenEntries,
        q.princes,
        q.rooms,
        q.abilities,
        q.beasts,
        q.factions,
        q.mafia,
        q.operations,
        q.objects,
        q.mysteries,
        r.hunterpediaTimeline,
        r.hunterpediaWorld,
        r.hunterpediaNen,
        q.successionCharacters,
        r.structuredReferenceEntries,
        r.referenceEntries,
      ]);
      return {
        index,
        types: [...new Set(index.map((item) => item.type))].sort(),
      };
    }).catch((error) => {
      archiveSearchPromise = undefined;
      throw error;
    });
  }
  return archiveSearchPromise;
};

export const preloadArchiveSearchIndex = () => loadArchiveSearchIndex().then(() => undefined).catch(() => undefined);
export { searchFocusId } from './archiveSearch.shared';
