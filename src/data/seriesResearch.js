import { chapterTitles } from './chapterTitles';
import {
  LATEST_DETAILED_SUCCESSION_RESEARCH_CHAPTER,
  LATEST_PUBLISHED_CHAPTER,
} from './latestChapterMetadata';
import { seriesArcDossiers } from './seriesArcDossiers';
import { successionPeriods } from './successionDossier';
import { hunterExamChapterDetails } from './hunterExamChapterDetails';

const wiki = (slug) => `https://hunterxhunter.fandom.com/wiki/${slug}`;

const beatFor = (index, total) => {
  if (total <= 1) return 'Single-chapter turn';
  const progress = index / Math.max(1, total - 1);
  if (progress < 0.2) return 'Phase entry';
  if (progress < 0.48) return 'Development';
  if (progress < 0.78) return 'Escalation';
  if (progress < 1) return 'Turn toward the phase result';
  return 'Phase exit / consequence';
};

const titleSignalFor = (title) => {
  if (/^September\s/i.test(title)) return 'Calendar-sequence chapter: compare its events with the surrounding Yorknew dates.';
  if (/Part\s\d+/i.test(title)) return 'Serialized sequence chapter: read it with the adjacent numbered parts rather than as an isolated event.';
  if (/\?$/.test(title)) return 'Question-led chapter title: track what uncertainty is raised, narrowed, or left unresolved.';
  if (/vs\.|showdown|battle|fight|face-off|struggle|war/i.test(title)) return 'Conflict-led chapter title: identify the objective, information advantage, turning point, and consequence.';
  if (/training|lesson|exam|test|game|rules?|choice|decision/i.test(title)) return 'Rule- or learning-led chapter title: note which constraint becomes newly visible and who understands it first.';
  return `The maintained title, “${title},” is the chapter-specific anchor; the local narrative below is deliberately limited to verified arc-phase context.`;
};

const completedArcByChapter = (number) => seriesArcDossiers.find((arc) => number >= arc.range[0] && number <= arc.range[1]);

export const preSuccessionChapterResearch = chapterTitles.slice(0, 339).map((title, index) => {
  const number = index + 1;
  const arc = completedArcByChapter(number);
  const phaseIndex = arc.phases.findIndex((phase) => number >= phase.range[0] && number <= phase.range[1]);
  const phase = arc.phases[phaseIndex];
  const phasePosition = number - phase.range[0];
  const phaseLength = phase.range[1] - phase.range[0] + 1;
  const previousTitle = number > 1 ? chapterTitles[number - 2] : null;
  const nextTitle = number < chapterTitles.length ? chapterTitles[number] : null;

  return {
    number,
    title,
    arcId: arc.id,
    arcTitle: arc.title,
    phaseId: phase.id,
    phaseTitle: phase.title,
    phaseRange: phase.range,
    phaseIndex: phaseIndex + 1,
    phaseCount: arc.phases.length,
    phasePosition: phasePosition + 1,
    phaseLength,
    beat: beatFor(phasePosition, phaseLength),
    titleSignal: titleSignalFor(title),
    phaseSummary: phase.summary,
    structuralShift: phase.shift,
    peopleScope: phase.people,
    factionScope: phase.factions,
    placeScope: phase.places,
    nenScope: phase.nen,
    conflictScope: phase.conflicts,
    consequence: phase.consequence,
    continuity: {
      previous: previousTitle ? `Chapter ${number - 1}: ${previousTitle}` : 'Series opening',
      next: nextTitle ? `Chapter ${number + 1}: ${nextTitle}` : 'Current catalogue endpoint',
    },
    questions: [
      `What changes between the opening and closing scenes of “${title}”?`,
      `Which part of the ${phase.title} phase moves forward here?`,
      `How does this chapter prepare, complicate, or pay off: ${phase.consequence}`,
    ],
    source: wiki(`Chapter_${number}`),
    phaseSource: phase.source,
    chapterSpecific: Boolean(hunterExamChapterDetails[number]),
    researchLevel: hunterExamChapterDetails[number] ? 'Hunterpedia chapter-specific record + arc-phase context' : 'Arc-phase context record; chapter source linked',
    reviewed: hunterExamChapterDetails[number]?.lastReviewed || 'July 14, 2026',
  };
});

export const preSuccessionResearchByChapter = new Map(preSuccessionChapterResearch.map((record) => [record.number, record]));
export const getPreSuccessionResearch = (number) => preSuccessionResearchByChapter.get(Number(number)) || null;

