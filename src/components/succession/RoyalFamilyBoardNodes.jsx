import { useEffect, useId, useState } from 'react';
import { ArrowRight, Building2, Pin, PinOff } from 'lucide-react';
import SafeImage from '../SafeImage';
import { beastForHost, initials, networkKindLabel, statusLabel } from './RoyalFamilyBoardModel';

function triggerProps({ record, active, pinned, onPreview, onClear, onPin }) {
  return {
    'aria-controls': 'royal-map-inspector',
    'aria-pressed': pinned,
    className: `${active ? 'is-active ' : ''}${pinned ? 'is-pinned' : ''}`.trim(),
    onMouseEnter: () => onPreview(record),
    onMouseLeave: onClear,
    onFocus: () => onPreview(record),
    onBlur: onClear,
    onClick: () => onPin(record),
  };
}

export function Portrait({ name, entity, compact = false, eager = false }) {
  const portrait = entity?.media?.portrait || entity?.image || entity?.imageSource || '';
  const [available, setAvailable] = useState(Boolean(portrait));
  useEffect(() => setAvailable(Boolean(portrait)), [portrait]);

  if (!portrait || !available) {
    return <span className={`royal-map__portrait-fallback${compact ? ' is-compact' : ''}`} role="img" aria-label={`${name} portrait unavailable`}>{initials(name)}</span>;
  }

  return <span className={`royal-map__portrait${compact ? ' is-compact' : ''}`}>
    <SafeImage
      src={portrait}
      media={entity?.media}
      fallbackLabel=""
      alt={`${name} archive portrait`}
      eager={eager}
      onAvailabilityChange={setAvailable}
    />
  </span>;
}

export function BeastBackdrop({ beast }) {
  const [available, setAvailable] = useState(Boolean(beast?.image));
  useEffect(() => setAvailable(Boolean(beast?.image)), [beast?.image]);
  if (!beast?.image || !available) return <span className="royal-map__beast is-unavailable" aria-hidden="true">?</span>;
  return <span className="royal-map__beast" aria-hidden="true">
    <SafeImage src={beast.image} alt="" fallbackLabel="" onAvailabilityChange={setAvailable} />
  </span>;
}

export function KingMapNode({ record, beast, active, pinned, onPreview, onClear, onPin }) {
  const props = triggerProps({ record, active, pinned, onPreview, onClear, onPin });
  return <button
    type="button"
    {...props}
    className={`royal-map__king ${props.className}`}
  >
    <span className="royal-map__king-rank">King</span>
    <Portrait name={record.name} entity={record.entity} eager />
    <span className="royal-map__king-copy">
      <small>King of Kakin</small>
      <strong>{record.name}</strong>
      <em>Father of the fourteen legitimate princes</em>
    </span>
    <BeastBackdrop beast={beast} />
  </button>;
}

export function QueenMapNode({ branch, position, active, pinned, onPreview, onClear, onPin }) {
  if (!position) return null;
  const props = triggerProps({ record: branch.record, active, pinned, onPreview, onClear, onPin });
  const rank = branch.order.match(/\d+/)?.[0] || '?';
  return <button
    type="button"
    {...props}
    className={`royal-map__queen-node ${props.className}`}
    style={{ left: position.x, top: position.y }}
    data-queen={branch.short}
  >
    <span className="royal-map__queen-rank">{rank}</span>
    <Portrait name={branch.record.name} entity={branch.record.entity} compact />
    <span className="royal-map__queen-copy">
      <small>Queen</small>
      <strong>{branch.short}</strong>
    </span>
  </button>;
}

function GuardMini({ guard, prince, record, active, pinned, onPreview, onClear, onPin }) {
  const props = triggerProps({ record, active, pinned, onPreview, onClear, onPin });
  return <button
    type="button"
    {...props}
    className={`royal-map__guard-mini is-${guard.kind}${guard.isGroup ? ' is-group' : ''} ${props.className}`}
    title={`${guard.name} · ${networkKindLabel(guard.kind)}`}
  >
    <Portrait name={guard.name} entity={guard.entity} compact />
    <span>{guard.name}</span>
  </button>;
}

