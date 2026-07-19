import { ExternalLink, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { successionRosterGroups, successionRosterSource } from '../data/successionRoster';
import { successionRelationships } from '../data/successionDossier';
import SafeImage from './SafeImage';

const lanes = [
  { id: 'royal', title: 'Royal contest', note: 'Family, households and Kakin authority', groups: ['royal-family', 'royal-bodyguards', 'royal-servants', 'benjamin-guard', 'camilla-guard', 'kakin-soldiers', 'justice-bureau', 'kakin-others'] },
  { id: 'underworld', title: 'Lower tiers', note: 'Mafia war, Troupe and Hisoka search', groups: ['xi-yu', 'cha-r', 'heil-ly', 'returning'] },
  { id: 'expedition', title: 'Expedition layer', note: 'Dark Continent, V6 and parallel records', groups: ['expedition', 'v6', 'other'] },
];

const normalize = (value = '') => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

export default function SuccessionConnectionBoard() {
  const [selectedId, setSelectedId] = useState('royal-family');
  const [query, setQuery] = useState('');
  const groupMap = useMemo(() => new Map(successionRosterGroups.map((group) => [group.id, group])), []);
  const selectedGroup = groupMap.get(selectedId) || successionRosterGroups[0];
  const normalizedQuery = normalize(query.trim());
  const visibleMembers = normalizedQuery
    ? successionRosterGroups.flatMap((group) => group.members.map((member) => ({ ...member, directory: group.title }))).filter((member) => normalize(`${member.name} ${member.role} ${member.directory}`).includes(normalizedQuery))
    : selectedGroup.members.map((member) => ({ ...member, directory: selectedGroup.title }));
  const selectedNames = new Set(selectedGroup.members.map((member) => normalize(member.name.split(' ')[0])));
  const relevantRelationships = successionRelationships.filter((relationship) => {
    const terms = normalize(`${relationship.from} ${relationship.to}`);
    return [...selectedNames].some((name) => name.length > 3 && terms.includes(name)) || normalize(`${relationship.from} ${relationship.to} ${relationship.type}`).includes(normalize(selectedGroup.title.replace(' family', '').replace(' guard', '')));
  }).slice(0, 8);

  return (
    <section className="connection-board-section connection-atlas-section" id="succession-connection-board">
      <div className="section-heading connection-board-heading">
        <div><span className="section-kicker">Interactive relationship atlas</span><h2>The Succession cast, without the wall chart</h2></div>
        <p>Start with the three story systems, choose a connected directory, then inspect its members and relevant cross-relationships. Every roster record remains available without forcing hundreds of portraits onto one canvas.</p>
      </div>

      <div className="connection-atlas-overview">
        <header className="connection-atlas-root"><span>Ch. 340–413</span><h3>Succession Contest</h3><p>One story, three overlapping systems</p></header>
        <div className="connection-atlas-lanes">{lanes.map((lane) => <section className={`connection-atlas-lane connection-atlas-lane--${lane.id}`} key={lane.id}>
          <header><span>{lane.groups.reduce((total, id) => total + (groupMap.get(id)?.members.length || 0), 0)} listed records</span><h3>{lane.title}</h3><p>{lane.note}</p></header>
          <div>{lane.groups.map((id) => { const group = groupMap.get(id); return group && <button type="button" className={selectedId === id ? 'is-active' : ''} onClick={() => { setSelectedId(id); setQuery(''); }} key={id}><strong>{group.title}</strong><small>{group.members.length}</small></button>; })}</div>
        </section>)}</div>
      </div>

      <div className="connection-atlas-toolbar">
        <div><span>{normalizedQuery ? 'Search results' : 'Selected directory'}</span><h3>{normalizedQuery ? `${visibleMembers.length} matching people` : selectedGroup.title}</h3><p>{normalizedQuery ? 'Results may come from several connected directories.' : selectedGroup.description}</p></div>
        <label><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search every Succession character" /><button type="button" onClick={() => setQuery('')} disabled={!query}>Clear</button></label>
      </div>

      <div className="connection-atlas-workspace">
        <div className="connection-atlas-members">
          {visibleMembers.map((member) => <a className={`connection-atlas-person connection-atlas-person--${member.status}${member.image ? '' : ' no-image'}`} href={member.source} target="_blank" rel="noreferrer" key={`${member.directory}-${member.name}`}>
            {member.image && <span data-image-frame><SafeImage src={member.image} media={member.media} alt={`${member.name} Hunterpedia portrait`} />{member.status === 'deceased' && <b aria-label="Confirmed deceased">×</b>}</span>}
            <div><small>{normalizedQuery ? member.directory : member.statusNote || member.status}</small><strong>{member.name}</strong><p>{member.role}</p></div>
          </a>)}
        </div>

        <aside className="connection-atlas-relations">
          <header><span>Cross-connections</span><h3>{selectedGroup.title}</h3><p>Relationship records that touch people or institutions in the selected directory.</p></header>
          {relevantRelationships.length ? relevantRelationships.map((relationship) => <a className={`connection-atlas-relation connection-atlas-relation--${relationship.state}`} href={relationship.source} target="_blank" rel="noreferrer" key={`${relationship.from}-${relationship.to}`}>
            <span>{relationship.type}</span><div><strong>{relationship.from}</strong><i /><strong>{relationship.to}</strong></div><small>Ch. {relationship.chapters} <ExternalLink size={9} /></small>
          </a>) : <p className="connection-atlas-empty">No direct cross-relationship record is currently assigned to this broad directory. Membership remains visible in the roster panel.</p>}
        </aside>
      </div>

      <div className="connection-atlas-note"><strong>How to read this:</strong><span>Lines in the overview mean directory structure or story-layer membership—not friendship or alliance. The right-hand records describe the actual relationship type and link to Hunterpedia.</span></div>
      <a className="tree-source" href={successionRosterSource} target="_blank" rel="noreferrer">Current-arc roster source: Hunterpedia <ExternalLink size={13} /></a>
    </section>
  );
}
