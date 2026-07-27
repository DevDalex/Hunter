import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  Building2,
  ChevronRight,
  GripHorizontal,
  Maximize2,
  Minimize2,
  PinOff,
  X,
} from 'lucide-react';
import { princeDossiers } from '../../data/successionDossier';
import { successionRosterGroups } from '../../data/successionRoster';
import {
  getAssignmentSnapshot,
  getCharacterCurrentState,
  getCharacterLifetimeTimeline,
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
const DOSSIER_TABS = Object.freeze([
  ['overview', 'Overview'],
  ['nen', 'Nen'],
  ['network', 'Network'],
  ['timeline', 'Timeline'],
  ['evidence', 'Evidence'],
]);

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
  return <button type="button" {...props} className={`royal-map__king ${props.className}`}>
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
    <button type="button" {...princeProps} className={`royal-map__prince-summary ${princeProps.className}`} aria-current={selected ? 'true' : undefined}>
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

function formatChapterRange(range) {
  if (!range?.start) return 'Current record';
  if (!range.end || range.end === range.start) return `Ch. ${range.start}`;
  return `Ch. ${range.start}–${range.end}`;
}

function inspectorDetails(record) {
  const entityId = record?.entity?.id;
  const archiveEntity = entityId ? getEntityById(entityId) : null;
  if (!archiveEntity) return { state: null, role: null, assignments: [], relationships: [], timeline: [], sources: [] };
  const isCharacter = archiveEntity.entityType === 'character';
  const state = isCharacter ? getCharacterCurrentState(entityId) : null;
  const role = isCharacter ? getCharacterRoleProfile(entityId) : null;
  const assignmentSnapshot = getAssignmentSnapshot(entityId);
  const relationshipSnapshot = getRelationshipSnapshot(entityId);
  return {
    state,
    role,
    assignments: (assignmentSnapshot?.assignments || []).slice(0, 12).map((assignment) => ({
      id: assignment.id,
      label: assignment.name || assignment.assignmentType || 'Assignment',
      related: assignmentEntityLabel(assignment, entityId),
      summary: assignment.objective || assignment.summary || assignment.status || '',
      status: assignment.status || assignment.certainty || '',
      range: assignment.chapterRange,
    })),
    relationships: (relationshipSnapshot?.relationships || []).slice(0, 12).map((relationship) => {
      const otherId = relationship.sourceEntityId === entityId ? relationship.targetEntityId : relationship.sourceEntityId;
      return {
        id: relationship.id,
        label: relatedEntityLabel(relationship, entityId),
        type: relationship.relationshipType || relationship.sentiment || relationship.status || '',
        summary: relationship.operationalState || relationship.summary || relationship.name || '',
        entity: getEntityById(otherId),
      };
    }),
    timeline: (isCharacter ? getCharacterLifetimeTimeline(entityId) || [] : [])
      .slice()
      .sort((left, right) => (right.chapterRange?.start || 0) - (left.chapterRange?.start || 0))
      .slice(0, 14)
      .map((entry) => ({
        id: entry.id,
        label: entry.label || entry.kind || 'Archive event',
        summary: entry.summary || '',
        kind: entry.kind || 'record',
        range: entry.chapterRange,
        certainty: entry.certainty || '',
      })),
    sources: (getSourcesForEntity(entityId) || []).slice(0, 12).map((source) => ({
      id: source.id,
      label: source.name || source.title || source.id,
      chapter: source.chapter || source.chapterRange?.start || null,
    })),
  };
}

function beastForRecord(record) {
  if (record?.kind === 'king') return beastForHost('Nasubi');
  if (record?.kind === 'prince') {
    const prince = princeDossiers.find((entry) => entry.order === record.princeOrder);
    return prince ? beastForHost(prince.short) : null;
  }
  return null;
}

function clampPanelPosition(position, panel) {
  if (typeof window === 'undefined' || !panel) return position;
  const margin = 8;
  return {
    x: Math.min(Math.max(margin, position.x), Math.max(margin, window.innerWidth - panel.offsetWidth - margin)),
    y: Math.min(Math.max(margin, position.y), Math.max(margin, window.innerHeight - panel.offsetHeight - margin)),
  };
}

function DossierStatus({ record, details, pinned }) {
  const labels = [record.kind, details.state?.life, details.state?.threatLevel && details.state.threatLevel !== 'unknown' ? `${details.state.threatLevel} threat` : null, pinned ? 'Pinned' : 'Preview'].filter(Boolean);
  return <div className="royal-map__dossier-status" aria-label="Record classification">
    {labels.map((label) => <span key={label}>{label}</span>)}
  </div>;
}

function QuickFacts({ facts = [], limit = null }) {
  const filtered = facts.filter(([, value]) => value !== null && value !== undefined && String(value).trim());
  const shown = limit ? filtered.slice(0, limit) : filtered;
  if (!shown.length) return null;
  return <dl className="royal-map__dossier-facts">
    {shown.map(([label, value]) => <div key={`${label}-${value}`}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>)}
  </dl>;
}

function PreviewContent({ record, details, beast }) {
  const shortFacts = (record.facts || []).filter(([, value]) => String(value).length < 90);
  return <div className="royal-map__dossier-preview">
    <DossierStatus record={record} details={details} pinned={false} />
    <QuickFacts facts={shortFacts} limit={4} />
    <div className="royal-map__dossier-preview-grid">
      <article>
        <small>Nen / ability</small>
        <p>{record.ability || 'No documented personal ability'}</p>
      </article>
      <article>
        <small>Guardian Beast</small>
        <p>{record.beast || beast?.ability || 'No Guardian Spirit Beast record'}</p>
      </article>
    </div>
    <p className="royal-map__dossier-hint">Click the record to pin the full case file.</p>
  </div>;
}

function OverviewTab({ record, details }) {
  const overviewFacts = (record.facts || []).filter(([, value]) => String(value).length < 120);
  return <div className="royal-map__dossier-overview">
    <DossierStatus record={record} details={details} pinned />
    <QuickFacts facts={overviewFacts} />
    <div className="royal-map__dossier-card-grid">
      {details.state && <article className="royal-map__dossier-card is-state">
        <small>Current state</small>
        <h4>{details.state.operationalState || 'No chapter-specific state note'}</h4>
        <ul>
          <li><strong>Body</strong><span>{details.state.bodyState}</span></li>
          <li><strong>Consciousness</strong><span>{details.state.consciousnessState}</span></li>
          <li><strong>Protection</strong><span>{details.state.protectionState}</span></li>
          <li><strong>Allegiance</strong><span>{details.state.allegianceState}</span></li>
        </ul>
      </article>}
      {details.role && <article className="royal-map__dossier-card is-role">
        <small>Role and authority</small>
        <h4>{details.role.label}</h4>
        <p>{details.role.mandate}</p>
        <p>{details.role.authority}</p>
        {!!details.role.responsibilities?.length && <ul className="royal-map__dossier-bullets">
          {details.role.responsibilities.slice(0, 5).map((item) => <li key={item}>{item}</li>)}
        </ul>}
      </article>}
    </div>
  </div>;
}

function NenTab({ record, beast }) {
  return <div className="royal-map__dossier-nen">
    <article className="royal-map__dossier-feature is-ability">
      <small>Personal Nen / abilities</small>
      <h4>{record.ability || 'No documented personal ability'}</h4>
    </article>
    <article className="royal-map__dossier-feature is-beast">
      <div>
        <small>Guardian Spirit Beast</small>
        <h4>{record.beast || beast?.ability || 'No Guardian Spirit Beast record'}</h4>
        {beast?.type && <span>Type: {beast.type}</span>}
        {beast?.conditions && <p>{beast.conditions}</p>}
      </div>
      {beast?.image && <SafeImage src={beast.image} alt="" fallbackLabel="" />}
    </article>
  </div>;
}

function NetworkTab({ details }) {
  return <div className="royal-map__dossier-network">
    <section>
      <header><small>Assignments</small><span>{details.assignments.length}</span></header>
      <div className="royal-map__inspector-ledger">
        {details.assignments.length ? details.assignments.map((assignment) => <article key={assignment.id}>
          <div>
            <strong>{assignment.label}</strong>
            {assignment.related && <span>{assignment.related}</span>}
          </div>
          <em>{formatChapterRange(assignment.range)}</em>
          {assignment.summary && <p>{assignment.summary}</p>}
          {assignment.status && <small>{assignment.status}</small>}
        </article>) : <p className="royal-map__dossier-empty">No active assignment record is indexed.</p>}
      </div>
    </section>
    <section>
      <header><small>Relationships</small><span>{details.relationships.length}</span></header>
      <div className="royal-map__dossier-relations">
        {details.relationships.length ? details.relationships.map((relationship) => <article key={relationship.id}>
          <Portrait name={relationship.label} entity={relationship.entity} compact />
          <div>
            <strong>{relationship.label}</strong>
            {relationship.type && <span>{relationship.type}</span>}
            {relationship.summary && <p>{relationship.summary}</p>}
          </div>
        </article>) : <p className="royal-map__dossier-empty">No relationship edge is indexed.</p>}
      </div>
    </section>
  </div>;
}

function TimelineTab({ details }) {
  return <ol className="royal-map__dossier-timeline">
    {details.timeline.length ? details.timeline.map((entry) => <li key={entry.id}>
      <span aria-hidden="true" />
      <div>
        <header>
          <strong>{entry.label}</strong>
          <em>{formatChapterRange(entry.range)}</em>
        </header>
        <p>{entry.summary}</p>
        <small>{entry.kind}{entry.certainty ? ` · ${entry.certainty}` : ''}</small>
      </div>
    </li>) : <li className="is-empty"><div><p>No chapter-bounded timeline entries are indexed for this record.</p></div></li>}
  </ol>;
}

function EvidenceTab({ record, details }) {
  return <div className="royal-map__dossier-evidence">
    <article>
      <small>Evidence coverage</small>
      <strong>{details.sources.length} linked source{details.sources.length === 1 ? '' : 's'}</strong>
      <p>These entries are taken from the archive entity and its chapter-bounded evidence graph.</p>
    </article>
    <ul className="royal-map__inspector-sources">
      {details.sources.length ? details.sources.map((source) => <li key={source.id}>
        <span>{source.chapter ? `Ch. ${source.chapter}` : 'Archive'}</span>
        <strong>{source.label}</strong>
      </li>) : <li><strong>No direct source record is attached to this entry.</strong></li>}
    </ul>
    {(record.facts || []).some(([, value]) => String(value).length >= 90) && <section>
      <small>Extended record</small>
      <QuickFacts facts={(record.facts || []).filter(([, value]) => String(value).length >= 90)} />
    </section>}
  </div>;
}

function ActiveTabPanel({ activeTab, record, details, beast }) {
  if (activeTab === 'nen') return <NenTab record={record} beast={beast} />;
  if (activeTab === 'network') return <NetworkTab details={details} />;
  if (activeTab === 'timeline') return <TimelineTab details={details} />;
  if (activeTab === 'evidence') return <EvidenceTab record={record} details={details} />;
  return <OverviewTab record={record} details={details} />;
}

export function MapInspector({ record, pinned, onOpen, onUnpin, onPreviewHold, onPreviewRelease }) {
  const titleId = useId();
  const panelId = useId();
  const panelRef = useRef(null);
  const dragRef = useRef(null);
  const positionRef = useRef(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [expanded, setExpanded] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState(null);
  const details = useMemo(() => inspectorDetails(record), [record]);
  const beast = useMemo(() => beastForRecord(record), [record]);
  const isPreview = !pinned;

  useEffect(() => { positionRef.current = position; }, [position]);
  useEffect(() => {
    setActiveTab('overview');
    if (!pinned) setExpanded(false);
  }, [record?.key, pinned]);

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
  }, [expanded, pinned, position]);

  if (!record) return null;

  const beginDrag = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    if (event.target.closest?.('button, a')) return;
    onPreviewHold?.();
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
    const directions = { ArrowLeft: [-delta, 0], ArrowRight: [delta, 0], ArrowUp: [0, -delta], ArrowDown: [0, delta] };
    const direction = directions[event.key];
    if (!direction) return;
    event.preventDefault();
    const next = clampPanelPosition({ x: position.x + direction[0], y: position.y + direction[1] }, panelRef.current);
    positionRef.current = next;
    setPosition(next);
    try { sessionStorage.setItem('royal-map-inspector-position', JSON.stringify(next)); } catch { /* session storage may be unavailable */ }
  };
  const dismiss = () => {
    onUnpin?.();
    onPreviewRelease?.();
  };
  const moveTabByKeyboard = (event) => {
    const currentIndex = DOSSIER_TABS.findIndex(([id]) => id === activeTab);
    let nextIndex = currentIndex;
    if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % DOSSIER_TABS.length;
    else if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + DOSSIER_TABS.length) % DOSSIER_TABS.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = DOSSIER_TABS.length - 1;
    else return;
    event.preventDefault();
    const nextId = DOSSIER_TABS[nextIndex][0];
    setActiveTab(nextId);
    requestAnimationFrame(() => document.getElementById(`${panelId}-${nextId}-tab`)?.focus());
  };

  return <aside
    ref={panelRef}
    id="royal-map-inspector"
    className={`royal-map__inspector${isPreview ? ' is-preview' : ' is-pinned'}${expanded ? ' is-expanded' : ''}${dragging ? ' is-dragging' : ''}`}
    aria-labelledby={titleId}
    aria-live="polite"
    role={pinned ? 'dialog' : 'status'}
    aria-modal="false"
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
      <span>{isPreview ? 'Quick intelligence preview' : record.eyebrow}</span>
      {!isPreview && <button type="button" onClick={() => setExpanded((current) => !current)} aria-label={expanded ? 'Return to standard dossier size' : 'Expand dossier window'}>
        {expanded ? <Minimize2 size={15} aria-hidden="true" /> : <Maximize2 size={15} aria-hidden="true" />}
      </button>}
      {pinned && <button type="button" onClick={onUnpin} aria-label="Unpin record"><PinOff size={15} aria-hidden="true" /></button>}
      <button type="button" onClick={dismiss} aria-label="Close dossier"><X size={15} aria-hidden="true" /></button>
    </header>

    <div className="royal-map__dossier-hero">
      <Portrait name={record.name} entity={record.entity} portrait={record.portrait} />
      <div>
        <span>{record.eyebrow}</span>
        <h3 id={titleId}>{record.name}</h3>
        <p>{record.summary}</p>
      </div>
      {beast?.image && <span className="royal-map__dossier-beast" aria-hidden="true"><SafeImage src={beast.image} alt="" fallbackLabel="" /></span>}
    </div>

    {isPreview ? <PreviewContent record={record} details={details} beast={beast} /> : <>
      <nav className="royal-map__dossier-tabs" role="tablist" aria-label="Dossier sections" onKeyDown={moveTabByKeyboard}>
        {DOSSIER_TABS.map(([id, label]) => <button
          key={id}
          type="button"
          role="tab"
          id={`${panelId}-${id}-tab`}
          aria-controls={`${panelId}-${id}-panel`}
          aria-selected={activeTab === id}
          tabIndex={activeTab === id ? 0 : -1}
          onClick={() => setActiveTab(id)}
        >{label}</button>)}
      </nav>
      <div
        className="royal-map__dossier-panel"
        role="tabpanel"
        id={`${panelId}-${activeTab}-panel`}
        aria-labelledby={`${panelId}-${activeTab}-tab`}
      >
        <ActiveTabPanel activeTab={activeTab} record={record} details={details} beast={beast} />
      </div>
    </>}

    <footer className="royal-map__dossier-footer">
      <span>{isPreview ? 'Click the map record to pin this dossier.' : 'Drag the title bar · Resize from the lower-right corner'}</span>
      {record.openTarget && <button type="button" className="royal-map__inspector-open" onClick={() => onOpen(record)}>
        Open full dossier <ArrowRight size={14} aria-hidden="true" />
      </button>}
      {!record.openTarget && !isPreview && <span className="royal-map__dossier-no-route">Group-level archive record</span>}
      {!isPreview && <ChevronRight className="royal-map__dossier-resize-cue" size={14} aria-hidden="true" />}
    </footer>
  </aside>;
}
