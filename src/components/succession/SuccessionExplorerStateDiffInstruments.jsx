import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowRight,
  BookOpenCheck,
  ChevronRight,
  CircleAlert,
  FileCheck2,
  FileQuestion,
  GitCompareArrows,
  History,
  Network,
  ShieldCheck,
  UserRoundSearch,
} from 'lucide-react';
import {
  getCharacterAffiliationsAtChapter,
  getCharacterRoleProfile,
  getCharacterStateAtChapter,
  getCharacterStateTimeline,
  getChapterStateDiff,
  getClaimProvenanceProfile,
  getEntityById,
  getProvenanceCoverageReport,
} from '../../data/succession/successionData';
import { useSuccessionExplorer } from './SuccessionExplorerState';
import './SuccessionExplorerStateDiffInstruments.css';

const MIN_CHAPTER = 340;
const safe = (factory, fallback = null) => {
  try { return factory(); } catch { return fallback; }
};
const entityLabel = (entity) => entity?.name || entity?.title || entity?.term || entity?.label || entity?.id || 'Unknown';
const labelize = (value) => String(value || 'unknown').replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
const compact = (value, max = 170) => {
  if (value == null || value === '') return '—';
  const string = typeof value === 'string'
    ? value
    : Array.isArray(value)
      ? value.map((item) => typeof item === 'string' ? item : JSON.stringify(item)).join(' · ')
      : typeof value === 'object'
        ? JSON.stringify(value)
        : String(value);
  return string.length > max ? `${string.slice(0, max - 1)}…` : string;
};
const stable = (value) => JSON.stringify(value ?? null);
const rangeEnd = (record, boundary) => Math.min(boundary, Number(record?.chapterRange?.end ?? boundary) || boundary);

function Frame({ eyebrow, title, description, icon: Icon, children, className = '' }) {
  return <section className={`succession-explorer-state-instrument ${className}`.trim()}>
    <header className="succession-explorer-state-instrument__head">
      <div>
        <span>{eyebrow}</span>
        <h3><Icon size={19} aria-hidden="true" /> {title}</h3>
        <p>{description}</p>
      </div>
    </header>
    {children}
  </section>;
}

const characterDimensions = [
  ['life', 'Life'],
  ['bodyState', 'Body'],
  ['consciousnessState', 'Consciousness'],
  ['operationalState', 'Operational state'],
  ['protectionState', 'Protection'],
  ['threatLevel', 'Threat'],
  ['nenKnowledge', 'Nen knowledge'],
  ['allegianceState', 'Allegiance'],
];

