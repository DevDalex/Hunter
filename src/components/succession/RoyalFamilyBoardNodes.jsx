import { useEffect, useState } from 'react';
import { ArrowRight, Building2 } from 'lucide-react';
import { getOrganizationMembers } from '../../data/succession/successionData';
import SafeImage from '../SafeImage';
import {
  abilityLabelFor, beastForHost, dossierByOrder, entityForName, initials, intelligenceKinds, mafiaConnections,
  networkKindLabel, normalizeLookup, organizationForName, personSummary, placementKinds, statusLabel,
} from './RoyalFamilyBoardModel';

export const tooltipIdFor = (key) => `royal-preview-${String(key).replace(/[^a-z0-9]+/gi, '-')}`;

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
  const image = beast?.image || '';
  const [available, setAvailable] = useState(Boolean(image));

  useEffect(() => setAvailable(Boolean(image)), [image]);

  if (!image || !available) {
    const label = image ? 'Beast image unavailable' : 'Beast unrevealed';
    return <span className="royal-board__beast-layer is-unknown" aria-hidden="true"><b>?</b><small>{label}</small></span>;
  }

  return <span className="royal-board__beast-layer" aria-hidden="true">
    <SafeImage src={image} alt="" fallbackLabel="" onAvailabilityChange={setAvailable} />
  </span>;
}

export function HoverCard({ id, eyebrow, name, description, facts = [], meta }) {
  return <span id={id} className="royal-board__hover-card" role="tooltip">
    <small>{eyebrow}</small>
    <strong>{name}</strong>
    <span>{description}</span>
    {!!facts.length && <span className="royal-board__hover-facts">{facts.filter((fact) => fact?.[1]).map(([label, value]) => <span key={`${label}-${value}`}><b>{label}</b><span>{value}</span></span>)}</span>}
    {meta && <em>{meta}</em>}
  </span>;
}

export function MafiaCard({ connection, lockedKey, setLockedKey, activeMafiaKey, setActiveMafiaKey, activePrinceOrder, setActivePrinceOrder, openEntity }) {
  const organization = organizationForName(connection.name);
  const leader = entityForName(connection.leader);
  const connectedPrince = dossierByOrder.get(connection.princeOrder);
  const excludedNames = new Set([connection.leader, connectedPrince?.name, connectedPrince?.short].filter(Boolean).map(normalizeLookup));
  const members = organization
    ? getOrganizationMembers(organization.id)
      .filter(({ character }) => character && !excludedNames.has(normalizeLookup(character.name)))
      .slice(0, 4)
    : [];
  const organizationKey = `mafia:${connection.key}`;
  const organizationTooltipId = tooltipIdFor(organizationKey);
  const memberPrefix = `mafia-member:${connection.key}:`;
  const locked = lockedKey === organizationKey;
  const memberLocked = lockedKey?.startsWith(memberPrefix);
  const active = activeMafiaKey === connection.key || activePrinceOrder === connection.princeOrder || locked || memberLocked;
  const activate = () => {
    setActiveMafiaKey(connection.key);
    setActivePrinceOrder(connection.princeOrder);
  };
  const release = () => {
    setActiveMafiaKey(null);
    setActivePrinceOrder(null);
  };

  return <article className={`royal-board__mafia-card is-${connection.key}${active ? ' is-active' : ''}${locked || memberLocked ? ' is-locked' : ''}`}>
    <button
      type="button"
      className={`royal-board__mafia-summary${locked ? ' is-locked' : ''}`}
      aria-label={`${connection.name}, led by ${connection.leader}, linked to Prince ${connection.princeOrder}`}
      aria-pressed={locked}
      aria-describedby={organizationTooltipId}
      onMouseEnter={activate}
      onMouseLeave={release}
      onFocus={activate}
      onBlur={release}
      onClick={() => setLockedKey(locked ? null : organizationKey)}
    >
      <Portrait name={connection.leader} entity={leader} compact />
      <span><small>Linked to Prince {connection.princeOrder}</small><strong>{connection.name}</strong><em>{connection.leader}</em></span>
      <HoverCard id={organizationTooltipId} eyebrow="Mafia relationship" name={connection.name} description={connection.relation} facts={[["Leader", connection.leader], ["Leader ability", abilityLabelFor(leader)], ["Members", members.map(({ character }) => character.name).join(', ') || 'See organization dossier'], ["Royal link", `Prince ${connection.princeOrder}`], ["Record", organization ? 'Organization dossier available' : 'Relationship record']]} meta="Hover highlights the connected royal dossier" />
    </button>

    {!!members.length && <div className="royal-board__mafia-members" aria-label={`${connection.name} documented members`}>
      {members.map(({ character }) => {
        const memberKey = `${memberPrefix}${character.id}`;
        const memberTooltipId = tooltipIdFor(memberKey);
        const isLocked = lockedKey === memberKey;
        return <button
          type="button"
          className={isLocked ? 'is-locked' : ''}
          aria-label={`${character.name}, ${connection.name} member`}
          aria-pressed={isLocked}
          aria-describedby={memberTooltipId}
          onMouseEnter={activate}
          onMouseLeave={release}
          onFocus={activate}
          onBlur={release}
          onClick={() => setLockedKey(isLocked ? null : memberKey)}
          key={character.id}
        >
          <Portrait name={character.name} entity={character} compact />
          <small>{character.name}</small>
          <HoverCard id={memberTooltipId} eyebrow={connection.name} name={character.name} description={personSummary(character, `Documented member of ${connection.name}.`)} facts={[["Royal link", `Prince ${connection.princeOrder}`], ["Role", (character.roles || []).join(' · ') || 'Mafia member'], ["Nen / ability", abilityLabelFor(character)], ["Relationship", connection.relation]]} meta={character.id ? 'Canonical profile available' : 'Organization record'} />
        </button>;
      })}
    </div>}

    {organization && <button type="button" className="royal-board__mafia-open" onClick={() => openEntity(organization)}>Open organization <ArrowRight size={11} aria-hidden="true" /></button>}
  </article>;
}

