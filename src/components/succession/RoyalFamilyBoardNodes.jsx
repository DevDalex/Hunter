import { useEffect, useState } from 'react';
import { ArrowRight, Building2 } from 'lucide-react';
import { getOrganizationMembers } from '../../data/succession/successionData';
import SafeImage from '../SafeImage';
import {
  abilityLabelFor, beastForHost, entityForName, initials, intelligenceKinds, mafiaConnections, networkKindLabel,
  organizationForName, personSummary, placementKinds, statusLabel,
} from './RoyalFamilyBoardModel';

export function Portrait({ name, entity, compact = false, eager = false }) {
  const portrait = entity?.media?.portrait || '';
  const [available, setAvailable] = useState(Boolean(portrait));

  useEffect(() => setAvailable(Boolean(portrait)), [portrait]);

  if (!portrait || !available) {
    return <span className={`royal-guard-tree__fallback${compact ? ' is-compact' : ''}`} role="img" aria-label={`${name} portrait unavailable`}>{initials(name)}</span>;
  }

  return <span className={`succession-entity-visual${compact ? ' is-compact' : ''}`} data-has-visual="true">
    <SafeImage
      src={portrait}
      media={entity.media}
      fallbackLabel=""
      alt={`${name} archive portrait`}
      eager={eager}
      onAvailabilityChange={setAvailable}
    />
  </span>;
}

export function BeastLayer({ beast }) {
  if (!beast?.image) {
    return <span className="royal-board__beast-layer is-unknown" aria-hidden="true"><b>?</b><small>Beast unrevealed</small></span>;
  }

  return <span className="royal-board__beast-layer" aria-hidden="true">
    <SafeImage src={beast.image} alt="" fallbackLabel="" />
  </span>;
}

export function HoverCard({ eyebrow, name, description, facts = [], meta }) {
  return <span className="royal-board__hover-card" role="tooltip">
    <small>{eyebrow}</small>
    <strong>{name}</strong>
    <span>{description}</span>
    {!!facts.length && <span className="royal-board__hover-facts">{facts.filter((fact) => fact?.[1]).map(([label, value]) => <span key={`${label}-${value}`}><b>{label}</b><span>{value}</span></span>)}</span>}
    {meta && <em>{meta}</em>}
  </span>;
}