export function CharacterStateEvolutionInstrument({ chapter, onNavigate }) {
  const explorer = useSuccessionExplorer();
  const character = explorer.selectedIds.map(getEntityById).find((entity) => entity?.entityType === 'character')
    || explorer.compareIds.map(getEntityById).find((entity) => entity?.entityType === 'character');
  const timeline = useMemo(() => character
    ? safe(() => getCharacterStateTimeline(character.id), []).filter((record) => Number(record.chapterRange?.start || 0) <= chapter)
    : [], [chapter, character]);
  const current = useMemo(() => character ? safe(() => getCharacterStateAtChapter(character.id, chapter), null) : null, [chapter, character]);
  const affiliations = useMemo(() => character ? safe(() => getCharacterAffiliationsAtChapter(character.id, chapter), []) : [], [chapter, character]);
  const role = useMemo(() => character ? safe(() => getCharacterRoleProfile(character.id, chapter), null) : null, [chapter, character]);
  const span = Math.max(1, chapter - MIN_CHAPTER + 1);

  if (!character) return <Frame
    eyebrow="Temporal dossier"
    title="Select a character to inspect state evolution"
    description="This instrument follows explicit character-state records across chapter ranges. Event participation is kept separate so activity does not masquerade as a state change."
    icon={UserRoundSearch}
    className="succession-explorer-state-instrument--character"
  ><p className="succession-explorer-state-instrument__empty">Choose a character in the Human Atlas or comparison tray.</p></Frame>;

  return <Frame
    eyebrow="Temporal dossier"
    title={`${entityLabel(character)} · state evolution`}
    description="Each ribbon comes from the structured character-state timeline. The selected-chapter snapshot may be derived where no explicit override exists, and that distinction remains visible."
    icon={History}
    className="succession-explorer-state-instrument--character"
  >
    <div className="succession-explorer-character-state__now">
      <section>
        <span>Chapter {chapter} state</span>
        <strong>{current?.derived ? 'Derived chapter snapshot' : 'Explicit state record'}</strong>
        <p>{current?.operationalState || character.summary}</p>
      </section>
      <dl>
        <div><dt>Life</dt><dd>{labelize(current?.life)}</dd></div>
        <div><dt>Body</dt><dd>{compact(current?.bodyState, 70)}</dd></div>
        <div><dt>Consciousness</dt><dd>{compact(current?.consciousnessState, 70)}</dd></div>
        <div><dt>Role layer</dt><dd>{role?.label || 'Unclassified'}</dd></div>
        <div><dt>Affiliations</dt><dd>{affiliations.length}</dd></div>
        <div><dt>Certainty</dt><dd>{labelize(current?.certainty)}</dd></div>
      </dl>
    </div>

    {!!timeline.length && <div className="succession-explorer-character-state__timeline" aria-label={`${entityLabel(character)} explicit state timeline`}>
      <header><Activity size={15} aria-hidden="true" /><div><span>Explicit state ribbons</span><strong>{timeline.length} chapter-bounded records</strong></div></header>
      {timeline.map((record, index) => {
        const previous = timeline[index - 1] || null;
        const start = Number(record.chapterRange?.start || MIN_CHAPTER);
        const end = rangeEnd(record, chapter);
        const left = Math.max(0, ((start - MIN_CHAPTER) / span) * 100);
        const width = Math.max(1.3, ((end - start + 1) / span) * 100);
        const changes = previous
          ? characterDimensions.filter(([key]) => stable(previous[key]) !== stable(record[key])).map(([, label]) => label)
          : characterDimensions.filter(([key]) => record[key] != null).map(([, label]) => label);
        const location = record.locationId ? getEntityById(record.locationId) : null;
        return <article className={start <= chapter && end >= chapter ? 'is-current' : ''} key={record.id}>
          <button type="button" className="succession-explorer-character-state__range" onClick={() => explorer.setChapter(start)} aria-label={`Jump to Chapter ${start}`}>
            <span>CH. {start}{record.chapterRange?.end != null ? `–${record.chapterRange.end}` : '+'}</span>
            <i><b style={{ left: `${left}%`, width: `${Math.min(100 - left, width)}%` }} /></i>
          </button>
          <div className="succession-explorer-character-state__record">
            <div>
              <span>{labelize(record.certainty)}{record.derived ? ' · derived' : ''}</span>
              <strong>{record.operationalState || 'State record'}</strong>
              <small>{location ? `Location: ${entityLabel(location)}` : 'No explicit location on this state record'}</small>
            </div>
            <dl>{characterDimensions.slice(0, 6).map(([key, label]) => <div key={key}><dt>{label}</dt><dd>{compact(record[key], 105)}</dd></div>)}</dl>
            <footer>{changes.length
              ? changes.map((label) => <span key={label}>{label} changed</span>)
              : <span>No tracked dimension changed from the prior explicit record</span>}</footer>
          </div>
        </article>;
      })}
    </div>}

    {!timeline.length && <div className="succession-explorer-character-state__derived-only"><CircleAlert size={17} /><div><strong>No explicit state ribbon before Chapter {chapter}</strong><p>The snapshot above is derived from canonical status, location, affiliations and other chapter-bounded selectors. No synthetic transition is inserted into the timeline.</p></div></div>}

    <footer className="succession-explorer-state-instrument__footer">
      <button type="button" onClick={() => onNavigate?.('characters', explorer.buildDeepLinkParams('characters', { entity: character.id, chapter }))}>Open complete dossier <ChevronRight size={13} /></button>
    </footer>
  </Frame>;
}

