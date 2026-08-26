import { useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BookOpenCheck,
  Boxes,
  BrainCircuit,
  Building2,
  CircleHelp,
  Clock3,
  Crosshair,
  FileSearch,
  GitBranch,
  GitCompareArrows,
  KeyRound,
  MapPin,
  Network,
  Orbit,
  Route,
  Scale,
  SearchCheck,
  Shield,
  Ship,
  Sparkles,
  Users,
} from 'lucide-react';
import {
  getAbilityTransferInheritanceLedger,
  getActiveAssignmentsAtChapter,
  getActiveRelationshipsAtChapter,
  getChapterWhatChanged,
  getConsequenceChains,
  getCurseRegistry,
  getEntitiesAtLocation,
  getEntitiesByType,
  getEntityById,
  getEventsAtLocation,
  getEventsForCharacter,
  getEventsForOrganization,
  getFactionResourceBoard,
  getLocationSnapshot,
  getMafiaWarCommandCenter,
  getMartialLawCommandBoard,
  getMovementHistoryForCharacter,
  getOrganizationMembers,
  getPrinceCampaignBoard,
  getQueenIntelligenceBoard,
  getRelationshipSnapshot,
  getRoyalHouseholdMatrix,
  getThreatAssassinationMatrix,
  getUnresolvedLedgers,
} from '../../data/succession/successionData';
import { entityWorkspaceTarget } from './SuccessionArchivePrimitives';
import './SuccessionExplorerRoutePanels.css';

const safe = (factory, fallback = null) => {
  try { return factory(); } catch { return fallback; }
};
const labelize = (value) => String(value || 'unknown').replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
const entityLabel = (entity) => entity?.name || entity?.title || entity?.term || entity?.label || entity?.id || 'Unknown';
const compact = (value, max = 150) => {
  const string = String(value || '');
  return string.length > max ? `${string.slice(0, max - 1)}…` : string;
};
const number = (value) => Number.isFinite(Number(value)) ? Number(value) : 0;
const asArray = (value) => Array.isArray(value) ? value : value == null ? [] : [value];
const unique = (values) => [...new Set((values || []).filter(Boolean))];
const entityFromNode = (node) => node?.entityId ? getEntityById(node.entityId) : null;

function Panel({ eyebrow, title, description, icon: Icon = Activity, action = null, children, className = '' }) {
  return <section className={`succession-explorer-route-panel ${className}`.trim()}>
    <header>
      <div><span>{eyebrow}</span><h3><Icon size={18} aria-hidden="true" /> {title}</h3>{description && <p>{description}</p>}</div>
      {action}
    </header>
    {children}
  </section>;
}

function Empty({ children = 'Select a record in the Explorer to open this instrument.' }) {
  return <p className="succession-explorer-route-panel__empty">{children}</p>;
}

function MetricGrid({ items }) {
  return <dl className="succession-explorer-metric-grid">{items.map(([label, value, detail]) => <div key={label}><dt>{label}</dt><dd>{value}</dd>{detail && <small>{detail}</small>}</div>)}</dl>;
}

function LinkButton({ entity, onNavigate, children = null }) {
  if (!entity) return null;
  return <button type="button" className="succession-explorer-record-link" onClick={() => onNavigate(entityWorkspaceTarget(entity), { entity: entity.id })}>
    <span>{labelize(entity.entityType)}</span><strong>{children || entityLabel(entity)}</strong><ArrowRight size={12} aria-hidden="true" />
  </button>;
}

function DensityPanel({ model, title = 'Activity landscape' }) {
  const byChapter = useMemo(() => {
    const map = new Map();
    for (const node of model.nodes) {
      if (!Number.isFinite(Number(node.chapter))) continue;
      const chapter = Number(node.chapter);
      map.set(chapter, (map.get(chapter) || 0) + 1);
    }
    return [...map.entries()].sort((a, b) => a[0] - b[0]);
  }, [model.nodes]);
  const maximum = Math.max(1, ...byChapter.map(([, count]) => count));
  const byGroup = useMemo(() => {
    const map = new Map();
    for (const node of model.nodes) map.set(node.group || 'Other', (map.get(node.group || 'Other') || 0) + 1);
    return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12);
  }, [model.nodes]);
  return <Panel eyebrow="Density engine" title={title} description="The display aggregates the currently visible chapter-safe model. Change lens, semantic depth, query, or chapter and the landscape recalculates." icon={Activity}>
    <div className="succession-explorer-density-plot" aria-label="Record density by chapter">{byChapter.map(([chapter, count]) => <div key={chapter} title={`Chapter ${chapter}: ${count} visible records`}><i style={{ height: `${Math.max(6, Math.round(count / maximum * 100))}%` }} /><span>{chapter % 5 === 0 || chapter === byChapter.at(-1)?.[0] ? chapter : ''}</span></div>)}</div>
    <div className="succession-explorer-ranked-bars">{byGroup.map(([group, count]) => <div key={group}><span>{group}</span><i><b style={{ width: `${Math.max(4, count / Math.max(1, byGroup[0]?.[1]) * 100)}%` }} /></i><strong>{count}</strong></div>)}</div>
  </Panel>;
}

