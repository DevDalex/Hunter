import { ArrowRight, ExternalLink } from 'lucide-react';
import { characterDirectoryPolicy, characterProfileByName, featuredCharacterProfiles } from '../data/characterProfilePrototype';
import SourcePortrait from './SourcePortrait';
import './CharacterProfileDossier.css';

function SourceLinks({ sources }) {
  return <div className="character-dossier-sources">{sources.map((source) => <a href={source.href} target="_blank" rel="noreferrer" key={source.href}>{source.label}<ExternalLink size={12} /></a>)}</div>;
}

function SectionList({ title, eyebrow, items, onOpenRelated }) {
  return <section className="character-dossier-section">
    <header><span>{eyebrow}</span><h4>{title}</h4></header>
    <div>{items.map((item) => Array.isArray(item)
      ? <article key={item[0]}><strong>{item[0]}</strong><p>{item[1]}</p></article>
      : <button type="button" onClick={() => onOpenRelated(item)} key={item}>{item}<ArrowRight size={12} /></button>)}</div>
  </section>;
}

function DirectoryBoundary({ selected, onOpenRelated }) {
  return <section className="character-directory-boundary" aria-label="Character directory preservation note">
    <header><span>Directory record retained</span><h3>{selected.name} stays in the complete cast archive.</h3><p>{characterDirectoryPolicy.deck}</p></header>
    <div className="character-directory-boundary__rules">
      {characterDirectoryPolicy.rules.map(([name, detail]) => <article key={name}><strong>{name}</strong><p>{detail}</p></article>)}
    </div>
    <div className="character-directory-boundary__lanes">
      {characterDirectoryPolicy.directoryLanes.map((lane) => <article key={lane.id}><span>{lane.label}</span><p>{lane.use}</p></article>)}
    </div>
    <footer><strong>Prototype dossiers now live for:</strong><div>{featuredCharacterProfiles.map((profile) => <button type="button" onClick={() => onOpenRelated(profile.name)} key={profile.id}>{profile.name}</button>)}</div></footer>
  </section>;
}

export default function CharacterProfileDossier({ selected, onOpenRelated }) {
  if (!selected || selected.category !== 'characters') return null;
  const profile = characterProfileByName.get(selected.name);
  if (!profile) return <DirectoryBoundary selected={selected} onOpenRelated={onOpenRelated} />;

  return <section className="character-profile-dossier" style={{ '--character-accent': profile.accent }} aria-label={`${profile.name} profile dossier`}>
    <header className="character-profile-dossier__hero">
      <div>
        <span>Profile dossier prototype</span>
        <h3>{profile.name}</h3>
        <p>{profile.lead}</p>
        <SourceLinks sources={profile.sources} />
      </div>
      <figure><SourcePortrait item={selected} alt={`${profile.name} portrait from Hunterpedia`} eager showState /><figcaption>{profile.role}</figcaption></figure>
    </header>

    <dl className="character-profile-dossier__facts">
      {profile.facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
    </dl>

    <div className="character-profile-dossier__grid">
      <SectionList title="Story by arc" eyebrow="Chronology" items={profile.story} onOpenRelated={onOpenRelated} />
      <SectionList title="Relationships" eyebrow="People" items={profile.relationships} onOpenRelated={onOpenRelated} />
      <SectionList title="Nen and abilities" eyebrow="System links" items={profile.nen} onOpenRelated={onOpenRelated} />
      <SectionList title="Conflicts" eyebrow="Tactical cases" items={profile.conflicts} onOpenRelated={onOpenRelated} />
      <SectionList title="Organizations" eyebrow="Faction links" items={profile.organizations} onOpenRelated={onOpenRelated} />
      <SectionList title="Locations" eyebrow="Atlas links" items={profile.locations} onOpenRelated={onOpenRelated} />
      <SectionList title="Objects and custody" eyebrow="Evidence" items={profile.objects} onOpenRelated={onOpenRelated} />
      <section className="character-dossier-section character-dossier-section--status"><header><span>Status trail</span><h4>Current state and caution</h4></header><p>{profile.status}</p><a href={profile.source} target="_blank" rel="noreferrer">Open primary Hunterpedia article <ExternalLink size={12} /></a></section>
    </div>
  </section>;
}