export const seriesChronology = [
  ...seriesArcDossiers.flatMap((arc) => arc.phases.map((phase, phaseIndex) => ({
    id: `${arc.id}-${phase.id}`,
    arcId: arc.id,
    arcTitle: arc.title,
    order: `${arc.order}.${String(phaseIndex + 1).padStart(2, '0')}`,
    title: phase.title,
    chapters: `Chapters ${phase.range[0]}–${phase.range[1]}`,
    range: phase.range,
    precision: arc.chronology.precision,
    anchor: arc.chronology.anchor,
    route: arc.chronology.route,
    summary: phase.summary,
    shift: phase.shift,
    consequence: phase.consequence,
    people: phase.people,
    factions: phase.factions,
    places: phase.places,
    nen: phase.nen,
    conflicts: phase.conflicts,
    source: phase.source,
    scope: 'Completed arc',
  }))),
  ...successionPeriods.map((period, index) => {
    const range = String(period.chapters).match(/\d+/g)?.map(Number) || [340, LATEST_PUBLISHED_CHAPTER];
    const isCurrent = String(period.chapters).includes('current') || index === successionPeriods.length - 1;
    return {
      id: `succession-${period.status}`,
      arcId: 'succession-contest',
      arcTitle: 'Succession Contest',
      order: `07.${String(index + 1).padStart(2, '0')}`,
      title: period.name,
      chapters: `Chapters ${period.chapters.replace('current', String(LATEST_PUBLISHED_CHAPTER))}`,
      range: [range[0], range[1] || (isCurrent ? LATEST_PUBLISHED_CHAPTER : range[0])],
      precision: 'Current-arc structural period',
      anchor: period.status,
      route: 'Kakin announcement → Black Whale boarding → voyage',
      summary: period.summary,
      shift: 'This period separates expedition politics, royal preparation, and the active voyage so they are not treated as one undifferentiated contest.',
      consequence: index === successionPeriods.length - 1
        ? `Publication extends through Chapter ${LATEST_PUBLISHED_CHAPTER}; detailed maintained research is verified through Chapter ${LATEST_DETAILED_SUCCESSION_RESEARCH_CHAPTER} and the current imported releases remain pending annotation.`
        : `Leads into ${successionPeriods[index + 1]?.name || 'the active contest'}.`,
      people: period.focus,
      factions: [],
      places: index < 2 ? ['Known World', 'Kakin expedition infrastructure'] : ['Black Whale 1'],
      nen: index === 0 ? [] : ['Seed Urn', 'Guardian Spirit Beasts'],
      conflicts: [],
      source: period.source,
      scope: 'Developing current arc',
    };
  }),
];

export const seriesResearchStats = {
  indexedChapters: LATEST_DETAILED_SUCCESSION_RESEARCH_CHAPTER,
  publishedChapters: LATEST_PUBLISHED_CHAPTER,
  pendingPublishedChapters: LATEST_PUBLISHED_CHAPTER - LATEST_DETAILED_SUCCESSION_RESEARCH_CHAPTER,
  locallyChapterSpecific: preSuccessionChapterResearch.filter((record) => record.chapterSpecific).length + (LATEST_DETAILED_SUCCESSION_RESEARCH_CHAPTER - 339),
  preSuccessionContextRecords: preSuccessionChapterResearch.length,
  completedArcPhases: seriesArcDossiers.reduce((total, arc) => total + arc.phases.length, 0),
  chronologyBlocks: seriesChronology.length,
  sourceLinked: preSuccessionChapterResearch.filter((record) => record.source).length,
};

export const adaptationResearch = seriesArcDossiers.map((arc) => ({
  id: arc.id,
  arc: arc.title,
  chapters: `Chapters ${arc.range[0]}–${arc.range[1]}`,
  status: 'Arc-level adaptation note; exact episode mapping remains chapter-source dependent',
  note: arc.adaptation,
  source: arc.source,
}));

export const researchFieldDefinitions = [
  ['Chapter identity', 'Number, maintained title, official arc, volume, and direct Hunterpedia chapter source.'],
  ['Local chapter account', 'An original scene-level summary only when it has been individually maintained; otherwise the interface says so.'],
  ['Arc-phase context', 'Story phase, structural shift, people, factions, places, Nen, conflict scope, and phase consequence.'],
  ['Live source evidence', 'Hunterpedia metadata, title image, synopsis, appearances, locations, adaptations, and notes load from the chapter page when supplied.'],
  ['Continuity', 'Previous and next chapter, phase position, chronology block, and consequence.'],
  ['Confidence', 'Chapter-specific, phase-context, developing-current, and source-unavailable states remain visually distinct.'],
];