function TrailPanel({ selectedNode, chapter, onNavigate }) {
  const entity = entityFromNode(selectedNode);
  const trail = useMemo(() => {
    if (!entity) return [];
    if (entity.entityType === 'character') {
      const events = safe(() => getEventsForCharacter(entity.id), []);
      const movement = safe(() => getMovementHistoryForCharacter(entity.id), []);
      return [
        ...events.map((record) => ({ id: record.id, chapter: record.chapterRange?.start || record.chapter, kind: 'event', label: entityLabel(record), entity: record })),
        ...movement.map((record) => ({ id: record.id, chapter: record.chapterRange?.start, kind: 'movement', label: `Moved / present at ${entityLabel(getEntityById(record.locationId))}`, entity: getEntityById(record.locationId) })),
      ].filter((row) => number(row.chapter) <= chapter).sort((a, b) => number(a.chapter) - number(b.chapter));
    }
    if (entity.entityType === 'organization') return safe(() => getEventsForOrganization(entity.id), []).filter((record) => number(record.chapterRange?.start) <= chapter).map((record) => ({ id: record.id, chapter: record.chapterRange?.start, kind: 'event', label: entityLabel(record), entity: record }));
    if (entity.entityType === 'location') return safe(() => getEventsAtLocation(entity.id), []).filter((record) => number(record.chapterRange?.start) <= chapter).map((record) => ({ id: record.id, chapter: record.chapterRange?.start, kind: 'event', label: entityLabel(record), entity: record }));
    return [];
  }, [chapter, entity]);
  return <Panel eyebrow="Historical trail" title={entity ? `${entityLabel(entity)} through time` : 'Follow one subject through time'} description="A trail is a subject-specific chronology, not a duplicate biography." icon={Route}>
    {!entity && <Empty />}
    {entity && !trail.length && <Empty>No indexed event or movement trail is available for this record at Chapter {chapter}.</Empty>}
    {!!trail.length && <ol className="succession-explorer-trail">{trail.slice(-60).map((row) => <li key={`${row.kind}:${row.id}`}><span>CH. {row.chapter}</span><i /><button type="button" onClick={() => row.entity && onNavigate(entityWorkspaceTarget(row.entity), { entity: row.entity.id, chapter: row.chapter })}><small>{labelize(row.kind)}</small><strong>{row.label}</strong></button></li>)}</ol>}
  </Panel>;
}

function CharacterActivityPanel({ chapter, onNavigate }) {
  const rows = useMemo(() => getEntitiesByType('character').map((character) => {
    const events = safe(() => getEventsForCharacter(character.id), []).filter((event) => number(event.chapterRange?.start || event.chapter) <= chapter);
    return { character, count: events.length, latest: Math.max(0, ...events.map((event) => number(event.chapterRange?.start || event.chapter))) };
  }).filter((row) => row.count).sort((a, b) => b.count - a.count).slice(0, 30), [chapter]);
  const maximum = Math.max(1, ...rows.map((row) => row.count));
  return <Panel eyebrow="Human atlas" title="Character activity pressure" description="Activity means indexed canonical event participation through the selected chapter, not combat strength or narrative quality." icon={Users}>
    <div className="succession-explorer-activity-table">{rows.map((row) => <button type="button" key={row.character.id} onClick={() => onNavigate('characters', { entity: row.character.id, chapter })}><span>{entityLabel(row.character)}</span><i><b style={{ width: `${row.count / maximum * 100}%` }} /></i><strong>{row.count}</strong><small>latest {row.latest || '—'}</small></button>)}</div>
  </Panel>;
}

function RelationshipNeighborhoodPanel({ selectedNode, chapter, onNavigate }) {
  const entity = entityFromNode(selectedNode);
  const snapshot = useMemo(() => entity ? safe(() => getRelationshipSnapshot(entity.id, chapter), null) : null, [chapter, entity]);
  return <Panel eyebrow="Living social graph" title={entity ? `${entityLabel(entity)} relationship neighborhood` : 'Relationship neighborhood'} description="Edges are active at the current chapter boundary. Change the time machine to watch the neighborhood change." icon={Network}>
    {!snapshot && <Empty />}
    {snapshot && <>
      <MetricGrid items={[
        ['Active edges', snapshot.relationships.length],
        ['Outgoing', snapshot.outgoing.length],
        ['Incoming', snapshot.incoming.length],
        ['Neighbors', snapshot.neighbors.length],
      ]} />
      <div className="succession-explorer-edge-ledger">{snapshot.relationships.slice(0, 40).map((relationship) => {
        const source = getEntityById(relationship.sourceEntityId);
        const target = getEntityById(relationship.targetEntityId);
        return <article key={relationship.id}><span>{labelize(relationship.relationshipType)} · {labelize(relationship.sentiment)}</span><div><LinkButton entity={source} onNavigate={onNavigate} /><ArrowRight size={13} /><LinkButton entity={target} onNavigate={onNavigate} /></div><small>Ch. {relationship.chapterRange?.start}{relationship.chapterRange?.end ? `–${relationship.chapterRange.end}` : '+'}</small></article>;
      })}</div>
    </>}
  </Panel>;
}

