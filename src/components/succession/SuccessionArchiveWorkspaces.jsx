import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Crown,
  ExternalLink,
  MapPin,
  Network,
  Shield,
  Sparkles,
  Swords,
  Users,
} from 'lucide-react';
import {
  getCharacterDossier,
  getEntitiesByType,
  getEntityById,
  getEventsForOrganization,
  getOrganizationDossier,
  getStoryEventKnowledgeAtChapter,
} from '../../data/succession/successionData';
import { EntityVisual, SourceReference } from './SuccessionArchivePrimitives';
import './SuccessionArchiveWorkspaces.css';
import './SuccessionArchiveRoyalCommand.css';

const latestChapter = () => getEntitiesByType('chapter').at(-1)?.number || 414;
const statusLabel = (character, dossier) => dossier?.state?.life === 'dead' || character.status?.life === 'dead'
  ? 'Deceased'
  : character.status?.certainty === 'probable' || /possess|occupied|displaced|continuation|exceptional|unknown/i.test(`${dossier?.state?.bodyState || ''} ${dossier?.state?.consciousnessState || ''}`)
    ? 'Exceptional body state'
    : 'Active contender';
const statusKey = (character, dossier) => statusLabel(character, dossier) === 'Deceased'
  ? 'deceased'
  : statusLabel(character, dossier) === 'Exceptional body state'
    ? 'exceptional'
    : 'active';
const mafiaSlug = (organization) => organization.id.replace('organization:', '');

function RoyalStatusOrbit({ records, counts }) {
  const center = 160;
  const radius = 118;
  return <figure className="succession-royal-orbit" aria-label={`Royal status orbit: ${counts.active} active, ${counts.deceased} deceased, and ${counts.exceptional} exceptional-state princes`}>
    <svg viewBox="0 0 320 320" role="img" aria-hidden="true">
      <circle className="succession-royal-orbit__outer" cx={center} cy={center} r="136" />
      <circle className="succession-royal-orbit__inner" cx={center} cy={center} r="83" />
      <line className="succession-royal-orbit__axis" x1="160" y1="14" x2="160" y2="306" />
      <line className="succession-royal-orbit__axis" x1="14" y1="160" x2="306" y2="160" />
      {records.map(({ prince, dossier }, index) => {
        const angle = ((index / records.length) * Math.PI * 2) - (Math.PI / 2);
        const x = center + Math.cos(angle) * radius;
        const y = center + Math.sin(angle) * radius;
        const innerX = center + Math.cos(angle) * 86;
        const innerY = center + Math.sin(angle) * 86;
        return <g className={`succession-royal-orbit__node is-${statusKey(prince, dossier)}`} key={prince.id}>
          <line x1={innerX} y1={innerY} x2={x} y2={y} />
          <circle cx={x} cy={y} r="15" />
          <text x={x} y={y}>{String(prince.princeOrder).padStart(2, '0')}</text>
        </g>;
      })}
      <g className="succession-royal-orbit__center">
        <circle cx={center} cy={center} r="53" />
        <text className="is-number" x={center} y="151">14</text>
        <text className="is-label" x={center} y="181">ROYAL CANDIDATES</text>
      </g>
    </svg>
    <figcaption><span><i /> Active</span><span className="is-deceased"><i /> Deceased</span><span className="is-exceptional"><i /> Exceptional state</span></figcaption>
  </figure>;
}