export function ChapterStateDiffInstrument({ chapter }) {
  const explorer = useSuccessionExplorer();
  const [fromChapter, setFromChapter] = useState(Math.max(MIN_CHAPTER, chapter - 1));
  useEffect(() => {
    setFromChapter((current) => Math.min(Math.max(MIN_CHAPTER, current), Math.max(MIN_CHAPTER, chapter - 1)));
  }, [chapter]);
  const diff = useMemo(() => safe(() => getChapterStateDiff(fromChapter, chapter, { changedOnly: true }), null), [chapter, fromChapter]);
  const byType = useMemo(() => Object.entries(diff?.summary?.byType || {})
    .map(([type, counts]) => ({ type, counts, total: (counts.added || 0) + (counts.changed || 0) + (counts.removed || 0) }))
    .filter((row) => row.total)
    .sort((left, right) => right.total - left.total || left.type.localeCompare(right.type)), [diff]);
  const maxType = Math.max(1, ...byType.map((row) => row.total));

  return <Frame
    eyebrow="State difference engine"
    title={`Chapter ${fromChapter} → ${chapter}`}
    description="The diff asks the archive for each entity state at two chapter boundaries and removes unchanged records. Added, removed and changed therefore mean selector-level state differences, not editorial guesses."
    icon={GitCompareArrows}
    className="succession-explorer-state-instrument--diff"
  >
    <div className="succession-explorer-chapter-diff__controls">
      <label><span>Compare from</span><input type="number" min={MIN_CHAPTER} max={Math.max(MIN_CHAPTER, chapter - 1)} value={fromChapter} onChange={(event) => setFromChapter(Math.min(Math.max(MIN_CHAPTER, Number(event.target.value) || MIN_CHAPTER), Math.max(MIN_CHAPTER, chapter - 1)))} /></label>
      <div>
        {[1, 5, 10, 20].map((distance) => <button type="button" onClick={() => setFromChapter(Math.max(MIN_CHAPTER, chapter - distance))} key={distance}>−{distance}</button>)}
        <button type="button" onClick={() => setFromChapter(MIN_CHAPTER)}>Arc start</button>
      </div>
    </div>

    {diff && <>
      <dl className="succession-explorer-chapter-diff__summary">
        <div><dt>Changed records</dt><dd>{diff.summary.total}</dd></div>
        <div className="is-added"><dt>Added</dt><dd>{diff.summary.added}</dd></div>
        <div className="is-changed"><dt>Modified</dt><dd>{diff.summary.changed}</dd></div>
        <div className="is-removed"><dt>Removed</dt><dd>{diff.summary.removed}</dd></div>
        <div><dt>Direction</dt><dd>{labelize(diff.direction)}</dd></div>
      </dl>

      <section className="succession-explorer-chapter-diff__types">
        <header><BookOpenCheck size={15} aria-hidden="true" /><div><span>Change volume by canonical type</span><strong>{byType.length} affected domains</strong></div></header>
        <div>{byType.map((row) => <article key={row.type}><span>{labelize(row.type)}</span><i><b style={{ width: `${Math.max(3, row.total / maxType * 100)}%` }} /></i><strong>{row.total}</strong><small>{row.counts.added || 0} + · {row.counts.changed || 0} Δ · {row.counts.removed || 0} −</small></article>)}</div>
      </section>

      <section className="succession-explorer-chapter-diff__ledger">
        <header><Network size={15} aria-hidden="true" /><div><span>Changed entity ledger</span><strong>{diff.records.length} records, unchanged hidden</strong></div></header>
        <div>{diff.records.map((record) => {
          const entity = getEntityById(record.entity.id);
          return <details className={`is-${record.status}`} key={record.entity.id}>
            <summary>
              <span>{labelize(record.entity.entityType)}</span>
              <strong>{record.entity.name}</strong>
              <small>{labelize(record.status)}{record.deltas?.length ? ` · ${record.deltas.length} field changes` : ''}</small>
              <ChevronRight size={14} aria-hidden="true" />
            </summary>
            <div>
              {record.status === 'changed' && record.deltas.map((delta) => <article key={delta.key}>
                <span>{delta.label}</span>
                <div><small>Before</small><p>{compact(delta.before)}</p></div>
                <ArrowRight size={13} aria-hidden="true" />
                <div><small>After</small><p>{compact(delta.after)}</p></div>
              </article>)}
              {record.status === 'added' && <article><span>State introduced</span><div><small>Before</small><p>Not available</p></div><ArrowRight size={13} /><div><small>After</small><p>{compact(record.after)}</p></div></article>}
              {record.status === 'removed' && <article><span>State removed</span><div><small>Before</small><p>{compact(record.before)}</p></div><ArrowRight size={13} /><div><small>After</small><p>Not available</p></div></article>}
              {entity && <button type="button" onClick={() => explorer.selectEntity(entity.id, { routeId: 'chapters', chapter, label: entityLabel(entity) })}>Inspect {entityLabel(entity)} <ChevronRight size={12} /></button>}
            </div>
          </details>;
        })}</div>
      </section>
    </>}
  </Frame>;
}

