import { useMemo } from 'react';
import {
  ArrowRight,
  BrainCircuit,
  Clock3,
  Eye,
  GitBranch,
  MapPin,
  Orbit,
  Route,
  Ship,
} from 'lucide-react';
import {
  getAbilityInteractionMatrix,
  getAbilityTransferInheritanceLedger,
  getEntitiesByType,
  getEntityById,
  getKnowledgeMatrix,
  getLocationBreadcrumbs,
  getShipInfrastructureIndex,
} from '../../data/succession/successionData';
import { successionDays, successionPreludeEvents, timelineTracks } from '../../data/successionTimeline';
import { useSuccessionExplorer } from './SuccessionExplorerState';
import './SuccessionExplorerAdvancedInstruments.css';

const MIN_CHAPTER = 340;
const safe = (factory, fallback) => {
  try { return factory(); } catch { return fallback; }
};
const labelize = (value) => String(value || 'unknown').replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
const entityLabel = (entity) => entity?.name || entity?.title || entity?.term || entity?.label || entity?.id || 'Unknown';
const unique = (values) => [...new Set((values || []).filter(Boolean))];
const chapterStart = (record) => Number(record?.chapterRange?.start || record?.firstChapter || record?.chapter || record?.number) || MIN_CHAPTER;
const chapterEnd = (record, boundary) => Math.min(boundary, Number(record?.chapterRange?.end ?? record?.latestChapter ?? boundary) || boundary);

function Instrument({ eyebrow, title, description, icon: Icon, children, className = '' }) {
  return <section className={`succession-explorer-advanced ${className}`.trim()}>
    <header className="succession-explorer-advanced__head">
      <div><span>{eyebrow}</span><h3><Icon size={18} aria-hidden="true" /> {title}</h3><p>{description}</p></div>
    </header>
    {children}
  </section>;
}

function MiniEntityButton({ entity, onSelect, detail }) {
  if (!entity) return null;
  return <button type="button" className="succession-explorer-advanced__entity" onClick={() => onSelect(entity)}>
    <span>{labelize(entity.entityType)}</span><strong>{entityLabel(entity)}</strong>{detail && <small>{detail}</small>}
  </button>;
}

const allTimelineEvents = () => [
  ...successionPreludeEvents,
  ...successionDays.flatMap((day) => day.events),
];