export function PrincesWorkspace({ routeParams = {}, spoilerLimit = latestChapter(), onNavigate }) {
  const princes = useMemo(() => getEntitiesByType('character')
    .filter((character) => (character.roles || []).includes('prince'))
    .sort((left, right) => left.princeOrder - right.princeOrder), []);
  const requestedEntity = routeParams.entity ? getEntityById(routeParams.entity) : null;
  const requestedOrder = Number(routeParams.prince) || requestedEntity?.princeOrder || null;
  const [filter, setFilter] = useState('all');
  const selected = requestedOrder ? princes.find((prince) => prince.princeOrder === requestedOrder) : null;
  const records = useMemo(() => princes.map((prince) => ({ prince, dossier: getCharacterDossier(prince.id, spoilerLimit) })), [princes, spoilerLimit]);
  const visibleRecords = useMemo(() => records.filter(({ prince, dossier }) => filter === 'all' || statusKey(prince, dossier) === filter), [filter, records]);
  const counts = useMemo(() => records.reduce((result, { prince, dossier }) => {
    result[statusKey(prince, dossier)] += 1;
    return result;
  }, { active: 0, deceased: 0, exceptional: 0 }), [records]);
  const branchCount = useMemo(() => new Set(princes.map((prince) => prince.royalMother).filter(Boolean)).size, [princes]);
  const unresolvedCount = useMemo(() => records.filter(({ dossier }) => (dossier?.state?.openQuestions || []).length > 0).length, [records]);

  const openPrince = (prince) => onNavigate('princes', { prince: prince.princeOrder });

  if (selected) {
    const dossier = getCharacterDossier(selected.id, spoilerLimit);
    const previous = princes[selected.princeOrder - 2];
    const next = princes[selected.princeOrder];
    const assignments = dossier?.assignments?.assignments || [];
    const relationships = dossier?.relationships?.relationships || [];
    const pressure = [...(dossier?.roleProfile?.vulnerabilities || []), ...(dossier?.state?.openQuestions || [])];
    const operationalRecords = [...assignments, ...relationships].slice(0, 12);
    return <article className="succession-prince-dossier">
      <header className="succession-prince-dossier__toolbar">
        <button type="button" onClick={() => onNavigate('princes')}><ArrowLeft size={16} aria-hidden="true" /> Royal status board</button>
        <button type="button" onClick={() => onNavigate('princes', { view: 'tree' })}><Network size={16} aria-hidden="true" /> Family hierarchy</button>
      </header>

      <section className="succession-prince-dossier__hero succession-prince-intelligence-hero" data-rank={String(selected.princeOrder).padStart(2, '0')}>
        <div className="succession-prince-intelligence-hero__portrait"><EntityVisual entity={selected} /></div>
        <div className="succession-prince-intelligence-hero__copy">
          <span>Prince {String(selected.princeOrder).padStart(2, '0')} · {statusLabel(selected, dossier)}</span>
          <h2>{selected.name}</h2>
          <p>{dossier?.state?.operationalState || selected.summary}</p>
          <div className="succession-prince-intelligence-hero__facts">
            <span><Crown size={13} aria-hidden="true" /> {selected.royalMother || 'Maternal branch unresolved'}</span>
            <span><MapPin size={13} aria-hidden="true" /> {dossier?.location?.name || 'Current room unresolved'}</span>
            <span><BookOpen size={13} aria-hidden="true" /> Chapter {spoilerLimit} boundary</span>
            {selected.referenceUrl && <a href={selected.referenceUrl} target="_blank" rel="noreferrer noopener">Reference <ExternalLink size={13} aria-hidden="true" /></a>}
          </div>
        </div>
      </section>

      <section className="succession-prince-risk-board" aria-label="Prince operational risk summary">
        <article><span>Assignments</span><strong>{assignments.length}</strong><small>active protection, reporting, surveillance, and threat records</small></article>
        <article><span>Relationships</span><strong>{relationships.length}</strong><small>active directed or reciprocal graph edges</small></article>
        <article><span>Nen intelligence</span><strong>{dossier?.abilities.length || 0}</strong><small>linked abilities at the selected boundary</small></article>
        <article><span>Protection</span><strong>{dossier?.protectionAssignments.length || 0}</strong><small>assignments currently protecting this prince</small></article>
        <article><span>Threat pressure</span><strong>{(dossier?.threatAssignments.length || 0) + pressure.length}</strong><small>hostile assignments, vulnerabilities, and unresolved questions</small></article>
      </section>

      {dossier?.state?.openQuestions?.length > 0 && <aside className="succession-prince-dossier__status"><AlertTriangle size={18} aria-hidden="true" /><div><span>Body, contest, and evidence state</span><p>{dossier.state.openQuestions.join(' ')}</p></div></aside>}

      <div className="succession-prince-dossier__core">
        <section><span>Body and consciousness</span><h3>{dossier?.state?.bodyState || 'State not established'}</h3><p>{dossier?.state?.consciousnessState || 'No separate consciousness record is maintained.'}</p></section>
        <section><span>Nen and ritual knowledge</span><h3>{dossier?.state?.nenKnowledge || 'Knowledge unresolved'}</h3><p>{dossier?.abilities.length ? `${dossier.abilities.length} canonical ability record${dossier.abilities.length === 1 ? '' : 's'} currently linked.` : 'No canonical ability is linked at this boundary.'}</p></section>
        <section><span>Allegiance and authority</span><h3>{dossier?.state?.allegianceState || 'Alignment unresolved'}</h3><p>{dossier?.roleProfile?.authority || 'Royal authority remains described by the maintained character record.'}</p></section>
      </div>

      <div className="succession-prince-dossier__network">
        <section><header><Users size={17} aria-hidden="true" /><div><span>Operational network</span><h3>Assignments and relationships</h3></div></header><div>{operationalRecords.length ? operationalRecords.map((record) => <button type="button" key={record.id} onClick={() => onNavigate(record.entityType === 'assignment' ? 'bodyguards' : 'relationships', { entity: record.id })}>{record.name}</button>) : <p>No active network record intersects this chapter.</p>}</div></section>
        <section><header><AlertTriangle size={17} aria-hidden="true" /><div><span>Unresolved pressure</span><h3>Threats, vulnerabilities, and open questions</h3></div></header>{pressure.length ? <ol>{pressure.slice(0, 10).map((item, index) => <li key={`${item}-${index}`}><b>{String(index + 1).padStart(2, '0')}</b><span>{item}</span></li>)}</ol> : <p>No structured vulnerability or open question is published.</p>}</section>
        <section><header><Shield size={17} aria-hidden="true" /><div><span>Protection circle</span><h3>Actors and assignments maintaining security</h3></div></header><div>{dossier?.protectionAssignments.length ? dossier.protectionAssignments.slice(0, 10).map((record) => <button type="button" key={record.id} onClick={() => onNavigate('bodyguards', { entity: record.id })}>{record.name}</button>) : <p>No active protection assignment is published.</p>}</div></section>
        <section><header><Sparkles size={17} aria-hidden="true" /><div><span>Nen intelligence</span><h3>Known abilities and ritual-linked mechanics</h3></div></header><div>{dossier?.abilities.length ? dossier.abilities.map((ability) => <button type="button" key={ability.id} onClick={() => onNavigate('nen', { entity: ability.id })}>{ability.name}</button>) : <p>No canonical ability is linked to this prince.</p>}</div></section>
      </div>

      {!!dossier?.sources.length && <section className="succession-prince-evidence"><header><Activity size={17} aria-hidden="true" /><div><span>Evidence record</span><h3>Sources supporting the royal intelligence file</h3></div></header><div>{dossier.sources.map((source) => <SourceReference source={source} onNavigate={onNavigate} key={source.id} />)}</div></section>}

      <footer className="succession-prince-dossier__pager">
        <button type="button" onClick={() => previous && openPrince(previous)} disabled={!previous}><ArrowLeft size={15} aria-hidden="true" /> {previous ? `${previous.princeOrder}. ${previous.name}` : 'First prince'}</button>
        <button type="button" className="is-character-record" onClick={() => onNavigate('characters', { entity: selected.id })}>Open complete character chronology <BookOpen size={15} aria-hidden="true" /></button>
        <button type="button" onClick={() => next && openPrince(next)} disabled={!next}>{next ? `${next.princeOrder}. ${next.name}` : 'Last prince'} <ArrowRight size={15} aria-hidden="true" /></button>
      </footer>
    </article>;
  }

  return <section className="succession-prince-board" aria-labelledby="succession-prince-board-title">
    <header className="succession-royal-command">
      <div className="succession-royal-command__copy">
        <span className="succession-royal-command__eyebrow"><Crown size={17} aria-hidden="true" /> Succession Contest command</span>
        <h2 id="succession-prince-board-title">Fourteen royal candidates. One chapter-bounded field of pressure.</h2>
        <p>The status board combines rank, maternal branch, body state, current location, protection, threats, abilities, and unresolved pressure while every detail remains grounded in the canonical character dossier.</p>
        <div className="succession-royal-command__actions">
          <button type="button" onClick={() => openPrince(princes[0])}>Open first royal dossier <ArrowRight size={14} aria-hidden="true" /></button>
          <button type="button" onClick={() => onNavigate('princes', { view: 'tree' })}><Network size={16} aria-hidden="true" /> Open family hierarchy</button>
        </div>
      </div>
      <RoyalStatusOrbit records={records} counts={counts} />
    </header>

    <dl className="succession-royal-status-strip">
      <div><dt>Active</dt><dd>{counts.active}</dd></div>
      <div><dt>Confirmed deceased</dt><dd>{counts.deceased}</dd></div>
      <div><dt>Exceptional state</dt><dd>{counts.exceptional}</dd></div>
      <div><dt>Maternal branches</dt><dd>{branchCount}</dd></div>
      <div><dt>Open questions</dt><dd>{unresolvedCount}</dd></div>
    </dl>

    <div className="succession-royal-filter-bar">
      <div><span>Royal status query</span><strong>{visibleRecords.length} of {records.length} candidates visible</strong></div>
      <div className="succession-prince-board__filters" aria-label="Filter princes by current state">{[['all', 'All candidates'], ['active', 'Active'], ['deceased', 'Deceased'], ['exceptional', 'Exceptional']].map(([id, label]) => <button type="button" className={filter === id ? 'is-active' : ''} aria-pressed={filter === id} onClick={() => setFilter(id)} key={id}>{label}</button>)}</div>
    </div>

    <div className="succession-prince-board__grid">{visibleRecords.map(({ prince, dossier }) => <button type="button" className={`succession-prince-card is-${statusKey(prince, dossier)}`} onClick={() => openPrince(prince)} key={prince.id}>
      <div className="succession-prince-card__visual"><span className="succession-prince-card__rank">{String(prince.princeOrder).padStart(2, '0')}</span><EntityVisual entity={prince} /><span className="succession-prince-card__status"><Activity size={12} aria-hidden="true" /> {statusLabel(prince, dossier)}</span></div>
      <div className="succession-prince-card__body"><span>{prince.royalMother || 'Maternal branch unresolved'}</span><h3>{prince.name}</h3><p>{dossier?.state?.operationalState || prince.summary}</p><dl><div><dt>Location</dt><dd>{dossier?.location?.name || 'Unresolved'}</dd></div><div><dt>Assignments</dt><dd>{dossier?.assignments?.assignments.length || 0}</dd></div><div><dt>Abilities</dt><dd>{dossier?.abilities.length || 0}</dd></div><div><dt>Pressure</dt><dd>{(dossier?.roleProfile?.vulnerabilities.length || 0) + (dossier?.state?.openQuestions.length || 0)}</dd></div></dl><footer><span>Chapter {spoilerLimit} intelligence</span><b>Open royal dossier <ArrowRight size={14} aria-hidden="true" /></b></footer></div>
    </button>)}</div>
  </section>;
}