function GuardTile({ guard, prince, index, lockedKey, setLockedKey, setActivePrinceOrder }) {
  const key = `guard:${guard.id}`;
  const tooltipId = tooltipIdFor(key);
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
    aria-describedby={tooltipId}
    onMouseEnter={() => setActivePrinceOrder(prince.order)}
    onMouseLeave={() => setActivePrinceOrder(null)}
    onFocus={() => setActivePrinceOrder(prince.order)}
    onBlur={() => setActivePrinceOrder(null)}
    onClick={() => setLockedKey(locked ? null : key)}
  >
    <Portrait name={guard.name} entity={guard.entity} compact />
    <span>{String(index + 1).padStart(2, '0')}</span>
    <strong>{guard.name}</strong>
    <HoverCard id={tooltipId} eyebrow={guard.eyebrow} name={guard.name} description={guard.description} facts={facts} meta={guard.entity ? 'Canonical profile available' : 'Documented group record'} />
  </button>;
}

export function PrinceDossier({ prince, guards, selectedOrder, setSelectedOrder, lockedKey, setLockedKey, activePrinceOrder, setActivePrinceOrder, activeMafiaKey, openPrince }) {
  const entity = entityForName(prince.name);
  const beast = beastForHost(prince.short);
  const identityKey = `prince:${prince.order}`;
  const tooltipId = tooltipIdFor(identityKey);
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
      aria-label={`${prince.order} Prince ${prince.name}. ${statusLabel(prince.status)}`}
      aria-pressed={locked}
      aria-current={selected ? 'true' : undefined}
      aria-describedby={tooltipId}
      onMouseEnter={() => setActivePrinceOrder(prince.order)}
      onMouseLeave={() => setActivePrinceOrder(null)}
      onFocus={() => setActivePrinceOrder(prince.order)}
      onBlur={() => setActivePrinceOrder(null)}
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
        id={tooltipId}
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
      />)}
    </div>

    <footer>
      <span>{direct} direct · {placed} placed/allied · {intelligence} intelligence</span>
      <button type="button" onClick={() => openPrince(prince)}>Open dossier <ArrowRight size={12} aria-hidden="true" /></button>
    </footer>
  </article>;
}
