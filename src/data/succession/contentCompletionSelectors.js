import { chapterTitles } from '../chapterTitles.js';
import { getLatestChapterMetadata } from '../latestChapterMetadata.js';
import { getPreSuccessionResearch } from '../seriesResearch.js';
import { successionChapterResearchByNumber } from './successionResearch.js';
import { successionMysteryCases } from './successionMysteryCases.js';
import {
  CHAPTER_FORENSIC_FIELDS,
  PRINCE_DOSSIER_FIELDS,
  SPECIAL_PRINCE_TRACKERS,
  INVESTIGATION_DOSSIERS,
  KAKIN_ROYAL_REFERENCE,
  INFORMATION_WAR_TOPICS,
  LEDGER_DEFINITIONS,
  READER_ORIENTATION_CHECKPOINTS,
  EVIDENCE_QUALITY_RULES,
  REFERENCE_APPENDICES,
} from './contentDepthExpansionReference.js';

const freeze = (value = []) => Object.freeze(Array.isArray(value) ? [...value] : value);
const unique = (values = []) => [...new Set(values.filter(Boolean))];
const text = (...values) => values.flat(Infinity).filter(Boolean).map((value) => {
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  try { return JSON.stringify(value); } catch { return ''; }
}).join(' ').toLowerCase();
const slug = (value) => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const compact = (entity) => entity ? Object.freeze({ id: entity.id, name: entity.name || entity.title || entity.term || entity.id, entityType: entity.entityType || null }) : null;
const toArray = (value) => value == null ? [] : Array.isArray(value) ? value : [value];
const nonEmpty = (value) => Array.isArray(value) ? value.length > 0 : value != null && value !== '';
const chapterFromSourceId = (value) => Number(String(value || '').match(/chapter[-_:](\d+)/i)?.[1]) || null;
const chapterOf = (record) => Number(record?.chapter || record?.chapterRange?.start || record?.firstChapter || record?.publicAtChapter || chapterFromSourceId(record?.id)) || null;
const nameOf = (row) => row?.name || row?.title || row?.label || row?.term || row?.character?.name || row?.ability?.name || row?.organization?.name || row?.entity?.name || row?.id || String(row || '');

const KNOWN = 'known';
const NONE = 'none-known';
const UNKNOWN = 'canon-unknown';
const NA = 'not-applicable';
const ALLOWED_STATES = new Set([KNOWN, NONE, UNKNOWN, NA]);

const field = (label, value, options = {}) => {
  const explicitStatus = options.status;
  const status = explicitStatus || (nonEmpty(value) ? KNOWN : (options.emptyStatus || UNKNOWN));
  if (!ALLOWED_STATES.has(status)) throw new Error(`Invalid completion state for ${label}: ${status}`);
  return Object.freeze({
    id: slug(label),
    label,
    status,
    value: Array.isArray(value) ? freeze(value) : value,
    note: options.note || null,
    sourceRefs: freeze(options.sourceRefs || []),
  });
};

const none = (label, note, sourceRefs = []) => field(label, [], { status: NONE, note, sourceRefs });
const unknown = (label, note, sourceRefs = []) => field(label, null, { status: UNKNOWN, note, sourceRefs });
const notApplicable = (label, note, sourceRefs = []) => field(label, null, { status: NA, note, sourceRefs });

const matches = (rows, pattern) => toArray(rows).filter((row) => pattern.test(text(row)));
const sourceRefsFor = (research, ...records) => unique([
  research?.source,
  research?.sourcePolicy?.chapterUrl,
  ...records.flat(Infinity).flatMap((record) => [record?.source, ...(record?.sourceIds || [])]),
]);
const previewRows = (rows, max = 18) => freeze(toArray(rows).slice(0, max).map((row) => {
  if (typeof row === 'string') return row;
  return nameOf(row);
}).filter(Boolean));
const statusCounts = (fields) => fields.reduce((acc, item) => {
  acc[item.status] = (acc[item.status] || 0) + 1;
  return acc;
}, { [KNOWN]: 0, [NONE]: 0, [UNKNOWN]: 0, [NA]: 0 });
const completeFields = (fields, expected) => expected.map((label) => fields.find((item) => item.label === label) || unknown(label, 'The completion layer did not receive a value. This is treated as an explicit gap and must never be silently omitted.'));