function RoyalProtectionPanel({ selectedNode, chapter, onNavigate }) {
  const entity = entityFromNode(selectedNode);
  const assignments = useMemo(() => entity ? safe(() => getActiveAssignmentsAtChapter(chapter, { subjectEntityId: entity.id }), []) : [], [chapter, entity]);
  const incomingRelationships = useMemo(() => entity ? safe(() => getActiveRelationshipsAtChapter(chapter, { targetEntityId: entity.id }), []) : [], [chapter, entity]);
  const buckets = useMemo(() => {
    const result = new Map();
    for (const assignment of assignments) {
      const key = labelize(assignment.assignmentType || 'Other');
      if (!result.has(key)) result.set(key, []);
      result.get(key).push(assignment);
    }
    return [...result.entries()];
  }, [assignments]);
  return <Panel eyebrow="Protection geometry" title={entity ? `${entityLabel(entity)} protection and threat rings` : 'Select a royal subject'} description="Protection, observation, infiltration, instruction, custody, assassination, and other assignments remain distinct instead of becoming one vague guard list." icon={Shield}>
    {!entity && <Empty>Select a prince or queen in the board above.</Empty>}
    {entity && <>
      <MetricGrid items={[
        ['Assignments on subject', assignments.length],
        ['Relationship pressure', incomingRelationships.length],
        ['Operational types', buckets.length],
      ]} />
      <div className="succession-explorer-rings"><div className="succession-explorer-rings__center"><span>{entity.princeOrder ? `Prince ${entity.princeOrder}` : labelize(entity.roles?.[0])}</span><strong>{entityLabel(entity)}</strong></div>{buckets.map(([type, records], index) => <section style={{ '--ring-index': index }} key={type}><h4>{type}</h4>{records.map((assignment) => { const person = getEntityById(assignment.personId); const principal = getEntityById(assignment.principalEntityId); return <article key={assignment.id}><LinkButton entity={person} onNavigate={onNavigate} /><small>{principal ? `from ${entityLabel(principal)}` : assignment.authorityBasis || ''}</small></article>; })}</section>)}</div>
    </>}
  </Panel>;
}

