import { useEffect, useMemo, useState } from 'react';
import { ExternalLink, Search } from 'lucide-react';
import { successionRoster, successionRosterGroups, successionRosterSource } from '../data/successionRoster';
import { deathLedger } from '../data/successionStatus';
import SafeImage from './SafeImage';

const deathVisible = (character, limit) => {
  if (character.status !== 'deceased') return false;
  const record = deathLedger.find((item) => item.name === character.name);
  return !record || Number(record.chapter) <= limit;
};

export default function SuccessionRoster({ initialQuery = '', spoilerLimit = Number.MAX_SAFE_INTEGER }) {
  const [activeGroup, setActiveGroup] = useState('all');
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => setQuery(initialQuery), [initialQuery]);

  const groups = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return successionRosterGroups.map((group) => ({
      ...group,
      members: group.members.filter((member) => (
        (activeGroup === 'all' || group.id === activeGroup)
        && (!normalized || `${member.name} ${group.title}`.toLowerCase().includes(normalized))
      )),
    })).filter((group) => group.members.length);
  }, [activeGroup, query]);

  const shownCount = groups.reduce((total, group) => total + group.members.length, 0);

  return (
    <section className="succession-roster-section" id="succession-roster">
      <div className="section-heading">
        <div><span className="section-kicker">Developing Succession roster</span><h2>{successionRoster.length} indexed character records</h2></div>
        <p>Maintained from Hunterpedia’s chapters 340–current directory through Chapter 413, including named people, selected visibly drawn unidentified participants, and returning figures. It remains subject to source revisions.</p>
      </div>

      <div className="roster-controls">
        <label><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search this roster…" /></label>
        <span>Showing {shownCount} cards</span>
      </div>
      <div className="roster-tabs" role="group" aria-label="Filter Succession characters">
        <button className={activeGroup === 'all' ? 'is-active' : ''} onClick={() => setActiveGroup('all')}>All</button>
        {successionRosterGroups.map((group) => <button className={activeGroup === group.id ? 'is-active' : ''} key={group.id} onClick={() => setActiveGroup(group.id)}>{group.title} <small>{group.members.length}</small></button>)}
      </div>

      <div className="complete-roster-groups">
        {groups.map((group) => (
          <section className="complete-roster-group" key={group.id}>
            <div><h3>{group.title}</h3><p>{group.description}</p></div>
            <div className="complete-roster-grid">
              {group.members.map((character) => (
                <a className={`roster-card${deathVisible(character, spoilerLimit) ? ' is-deceased' : ''}${character.image ? '' : ' no-image'}`} href={character.source} target="_blank" rel="noreferrer" key={`${group.id}-${character.name}`}>
                  {character.image && <div className="roster-card__image" data-image-frame>
                    <SafeImage src={character.image} media={character.media} alt={`${character.name} portrait from Hunterpedia`} />
                    {deathVisible(character, spoilerLimit) && <i className="death-mark" aria-label="Confirmed deceased">×</i>}
                  </div>}
                  <span>{deathVisible(character, spoilerLimit) ? 'Deceased' : (spoilerLimit >= 405 ? character.statusNote : null) || group.title}</span>
                  <strong>{character.name}</strong>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>
      {!groups.length && <div className="empty-state"><h3>No roster matches</h3><p>Try another name or group.</p></div>}
      <a className="roster-source" href={successionRosterSource} target="_blank" rel="noreferrer">Open the complete Hunterpedia source directory <ExternalLink size={13} /></a>
    </section>
  );
}
