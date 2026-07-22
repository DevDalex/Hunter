import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, ExternalLink, Landmark, Network, Search, Shield, UsersRound, Waypoints } from 'lucide-react';
import { institutionCharts, institutionalRelationships } from '../data/systemsDesk';
import {
  mafiaDossiers,
  mafiaMemberLedger,
  successionOperations,
  successionRelationships,
} from '../data/successionDossier';
import { successionRosterGroups } from '../data/successionRoster';
import { resolveCharacter } from '../data/entityRegistry';
import SourcePortrait from './SourcePortrait';
import './OrganizationWorkspace.css';

const viewOptions = [
  ['overview', 'Overview', Network],
  ['institutions', 'Institutions', Landmark],
  ['factions', 'Factions', Shield],
  ['members', 'Members', UsersRound],
  ['relations', 'Relationships', Waypoints],
  ['operations', 'Operations', ArrowRight],
];

const viewIds = new Set(viewOptions.map(([id]) => id));
const normalizeView = (value) => viewIds.has(value) ? value : 'overview';
const normalizeFamily = (value) => value === 'all' || mafiaDossiers.some((item) => item.family === value) ? value : 'all';

const rosterForFamily = (family) => {
  const group = successionRosterGroups.find((item) => item.title.toLowerCase().startsWith(family.toLowerCase()));
  return group?.members || [];
};

const familyMeta = {
  'Xi-Yu': { tier: 'Tier 4', principle: 'Established territorial order' },
  'Cha-R': { tier: 'Tier 5', principle: 'Logistics and controlled passage' },
  'Heil-Ly': { tier: 'Hidden band / Tier 3', principle: 'Contagion-driven destruction' },
};