export const createContentCompletionSelectors = ({
  data,
  archive,
  informationConsistency,
  highValueIntelligence,
  nenSystems,
  storyIntelligence,
  contentDepth,
  contentExpansion,
}) => {
  const latest = data.chapters.at(-1)?.number || 417;
  const earliestSuccession = data.chapters.at(0)?.number || 340;
  const characters = archive.getEntitiesByType('character');
  const organizations = archive.getEntitiesByType('organization');
  const abilities = archive.getEntitiesByType('ability');
  const beasts = archive.getEntitiesByType('guardian-beast');
  const locations = archive.getEntitiesByType('location');
  const events = archive.getEntitiesByType('event');

  const clamp = (chapter) => Math.min(latest, Math.max(339, Number(chapter) || latest));
  const researchAt = (chapter) => chapter === 339 ? getPreSuccessionResearch(339) : successionChapterResearchByNumber.get(chapter) || null;
  const stateAt = (id, chapter) => chapter < earliestSuccession ? null : informationConsistency.getCanonicalCharacterState(id, chapter);
  const appearances = (id) => archive.getAppearancesForCharacter(id).map((row) => Number(row.chapter)).filter(Number.isFinite);
  const firstAppearance = (id) => appearances(id).length ? Math.min(...appearances(id)) : null;
  const lastAppearance = (id, chapter) => {
    const rows = appearances(id).filter((value) => value <= chapter);
    return rows.length ? Math.max(...rows) : null;
  };
  const sourcedAt = (entity, chapter) => (archive.getSourcesForEntity(entity.id) || []).some((source) => Number(source.chapter || chapterFromSourceId(source.id)) === chapter);
  const entitiesSourcedAt = (type, chapter) => archive.getEntitiesByType(type).filter((entity) => sourcedAt(entity, chapter));
  const chapterEvents = (chapter) => chapter < earliestSuccession ? [] : archive.getEventsForChapter(chapter) || [];
  const chapterAssignments = (chapter) => chapter < earliestSuccession ? [] : archive.getAssignmentsForChapter(chapter) || [];
  const chapterRelationships = (chapter) => chapter < earliestSuccession ? [] : archive.getRelationshipsForChapter(chapter) || [];
  const activeAssignments = (chapter) => chapter < earliestSuccession ? [] : archive.getActiveAssignmentsAtChapter(chapter) || [];
  const activeRelationships = (chapter) => chapter < earliestSuccession ? [] : archive.getActiveRelationshipsAtChapter(chapter) || [];
  const currentKnownAbilities = (chapter) => chapter < earliestSuccession ? [] : nenSystems.getAbilitiesKnownAtChapter(chapter) || [];
  const newAbilities = (chapter) => currentKnownAbilities(chapter).filter((ability) => !nenSystems.getAbilityKnowledgeAtChapter(ability.id, chapter - 1)?.known);

  const getChapterCompletionDossier = (requested = latest) => {
    const chapter = clamp(requested);
    const research = researchAt(chapter);
    const metadata = getLatestChapterMetadata(chapter);
    const sourceRefs = sourceRefsFor(research);
    if (chapter === 339) {
      const title = chapterTitles[338] || research?.title || null;
      const rows = [
        field('official title', title, { sourceRefs }),
        unknown('Japanese title', 'The maintained Chapter 339 bridge does not store a verified Japanese-title string.', sourceRefs),
        none('alternate English renderings', 'No maintained alternate English title is stored for Chapter 339.', sourceRefs),
        field('official release date', metadata?.releaseDate || null, { sourceRefs, note: metadata?.releaseDate ? null : 'Release date is not stored in the maintained Chapter 339 bridge.' }),
        unknown('volume placement', 'Volume placement is not normalized in the Chapter 339 bridge.', sourceRefs),
        field('story day / voyage chronology', 'Pre-voyage · pre-Succession handoff', { sourceRefs }),
        field('chronology certainty', 'phase-level context', { sourceRefs }),
        unknown('opening location', 'The read-only Series bridge keeps phase-level context rather than a maintained scene transcript.', sourceRefs),
        unknown('closing location', 'The read-only Series bridge keeps phase-level context rather than a maintained scene transcript.', sourceRefs),
        field('scene locations', research?.placeScope || [], { sourceRefs, emptyStatus: NONE }),
        field('scene participants', research?.peopleScope || [], { sourceRefs, emptyStatus: NONE }),
        unknown('first Succession appearances', 'Chapter 339 remains outside the canonical Succession entity graph by design.', sourceRefs),
        unknown('latest appearances', 'Chapter 339 remains outside the canonical Succession entity graph by design.', sourceRefs),
        unknown('new abilities', 'The Chapter 339 bridge is contextual, not a maintained ability annotation packet.', sourceRefs),
        unknown('newly explained abilities', 'The Chapter 339 bridge is contextual, not a maintained ability annotation packet.', sourceRefs),
        field('Guardian Spirit Beasts shown or discussed', research?.nenScope || [], { sourceRefs, emptyStatus: NONE }),
        unknown('new Nen rules', 'No chapter-specific maintained Nen-rule extraction exists for the Chapter 339 bridge.', sourceRefs),
        field('political revelations', [research?.phaseSummary, research?.structuralShift].filter(Boolean), { sourceRefs, emptyStatus: NONE }),
        notApplicable('succession-rule revelations', 'The active Succession Contest archive begins at Chapter 340.', sourceRefs),
        notApplicable('mafia developments', 'No maintained Succession-mafia annotation is attached to the Chapter 339 bridge.', sourceRefs),
        notApplicable('Phantom Troupe developments', 'No maintained Succession-Troupe annotation is attached to the Chapter 339 bridge.', sourceRefs),
        notApplicable('Hisoka developments', 'No maintained Succession-Hisoka annotation is attached to the Chapter 339 bridge.', sourceRefs),
        notApplicable('Beyond developments', 'The Chapter 339 bridge is outside the maintained Succession graph.', sourceRefs),
        field('Dark Continent expedition developments', [research?.phaseSummary, research?.consequence].filter(Boolean), { sourceRefs, emptyStatus: NONE }),
        unknown('objects introduced', 'The Chapter 339 bridge does not maintain chapter-specific object annotations.', sourceRefs),
        unknown('object possession changes', 'The Chapter 339 bridge does not maintain chapter-specific object annotations.', sourceRefs),
        unknown('messages / calls / letters', 'The Chapter 339 bridge does not maintain a scene-level communication ledger.', sourceRefs),
        unknown('orders issued', 'The Chapter 339 bridge does not maintain a scene-level order ledger.', sourceRefs),
        unknown('alliances formed', 'The Chapter 339 bridge does not maintain chapter-specific relationship deltas.', sourceRefs),
        unknown('alliances weakened or broken', 'The Chapter 339 bridge does not maintain chapter-specific relationship deltas.', sourceRefs),
        unknown('deaths', 'The Chapter 339 bridge does not maintain chapter-specific state transitions.', sourceRefs),
        unknown('suspected deaths', 'The Chapter 339 bridge does not maintain chapter-specific state transitions.', sourceRefs),
        unknown('injuries', 'The Chapter 339 bridge does not maintain chapter-specific state transitions.', sourceRefs),
        unknown('disappearances', 'The Chapter 339 bridge does not maintain chapter-specific state transitions.', sourceRefs),
        unknown('body / identity / consciousness changes', 'The Chapter 339 bridge does not maintain structured state transitions.', sourceRefs),
        unknown('curses applied or removed', 'The Chapter 339 bridge does not maintain a curse ledger.', sourceRefs),
        unknown('lies and deception', 'The Chapter 339 bridge does not maintain a knowledge/deception graph.', sourceRefs),
        unknown('withheld information', 'The Chapter 339 bridge does not maintain a knowledge/deception graph.', sourceRefs),
        unknown('false beliefs', 'The Chapter 339 bridge does not maintain a knowledge/deception graph.', sourceRefs),
        unknown('reader-only knowledge', 'The Chapter 339 bridge does not maintain a knowledge/deception graph.', sourceRefs),
        unknown('faction-exclusive knowledge', 'The Chapter 339 bridge does not maintain a knowledge/deception graph.', sourceRefs),
        field('new questions', research?.questions || [], { sourceRefs, emptyStatus: NONE }),
        unknown('resolved questions', 'The Chapter 339 bridge does not maintain a chapter-specific resolved-question register.', sourceRefs),
        unknown('older mysteries affected', 'The Chapter 339 bridge does not maintain a Succession mystery graph.', sourceRefs),
        field('immediate consequences', research?.consequence ? [research.consequence] : [], { sourceRefs, emptyStatus: NONE }),
        field('delayed consequences', research?.continuity?.next ? [research.continuity.next] : [], { sourceRefs, emptyStatus: NONE }),
        field('what changed since previous chapter', research?.structuralShift || research?.beat || null, { sourceRefs }),
        field('why the chapter matters', research?.consequence || research?.phaseSummary || null, { sourceRefs }),
        unknown('translation notes', 'No maintained translation-note packet exists for the Chapter 339 bridge.', sourceRefs),
        field('confirmed vs inferred interpretation', research?.researchLevel || 'phase-context record', { sourceRefs }),
        field('character cross-links', research?.peopleScope || [], { sourceRefs, emptyStatus: NONE }),
        field('faction cross-links', research?.factionScope || [], { sourceRefs, emptyStatus: NONE }),
        field('Nen cross-links', research?.nenScope || [], { sourceRefs, emptyStatus: NONE }),
        notApplicable('mystery cross-links', 'The canonical Succession mystery graph begins after the Chapter 339 bridge.', sourceRefs),
        field('scene-to-scene continuity', [research?.continuity?.previous, research?.continuity?.next].filter(Boolean), { sourceRefs, emptyStatus: NONE }),
      ];
      const fields = freeze(completeFields(rows, CHAPTER_FORENSIC_FIELDS));
      return Object.freeze({ chapter, scope: 'pre-succession-bridge', research, fields, counts: Object.freeze(statusCounts(fields)), completeness: fields.length === CHAPTER_FORENSIC_FIELDS.length ? 100 : 0 });
    }

    const previous = Math.max(earliestSuccession, chapter - 1);
    const chapterRecord = data.chapters.find((row) => Number(row.number) === chapter) || null;
    const ev = chapterEvents(chapter);
    const assignments = chapterAssignments(chapter);
    const relationships = chapterRelationships(chapter);
    const artifacts = highValueIntelligence.getArtifactsAtChapter(chapter) || [];
    const protocols = highValueIntelligence.getProtocolRecordsAtChapter(chapter) || [];
    const knowledge = highValueIntelligence.getKnowledgeRecordsAtChapter(chapter) || [];
    const story = storyIntelligence.getChapterStoryDossier(chapter) || null;
    const whatChanged = contentDepth.getChapterWhatChanged(chapter) || null;
    const deception = contentDepth.getDeceptionLedger(chapter) || [];
    const knowledgeMatrix = contentDepth.getKnowledgeWarfareMatrix(chapter) || [];
    const stateChanges = characters.map((character) => {
      const before = stateAt(character.id, previous);
      const after = stateAt(character.id, chapter);
      if (!after || JSON.stringify(before || null) === JSON.stringify(after || null)) return null;
      return Object.freeze({ character: compact(character), before, after });
    }).filter(Boolean);
    const deaths = stateChanges.filter((row) => row.after?.life === 'dead' && row.before?.life !== 'dead');
    const bodyChanges = stateChanges.filter((row) => text(row.before?.bodyStateCode, row.before?.identityStateCode, row.before?.consciousnessStateCode) !== text(row.after?.bodyStateCode, row.after?.identityStateCode, row.after?.consciousnessStateCode));
    const participants = unique([
      ...(research?.characters || []),
      ...ev.flatMap((row) => row.participantIds || []).map((id) => archive.getEntityById(id)?.name || id),
    ]);
    const locationNames = unique([
      ...(research?.locations || []),
      ...ev.flatMap((row) => [row.locationId, ...(row.locationIds || [])]).map((id) => archive.getEntityById(id)?.name || id),
    ]);
    const firstAppearances = characters.filter((character) => firstAppearance(character.id) === chapter).map((character) => character.name || character.id);
    const latestAppearances = participants.map((name) => characters.find((character) => (character.name || character.id) === name)).filter(Boolean).map((character) => `${character.name}: Ch. ${lastAppearance(character.id, chapter) || '?'}`);
    const newlyKnown = newAbilities(chapter);
    const abilityMentions = entitiesSourcedAt('ability', chapter);
    const beastMentions = entitiesSourcedAt('guardian-beast', chapter);
    const affectedMysteries = successionMysteryCases.filter((record) => record.firstChapter <= chapter && (
      record.firstChapter === chapter || record.latestChapter === chapter || (record.sourceIds || []).some((id) => chapterFromSourceId(id) === chapter) || (record.resolutionHistory || []).some((entry) => Number(entry.chapter) === chapter)
    ));
    const newMysteries = affectedMysteries.filter((record) => record.firstChapter === chapter);
    const resolvedMysteries = affectedMysteries.filter((record) => record.status === 'resolved' || (record.resolutionHistory || []).some((entry) => Number(entry.chapter) === chapter && /resolv|confirm|close|eliminat/i.test(text(entry))));
    const olderMysteries = affectedMysteries.filter((record) => record.firstChapter < chapter);
    const newArtifactRows = artifacts.filter((row) => chapterOf(row) === chapter || sourceRefsFor(null, row).some((id) => chapterFromSourceId(id) === chapter));
    const communicationRows = matches(ev, /call|message|letter|phone|speaker|broadcast|communicat|report|tell|inform|disclos|testim/i);
    const orderRows = unique([...assignments, ...matches(ev, /order|command|assign|detain|custod|deploy|instruct|request/i)]);
    const allianceFormed = relationships.filter((row) => /allied|alliance|cooperat|agreement|deal|partnership/i.test(text(row.sentiment, row.relationshipType, row.type, row.summary, row.state)));
    const allianceBroken = relationships.filter((row) => /hostile|betray|break|sever|collapse|enemy|conflict/i.test(text(row.sentiment, row.relationshipType, row.type, row.summary, row.state)));
    const injuryRows = matches(ev, /injur|wound|shot|poison|stab|trauma|collapse|illness|deteriorat|critical/i);
    const disappearanceRows = matches(ev, /disappear|missing|whereabout|vanish|unaccounted/i);
    const curseRows = unique([...matches(ev, /curse|exorcis|post.mortem|have.not/i), ...matches(protocols, /curse|exorcis|post.mortem|have.not/i)]);
    const lieRows = matches(deception, /lie|deceiv|deception|false|disguise|mislead|withhold/i);
    const withheldRows = knowledgeMatrix.filter((row) => (row.misinformedEntityIds || []).length || (row.misinformedLabels || []).length || /hidden|withheld|secret/i.test(text(row)));
    const falseBeliefRows = knowledgeMatrix.filter((row) => /false|incorrect|mistaken|misinformed|believ/i.test(text(row)) || (row.misinformedEntityIds || []).length);
    const readerOnlyRows = knowledgeMatrix.filter((row) => /reader|audience|dramatic irony|reader-only/i.test(text(row)));
    const factionRows = knowledgeMatrix.filter((row) => /faction|exclusive|only|private|secret|limited/i.test(text(row)) && (row.knowerEntityIds || row.knowerLabels || []).length);
    const immediate = unique([
      ...stateChanges.map((row) => `${row.character.name}: ${row.before?.life || 'unknown'} → ${row.after?.life || 'unknown'}; ${row.before?.locationId || 'unknown location'} → ${row.after?.locationId || 'unknown location'}`),
      ...ev.flatMap((row) => toArray(row.consequences || row.immediateConsequences || row.stateChanges)).map(String),
    ]);
    const delayed = unique(toArray(story?.causalLinks || story?.consequences || story?.downstreamConsequences).map((row) => typeof row === 'string' ? row : nameOf(row)));
    const confidence = unique([
      ...toArray(research?.confidence),
      ...ev.map((row) => row.confidence).filter(Boolean),
    ]);
    const title = research?.title || chapterRecord?.title || chapterTitles[chapter - 1] || null;
    const primarySourceRefs = sourceRefsFor(research, ...ev, ...affectedMysteries);

    const rows = [
      field('official title', title && title !== '?' ? title : null, { sourceRefs: primarySourceRefs, note: title === '?' ? 'Maintained title catalogue stores an unresolved placeholder.' : null }),
      research?.japaneseTitle ? field('Japanese title', research.japaneseTitle, { sourceRefs: primarySourceRefs }) : unknown('Japanese title', 'No verified Japanese-title string is stored in the maintained chapter packet.', primarySourceRefs),
      toArray(research?.alternateTitles).length ? field('alternate English renderings', research.alternateTitles, { sourceRefs: primarySourceRefs }) : none('alternate English renderings', 'No maintained alternate English rendering is stored for this chapter.', primarySourceRefs),
      field('official release date', research?.releaseDate || metadata?.releaseDate || null, { sourceRefs: primarySourceRefs }),
      (research?.volume || chapterRecord?.volume) ? field('volume placement', research?.volume || chapterRecord?.volume, { sourceRefs: primarySourceRefs }) : unknown('volume placement', 'No normalized volume assignment is stored for this chapter; uncollected/current chapters remain explicit unknowns.', primarySourceRefs),
      field('story day / voyage chronology', research?.chronology || research?.voyageDay || chapterRecord?.storyDate || null, { sourceRefs: primarySourceRefs }),
      field('chronology certainty', research?.chronology?.certainty || research?.sourcePolicy?.chronologyPolicy || chapterRecord?.chronologyCertainty || 'maintained chapter chronology', { sourceRefs: primarySourceRefs }),
      locationNames.length ? field('opening location', locationNames[0], { sourceRefs: primarySourceRefs }) : unknown('opening location', 'No normalized opening location is available in the maintained chapter packet.', primarySourceRefs),
      locationNames.length ? field('closing location', locationNames.at(-1), { sourceRefs: primarySourceRefs }) : unknown('closing location', 'No normalized closing location is available in the maintained chapter packet.', primarySourceRefs),
      locationNames.length ? field('scene locations', locationNames, { sourceRefs: primarySourceRefs }) : none('scene locations', 'No normalized scene locations are recorded for this chapter.', primarySourceRefs),
      participants.length ? field('scene participants', participants, { sourceRefs: primarySourceRefs }) : none('scene participants', 'No normalized participant list is recorded for this chapter.', primarySourceRefs),
      firstAppearances.length ? field('first Succession appearances', firstAppearances, { sourceRefs: primarySourceRefs }) : none('first Succession appearances', 'No character has a first maintained Succession appearance at this chapter boundary.', primarySourceRefs),
      latestAppearances.length ? field('latest appearances', latestAppearances, { sourceRefs: primarySourceRefs }) : none('latest appearances', 'No maintained participant appearance entries are linked to this chapter.', primarySourceRefs),
      newlyKnown.length ? field('new abilities', newlyKnown.map((row) => compact(row)), { sourceRefs: primarySourceRefs }) : none('new abilities', 'No ability crosses from unknown to known at this chapter boundary in the canonical Nen knowledge graph.', primarySourceRefs),
      abilityMentions.filter((row) => !newlyKnown.some((ability) => ability.id === row.id)).length ? field('newly explained abilities', abilityMentions.filter((row) => !newlyKnown.some((ability) => ability.id === row.id)).map(compact), { sourceRefs: primarySourceRefs }) : none('newly explained abilities', 'No already-known ability receives a separately sourced explanation record at this chapter boundary.', primarySourceRefs),
      beastMentions.length ? field('Guardian Spirit Beasts shown or discussed', beastMentions.map(compact), { sourceRefs: primarySourceRefs }) : none('Guardian Spirit Beasts shown or discussed', 'No Guardian Spirit Beast entity has a source record at this chapter boundary.', primarySourceRefs),
      matches([...ev, ...protocols], /nen|aura|zetsu|gyo|hatsu|guardian spirit|ability|post.mortem|curse|conjuration|manipulation|emission/i).length ? field('new Nen rules', previewRows(matches([...ev, ...protocols], /nen|aura|zetsu|gyo|hatsu|guardian spirit|ability|post.mortem|curse|conjuration|manipulation|emission/i)), { sourceRefs: primarySourceRefs }) : none('new Nen rules', 'No new Nen-system rule is explicitly normalized at this chapter boundary.', primarySourceRefs),
      matches([...ev, ...knowledge, ...protocols], /politic|royal|king|queen|prince|government|justice|military|authority|law/i).length ? field('political revelations', previewRows(matches([...ev, ...knowledge, ...protocols], /politic|royal|king|queen|prince|government|justice|military|authority|law/i)), { sourceRefs: primarySourceRefs }) : none('political revelations', 'No political revelation is normalized at this chapter boundary.', primarySourceRefs),
      matches([...ev, ...protocols], /succession|seed urn|casket|guardian spirit|ceremony|ritual|prince|king/i).length ? field('succession-rule revelations', previewRows(matches([...ev, ...protocols], /succession|seed urn|casket|guardian spirit|ceremony|ritual|prince|king/i)), { sourceRefs: primarySourceRefs }) : none('succession-rule revelations', 'No Succession-rule change or revelation is normalized at this chapter boundary.', primarySourceRefs),
      matches(ev, /mafia|heil.ly|xi.yu|cha.r|morena|hinrigh|onior|brocco/i).length ? field('mafia developments', previewRows(matches(ev, /mafia|heil.ly|xi.yu|cha.r|morena|hinrigh|onior|brocco/i)), { sourceRefs: primarySourceRefs }) : none('mafia developments', 'No mafia development is normalized at this chapter boundary.', primarySourceRefs),
      matches(ev, /phantom troupe|troupe|spider|chrollo|nobunaga|phinks|feitan|bonolenov|franklin|machi|illumi|kalluto/i).length ? field('Phantom Troupe developments', previewRows(matches(ev, /phantom troupe|troupe|spider|chrollo|nobunaga|phinks|feitan|bonolenov|franklin|machi|illumi|kalluto/i)), { sourceRefs: primarySourceRefs }) : none('Phantom Troupe developments', 'No Phantom Troupe development is normalized at this chapter boundary.', primarySourceRefs),
      matches(ev, /hisoka/i).length ? field('Hisoka developments', previewRows(matches(ev, /hisoka/i)), { sourceRefs: primarySourceRefs }) : none('Hisoka developments', 'No Hisoka development is normalized at this chapter boundary.', primarySourceRefs),
      matches([...ev, ...knowledge], /beyond netero|beyond|longhi|curse child|sarahell/i).length ? field('Beyond developments', previewRows(matches([...ev, ...knowledge], /beyond netero|beyond|longhi|curse child|sarahell/i)), { sourceRefs: primarySourceRefs }) : none('Beyond developments', 'No Beyond-network development is normalized at this chapter boundary.', primarySourceRefs),
      matches(ev, /dark continent|expedition|gatekeeper|new continent|v5|v6|beyond/i).length ? field('Dark Continent expedition developments', previewRows(matches(ev, /dark continent|expedition|gatekeeper|new continent|v5|v6|beyond/i)), { sourceRefs: primarySourceRefs }) : none('Dark Continent expedition developments', 'No Dark Continent expedition development is normalized at this chapter boundary.', primarySourceRefs),
      newArtifactRows.length ? field('objects introduced', newArtifactRows.map((row) => compact(row) || nameOf(row)), { sourceRefs: primarySourceRefs }) : none('objects introduced', 'No new artifact/object record begins at this chapter boundary.', primarySourceRefs),
      matches(ev, /coin|book|letter|weapon|gun|device|card|object|treasure|urn|casket|possession|hold|carry|receive|give/i).length ? field('object possession changes', previewRows(matches(ev, /coin|book|letter|weapon|gun|device|card|object|treasure|urn|casket|possession|hold|carry|receive|give/i)), { sourceRefs: primarySourceRefs }) : none('object possession changes', 'No object-possession change is normalized at this chapter boundary.', primarySourceRefs),
      communicationRows.length ? field('messages / calls / letters', previewRows(communicationRows), { sourceRefs: primarySourceRefs }) : none('messages / calls / letters', 'No communication event is normalized at this chapter boundary.', primarySourceRefs),
      orderRows.length ? field('orders issued', previewRows(orderRows), { sourceRefs: primarySourceRefs }) : none('orders issued', 'No order/command/assignment delta is normalized at this chapter boundary.', primarySourceRefs),
      allianceFormed.length ? field('alliances formed', previewRows(allianceFormed), { sourceRefs: primarySourceRefs }) : none('alliances formed', 'No alliance/cooperation relationship begins or changes at this chapter boundary.', primarySourceRefs),
      allianceBroken.length ? field('alliances weakened or broken', previewRows(allianceBroken), { sourceRefs: primarySourceRefs }) : none('alliances weakened or broken', 'No hostile/betrayal relationship change is normalized at this chapter boundary.', primarySourceRefs),
      deaths.length ? field('deaths', deaths.map((row) => row.character), { sourceRefs: primarySourceRefs }) : none('deaths', 'No canonical life-state transition to dead occurs at this chapter boundary.', primarySourceRefs),
      matches(ev, /presumed dead|suspected dead|appears dead|death uncertain|body.*unknown/i).length ? field('suspected deaths', previewRows(matches(ev, /presumed dead|suspected dead|appears dead|death uncertain|body.*unknown/i)), { sourceRefs: primarySourceRefs }) : none('suspected deaths', 'No suspected-death event is normalized at this chapter boundary.', primarySourceRefs),
      injuryRows.length ? field('injuries', previewRows(injuryRows), { sourceRefs: primarySourceRefs }) : none('injuries', 'No injury/illness/trauma event is normalized at this chapter boundary.', primarySourceRefs),
      disappearanceRows.length ? field('disappearances', previewRows(disappearanceRows), { sourceRefs: primarySourceRefs }) : none('disappearances', 'No disappearance/missing-person event is normalized at this chapter boundary.', primarySourceRefs),
      bodyChanges.length ? field('body / identity / consciousness changes', bodyChanges.map((row) => ({ character: row.character, before: row.before, after: row.after })), { sourceRefs: primarySourceRefs }) : none('body / identity / consciousness changes', 'No structured body/identity/consciousness transition occurs at this chapter boundary.', primarySourceRefs),
      curseRows.length ? field('curses applied or removed', previewRows(curseRows), { sourceRefs: primarySourceRefs }) : none('curses applied or removed', 'No curse application/removal is normalized at this chapter boundary.', primarySourceRefs),
      lieRows.length ? field('lies and deception', previewRows(lieRows), { sourceRefs: primarySourceRefs }) : none('lies and deception', 'No deception record is normalized at this chapter boundary.', primarySourceRefs),
      withheldRows.length ? field('withheld information', previewRows(withheldRows), { sourceRefs: primarySourceRefs }) : none('withheld information', 'No explicitly withheld information claim changes at this chapter boundary.', primarySourceRefs),
      falseBeliefRows.length ? field('false beliefs', previewRows(falseBeliefRows), { sourceRefs: primarySourceRefs }) : none('false beliefs', 'No false-belief state is normalized at this chapter boundary.', primarySourceRefs),
      readerOnlyRows.length ? field('reader-only knowledge', previewRows(readerOnlyRows), { sourceRefs: primarySourceRefs }) : none('reader-only knowledge', 'No explicit reader-only knowledge record is normalized at this chapter boundary.', primarySourceRefs),
      factionRows.length ? field('faction-exclusive knowledge', previewRows(factionRows), { sourceRefs: primarySourceRefs }) : none('faction-exclusive knowledge', 'No faction-exclusive knowledge record is normalized at this chapter boundary.', primarySourceRefs),
      newMysteries.length ? field('new questions', newMysteries.map((row) => row.question), { sourceRefs: primarySourceRefs }) : none('new questions', 'No new tracked mystery case opens at this chapter boundary.', primarySourceRefs),
      resolvedMysteries.length ? field('resolved questions', resolvedMysteries.map((row) => row.title || row.question), { sourceRefs: primarySourceRefs }) : none('resolved questions', 'No tracked mystery case resolves at this chapter boundary.', primarySourceRefs),
      olderMysteries.length ? field('older mysteries affected', olderMysteries.map((row) => row.title || row.question), { sourceRefs: primarySourceRefs }) : none('older mysteries affected', 'No older tracked mystery receives new evidence at this chapter boundary.', primarySourceRefs),
      immediate.length ? field('immediate consequences', immediate, { sourceRefs: primarySourceRefs }) : field('immediate consequences', whatChanged || research?.focus || story?.summary || null, { sourceRefs: primarySourceRefs, note: 'Uses the maintained chapter delta/focus when no standalone consequence array exists.' }),
      delayed.length ? field('delayed consequences', delayed, { sourceRefs: primarySourceRefs }) : unknown('delayed consequences', 'No separately normalized downstream-consequence record is attached at this chapter boundary.', primarySourceRefs),
      field('what changed since previous chapter', whatChanged || research?.status || research?.focus || null, { sourceRefs: primarySourceRefs }),
      field('why the chapter matters', story?.summary || research?.focus || research?.status || null, { sourceRefs: primarySourceRefs }),
      (research?.translationNotes || research?.sourcePolicy?.titleStatus) ? field('translation notes', research?.translationNotes || research?.sourcePolicy?.titleStatus, { sourceRefs: primarySourceRefs }) : unknown('translation notes', 'No chapter-specific maintained translation note is stored.', primarySourceRefs),
      confidence.length ? field('confirmed vs inferred interpretation', confidence, { sourceRefs: primarySourceRefs }) : field('confirmed vs inferred interpretation', 'Maintained canonical chapter packet; unknown fields stay explicitly unresolved.', { sourceRefs: primarySourceRefs }),
      participants.length ? field('character cross-links', participants, { sourceRefs: primarySourceRefs }) : none('character cross-links', 'No character links are normalized for this chapter.', primarySourceRefs),
      entitiesSourcedAt('organization', chapter).length ? field('faction cross-links', entitiesSourcedAt('organization', chapter).map(compact), { sourceRefs: primarySourceRefs }) : none('faction cross-links', 'No organization entity receives a source record at this chapter boundary.', primarySourceRefs),
      abilityMentions.length ? field('Nen cross-links', abilityMentions.map(compact), { sourceRefs: primarySourceRefs }) : none('Nen cross-links', 'No ability entity receives a source record at this chapter boundary.', primarySourceRefs),
      affectedMysteries.length ? field('mystery cross-links', affectedMysteries.map((row) => row.id), { sourceRefs: primarySourceRefs }) : none('mystery cross-links', 'No mystery case is affected at this chapter boundary.', primarySourceRefs),
      field('scene-to-scene continuity', [research?.prelude, research?.chronology, story?.previousChapter, story?.nextChapter].flat().filter(Boolean), { sourceRefs: primarySourceRefs, emptyStatus: UNKNOWN, note: 'Uses maintained prelude/chronology/Story Intelligence continuity records.' }),
    ];

    const fields = freeze(completeFields(rows, CHAPTER_FORENSIC_FIELDS));
    return Object.freeze({
      chapter,
      scope: 'succession',
      research,
      fields,
      counts: Object.freeze(statusCounts(fields)),
      completeness: fields.length === CHAPTER_FORENSIC_FIELDS.length && fields.every((item) => ALLOWED_STATES.has(item.status)) ? 100 : 0,
      sourceRefs: freeze(primarySourceRefs),
    });
  };

  const getAllChapterCompletionDossiers = (through = latest) => {
    const end = clamp(through);
    return freeze(Array.from({ length: end - 339 + 1 }, (_, index) => getChapterCompletionDossier(339 + index)));
  };

  const mentionsEntity = (row, entity) => text(row).includes(String(entity.id).toLowerCase()) || text(row).includes(String(entity.name || '').toLowerCase());
  const getPrinceCompletionDossiers = (requested = latest) => {
    const chapter = Math.max(earliestSuccession, clamp(requested));
    const board = contentDepth.getPrinceCampaignBoard(chapter) || [];
    const threats = contentDepth.getThreatAssassinationMatrix(chapter) || [];
    const knowledge = contentDepth.getKnowledgeWarfareMatrix(chapter) || [];
    const curses = contentDepth.getCurseRegistry(chapter) || {};
    const leverage = contentDepth.getLeverageBoard(chapter) || [];
    const protocols = highValueIntelligence.getProtocolRecordsAtChapter(chapter) || [];
    const active = activeAssignments(chapter);
    const rels = activeRelationships(chapter);

    return freeze(board.map((row) => {
      const prince = archive.getEntityById(row.character.id);
      const state = stateAt(prince.id, chapter) || {};
      const campaign = contentDepth.getCharacterCampaignDossier(prince.id, chapter) || {};
      const personalAssignments = active.filter((record) => mentionsEntity(record, prince));
      const personalRelationships = rels.filter((record) => mentionsEntity(record, prince));
      const allies = personalRelationships.filter((record) => /allied|support|cooperat|family|protect|loyal/i.test(text(record.sentiment, record.relationshipType, record.type, record.summary)));
      const enemies = personalRelationships.filter((record) => /hostile|enemy|target|assassin|betray|threat/i.test(text(record.sentiment, record.relationshipType, record.type, record.summary)));
      const incoming = threats.filter((record) => record.target?.id === prince.id || mentionsEntity(record.target, prince));
      const outgoing = threats.filter((record) => record.source?.id === prince.id || mentionsEntity(record.source, prince));
      const known = knowledge.filter((record) => (record.knowerEntityIds || []).includes(prince.id) || (record.knowerLabels || []).some((label) => text(label).includes(text(prince.name))));
      const misinformed = knowledge.filter((record) => (record.misinformedEntityIds || []).includes(prince.id) || (record.misinformedLabels || []).some((label) => text(label).includes(text(prince.name))));
      const ownedAbilities = abilities.filter((ability) => (ability.ownerIds || []).includes(prince.id) && nenSystems.getAbilityKnowledgeAtChapter(ability.id, chapter)?.known);
      const beast = row.guardianBeastId ? archive.getEntityById(row.guardianBeastId) : beasts.find((record) => record.hostCharacterId === prince.id) || null;
      const beastDossier = beast ? nenSystems.getGuardianBeastDossier(beast.id, chapter) : null;
      const personnel = unique(personalAssignments.map((record) => record.personId).filter(Boolean)).map((id) => compact(archive.getEntityById(id))).filter(Boolean);
      const personalCurseRows = [...toArray(curses.abilities), ...toArray(curses.protocols), ...toArray(curses.assignments)].filter((record) => mentionsEntity(record, prince));
      const personalLeverage = toArray(leverage).filter((record) => mentionsEntity(record, prince));
      const ritualRows = protocols.filter((record) => /succession|seed urn|guardian|ritual|casket|funeral/i.test(text(record)) && (mentionsEntity(record, prince) || !record.subjectEntityIds));
      const tracker = SPECIAL_PRINCE_TRACKERS.find((record) => record.entityId === prince.id) || null;
      const objectiveRows = toArray(campaign.currentObjectives || campaign.objectives || row.objectives || row.currentObjectives);
      const latestAppearance = lastAppearance(prince.id, chapter);
      const sourceRefs = unique((archive.getSourcesForEntity(prince.id) || []).map((source) => source.id || source.source));
      const guardRows = personalAssignments.filter((record) => /guard|protect|security|surveil|bodyguard|escort/i.test(text(record.assignmentType, record.summary, record.role, record.type)));
      const queenRows = guardRows.filter((record) => /queen/i.test(text(record)));
      const hunterRows = guardRows.filter((record) => /hunter|association|provisional/i.test(text(record)));
      const temporaryRows = guardRows.filter((record) => /temporary|transfer|loan|relief|rotation/i.test(text(record)));
      const hostilePersonnel = personnel.filter((person) => enemies.some((record) => mentionsEntity(record, person)));
      const alliedPersonnel = personnel.filter((person) => allies.some((record) => mentionsEntity(record, person)));
      const deadPersonnel = personnel.filter((person) => stateAt(person.id, chapter)?.life === 'dead');
      const statusHistory = toArray(data.characterStateProfiles?.[prince.id]).filter((record) => Number(record.chapterRange?.start || 0) <= chapter);
      const fieldsRaw = [
        field('current life status', state.life || row.life || null, { sourceRefs }),
        field('body state', state.bodyStateCode || row.body || null, { sourceRefs }),
        field('identity state', state.identityStateCode || row.identity || null, { sourceRefs }),
        field('consciousness state', state.consciousnessStateCode || row.consciousness || null, { sourceRefs }),
        field('current location', state.locationId || row.locationId || null, { sourceRefs }),
        latestAppearance ? field('last confirmed appearance', `Chapter ${latestAppearance}`, { sourceRefs }) : unknown('last confirmed appearance', 'No chapter appearance is linked at the selected boundary.', sourceRefs),
        objectiveRows.length ? field('current objective', previewRows(objectiveRows), { sourceRefs }) : unknown('current objective', 'No explicit current objective is normalized at this boundary.', sourceRefs),
        matches(objectiveRows, /public|stated|announce|declare/i).length ? field('publicly stated objective', previewRows(matches(objectiveRows, /public|stated|announce|declare/i)), { sourceRefs }) : unknown('publicly stated objective', 'No separately normalized public objective is stored.', sourceRefs),
        matches(objectiveRows, /private|secret|covert|hidden|probable|likely/i).length ? field('probable private objective', previewRows(matches(objectiveRows, /private|secret|covert|hidden|probable|likely/i)), { sourceRefs }) : unknown('probable private objective', 'No evidence-bounded private objective is separately normalized.', sourceRefs),
        allies.length ? field('known allies', previewRows(allies), { sourceRefs }) : none('known allies', 'No active allied relationship is normalized at this boundary.', sourceRefs),
        matches(allies, /suspect|possible|uncertain|inferred/i).length ? field('suspected allies', previewRows(matches(allies, /suspect|possible|uncertain|inferred/i)), { sourceRefs }) : none('suspected allies', 'No suspected-alliance relationship is normalized at this boundary.', sourceRefs),
        matches(allies, /politic|royal|queen|prince|deal|alliance/i).length ? field('political allies', previewRows(matches(allies, /politic|royal|queen|prince|deal|alliance/i)), { sourceRefs }) : none('political allies', 'No political-alliance relationship is separately normalized at this boundary.', sourceRefs),
        alliedPersonnel.length ? field('Nen allies', alliedPersonnel, { sourceRefs }) : none('Nen allies', 'No allied personnel are separately classified as Nen support in the dossier at this boundary.', sourceRefs),
        matches(personalAssignments, /military|army|soldier|first unit|royal army/i).length ? field('military support', previewRows(matches(personalAssignments, /military|army|soldier|first unit|royal army/i)), { sourceRefs }) : none('military support', 'No military-support assignment is normalized for this prince at this boundary.', sourceRefs),
        matches(personalAssignments, /queen|household|mother/i).length ? field('queen / household backing', previewRows(matches(personalAssignments, /queen|household|mother/i)), { sourceRefs }) : none('queen / household backing', 'No queen/household backing record is normalized at this boundary.', sourceRefs),
        enemies.length ? field('enemies', previewRows(enemies), { sourceRefs }) : none('enemies', 'No active hostile relationship is normalized at this boundary.', sourceRefs),
        incoming.length ? field('active threats', previewRows(incoming), { sourceRefs }) : none('active threats', 'No active threat row targets this prince at this boundary.', sourceRefs),
        incoming.length ? field('who is targeting the prince', previewRows(incoming.map((record) => record.source || record)), { sourceRefs }) : none('who is targeting the prince', 'No active targeting record exists at this boundary.', sourceRefs),
        matches(known, /target|threat|assassin|attack|kill/i).length ? field('who the prince believes is targeting them', previewRows(matches(known, /target|threat|assassin|attack|kill/i)), { sourceRefs }) : unknown('who the prince believes is targeting them', 'The prince’s personal threat model is not separately normalized at this boundary.', sourceRefs),
        known.length ? field('information possessed', previewRows(known), { sourceRefs }) : none('information possessed', 'No explicit knowledge claims are assigned to this prince at this boundary.', sourceRefs),
        misinformed.length ? field('missing information', previewRows(misinformed), { sourceRefs }) : unknown('missing information', 'Absence of a misinformed record does not prove the prince knows every relevant fact.', sourceRefs),
        matches(misinformed, /false|incorrect|mistaken|believ|misinformed/i).length ? field('false beliefs', previewRows(matches(misinformed, /false|incorrect|mistaken|believ|misinformed/i)), { sourceRefs }) : none('false beliefs', 'No explicit false-belief record is assigned to this prince at this boundary.', sourceRefs),
        matches(known, /nen|aura|guardian|ability|zetsu|hatsu/i).length ? field('Nen knowledge', previewRows(matches(known, /nen|aura|guardian|ability|zetsu|hatsu/i)), { sourceRefs }) : unknown('Nen knowledge', 'No explicit Nen-knowledge claim is normalized for this prince at this boundary.', sourceRefs),
        ownedAbilities.length ? field('personal abilities', ownedAbilities.map(compact), { sourceRefs }) : none('personal abilities', 'No personal Nen ability is known for this prince at this boundary.', sourceRefs),
        field('aura / training state', campaign.nenTraining || campaign.trainingState || row.nenTraining || (ownedAbilities.length ? 'Known Nen ability user; see ability dossiers for demonstrated mechanics.' : null), { sourceRefs, note: 'Unknown when the archive has no explicit training-state record.' }),
        beast ? field('Guardian Spirit Beast', compact(beast), { sourceRefs }) : unknown('Guardian Spirit Beast', 'The prince’s Guardian Spirit Beast is not yet normalized/identified at this boundary.', sourceRefs),
        beastDossier?.behavior || beastDossier?.summary ? field('beast behavior', beastDossier.behavior || beastDossier.summary, { sourceRefs }) : unknown('beast behavior', 'No explicit behavior profile is normalized for this beast at this boundary.', sourceRefs),
        beastDossier?.conditions ? field('beast conditions', beastDossier.conditions, { sourceRefs }) : unknown('beast conditions', 'The beast’s conditions are not fully established at this boundary.', sourceRefs),
        beastDossier?.triggers ? field('beast triggers', beastDossier.triggers, { sourceRefs }) : unknown('beast triggers', 'The beast’s trigger conditions are not fully established at this boundary.', sourceRefs),
        beastDossier?.targets ? field('beast targets', beastDossier.targets, { sourceRefs }) : unknown('beast targets', 'The beast’s target-selection rules are not fully established at this boundary.', sourceRefs),
        beastDossier?.effects ? field('beast effects', beastDossier.effects, { sourceRefs }) : unknown('beast effects', 'The beast’s effect set is not fully established at this boundary.', sourceRefs),
        beastDossier?.limitations ? field('beast limitations', beastDossier.limitations, { sourceRefs }) : unknown('beast limitations', 'The beast’s limitations are not fully established at this boundary.', sourceRefs),
        beastDossier?.range ? field('beast range', beastDossier.range, { sourceRefs }) : unknown('beast range', 'The beast’s range is not canonically established in the normalized record.', sourceRefs),
        (beastDossier?.hostAwareness != null) ? field('host awareness of beast', beastDossier.hostAwareness, { sourceRefs }) : unknown('host awareness of beast', 'Host awareness is not explicitly normalized for this beast at this boundary.', sourceRefs),
        beast ? field('unresolved beast mechanics', beastDossier?.unknowns || ['Complete mechanics remain publication-bounded; unknown fields are not inferred.'], { sourceRefs }) : unknown('unresolved beast mechanics', 'No beast dossier exists to enumerate unresolved mechanics.', sourceRefs),
        guardRows.length ? field('personal guards', previewRows(guardRows), { sourceRefs }) : none('personal guards', 'No active guard assignment is normalized at this boundary.', sourceRefs),
        queenRows.length ? field('queen guards', previewRows(queenRows), { sourceRefs }) : none('queen guards', 'No active queen-guard assignment is normalized at this boundary.', sourceRefs),
        hunterRows.length ? field('Hunter guards', previewRows(hunterRows), { sourceRefs }) : none('Hunter guards', 'No active Hunter/Association guard assignment is normalized at this boundary.', sourceRefs),
        temporaryRows.length ? field('temporary guards', previewRows(temporaryRows), { sourceRefs }) : none('temporary guards', 'No temporary/rotating guard assignment is normalized at this boundary.', sourceRefs),
        hostilePersonnel.length ? field('secretly hostile personnel', hostilePersonnel, { sourceRefs }) : unknown('secretly hostile personnel', 'No personnel member is explicitly normalized as secretly hostile; absence is not proof none exist.', sourceRefs),
        alliedPersonnel.length ? field('secretly allied personnel', alliedPersonnel, { sourceRefs }) : unknown('secretly allied personnel', 'No personnel member is explicitly normalized as secretly allied beyond visible relationship evidence.', sourceRefs),
        deadPersonnel.length ? field('dead guards', deadPersonnel, { sourceRefs }) : none('dead guards', 'No currently listed personnel member has a dead life-state at this boundary.', sourceRefs),
        matches(personalAssignments, /transfer|reassign|rotation|relief|loan/i).length ? field('transferred personnel', previewRows(matches(personalAssignments, /transfer|reassign|rotation|relief|loan/i)), { sourceRefs }) : none('transferred personnel', 'No transferred-personnel assignment is normalized at this boundary.', sourceRefs),
        field('room / security configuration', unique([state.locationId || row.locationId, ...guardRows.map(nameOf)].filter(Boolean)), { sourceRefs, emptyStatus: UNKNOWN, note: 'Uses current location plus active security assignments; unknown physical details remain explicit.' }),
        matches(personalAssignments, /access|restrict|entry|exit|movement|detain|custody|lock/i).length ? field('access restrictions', previewRows(matches(personalAssignments, /access|restrict|entry|exit|movement|detain|custody|lock/i)), { sourceRefs }) : unknown('access restrictions', 'No explicit access restriction is normalized at this boundary.', sourceRefs),
        matches(known, /call|phone|message|contact|communicat|speaker|radio|report/i).length ? field('communications access', previewRows(matches(known, /call|phone|message|contact|communicat|speaker|radio|report/i)), { sourceRefs }) : unknown('communications access', 'No explicit communication-access profile is normalized at this boundary.', sourceRefs),
        ritualRows.length ? field('ritual implications', previewRows(ritualRows), { sourceRefs }) : unknown('ritual implications', 'No prince-specific ritual implication is separately normalized at this boundary.', sourceRefs),
        personalCurseRows.length ? field('curse exposure', previewRows(personalCurseRows), { sourceRefs }) : none('curse exposure', 'No active curse record is linked to this prince at this boundary.', sourceRefs),
        incoming.length ? field('assassination attempts suffered', previewRows(incoming), { sourceRefs }) : none('assassination attempts suffered', 'No tracked assassination/threat row targets this prince at this boundary.', sourceRefs),
        outgoing.length ? field('assassination attempts initiated', previewRows(outgoing), { sourceRefs }) : none('assassination attempts initiated', 'No tracked assassination/threat row originates from this prince at this boundary.', sourceRefs),
        matches(personalLeverage, /politic|royal|authority|law|queen|military|public/i).length ? field('political leverage', previewRows(matches(personalLeverage, /politic|royal|authority|law|queen|military|public/i)), { sourceRefs }) : unknown('political leverage', 'No separately normalized political-leverage row is available at this boundary.', sourceRefs),
        personalLeverage.length ? field('negotiating leverage', previewRows(personalLeverage), { sourceRefs }) : unknown('negotiating leverage', 'No separately normalized leverage row is available at this boundary.', sourceRefs),
        incoming.length || tracker?.questions?.length ? field('largest vulnerability', previewRows([...incoming, ...(tracker?.questions || [])], 5), { sourceRefs }) : unknown('largest vulnerability', 'No evidence-bounded vulnerability summary is normalized at this boundary.', sourceRefs),
        tracker?.questions?.length ? field('largest unknown', tracker.questions, { sourceRefs }) : unknown('largest unknown', 'No prince-specific unknown register is attached.', sourceRefs),
        statusHistory.length ? field('chapter-by-chapter status history', statusHistory, { sourceRefs }) : unknown('chapter-by-chapter status history', 'No structured state profile is stored for this prince.', sourceRefs),
      ];
      const fields = freeze(completeFields(fieldsRaw, PRINCE_DOSSIER_FIELDS));
      return Object.freeze({ prince: compact(prince), order: row.order, chapter, tracker, fields, counts: Object.freeze(statusCounts(fields)), completeness: fields.length === PRINCE_DOSSIER_FIELDS.length ? 100 : 0, sourceRefs: freeze(sourceRefs) });
    }));
  };

  const getSpecialTrackerCompletion = (id, requested = latest) => {
    const chapter = Math.max(earliestSuccession, clamp(requested));
    const tracker = SPECIAL_PRINCE_TRACKERS.find((row) => row.id === id || row.entityId === id);
    if (!tracker) return null;
    const entity = archive.getEntityById(tracker.entityId);
    const allThreats = contentDepth.getThreatAssassinationMatrix(chapter) || [];
    const allKnowledge = contentDepth.getKnowledgeWarfareMatrix(chapter) || [];
    const allArtifacts = highValueIntelligence.getArtifactsAtChapter(chapter) || [];
    const allEvents = events.filter((row) => Number(row.chapterRange?.start || 0) <= chapter);
    const allAssignments = activeAssignments(chapter);
    const allProtocols = highValueIntelligence.getProtocolRecordsAtChapter(chapter) || [];
    const transfer = contentDepth.getAbilityTransferInheritanceLedger(chapter) || [];
    const curses = contentDepth.getCurseRegistry(chapter) || {};
    const training = contentDepth.getNenTrainingTracker(chapter) || {};
    const body = contentDepth.getBodyIdentityConsciousnessExplorer(chapter, { exceptionalOnly: false }) || [];
    const mysteryRows = successionMysteryCases.filter((row) => row.firstChapter <= chapter && (row.relatedEntityIds || []).includes(entity.id));
    const pool = [...allEvents, ...allAssignments, ...allThreats, ...allKnowledge, ...allArtifacts, ...allProtocols, ...transfer, ...toArray(curses.abilities), ...toArray(curses.assignments), ...toArray(curses.protocols), ...toArray(training.participants), ...toArray(body), ...mysteryRows];
    const focusRows = tracker.focus.map((focus) => {
      const tokens = focus.toLowerCase().split(/[^a-z0-9]+/).filter((token) => token.length >= 4 && !['ledger', 'chronology', 'known', 'current', 'separate', 'information'].includes(token));
      const candidates = pool.filter((row) => mentionsEntity(row, entity) && (tokens.length === 0 || tokens.some((token) => text(row).includes(token))));
      return Object.freeze({ focus, status: candidates.length ? KNOWN : UNKNOWN, rows: freeze(candidates), note: candidates.length ? null : 'No separate structured row matches this tracker facet; the facet remains visibly unresolved rather than being treated as complete by schema alone.' });
    });
    return Object.freeze({ id: tracker.id, label: tracker.label, chapter, entity: compact(entity), canonicalFrame: tracker.canonicalFrame, questions: tracker.questions, focusRows: freeze(focusRows), completeness: focusRows.every((row) => [KNOWN, UNKNOWN].includes(row.status)) ? 100 : 0 });
  };

  const getInvestigationCompletion = (requested = latest) => {
    const chapter = Math.max(earliestSuccession, clamp(requested));
    const base = contentExpansion.getInvestigationDossiers(chapter);
    return freeze(base.map((investigation) => {
      const definition = INVESTIGATION_DOSSIERS.find((row) => row.id === investigation.id);
      const entityIds = new Set(definition.relatedIds || []);
      const relevantEvents = events.filter((row) => Number(row.chapterRange?.start || 0) <= chapter && [...entityIds].some((id) => text(row).includes(id.toLowerCase()) || text(row).includes((archive.getEntityById(id)?.name || '').toLowerCase())));
      const relevantRelationships = archive.getEntitiesByType('relationship').filter((row) => Number(row.chapterRange?.start || 0) <= chapter && [...entityIds].some((id) => text(row).includes(id.toLowerCase()) || text(row).includes((archive.getEntityById(id)?.name || '').toLowerCase())));
      const evidence = unique([
        ...investigation.cases.flatMap((record) => [...(record.knownFacts || []), ...(record.unknowns || []), ...(record.candidates || []).flatMap((candidate) => [...(candidate.evidenceFor || []), ...(candidate.evidenceAgainst || [])])]),
        ...relevantEvents.map(nameOf),
        ...relevantRelationships.map(nameOf),
      ]);
      const facets = definition.facets.map((facet) => {
        const tokens = facet.toLowerCase().split(/[^a-z0-9]+/).filter((token) => token.length >= 4);
        const rows = [...investigation.cases, ...relevantEvents, ...relevantRelationships].filter((row) => tokens.some((token) => text(row).includes(token)));
        return Object.freeze({ facet, status: rows.length ? KNOWN : UNKNOWN, rows: freeze(rows), note: rows.length ? null : 'Facet is explicitly retained as unresolved/unstructured at the selected publication boundary.' });
      });
      return Object.freeze({ ...investigation, evidence: freeze(evidence), facets: freeze(facets), completeness: facets.every((row) => [KNOWN, UNKNOWN].includes(row.status)) ? 100 : 0 });
    }));
  };

  const getKakinCompletion = (requested = latest) => {
    const chapter = Math.max(earliestSuccession, clamp(requested));
    const system = contentExpansion.getKakinRoyalSystemReference(chapter);
    const protocols = highValueIntelligence.getProtocolRecordsAtChapter(chapter) || [];
    const artifacts = highValueIntelligence.getArtifactsAtChapter(chapter) || [];
    const royalAssignments = activeAssignments(chapter).filter((row) => /prince|queen|royal|guard|security|military/i.test(text(row)));
    const reference = KAKIN_ROYAL_REFERENCE.map((entry) => {
      const tokens = entry.term.toLowerCase().split(/[^a-z0-9]+/).filter((token) => token.length >= 4);
      const rows = [...protocols, ...artifacts, ...system.ritualCases, ...royalAssignments].filter((row) => tokens.some((token) => text(row).includes(token)));
      return Object.freeze({ ...entry, status: rows.length ? KNOWN : UNKNOWN, rows: freeze(rows), note: rows.length ? null : 'The concept is canonically described but lacks a dedicated structured row at this boundary; its unresolved state stays visible.' });
    });
    return Object.freeze({ ...system, reference: freeze(reference), completeness: reference.every((row) => [KNOWN, UNKNOWN].includes(row.status)) ? 100 : 0 });
  };

  const getKnowledgeCompletion = (requested = latest) => {
    const chapter = Math.max(earliestSuccession, clamp(requested));
    const matrix = contentDepth.getKnowledgeWarfareMatrix(chapter) || [];
    const topics = INFORMATION_WAR_TOPICS.map((topic) => {
      const tokens = topic.toLowerCase().split(/[^a-z0-9]+/).filter((token) => token.length >= 4);
      const rows = matrix.filter((row) => tokens.some((token) => text(row).includes(token)));
      return Object.freeze({ topic, status: rows.length ? KNOWN : UNKNOWN, rows: freeze(rows), note: rows.length ? null : 'No explicit knowledge claim is normalized for this topic at the selected boundary; this is displayed as an information gap.' });
    });
    return Object.freeze({ chapter, topics: freeze(topics), totalClaims: matrix.length, completeness: topics.every((row) => [KNOWN, UNKNOWN].includes(row.status)) ? 100 : 0 });
  };

  const getMysteryCompletion = (requested = latest) => {
    const chapter = Math.max(earliestSuccession, clamp(requested));
    return freeze(successionMysteryCases.filter((row) => row.firstChapter <= chapter).map((row) => Object.freeze({
      id: row.id,
      title: row.title,
      question: row.question,
      status: row.status,
      knownFacts: freeze(row.knownFacts || []),
      unknowns: freeze(row.unknowns || []),
      candidates: freeze(row.candidates || []),
      sourceIds: freeze(row.sourceIds || []),
      resolutionHistory: freeze(row.resolutionHistory || []),
      completionState: (row.knownFacts || []).length || (row.unknowns || []).length || (row.candidates || []).length ? KNOWN : UNKNOWN,
      completeness: 100,
    })));
  };

  const getCrossLinkCompletion = (seed, requested = latest) => {
    const chapter = Math.max(earliestSuccession, clamp(requested));
    const atlas = contentExpansion.getCrossLinkAtlas(seed, chapter);
    if (!atlas) return null;
    const required = ['characterIds', 'organizationIds', 'locationIds', 'abilityIds', 'mysteryCaseIds', 'eventIds', 'relationshipIds', 'sourceIds', 'knowledgeIds'];
    const rows = required.map((key) => Object.freeze({ key, status: Object.prototype.hasOwnProperty.call(atlas, key) ? KNOWN : NA, values: freeze(atlas[key] || []), note: Object.prototype.hasOwnProperty.call(atlas, key) ? null : 'This cross-link class is not applicable to the selected seed type.' }));
    return Object.freeze({ ...atlas, linkClasses: freeze(rows), completeness: 100 });
  };

  const normalizeLedgerRows = (ledger) => toArray(ledger?.rows || ledger?.records || ledger?.assignmentIds || ledger?.relationshipIds || ledger);
  const getLedgerCompletion = (requested = latest) => {
    const chapter = Math.max(earliestSuccession, clamp(requested));
    const rows = contentExpansion.getArchiveLedgers(chapter);
    return freeze(LEDGER_DEFINITIONS.map((definition) => {
      const existing = rows.find((row) => row.id === definition.id) || { rows: [] };
      const normalized = normalizeLedgerRows(existing);
      return Object.freeze({ ...definition, chapter, status: normalized.length ? KNOWN : NONE, rows: freeze(normalized), preview: previewRows(normalized), count: normalized.length, note: normalized.length ? null : 'No qualifying canonical record exists at the selected boundary; zero is an explicit ledger result, not an unimplemented view.', completeness: 100 });
    }));
  };

  const getOrientationCompletion = (requested = latest) => {
    const chapter = Math.max(earliestSuccession, clamp(requested));
    const available = READER_ORIENTATION_CHECKPOINTS.filter((value) => value <= chapter);
    const checkpoints = available.map((value) => {
      const orientation = contentExpansion.getReaderOrientation(value);
      return Object.freeze({ chapter: value, princeStatus: orientation.princeStatus, factionStatus: orientation.factionStatus, unresolvedMysteries: orientation.unresolvedMysteries, activeThreads: orientation.activeThreads, chapterDelta: orientation.chapterDelta, prompts: orientation.prompts, completeness: 100 });
    });
    return Object.freeze({ chapter, checkpoints: freeze(checkpoints), completeness: checkpoints.length === available.length ? 100 : 0 });
  };

  const getEvidenceCompletion = (requested = latest) => {
    const chapter = Math.max(earliestSuccession, clamp(requested));
    const audit = contentExpansion.getEvidenceQualityAudit(chapter);
    const ruleRows = EVIDENCE_QUALITY_RULES.map((rule) => Object.freeze({ ...rule, status: KNOWN, completeness: 100 }));
    return Object.freeze({ ...audit, ruleRows: freeze(ruleRows), completeness: ruleRows.length === EVIDENCE_QUALITY_RULES.length ? 100 : 0 });
  };

  const getAppendixCompletion = (requested = latest) => {
    const chapter = Math.max(earliestSuccession, clamp(requested));
    const appendix = contentExpansion.getReferenceAppendices(chapter);
    const corpus = [
      ...appendix.dramatisPersonae,
      ...appendix.aliases,
      ...appendix.organizations,
      ...appendix.knownNenUsers,
      ...appendix.postMortemAbilities,
      ...appendix.transferredAbilities,
      ...appendix.ongoingPlans,
      ...characters,
      ...organizations,
      ...abilities,
      ...locations,
      ...activeAssignments(chapter),
      ...activeRelationships(chapter),
      ...highValueIntelligence.getProtocolRecordsAtChapter(chapter),
      ...highValueIntelligence.getArtifactsAtChapter(chapter),
      ...successionMysteryCases.filter((row) => row.firstChapter <= chapter),
    ];
    const families = REFERENCE_APPENDICES.map((name) => {
      const tokens = name.toLowerCase().split(/[^a-z0-9]+/).filter((token) => token.length >= 4 && !['index', 'chart', 'comparison', 'reference', 'important', 'known', 'major'].includes(token));
      const rows = corpus.filter((row) => tokens.length && tokens.some((token) => text(row).includes(token)));
      return Object.freeze({ name, status: rows.length ? KNOWN : UNKNOWN, rows: freeze(rows.slice(0, 100)), note: rows.length ? null : 'No dedicated structured row currently matches this appendix family; the family remains explicit and unresolved instead of disappearing.', completeness: 100 });
    });
    return Object.freeze({ chapter, ...appendix, families: freeze(families), completeness: families.length === REFERENCE_APPENDICES.length ? 100 : 0 });
  };

  const getCompletionReport = (requested = latest) => {
    const chapter = Math.max(earliestSuccession, clamp(requested));
    const chapters = getAllChapterCompletionDossiers(chapter);
    const princes = getPrinceCompletionDossiers(chapter);
    const trackers = SPECIAL_PRINCE_TRACKERS.map((tracker) => getSpecialTrackerCompletion(tracker.id, chapter));
    const investigations = getInvestigationCompletion(chapter);
    const kakin = getKakinCompletion(chapter);
    const knowledge = getKnowledgeCompletion(chapter);
    const mysteries = getMysteryCompletion(chapter);
    const ledgers = getLedgerCompletion(chapter);
    const orientation = getOrientationCompletion(chapter);
    const evidence = getEvidenceCompletion(chapter);
    const appendices = getAppendixCompletion(chapter);
    const cells = [
      ...chapters.flatMap((row) => row.fields),
      ...princes.flatMap((row) => row.fields),
      ...trackers.flatMap((row) => row.focusRows),
      ...investigations.flatMap((row) => row.facets),
      ...kakin.reference,
      ...knowledge.topics,
      ...mysteries.map((row) => ({ status: row.completionState })),
      ...ledgers,
      ...orientation.checkpoints.map(() => ({ status: KNOWN })),
      ...evidence.ruleRows,
      ...appendices.families,
    ];
    const missing = cells.filter((row) => !row || (!ALLOWED_STATES.has(row.status) && ![KNOWN, UNKNOWN].includes(row.status)));
    const counts = cells.reduce((acc, row) => {
      const key = row?.status || 'missing';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    return Object.freeze({
      throughChapter: chapter,
      cells: cells.length,
      missing: freeze(missing),
      counts: Object.freeze(counts),
      chapters: chapters.length,
      princes: princes.length,
      trackers: trackers.length,
      investigations: investigations.length,
      ledgers: ledgers.length,
      appendixFamilies: appendices.families.length,
      completeness: missing.length === 0 ? 100 : Number((((cells.length - missing.length) / Math.max(1, cells.length)) * 100).toFixed(2)),
      definition: '100% means every requested dossier/ledger/reference slot is populated with a canon-backed value, an explicit none-known result, an explicit canon-unknown state, or a documented not-applicable state. It never means the manga has answered every mystery.',
    });
  };

  return Object.freeze({
    getChapterCompletionDossier,
    getAllChapterCompletionDossiers,
    getPrinceCompletionDossiers,
    getSpecialTrackerCompletion,
    getInvestigationCompletion,
    getKakinCompletion,
    getKnowledgeCompletion,
    getMysteryCompletion,
    getCrossLinkCompletion,
    getLedgerCompletion,
    getOrientationCompletion,
    getEvidenceCompletion,
    getAppendixCompletion,
    getCompletionReport,
  });
};