export function MafiaWorkspace({ routeParams = {}, spoilerLimit = latestChapter(), onNavigate }) {
  const organizations = useMemo(() => getEntitiesByType('organization')
    .filter((organization) => organization.organizationType === 'mafia-family')
    .sort((left, right) => left.name.localeCompare(right.name)), []);
  const [focus, setFocus] = useState(routeParams.focus || '');
  useEffect(() => setFocus(routeParams.focus || ''), [routeParams.focus]);
  const selected = organizations.find((organization) => mafiaSlug(organization) === focus) || null;
  const dossiers = organizations.map((organization) => getOrganizationDossier(organization.id, spoilerLimit)).filter(Boolean);
  const events = [...new Map(organizations
    .flatMap((organization) => getEventsForOrganization(organization.id))
    .map((event) => getStoryEventKnowledgeAtChapter(event.id, spoilerLimit))
    .filter(Boolean)
    .map((event) => [event.id, event])).values()];

  const openFamily = (organization) => {
    const slug = mafiaSlug(organization);
    setFocus(slug);
    onNavigate('mafia', { focus: slug });
  };

  return <div className="succession-mafia-workspace">
    <section className="succession-mafia-workspace__hero"><div><span>Lower-tier power map</span><h2>Three canonical mafia institutions and one expanding route war</h2><p>Xi-Yu, Cha-R, and Heil-Ly are compared through their chapter-bounded institutional authority, objectives, territory, personnel, relationships, and operations.</p></div><dl><div><dt>Families</dt><dd>{organizations.length}</dd></div><div><dt>Active personnel</dt><dd>{dossiers.reduce((total, dossier) => total + dossier.activePersonnel.length, 0)}</dd></div><div><dt>Visible events</dt><dd>{events.length}</dd></div></dl></section>
    <section className="succession-mafia-workspace__conflict" aria-label="Mafia conflict structure"><article><span>Established order</span><h3>Xi-Yu</h3><p>Zhang Lei sponsorship · Tier 3 and Tier 4 operations</p></article><div><Swords size={20} aria-hidden="true" /><span>containment, territory, route search</span></div><article className="is-hostile"><span>Contagion threat</span><h3>Heil-Ly</h3><p>Hidden base · recruitment · murder leveling</p></article><div><Swords size={20} aria-hidden="true" /><span>Troupe contact, route breach, martial law</span></div><article><span>Established order</span><h3>Cha-R</h3><p>Luzurus sponsorship · Tier 5 logistics</p></article></section>
    <section className="succession-mafia-workspace__families" aria-labelledby="succession-mafia-families-title"><header><span>Family comparison</span><h3 id="succession-mafia-families-title">Authority, territory, objectives, and pressure</h3></header><div>{dossiers.map((dossier) => {
      const active = selected?.id === dossier.organization.id;
      return <article className={`${mafiaSlug(dossier.organization)}${active ? ' is-selected' : ''}`} key={dossier.organization.id}><header><EntityVisual entity={dossier.organization} compact /><div><span>{dossier.state?.status || dossier.organization.status}</span><h4>{dossier.organization.name}</h4><p><MapPin size={13} aria-hidden="true" /> {dossier.territories.map((location) => location.name).join(' · ') || 'Territory unresolved'}</p></div></header><dl><div><dt>Leadership</dt><dd>{dossier.leaders.length}</dd></div><div><dt>Active personnel</dt><dd>{dossier.activePersonnel.length}</dd></div></dl><section><span>Objectives</span><ul>{dossier.objectives.map((objective) => <li key={objective}>{objective}</li>)}</ul></section><section><span>Pressure</span><ul>{dossier.pressure.map((risk) => <li key={risk}>{risk}</li>)}</ul></section><button type="button" onClick={() => openFamily(dossier.organization)}>{active ? 'Dossier open' : 'Open family summary'} <ArrowRight size={14} aria-hidden="true" /></button></article>;
    })}</div></section>
    {selected && <section className="succession-mafia-workspace__dossier" aria-labelledby="succession-mafia-dossier-title"><header><div><span>Selected family</span><h3 id="succession-mafia-dossier-title">{selected.name} command and membership</h3></div><button type="button" onClick={() => { setFocus(''); onNavigate('mafia'); }}>Close summary</button></header><div className="succession-mafia-workspace__leadership">{getOrganizationDossier(selected.id, spoilerLimit)?.leaders.map((person) => <button type="button" onClick={() => onNavigate('characters', { entity: person.id })} key={person.id}><EntityVisual entity={person} compact /><span>{person.name}</span></button>)}</div><div className="succession-mafia-workspace__members"><span>Active chapter-bounded personnel</span><div>{getOrganizationDossier(selected.id, spoilerLimit)?.activePersonnel.map((record) => <small key={record.id}>{record.character?.name || record.characterId} · {record.role}</small>)}</div></div><footer><button type="button" onClick={() => onNavigate('organizations', { entity: selected.id })}>Open authoritative institution dossier <ArrowRight size={13} aria-hidden="true" /></button></footer></section>}
    <section className="succession-mafia-workspace__operations" aria-labelledby="succession-mafia-operations-title"><header><span>Conflict ledger</span><h3 id="succession-mafia-operations-title">Events driving the lower-tier war</h3></header><div>{events.map((event) => <article key={event.id}><span>Ch. {event.chapterRange.start}{event.chapterRange.end && event.chapterRange.end !== event.chapterRange.start ? `–${event.chapterRange.end}` : ''}</span><h4>{event.name}</h4><p>{event.summary}</p><b>{event.status}</b></article>)}</div><button type="button" onClick={() => onNavigate('events')}>Open the complete event archive <ArrowRight size={14} aria-hidden="true" /></button></section>
  </div>;
}