export function PrinceMapNode({ prince, record, guards, position, selected, active, activeKey, pinnedKey, onPreview, onClear, onPin, guardRecordFor }) {
  const beast = beastForHost(prince.short);
  const princeProps = triggerProps({ record, active, pinned: pinnedKey === record.key, onPreview, onClear, onPin });

  return <article
    className={`royal-map__prince-node is-${prince.status}${active ? ' is-active' : ''}${selected ? ' is-selected' : ''}`}
    style={{ left: position.x, top: position.y }}
    data-prince-order={prince.order}
    data-guard-count={guards.length}
  >
    <BeastBackdrop beast={beast} />
    <button
      type="button"
      {...princeProps}
      className={`royal-map__prince-summary ${princeProps.className}`}
      aria-current={selected ? 'true' : undefined}
    >
      <span className="royal-map__prince-number">{prince.order}</span>
      <Portrait name={prince.name} entity={record.entity} compact eager={prince.order <= 4} />
      <span className="royal-map__prince-copy">
        <small>{statusLabel(prince.status)}</small>
        <strong>{prince.short}</strong>
        <em>Queen {prince.mother}</em>
      </span>
      {prince.status === 'deceased' && <span className="royal-map__death-mark" aria-hidden="true" />}
    </button>

    <div className="royal-map__guard-strip" aria-label={`${prince.short} protection and intelligence circle. All ${guards.length} documented records shown.`}>
      {guards.map((guard) => {
        const guardRecord = guardRecordFor(guard, prince);
        return <GuardMini
          key={guard.id}
          guard={guard}
          prince={prince}
          record={guardRecord}
          active={activeKey === guardRecord.key}
          pinned={pinnedKey === guardRecord.key}
          onPreview={onPreview}
          onClear={onClear}
          onPin={onPin}
        />;
      })}
    </div>

    <footer>
      <span>Room {prince.room.split(' / ')[0]}</span>
      <span>All {guards.length} shown</span>
    </footer>
  </article>;
}

function ForceMember({ member, record, active, pinned, onPreview, onClear, onPin }) {
  const props = triggerProps({ record, active, pinned, onPreview, onClear, onPin });
  return <button type="button" {...props} className={`royal-map__force-member ${props.className}`}>
    <Portrait name={member.name} entity={member.entity} compact />
    <small>{member.name}</small>
  </button>;
}

export function ForceRail({ groups, forceRecords, activeKey, pinnedKey, onPreview, onClear, onPin, memberRecordFor, layout }) {
  return <aside className="royal-map__forces" aria-labelledby="royal-map-forces-title">
    <header>
      <Building2 size={15} aria-hidden="true" />
      <span>Outside forces</span>
      <h3 id="royal-map-forces-title">Mafia and allied placements</h3>
    </header>
    {groups.map((group) => {
      const position = layout[group.key];
      const record = forceRecords.get(group.key);
      const props = triggerProps({ record, active: activeKey === record.key, pinned: pinnedKey === record.key, onPreview, onClear, onPin });
      return <section className={`royal-map__force-group is-${group.key}`} style={{ top: position.y }} key={group.key}>
        <button type="button" {...props} className={`royal-map__force-summary${group.leaderEntity ? ' has-leader' : ''} ${props.className}`}>
          {group.leaderEntity && <Portrait name={group.leader} entity={group.leaderEntity} compact />}
          <span className="royal-map__force-copy">
            <small>{group.key === 'allies' ? 'Allies' : `Linked to Prince ${group.linkedOrders[0]}`}</small>
            <strong>{group.label}</strong>
            {group.leader && <em>{group.leader}</em>}
          </span>
        </button>
        <div className="royal-map__force-members">
          {group.members.map((member) => {
            const memberRecord = memberRecordFor(member, group);
            return <ForceMember
              key={memberRecord.key}
              member={member}
              record={memberRecord}
              active={activeKey === memberRecord.key}
              pinned={pinnedKey === memberRecord.key}
              onPreview={onPreview}
              onClear={onClear}
              onPin={onPin}
            />;
          })}
        </div>
      </section>;
    })}
  </aside>;
}

export function MapInspector({ record, pinned, onOpen, onUnpin, onPreviewHold, onPreviewRelease }) {
  const titleId = useId();
  if (!record) return null;
  return <aside
    id="royal-map-inspector"
    className="royal-map__inspector"
    aria-labelledby={titleId}
    aria-live="polite"
    onMouseEnter={onPreviewHold}
    onMouseLeave={onPreviewRelease}
    onFocusCapture={onPreviewHold}
    onBlurCapture={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) onPreviewRelease();
    }}
  >
    <header>
      <span>{record.eyebrow}</span>
      <button type="button" onClick={onUnpin} aria-label={pinned ? 'Unpin record' : 'Clear pinned record'} disabled={!pinned}>
        {pinned ? <PinOff size={15} aria-hidden="true" /> : <Pin size={15} aria-hidden="true" />}
      </button>
    </header>
    <div className="royal-map__inspector-identity">
      <Portrait name={record.name} entity={record.entity} />
      <div>
        <h3 id={titleId}>{record.name}</h3>
        <p>{record.summary}</p>
      </div>
    </div>
    {record.beast && <section><small>Guardian Spirit Beast</small><p>{record.beast}</p></section>}
    {record.ability && <section><small>Nen / abilities</small><p>{record.ability}</p></section>}
    {!!record.facts?.length && <dl>{record.facts.map(([label, value]) => <div key={`${label}-${value}`}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>}
    {record.openTarget && <button type="button" className="royal-map__inspector-open" onClick={() => onOpen(record)}>
      Open full dossier <ArrowRight size={14} aria-hidden="true" />
    </button>}
  </aside>;
}
