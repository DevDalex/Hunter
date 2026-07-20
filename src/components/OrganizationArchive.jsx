import { useMemo, useState } from 'react';
import { ArrowRight, ExternalLink, MapPinned, Network, Search, Shield, Skull } from 'lucide-react';
import { institutionCharts, institutionalRelationships } from '../data/systemsDesk';
import {
  mafiaDossiers, mafiaMemberLedger, successionAbilities, successionOperations,
  successionRelationships, troupeHisokaTracker,
} from '../data/successionDossier';
import { mafiaFamilyTree, successionRosterGroups } from '../data/successionRoster';
import { resolveCharacter } from '../data/entityRegistry';
import SourcePortrait from './SourcePortrait';
import ReferenceBackbonePanel from './ReferenceBackbonePanel';

const views = [
  ['overview', 'Underworld map'], ['families', 'Three families'], ['people', 'Member directory'],
  ['operations', 'Operations'], ['relations', 'Alliances & enemies'],
];

const familyMeta = {
  'Xi-Yu': { tone: 'xiyu', tier: 'Tier 4', principle: 'Established territorial order', icon: Shield },
  'Cha-R': { tone: 'char', tier: 'Tier 5', principle: 'Logistics and controlled passage', icon: Network },
  'Heil-Ly': { tone: 'heilly', tier: 'Hidden band / Tier 3', principle: 'Contagion-driven destruction', icon: Skull },
};

const rosterForFamily = (family) => {
  const group = successionRosterGroups.find((item) => item.title.toLowerCase().startsWith(family.toLowerCase()));
  return group?.members || [];
};

const contagionRules = [
  ['Entry', 'Morena initiates a member into the Contagion community; the system assigns a level and game-like progression.'],
  ['Points', 'Killing raises the participant’s level, with different targets carrying different point values.'],
  ['Level 20', 'A member reaching Level 20 awakens a personal Nen ability shaped by the participant.'],
  ['Later levels', 'Further progression strengthens the participant and the community’s operational reach.'],
  ['Level 100', 'A participant reaching Level 100 can establish a new Contagion community.'],
];

const mafiaRelations = [...institutionalRelationships.map((item) => ({ ...item, relation: item.type })), ...successionRelationships]
  .filter((item) => /mafia|xi-yu|cha-r|heil-ly|troupe|hisoka|morena|zhang|luzurus|tserriednich/i.test(`${item.from} ${item.to} ${item.note || item.detail || ''}`));

