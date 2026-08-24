import { useMemo } from 'react';
import { BookOpen, CheckCircle2, CircleHelp, Network, ShieldCheck, Users } from 'lucide-react';
import {
  getAppendixCompletion,
  getChapterCompletionDossier,
  getCrossLinkCoverage,
  getEvidenceCompletion,
  getGlossaryCompletion,
  getInvestigationCompletion,
  getKakinCompletion,
  getKnowledgeCompletion,
  getLedgerCompletion,
  getMysteryCompletion,
  getNenCompletion,
  getOrientationCompletion,
  getPrinceCompletionDossiers,
  getSpecialTrackerCompletion,
} from '../../data/succession/contentCompletion';
import './SuccessionContextualCompletion.css';

const STATUS_LABELS = Object.freeze({
  known: 'Known',
  'none-known': 'None known',
  'canon-unknown': 'Canon unknown',
  'not-applicable': 'N/A',
});

const clampChapter = (value) => Math.min(417, Math.max(340, Number(value) || 417));
const normalize = (value) => String(value || '').trim().toLowerCase();
const slug = (value) => normalize(value).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const isPlainObject = (value) => value && typeof value === 'object' && !Array.isArray(value);

const displayPrimitive = (value) => {
  if (value === true) return 'Yes';
  if (value === false) return 'No';
  if (value == null || value === '') return null;
  return String(value);
};

function StatusBadge({ status = 'known' }) {
  const Icon = status === 'known' ? CheckCircle2 : CircleHelp;
  return <span className={`succession-contextual-status is-${status}`}><Icon size={13} aria-hidden="true" />{STATUS_LABELS[status] || status}</span>;
}

function Value({ value, limit = 18 }) {
  if (value == null || value === '') return null;
  if (Array.isArray(value)) {
    if (!value.length) return null;
    return <ul>{value.slice(0, limit).map((entry, index) => <li key={`${index}-${isPlainObject(entry) ? entry.id || entry.name || entry.title || 'row' : String(entry)}`}><Value value={entry} limit={8} /></li>)}</ul>;
  }
  if (isPlainObject(value)) {
    const label = value.name || value.title || value.label || value.term || value.id;
    if (label) {
      const extras = Object.entries(value)
        .filter(([key, item]) => !['id', 'name', 'title', 'label', 'term', 'entityType'].includes(key) && item != null && item !== '' && !Array.isArray(item) && typeof item !== 'object')
        .slice(0, 3);
      return <span><strong>{label}</strong>{extras.length ? ` · ${extras.map(([key, item]) => `${key}: ${item}`).join(' · ')}` : ''}</span>;
    }
    return <code>{JSON.stringify(value)}</code>;
  }
  return <span>{displayPrimitive(value)}</span>;
}

function CompletionField({ item, compact = false }) {
  const status = item.status || item.completionState || 'known';
  const value = item.value ?? item.rows ?? item.knownFacts ?? item.preview;
  return <article className={`succession-contextual-field${compact ? ' is-compact' : ''}`}>
    <header><h4>{item.label || item.focus || item.facet || item.topic || item.name || item.term || item.key}</h4><StatusBadge status={status} /></header>
    <Value value={value} />
    {item.note && <p>{item.note}</p>}
    {!!item.sourceRefs?.length && <small>Sources: {item.sourceRefs.slice(0, 8).join(' · ')}</small>}
  </article>;
}

function FieldGrid({ fields, compact = false }) {
  return <div className="succession-contextual-grid">{fields.map((item, index) => <CompletionField item={item} compact={compact} key={item.id || item.label || item.focus || item.facet || item.topic || item.name || item.term || item.key || index} />)}</div>;
}

function Surface({ kicker, title, description, children, icon: Icon = ShieldCheck, className = '' }) {
  return <section className={`succession-contextual-completion ${className}`}>
    <header className="succession-contextual-completion__header">
      <div><span><Icon size={14} aria-hidden="true" />{kicker}</span><h2>{title}</h2><p>{description}</p></div>
    </header>
    {children}
  </section>;
}

const fieldByLabel = (dossier, label) => dossier?.fields?.find((item) => item.label === label);
const pickFields = (dossier, labels) => labels.map((label) => fieldByLabel(dossier, label)).filter(Boolean);

