import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  MapPin,
  Network,
  Swords,
  Users,
} from 'lucide-react';
import {
  getCharacterDossier,
  getEntitiesByType,
  getEntityById,
  getEventsForOrganization,
  getOrganizationDossier,
} from '../../data/succession/successionData';
import { EntityVisual } from './SuccessionArchivePrimitives';
import './SuccessionArchiveWorkspaces.css';

const latestChapter = () => getEntitiesByType('chapter').at(-1)?.number || 414;
const statusLabel = (character) => character.status?.life === 'dead' ? 'Deceased' : character.status?.certainty === 'probable' ? 'Exceptional body state' : 'Active contender';
const mafiaSlug = (organization) => organization.id.replace('organization:', '');

export function PrincesWorkspace({ routeParams = {}, spoilerLimit = latestChapter(), onNavigate }) {
  const princes = useMemo(() => getEntitiesByType('character')
    .filter((character) => (character.roles || []).includes('prince'))
    .sort((left, right) => left.princeOrder - right.princeOrder), []);
  const requestedEntity = routeParams.entity ? getEntityById(routeParams.entity) : null;
  const requestedOrder = Number(routeParams.prince) || requestedEntity?.princeOrder || null;
  const [filter, setFilter] = useState('all');
  const selected = requestedOrder ? princes.find((prince) => prince.princeOrder === requestedOrder) : null;
  const visiblePrinces = useMemo(() => princes.filter((prince) => {
    if (filter === 'all') return true;
    if (filter === 'deceased') return prince.status?.life === 'dead';
    if (filter === 'exceptional') return prince.status?.certainty === 'probable';
    return prince.status?.life !== 'dead' && prince.status?.certainty !== 'probable';
  }), [princes, filter]);
  const counts = useMemo(() => ({
    active: princes.filter((prince) => prince.status?.life !== 'dead' && prince.status?.certainty !== 'probable').length,
    deceased: princes.filter((prince) => prince.status?.life === 'dead').length,
    exceptional: princes.filter((prince) => prince.status?.certainty === 'probable').length,
  }), [princes]);

  const openPrince = (prince) => onNavigate('characters', { entity: prince.id });

  if (selected) {
    const dossier = getCharacterDossier(selected.id, spoilerLimit);
    const previous = princes[selected.princeOrder - 2];
    const next = princes[selected.princeOrder];
    return <article className="succession-prince-dossier">
      <header className="succession-prince-dossier__toolbar"><button type="button" onClick={() => onNavigate('princes')}><ArrowLeft size={16} aria-hidden="true" /> All princes</button><button type="button" onClick={() => onNavigate('princes', { view: 'tree' })}><Network size={16} aria-hidden="true" /> Family tree</button></header>
      <section className="succession-prince-dossier__hero"><div className="succession-prince-dossier__portrait"><EntityVisual entity={selected} /></div><div><span>{selected.princeOrder} · {statusLabel(selected)}</span><h2>{selected.name}</h2><p>{dossier?.state?.operationalState || selected.summary}</p><div><small>{selected.royalMother || 'Maternal branch recorded in royal dossier'}</small><small>{dossier?.location?.name || 'Current room unresolved'}</small><small>Chapter {spoilerLimit} boundary</small></div></div>{selected.referenceUrl && <a href={selected.referenceUrl} target="_blank" rel="noreferrer noopener">Reference <ExternalLink size={13} aria-hidden="true" /></a>}</section>
      {dossier?.state?.openQuestions?.length > 0 && <aside className="succession-prince-dossier__status"><AlertTriangle size={18} aria-hidden="true" /><div><span>Body, contest, and evidence state</span><p>{dossier.state.openQuestions.join(' ')}</p></div></aside>}
      <div className="succession-prince-dossier__core"><section><span>Body and consciousness</span><h3>{dossier?.state?.bodyState || 'State not established'}</h3><p>{dossier?.state?.consciousnessState || 'No separate consciousness record is maintained.'}</p></section><section><span>Nen knowledge</span><h3>Chapter-bounded ability state</h3><p>{dossier?.state?.nenKnowledge || 'Nen knowledge remains unresolved.'}</p></section></div>
      <div className="succession-prince-dossier__network"><section><header><Users size={17} aria-hidden="true" /><div><span>Operational network</span><h3>Assignments and relationships</h3></div></header><div>{[...(dossier?.assignments?.assignments || []), ...(dossier?.relationships?.relationships || [])].slice(0, 12).map((record) => <button type="button" key={record.id} onClick={() => onNavigate(record.entityType === 'assignment' ? 'bodyguards' : 'relationships', { entity: record.id })}><span>{record.name}</span></button>)}</div></section><section><header><AlertTriangle size={17} aria-hidden="true" /><div><span>Unresolved pressure</span><h3>Threats and open questions</h3></div></header><ol>{[...(dossier?.roleProfile?.vulnerabilities || []), ...(dossier?.state?.openQuestions || [])].slice(0, 8).map((pressure, index) => <li key={`${pressure}-${index}`}><b>{String(index + 1).padStart(2, '0')}</b><span>{pressure}</span></li>)}</ol></section></div>
      <footer className="succession-prince-dossier__pager"><button type="button" onClick={() => previous && openPrince(previous)} disabled={!previous}><ArrowLeft size={15} aria-hidden="true" /> {previous ? `${previous.princeOrder}. ${previous.name}` : 'First prince'}</button><button type="button" onClick={() => next && openPrince(next)} disabled={!next}>{next ? `${next.princeOrder}. ${next.name}` : 'Last prince'} <ArrowRight size={15} aria-hidden="true" /></button></footer>
    </article>;
  }

  return <section className="succession-prince-board" aria-labelledby="succession-prince-board-title">
    <header className="succession-prince-board__header"><div><span>Royal contest board</span><h2 id="succession-prince-board-title">Fourteen chapter-bounded royal candidates</h2><p>This visual index is generated from canonical character records. Every prince opens the authoritative character dossier rather than a separate static profile.</p></div><button type="button" className="succession-button succession-button--quiet" onClick={() => onNavigate('princes', { view: 'tree' })}><Network size={16} aria-hidden="true" /> Open family tree</button></header>
    <dl className="succession-prince-board__stats"><div><dt>Active</dt><dd>{counts.active}</dd></div><div><dt>Confirmed deceased</dt><dd>{counts.deceased}</dd></div><div><dt>Exceptional state</dt><dd>{counts.exceptional}</dd></div><div><dt>Total contestants</dt><dd>{princes.length}</dd></div></dl>
    <div className="succession-prince-board__filters" aria-label="Filter princes by current state">{[['all', 'All'], ['active', 'Active'], ['deceased', 'Deceased'], ['exceptional', 'Exceptional']].map(([id, label]) => <button type="button" className={filter === id ? 'is-active' : ''} aria-pressed={filter === id} onClick={() => setFilter(id)} key={id}>{label}</button>)}</div>
    <div className="succession-prince-board__grid">{visiblePrinces.map((prince) => {
      const dossier = getCharacterDossier(prince.id, spoilerLimit);
      return <button type="button" className={`succession-prince-card is-${prince.status?.life || 'unknown'}`} onClick={() => openPrince(prince)} key={prince.id}><span className="succession-prince-card__rank">{String(prince.princeOrder).padStart(2, '0')}</span><EntityVisual entity={prince} /><div className="succession-prince-card__copy"><span>{statusLabel(prince)}</span><h3>{prince.name}</h3><p>{dossier?.state?.operationalState || prince.summary}</p></div><dl><div><dt>Branch</dt><dd>{prince.royalMother || 'Unknown'}</dd></div><div><dt>Location</dt><dd>{dossier?.location?.name || 'Unresolved'}</dd></div><div><dt>Assignments</dt><dd>{dossier?.assignments?.assignments.length || 0}</dd></div><div><dt>Pressure</dt><dd>{dossier?.roleProfile?.vulnerabilities.length || 0}</dd></div></dl><footer><span>{dossier?.abilities.length ? `${dossier.abilities.length} abilities linked` : 'Ability state unresolved'}</span><b>Open dossier <ArrowRight size={14} aria-hidden="true" /></b></footer></button>;
    })}</div>
  </section>;
}

