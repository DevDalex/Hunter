import { successionArchiveData as productFoundationData } from './entitiesProductClosureFoundation.js';
import { applySuccession414415ArchiveCorrections } from '../succession414415Research.js';

const PENDING_PHASE_ID = 'story-phase:pending-current-release';
const PRE_CURRENT_RELEASE_PHASE_ID = 'story-phase:martial-law-funeral-and-recruitment';
const CURRENT_RELEASE_PHASE_ID = 'story-phase:current-releases-414-416';
const PENDING_STORY_STATUS = 'Reader media indexed; detailed research pending verified chapter documentation';
const unique = (values) => [...new Set(values.filter(Boolean))];

const entityIdCorrections = Object.freeze({
  'nen-system:post-mortem-nen-continuation': 'nen-system:post-mortem-nen',
  'nen-system:royal-curse-networks': 'nen-system:curse-networks',
  'nen-system:contracts-vows-conditional-power': 'nen-system:contracts-vows-and-conditions',
  'nen-system:possession-consciousness-transfer': 'nen-system:possession-and-consciousness-transfer',
  'location:black-whale:tier-1:justice-bureau': 'location:black-whale:tier-2:justice-bureau',
});

const glossaryEntries = Object.freeze((productFoundationData.glossaryEntries || []).map((entry) => Object.freeze({
  ...entry,
  relatedEntityIds: Object.freeze((entry.relatedEntityIds || []).map((id) => entityIdCorrections[id] || id)),
})));

const pendingPhaseTemplate = productFoundationData.storyPhaseProfiles?.[PENDING_PHASE_ID] || null;
const chapterCurrencyData = applySuccession414415ArchiveCorrections(Object.freeze({
  ...productFoundationData,
  glossaryEntries,
}));
const latestImportedChapter = chapterCurrencyData.chapters.at(-1)?.number || 415;
const detailedResearchBoundary = chapterCurrencyData.currentResearchBoundary?.detailedThrough || 415;
const pendingChapters = chapterCurrencyData.chapters.filter((chapter) => chapter.number > detailedResearchBoundary);
const pendingPhase = pendingChapters.length && pendingPhaseTemplate
  ? Object.freeze({
    ...pendingPhaseTemplate,
    name: pendingChapters.length === 1 ? 'Current imported release pending annotation' : 'Imported releases pending annotation',
    summary: pendingChapters.length === 1
      ? 'The reader contains the current imported chapter, but detailed story claims remain pending maintained research review.'
      : `The reader contains Chapters ${pendingChapters[0].number}–${pendingChapters.at(-1).number}, but detailed story claims remain pending maintained research review.`,
    chapterRange: Object.freeze({ start: pendingChapters[0].number, end: pendingChapters.at(-1).number }),
    laneIds: Object.freeze([]),
    threadIds: Object.freeze([]),
    eventIds: Object.freeze([]),
    sourceIds: Object.freeze(unique(pendingChapters.flatMap((chapter) => chapter.sourceIds || []))),
    status: 'pending-maintained-research',
  })
  : null;

const closeSupersededStateRanges = (profiles = {}) => Object.freeze(Object.fromEntries(
  Object.entries(profiles).map(([characterId, records]) => {
    const sorted = [...records].sort((left, right) => left.chapterRange.start - right.chapterRange.start || left.id.localeCompare(right.id));
    return [characterId, Object.freeze(sorted.map((record, index) => {
      const next = sorted[index + 1];
      if (!next || (record.chapterRange.end !== null && record.chapterRange.end !== undefined)) return record;
      return Object.freeze({
        ...record,
        chapterRange: Object.freeze({ ...record.chapterRange, end: next.chapterRange.start - 1 }),
      });
    }))];
  }),
));

const normalizeCharacterBoundary = (character) => {
  const current = character.status
    ? Object.freeze({
      ...character,
      status: Object.freeze({ ...character.status, asOfChapter: latestImportedChapter }),
    })
    : character;
  if (current.id !== 'character:furykov') return current;
  return Object.freeze({
    ...current,
    nen: Object.freeze({
      ...(current.nen || {}),
      naturalType: 'conjuration',
    }),
  });
};

const normalizePendingChapter = (chapter) => {
  if (chapter.number <= detailedResearchBoundary || !pendingPhase) return chapter;
  return Object.freeze({
    ...chapter,
    storyPhaseIds: Object.freeze([PENDING_PHASE_ID]),
    storyLaneIds: Object.freeze([]),
    storyThreadIds: Object.freeze([]),
    storyIntelligenceStatus: PENDING_STORY_STATUS,
    storyCoverage: Object.freeze({
      ...(chapter.storyCoverage || {}),
      phase: true,
      lanes: true,
      threads: true,
    }),
  });
};

const foundationChapterByNumber = new Map(
  (productFoundationData.chapters || []).map((chapter) => [chapter.number, chapter]),
);

const restoreCurrentReleaseStoryProjection = (chapter) => {
  const normalized = normalizePendingChapter(chapter);
  if (chapter.number !== 414 && chapter.number !== 415) return normalized;
  const foundationChapter = foundationChapterByNumber.get(chapter.number);
  if (!foundationChapter) return normalized;

  return Object.freeze({
    ...normalized,
    storyPhaseIds: Object.freeze([...(foundationChapter.storyPhaseIds || [])]),
    storyLaneIds: Object.freeze([...(foundationChapter.storyLaneIds || [])]),
    storyThreadIds: Object.freeze([...(foundationChapter.storyThreadIds || [])]),
    storyIntelligenceStatus: foundationChapter.storyIntelligenceStatus,
    storyCoverage: foundationChapter.storyCoverage,
  });
};

const restoredStoryPhaseProfiles = Object.freeze({
  ...(chapterCurrencyData.storyPhaseProfiles || {}),
  ...(productFoundationData.storyPhaseProfiles?.[PRE_CURRENT_RELEASE_PHASE_ID]
    ? { [PRE_CURRENT_RELEASE_PHASE_ID]: productFoundationData.storyPhaseProfiles[PRE_CURRENT_RELEASE_PHASE_ID] }
    : {}),
  ...(productFoundationData.storyPhaseProfiles?.[CURRENT_RELEASE_PHASE_ID]
    ? { [CURRENT_RELEASE_PHASE_ID]: productFoundationData.storyPhaseProfiles[CURRENT_RELEASE_PHASE_ID] }
    : {}),
  ...(pendingPhase ? { [PENDING_PHASE_ID]: pendingPhase } : {}),
});

const normalizeStoryPhaseStatus = (chapter) => {
  const restored = restoreCurrentReleaseStoryProjection(chapter);
  if (restored.storyIntelligenceStatus !== PENDING_STORY_STATUS) return restored;

  const phases = (restored.storyPhaseIds || [])
    .map((phaseId) => restoredStoryPhaseProfiles[phaseId])
    .filter(Boolean);
  const pendingStoryPhase = phases.some((phase) => phase.status === 'pending-maintained-research');
  if (pendingStoryPhase || phases.length !== 1) return restored;

  return Object.freeze({
    ...restored,
    storyIntelligenceStatus: phases[0].status || 'documented',
  });
};

export const successionArchiveData = Object.freeze({
  ...chapterCurrencyData,
  characters: Object.freeze(chapterCurrencyData.characters.map(normalizeCharacterBoundary)),
  chapters: Object.freeze(chapterCurrencyData.chapters.map(normalizeStoryPhaseStatus)),
  storyPhaseProfiles: restoredStoryPhaseProfiles,
  characterStateProfiles: closeSupersededStateRanges(chapterCurrencyData.characterStateProfiles),
});