export function MafiaCard({ connection, lockedKey, setLockedKey, activeMafiaKey, setActiveMafiaKey, activePrinceOrder, setActivePrinceOrder, setHoveredKey, openEntity }) {
  const organization = organizationForName(connection.name);
  const leader = entityForName(connection.leader);
  const members = organization ? getOrganizationMembers(organization.id).slice(0, 4) : [];
  const organizationKey = `mafia:${connection.key}`;
  const memberPrefix = `mafia-member:${connection.key}:`;
  const locked = lockedKey === organizationKey;
  const memberLocked = lockedKey?.startsWith(memberPrefix);
  const active = activeMafiaKey === connection.key || activePrinceOrder === connection.princeOrder || locked || memberLocked;
  const activate = (key) => {
    setActiveMafiaKey(connection.key);
    setActivePrinceOrder(connection.princeOrder);
    setHoveredKey(key);
  };
  const release = () => {
    setActiveMafiaKey(null);
    setActivePrinceOrder(null);
    setHoveredKey(null);
  };

  return <article className={`royal-board__mafia-card is-${connection.key}${active ? ' is-active' : ''}${locked || memberLocked ? ' is-locked' : ''}`}>
    <button
      type="button"
      className={`royal-board__mafia-summary${locked ? ' is-locked' : ''}`}
      aria-pressed={locked}
      onMouseEnter={() => activate(organizationKey)}
      onMouseLeave={release}
      onFocus={() => activate(organizationKey)}
      onBlur={release}
      onClick={() => setLockedKey(locked ? null : organizationKey)}
    >
      <Portrait name={connection.leader} entity={leader} compact />
      <span><small>Linked to Prince {connection.princeOrder}</small><strong>{connection.name}</strong><em>{connection.leader}</em></span>
      <HoverCard eyebrow="Mafia relationship" name={connection.name} description={connection.relation} facts={[["Leader", connection.leader], ["Leader ability", abilityLabelFor(leader)], ["Members", members.map(({ character }) => character.name).join(', ') || 'See organization dossier'], ["Royal link", `Prince ${connection.princeOrder}`], ["Record", organization ? 'Organization dossier available' : 'Relationship record']]} meta="Hover highlights the connected royal dossier" />
    </button>

    {!!members.length && <div className="royal-board__mafia-members" aria-label={`${connection.name} documented members`}>
      {members.map(({ character }) => {
        const memberKey = `${memberPrefix}${character.id}`;
        const isLocked = lockedKey === memberKey;
        return <button
          type="button"
          className={isLocked ? 'is-locked' : ''}
          aria-pressed={isLocked}
          onMouseEnter={() => activate(memberKey)}
          onMouseLeave={release}
          onFocus={() => activate(memberKey)}
          onBlur={release}
          onClick={() => setLockedKey(isLocked ? null : memberKey)}
          key={character.id}
        >
          <Portrait name={character.name} entity={character} compact />
          <small>{character.name}</small>
          <HoverCard eyebrow={connection.name} name={character.name} description={personSummary(character, `Documented member of ${connection.name}.`)} facts={[["Royal link", `Prince ${connection.princeOrder}`], ["Role", (character.roles || []).join(' · ') || 'Mafia member'], ["Nen / ability", abilityLabelFor(character)], ["Relationship", connection.relation]]} meta={character.id ? 'Canonical profile available' : 'Organization record'} />
        </button>;
      })}
    </div>}

    {organization && <button type="button" className="royal-board__mafia-open" onClick={() => openEntity(organization)}>Open organization <ArrowRight size={11} aria-hidden="true" /></button>}
  </article>;
}

function GuardTile({ guard, prince, index, lockedKey, setLockedKey, setActivePrinceOrder, setHoveredKey }) {
  const key = `guard:${guard.id}`;
  const locked = lockedKey === key;
  const facts = [
    ['Connected to', prince.short],
    ['Category', networkKindLabel(guard.kind)],
    ['Nen / ability', abilityLabelFor(guard.entity)],
    ['Record', guard.entity ? 'Canonical profile' : guard.count ? `${guard.count} documented members` : 'Group-level record'],
  ];

  return <button
    type="button"
    className={`royal-board__guard-tile is-${guard.kind}${guard.isGroup ? ' is-group' : ''}${locked ? ' is-locked' : ''}`}
    aria-label={`${guard.name}. ${guard.eyebrow}`}
    aria-pressed={locked}
    onMouseEnter={() => { setActivePrinceOrder(prince.order); setHoveredKey(key); }}
    onMouseLeave={() => { setActivePrinceOrder(null); setHoveredKey(null); }}
    onFocus={() => { setActivePrinceOrder(prince.order); setHoveredKey(key); }}
    onBlur={() => { setActivePrinceOrder(null); setHoveredKey(null); }}
    onClick={() => setLockedKey(locked ? null : key)}
  >
    <Portrait name={guard.name} entity={guard.entity} compact />
    <span>{String(index + 1).padStart(2, '0')}</span>
    <strong>{guard.name}</strong>
    <HoverCard eyebrow={guard.eyebrow} name={guard.name} description={guard.description} facts={facts} meta={guard.entity ? 'Canonical profile available' : 'Documented group record'} />
  </button>;
}