const chapterHighlights = Object.freeze([
  'why the chapter matters',
  'what changed since previous chapter',
  'story day / voyage chronology',
  'scene locations',
  'scene participants',
  'new abilities',
  'new Nen rules',
  'deaths',
  'injuries',
  'body / identity / consciousness changes',
  'curses applied or removed',
  'new questions',
  'resolved questions',
  'older mysteries affected',
]);

const princeHighlights = Object.freeze([
  'current life status',
  'body state',
  'identity state',
  'consciousness state',
  'current location',
  'last confirmed appearance',
  'current objective',
  'known allies',
  'enemies',
  'active threats',
  'information possessed',
  'missing information',
  'Nen knowledge',
  'personal abilities',
  'aura / training state',
  'Guardian Spirit Beast',
  'curse exposure',
  'political leverage',
  'largest vulnerability',
  'largest unknown',
]);

function ChapterSurface({ chapter }) {
  const dossier = useMemo(() => getChapterCompletionDossier(chapter), [chapter]);
  if (!dossier) return null;
  const title = fieldByLabel(dossier, 'official title')?.value;
  return <Surface kicker="Integrated chapter forensics" title={`Chapter ${chapter}${title ? ` · ${title}` : ''}`} description="The forensic research fields now live with the normal chapter experience. Confirmed facts, confirmed absences, and publication-bounded unknowns stay visibly distinct." icon={BookOpen}>
    <FieldGrid fields={pickFields(dossier, chapterHighlights)} />
    <details className="succession-contextual-details">
      <summary>Open all {dossier.fields.length} chapter forensic fields <b>{dossier.completeness}% classified</b></summary>
      <FieldGrid fields={dossier.fields} />
    </details>
  </Surface>;
}

const dossierMatchesRoute = (dossier, routeParams) => {
  const order = Number(routeParams.prince || routeParams.order);
  if (order && Number(dossier.order) === order) return true;
  const entity = normalize(routeParams.entity || routeParams.character || routeParams.id);
  if (entity && normalize(dossier.prince?.id) === entity) return true;
  const name = normalize(routeParams.name);
  return Boolean(name && normalize(dossier.prince?.name).includes(name));
};

function PrinceSurface({ chapter, routeParams, onNavigate }) {
  const dossiers = useMemo(() => getPrinceCompletionDossiers(chapter), [chapter]);
  const selected = dossiers.find((dossier) => dossierMatchesRoute(dossier, routeParams));
  if (!selected) {
    return <Surface kicker="Integrated royal dossiers" title="All fourteen princes now carry the deep evidence schema" description="Open a prince to see current state, objective, knowledge, Nen, Guardian Spirit Beast mechanics, security, threats, curses, leverage, and unresolved questions in the same normal Royal Family route." icon={Users}>
      <div className="succession-contextual-prince-index">{dossiers.map((dossier) => <button type="button" key={dossier.prince.id} onClick={() => onNavigate?.('princes', { prince: dossier.order })}><span>Prince {dossier.order}</span><strong>{dossier.prince.name}</strong><small>{fieldByLabel(dossier, 'current life status')?.value || 'State unresolved'} · {dossier.completeness}% classified</small></button>)}</div>
    </Surface>;
  }

  const tracker = selected.tracker?.id ? getSpecialTrackerCompletion(selected.tracker.id, chapter) : null;
  return <Surface kicker="Integrated prince dossier" title={`${selected.prince.name} · Prince ${selected.order}`} description="The audit-backed prince record is now attached to the normal Royal Family page instead of living only in Research → Depth." icon={Users}>
    <FieldGrid fields={pickFields(selected, princeHighlights)} />
    {tracker && <section className="succession-contextual-subsection"><header><span>Prince-specific tracker</span><h3>{tracker.label}</h3><p>{tracker.canonicalFrame}</p></header><FieldGrid fields={tracker.focusRows} /></section>}
    <details className="succession-contextual-details"><summary>Open all {selected.fields.length} prince dossier fields <b>{selected.completeness}% classified</b></summary><FieldGrid fields={selected.fields} /></details>
  </Surface>;
}

function InvestigationCard({ investigation }) {
  return <article className="succession-contextual-investigation">
    <header><div><span>Investigation file</span><h3>{investigation.label}</h3></div><b>{investigation.completeness}%</b></header>
    <p>{investigation.rule}</p>
    <small>{investigation.evidence.length} evidence / record hooks</small>
    <FieldGrid fields={investigation.facets} compact />
  </article>;
}

