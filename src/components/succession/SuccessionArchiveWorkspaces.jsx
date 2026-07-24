import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Crown,
  ExternalLink,
  MapPin,
  Network,
  Shield,
  Swords,
  Users,
} from 'lucide-react';
import {
  contestRules,
  mafiaDossiers,
  princeDossiers,
  successionFactions,
  successionOperations,
  successionPeriods,
} from '../../data/successionDossier';
import { getEntityById } from '../../data/succession/successionData';
import { EntityVisual } from './SuccessionArchivePrimitives';
import './SuccessionArchiveWorkspaces.css';

const slugify = (value = '') => String(value)
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/&/g, ' and ')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

const characterEntity = (name) => getEntityById(`character:${slugify(name)}`);
const organizationEntity = (family) => getEntityById(`organization:${slugify(family)}`);

const storyLanes = [
  {
    id: 'royal',
    title: 'Royal deathmatch',
    chapters: '349–current',
    description: 'Fourteen princes are bound to the Seed Urn ritual, indirect assassination, royal law, and the requirement to produce one successor.',
    route: 'princes',
    icon: Crown,
  },
  {
    id: 'woble',
    title: 'Kurapika, Oito, and Woble',
    chapters: '349–current',
    description: 'The weakest household builds deterrence through Nen disclosure, public classes, alliances, reconnaissance, and legal procedure.',
    route: 'characters',
    icon: Shield,
  },
  {
    id: 'nen',
    title: 'Nen information war',
    chapters: '359–current',
    description: 'Guardian Spirit Beasts, newly awakened students, curses, possession, contracts, and hidden users turn knowledge into political power.',
    route: 'nen',
    icon: Network,
  },
  {
    id: 'mafia',
    title: 'Lower-tier mafia war',
    chapters: '377–current',
    description: 'Xi-Yu and Cha-R contain Morena’s Heil-Ly network while the Phantom Troupe and Hisoka search destabilize every agreement.',
    route: 'mafia',
    icon: Swords,
  },
  {
    id: 'justice',
    title: 'Military and Justice Bureau',
    chapters: '359–current',
    description: 'Arrests, hearings, witness protection, martial law, succession immunity, and military deployments compete with the ritual’s hidden law.',
    route: 'military',
    icon: Shield,
  },
  {
    id: 'expedition',
    title: 'Dark Continent expedition',
    chapters: '340–current',
    description: 'Beyond, the Zodiacs, V6 politics, expedition personnel, and the New Continent deception remain the voyage’s larger strategic frame.',
    route: 'timeline',
    icon: MapPin,
  },
];

const statusLabel = (status) => status === 'deceased'
  ? 'Deceased'
  : status === 'exceptional'
    ? 'Exceptional body state'
    : 'Active contender';

const mafiaSlug = (family) => family.toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '');
const mafiaOperationTerms = /heil-ly|hisoka|room 3101|borksen|lower-tier|mafia/i;

