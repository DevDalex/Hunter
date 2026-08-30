import { useEffect, useMemo, useState } from 'react';
import {
  getEntitiesByType,
  getEntityById,
  getRoyalHouseholdMatrix,
} from '../../data/succession/successionData';
import { successionRoster, successionRosterGroups } from '../../data/successionRoster';
import './SuccessionCharacterCourtMap.css';

const troupeNames = new Set([
  'Chrollo Lucilfer',
  'Nobunaga Hazama',
  'Feitan Portor',
  'Machi Komacine',
  'Phinks Magcub',
  'Franklin Bordeau',
  'Shizuku Murasaki',
  'Bonolenov Ndongo',
  'Illumi Zoldyck',
  'Kalluto Zoldyck',
]);

const normalized = (value) => String(value || '')
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLocaleLowerCase()
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();

const portraitByName = new Map(successionRoster.map((record) => [normalized(record.name), record]));

const entityLabel = (entity) => entity?.name || entity?.title || entity?.label || entity?.id || 'Unknown';
const initial = (entity) => entityLabel(entity).replace(/[^A-Za-z0-9]/g, '').slice(0, 1).toUpperCase() || '?';
const ordinal = (value) => {
  const number = Number(value);
  if (number % 100 >= 11 && number % 100 <= 13) return `${number}th`;
  if (number % 10 === 1) return `${number}st`;
  if (number % 10 === 2) return `${number}nd`;
  if (number % 10 === 3) return `${number}rd`;
  return `${number}th`;
};
const safe = (factory, fallback = []) => {
  try { return factory(); } catch { return fallback; }
};

function portraitRecordFor(entity) {
  if (!entity) return null;
  const direct = portraitByName.get(normalized(entityLabel(entity)));
  if (direct) return direct;
  const compactName = normalized(entityLabel(entity).replace(/ Hui Guo Rou$/i, ''));
  return successionRoster.find((record) => normalized(record.name).startsWith(compactName)) || null;
}

function Portrait({ entity, className = '', eager = false }) {
  const record = portraitRecordFor(entity);
  return <span className={`court-portrait ${className}`.trim()} aria-label={entityLabel(entity)}>
    <span className="court-portrait__fallback" aria-hidden="true">{initial(entity)}</span>
    {record?.image && <img
      src={record.image}
      alt=""
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={(event) => { event.currentTarget.style.display = 'none'; }}
    />}
  </span>;
}

function householdFromRow(row) {
  const prince = getEntityById(row.character?.id);
  const queen = getEntityById(row.biologicalMotherId);
  const personnel = (row.personnelIds || [])
    .map((id) => getEntityById(id))
    .filter((entity) => entity?.entityType === 'character' && entity.id !== prince?.id);
  return { ...row, prince, queen, personnel };
}

function CourtMiniature({ household, active, onSelect }) {
  const visiblePersonnel = household.personnel.slice(0, 6);
  const overflow = Math.max(0, household.personnel.length - visiblePersonnel.length);
  return <button
    type="button"
    className={`character-court-miniature ${active ? 'is-active' : ''}`}
    onClick={() => onSelect(household.prince.id)}
    aria-pressed={active}
  >
    <span className="character-court-miniature__queen">
      <Portrait entity={household.queen} />
      <span><small>{household.queen?.queenRank || 'Royal household'}</small><strong>{entityLabel(household.queen)}</strong></span>
    </span>
    <span className="character-court-miniature__formation" aria-hidden="true">
      {visiblePersonnel.map((person, index) => <span className={`character-court-miniature__satellite slot-${index}`} key={person.id}><Portrait entity={person} /></span>)}
      <Portrait entity={household.prince} className="character-court-miniature__prince" />
      {!!overflow && <span className="character-court-miniature__overflow">+{overflow}</span>}
    </span>
    <span className="character-court-miniature__identity">
      <small>{ordinal(household.order)} Prince</small>
      <strong>{entityLabel(household.prince)}</strong>
      <em>{household.personnel.length ? `${household.personnel.length} active court personnel` : 'No active personnel indexed'}</em>
    </span>
  </button>;
}