export function ResearchEvidenceTopologyInstrument({ chapter }) {
  const explorer = useSuccessionExplorer();
  const selected = explorer.selectedIds.map(getEntityById).find((entity) => entity && entity.entityType !== 'source')
    || explorer.compareIds.map(getEntityById).find((entity) => entity && entity.entityType !== 'source');
  const profile = useMemo(() => selected ? safe(() => getClaimProvenanceProfile(selected.id, chapter), null) : null, [chapter, selected]);
  const coverage = useMemo(() => safe(() => getProvenanceCoverageReport(chapter), null), [chapter]);

  return <Frame
    eyebrow="Evidence topology"
    title={profile ? `${profile.entity.name} · claim provenance` : `Claim → source graph at Chapter ${chapter}`}
    description="Claims are generated from maintained canonical fields or explicit claim records, then linked only to their published source chain. Inherited entity sources are labelled separately from explicit claim-level sources."
    icon={FileCheck2}
    className="succession-explorer-state-instrument--evidence"
  >
    {coverage && <dl className="succession-explorer-evidence-topology__summary">
      <div><dt>Archive provenance</dt><dd>{coverage.coverage}%</dd></div>
      <div><dt>Claims</dt><dd>{coverage.claims.toLocaleString()}</dd></div>
      <div><dt>Unsupported</dt><dd>{coverage.unsupported}</dd></div>
      <div><dt>Explicit claim sources</dt><dd>{coverage.explicitClaimSources}</dd></div>
      <div><dt>Inherited entity sources</dt><dd>{coverage.inheritedEntitySources}</dd></div>
    </dl>}

    {!profile && coverage && <section className="succession-explorer-evidence-topology__weakest">
      <header><FileQuestion size={15} aria-hidden="true" /><div><span>Lowest provenance coverage</span><strong>Select a record to open its evidence topology</strong></div></header>
      <div>{coverage.weakest.map((candidate) => <button type="button" onClick={() => explorer.selectEntity(candidate.entity.id, { routeId: 'research', chapter, label: candidate.entity.name })} key={candidate.entity.id}>
        <span>{labelize(candidate.entity.entityType)}</span><strong>{candidate.entity.name}</strong><small>{candidate.coverage}% coverage · {candidate.unsupported.length} unsupported</small><ChevronRight size={13} />
      </button>)}</div>
    </section>}

    {profile && <>
      <div className="succession-explorer-evidence-topology__entity">
        <ShieldCheck size={20} aria-hidden="true" />
        <div><span>{labelize(profile.entity.entityType)} · Chapter {profile.chapter}</span><strong>{profile.entity.name}</strong><p>{profile.note}</p></div>
        <b>{profile.coverage}% sourced</b>
      </div>

      <div className="succession-explorer-evidence-topology__graph">
        <section className="is-claims">
          <header><span>Claims</span><strong>{profile.claims.length}</strong></header>
          {profile.claims.map((claim) => <article className={`${claim.sources.length ? 'is-supported' : 'is-unsupported'} ${claim.inheritedSourceChain ? 'is-inherited' : 'is-explicit'}`} key={claim.id}>
            <div><span>{claim.label}</span><strong>{compact(claim.displayValue, 260)}</strong></div>
            <footer><small>{claim.inheritedSourceChain ? 'Entity source chain inherited' : 'Explicit claim-level source'}</small><b>{labelize(claim.certainty || claim.canonLevel)}</b></footer>
            <div className="succession-explorer-evidence-topology__links" aria-label={`${claim.sources.length} supporting sources`}>
              {claim.sources.length ? claim.sources.map((source) => <button type="button" onClick={() => explorer.selectEntity(source.id, { routeId: 'research', chapter, label: source.name })} key={source.id}><i /><span>{source.name}</span></button>) : <span><CircleAlert size={13} /> No published source chain</span>}
            </div>
          </article>)}
        </section>

        <section className="is-sources">
          <header><span>Canonical sources</span><strong>{profile.sources.length}</strong></header>
          {profile.sources.map((source) => {
            const record = getEntityById(source.id);
            return <button type="button" onClick={() => explorer.selectEntity(source.id, { routeId: 'research', chapter, label: source.name })} key={source.id}>
              <span>{record?.chapter ? `Chapter ${record.chapter}` : labelize(record?.sourceType || 'source')}</span>
              <strong>{source.name}</strong>
              <small>{(record?.note || record?.summary) ? compact(record.note || record.summary, 125) : source.id}</small>
            </button>;
          })}
        </section>
      </div>

      <footer className="succession-explorer-evidence-topology__legend">
        <span><i className="is-explicit" /> explicit claim source</span>
        <span><i className="is-inherited" /> inherited entity source chain</span>
        <span><i className="is-missing" /> missing source chain</span>
        {!!profile.inferred.length && <strong>{profile.inferred.length} inferred/theory/probable claims remain visibly marked by certainty</strong>}
      </footer>
    </>}
  </Frame>;
}