export function TimelineCartographyInstrument({ chapter, view = 'atlas' }) {
  const explorer = useSuccessionExplorer();
  const chapters = useMemo(() => Array.from({ length: Math.max(1, chapter - MIN_CHAPTER + 1) }, (_, index) => MIN_CHAPTER + index), [chapter]);
  const events = useMemo(() => allTimelineEvents().filter((event) => Number(event.chapter) <= chapter), [chapter]);
  const lanes = useMemo(() => {
    const counts = new Map();
    for (const event of events) for (const track of event.tracks || []) counts.set(track, (counts.get(track) || 0) + 1);
    return timelineTracks
      .filter((track) => track.id !== 'all' && counts.has(track.id))
      .map((track) => ({ ...track, count: counts.get(track.id) || 0 }))
      .sort((left, right) => right.count - left.count)
      .slice(0, view === 'braid' ? 14 : 10);
  }, [events, view]);
  const cellCounts = useMemo(() => {
    const result = new Map();
    for (const event of events) for (const track of event.tracks || []) {
      const key = `${track}:${event.chapter}`;
      result.set(key, (result.get(key) || 0) + 1);
    }
    return result;
  }, [events]);
  const maxCell = Math.max(1, ...cellCounts.values());
  const ribbons = useMemo(() => {
    const assignments = safe(() => getEntitiesByType('assignment'), []);
    const relationships = safe(() => getEntitiesByType('relationship'), []);
    return [...assignments.map((record) => ({ record, kind: 'assignment' })), ...relationships.map((record) => ({ record, kind: 'relationship' }))]
      .filter(({ record }) => chapterStart(record) <= chapter && chapterEnd(record, chapter) - chapterStart(record) >= 2)
      .sort((left, right) => (chapterEnd(right.record, chapter) - chapterStart(right.record)) - (chapterEnd(left.record, chapter) - chapterStart(left.record)))
      .slice(0, 24);
  }, [chapter]);
  const startColumn = (value) => Math.max(1, Number(value) - MIN_CHAPTER + 1);

  return <Instrument
    eyebrow="Temporal cartography"
    title={view === 'braid' ? 'Story braid across chapter lanes' : view === 'playback' ? 'Playback map with a live time cursor' : 'Chapter × lane atlas'}
    description="Horizontal position is chapter. Vertical position is a canonical timeline track. Cell intensity is indexed event density. Long ribbons below use stored assignment or relationship chapter ranges, not guessed continuous activity."
    icon={Clock3}
    className="succession-explorer-cartography"
  >
    <div className="succession-explorer-cartography__summary">
      <span><b>{events.length.toLocaleString()}</b> indexed chronology records through Ch. {chapter}</span>
      <span><b>{lanes.length}</b> active lanes shown</span>
      <span><b>{ribbons.length}</b> longest canonical duration ranges</span>
    </div>
    <div className="succession-explorer-cartography__scroll">
      <div className="succession-explorer-cartography__map" style={{ '--chapter-columns': chapters.length }}>
        <div className="succession-explorer-cartography__axis-label">TRACK / CHAPTER</div>
        <div className="succession-explorer-cartography__chapter-axis">
          {chapters.map((value) => <button type="button" className={value === chapter ? 'is-current' : ''} onClick={() => explorer.setChapter(value)} key={value} title={`Set Explorer to Chapter ${value}`}>{value % 5 === 0 || value === chapter || value === MIN_CHAPTER ? value : '·'}</button>)}
        </div>
        {lanes.map((lane) => <div className="succession-explorer-cartography__lane" key={lane.id}>
          <div className="succession-explorer-cartography__lane-label"><strong>{lane.label}</strong><small>{lane.count} records</small></div>
          <div className="succession-explorer-cartography__cells">
            {chapters.map((value) => {
              const count = cellCounts.get(`${lane.id}:${value}`) || 0;
              const level = count ? Math.max(.12, count / maxCell) : 0;
              return <button
                type="button"
                className={`${count ? 'has-records' : ''}${value === chapter ? ' is-current' : ''}`}
                style={{ '--cell-level': level }}
                title={`${lane.label}, Chapter ${value}: ${count} record${count === 1 ? '' : 's'}`}
                aria-label={`${lane.label}, Chapter ${value}, ${count} records`}
                onClick={() => explorer.setChapter(value)}
                key={value}
              ><span>{count || ''}</span></button>;
            })}
          </div>
        </div>)}
        <div className="succession-explorer-cartography__ribbons-title"><GitBranch size={14} /> Canonical duration ribbons</div>
        <div className="succession-explorer-cartography__ribbons">
          {ribbons.map(({ record, kind }) => {
            const start = Math.max(MIN_CHAPTER, chapterStart(record));
            const end = chapterEnd(record, chapter);
            const entity = getEntityById(record.id) || record;
            return <button
              type="button"
              className={`is-${kind}`}
              style={{ gridColumn: `${startColumn(start)} / span ${Math.max(1, end - start + 1)}` }}
              onClick={() => explorer.selectEntity(record.id, { routeId: 'timeline', chapter, label: entityLabel(entity) })}
              title={`${entityLabel(entity)} · Ch. ${start}–${end}`}
              key={record.id}
            ><span>{entityLabel(entity)}</span><small>{start}–{end}</small></button>;
          })}
        </div>
        {view === 'playback' && <div className="succession-explorer-cartography__cursor" style={{ '--cursor-column': startColumn(chapter) }} aria-hidden="true" />}
      </div>
    </div>
  </Instrument>;
}

const tierForLocation = (location) => {
  if (!location) return null;
  const breadcrumbs = safe(() => getLocationBreadcrumbs(location.id), []);
  const text = [location.id, location.name, location.summary, ...(location.ancestorIds || []), ...breadcrumbs.flatMap((item) => [item.id, item.name])].filter(Boolean).join(' ');
  const match = text.match(/tier[- :]*(\d)/i);
  return match ? Number(match[1]) : null;
};