function FocusedCourt({ household, king, chapter }) {
  if (!household) return null;
  const personnel = household.personnel.slice(0, 10);
  const extra = Math.max(0, household.personnel.length - personnel.length);
  const location = getEntityById(household.locationId);
  const beast = getEntityById(household.guardianBeastId);

  return <section className="character-focused-court" aria-labelledby="focused-court-title">
    <div className="character-focused-court__authority">
      <span className="character-focused-court__authority-label">Royal authority</span>
      <Portrait entity={king} />
      <span><strong>{entityLabel(king)}</strong><small>King of Kakin</small></span>
    </div>

    <div className="character-focused-court__queen">
      <Portrait entity={household.queen} />
      <span><small>{household.queen?.queenRank || 'Queen'}</small><strong>{entityLabel(household.queen)}</strong></span>
    </div>

    <div className="character-focused-court__stage">
      <div className="character-focused-court__formation">
        {personnel.map((person, index) => <figure className={`character-focused-court__personnel focus-slot-${index}`} key={person.id}>
          <Portrait entity={person} />
          <figcaption>{entityLabel(person)}</figcaption>
        </figure>)}
        <div className="character-focused-court__prince">
          <Portrait entity={household.prince} eager />
          <small>{ordinal(household.order)} Prince</small>
          <h2 id="focused-court-title">{entityLabel(household.prince)}</h2>
          <p>{household.personnel.length} active personnel in this court at Chapter {chapter}</p>
        </div>
        {!!extra && <span className="character-focused-court__extra">+{extra}<small>more</small></span>}
      </div>
    </div>

    <aside className="character-focused-court__brief">
      <span>Current picture</span>
      <dl>
        <div><dt>Status</dt><dd>{String(household.life || 'unknown').replaceAll('-', ' ')}</dd></div>
        <div><dt>Location</dt><dd>{entityLabel(location)}</dd></div>
        <div><dt>Nen records</dt><dd>{household.abilityIds?.length || 0}</dd></div>
        <div><dt>Threat signals</dt><dd>{household.threatIds?.length || 0}</dd></div>
        <div><dt>Guardian Beast</dt><dd>{beast ? entityLabel(beast) : 'Not indexed / unresolved'}</dd></div>
      </dl>
    </aside>
  </section>;
}

function PowerCenter({ title, eyebrow, members }) {
  const visible = members.filter(Boolean).slice(0, 7);
  return <article className="character-power-center">
    <header><small>{eyebrow}</small><h3>{title}</h3></header>
    <div className="character-power-center__people">
      {visible.map((member, index) => <figure key={`${title}:${member.name}`} className={index === 0 ? 'is-lead' : ''}>
        <Portrait entity={{ name: member.name }} />
        <figcaption>{member.name}</figcaption>
      </figure>)}
    </div>
  </article>;
}

export default function SuccessionCharacterCourtMap({ requestedState = {}, spoilerLimit, onNavigate }) {
  const chapter = Number(requestedState.chapter || spoilerLimit) || 410;
  const households = useMemo(() => safe(() => getRoyalHouseholdMatrix(chapter), []).map(householdFromRow).filter((row) => row.prince), [chapter]);
  const king = useMemo(() => safe(() => getEntitiesByType('character'), []).find((entity) => (entity.roles || []).includes('king') || /Nasubi/i.test(entityLabel(entity))) || null, []);

  const requestedPrince = households.find((row) => row.prince.id === requestedState.entity)?.prince.id;
  const defaultPrince = households.find((row) => /Woble/i.test(entityLabel(row.prince)))?.prince.id || households[0]?.prince.id || '';
  const [selectedId, setSelectedId] = useState(requestedPrince || defaultPrince);

  useEffect(() => {
    if (requestedPrince) setSelectedId(requestedPrince);
  }, [requestedPrince]);

  const selected = households.find((row) => row.prince.id === selectedId) || households[0] || null;

  const powerCenters = useMemo(() => {
    const group = (id) => successionRosterGroups.find((record) => record.id === id);
    const returning = group('returning')?.members || [];
    return [
      { title: 'Xi-Yu', eyebrow: 'Mafia power center', members: group('xi-yu')?.members || [] },
      { title: 'Heil-Ly', eyebrow: 'Mafia power center', members: group('heil-ly')?.members || [] },
      { title: 'Cha-R', eyebrow: 'Mafia power center', members: group('cha-r')?.members || [] },
      { title: 'Phantom Troupe', eyebrow: 'Independent power center', members: returning.filter((member) => troupeNames.has(member.name)) },
    ];
  }, []);

  const selectCourt = (id) => {
    setSelectedId(id);
    onNavigate?.('characters', { entity: id, chapter });
  };

  return <main className="character-field">
    <header className="character-field__intro">
      <div>
        <span>Succession Contest · Character field</span>
        <h1>Characters</h1>
        <p>People are arranged by the political space they occupy. Princes anchor their own courts, active personnel surround them, and the major outside power centers remain visible without forcing every relationship into one giant graph.</p>
      </div>
      <div className="character-field__chapter"><small>Archive state</small><strong>Chapter {chapter}</strong><span>{households.length} royal courts</span></div>
    </header>

    <FocusedCourt household={selected} king={king} chapter={chapter} />

    <section className="character-court-landscape" aria-labelledby="court-landscape-title">
      <header>
        <div><span>Royal landscape</span><h2 id="court-landscape-title">Fourteen courts, one field</h2></div>
        <p>Select a Prince to bring that court forward. Queen affiliation stays visible as context, but the court itself is the navigational unit.</p>
      </header>
      <div className="character-court-landscape__grid">
        {households.map((household) => <CourtMiniature key={household.prince.id} household={household} active={selected?.prince.id === household.prince.id} onSelect={selectCourt} />)}
      </div>
    </section>

    <section className="character-power-centers" aria-labelledby="power-centers-title">
      <header>
        <div><span>Outside the royal rooms</span><h2 id="power-centers-title">Other power centers</h2></div>
        <p>These groups occupy the same character field without pretending they belong to the royal household structure.</p>
      </header>
      <div className="character-power-centers__grid">
        {powerCenters.map((center) => <PowerCenter key={center.title} {...center} />)}
      </div>
    </section>
  </main>;
}