export function SuccessionStoryWorkspace({ onNavigate }) {
  const activeOperations = successionOperations.filter((operation) => operation.status === 'active' || operation.status === 'unresolved');
  const headlineFactions = successionFactions.slice(0, 8);

  return <div className="succession-story-map">
    <section className="succession-story-map__hero">
      <div>
        <span>Story architecture</span>
        <h2>One voyage. Seven conflicts moving at the same time.</h2>
        <p>The Succession Contest is not a single tournament bracket. It is a royal ritual, protection mission, Nen information war, criminal conflict, legal crisis, and expedition story sharing one ship and one chapter timeline.</p>
        <div className="succession-story-map__actions">
          <button className="succession-button succession-button--primary" type="button" onClick={() => onNavigate('timeline')}>Open full timeline <ArrowRight size={14} aria-hidden="true" /></button>
          <button className="succession-button succession-button--quiet" type="button" onClick={() => onNavigate('reader')}>Read the chapters <BookOpen size={14} aria-hidden="true" /></button>
        </div>
      </div>
      <dl>
        <div><dt>Royal contenders</dt><dd>14</dd></div>
        <div><dt>Major story lanes</dt><dd>{storyLanes.length}</dd></div>
        <div><dt>Documented phases</dt><dd>{successionPeriods.length}</dd></div>
        <div><dt>Active operations</dt><dd>{activeOperations.length}</dd></div>
      </dl>
    </section>

    <section className="succession-story-map__phases" aria-labelledby="succession-story-phases-title">
      <header><span>Chronological frame</span><h3 id="succession-story-phases-title">From expedition announcement to active succession war</h3></header>
      <div>
        {successionPeriods.map((period, index) => <article key={period.name}>
          <b>{String(index + 1).padStart(2, '0')}</b>
          <span>{period.chapters} · {period.status}</span>
          <h4>{period.name}</h4>
          <p>{period.summary}</p>
          <footer>{period.focus.map((focus) => <small key={focus}>{focus}</small>)}</footer>
        </article>)}
      </div>
    </section>

    <section className="succession-story-map__lanes" aria-labelledby="succession-story-lanes-title">
      <header><span>Parallel narrative lanes</span><h3 id="succession-story-lanes-title">Follow the arc by conflict, not only by chapter</h3><p>Each lane opens the archive workspace that owns its people, rules, and evidence.</p></header>
      <div>
        {storyLanes.map((lane) => {
          const Icon = lane.icon;
          return <button type="button" key={lane.id} onClick={() => onNavigate(lane.route)}>
            <span className="succession-story-map__lane-icon"><Icon size={19} aria-hidden="true" /></span>
            <small>{lane.chapters}</small>
            <h4>{lane.title}</h4>
            <p>{lane.description}</p>
            <b>Open workspace <ArrowRight size={14} aria-hidden="true" /></b>
          </button>;
        })}
      </div>
    </section>

    <div className="succession-story-map__lower-grid">
      <section className="succession-story-map__operations" aria-labelledby="succession-story-operations-title">
        <header><span>Current pressure</span><h3 id="succession-story-operations-title">Operations still shaping the board</h3></header>
        <div>{activeOperations.slice(0, 7).map((operation) => <article key={operation.name}>
          <span>{operation.chapters} · {operation.place}</span>
          <h4>{operation.name}</h4>
          <p>{operation.summary}</p>
          <b>{operation.status}</b>
        </article>)}</div>
        <button type="button" onClick={() => onNavigate('events')}>Open all events <ArrowRight size={14} aria-hidden="true" /></button>
      </section>

      <section className="succession-story-map__rules" aria-labelledby="succession-story-rules-title">
        <header><span>Ritual and legal rules</span><h3 id="succession-story-rules-title">What constrains the contestants</h3></header>
        <div>{contestRules.slice(0, 8).map((rule) => <article key={rule.name}>
          <span>{rule.status}</span>
          <h4>{rule.name}</h4>
          <p>{rule.note}</p>
        </article>)}</div>
      </section>
    </div>

    <section className="succession-story-map__factions" aria-labelledby="succession-story-factions-title">
      <header><span>Power map</span><h3 id="succession-story-factions-title">The organizations sharing the ship</h3></header>
      <div>{headlineFactions.map((faction) => <article key={faction.name}>
        <span>{faction.territory}</span>
        <h4>{faction.name}</h4>
        <p>{faction.objective}</p>
        <footer>{faction.people.map((person) => <small key={person}>{person}</small>)}</footer>
      </article>)}</div>
    </section>
  </div>;
}