export default function OrganizationWorkspace({
  requestedView = 'overview',
  requestedFamily = 'all',
  requestedSearch = '',
  onNavigate,
  onOpenRecord,
  onOpenSuccession,
  onOpenBlackWhale,
  onOpenNen,
  onOpenFights,
  onOpenObjects,
}) {
  const view = normalizeView(requestedView);
  const family = normalizeFamily(requestedFamily);
  const [query, setQuery] = useState(requestedSearch);
  const [selectedInstitutionId, setSelectedInstitutionId] = useState(institutionCharts[0]?.id || '');

  useEffect(() => setQuery(requestedSearch), [requestedSearch]);

  const selectedInstitution = institutionCharts.find((item) => item.id === selectedInstitutionId) || institutionCharts[0];
  const memberDirectory = useMemo(() => mafiaDossiers.flatMap((dossier) => rosterForFamily(dossier.family).map((member) => {
    const ledger = mafiaMemberLedger.find((item) => item.name.replace(' (recruit)', '') === member.name);
    return {
      ...member,
      family: dossier.family,
      role: ledger?.role || member.role,
      nen: ledger?.nen || 'Not individually confirmed',
      location: ledger?.location || dossier.base,
      status: ledger?.status || member.statusNote || member.status || 'Current state not individually confirmed',
    };
  })), []);
  const relations = useMemo(() => [
    ...institutionalRelationships.map((item) => ({ ...item, relation: item.type })),
    ...successionRelationships,
  ], []);
  const needle = query.trim().toLowerCase();
  const visibleMembers = memberDirectory.filter((item) => (family === 'all' || item.family === family) && (!needle || `${item.name} ${item.family} ${item.role} ${item.nen} ${item.location} ${item.status}`.toLowerCase().includes(needle)));
  const visibleRelations = relations.filter((item) => !needle || `${item.from} ${item.to} ${item.type || item.relation} ${item.note || item.detail || ''} ${item.chapters || item.period || ''}`.toLowerCase().includes(needle));
  const visibleOperations = successionOperations.filter((item) => !needle || `${item.name} ${item.summary} ${item.place} ${item.status}`.toLowerCase().includes(needle));

  const navigate = (changes = {}) => onNavigate?.({
    view,
    ...(family !== 'all' ? { family } : {}),
    ...(query ? { search: query } : {}),
    ...changes,
  });
  const openCharacter = (name) => onOpenRecord?.('characters', '', name.replace(' (recruit)', ''));

  return <section className="organization-workspace" id="organization-workspace">
    <header className="organization-workspace__hero">
      <div><span>Organizations and institutions</span><h1>Power has a structure, a membership, and a changing purpose.</h1><p>One stable workspace now holds institutions, factions, members, relationships, and operations. Nen mechanics remain in Nen; battles remain in Fights; consequential objects remain in the encyclopedia.</p></div>
      <dl><div><dt>Institution charts</dt><dd>{institutionCharts.length}</dd></div><div><dt>Indexed members</dt><dd>{memberDirectory.length}</dd></div><div><dt>Typed relations</dt><dd>{relations.length}</dd></div></dl>
    </header>

    <nav className="organization-workspace__views" aria-label="Organization workspace views">
      {viewOptions.map(([id, label, Icon]) => <button type="button" className={view === id ? 'is-active' : ''} onClick={() => navigate({ view: id, family: id === 'factions' || id === 'members' ? family : undefined, search: undefined })} key={id}><Icon size={15} />{label}</button>)}
    </nav>

    <div className="organization-workspace__boundary" role="note">
      <div><strong>Clear ownership boundaries</strong><p>Ability rules and conditions belong to Nen. Conflict anatomy belongs to Fights. Object custody and state belong to object records.</p></div>
      <div><button type="button" onClick={() => onOpenNen?.()}>Open Nen</button><button type="button" onClick={() => onOpenFights?.()}>Open Fights</button><button type="button" onClick={() => onOpenObjects?.()}>Open object records</button></div>
    </div>

    {view !== 'overview' && <div className="organization-workspace__toolbar">
      {(view === 'factions' || view === 'members') && <div>{['all', ...mafiaDossiers.map((item) => item.family)].map((item) => <button type="button" className={family === item ? 'is-active' : ''} onClick={() => navigate({ family: item === 'all' ? undefined : item, view })} key={item}>{item === 'all' ? 'All factions' : item}</button>)}</div>}
      {(view === 'members' || view === 'relations' || view === 'operations') && <label><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} onBlur={() => navigate({ search: query || undefined })} placeholder="Name, faction, operation, relationship…" />{query && <button type="button" onClick={() => { setQuery(''); navigate({ search: undefined }); }}>Clear</button>}</label>}
    </div>}

    {view === 'overview' && <div className="organization-workspace__overview">
      <section><header><span>Series-wide institutions</span><h2>Authority is not the same as loyalty.</h2><p>Formal command, family hierarchy, contracts, sponsorship, temporary alliance, and personal allegiance remain visibly distinct.</p></header><div>{institutionCharts.map((item) => <button type="button" onClick={() => { setSelectedInstitutionId(item.id); navigate({ view: 'institutions' }); }} key={item.id}><small>{item.scope}</small><strong>{item.name}</strong><span>{item.summary}</span><ArrowRight size={14} /></button>)}</div></section>
      <section><header><span>Current underworld</span><h2>Kakin’s three-family balance.</h2><p>The three sponsored communities share a national system without sharing objectives, methods, or loyalty.</p></header><div>{mafiaDossiers.map((item) => <button type="button" onClick={() => navigate({ view: 'factions', family: item.family })} key={item.family}><small>{familyMeta[item.family]?.tier}</small><strong>{item.family}</strong><span>{familyMeta[item.family]?.principle}</span><ArrowRight size={14} /></button>)}</div><footer><button type="button" onClick={() => onOpenBlackWhale?.()}>Open Black Whale territory</button><button type="button" onClick={() => onOpenSuccession?.()}>Open Succession power blocs</button></footer></section>
    </div>}

    {view === 'institutions' && selectedInstitution && <div className="organization-workspace__institutions">
      <aside><header><span>{institutionCharts.length} structures</span><h2>Choose an institution.</h2></header>{institutionCharts.map((item) => <button type="button" className={selectedInstitution.id === item.id ? 'is-active' : ''} onClick={() => setSelectedInstitutionId(item.id)} key={item.id}><small>{item.scope}</small><strong>{item.name}</strong><span>{item.status}</span></button>)}</aside>
      <article><header><div><span>{selectedInstitution.scope}</span><h2>{selectedInstitution.name}</h2><p>{selectedInstitution.summary}</p></div><a href={selectedInstitution.source} target="_blank" rel="noreferrer">Source <ExternalLink size={12} /></a></header><div className="organization-workspace__chart"><button type="button" onClick={() => onOpenRecord?.('factions', '', selectedInstitution.root.name)}><small>Root authority</small><strong>{selectedInstitution.root.name}</strong><span>{selectedInstitution.root.role}</span></button>{selectedInstitution.levels.map((level) => <section key={level.label}><h3>{level.label}</h3><div>{level.nodes.map((node) => <button type="button" onClick={() => onOpenRecord?.('factions', '', node.name)} key={node.name}><strong>{node.name}</strong><span>{node.role}</span></button>)}</div></section>)}</div><footer><strong>Maintained status</strong><p>{selectedInstitution.status}</p></footer></article>
    </div>}

    {view === 'factions' && <div className="organization-workspace__factions">
      {mafiaDossiers.filter((item) => family === 'all' || item.family === family).map((item) => <article key={item.family}><header><div><span>{familyMeta[item.family]?.tier}</span><h2>{item.family}</h2><p>{familyMeta[item.family]?.principle}</p></div><a href={item.source} target="_blank" rel="noreferrer">Source <ExternalLink size={12} /></a></header><dl><div><dt>Royal sponsor</dt><dd>{item.sponsor}</dd></div><div><dt>Base / territory</dt><dd>{item.base}</dd></div><div><dt>Leadership</dt><dd>{item.leadership.join(' · ')}</dd></div><div><dt>Objectives</dt><dd>{item.objectives.join(' · ')}</dd></div><div><dt>Operational risks</dt><dd>{item.risks.join(' · ')}</dd></div></dl><div className="organization-workspace__faction-members">{rosterForFamily(item.family).slice(0, 8).map((member) => <button type="button" onClick={() => openCharacter(member.name)} key={member.name}><SourcePortrait item={resolveCharacter(member.name)} decorative /><span><strong>{member.name}</strong><small>{member.role}</small></span></button>)}</div>{item.family === 'Heil-Ly' && <button className="organization-workspace__nen-link" type="button" onClick={() => onOpenNen?.('Contagion')}>Open Contagion in Nen <ArrowRight size={13} /></button>}</article>)}
    </div>}

    {view === 'members' && <div className="organization-workspace__members"><header><span>{visibleMembers.length} matching records</span><h2>Members, associates, and sponsors.</h2></header>{visibleMembers.map((member) => <button type="button" onClick={() => openCharacter(member.name)} key={`${member.family}-${member.name}`}><SourcePortrait item={resolveCharacter(member.name)} decorative /><span><small>{member.family}</small><strong>{member.name}</strong><em>{member.role}</em></span><span><small>Nen</small><b>{member.nen}</b></span><span><small>Last indexed location</small><b>{member.location}</b></span><span><small>Status</small><b>{member.status}</b></span><ArrowRight size={14} /></button>)}</div>}

    {view === 'relations' && <div className="organization-workspace__relations"><header><span>{visibleRelations.length} typed links</span><h2>Authority, sponsorship, alliance, and opposition.</h2><p>A relationship is directional and time-sensitive. Temporary cooperation is not presented as permanent loyalty.</p></header>{visibleRelations.map((item, index) => <article key={item.id || `${item.from}-${item.to}-${index}`}><button type="button" onClick={() => onOpenRecord?.('factions', '', item.from)}>{item.from}</button><span><i /><b>{item.relation || item.type}</b><small>{item.chapters || item.period || item.state}</small></span><button type="button" onClick={() => onOpenRecord?.('factions', '', item.to)}>{item.to}</button><p>{item.note || item.detail}</p></article>)}</div>}

    {view === 'operations' && <div className="organization-workspace__operations"><header><span>{visibleOperations.length} operations</span><h2>Plans, searches, investigations, and confrontations.</h2><p>This view tracks organizational objectives and status. Open Fights for battle-level anatomy and turning points.</p></header>{visibleOperations.map((item) => <article key={item.name}><div><small>{item.chapters} · {item.place}</small><h3>{item.name}</h3><p>{item.summary}</p></div><span>{item.status}</span><a href={item.source} target="_blank" rel="noreferrer">Source <ExternalLink size={11} /></a></article>)}</div>}
  </section>;
}