export default function OrganizationArchive({ onOpenRecord, onOpenSuccession, onOpenBlackWhale }) {
  const [view, setView] = useState('overview');
  const [familyName, setFamilyName] = useState('Xi-Yu');
  const [query, setQuery] = useState('');
  const selectedFamily = mafiaDossiers.find((item) => item.family === familyName) || mafiaDossiers[0];
  const mafiaInstitution = institutionCharts.find((item) => item.id === 'mafia-community');
  const kakinInstitution = institutionCharts.find((item) => item.id === 'kakin-state');
  const directory = useMemo(() => {
    const records = new Map();
    mafiaDossiers.forEach((family) => rosterForFamily(family.family).forEach((member) => {
      const ledger = mafiaMemberLedger.find((item) => item.name.replace(' (recruit)', '') === member.name);
      records.set(`${family.family}-${member.name}`, { ...member, family: family.family, role: ledger?.role || member.role, nen: ledger?.nen || 'Not individually confirmed', location: ledger?.location || family.base, status: ledger?.status || member.statusNote || member.status || 'Current state not individually confirmed' });
    }));
    return [...records.values()];
  }, []);
  const visiblePeople = directory.filter((item) => familyName === 'all' || item.family === familyName).filter((item) => `${item.name} ${item.family} ${item.role} ${item.nen} ${item.status}`.toLowerCase().includes(query.toLowerCase()));
  const visibleOperations = successionOperations.filter((item) => `${item.name} ${item.summary} ${item.place} ${item.status}`.toLowerCase().includes(query.toLowerCase()));

  const openCharacter = (name) => onOpenRecord?.('characters', '', name.replace(' (recruit)', ''));

  return <section className="organization-archive" id="organization-archive">
    <header className="organization-archive__masthead">
      <div><span className="section-kicker">Organizations and underworld</span><h2>Power has a structure—and a location.</h2><p>Compare the Yorknew Mafia Community with Kakin’s three-family balance, then follow royal sponsorship, territorial routes, people, Nen systems, current operations, and temporary alliances.</p></div>
      <dl><div><dt>Kakin families</dt><dd>3</dd></div><div><dt>Connected people</dt><dd>{directory.length}</dd></div><div><dt>Operations</dt><dd>{successionOperations.length}</dd></div><div><dt>Relations</dt><dd>{mafiaRelations.length}</dd></div></dl>
    </header>

    <ReferenceBackbonePanel domain="organizations" onSearch={(value) => { setQuery(value); setFamilyName('all'); setView('operations'); }} />

    <nav className="organization-archive__views" aria-label="Organization archive views">{views.map(([id, label], index) => <button type="button" className={view === id ? 'is-active' : ''} onClick={() => setView(id)} key={id}><i>{String(index + 1).padStart(2, '0')}</i>{label}</button>)}</nav>

    {view !== 'overview' && <div className="organization-archive__toolbar"><div>{['all', ...mafiaDossiers.map((item) => item.family)].map((family) => <button type="button" className={familyName === family ? 'is-active' : ''} onClick={() => setFamilyName(family)} key={family}>{family === 'all' ? 'All families' : family}</button>)}</div><label><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Person, ability, room, operation…" /></label></div>}

    {view === 'overview' && <div className="underworld-overview">
      <section className="underworld-era underworld-era--yorknew">
        <header><span>Earlier structure · Yorknew</span><h3>{mafiaInstitution.name}</h3><p>{mafiaInstitution.summary}</p></header>
        <div className="underworld-hierarchy"><div className="underworld-hierarchy__root"><Network size={20} /><strong>{mafiaInstitution.root.name}</strong><small>{mafiaInstitution.root.role}</small></div>{mafiaInstitution.levels.map((level) => <section key={level.label}><span>{level.label}</span><div>{level.nodes.map((node) => <button type="button" onClick={() => onOpenRecord?.('factions', '', node.name)} key={node.name}><strong>{node.name}</strong><small>{node.role}</small></button>)}</div></section>)}</div>
        <a href={mafiaInstitution.source} target="_blank" rel="noreferrer">Yorknew mafia source <ExternalLink size={11} /></a>
      </section>
      <div className="underworld-transition"><ArrowRight size={22} /><span><b>Power breaks and reforms</b><small>The auction massacre and death of the Ten Dons end one visible summit; Kakin’s sponsored families operate under a different national system.</small></span></div>
      <section className="underworld-era underworld-era--kakin">
        <header><span>Current structure · Black Whale</span><h3>Kakin’s three-family balance</h3><p>{kakinInstitution.summary}</p></header>
        <div className="kakin-family-strip">{mafiaDossiers.map((family) => { const meta = familyMeta[family.family]; const Icon = meta.icon; return <button type="button" data-family={meta.tone} onClick={() => { setFamilyName(family.family); setView('families'); }} key={family.family}><Icon size={20} /><small>{meta.tier}</small><strong>{family.family}</strong><span>{meta.principle}</span><em>{rosterForFamily(family.family).length} connected people</em></button>; })}</div>
        <div className="underworld-overview__actions"><button type="button" onClick={onOpenBlackWhale}><MapPinned size={14} /> Open Black Whale territory</button><button type="button" onClick={onOpenSuccession}>Open Succession power blocs <ArrowRight size={14} /></button></div>
      </section>
    </div>}

    {view === 'families' && familyName !== 'all' && <div className={`mafia-family-dossier is-${familyMeta[familyName].tone}`}>
      <header><div><span>{familyMeta[familyName].tier} · Kakin Mafia Community</span><h2>{selectedFamily.family}</h2><p>{selectedFamily.objectives.join(' · ')}</p></div><a href={selectedFamily.source} target="_blank" rel="noreferrer">Hunterpedia source <ExternalLink size={12} /></a></header>
      <div className="mafia-family-dossier__facts"><dl><div><dt>Royal sponsor</dt><dd>{selectedFamily.sponsor}</dd></div><div><dt>Base / territory</dt><dd>{selectedFamily.base}</dd></div><div><dt>Leadership</dt><dd>{selectedFamily.leadership.join(' · ')}</dd></div><div><dt>Operational risks</dt><dd>{selectedFamily.risks.join(' · ')}</dd></div></dl><section><span>Royal and biological connections</span>{mafiaFamilyTree.filter((item) => `${item.family} ${item.name}`.includes(selectedFamily.family) || (selectedFamily.family === 'Heil-Ly' && item.name === 'Morena Prudo')).map((item) => <article key={item.name}><SourcePortrait item={resolveCharacter(item.name)} decorative /><div><strong>{item.name}</strong><small>{item.relation}</small><p>{item.link} · {item.royal}</p></div></article>)}</section></div>
      <section className="mafia-family-dossier__people"><header><span>{rosterForFamily(familyName).length} connected people</span><h3>Leadership, members and royal links</h3></header><div>{rosterForFamily(familyName).map((member) => <button type="button" onClick={() => openCharacter(member.name)} key={member.name}><SourcePortrait item={resolveCharacter(member.name)} decorative /><span><strong>{member.name}</strong><small>{mafiaMemberLedger.find((item) => item.name.replace(' (recruit)', '') === member.name)?.role || member.role}</small></span></button>)}</div></section>
      {familyName === 'Heil-Ly' && <section className="contagion-explainer"><header><span>Heil-Ly Nen system</span><h3>Contagion turns murder into progression.</h3><p>The interface separates the community’s shared rules from each participant’s personal ability and from currently unknown levels.</p></header><ol>{contagionRules.map(([title, detail], index) => <li key={title}><i>{String(index + 1).padStart(2, '0')}</i><span><strong>{title}</strong><p>{detail}</p></span></li>)}</ol><footer><span>Indexed ability record</span><strong>{successionAbilities.find((item) => /Contagion/i.test(item.ability))?.ability || 'Contagion'}</strong><a href="https://hunterxhunter.fandom.com/wiki/Contagion" target="_blank" rel="noreferrer">Open source <ExternalLink size={11} /></a></footer></section>}
    </div>}

    {view === 'families' && familyName === 'all' && <div className="mafia-family-comparison">{mafiaDossiers.map((family) => <article data-family={familyMeta[family.family].tone} key={family.family}><span>{familyMeta[family.family].tier}</span><h3>{family.family}</h3><dl><div><dt>Sponsor</dt><dd>{family.sponsor}</dd></div><div><dt>Base</dt><dd>{family.base}</dd></div><div><dt>Objectives</dt><dd>{family.objectives.join(' · ')}</dd></div><div><dt>Risks</dt><dd>{family.risks.join(' · ')}</dd></div></dl><button type="button" onClick={() => setFamilyName(family.family)}>Open full family dossier <ArrowRight size={13} /></button></article>)}</div>}

    {view === 'people' && <div className="mafia-member-directory" role="list"><header><span>{visiblePeople.length} matching records</span><h3>Member and associate directory</h3><p>Named members, royal sponsors, recruits, and indexed associates remain distinct. Unknown Nen and status information is written as unknown.</p></header>{visiblePeople.map((member) => <button type="button" onClick={() => openCharacter(member.name)} role="listitem" key={`${member.family}-${member.name}`}><SourcePortrait item={resolveCharacter(member.name)} decorative /><span><small>{member.family}</small><strong>{member.name}</strong><em>{member.role}</em></span><span><small>Nen</small><b>{member.nen}</b></span><span><small>Last indexed base</small><b>{member.location}</b></span><span><small>Status</small><b>{member.status}</b></span><ArrowRight size={14} /></button>)}</div>}

    {view === 'operations' && <div className="mafia-operations"><section><header><span>{visibleOperations.length} operations</span><h3>Plans, searches and confrontations</h3></header>{visibleOperations.map((item) => <article key={item.name}><div><small>{item.chapters} · {item.place}</small><h4>{item.name}</h4><p>{item.summary}</p></div><span className={`operation-state is-${item.status}`}>{item.status}</span><a href={item.source} target="_blank" rel="noreferrer">Source <ExternalLink size={10} /></a></article>)}</section><aside><header><span>Concurrent tracker</span><h3>Troupe and Hisoka</h3></header>{troupeHisokaTracker.map((item) => <button type="button" onClick={() => openCharacter(item.name)} key={item.name}><strong>{item.name}</strong><small>{item.place || item.location}</small><p>{item.objective || item.role}</p></button>)}</aside></div>}

    {view === 'relations' && <div className="mafia-relation-ledger"><header><span>{mafiaRelations.length} typed links</span><h3>Authority, sponsorship, alliance and opposition</h3><p>A line can change by chapter. Temporary cooperation is not treated as permanent loyalty.</p></header>{mafiaRelations.filter((item) => `${item.from} ${item.to} ${item.note || item.detail || ''}`.toLowerCase().includes(query.toLowerCase())).map((item, index) => <article key={item.id || `${item.from}-${item.to}-${index}`}><button type="button" onClick={() => onOpenRecord?.('factions', '', item.from)}>{item.from}</button><span><i /><b>{item.relation || item.type}</b><small>{item.chapters || item.period}</small></span><button type="button" onClick={() => onOpenRecord?.('factions', '', item.to)}>{item.to}</button><p>{item.note || item.detail}</p></article>)}</div>}
  </section>;
}
