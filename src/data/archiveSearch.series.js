import { arcs } from './arcs';
import { archiveDirectory } from './archiveDirectory';
import { chapters } from './chapters';
import { fightAbilities, fightChapters } from './hisokaChrollo';
import { seriesArcDossiers } from './seriesArcDossiers';
import { archiveSearchRecord as record } from './archiveSearch.shared';

const chapterRecords = chapters.map((chapter) => record(
  'Chapter',
  `Chapter ${chapter.number}: ${chapter.title}`,
  `${chapter.arcTitle} · ${chapter.volume ? `Volume ${chapter.volume}` : 'Uncollected'}`,
  `${chapter.summary} ${chapter.characters.join(' ')} ${chapter.locations.join(' ')} ${chapter.research?.phaseTitle || ''} ${chapter.research?.beat || ''} ${chapter.research?.peopleScope?.join(' ') || ''} ${chapter.research?.placeScope?.join(' ') || ''}`,
  chapter.number <= 339
    ? { view: 'series', target: 'chapters', params: { chapter: chapter.number } }
    : { view: 'succession', target: 'chapters', params: { panel: 'chapters', focus: String(chapter.number) } },
  chapter.sourceUrl, chapter.number,
));

const directoryRecords = archiveDirectory.map((item) => record(
  'Archive section', `${item.letter} — ${item.title}`, item.scope,
  `${item.description} ${item.contents.join(' ')}`,
  item.route, item.source,
));

const arcRecords = arcs.map((arc) => record(
  'Arc', arc.title, `Chapters ${arc.chapters[0]}-${arc.chapters[1]}`, `${arc.premise} ${arc.focus.join(' ')}`,
  { view: 'series', target: '', params: { arc: arc.id } }, arc.source,
));

const arcPhaseRecords = seriesArcDossiers.flatMap((arc) => arc.phases.map((phase) => record(
  'Arc phase', `${arc.title} — ${phase.title}`, `Chapters ${phase.range[0]}–${phase.range[1]}`,
  `${phase.summary} ${phase.shift} ${phase.people.join(' ')} ${phase.factions.join(' ')} ${phase.places.join(' ')} ${phase.nen.join(' ')} ${phase.conflicts.join(' ')}`,
  { view: 'series', target: 'research', params: { chapter: phase.range[0] } }, phase.source, phase.range[0],
)));

const arcConflictRecords = seriesArcDossiers.flatMap((arc) => arc.conflicts.map((item) => record(
  'Arc conflict', item.name, `${arc.title} · Chapters ${item.chapters}`,
  `${item.type} ${item.participants} ${item.objective} ${item.abilities} ${item.turningPoint} ${item.outcome} ${item.consequence}`,
  { view: 'series', target: 'arc-study', params: { arc: arc.id } }, item.source, Number(item.chapters.match(/\d+/)?.[0] || arc.range[0]),
)));

const fightDossier = record(
  'Fight dossier', 'Hisoka vs. Chrollo', 'Heavens Arena · Chapters 351–357',
  `Battle to the Death ${fightChapters.map((chapter) => chapter.title).join(' ')} ${fightAbilities.map((ability) => ability.name).join(' ')}`,
  { view: 'reference', target: 'hisoka-chrollo', params: { chapter: 351, ability: 'sun-moon' } },
  fightChapters[0].source, 351,
);

const implementationNotesRecord = record(
  'Archive maintenance', 'Implementation, maintenance & final release', 'Phase 6F handoff · Phase 6G release',
  'Architecture route manifest content schema source policy media rules accessibility performance browser storage runtime recovery update runbooks release checklist source package download completion criteria',
  { view: 'reference', target: 'maintenance' },
);

const fightChapterRecords = fightChapters.map((chapter) => record(
  'Fight chapter', `Hisoka vs. Chrollo — Chapter ${chapter.number}`, `${chapter.title} · ${chapter.phase}`,
  `${chapter.thesis} ${chapter.events.join(' ')} ${chapter.mechanics.join(' ')}`,
  { view: 'reference', target: 'hisoka-chrollo', params: { chapter: chapter.number } }, chapter.source, chapter.number,
));

export const seriesSearchGroups = {
  directoryRecords,
  fightDossier: [fightDossier],
  implementationNotesRecord: [implementationNotesRecord],
  fightChapterRecords,
  chapterRecords,
  arcRecords,
  arcPhaseRecords,
  arcConflictRecords,
};