export function BlackWhaleDeckInstrument({ chapter, view = 'atlas', onNavigate }) {
  const explorer = useSuccessionExplorer();
  const infrastructure = useMemo(() => safe(() => getShipInfrastructureIndex(chapter), { records: [], systems: {} }), [chapter]);
  const records = infrastructure.records || infrastructure.locations || Object.values(infrastructure.systems || {}).flatMap((system) => system.locations || []);
  const normalized = useMemo(() => records.map((row) => {
    const location = getEntityById(row.location?.id || row.locationId || row.id) || row.location || row;
    return {
      ...row,
      location,
      tier: tierForLocation(location),
      load: Number(row.operationalLoad ?? ((row.state?.occupants?.length || 0) + (row.state?.events?.length || 0) + (row.state?.assignments?.length || 0))),
    };
  }).filter((row) => row.location), [records]);
  const maxLoad = Math.max(1, ...normalized.map((row) => row.load));
  const movement = useMemo(() => safe(() => getEntitiesByType('location-history'), [])
    .filter((record) => chapterStart(record) <= chapter)
    .sort((a, b) => chapterStart(b) - chapterStart(a))
    .slice(0, 32), [chapter]);
  const select = (location) => {
    explorer.selectEntity(location.id, { routeId: 'black-whale', chapter, label: entityLabel(location) });
  };

  return <Instrument eyebrow="Living ship schematic" title={`Black Whale operational deck · Ch. ${chapter}`} description="The five-tier schematic uses canonical location hierarchy plus current occupant, event and assignment load. Heat is always accompanied by counts, so meaning never depends on color alone." icon={Ship} className="succession-explorer-deck">
    <div className="succession-explorer-deck__ship">
      {[1, 2, 3, 4, 5].map((tier) => {
        const tierRows = normalized.filter((row) => row.tier === tier).sort((a, b) => b.load - a.load).slice(0, 18);
        return <section className="succession-explorer-deck__tier" key={tier}>
          <header><span>TIER</span><strong>{tier}</strong><small>{tierRows.length} mapped spaces</small></header>
          <div>{tierRows.map((row) => <button type="button" onClick={() => select(row.location)} style={{ '--load': Math.max(.05, row.load / maxLoad) }} key={row.location.id}>
            <span>{labelize(row.system || 'ship space')}</span>
            <strong>{entityLabel(row.location)}</strong>
            <small>{row.load} load · {row.state?.occupants?.length || 0} people · {row.state?.events?.length || 0} events</small>
          </button>)}</div>
        </section>;
      })}
    </div>
    {(view === 'paths' || view === 'playback' || view === 'occupancy') && <section className="succession-explorer-deck__movement">
      <header><Route size={15} /><div><span>Movement ledger</span><strong>Recent indexed location-state records</strong></div></header>
      <div>{movement.map((record) => {
        const character = getEntityById(record.characterId);
        const location = getEntityById(record.locationId);
        return <button type="button" onClick={() => location && select(location)} key={record.id}>
          <span>CH. {chapterStart(record)}</span><strong>{entityLabel(character)}</strong><ArrowRight size={12} /><b>{entityLabel(location)}</b>
        </button>;
      })}</div>
    </section>}
    <button type="button" className="succession-explorer-advanced__open" onClick={() => onNavigate?.('locations', explorer.buildDeepLinkParams('locations'))}><MapPin size={14} /> Open canonical location dossiers</button>
  </Instrument>;
}

export function NenInteractionInstrument({ chapter, view = 'interactions', onNavigate }) {
  const explorer = useSuccessionExplorer();
  const selectedId = explorer.selectedIds.find((id) => getEntityById(id)?.entityType === 'ability') || explorer.compareIds.find((id) => getEntityById(id)?.entityType === 'ability') || null;
  const selected = selectedId ? getEntityById(selectedId) : null;
  const matrix = useMemo(() => safe(() => getAbilityInteractionMatrix(chapter, { ...(selectedId ? { entityId: selectedId } : {}), limit: 80 }), { records: [] }), [chapter, selectedId]);
  const pairs = matrix.records || matrix.pairs || matrix.interactions || matrix.rows || [];
  const direct = pairs.filter((pair) => pair.directInteractionClaimed);
  const contextual = pairs.filter((pair) => !pair.directInteractionClaimed);
  const transfers = useMemo(() => safe(() => getAbilityTransferInheritanceLedger(chapter), []), [chapter]);
  const selectAbility = (compactAbility) => {
    const ability = getEntityById(compactAbility?.id);
    if (ability) explorer.selectEntity(ability.id, { routeId: 'nen', chapter, label: entityLabel(ability) });
  };

  return <Instrument eyebrow="Nen interaction laboratory" title={selected ? `${entityLabel(selected)} interaction contexts` : 'Documented interaction and structural-overlap matrix'} description="A direct interaction is shown only when the canonical selector marks a documented same-event context. Shared owner, place or mechanics remain labelled as structural context rather than being promoted into an interaction claim." icon={Orbit} className="succession-explorer-nen-lab">
    <div className="succession-explorer-nen-lab__stats"><span><b>{pairs.length}</b> visible contexts</span><span><b>{direct.length}</b> documented same-event interactions</span><span><b>{contextual.length}</b> structural contexts</span><span><b>{transfers.length}</b> transfer / inheritance records</span></div>
    {selected && <div className="succession-explorer-nen-lab__focus"><span>FOCUS ABILITY</span><strong>{entityLabel(selected)}</strong><small>{labelize(selected.category)} · {(selected.classification?.nenTypes || ['unknown']).map(labelize).join(' / ')}</small></div>}
    <div className="succession-explorer-nen-lab__pairs">{pairs.slice(0, view === 'interactions' ? 36 : 20).map((pair) => <article className={pair.directInteractionClaimed ? 'is-direct' : 'is-context'} key={pair.id}>
      <header><span>{pair.directInteractionClaimed ? 'Documented same-event interaction' : labelize(pair.basis)}</span><b>{labelize(pair.evidenceStrength)}</b></header>
      <div><button type="button" onClick={() => selectAbility(pair.left)}>{entityLabel(pair.left)}</button><ArrowRight size={13} /><button type="button" onClick={() => selectAbility(pair.right)}>{entityLabel(pair.right)}</button></div>
      <dl>
        <div><dt>Shared events</dt><dd>{pair.sharedEvents?.length || 0}</dd></div>
        <div><dt>Shared places</dt><dd>{pair.sharedLocations?.length || 0}</dd></div>
        <div><dt>Shared owners</dt><dd>{pair.sharedOwners?.length || 0}</dd></div>
        <div><dt>Mechanic overlap</dt><dd>{pair.sharedMechanics?.length || 0}</dd></div>
      </dl>
      {!!pair.sharedMechanics?.length && <p>{pair.sharedMechanics.slice(0, 8).map(labelize).join(' · ')}</p>}
    </article>)}</div>
    {(view === 'threat' || view === 'conditions' || view === 'hypotheses') && <section className="succession-explorer-nen-lab__transfer"><header><GitBranch size={14} /><strong>Transfer / inheritance ledger</strong></header><div>{transfers.slice(0, 24).map((row, index) => {
      const ability = getEntityById(row.ability?.id || row.abilityId || row.id);
      return <MiniEntityButton entity={ability} detail={row.researchStatus || row.transferType || row.summary} onSelect={(entity) => explorer.selectEntity(entity.id, { routeId: 'nen', chapter, label: entityLabel(entity) })} key={ability?.id || row.id || index} />;
    })}</div></section>}
    {selected && <button type="button" className="succession-explorer-advanced__open" onClick={() => onNavigate?.('nen', { entity: selected.id, chapter })}>Open full mechanics dossier <ArrowRight size={13} /></button>}
  </Instrument>;
}