function RoyalPressurePanel({ chapter, onNavigate }) {
  const princes = useMemo(() => safe(() => getPrinceCampaignBoard(chapter), []), [chapter]);
  const threats = useMemo(() => safe(() => getThreatAssassinationMatrix(chapter), []), [chapter]);
  const rows = princes.map((row) => {
    const princeId = row.character?.id;
    const incoming = threats.filter((threat) => threat.target?.id === princeId || threat.targetEntityId === princeId);
    const outgoing = threats.filter((threat) => threat.source?.id === princeId || threat.sourceEntityId === princeId);
    return { ...row, incoming, outgoing };
  });
  const maxThreat = Math.max(1, ...rows.map((row) => row.incoming.length));
  return <Panel eyebrow="Succession pressure" title="Fourteen-prince operational pressure board" description="Pressure is derived from documented incoming/outgoing threat signals and current archive state. It is not a power ranking." icon={Crosshair}>
    <div className="succession-explorer-prince-pressure">{rows.map((row) => <button type="button" onClick={() => onNavigate('princes', { entity: row.character.id, prince: row.order, chapter })} key={row.character.id}><span>#{row.order}</span><strong>{row.character.name}</strong><i><b style={{ width: `${Math.max(3, row.incoming.length / maxThreat * 100)}%` }} /></i><small>{row.incoming.length} incoming · {row.outgoing.length} outgoing</small><em>{labelize(row.life)} · {labelize(row.body)}</em></button>)}</div>
  </Panel>;
}

function AssignmentOperationsPanel({ chapter, selectedNode, onNavigate }) {
  const selected = entityFromNode(selectedNode);
  const assignments = useMemo(() => safe(() => getActiveAssignmentsAtChapter(chapter), []), [chapter]);
  const filtered = selected ? assignments.filter((record) => [record.personId, record.principalEntityId, record.subjectEntityId, record.allegianceEntityId, record.reportingEntityId].includes(selected.id)) : assignments;
  const byType = useMemo(() => {
    const map = new Map();
    for (const record of filtered) map.set(record.assignmentType || 'other', (map.get(record.assignmentType || 'other') || 0) + 1);
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [filtered]);
  return <Panel eyebrow="Operational command" title={selected ? `${entityLabel(selected)} assignment picture` : 'Active assignment system'} description="Principal → operative → subject remains visible alongside location, allegiance, reporting line, secrecy, and chapter range." icon={GitBranch}>
    <MetricGrid items={[[selected ? 'Connected assignments' : 'Active assignments', filtered.length], ['Assignment types', byType.length], ['Subjects', unique(filtered.map((row) => row.subjectEntityId)).length], ['Principals', unique(filtered.map((row) => row.principalEntityId)).length]]} />
    <div className="succession-explorer-assignment-ledger">{filtered.slice(0, 50).map((assignment) => {
      const principal = getEntityById(assignment.principalEntityId);
      const person = getEntityById(assignment.personId);
      const subject = getEntityById(assignment.subjectEntityId);
      return <article key={assignment.id}><span>{labelize(assignment.assignmentType)} · {labelize(assignment.secrecy)}</span><div><LinkButton entity={principal} onNavigate={onNavigate} /><ArrowRight size={12} /><LinkButton entity={person} onNavigate={onNavigate} /><ArrowRight size={12} /><LinkButton entity={subject} onNavigate={onNavigate} /></div><small>{entityLabel(getEntityById(assignment.locationId))} · Ch. {assignment.chapterRange?.start}{assignment.chapterRange?.end ? `–${assignment.chapterRange.end}` : '+'}</small></article>;
    })}</div>
  </Panel>;
}

function OrganizationPanel({ selectedNode, chapter, view, onNavigate }) {
  const organization = entityFromNode(selectedNode);
  const factions = useMemo(() => safe(() => getFactionResourceBoard(chapter), []), [chapter]);
  const martial = useMemo(() => safe(() => getMartialLawCommandBoard(chapter), null), [chapter]);
  const mafia = useMemo(() => safe(() => getMafiaWarCommandCenter(chapter), []), [chapter]);
  const members = organization?.entityType === 'organization' ? safe(() => getOrganizationMembers(organization.id), []) : [];
  const events = organization?.entityType === 'organization' ? safe(() => getEventsForOrganization(organization.id), []).filter((event) => number(event.chapterRange?.start) <= chapter) : [];
  if (view === 'power' || !organization) return <Panel eyebrow="Power atlas" title="Institution and faction operating field" description="Use the canvas for topology; this ledger exposes the current resource and command picture behind it." icon={Building2}>
    <MetricGrid items={[["Faction snapshots", factions.length], ["Mafia families", mafia.length], ["Martial-law institutions", martial?.institutions?.length || 0], ["Active organizations", getEntitiesByType('organization').length]]} />
    <div className="succession-explorer-faction-grid">{factions.slice(0, 16).map((row, index) => <article key={row.organization?.id || row.id || index}><span>{labelize(row.organization?.organizationType || row.organizationType || 'faction')}</span><strong>{row.organization?.name || row.name || entityLabel(getEntityById(row.organizationId))}</strong><p>{compact(row.objective || row.summary || row.operationalState || 'Chapter-bounded faction snapshot.')}</p></article>)}</div>
  </Panel>;
  return <Panel eyebrow={labelize(view)} title={entityLabel(organization)} description={organization.summary} icon={Building2}>
    <MetricGrid items={[["Personnel", members.length], ["Indexed events", events.length], ["Leaders", organization.leaderIds?.length || 0], ["Locations", organization.locationIds?.length || (organization.primaryLocationId ? 1 : 0)]]} />
    <div className="succession-explorer-personnel-grid">{members.slice(0, 36).map((membership) => <LinkButton entity={membership.character} onNavigate={onNavigate} key={membership.character.id} />)}</div>
    {asArray(organization.objectives || organization.objective).length > 0 && <div className="succession-explorer-prose-ledger"><h4>Objectives</h4>{asArray(organization.objectives || organization.objective).map((item, index) => <p key={index}>{String(item)}</p>)}</div>}
  </Panel>;
}

function LocationPanel({ selectedNode, chapter, view, onNavigate }) {
  const location = entityFromNode(selectedNode);
  const snapshot = useMemo(() => location?.entityType === 'location' ? safe(() => getLocationSnapshot(location.id, chapter), null) : null, [chapter, location]);
  if (!snapshot) return <Panel eyebrow="Spatial history" title="Select a location on the map" description="Every mapped place can become a chapter-aware biography of occupants, events, assignments, Nen, and hierarchy." icon={MapPin}><Empty /></Panel>;
  const history = snapshot.history || [];
  return <Panel eyebrow={labelize(view)} title={entityLabel(location)} description={location.summary || location.description} icon={view === 'paths' || view === 'routes' ? Route : MapPin}>
    <MetricGrid items={[["Occupants now", snapshot.occupants?.length || 0], ["Events now", snapshot.events?.length || 0], ["Assignments now", snapshot.assignments?.length || 0], ["Nen systems", snapshot.abilities?.length || 0], ["Child locations", snapshot.children?.length || 0], ["History records", history.length]]} />
    {(view === 'occupancy' || view === 'history') && <div className="succession-explorer-personnel-grid">{(snapshot.occupants || []).map((entry) => <LinkButton entity={entry.entity} onNavigate={onNavigate} key={entry.entity.id} />)}</div>}
    {(view === 'events' || view === 'history') && <div className="succession-explorer-prose-ledger"><h4>Active / known events</h4>{(snapshot.events || []).slice(0, 30).map((event) => <LinkButton entity={event} onNavigate={onNavigate} key={event.id} />)}</div>}
    {(view === 'paths' || view === 'routes' || view === 'control') && <div className="succession-explorer-route-chain">{(snapshot.breadcrumbs || []).map((place, index) => <div key={place.id}><LinkButton entity={place} onNavigate={onNavigate} />{index < snapshot.breadcrumbs.length - 1 && <ArrowRight size={13} />}</div>)}</div>}
  </Panel>;
}

function NenMechanicsPanel({ selectedNode, chapter, view, onNavigate }) {
  const entity = entityFromNode(selectedNode);
  const ability = entity?.entityType === 'ability' ? entity : null;
  const beast = entity?.entityType === 'guardian-beast' ? entity : null;
  const curses = useMemo(() => safe(() => getCurseRegistry(chapter), { abilities: [], protocols: [] }), [chapter]);
  const transfers = useMemo(() => safe(() => getAbilityTransferInheritanceLedger(chapter), []), [chapter]);
  if ((view === 'taxonomy' || view === 'systems') && !ability && !beast) {
    const abilities = getEntitiesByType('ability').filter((record) => !record.firstChapter || record.firstChapter <= chapter);
    const categories = new Map();
    for (const record of abilities) categories.set(record.category || record.classification?.nenTypes?.[0] || 'unknown', (categories.get(record.category || record.classification?.nenTypes?.[0] || 'unknown') || 0) + 1);
    return <Panel eyebrow="Nen systems laboratory" title="Mechanic taxonomy" description="Classic Nen type is only one dimension. Succession systems are also grouped by ritual, curse, possession, token, parasitic, transfer, information, and other documented mechanics." icon={Orbit}>
      <MetricGrid items={[["Known ability records", abilities.length], ["Mechanic categories", categories.size], ["Curse abilities", curses.abilities?.length || 0], ["Transfer / inheritance", transfers.length]]} />
      <div className="succession-explorer-taxonomy">{[...categories.entries()].sort((a, b) => b[1] - a[1]).map(([category, count]) => <article key={category}><span>{count}</span><strong>{labelize(category)}</strong></article>)}</div>
    </Panel>;
  }
  if (!ability && !beast) return <Panel eyebrow="Nen systems laboratory" title="Select an ability or Guardian Spirit Beast" description="The mechanics instrument expands activation, conditions, limits, costs, targets, certainty, and host/owner relationships." icon={Orbit}><Empty /></Panel>;
  if (beast) {
    const host = getEntityById(beast.hostCharacterId || beast.ownerIds?.[0]);
    const known = (beast.knownAbilityIds || []).map(getEntityById).filter(Boolean);
    const suspected = (beast.suspectedAbilityIds || []).map(getEntityById).filter(Boolean);
    return <Panel eyebrow="Ritual ecology" title={entityLabel(beast)} description={beast.summary} icon={Sparkles}>
      <MetricGrid items={[["Host", entityLabel(host)], ["Known abilities", known.length], ["Suspected abilities", suspected.length], ["State", labelize(beast.status || beast.researchStatus || 'known')]]} />
      <div className="succession-explorer-mechanic-flow"><div><span>Host</span><LinkButton entity={host} onNavigate={onNavigate} /></div><ArrowRight size={16} /><div><span>Guardian Beast</span><strong>{entityLabel(beast)}</strong></div><ArrowRight size={16} /><div><span>Mechanics</span>{[...known, ...suspected].map((record) => <LinkButton entity={record} onNavigate={onNavigate} key={record.id} />)}</div></div>
    </Panel>;
  }
  const owners = (ability.ownerIds || []).map(getEntityById).filter(Boolean);
  const steps = [
    ['Activation', ability.activation],
    ['Conditions', ability.conditions],
    ['Mechanism / category', ability.category],
    ['Targets / effect', ability.targets || ability.knownUses],
    ['Cost', ability.costs],
    ['Limits', ability.limitations],
  ].filter(([, value]) => asArray(value).length > 0 && asArray(value).some(Boolean));
  return <Panel eyebrow={view === 'hypotheses' ? 'Known vs unresolved' : 'Mechanics circuit'} title={entityLabel(ability)} description={ability.summary} icon={Orbit}>
    <MetricGrid items={[["Nen type", (ability.classification?.nenTypes || ['unknown']).map(labelize).join(' · ')], ["Category", labelize(ability.category)], ["First chapter", ability.firstChapter || '—'], ["Latest evidence", ability.latestChapter || chapter], ["Certainty", labelize(ability.classification?.certainty || ability.canonLevel)], ["Status", labelize(ability.status)]]} />
    <div className="succession-explorer-mechanic-owners">{owners.map((owner) => <LinkButton entity={owner} onNavigate={onNavigate} key={owner.id} />)}</div>
    <div className="succession-explorer-mechanic-circuit">{steps.map(([label, value], index) => <div key={label}><article><span>{String(index + 1).padStart(2, '0')}</span><strong>{label}</strong>{asArray(value).slice(0, 8).map((line, lineIndex) => <p key={lineIndex}>{String(line)}</p>)}</article>{index < steps.length - 1 && <ArrowRight size={16} aria-hidden="true" />}</div>)}</div>
    {view === 'hypotheses' && <div className="succession-explorer-uncertainty"><CircleHelp size={18} /><div><strong>Research status</strong><p>{ability.researchStatus || 'No explicit unresolved-mechanics note is stored for this ability.'}</p></div></div>}
  </Panel>;
}

function EventAnatomyPanel({ selectedNode, chapter, view, onNavigate }) {
  const event = entityFromNode(selectedNode);
  const consequences = useMemo(() => safe(() => getConsequenceChains(chapter), { nodes: [], links: [] }), [chapter]);
  if (event?.entityType !== 'event') {
    if (view === 'density') return null;
    return <Panel eyebrow="Operations atlas" title="Select a canonical event" description="The event anatomy separates participants, place, systems, causes, state changes, outcomes, and connected consequences." icon={Clock3}><Empty /></Panel>;
  }
  const participants = unique([...(event.participantIds || []), ...(event.characterIds || [])]).map(getEntityById).filter(Boolean);
  const organizations = (event.organizationIds || []).map(getEntityById).filter(Boolean);
  const locations = unique([event.locationId, ...(event.locationIds || [])]).map(getEntityById).filter(Boolean);
  const abilities = (event.abilityIds || []).map(getEntityById).filter(Boolean);
  const outgoing = (consequences.links || []).filter((link) => [link.source, link.from, link.sourceId].includes(event.id));
  const incoming = (consequences.links || []).filter((link) => [link.target, link.to, link.targetId].includes(event.id));
  return <Panel eyebrow={view === 'operations' ? 'Operation anatomy' : 'Event anatomy'} title={entityLabel(event)} description={event.summary || event.detail} icon={Clock3}>
    <MetricGrid items={[["Chapter", event.chapterRange?.start || event.chapter], ["Participants", participants.length], ["Organizations", organizations.length], ["Locations", locations.length], ["Nen systems", abilities.length], ["Causal links", incoming.length + outgoing.length]]} />
    <div className="succession-explorer-event-anatomy"><section><span>People</span>{participants.map((entity) => <LinkButton entity={entity} onNavigate={onNavigate} key={entity.id} />)}</section><section><span>Place</span>{locations.map((entity) => <LinkButton entity={entity} onNavigate={onNavigate} key={entity.id} />)}</section><section><span>Systems</span>{abilities.map((entity) => <LinkButton entity={entity} onNavigate={onNavigate} key={entity.id} />)}</section><section><span>Organizations</span>{organizations.map((entity) => <LinkButton entity={entity} onNavigate={onNavigate} key={entity.id} />)}</section></div>
    {asArray(event.outcomes).length > 0 && <div className="succession-explorer-prose-ledger"><h4>Outcomes</h4>{asArray(event.outcomes).map((value, index) => <p key={index}>{typeof value === 'object' ? compact(value.summary || value.description || JSON.stringify(value)) : String(value)}</p>)}</div>}
  </Panel>;
}

function ChapterDossierPanel({ chapter, view, onNavigate }) {
  const changed = useMemo(() => safe(() => getChapterWhatChanged(chapter), null), [chapter]);
  const chapterEntity = getEntitiesByType('chapter').find((record) => Number(record.number) === Number(chapter));
  if (!changed) return null;
  const idCollections = [
    ['Events', changed.eventIds], ['People', changed.participantIds], ['Organizations', changed.organizationIds],
    ['Locations', changed.locationIds], ['Nen', changed.abilityIds], ['Relationships', changed.relationshipIds], ['Assignments', changed.assignmentIds],
  ];
  return <Panel eyebrow={view === 'previously' ? 'Causal prerequisites' : 'Chapter intelligence'} title={`Chapter ${chapter}${chapterEntity?.title ? ` · ${chapterEntity.title}` : ''}`} description={changed.whyItMatters || chapterEntity?.summary} icon={BookOpenCheck}>
    <MetricGrid items={idCollections.map(([label, ids]) => [label, ids?.length || 0])} />
    <div className="succession-explorer-chapter-domains">{idCollections.map(([label, ids]) => <section key={label}><h4>{label}</h4>{(ids || []).slice(0, 16).map((id) => <LinkButton entity={getEntityById(id)} onNavigate={onNavigate} key={id} />)}</section>)}</div>
    {!!changed.questionsStillOpen?.length && <div className="succession-explorer-prose-ledger"><h4>Still open</h4>{changed.questionsStillOpen.slice(0, 12).map((question, index) => <p key={index}>{question}</p>)}</div>}
  </Panel>;
}

function ResearchPanel({ chapter, view, onNavigate }) {
  const unresolved = useMemo(() => safe(() => getUnresolvedLedgers(chapter), { identities: [], abilities: [] }), [chapter]);
  const changed = useMemo(() => safe(() => getChapterWhatChanged(chapter), null), [chapter]);
  const sourceCount = getEntitiesByType('source').length;
  const knowledgeCount = getEntitiesByType('knowledge-record').length;
  const evidenceCount = getEntitiesByType('evidence-item').length;
  if (view === 'gaps' || view === 'contradictions') return <Panel eyebrow="Evidence workstation" title={view === 'gaps' ? 'Research gaps and unresolved claims' : 'Evidence tensions to review'} description="Unknown, unresolved, and contradictory-looking records stay explicit. The interface does not silently promote an inference to canon." icon={CircleHelp}>
    <MetricGrid items={[["Unresolved identities", unresolved.identities?.length || 0], ["Unresolved abilities", unresolved.abilities?.length || 0], ["Current chapter open questions", changed?.questionsStillOpen?.length || 0], ["Sources", sourceCount]]} />
    <div className="succession-explorer-research-gaps">{[...(unresolved.identities || []), ...(unresolved.abilities || [])].slice(0, 40).map((record, index) => { const entity = record.entity || getEntityById(record.id || record.entityId || record.ability?.id); return <article key={entity?.id || record.id || index}><span>{entity ? labelize(entity.entityType) : 'Unresolved'}</span><strong>{entityLabel(entity) || record.name || record.title || 'Open record'}</strong><p>{compact(record.unknown || record.summary || record.reason || record.researchStatus || 'Requires additional canonical evidence.')}</p>{entity && <LinkButton entity={entity} onNavigate={onNavigate} />}</article>; })}</div>
  </Panel>;
  return <Panel eyebrow="Evidence workstation" title={view === 'coverage' ? 'Archive coverage map' : 'Evidence and provenance layer'} description="Sources, knowledge records, evidence objects, protocols, and chapter deltas are separate from lore presentation so confidence can be audited." icon={FileSearch}>
    <MetricGrid items={[["Sources", sourceCount], ["Knowledge records", knowledgeCount], ["Evidence items", evidenceCount], ["Protocols", getEntitiesByType('protocol').length], ["Documents", getEntitiesByType('document').length], ["Objects", getEntitiesByType('object').length]]} />
    {view === 'coverage' && <DensityPanel model={{ nodes: getEntitiesByType('source').map((record) => ({ chapter: record.chapter || record.chapterRange?.start || 340, group: 'Sources' })), stats: { visible: sourceCount, total: sourceCount, label: 'sources' } }} title="Source coverage across chapters" />}
  </Panel>;
}

function ArchiveDashboardPanel({ chapter, model, explorer, onNavigate }) {
  const assignments = safe(() => getActiveAssignmentsAtChapter(chapter), []);
  const relationships = safe(() => getActiveRelationshipsAtChapter(chapter), []);
  const threats = safe(() => getThreatAssassinationMatrix(chapter), []);
  const unresolved = safe(() => getUnresolvedLedgers(chapter), { identities: [], abilities: [] });
  const locations = getEntitiesByType('location');
  return <Panel eyebrow="Succession command center" title={`Whole-world state at Chapter ${chapter}`} description="The home instrument summarizes the connected world and opens the appropriate specialist lens instead of duplicating all of its content." icon={Ship}>
    <MetricGrid items={[["Visible world points", model.nodes.length], ["Active assignments", assignments.length], ["Active relationships", relationships.length], ["Threat signals", threats.length], ["Mapped locations", locations.length], ["Unresolved system / identity records", (unresolved.identities?.length || 0) + (unresolved.abilities?.length || 0)]]} />
    <div className="succession-explorer-command-portals">
      <button type="button" onClick={() => onNavigate('timeline', explorer.buildDeepLinkParams('timeline'))}><Clock3 /><span>Temporal Atlas</span><strong>Time, causality, playback</strong></button>
      <button type="button" onClick={() => onNavigate('characters', explorer.buildDeepLinkParams('characters'))}><Users /><span>Human Atlas</span><strong>People, activity, knowledge</strong></button>
      <button type="button" onClick={() => onNavigate('black-whale', explorer.buildDeepLinkParams('black-whale'))}><MapPin /><span>Living Ship</span><strong>Space, occupancy, movement</strong></button>
      <button type="button" onClick={() => onNavigate('nen', explorer.buildDeepLinkParams('nen'))}><Orbit /><span>Nen Systems</span><strong>Mechanics, rules, uncertainty</strong></button>
      <button type="button" onClick={() => onNavigate('relationships', explorer.buildDeepLinkParams('relationships'))}><Network /><span>Social Graph</span><strong>Edges, paths, chapter state</strong></button>
      <button type="button" onClick={() => onNavigate('research', explorer.buildDeepLinkParams('research'))}><FileSearch /><span>Evidence</span><strong>Claims, sources, gaps</strong></button>
    </div>
  </Panel>;
}

function StoryPressurePanel({ chapter, onNavigate }) {
  const threats = useMemo(() => safe(() => getThreatAssassinationMatrix(chapter), []), [chapter]);
  const factions = useMemo(() => safe(() => getFactionResourceBoard(chapter), []), [chapter]);
  const households = useMemo(() => safe(() => getRoyalHouseholdMatrix(chapter), []), [chapter]);
  return <Panel eyebrow="Narrative pressure" title="What is actively pushing the story?" description="This pressure view is built from documented threats, faction state, and royal household state, not an invented universal score." icon={AlertTriangle}>
    <MetricGrid items={[["Threat signals", threats.length], ["Faction snapshots", factions.length], ["Royal households", households.length], ["Current chapter", chapter]]} />
    <div className="succession-explorer-pressure-ledger">{threats.slice(0, 30).map((row, index) => { const source = row.source || getEntityById(row.sourceEntityId); const target = row.target || getEntityById(row.targetEntityId); return <article key={row.id || index}><span>{labelize(row.threatType || row.type || 'threat')}</span><div>{source && <LinkButton entity={source} onNavigate={onNavigate} />}<ArrowRight size={12} />{target && <LinkButton entity={target} onNavigate={onNavigate} />}</div><p>{compact(row.summary || row.reason || row.objective || row.status)}</p></article>; })}</div>
  </Panel>;
}

function GenericComparePanel({ compareIds, onNavigate }) {
  const entities = compareIds.map(getEntityById).filter(Boolean);
  if (entities.length < 2) return <Panel eyebrow="Comparison" title="Add at least two records to Compare" description="The tray persists while you move across routes." icon={GitCompareArrows}><Empty>Use the Compare button in a selected record. Up to five records can travel with you.</Empty></Panel>;
  const fields = ['entityType', 'status', 'canonLevel', 'category', 'organizationType', 'firstChapter', 'latestChapter', 'princeOrder', 'queenRank', 'researchStatus'];
  return <Panel eyebrow="Comparison" title={`${entities.length}-record comparison`} description="This first-pass universal comparison exposes comparable canonical fields and links back to the complete dossiers." icon={GitCompareArrows}>
    <div className="succession-explorer-compare-matrix"><div className="is-label"><span>Field</span>{fields.map((field) => <strong key={field}>{labelize(field)}</strong>)}</div>{entities.map((entity) => <div key={entity.id}><LinkButton entity={entity} onNavigate={onNavigate} />{fields.map((field) => <span key={field}>{Array.isArray(entity[field]) ? entity[field].join(' · ') : String(entity[field] ?? '—')}</span>)}</div>)}</div>
  </Panel>;
}

export default function SuccessionExplorerRoutePanels({
  routeId,
  view,
  model,
  selectedNode,
  chapter,
  spoilerLimit,
  compareIds,
  explorer,
  onNavigate,
}) {
  if (routeId === 'archive') return <ArchiveDashboardPanel chapter={chapter} model={model} explorer={explorer} onNavigate={onNavigate} />;

  if (routeId === 'story') {
    if (view === 'pressure') return <StoryPressurePanel chapter={chapter} onNavigate={onNavigate} />;
    if (view === 'causality') return <EventAnatomyPanel selectedNode={selectedNode} chapter={chapter} view={view} onNavigate={onNavigate} />;
    if (view === 'guided' || view === 'phases') return <DensityPanel model={model} title={view === 'guided' ? 'Guide-entry density' : 'Narrative phase density'} />;
    return null;
  }

  if (routeId === 'timeline') {
    if (view === 'matrix' || view === 'heatmap') return <DensityPanel model={model} title={view === 'matrix' ? 'Chapter × lane activity' : 'Chronology heatmap'} />;
    if (view === 'trails') return <TrailPanel selectedNode={selectedNode} chapter={chapter} onNavigate={onNavigate} />;
    return null;
  }

  if (routeId === 'characters') {
    if (view === 'activity') return <CharacterActivityPanel chapter={chapter} onNavigate={onNavigate} />;
    if (view === 'relationships') return <RelationshipNeighborhoodPanel selectedNode={selectedNode} chapter={chapter} onNavigate={onNavigate} />;
    if (view === 'timeline') return <TrailPanel selectedNode={selectedNode} chapter={chapter} onNavigate={onNavigate} />;
    if (view === 'compare') return <GenericComparePanel compareIds={compareIds} onNavigate={onNavigate} />;
    return null;
  }

  if (routeId === 'princes') {
    if (view === 'protection') return <RoyalProtectionPanel selectedNode={selectedNode} chapter={chapter} onNavigate={onNavigate} />;
    if (view === 'pressure') return <RoyalPressurePanel chapter={chapter} onNavigate={onNavigate} />;
    if (view === 'compare') return <GenericComparePanel compareIds={compareIds} onNavigate={onNavigate} />;
    if (view === 'timeline') return <TrailPanel selectedNode={selectedNode} chapter={chapter} onNavigate={onNavigate} />;
    return null;
  }

  if (routeId === 'queens') {
    if (view === 'guards' || view === 'influence') return <RoyalProtectionPanel selectedNode={selectedNode} chapter={chapter} onNavigate={onNavigate} />;
    if (view === 'compare') return <GenericComparePanel compareIds={compareIds} onNavigate={onNavigate} />;
    if (view === 'timeline') return <TrailPanel selectedNode={selectedNode} chapter={chapter} onNavigate={onNavigate} />;
    return null;
  }

  if (routeId === 'bodyguards') return <AssignmentOperationsPanel chapter={chapter} selectedNode={selectedNode} onNavigate={onNavigate} />;

  if (routeId === 'organizations') {
    if (view === 'compare') return <GenericComparePanel compareIds={compareIds} onNavigate={onNavigate} />;
    if (view === 'timeline') return <TrailPanel selectedNode={selectedNode} chapter={chapter} onNavigate={onNavigate} />;
    return <OrganizationPanel selectedNode={selectedNode} chapter={chapter} view={view} onNavigate={onNavigate} />;
  }

  if (routeId === 'black-whale' || routeId === 'locations') {
    if (view === 'heatmap') return <DensityPanel model={model} title="Spatial activity heatmap" />;
    return <LocationPanel selectedNode={selectedNode} chapter={chapter} view={view} onNavigate={onNavigate} />;
  }

  if (routeId === 'nen' || routeId === 'guardian-spirit-beasts') {
    if (view === 'compare') return <GenericComparePanel compareIds={compareIds} onNavigate={onNavigate} />;
    if (view === 'timeline') return <TrailPanel selectedNode={selectedNode} chapter={chapter} onNavigate={onNavigate} />;
    return <NenMechanicsPanel selectedNode={selectedNode} chapter={chapter} view={view} onNavigate={onNavigate} />;
  }

  if (routeId === 'events') {
    if (view === 'density') return <DensityPanel model={model} title="Event density" />;
    if (view === 'compare') return <GenericComparePanel compareIds={compareIds} onNavigate={onNavigate} />;
    return <EventAnatomyPanel selectedNode={selectedNode} chapter={chapter} view={view} onNavigate={onNavigate} />;
  }

  if (routeId === 'relationships') {
    if (view === 'neighborhood' || view === 'temporal' || view === 'timeline') return <RelationshipNeighborhoodPanel selectedNode={selectedNode} chapter={chapter} onNavigate={onNavigate} />;
    if (view === 'compare') return <GenericComparePanel compareIds={compareIds} onNavigate={onNavigate} />;
    return null;
  }

  if (routeId === 'chapters') {
    if (view === 'density' || view === 'matrix') return <DensityPanel model={model} title="Chapter information density" />;
    if (view === 'diff') return null;
    return <ChapterDossierPanel chapter={chapter} view={view} onNavigate={onNavigate} />;
  }

  if (routeId === 'research') return <ResearchPanel chapter={chapter} view={view} onNavigate={onNavigate} />;

  if (routeId === 'glossary') {
    if (view === 'graph') return <DensityPanel model={model} title="Concept connection landscape" />;
    const entity = entityFromNode(selectedNode);
    return <Panel eyebrow="Concept universe" title={entity ? entityLabel(entity) : 'Select a glossary concept'} description={entity?.definition || entity?.summary || 'Terms stay connected to the canonical records that give them meaning.'} icon={KeyRound}>{entity ? <><MetricGrid items={[["Category", labelize(entity.category || entity.domain)], ["Certainty", labelize(entity.certainty || entity.canonLevel)], ["Synonyms", entity.synonyms?.length || 0], ["Sources", entity.sourceIds?.length || 0]]} /><div className="succession-explorer-personnel-grid">{unique([...(entity.relatedEntityIds || []), ...(entity.entityIds || [])]).map((id) => <LinkButton entity={getEntityById(id)} onNavigate={onNavigate} key={id} />)}</div></> : <Empty />}</Panel>;
  }

  if (routeId === 'search') {
    if (view === 'matrix' || view === 'timeline') return <DensityPanel model={model} title="Search result distribution" />;
    return null;
  }

  if (routeId === 'reader') return <ChapterDossierPanel chapter={chapter} view={view} onNavigate={onNavigate} />;

  return null;
}