export function MafiaWorkspace({ routeParams = {}, spoilerLimit = latestChapter(), onNavigate }) {
  const organizations = useMemo(() => getEntitiesByType('organization')
    .filter((organization) => organization.organizationType === 'mafia-family')
    .sort((left, right) => left.name.localeCompare(right.name)), []);
  const initialFocus = routeParams.focus || '';
  const [focus, setFocus] = useState(initialFocus);
  const selected = organizations.find((organization) => mafiaSlug(organization) === focus) || null;
  const dossiers = organizations.map((organization) => getOrganizationDossier(organization.id, spoilerLimit)).filter(Boolean);
  const events = [...new Map(organizations.flatMap((organization) => getEventsForOrganization(organization.id)).filter((event) => event.chapterRange.start <= spoilerLimit).map((event) => [event.id, event])).values()];

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
    <section className="succession-mafia-workspace__operations" aria-labelledby="succession-mafia-operations-title"><header><span>Conflict ledger</span><h3 id="succession-mafia-operations-title">Events driving the lower-tier war</h3></header><div>{events.map((event) => <article key={event.id}><span>Ch. {event.chapterRange.start}{event.chapterRange.end && event.chapterRange.end !== event.chapterRange.start ? `–${Math.min(event.chapterRange.end, spoilerLimit)}` : ''}</span><h4>{event.name}</h4><p>{event.summary}</p><b>{event.status}</b></article>)}</div><button type="button" onClick={() => onNavigate('events')}>Open the complete event archive <ArrowRight size={14} aria-hidden="true" /></button></section>
  </div>;
}