export function PrinceDossier({ prince, guards, selectedOrder, setSelectedOrder, lockedKey, setLockedKey, activePrinceOrder, setActivePrinceOrder, setHoveredKey, activeMafiaKey, openEntity }) {
  const entity = entityForName(prince.name);
  const beast = beastForHost(prince.short);
  const identityKey = `prince:${prince.order}`;
  const locked = lockedKey === identityKey;
  const selected = selectedOrder === prince.order;
  const mafia = mafiaConnections.find((connection) => connection.princeOrder === prince.order);
  const mafiaActive = Boolean(activeMafiaKey && mafia?.key === activeMafiaKey);
  const related = activePrinceOrder === prince.order || mafiaActive || selected;
  const direct = guards.filter((guard) => guard.kind === 'protection' && !guard.isGroup).length;
  const placed = guards.filter((guard) => placementKinds.has(guard.kind)).length;
  const intelligence = guards.filter((guard) => intelligenceKinds.has(guard.kind)).length;

  return <article className={`royal-board__prince-card is-${prince.status}${related ? ' is-related' : ''}${selected ? ' is-selected' : ''}`} data-prince-order={prince.order} data-mafia={mafia?.key || undefined}>
    <BeastLayer beast={beast} />
    <button
      type="button"
      className={`royal-board__prince-identity${locked ? ' is-locked' : ''}`}
      aria-pressed={selected}
      onMouseEnter={() => { setActivePrinceOrder(prince.order); setHoveredKey(identityKey); }}
      onMouseLeave={() => { setActivePrinceOrder(null); setHoveredKey(null); }}
      onFocus={() => { setActivePrinceOrder(prince.order); setHoveredKey(identityKey); }}
      onBlur={() => { setActivePrinceOrder(null); setHoverdKey(null); }}
      onClick={() => { setSelectedOrder(prince.order); setLockedKey(locked ? null : identityKey); }}
    >
      <span className="royal-board__prince-number">{prince.order}</span>
      <Portrait name={prince.name} entity={entity} compact eager={prince.order <= 4} />
      <span className="royal-board__prince-copy">
        <small>{statusLabel(prince.status)}</small>
        <strong>{prince.short}</strong>
        <em>Queen {prince.mother}</em>
      </span>
      {prince.status === 'deceased' && <span className="royal-board__death-mark" aria-hidden="true" />}
      <HoverCard
        eyebrow={`${prince.order}${prince.order === 1 ? 'st' : prince.order === 2 ? 'nd' : prince.order === 3 ? 'rd' : 'th'} Prince`}
        name={prince.name}
        description={prince.strategy}
        facts={[
          ['Guardian beast', beast?.ability || prince.beast],
          ['Nen / ability', prince.nen],
          ['Mother', `Queen ${prince.mother}`],
          ['Room', prince.room],
          ['Mafia', prince.mafia],
        ]}
        meta="Click to lock this dossier preview"
      />
    </button>

    <div className="royal-board__prince-essentials">
      <span><b>Beast</b>{beast?.knowledge || 'Unknown'}</span>
      <span><b>Guards</b>{guards.length}</span>
      <span><b>Room</b>{prince.room.split(' / ')[0]}</span>
    </div>

    {mafia && <button
      type="button"
      className={`royal-board__mafia-link is-${mafia.key}${mafiaActive ? ' is-active' : ''}`}
      onMouseEnter={() => setActivePrinceOrder(prince.order)}
      onMouseLeave={() => setActivePrinceOrder(null)}
      onFocus={() => setActivePrinceOrder(prince.order)}
      onBlur={() => setActivePrinceOrder(null)}
      onClick={() => setSelectedOrder(prince.order)}
    ><Building2 size={12} aria-hidden="true" /> {mafia.name}</button>}

    <div className="royal-board__guard-grid" aria-label={`${prince.short} protection and intelligence circle`}>
      {guards.map((guard, index) => <GuardTile
        key={guard.id}
        guard={guard}
        prince={prince}
        index={index}
        lockedKey={lockedKey}
        setLockedKey={setLockedKey}
        setActivePrinceOrder={setActivePrinceOrder}
        setHoveredKey={setHoveredKey}
      />)}
    </div>

    <footer>
      <span {direct} direct · {placed} placed/allied · {intelligence} intelligence</span>
      {entity && <button type="button" onClick={() => openEntity(entity)}>Open dossier <ArrowRight size={12} aria-hidden="true" /></button>}
    </footer>
  </article>;
}