export function PerspectiveKnowledgeMapInstrument({ chapter }) {
  const explorer = useSuccessionExplorer();
  const perspective = explorer.perspective;
  const character = perspective === 'reader' ? null : getEntityById(perspective);
  const matrix = useMemo(() => safe(() => getKnowledgeMatrix(chapter), { records: [] }), [chapter]);
  if (!character) return null;
  const explicit = (matrix.records || []).filter((record) => (record.knowerEntityIds || []).includes(perspective) || (record.misinformedEntityIds || []).includes(perspective));
  const known = explicit.filter((record) => (record.knowerEntityIds || []).includes(perspective));
  const misinformed = explicit.filter((record) => (record.misinformedEntityIds || []).includes(perspective));
  const subjects = unique(explicit.flatMap((record) => record.subjectEntityIds || [])).map(getEntityById).filter(Boolean);
  const acquisitions = new Map();
  for (const record of known) {
    const key = record.acquisition || 'Acquisition not specified';
    acquisitions.set(key, (acquisitions.get(key) || 0) + 1);
  }

  return <Instrument eyebrow="Perspective knowledge map" title={`${entityLabel(character)} · explicit information state at Ch. ${chapter}`} description="Only explicit knowledge and misinformation records are classified. Everything else remains unclassified rather than being presented as proof that this character does not know it." icon={Eye} className="succession-explorer-knowledge-map">
    <div className="succession-explorer-knowledge-map__stats"><span><b>{known.length}</b> explicitly known</span><span><b>{misinformed.length}</b> misinformed / protected</span><span><b>{subjects.length}</b> explicit subject records</span></div>
    <div className="succession-explorer-knowledge-map__body">
      <section><header><BrainCircuit size={14} /><strong>Information islands</strong></header><div>{explicit.slice(0, 30).map((record) => <article className={(record.misinformedEntityIds || []).includes(perspective) ? 'is-misinformed' : 'is-known'} key={record.id}><span>{(record.misinformedEntityIds || []).includes(perspective) ? 'Misinformed / protected' : labelize(record.currentKnowledgeState || record.knowledgeState)}</span><strong>{record.name}</strong><small>{record.acquisition || 'Acquisition not specified'}{record.publicAtChapter ? ` · public Ch. ${record.publicAtChapter}` : ''}</small></article>)}</div></section>
      <section><header><Route size={14} /><strong>Acquisition channels</strong></header><div className="succession-explorer-knowledge-map__channels">{[...acquisitions.entries()].sort((a, b) => b[1] - a[1]).map(([channel, count]) => <div key={channel}><span>{channel}</span><strong>{count}</strong></div>)}</div><header><Eye size={14} /><strong>Explicit subjects</strong></header><div className="succession-explorer-knowledge-map__subjects">{subjects.slice(0, 24).map((entity) => <MiniEntityButton entity={entity} onSelect={(item) => explorer.selectEntity(item.id, { routeId: 'research', chapter, label: entityLabel(item) })} key={entity.id} />)}</div></section>
    </div>
  </Instrument>;
}