export function PrincesWorkspace({ routeParams = {}, onNavigate }) {
  const requestedEntity = routeParams.entity ? getEntityById(routeParams.entity) : null;
  const requestedOrder = Number(routeParams.prince) || princeDossiers.find((prince) => prince.name === requestedEntity?.name)?.order || null;
  const [filter, setFilter] = useState('all');
  const selected = requestedOrder ? princeDossiers.find((prince) => prince.order === requestedOrder) : null;

  const visiblePrinces = useMemo(() => princeDossiers.filter((prince) => filter === 'all' || prince.status === filter), [filter]);
  const counts = useMemo(() => ({
    active: princeDossiers.filter((prince) => prince.status === 'active').length,
    deceased: princeDossiers.filter((prince) => prince.status === 'deceased').length,
    exceptional: princeDossiers.filter((prince) => prince.status === 'exceptional').length,
  }), []);

  const openPrince = (prince) => {
    const entity = characterEntity(prince.name);
    onNavigate('princes', entity ? { entity: entity.id } : { prince: prince.order });
  };

  if (selected) {
    const entity = characterEntity(selected.name);
    const previous = princeDossiers[selected.order - 2];
    const next = princeDossiers[selected.order];
    return <article className="succession-prince-dossier">
      <header className="succession-prince-dossier__toolbar">
        <button type="button" onClick={() => onNavigate('princes')}><ArrowLeft size={16} aria-hidden="true" /> All princes</button>
        <button type="button" onClick={() => onNavigate('princes', { view: 'tree' })}><Network size={16} aria-hidden="true" /> Family tree</button>
      </header>

      <section className="succession-prince-dossier__hero">
        <div className="succession-prince-dossier__portrait"><EntityVisual entity={entity} /></div>
        <div>
          <span>{selected.order} · {statusLabel(selected.status)}</span>
          <h2>{selected.name}</h2>
          <p>{selected.strategy}</p>
          <div>
            <small>Queen {selected.mother}</small>
            <small>Room {selected.room}</small>
            <small>{selected.mafia}</small>
          </div>
        </div>
        <a href={selected.source} target="_blank" rel="noreferrer noopener">Reference <ExternalLink size={13} aria-hidden="true" /></a>
      </section>

      {selected.statusDetail && <aside className="succession-prince-dossier__status"><AlertTriangle size={18} aria-hidden="true" /><div><span>Body and contest state</span><p>{selected.statusDetail}</p></div></aside>}

      <div className="succession-prince-dossier__core">
        <section><span>Personal Nen</span><h3>Known ability state</h3><p>{selected.nen}</p></section>
        <section><span>Guardian Spirit Beast</span><h3>Parasitic Nen system</h3><p>{selected.beast}</p></section>
      </div>

      <div className="succession-prince-dossier__network">
        <section>
          <header><Users size={17} aria-hidden="true" /><div><span>Household network</span><h3>Core team and embedded actors</h3></div></header>
          <div>{selected.team.map((person) => {
            const member = characterEntity(person);
            return <button type="button" key={person} onClick={() => member && onNavigate('characters', { entity: member.id })} disabled={!member}>
              <EntityVisual entity={member} compact />
              <span>{person}</span>
            </button>;
          })}</div>
        </section>
        <section>
          <header><AlertTriangle size={17} aria-hidden="true" /><div><span>Unresolved pressure</span><h3>Threats and open questions</h3></div></header>
          <ol>{selected.pressure.map((pressure, index) => <li key={pressure}><b>{String(index + 1).padStart(2, '0')}</b><span>{pressure}</span></li>)}</ol>
        </section>
      </div>

      <footer className="succession-prince-dossier__pager">
        <button type="button" onClick={() => previous && openPrince(previous)} disabled={!previous}><ArrowLeft size={15} aria-hidden="true" /> {previous ? `${previous.order}. ${previous.short}` : 'First prince'}</button>
        <button type="button" onClick={() => next && openPrince(next)} disabled={!next}>{next ? `${next.order}. ${next.short}` : 'Last prince'} <ArrowRight size={15} aria-hidden="true" /></button>
      </footer>
    </article>;
  }

  return <section className="succession-prince-board" aria-labelledby="succession-prince-board-title">
    <header className="succession-prince-board__header">
      <div><span>Royal contest board</span><h2 id="succession-prince-board-title">Fourteen households, fourteen different survival systems</h2><p>Compare rank, queen, room, strategy, Nen, Guardian Spirit Beast, household network, and current pressure without flattening every prince into the same generic card.</p></div>
      <button type="button" className="succession-button succession-button--quiet" onClick={() => onNavigate('princes', { view: 'tree' })}><Network size={16} aria-hidden="true" /> Open family tree</button>
    </header>

    <dl className="succession-prince-board__stats">
      <div><dt>Active</dt><dd>{counts.active}</dd></div>
      <div><dt>Confirmed deceased</dt><dd>{counts.deceased}</dd></div>
      <div><dt>Exceptional state</dt><dd>{counts.exceptional}</dd></div>
      <div><dt>Total contestants</dt><dd>{princeDossiers.length}</dd></div>
    </dl>

    <div className="succession-prince-board__filters" aria-label="Filter princes by current state">
      {[
        ['all', 'All'],
        ['active', 'Active'],
        ['deceased', 'Deceased'],
        ['exceptional', 'Exceptional'],
      ].map(([id, label]) => <button type="button" className={filter === id ? 'is-active' : ''} aria-pressed={filter === id} onClick={() => setFilter(id)} key={id}>{label}</button>)}
    </div>

    <div className="succession-prince-board__grid">
      {visiblePrinces.map((prince) => {
        const entity = characterEntity(prince.name);
        return <button type="button" className={`succession-prince-card is-${prince.status}`} onClick={() => openPrince(prince)} key={prince.order}>
          <span className="succession-prince-card__rank">{String(prince.order).padStart(2, '0')}</span>
          <EntityVisual entity={entity} />
          <div className="succession-prince-card__copy">
            <span>{statusLabel(prince.status)}</span>
            <h3>{prince.short}</h3>
            <p>{prince.strategy}</p>
          </div>
          <dl>
            <div><dt>Queen</dt><dd>{prince.mother}</dd></div>
            <div><dt>Room</dt><dd>{prince.room}</dd></div>
            <div><dt>Network</dt><dd>{prince.team.length} named</dd></div>
            <div><dt>Pressure</dt><dd>{prince.pressure.length} tracked</dd></div>
          </dl>
          <footer><span>{prince.beast.includes('unknown') || prince.beast.includes('Unknown') ? 'Beast unresolved' : 'Beast documented'}</span><b>Open dossier <ArrowRight size={14} aria-hidden="true" /></b></footer>
        </button>;
      })}
    </div>
  </section>;
}