function ResearchSurface({ chapter }) {
  const investigations = useMemo(() => getInvestigationCompletion(chapter), [chapter]);
  const mysteries = useMemo(() => getMysteryCompletion(chapter), [chapter]);
  const evidence = useMemo(() => getEvidenceCompletion(chapter), [chapter]);
  return <Surface kicker="Integrated investigation desk" title="Mysteries and investigations now expose the evidence beneath the label" description="Silent Majority, Beyond, Troupe/Hisoka, mafia, and the broader mystery register are surfaced directly in the normal Research route." icon={ShieldCheck}>
    <div className="succession-contextual-investigations">{investigations.map((investigation) => <InvestigationCard investigation={investigation} key={investigation.id} />)}</div>
    <details className="succession-contextual-details"><summary>Open {mysteries.length} tracked mystery evidence files <b>Known / unknown / candidate split</b></summary><div className="succession-contextual-mysteries">{mysteries.map((mystery) => <article key={mystery.id}><header><h4>{mystery.title}</h4><StatusBadge status={mystery.completionState} /></header><p>{mystery.question}</p><div><b>Known</b><Value value={mystery.knownFacts} /></div><div><b>Unknown</b><Value value={mystery.unknowns} /></div><div><b>Candidates</b><Value value={mystery.candidates} /></div></article>)}</div></details>
    <section className="succession-contextual-subsection"><header><span>Evidence discipline</span><h3>{evidence.totalRecords} records audited through Chapter {chapter}</h3><p>Unsourced: {evidence.unsourced.length} · inference/theory: {evidence.inferenceOrTheory.length} · explicit unknowns: {evidence.explicitUnknowns.length} · stale boundaries: {evidence.staleReviewBoundary.length}</p></header><FieldGrid fields={evidence.ruleRows} compact /></section>
  </Surface>;
}

function OrganizationsSurface({ chapter }) {
  const investigations = useMemo(() => getInvestigationCompletion(chapter), [chapter]);
  const selected = investigations.filter((row) => ['mafia-war', 'troupe-hisoka', 'beyond-network'].includes(row.id));
  return <Surface kicker="Operational intelligence" title="Faction pages now carry the live investigations around them" description="Mafia hierarchy and balance-of-power questions, the Troupe/Hisoka hunt, and Beyond's hidden network are attached to the normal organization layer." icon={Network}>
    <div className="succession-contextual-investigations">{selected.map((investigation) => <InvestigationCard investigation={investigation} key={investigation.id} />)}</div>
  </Surface>;
}

function NenSurface({ chapter, encyclopedia = false }) {
  const nen = useMemo(() => getNenCompletion(), []);
  const kakin = useMemo(() => getKakinCompletion(chapter), [chapter]);
  const knowledge = useMemo(() => getKnowledgeCompletion(chapter), [chapter]);
  const systemRows = kakin.reference.filter((row) => /nen|guardian|seed urn|ritual/i.test(`${row.term} ${row.category} ${row.summary}`));
  return <Surface kicker={encyclopedia ? 'General Nen reference' : 'Integrated Nen depth'} title={`${nen.count} normalized Nen system and ability records`} description={encyclopedia ? 'The general Nen route now exposes the normalized mechanics, study notes, relationships, and source state beneath the visual map.' : 'The normal Succession Nen route now links the general system reference with Seed Urn, Guardian Spirit Beast, ritual, and information-war context.'} icon={ShieldCheck}>
    {!encyclopedia && <><section className="succession-contextual-subsection"><header><span>Kakin Nen system</span><h3>Ritual and Guardian Spirit Beast reference</h3></header><FieldGrid fields={systemRows.map((row) => ({ ...row, label: row.term }))} /></section><details className="succession-contextual-details"><summary>Open information-war topics involving Nen <b>{knowledge.totalClaims} knowledge claims</b></summary><FieldGrid fields={knowledge.topics.filter((row) => /nen|guardian|seed urn|contagion|future sight|curse/i.test(row.topic))} /></details></>}
    <div className="succession-contextual-nen-records">{nen.records.map((record) => <article key={record.id}><header><h3>{record.name}</h3><StatusBadge status={record.status} /></header><FieldGrid fields={record.fields.map((item) => ({ ...item, label: item.field }))} compact /></article>)}</div>
  </Surface>;
}

