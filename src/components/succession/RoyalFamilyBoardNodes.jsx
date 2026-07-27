import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Building2, GripHorizontal, Maximize2, Minimize2, Pin, PinOff } from 'lucide-react';
import { princeDossiers } from '../../data/successionDossier';
import { successionRosterGroups } from '../../data/successionRoster';
import {
  getAssignmentSnapshot,
  getCharacterCurrentState,
  getCharacterRoleProfile,
  getEntityById,
  getOrganizationMembers,
  getRelationshipSnapshot,
  getSourcesForEntity,
} from '../../data/succession/successionData';
import SafeImage from '../SafeImage';
import {
  beastForHost,
  entityForName,
  initials,
  networkKindLabel,
  normalizeLookup,
  statusLabel,
} from './RoyalFamilyBoardModel';
import './RoyalFamilyInspector.css';

const rosterGroupById = new Map(successionRosterGroups.map((group) => [group.id, group]));
const rosterMemberByName = new Map(successionRosterGroups.flatMap((group) => group.members).map((member) => [normalizeLookup(member.name), member]));
const royalRoleNames = new Set(['king', 'queen', 'prince', 'royal-parent']);

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

export function Portrait({ name, entity, portrait = '', compact = false, eager = false }) {
  const source = portrait || entity?.media?.portrait || entity?.image || entity?.imageSource || '';
  const [available, setAvailable] = useState(Boolean(source));
  useEffect(() => setAvailable(Boolean(source)), [source]);

  if (!source || !available) {
    return <span className={`royal-map__portrait-fallback${compact ? ' is-compact' : ''}`} role="img" aria-label={`${name} portrait unavailable`}>{initials(name)}</span>;
  }

  return <span className={`royal-map__portrait${compact ? ' is-compact' : ''}`}>
    <SafeImage
      src={source}
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

function assignmentText(assignment) {
  return `${assignment.assignmentType || ''} ${assignment.name || ''} ${assignment.objective || ''} ${assignment.summary || ''}`.toLowerCase();
}

function assignmentKind(assignment) {
  const text = assignmentText(assignment);
  if (/assass|hostile|attack|murder|infiltrat/.test(text)) return 'hostile';
  if (/surveil|observ|report|spy|monitor|intelligence/.test(text)) return 'observer';
  if (/alliance|reinforce|support|cooperat/.test(text)) return 'ally';
  return 'protection';
}

function assignedGuardRecords(record, prince) {
  const entityId = record?.entity?.id;
  if (!entityId) return [];
  const snapshot = getAssignmentSnapshot(entityId);
  if (!snapshot?.assignments?.length) return [];
  return snapshot.assignments.flatMap((assignment) => {
    if (!/protect|guard|security|surveil|observ|report|spy|monitor|intelligence|assass|hostile|attack|murder|infiltrat|alliance|reinforce|support|cooperat/.test(assignmentText(assignment))) return [];
    const person = getEntityById(assignment.personId);
    if (!person || person.entityType !== 'character' || person.id === entityId) return [];
    if ((person.roles || []).some((role) => royalRoleNames.has(role))) return [];
    const kind = assignmentKind(assignment);
    return [{
      id: `assignment-${prince.order}-${assignment.id}`,
      name: person.name,
      entity: person,
      portrait: person.media?.portrait || person.image || person.imageSource || '',
      isGroup: false,
      kind,
      eyebrow: assignment.name || networkKindLabel(kind),
      description: assignment.objective || assignment.summary || `Canonical assignment connected to ${prince.short}.`,
      assignment,
    }];
  });
}

function GuardMini({ guard, prince, record, active, pinned, onPreview, onClear, onPin }) {
  const props = triggerProps({ record, active, pinned, onPreview, onClear, onPin });
  return <button
    type="button"
    {...props}
    className={`royal-map__guard-mini is-${guard.kind}${guard.isGroup ? ' is-group' : ''} ${props.className}`}
    title={`${guard.name} · ${networkKindLabel(guard.kind)}`}
  >
    <Portrait name={guard.name} entity={guard.entity} portrait={guard.portrait} compact />
    <span>{guard.name}</span>
  </button>;
}

export function PrinceMapNode({ prince, record, guards: suppliedGuards, position, selected, active, activeKey, pinnedKey, onPreview, onClear, onPin, guardRecordFor }) {
  const beast = beastForHost(prince.short);
  const princeProps = triggerProps({ record, active, pinned: pinnedKey === record.key, onPreview, onClear, onPin });
  const guards = useMemo(() => {
    const merged = new Map();
    for (const guard of suppliedGuards) {
      const key = normalizeLookup(guard.name);
      const roster = rosterMemberByName.get(key);
      merged.set(key, {
        ...guard,
        portrait: guard.portrait || roster?.media?.portrait || roster?.image || roster?.imageSource || '',
      });
    }
    for (const guard of assignedGuardRecords(record, prince)) {
      const key = normalizeLookup(guard.name);
      if (!merged.has(key)) merged.set(key, guard);
    }
    return [...merged.values()];
  }, [prince, record, suppliedGuards]);

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
        const baseGuardRecord = guardRecordFor(guard, prince);
        const guardRecord = {
          ...baseGuardRecord,
          portrait: guard.portrait || '',
          facts: [
            ...(baseGuardRecord.facts || []),
            ...(guard.assignment ? [['Assignment', guard.assignment.name || guard.assignment.assignmentType || 'Canonical assignment']] : []),
          ],
        };
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

function completeForceMembers(group) {
  const excluded = new Set([
    normalizeLookup(group.leader),
    ...group.linkedOrders.map((order) => normalizeLookup(princeDossiers.find((prince) => prince.order === order)?.name)),
  ]);
  const canonical = group.organization
    ? getOrganizationMembers(group.organization.id).map(({ character }) => ({
      name: character.name,
      entity: character,
      portrait: character.media?.portrait || character.image || character.imageSource || '',
    }))
    : [];
  const roster = (rosterGroupById.get(group.key)?.members || []).map((member) => ({
    name: member.name,
    entity: entityForName(member.name),
    portrait: member.media?.portrait || member.image || member.imageSource || '',
    role: member.role,
  }));
  const combined = group.key === 'allies' ? group.members : [...canonical, ...roster, ...group.members];
  const byName = new Map();
  for (const member of combined) {
    const key = normalizeLookup(member.name);
    if (!key || excluded.has(key)) continue;
    const current = byName.get(key);
    if (!current || (!current.portrait && member.portrait)) byName.set(key, { ...current, ...member });
  }
  return [...byName.values()];
}

function ForceMember({ member, record, active, pinned, onPreview, onClear, onPin }) {
  const props = triggerProps({ record, active, pinned, onPreview, onClear, onPin });
  return <button
    type="button"
    {...props}
    className={`royal-map__force-member ${props.className}`}
    aria-label={`${member.name}, ${record.eyebrow}`}
    title={member.name}
  >
    <Portrait name={member.name} entity={member.entity} portrait={member.portrait} compact />
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
      const members = completeForceMembers(group);
      const baseRecord = forceRecords.get(group.key);
      const record = {
        ...baseRecord,
        facts: [
          ...(baseRecord.facts || []).filter(([label]) => label !== 'Members shown'),
          ['Members indexed', String(members.length)],
          ['Roster', members.map((member) => member.name).join(', ') || 'No named members indexed'],
        ],
      };
      const props = triggerProps({ record, active: activeKey === record.key, pinned: pinnedKey === record.key, onPreview, onClear, onPin });
      return <section className={`royal-map__force-group is-${group.key}`} style={{ top: position.y }} key={group.key} data-member-count={members.length}>
        <button type="button" {...props} className={`royal-map__force-summary${group.leaderEntity ? ' has-leader' : ''} ${props.className}`}>
          {group.leaderEntity && <Portrait name={group.leader} entity={group.leaderEntity} compact />}
          <span className="royal-map__force-copy">
            <small>{group.key === 'allies' ? 'Allies' : `Linked to Prince ${group.linkedOrders[0]}`}</small>
            <strong>{group.label}</strong>
            {group.leader && <em>{group.leader}</em>}
          </span>
        </button>
        <div className="royal-map__force-members" aria-label={`${group.label}: all ${members.length} indexed members`}>
          {members.map((member) => {
            const baseMemberRecord = memberRecordFor(member, { ...group, members });
            const memberRecord = {
              ...baseMemberRecord,
              portrait: member.portrait || '',
              facts: [
                ...(baseMemberRecord.facts || []),
                ...(member.role ? [['Roster role', member.role]] : []),
              ],
            };
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

function relatedEntityLabel(relationship, entityId) {
  const otherId = relationship.sourceEntityId === entityId ? relationship.targetEntityId : relationship.sourceEntityId;
  return getEntityById(otherId)?.name || relationship.name || relationship.relationshipType || 'Linked record';
}

function assignmentEntityLabel(assignment, entityId) {
  return [assignment.personId, assignment.principalEntityId, assignment.subjectEntityId, assignment.allegianceEntityId, assignment.reportingEntityId]
    .filter((id) => id && id !== entityId)
    .map((id) => getEntityById(id)?.name)
    .filter(Boolean)
    .join(' · ');
}

function inspectorDetails(record) {
  const entityId = record?.entity?.id;
  const archiveEntity = entityId ? getEntityById(entityId) : null;
  if (!archiveEntity) return { state: null, role: null, assignments: [], relationships: [], sources: [] };
  const isCharacter = archiveEntity.entityType === 'character';
  const state = isCharacter ? getCharacterCurrentState(entityId) : null;
  const role = isCharacter ? getCharacterRoleProfile(entityId) : null;
  const assignmentSnapshot = getAssignmentSnapshot(entityId);
  const relationshipSnapshot = getRelationshipSnapshot(entityId);
  return {
    state,
    role,
    assignments: (assignmentSnapshot?.assignments || []).slice(0, 10).map((assignment) => ({
      id: assignment.id,
      label: assignment.name || assignment.assignmentType || 'Assignment',
      related: assignmentEntityLabel(assignment, entityId),
      summary: assignment.objective || assignment.summary || assignment.status || '',
      status: assignment.status || assignment.certainty || '',
    })),
    relationships: (relationshipSnapshot?.relationships || []).slice(0, 10).map((relationship) => ({
      id: relationship.id,
      label: relatedEntityLabel(relationship, entityId),
      type: relationship.relationshipType || relationship.sentiment || relationship.status || '',
      summary: relationship.operationalState || relationship.summary || relationship.name || '',
    })),
    sources: (getSourcesForEntity(entityId) || []).slice(0, 8).map((source) => ({
      id: source.id,
      label: source.name || source.title || source.id,
      chapter: source.chapter || source.chapterRange?.start || null,
    })),
  };
}

function clampPanelPosition(position, panel) {
  if (typeof window === 'undefined' || !panel) return position;
  const margin = 8;
  return {
    x: Math.min(Math.max(margin, position.x), Math.max(margin, window.innerWidth - panel.offsetWidth - margin)),
    y: Math.min(Math.max(margin, position.y), Math.max(margin, window.innerHeight - panel.offsetHeight - margin)),
  };
}

export function MapInspector({ record, pinned, onOpen, onUnpin, onPreviewHold, onPreviewRelease }) {
  const titleId = useId();
  const panelRef = useRef(null);
  const dragRef = useRef(null);
  const positionRef = useRef(null);
  const [expanded, setExpanded] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState(null);
  const details = useMemo(() => inspectorDetails(record), [record]);
  useEffect(() => { positionRef.current = position; }, [position]);

  useLayoutEffect(() => {
    if (!record || !panelRef.current || position) return;
    let saved = null;
    try { saved = JSON.parse(sessionStorage.getItem('royal-map-inspector-position') || 'null'); } catch { saved = null; }
    const initial = saved || { x: window.innerWidth - panelRef.current.offsetWidth - 18, y: 86 };
    setPosition(clampPanelPosition(initial, panelRef.current));
  }, [position, record]);

  useEffect(() => {
    const handleResize = () => setPosition((current) => current ? clampPanelPosition(current, panelRef.current) : current);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useLayoutEffect(() => {
    if (!position || !panelRef.current) return;
    const clamped = clampPanelPosition(position, panelRef.current);
    if (clamped.x !== position.x || clamped.y !== position.y) setPosition(clamped);
  }, [expanded, position]);

  if (!record) return null;

  const beginDrag = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    if (event.target.closest?.('button, a')) return;
    const rect = panelRef.current.getBoundingClientRect();
    dragRef.current = { pointerId: event.pointerId, dx: event.clientX - rect.left, dy: event.clientY - rect.top };
    event.currentTarget.setPointerCapture?.(event.pointerId);
    setDragging(true);
  };
  const moveDrag = (event) => {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    const next = clampPanelPosition({ x: event.clientX - dragRef.current.dx, y: event.clientY - dragRef.current.dy }, panelRef.current);
    positionRef.current = next;
    setPosition(next);
    event.preventDefault();
  };
  const endDrag = (event) => {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    dragRef.current = null;
    setDragging(false);
    try { event.currentTarget.releasePointerCapture?.(event.pointerId); } catch { /* pointer capture was already released */ }
    if (positionRef.current) {
      try { sessionStorage.setItem('royal-map-inspector-position', JSON.stringify(positionRef.current)); } catch { /* session storage may be unavailable */ }
    }
  };
  const moveByKeyboard = (event) => {
    if (!event.altKey || !position) return;
    const delta = event.shiftKey ? 40 : 12;
    const directions = {
      ArrowLeft: [-delta, 0], ArrowRight: [delta, 0], ArrowUp: [0, -delta], ArrowDown: [0, delta],
    };
    const direction = directions[event.key];
    if (!direction) return;
    event.preventDefault();
    const next = clampPanelPosition({ x: position.x + direction[0], y: position.y + direction[1] }, panelRef.current);
    positionRef.current = next;
    setPosition(next);
    try { sessionStorage.setItem('royal-map-inspector-position', JSON.stringify(next)); } catch { /* session storage may be unavailable */ }
  };

  return <aside
    ref={panelRef}
    id="royal-map-inspector"
    className={`royal-map__inspector${expanded ? ' is-expanded' : ' is-compact'}${dragging ? ' is-dragging' : ''}`}
    aria-labelledby={titleId}
    aria-live="polite"
    style={position ? { left: position.x, top: position.y, right: 'auto' } : undefined}
    onMouseEnter={onPreviewHold}
    onMouseLeave={onPreviewRelease}
    onFocusCapture={onPreviewHold}
    onBlurCapture={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) onPreviewRelease();
    }}
  >
    <header
      className="royal-map__inspector-dragbar"
      onPointerDown={beginDrag}
      onPointerMove={moveDrag}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onKeyDown={moveByKeyboard}
      tabIndex="0"
      aria-label="Drag dossier panel. Hold Alt and use arrow keys to move it."
    >
      <GripHorizontal size={17} aria-hidden="true" />
      <span>{record.eyebrow}</span>
      <button type="button" onClick={() => setExpanded((current) => !current)} aria-label={expanded ? 'Use compact dossier view' : 'Expand dossier information'}>
        {expanded ? <Minimize2 size={15} aria-hidden="true" /> : <Maximize2 size={15} aria-hidden="true" />}
      </button>
      <button type="button" onClick={onUnpin} aria-label={pinned ? 'Unpin record' : 'Clear pinned record'} disabled={!pinned}>
        {pinned ? <PinOff size={15} aria-hidden="true" /> : <Pin size={15} aria-hidden="true" />}
      </button>
    </header>

    <div className="royal-map__inspector-identity">
      <Portrait name={record.name} entity={record.entity} portrait={record.portrait} />
      <div>
        <h3 id={titleId}>{record.name}</h3>
        <p>{record.summary}</p>
      </div>
    </div>

    <div className="royal-map__inspector-chips" aria-label="Record classification">
      <span>{record.kind}</span>
      {details.state?.life && <span>{details.state.life}</span>}
      {details.state?.threatLevel && details.state.threatLevel !== 'unknown' && <span>{details.state.threatLevel} threat</span>}
      {pinned && <span>Pinned</span>}
    </div>

    {record.beast && <section><small>Guardian Spirit Beast</small><p>{record.beast}</p></section>}
    {record.ability && <section><small>Nen / abilities</small><p>{record.ability}</p></section>}
    {!!record.facts?.length && <dl>{record.facts.map(([label, value]) => <div key={`${label}-${value}`}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>}

    {expanded && <div className="royal-map__inspector-expanded">
      {details.state && <section>
        <small>Current state</small>
        <p>{details.state.operationalState}</p>
        <ul>
          <li><strong>Body:</strong> {details.state.bodyState}</li>
          <li><strong>Consciousness:</strong> {details.state.consciousnessState}</li>
          <li><strong>Protection:</strong> {details.state.protectionState}</li>
          <li><strong>Allegiance:</strong> {details.state.allegianceState}</li>
        </ul>
      </section>}

      {details.role && <section>
        <small>Role and authority</small>
        <h4>{details.role.label}</h4>
        <p>{details.role.mandate}</p>
        <p>{details.role.authority}</p>
        {!!details.role.responsibilities?.length && <ul>{details.role.responsibilities.slice(0, 6).map((item) => <li key={item}>{item}</li>)}</ul>}
      </section>}

      {!!details.assignments.length && <section>
        <small>Assignments</small>
        <div className="royal-map__inspector-ledger">
          {details.assignments.map((assignment) => <article key={assignment.id}>
            <strong>{assignment.label}</strong>
            {assignment.related && <span>{assignment.related}</span>}
            {assignment.summary && <p>{assignment.summary}</p>}
            {assignment.status && <em>{assignment.status}</em>}
          </article>)}
        </div>
      </section>}

      {!!details.relationships.length && <section>
        <small>Relationships</small>
        <div className="royal-map__inspector-ledger">
          {details.relationships.map((relationship) => <article key={relationship.id}>
            <strong>{relationship.label}</strong>
            {relationship.type && <span>{relationship.type}</span>}
            {relationship.summary && <p>{relationship.summary}</p>}
          </article>)}
        </div>
      </section>}

      {!!details.sources.length && <section>
        <small>Evidence coverage</small>
        <ul className="royal-map__inspector-sources">
          {details.sources.map((source) => <li key={source.id}>{source.label}{source.chapter ? ` · Ch. ${source.chapter}` : ''}</li>)}
        </ul>
      </section>}
    </div>}

    {record.openTarget && <button type="button" className="royal-map__inspector-open" onClick={() => onOpen(record)}>
      Open full dossier <ArrowRight size={14} aria-hidden="true" />
    </button>}
  </aside>;
}