export function MafiaWorkspace({ routeParams = {}, onNavigate }) {
  const initialFocus = routeParams.focus || '';
  const [focus, setFocus] = useState(initialFocus);
  const selected = mafiaDossiers.find((family) => mafiaSlug(family.family) === focus) || null;
  const operations = successionOperations.filter((operation) => mafiaOperationTerms.test(`${operation.name} ${operation.summary}`));

  const openFamily = (family) => {
    const slug = mafiaSlug(family.family);
    setFocus(slug);
    onNavigate('mafia', { focus: slug });
  };

  return <div className="succession-mafia-workspace">
    <section className="succession-mafia-workspace__hero">
      <div><span>Lower-tier power map</span><h2>Three mafia families and one war for the ship’s hidden routes</h2><p>Xi-Yu and Cha-R are established Kakin institutions tied to royal sponsors. Morena’s Heil-Ly rejects that order, turns murder into Nen progression, and forces the mafia, military, and Phantom Troupe into unstable cooperation.</p></div>
      <dl>
        <div><dt>Families</dt><dd>{mafiaDossiers.length}</dd></div>
        <div><dt>Named members</dt><dd>{mafiaDossiers.reduce((total, family) => total + family.members.length, 0)}</dd></div>
        <div><dt>Tracked operations</dt><dd>{operations.length}</dd></div>
      </dl>
    </section>

    <section className="succession-mafia-workspace__conflict" aria-label="Mafia conflict structure">
      <article><span>Established order</span><h3>Xi-Yu</h3><p>Zhang Lei sponsorship · Tier 4 operations</p></article>
      <div><Swords size={20} aria-hidden="true" /><span>containment, territory, Hisoka search</span></div>
      <article className="is-hostile"><span>Revolutionary threat</span><h3>Heil-Ly</h3><p>Contagion · hidden band · murder leveling</p></article>
      <div><Swords size={20} aria-hidden="true" /><span>Troupe cooperation, route breach</span></div>
      <article><span>Established order</span><h3>Cha-R</h3><p>Luzurus sponsorship · Tier 5 logistics</p></article>
    </section>

    <section className="succession-mafia-workspace__families" aria-labelledby="succession-mafia-families-title">
      <header><span>Family comparison</span><h3 id="succession-mafia-families-title">Leadership, territory, objectives, and risk</h3></header>
      <div>{mafiaDossiers.map((family) => {
        const organization = organizationEntity(family.family);
        const active = selected?.family === family.family;
        return <article className={`${mafiaSlug(family.family)}${active ? ' is-selected' : ''}`} key={family.family}>
          <header>
            <EntityVisual entity={organization} compact />
            <div><span>{family.sponsor}</span><h4>{family.family} Family</h4><p><MapPin size={13} aria-hidden="true" /> {family.base}</p></div>
          </header>
          <dl><div><dt>Leadership</dt><dd>{family.leadership.length}</dd></div><div><dt>Indexed members</dt><dd>{family.members.length}</dd></div></dl>
          <section><span>Objectives</span><ul>{family.objectives.map((objective) => <li key={objective}>{objective}</li>)}</ul></section>
          <section><span>Risks</span><ul>{family.risks.map((risk) => <li key={risk}>{risk}</li>)}</ul></section>
          <button type="button" onClick={() => openFamily(family)}>{active ? 'Dossier open' : 'Open family dossier'} <ArrowRight size={14} aria-hidden="true" /></button>
        </article>;
      })}</div>
    </section>

    {selected && <section className="succession-mafia-workspace__dossier" aria-labelledby="succession-mafia-dossier-title">
      <header>
        <div><span>Selected family</span><h3 id="succession-mafia-dossier-title">{selected.family} command and membership</h3></div>
        <button type="button" onClick={() => { setFocus(''); onNavigate('mafia'); }}>Close dossier</button>
      </header>
      <div className="succession-mafia-workspace__leadership">
        {selected.leadership.map((person) => {
          const entity = characterEntity(person);
          return <button type="button" disabled={!entity} onClick={() => entity && onNavigate('characters', { entity: entity.id })} key={person}>
            <EntityVisual entity={entity} compact />
            <span>{person}</span>
          </button>;
        })}
      </div>
      <div className="succession-mafia-workspace__members">
        <span>Complete indexed roster</span>
        <div>{selected.members.map((member) => <small key={member}>{member}</small>)}</div>
      </div>
      <footer><a href={selected.source} target="_blank" rel="noreferrer noopener">Open family reference <ExternalLink size={13} aria-hidden="true" /></a></footer>
    </section>}

    <section className="succession-mafia-workspace__operations" aria-labelledby="succession-mafia-operations-title">
      <header><span>Conflict ledger</span><h3 id="succession-mafia-operations-title">Operations driving the lower-tier war</h3></header>
      <div>{operations.map((operation) => <article key={operation.name}>
        <span>{operation.chapters} · {operation.place}</span>
        <h4>{operation.name}</h4>
        <p>{operation.summary}</p>
        <b>{operation.status}</b>
      </article>)}</div>
      <button type="button" onClick={() => onNavigate('events')}>Open the complete event archive <ArrowRight size={14} aria-hidden="true" /></button>
    </section>
  </div>;
}