function GlossarySurface({ chapter }) {
  const glossary = useMemo(() => getGlossaryCompletion(chapter), [chapter]);
  return <Surface kicker="Extended canonical vocabulary" title={`${glossary.count} chapter-bounded terms with explicit evidence state`} description="The normal glossary now exposes synonyms, first-chapter boundaries, related records, and missing source/definition fields instead of hiding incomplete vocabulary." icon={BookOpen}>
    <div className="succession-contextual-glossary">{glossary.records.map((record) => <article key={record.id}><header><h3>{record.term}</h3><StatusBadge status={record.status} /></header><FieldGrid fields={record.fields.map((item) => ({ ...item, label: item.field }))} compact /></article>)}</div>
  </Surface>;
}

function RecordsSurface({ chapter, routeTarget }) {
  const ledgers = useMemo(() => getLedgerCompletion(chapter), [chapter]);
  const crossLinks = useMemo(() => getCrossLinkCoverage(chapter), [chapter]);
  const appendices = useMemo(() => getAppendixCompletion(chapter), [chapter]);
  const relevant = routeTarget === 'relationships'
    ? ledgers.filter((row) => /alliance|betray|contract|order|information|deception/i.test(`${row.id} ${row.label}`))
    : ledgers.filter((row) => /death|injury|missing|body|curse|assassination|awakening|training/i.test(`${row.id} ${row.label}`));
  return <Surface kicker="Connected records" title={`${relevant.length} contextual ledgers · ${crossLinks.count} graph-checked entities`} description="Operational ledgers and graph coverage now sit beside the normal record routes, making state changes and relationships easier to trace without opening the completion console." icon={Network}>
    <FieldGrid fields={relevant.map((row) => ({ ...row, value: row.preview }))} />
    <details className="succession-contextual-details"><summary>Open reference appendix families <b>{appendices.families.length} families</b></summary><FieldGrid fields={appendices.families.map((row) => ({ ...row, label: row.name, value: row.rows?.slice(0, 12) }))} compact /></details>
  </Surface>;
}

function StorySurface({ chapter }) {
  const orientation = useMemo(() => getOrientationCompletion(chapter), [chapter]);
  const dossier = useMemo(() => getChapterCompletionDossier(chapter), [chapter]);
  const latest = orientation.checkpoints.at(-1);
  return <Surface kicker="Story orientation" title={`What matters through Chapter ${chapter}`} description="Current-state reminders and chapter deltas are surfaced with the normal Story/Timeline experience so readers do not have to detour into Research → Depth." icon={BookOpen}>
    <FieldGrid fields={pickFields(dossier, ['why the chapter matters', 'what changed since previous chapter', 'immediate consequences', 'delayed consequences', 'older mysteries affected'])} />
    {latest && <details className="succession-contextual-details"><summary>Open reader-orientation checkpoint <b>Chapter {latest.chapter}</b></summary><FieldGrid fields={[
      { label: 'Prince status', status: 'known', value: latest.princeStatus },
      { label: 'Faction status', status: 'known', value: latest.factionStatus },
      { label: 'Unresolved mysteries', status: 'known', value: latest.unresolvedMysteries },
      { label: 'Active threads', status: 'known', value: latest.activeThreads },
      { label: 'Chapter delta', status: 'known', value: latest.chapterDelta },
    ]} /></details>}
  </Surface>;
}

export default function SuccessionContextualCompletion({
  routeTarget,
  routeParams = {},
  spoilerLimit = 417,
  onNavigate,
  encyclopedia = false,
}) {
  const chapter = clampChapter(routeParams.chapter || routeParams.focus || routeParams.to || spoilerLimit);

  if (encyclopedia) return <NenSurface chapter={chapter} encyclopedia />;
  if (routeTarget === 'chapters') return <ChapterSurface chapter={chapter} />;
  if (routeTarget === 'princes') return <PrinceSurface chapter={chapter} routeParams={routeParams} onNavigate={onNavigate} />;
  if (routeTarget === 'research') return <ResearchSurface chapter={chapter} />;
  if (routeTarget === 'organizations') return <OrganizationsSurface chapter={chapter} />;
  if (routeTarget === 'nen' || routeTarget === 'guardian-spirit-beasts') return <NenSurface chapter={chapter} />;
  if (routeTarget === 'glossary') return <GlossarySurface chapter={chapter} />;
  if (routeTarget === 'events' || routeTarget === 'relationships') return <RecordsSurface chapter={chapter} routeTarget={routeTarget} />;
  if (routeTarget === 'story' || routeTarget === 'timeline') return <StorySurface chapter={chapter} />;
  return null;
}
