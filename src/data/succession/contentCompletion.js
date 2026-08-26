import {
  successionArchiveData,
  successionArchive,
  successionInformationConsistency,
  successionHighValueIntelligence,
  successionNenSystems,
  successionStoryIntelligence,
  successionContentDepth,
} from './successionData.js';
import { getPreSuccessionResearch } from '../seriesResearch.js';
import { successionContentExpansion } from './contentDepthExpansion.js';
import { createContentCompletionSelectors } from './contentCompletionSelectors.js';
import { getResolvedLedgerCompletion } from './contentCompletionLedgerFix.js';
import {
  getNenCompletion,
  getGlossaryCompletion,
  getCrossLinkCoverage,
  extendCompletionReport,
} from './contentCompletionSupplement.js';

const freeze = (value = []) => Object.freeze(Array.isArray(value) ? [...value] : value);
const uniqueById = (values = []) => [...new Map(values.filter(Boolean).map((value) => [value.id || value.name || String(value), value])).values()];
const compact = (entity) => entity ? Object.freeze({ id: entity.id, name: entity.name || entity.title || entity.id, entityType: entity.entityType || null }) : null;
const chapterFromSource = (source) => Number(source?.chapter || String(source?.id || '').match(/chapter[-_:](\d+)/i)?.[1]) || null;
const entitySourcedAt = (entity, chapter) => (successionArchive.getSourcesForEntity(entity.id) || []).some((source) => chapterFromSource(source) === Number(chapter));
const fieldId = (label) => String(label || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const field = (label, status, value, note = null, sourceRefs = []) => Object.freeze({ id: fieldId(label), label, status, value, note, sourceRefs: freeze(sourceRefs) });

export const successionContentCompletion = createContentCompletionSelectors({
  data: successionArchiveData,
  archive: successionArchive,
  informationConsistency: successionInformationConsistency,
  highValueIntelligence: successionHighValueIntelligence,
  nenSystems: successionNenSystems,
  storyIntelligence: successionStoryIntelligence,
  contentDepth: successionContentDepth,
  contentExpansion: successionContentExpansion,
});

const statusCount = (rows) => rows.reduce((counts, row) => {
  counts[row.status] = (counts[row.status] || 0) + 1;
  return counts;
}, {});

const sourceRefsForAbility = (ability) => freeze((successionArchive.getSourcesForEntity(ability.id) || []).map((source) => source.id).filter(Boolean));

export const getChapterNenDelta = (requestedChapter) => {
  const chapter = Math.max(339, Math.min(successionArchiveData.chapters.at(-1)?.number || 418, Number(requestedChapter) || 418));
  if (chapter === 339) {
    const research = getPreSuccessionResearch(339);
    const packet = research?.nenDelta || {};
    return Object.freeze({
      chapter,
      status: packet.status || 'none-known',
      newAbilities: freeze(packet.newAbilities || []),
      refinedAbilities: freeze(packet.refinedAbilities || []),
      changedAbilities: freeze([]),
      newSystems: freeze(packet.newSystems || []),
      guardianSpiritBeasts: freeze(packet.guardianSpiritBeasts || []),
      ruleChanges: freeze(packet.newRules || []),
      hypotheses: freeze(packet.hypotheses || []),
      mechanicEvents: freeze([]),
      note: packet.note || 'No chapter-specific Nen delta is maintained for Chapter 339.',
    });
  }

  const current = successionNenSystems.getAbilitiesKnownAtChapter(chapter) || [];
  const previous = successionNenSystems.getAbilitiesKnownAtChapter(chapter - 1) || [];
  const previousIds = new Set(previous.map((record) => record.ability.id));
  const newAbilityRecords = current.filter((record) => !previousIds.has(record.ability.id));
  const newAbilityIds = new Set(newAbilityRecords.map((record) => record.ability.id));

  const sourcedAbilities = successionArchive.getEntitiesByType('ability').filter((ability) => entitySourcedAt(ability, chapter));
  const overrideAbilityIds = Object.entries(successionArchiveData.abilityKnowledgeOverrides || {})
    .filter(([, records]) => records.some((record) => Number(record.chapterRange?.start) === chapter))
    .map(([abilityId]) => abilityId);
  const changedAbilityEntities = uniqueById([
    ...sourcedAbilities,
    ...overrideAbilityIds.map((id) => successionArchive.getEntityById(id)),
    ...newAbilityRecords.map((record) => record.ability),
  ]);
  const refinedAbilityEntities = changedAbilityEntities.filter((ability) => previousIds.has(ability.id) && !newAbilityIds.has(ability.id));

  const systems = successionNenSystems.getNenSystemsAtChapter(chapter) || [];
  const previousSystemIds = new Set((successionNenSystems.getNenSystemsAtChapter(chapter - 1) || []).map((profile) => profile.id));
  const newSystems = systems.filter((profile) => !previousSystemIds.has(profile.id));

  const beasts = successionArchive.getEntitiesByType('guardian-beast');
  const beastStateProfiles = successionArchiveData.guardianBeastStateProfiles || {};
  const guardianSpiritBeasts = beasts.filter((beast) => entitySourcedAt(beast, chapter)
    || (beastStateProfiles[beast.id] || []).some((record) => Number(record.chapterRange?.start) === chapter));

  const mechanicEvents = (successionArchive.getEventsForChapter(chapter) || []).filter((event) =>
    (event.abilityIds || []).length
    || (event.guardianBeastIds || []).length
    || (event.nenSystemIds || []).length);

  const hypotheses = [];
  for (const ability of changedAbilityEntities) {
    const dossier = successionNenSystems.getAbilityDossier(ability.id, chapter);
    if (!dossier?.known) continue;
    const candidateStatements = [
      dossier.summary,
      dossier.mechanics?.activation,
      dossier.mechanics?.range,
      dossier.mechanics?.duration,
      ...(dossier.mechanics?.conditions || []),
      ...(dossier.mechanics?.limitations || []),
      ...(dossier.mechanics?.costs || []),
    ].filter(Boolean);
    for (const statement of candidateStatements) {
      if (/hypothes|theor|unverified|unknown|unresolved|not established|not confirmed|ambiguous|estimate|suspect/i.test(String(statement))) {
        hypotheses.push(Object.freeze({ abilityId: ability.id, ability: ability.name, statement: String(statement) }));
      }
    }
  }

  const ruleChanges = freeze([
    ...newAbilityRecords.map((record) => `Ability introduced: ${record.ability.name}`),
    ...refinedAbilityEntities.map((ability) => `Mechanics refined: ${ability.name}`),
    ...newSystems.map((profile) => `Nen system introduced: ${profile.name}`),
    ...guardianSpiritBeasts.map((beast) => `Guardian Spirit Beast evidence updated: ${beast.name}`),
  ]);
  const status = ruleChanges.length || mechanicEvents.length ? 'known' : 'none-known';

  return Object.freeze({
    chapter,
    status,
    newAbilities: freeze(newAbilityRecords.map((record) => compact(record.ability))),
    refinedAbilities: freeze(refinedAbilityEntities.map(compact)),
    changedAbilities: freeze(changedAbilityEntities.map(compact)),
    newSystems: freeze(newSystems.map((profile) => Object.freeze({ id: profile.id, name: profile.name, category: profile.category }))),
    guardianSpiritBeasts: freeze(guardianSpiritBeasts.map(compact)),
    ruleChanges,
    hypotheses: freeze(hypotheses),
    mechanicEvents: freeze(mechanicEvents.map(compact)),
    sourceRefs: freeze(uniqueById(changedAbilityEntities.flatMap((ability) => sourceRefsForAbility(ability).map((id) => ({ id })))).map((row) => row.id)),
    note: status === 'known'
      ? 'Structured Nen delta derived from chapter-bounded ability knowledge transitions, ability overrides, system availability, Guardian Spirit Beast state/source links, and explicitly Nen-linked events.'
      : 'No new or refined ability, Nen system, Guardian Spirit Beast state, or explicitly Nen-linked event is recorded at this chapter boundary.',
  });
};

const patchChapter339 = (dossier) => {
  const research = getPreSuccessionResearch(339);
  if (!research) return dossier;
  const sourceRefs = freeze([research.source, research.officialReaderUrl].filter(Boolean));
  const replacements = new Map([
    ['Japanese title', field('Japanese title', 'known', `${research.japaneseTitle} (${research.japaneseReading})`, null, sourceRefs)],
    ['alternate English renderings', field('alternate English renderings', 'none-known', [], 'No maintained alternate English title is stored for Chapter 339.', sourceRefs)],
    ['official release date', field('official release date', 'known', research.releaseDate, null, sourceRefs)],
    ['volume placement', field('volume placement', 'known', `Volume ${research.volume}`, null, sourceRefs)],
    ['story day / voyage chronology', field('story day / voyage chronology', 'known', research.chronology, null, sourceRefs)],
    ['chronology certainty', field('chronology certainty', 'known', research.chronologyCertainty, null, sourceRefs)],
    ['opening location', field('opening location', 'known', research.openingLocation, null, sourceRefs)],
    ['closing location', field('closing location', 'known', research.closingLocation, null, sourceRefs)],
    ['scene locations', field('scene locations', 'known', research.locations, null, sourceRefs)],
    ['scene participants', field('scene participants', 'known', research.characters, null, sourceRefs)],
    ['first Succession appearances', field('first Succession appearances', 'not-applicable', null, 'Chapter 339 precedes the canonical Succession Contest graph.', sourceRefs)],
    ['latest appearances', field('latest appearances', 'not-applicable', null, 'Chapter 339 is maintained as the pre-Succession handoff rather than a Succession appearance ledger.', sourceRefs)],
    ['new abilities', field('new abilities', 'none-known', [], research.nenDelta.note, sourceRefs)],
    ['newly explained abilities', field('newly explained abilities', 'none-known', [], research.nenDelta.note, sourceRefs)],
    ['Guardian Spirit Beasts shown or discussed', field('Guardian Spirit Beasts shown or discussed', 'none-known', [], 'Guardian Spirit Beasts are not part of Chapter 339.', sourceRefs)],
    ['new Nen rules', field('new Nen rules', 'none-known', [], research.nenDelta.note, sourceRefs)],
    ['Dark Continent expedition developments', field('Dark Continent expedition developments', 'known', research.darkContinentDevelopments, null, sourceRefs)],
    ['objects introduced', field('objects introduced', 'none-known', [], 'The maintained Chapter 339 pass does not classify any shown object as newly introduced.', sourceRefs)],
    ['object possession changes', field('object possession changes', 'known', ['Gon returns Ging’s Hunter License to Ging.'], null, sourceRefs)],
    ['messages / calls / letters', field('messages / calls / letters', 'known', research.communications, null, sourceRefs)],
    ['deaths', field('deaths', 'none-known', [], 'No new death occurs in Chapter 339; Meruem and Komugi appear in an already-dead closing tableau.', sourceRefs)],
    ['suspected deaths', field('suspected deaths', 'none-known', [], 'No new suspected-death state is introduced in the maintained Chapter 339 record.', sourceRefs)],
    ['lies and deception', field('lies and deception', 'known', research.deception, null, sourceRefs)],
    ['new questions', field('new questions', 'known', research.questions, null, sourceRefs)],
    ['resolved questions', field('resolved questions', 'known', research.resolvedQuestions, null, sourceRefs)],
    ['immediate consequences', field('immediate consequences', 'known', research.keyEvents.slice(-3), null, sourceRefs)],
    ['delayed consequences', field('delayed consequences', 'known', research.darkContinentDevelopments, null, sourceRefs)],
    ['what changed since previous chapter', field('what changed since previous chapter', 'known', research.focus, null, sourceRefs)],
    ['why the chapter matters', field('why the chapter matters', 'known', research.focus, null, sourceRefs)],
    ['translation notes', field('translation notes', 'known', `Japanese title: ${research.japaneseTitle} (${research.japaneseReading}).`, null, sourceRefs)],
    ['confirmed vs inferred interpretation', field('confirmed vs inferred interpretation', 'known', research.sourcePolicy.canonBoundary, null, sourceRefs)],
    ['character cross-links', field('character cross-links', 'known', research.characters, null, sourceRefs)],
    ['faction cross-links', field('faction cross-links', 'none-known', [], 'No Succession-faction graph applies to the Chapter 339 handoff.', sourceRefs)],
    ['Nen cross-links', field('Nen cross-links', 'none-known', [], research.nenDelta.note, sourceRefs)],
    ['scene-to-scene continuity', field('scene-to-scene continuity', 'known', [research.continuity?.previous, research.continuity?.next].filter(Boolean), null, sourceRefs)],
  ]);
  const fields = freeze(dossier.fields.map((row) => replacements.get(row.label) || row));
  return Object.freeze({ ...dossier, scope: 'chapter-specific-pre-succession-handoff', research, fields, counts: Object.freeze(statusCount(fields)), completeness: 100, nenDelta: getChapterNenDelta(339), sourceRefs });
};

const patchSuccessionChapter = (dossier) => {
  const delta = getChapterNenDelta(dossier.chapter);
  const byLabel = new Map(dossier.fields.map((row) => [row.label, row]));
  const sourceRefs = byLabel.get('new abilities')?.sourceRefs || dossier.sourceRefs || [];
  const replacements = new Map([
    ['new abilities', field('new abilities', delta.newAbilities.length ? 'known' : 'none-known', delta.newAbilities, delta.newAbilities.length ? null : 'No ability crosses from unknown to known at this chapter boundary.', sourceRefs)],
    ['newly explained abilities', field('newly explained abilities', delta.refinedAbilities.length ? 'known' : 'none-known', delta.refinedAbilities, delta.refinedAbilities.length ? null : 'No already-known ability receives a structured knowledge/source update at this chapter boundary.', sourceRefs)],
    ['Guardian Spirit Beasts shown or discussed', field('Guardian Spirit Beasts shown or discussed', delta.guardianSpiritBeasts.length ? 'known' : 'none-known', delta.guardianSpiritBeasts, delta.guardianSpiritBeasts.length ? null : 'No Guardian Spirit Beast source/state update is recorded at this chapter boundary.', sourceRefs)],
    ['new Nen rules', field('new Nen rules', delta.ruleChanges.length ? 'known' : 'none-known', delta.ruleChanges, delta.note, sourceRefs)],
  ]);
  const fields = freeze(dossier.fields.map((row) => replacements.get(row.label) || row));
  return Object.freeze({ ...dossier, fields, counts: Object.freeze(statusCount(fields)), nenDelta: delta });
};

export const getChapterCompletionDossier = (chapter) => {
  const dossier = successionContentCompletion.getChapterCompletionDossier(chapter);
  if (!dossier) return dossier;
  return dossier.chapter === 339 ? patchChapter339(dossier) : patchSuccessionChapter(dossier);
};

export const getAllChapterCompletionDossiers = (through = successionArchiveData.chapters.at(-1)?.number || 418) => {
  const end = Math.max(339, Math.min(successionArchiveData.chapters.at(-1)?.number || 418, Number(through) || 418));
  return freeze(Array.from({ length: end - 339 + 1 }, (_, index) => getChapterCompletionDossier(339 + index)));
};

export const {
  getPrinceCompletionDossiers,
  getSpecialTrackerCompletion,
  getInvestigationCompletion,
  getKakinCompletion,
  getKnowledgeCompletion,
  getMysteryCompletion,
  getCrossLinkCompletion,
  getOrientationCompletion,
  getEvidenceCompletion,
  getAppendixCompletion,
} = successionContentCompletion;

export const getLedgerCompletion = (chapter) => getResolvedLedgerCompletion(chapter);
export { getNenCompletion, getGlossaryCompletion, getCrossLinkCoverage };

export const getCompletionReport = (chapter) => {
  const base = successionContentCompletion.getCompletionReport(chapter);
  const patchedChapterFields = getAllChapterCompletionDossiers(base.throughChapter).flatMap((row) => row.fields);
  const baseChapterFields = successionContentCompletion.getAllChapterCompletionDossiers(base.throughChapter).flatMap((row) => row.fields);
  const counts = { ...(base.counts || {}) };
  for (const [status, count] of Object.entries(statusCount(baseChapterFields))) counts[status] = Math.max(0, Number(counts[status] || 0) - count);
  for (const [status, count] of Object.entries(statusCount(patchedChapterFields))) counts[status] = Number(counts[status] || 0) + count;
  return extendCompletionReport(Object.freeze({ ...base, counts: Object.freeze(counts) }), chapter ?? base.throughChapter);
};
