import {
  getActiveAssignmentsAtChapter,
  getActiveRelationshipsAtChapter,
  getCurrentLocationRecordForCharacter,
  getEntitiesByType,
  getEntityById,
  getEventsAtLocation,
  getEventsForChapter,
  getEventsForOrganization,
  getGlossaryEntriesAtChapter,
  getLocationChildren,
  getOrganizationMembers,
  getStoryEventsKnownAtChapter,
  isSuccessionEntityAvailableAtChapter,
  searchArchiveProduct,
} from './successionData.js';
import {
  successionDays,
  successionPreludeEvents,
  timelineTracks,
} from '../successionTimeline.js';

const freeze = (value) => Object.freeze(value);
const MIN_CHAPTER = 340;
const WORLD_WIDTH = 2400;
const WORLD_HEIGHT = 1400;
const unique = (values) => [...new Set((values || []).filter(Boolean))];
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const text = (value, fallback = '') => String(value ?? fallback);
const labelFor = (entity) => entity?.name || entity?.title || entity?.term || entity?.label || entity?.id || 'Unknown';
const summaryFor = (entity) => entity?.summary || entity?.detail || entity?.definition || entity?.objective || entity?.description || '';
const rangeFor = (entity) => entity?.chapterRange || {
  start: Number(entity?.firstChapter || entity?.chapter || entity?.number) || MIN_CHAPTER,
  end: Number(entity?.latestChapter || entity?.chapter || entity?.number) || null,
};
const chapterFor = (entity) => {
  const range = rangeFor(entity);
  return Number(range?.start || entity?.chapter || entity?.number || entity?.firstChapter) || MIN_CHAPTER;
};
const available = (entity, chapter) => {
  try {
    return isSuccessionEntityAvailableAtChapter(entity, chapter);
  } catch {
    return chapterFor(entity) <= chapter;
  }
};
const hash = (value) => {
  let result = 2166136261;
  for (const character of text(value)) {
    result ^= character.charCodeAt(0);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
};
const jitter = (value, amount = 18) => ((hash(value) % 1000) / 999 - .5) * amount;
const slugLabel = (value) => text(value || 'Other').replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());

const node = (entity, patch = {}) => freeze({
  id: patch.id || entity?.id || `node:${hash(JSON.stringify(entity))}`,
  entityId: patch.entityId === undefined ? entity?.id || null : patch.entityId,
  label: patch.label || labelFor(entity),
  subtitle: patch.subtitle ?? summaryFor(entity),
  kind: patch.kind || entity?.entityType || 'record',
  group: patch.group || 'Other',
  chapter: patch.chapter ?? chapterFor(entity),
  endChapter: patch.endChapter ?? rangeFor(entity)?.end ?? null,
  x: Number(patch.x) || 0,
  y: Number(patch.y) || 0,
  importance: clamp(Number(patch.importance ?? 1), 0, 4),
  searchText: patch.searchText || `${labelFor(entity)} ${summaryFor(entity)} ${(entity?.aliases || []).join(' ')} ${(entity?.tags || []).join(' ')}`.toLocaleLowerCase(),
  meta: freeze({ ...(patch.meta || {}) }),
});

const edge = (source, target, patch = {}) => freeze({
  id: patch.id || `${source}->${target}:${patch.kind || 'link'}`,
  source,
  target,
  kind: patch.kind || 'link',
  label: patch.label || '',
  directed: Boolean(patch.directed),
  strength: clamp(Number(patch.strength ?? 1), .2, 4),
  meta: freeze({ ...(patch.meta || {}) }),
});

const timelineX = (chapter, boundary) => {
  const end = Math.max(MIN_CHAPTER + 1, Number(boundary) || MIN_CHAPTER + 1);
  const progress = clamp((Number(chapter) - MIN_CHAPTER) / (end - MIN_CHAPTER), 0, 1);
  return 180 + progress * (WORLD_WIDTH - 300);
};

const organizeGroups = (records, getGroup) => {
  const groups = [];
  const groupIndex = new Map();
  for (const record of records) {
    const value = text(getGroup(record) || 'Other');
    if (!groupIndex.has(value)) {
      groupIndex.set(value, groups.length);
      groups.push(value);
    }
  }
  return { groups, groupIndex };
};

const layoutTimeline = (records, boundary, getGroup, makeNode = (record) => node(record)) => {
  const { groups, groupIndex } = organizeGroups(records, getGroup);
  const spacing = Math.max(82, Math.min(150, (WORLD_HEIGHT - 150) / Math.max(1, groups.length)));
  const nodes = records.map((record, index) => {
    const base = makeNode(record, index);
    const group = text(getGroup(record) || 'Other');
    return freeze({
      ...base,
      group,
      x: timelineX(base.chapter, boundary) + jitter(base.id, 22),
      y: 100 + groupIndex.get(group) * spacing + jitter(`${base.id}:y`, 24),
    });
  });
  return { nodes, groups };
};

const layoutGrid = (records, columns = 6, makeNode = (record) => node(record), group = () => 'All') => {
  const nodes = records.map((record, index) => {
    const base = makeNode(record, index);
    const col = index % columns;
    const row = Math.floor(index / columns);
    return freeze({
      ...base,
      group: text(group(record) || 'All'),
      x: 170 + col * 330,
      y: 140 + row * 180,
    });
  });
  return { nodes, groups: unique(nodes.map((item) => item.group)) };
};

const layoutRadial = (records, makeNode = (record) => node(record), group = () => 'All') => {
  const { groups, groupIndex } = organizeGroups(records, group);
  const centerX = WORLD_WIDTH / 2;
  const centerY = WORLD_HEIGHT / 2;
  const groupCount = Math.max(1, groups.length);
  const groupCenters = groups.map((_, index) => {
    const angle = (index / groupCount) * Math.PI * 2 - Math.PI / 2;
    const radius = Math.min(450, 150 + groupCount * 36);
    return { x: centerX + Math.cos(angle) * radius, y: centerY + Math.sin(angle) * radius };
  });
  const counts = new Map();
  const nodes = records.map((record, index) => {
    const base = makeNode(record, index);
    const groupName = text(group(record) || 'All');
    const groupId = groupIndex.get(groupName) || 0;
    const local = counts.get(groupName) || 0;
    counts.set(groupName, local + 1);
    const localAngle = local * 2.399963229728653;
    const localRadius = 28 + Math.sqrt(local) * 44;
    return freeze({
      ...base,
      group: groupName,
      x: groupCenters[groupId].x + Math.cos(localAngle) * localRadius,
      y: groupCenters[groupId].y + Math.sin(localAngle) * localRadius,
    });
  });
  return { nodes, groups };
};

const timelineEvents = (chapter) => [
  ...successionPreludeEvents,
  ...successionDays.flatMap((day) => day.events),
].filter((event) => Number(event.chapter) <= chapter);

const timelineGroup = (event, lens) => {
  if (lens === 'location') return event.tier || event.location || 'Unassigned location';
  if (lens === 'knowledge') return event.confidence || 'Known record';
  if (lens === 'evidence') return event.source ? 'Sourced' : 'Archive record';
  if (lens === 'nen') return (event.tracks || []).some((track) => /nen|ability|curse|beast/i.test(track)) ? 'Nen / systems' : 'Other events';
  if (lens === 'organization') return (event.tracks || [])[0] || 'Other organizations';
  if (lens === 'character') return (event.tracks || [])[0] || 'Other characters';
  return (event.tracks || [])[0] || 'Other thread';
};

const buildTimeline = ({ chapter, lens, depth, query }) => {
  const all = timelineEvents(chapter);
  const normalizedQuery = text(query).trim().toLocaleLowerCase();
  const depthThreshold = { pulse: 3, recap: 2, study: 1, research: .5, complete: 0 }[depth] ?? 2;
  const records = all.filter((event, index) => {
    const search = `${event.title || ''} ${event.detail || ''} ${(event.tracks || []).join(' ')} ${event.location || ''}`.toLocaleLowerCase();
    if (normalizedQuery && !search.includes(normalizedQuery)) return false;
    if (depth === 'complete' || depth === 'research') return true;
    const trackWeight = (event.tracks || []).length;
    const maintained = event.maintainedResearch ? 1 : 0;
    const score = (index % 9 === 0 ? 1 : 0) + trackWeight + maintained;
    return score >= depthThreshold;
  });
  const { nodes, groups } = layoutTimeline(records, chapter, (event) => timelineGroup(event, lens), (event, index) => node(event, {
    id: `timeline:${event.id || `${event.chapter}:${index}`}`,
    entityId: event.id?.startsWith('event:') ? event.id : null,
    label: event.title || `Chapter ${event.chapter}`,
    subtitle: event.detail || event.time || '',
    chapter: Number(event.chapter) || MIN_CHAPTER,
    kind: (event.tracks || []).some((track) => /nen|ability|curse|beast/i.test(track)) ? 'ability' : 'event',
    importance: event.maintainedResearch ? 2.4 : (event.tracks || []).length >= 2 ? 2 : 1,
    meta: { time: event.time, location: event.location || event.tier, confidence: event.confidence, tracks: event.tracks || [] },
  }));
  return {
    nodes,
    edges: [],
    groups,
    world: freeze({ width: WORLD_WIDTH, height: Math.max(WORLD_HEIGHT, 180 + groups.length * 120) }),
    stats: freeze({ visible: nodes.length, total: all.length, label: 'timeline records' }),
  };
};

const characterGroup = (character, lens, chapter) => {
  if (lens === 'location') {
    try {
      const record = getCurrentLocationRecordForCharacter(character.id, chapter);
      return labelFor(getEntityById(record?.locationId)) || 'Unknown location';
    } catch { return 'Unknown location'; }
  }
  if (lens === 'role') return slugLabel(character.roles?.[0] || 'Other role');
  if (lens === 'royal') {
    if (character.princeOrder) return 'Princes';
    if (character.queenRank) return 'Queens';
    if ((character.roles || []).includes('bodyguard')) return 'Royal security';
    return 'Other people';
  }
  return labelFor(getEntityById(character.affiliationIds?.[0])) || slugLabel(character.roles?.[0] || character.status?.affiliation || 'Unaffiliated');
};

const buildCharacters = ({ chapter, lens, query }) => {
  const all = getEntitiesByType('character').filter((entity) => available(entity, chapter));
  const normalizedQuery = text(query).trim().toLocaleLowerCase();
  const records = all.filter((entity) => !normalizedQuery || `${labelFor(entity)} ${summaryFor(entity)} ${(entity.roles || []).join(' ')}`.toLocaleLowerCase().includes(normalizedQuery));
  const { nodes, groups } = layoutRadial(records, (entity) => node(entity, {
    kind: 'character',
    importance: entity.princeOrder ? 2.4 : entity.media?.portrait ? 1.5 : 1,
    meta: { roles: entity.roles || [], life: entity.status?.life, princeOrder: entity.princeOrder },
  }), (entity) => characterGroup(entity, lens, chapter));
  const visibleIds = new Set(nodes.map((item) => item.entityId));
  const relationships = getActiveRelationshipsAtChapter(chapter).filter((rel) => visibleIds.has(rel.sourceEntityId) && visibleIds.has(rel.targetEntityId));
  const edges = relationships.slice(0, 900).map((rel) => edge(rel.sourceEntityId, rel.targetEntityId, {
    id: rel.id,
    kind: rel.relationshipType || 'relationship',
    label: rel.relationshipType || rel.sentiment || '',
    directed: rel.direction !== 'mutual',
    strength: rel.status === 'active' ? 1.3 : 1,
    meta: { sentiment: rel.sentiment, status: rel.status },
  }));
  return { nodes, edges, groups, world: freeze({ width: WORLD_WIDTH, height: WORLD_HEIGHT }), stats: freeze({ visible: nodes.length, total: all.length, label: 'characters' }) };
};

const buildRoyal = ({ routeId, chapter, lens, query }) => {
  const role = routeId === 'queens' ? 'queen' : 'prince';
  const all = getEntitiesByType('character').filter((entity) => (entity.roles || []).includes(role) && available(entity, chapter));
  const normalizedQuery = text(query).trim().toLocaleLowerCase();
  const records = all.filter((entity) => !normalizedQuery || `${labelFor(entity)} ${summaryFor(entity)}`.toLocaleLowerCase().includes(normalizedQuery));
  const ordered = [...records].sort((a, b) => role === 'prince'
    ? (a.princeOrder || 99) - (b.princeOrder || 99)
    : Number.parseInt(a.queenRank, 10) - Number.parseInt(b.queenRank, 10));
  const { nodes, groups } = layoutGrid(ordered, role === 'prince' ? 4 : 4, (entity) => node(entity, {
    kind: role,
    importance: 3,
    meta: { princeOrder: entity.princeOrder, queenRank: entity.queenRank, life: entity.status?.life },
  }), (entity) => {
    if (lens === 'status') return entity.status?.life || 'Unknown';
    if (lens === 'queen') return labelFor(getEntityById(entity.motherId || entity.queenId)) || 'Maternal branch';
    return role === 'prince' ? 'Succession order' : 'Queens';
  });
  return { nodes, edges: [], groups, world: freeze({ width: WORLD_WIDTH, height: Math.max(900, 260 + Math.ceil(nodes.length / 4) * 190) }), stats: freeze({ visible: nodes.length, total: all.length, label: role === 'prince' ? 'princes' : 'queens' }) };
};

const buildAssignments = ({ chapter, lens, query }) => {
  const all = getActiveAssignmentsAtChapter(chapter);
  const normalizedQuery = text(query).trim().toLocaleLowerCase();
  const records = all.filter((assignment) => !normalizedQuery || `${labelFor(assignment)} ${summaryFor(assignment)} ${assignment.assignmentType || ''}`.toLocaleLowerCase().includes(normalizedQuery));
  const participants = unique(records.flatMap((assignment) => [assignment.principalEntityId, assignment.personId, assignment.subjectEntityId, assignment.reportingEntityId, assignment.allegianceEntityId])).map(getEntityById).filter(Boolean);
  const group = (entity) => {
    if (lens === 'assignment') {
      const match = records.find((assignment) => [assignment.principalEntityId, assignment.personId, assignment.subjectEntityId].includes(entity.id));
      return slugLabel(match?.assignmentType || 'Other assignment');
    }
    if (lens === 'location') {
      const match = records.find((assignment) => [assignment.principalEntityId, assignment.personId, assignment.subjectEntityId].includes(entity.id));
      return labelFor(getEntityById(match?.locationId)) || 'Unassigned location';
    }
    if (lens === 'allegiance') {
      const match = records.find((assignment) => [assignment.principalEntityId, assignment.personId, assignment.subjectEntityId].includes(entity.id));
      return labelFor(getEntityById(match?.allegianceEntityId)) || 'Unclear allegiance';
    }
    return entity.entityType === 'character' ? 'People' : slugLabel(entity.entityType);
  };
  const { nodes, groups } = layoutRadial(participants, (entity) => node(entity, { importance: 1.7 }), group);
  const nodeIds = new Set(nodes.map((item) => item.entityId));
  const edges = records.flatMap((assignment) => {
    const chain = [];
    if (nodeIds.has(assignment.principalEntityId) && nodeIds.has(assignment.personId)) chain.push(edge(assignment.principalEntityId, assignment.personId, { id: `${assignment.id}:principal`, kind: assignment.assignmentType || 'assignment', label: assignment.assignmentType, directed: true, meta: { assignmentId: assignment.id } }));
    if (nodeIds.has(assignment.personId) && nodeIds.has(assignment.subjectEntityId)) chain.push(edge(assignment.personId, assignment.subjectEntityId, { id: `${assignment.id}:subject`, kind: assignment.assignmentType || 'assignment', label: assignment.assignmentType, directed: true, strength: 1.5, meta: { assignmentId: assignment.id } }));
    return chain;
  });
  return { nodes, edges, groups, world: freeze({ width: WORLD_WIDTH, height: WORLD_HEIGHT }), stats: freeze({ visible: records.length, total: all.length, label: 'active assignments' }) };
};

const organizationGroup = (organization, lens) => {
  if (lens === 'type') return slugLabel(organization.organizationType || 'Other organization');
  if (lens === 'territory') return labelFor(getEntityById(organization.primaryLocationId || organization.locationIds?.[0])) || 'Distributed / unknown';
  return slugLabel(organization.organizationType || 'Organization');
};

const buildOrganizations = ({ chapter, lens, query }) => {
  const all = getEntitiesByType('organization').filter((entity) => available(entity, chapter));
  const normalizedQuery = text(query).trim().toLocaleLowerCase();
  const records = all.filter((entity) => !normalizedQuery || `${labelFor(entity)} ${summaryFor(entity)} ${entity.organizationType || ''}`.toLocaleLowerCase().includes(normalizedQuery));
  const { nodes, groups } = layoutRadial(records, (entity) => node(entity, {
    kind: 'organization',
    importance: Math.min(3, 1 + getOrganizationMembers(entity.id).length / 12 + getEventsForOrganization(entity.id).filter((event) => chapterFor(event) <= chapter).length / 15),
    meta: { organizationType: entity.organizationType, members: getOrganizationMembers(entity.id).length },
  }), (entity) => organizationGroup(entity, lens));
  const visibleIds = new Set(nodes.map((item) => item.entityId));
  const edges = getActiveRelationshipsAtChapter(chapter)
    .filter((rel) => visibleIds.has(rel.sourceEntityId) && visibleIds.has(rel.targetEntityId))
    .map((rel) => edge(rel.sourceEntityId, rel.targetEntityId, { id: rel.id, kind: rel.relationshipType || 'relationship', label: rel.relationshipType, directed: true, meta: { sentiment: rel.sentiment } }));
  return { nodes, edges, groups, world: freeze({ width: WORLD_WIDTH, height: WORLD_HEIGHT }), stats: freeze({ visible: nodes.length, total: all.length, label: 'organizations' }) };
};

const locationDepth = (location) => (location.ancestorIds || []).length;
const locationTier = (location) => {
  const haystack = `${labelFor(location)} ${location.id} ${(location.ancestorIds || []).join(' ')}`;
  const match = haystack.match(/tier[- :]*(\d)/i);
  return match ? `Tier ${match[1]}` : locationDepth(location) === 0 ? 'Black Whale' : 'Other / shared';
};

const buildLocations = ({ routeId, chapter, lens, query }) => {
  const all = getEntitiesByType('location').filter((entity) => available(entity, chapter));
  const normalizedQuery = text(query).trim().toLocaleLowerCase();
  const records = all.filter((entity) => !normalizedQuery || `${labelFor(entity)} ${summaryFor(entity)} ${entity.id}`.toLocaleLowerCase().includes(normalizedQuery));
  const { nodes, groups } = layoutRadial(records, (entity) => node(entity, {
    kind: 'location',
    importance: clamp(3 - locationDepth(entity) * .45, .8, 3),
    meta: { depth: locationDepth(entity), occupants: entity.occupantIds?.length || 0, tier: locationTier(entity) },
  }), (entity) => lens === 'hierarchy' || lens === 'tiers' ? locationTier(entity) : lens === 'activity' ? `${getEventsAtLocation(entity.id).filter((event) => chapterFor(event) <= chapter).length} event band` : locationTier(entity));
  const visibleIds = new Set(nodes.map((item) => item.entityId));
  const edges = records.flatMap((location) => {
    const parent = location.parentId || location.parentLocationId || (location.ancestorIds || []).at(-1);
    const connections = [];
    if (parent && visibleIds.has(parent)) connections.push(edge(parent, location.id, { kind: 'contains', directed: true }));
    for (const child of getLocationChildren(location.id)) if (visibleIds.has(child.id)) connections.push(edge(location.id, child.id, { kind: 'contains', directed: true }));
    return connections;
  });
  return { nodes, edges: [...new Map(edges.map((item) => [item.id, item])).values()], groups, world: freeze({ width: WORLD_WIDTH, height: WORLD_HEIGHT }), stats: freeze({ visible: nodes.length, total: all.length, label: routeId === 'black-whale' ? 'mapped ship locations' : 'locations' }) };
};

const buildNen = ({ routeId, chapter, lens, query }) => {
  const type = routeId === 'guardian-spirit-beasts' ? 'guardian-beast' : 'ability';
  const all = getEntitiesByType(type).filter((entity) => available(entity, chapter));
  const normalizedQuery = text(query).trim().toLocaleLowerCase();
  const records = all.filter((entity) => !normalizedQuery || `${labelFor(entity)} ${summaryFor(entity)} ${entity.category || ''} ${(entity.classification?.nenTypes || []).join(' ')}`.toLocaleLowerCase().includes(normalizedQuery));
  const group = (entity) => {
    if (routeId === 'guardian-spirit-beasts') {
      if (lens === 'status') return entity.status?.life || entity.hostState || 'Known beast';
      if (lens === 'certainty') return entity.researchStatus || entity.canonLevel || 'Known';
      return labelFor(getEntityById(entity.hostId || entity.ownerIds?.[0])) || 'Royal host';
    }
    if (lens === 'nen-type') return slugLabel(entity.classification?.nenTypes?.[0] || 'Unknown Nen type');
    if (lens === 'owner') return labelFor(getEntityById(entity.ownerIds?.[0])) || 'Unknown owner';
    if (lens === 'certainty') return slugLabel(entity.classification?.certainty || entity.canonLevel || 'Known');
    if (lens === 'mechanic') return slugLabel(entity.category || 'Other mechanic');
    return slugLabel(entity.category || entity.classification?.nenTypes?.[0] || 'Other system');
  };
  const { nodes, groups } = layoutRadial(records, (entity) => node(entity, {
    kind: type,
    importance: entity.researchStatus?.includes('mystery') ? 2.5 : entity.conditions?.length >= 3 ? 2 : 1.4,
    meta: {
      category: entity.category,
      nenTypes: entity.classification?.nenTypes || [],
      conditions: entity.conditions?.length || 0,
      limitations: entity.limitations?.length || 0,
      status: entity.status,
    },
  }), group);
  const visibleIds = new Set(nodes.map((item) => item.entityId));
  const edges = [];
  if (type === 'ability') {
    for (const ability of records) {
      for (const ownerId of ability.ownerIds || []) if (visibleIds.has(ownerId)) edges.push(edge(ownerId, ability.id, { kind: 'owns', directed: true }));
    }
  }
  return { nodes, edges, groups, world: freeze({ width: WORLD_WIDTH, height: WORLD_HEIGHT }), stats: freeze({ visible: nodes.length, total: all.length, label: type === 'ability' ? 'Nen / ritual systems' : 'Guardian Spirit Beasts' }) };
};

const buildEvents = ({ chapter, lens, query }) => {
  const all = getStoryEventsKnownAtChapter(chapter) || [];
  const normalizedQuery = text(query).trim().toLocaleLowerCase();
  const records = all.filter((entity) => !normalizedQuery || `${labelFor(entity)} ${summaryFor(entity)} ${(entity.participantIds || []).join(' ')}`.toLocaleLowerCase().includes(normalizedQuery));
  const group = (event) => {
    if (lens === 'organization') return labelFor(getEntityById(event.organizationIds?.[0])) || 'Cross-faction';
    if (lens === 'location') return labelFor(getEntityById(event.locationId || event.locationIds?.[0])) || 'Unknown location';
    if (lens === 'people') return labelFor(getEntityById(event.participantIds?.[0] || event.characterIds?.[0])) || 'Ensemble';
    if (lens === 'evidence') return event.canonLevel || event.confidence || 'Canonical';
    return slugLabel(event.storyLaneId || event.threadId || event.eventType || 'Story event');
  };
  const { nodes, groups } = layoutTimeline(records, chapter, group, (event) => node(event, {
    kind: 'event',
    importance: 1.8 + Math.min(1.2, (event.consequenceIds?.length || event.consequenceEventIds?.length || 0) * .3),
    meta: { participants: event.participantIds || event.characterIds || [], locationId: event.locationId || event.locationIds?.[0] },
  }));
  const visibleIds = new Set(nodes.map((item) => item.entityId));
  const edges = records.flatMap((event) => unique([...(event.causeEventIds || []), ...(event.causalParentIds || [])]).filter((id) => visibleIds.has(id)).map((causeId) => edge(causeId, event.id, { kind: 'causes', directed: true, strength: 1.4 })));
  return { nodes, edges, groups, world: freeze({ width: WORLD_WIDTH, height: Math.max(WORLD_HEIGHT, 180 + groups.length * 120) }), stats: freeze({ visible: nodes.length, total: all.length, label: 'canonical events' }) };
};

const buildRelationships = ({ chapter, lens, query }) => {
  const all = getActiveRelationshipsAtChapter(chapter);
  const normalizedQuery = text(query).trim().toLocaleLowerCase();
  const records = all.filter((relationship) => {
    const source = getEntityById(relationship.sourceEntityId);
    const target = getEntityById(relationship.targetEntityId);
    const search = `${labelFor(source)} ${labelFor(target)} ${relationship.relationshipType || ''} ${relationship.sentiment || ''}`.toLocaleLowerCase();
    return !normalizedQuery || search.includes(normalizedQuery);
  });
  const entities = unique(records.flatMap((relationship) => [relationship.sourceEntityId, relationship.targetEntityId])).map(getEntityById).filter(Boolean);
  const group = (entity) => {
    if (lens === 'type') return slugLabel(entity.entityType || 'Entity');
    const rel = records.find((relationship) => relationship.sourceEntityId === entity.id || relationship.targetEntityId === entity.id);
    if (lens === 'sentiment') return slugLabel(rel?.sentiment || 'Unspecified');
    if (lens === 'direction') return rel?.sourceEntityId === entity.id ? 'Sources' : 'Targets';
    return slugLabel(entity.entityType || 'Entity');
  };
  const { nodes, groups } = layoutRadial(entities, (entity) => node(entity, { importance: entity.entityType === 'character' ? 1.7 : 1.2 }), group);
  const visibleIds = new Set(nodes.map((item) => item.entityId));
  const edges = records.filter((rel) => visibleIds.has(rel.sourceEntityId) && visibleIds.has(rel.targetEntityId)).map((rel) => edge(rel.sourceEntityId, rel.targetEntityId, {
    id: rel.id,
    kind: rel.relationshipType || 'relationship',
    label: rel.relationshipType || rel.sentiment || '',
    directed: rel.direction !== 'mutual',
    strength: rel.status === 'active' ? 1.5 : 1,
    meta: { sentiment: rel.sentiment, status: rel.status, chapterRange: rel.chapterRange },
  }));
  return { nodes, edges, groups, world: freeze({ width: WORLD_WIDTH, height: WORLD_HEIGHT }), stats: freeze({ visible: edges.length, total: all.length, label: 'active relationships' }) };
};

const buildChapters = ({ chapter, lens, query }) => {
  const all = getEntitiesByType('chapter').filter((record) => Number(record.number) <= chapter);
  const normalizedQuery = text(query).trim().toLocaleLowerCase();
  const records = all.filter((record) => !normalizedQuery || `${record.number} ${labelFor(record)} ${summaryFor(record)}`.toLocaleLowerCase().includes(normalizedQuery));
  const values = records.map((record) => {
    const events = getEventsForChapter(record.number).length;
    const abilityCount = record.abilityIds?.length || 0;
    const characters = record.characterIds?.length || record.participantIds?.length || 0;
    const relationships = record.relationshipIds?.length || 0;
    const metric = lens === 'events' ? events : lens === 'nen' ? abilityCount : lens === 'characters' ? characters : lens === 'relationships' ? relationships : events + abilityCount + characters + relationships;
    return { record, metric };
  });
  const maxMetric = Math.max(1, ...values.map((item) => item.metric));
  const { nodes, groups } = layoutGrid(values, 10, (entry) => node(entry.record, {
    id: entry.record.id,
    kind: 'chapter',
    label: `Ch. ${entry.record.number}`,
    subtitle: labelFor(entry.record),
    chapter: entry.record.number,
    importance: .8 + (entry.metric / maxMetric) * 2.6,
    meta: { metric: entry.metric, events: getEventsForChapter(entry.record.number).length },
  }), () => 'Chapters');
  return { nodes, edges: [], groups, world: freeze({ width: WORLD_WIDTH, height: Math.max(900, 240 + Math.ceil(nodes.length / 10) * 180) }), stats: freeze({ visible: nodes.length, total: all.length, label: 'chapter dossiers' }) };
};

const buildResearch = ({ chapter, lens, query }) => {
  const types = ['source', 'knowledge-record', 'evidence-item', 'protocol', 'document', 'object'];
  const all = types.flatMap((type) => getEntitiesByType(type)).filter((record) => available(record, chapter));
  const normalizedQuery = text(query).trim().toLocaleLowerCase();
  const records = all.filter((record) => !normalizedQuery || `${labelFor(record)} ${summaryFor(record)} ${record.canonLevel || ''} ${record.confidence || ''}`.toLocaleLowerCase().includes(normalizedQuery));
  const group = (record) => lens === 'certainty'
    ? slugLabel(record.confidence || record.certainty || record.canonLevel || 'Documented')
    : lens === 'chapter'
      ? `Chapter ${chapterFor(record)}`
      : lens === 'gap'
        ? (record.researchStatus?.includes('gap') ? 'Research gaps' : 'Documented')
        : slugLabel(record.entityType || 'Evidence');
  const { nodes, groups } = layoutRadial(records, (record) => node(record, {
    importance: record.entityType === 'source' ? 1.8 : record.canonLevel === 'theory' ? 1.2 : 1.5,
    meta: { canonLevel: record.canonLevel, confidence: record.confidence || record.certainty, sourceIds: record.sourceIds || [] },
  }), group);
  const visibleIds = new Set(nodes.map((item) => item.entityId));
  const edges = records.flatMap((record) => (record.sourceIds || []).filter((id) => visibleIds.has(id)).map((sourceId) => edge(sourceId, record.id, { kind: 'supports', directed: true })));
  return { nodes, edges, groups, world: freeze({ width: WORLD_WIDTH, height: WORLD_HEIGHT }), stats: freeze({ visible: nodes.length, total: all.length, label: 'research records' }) };
};

const buildGlossary = ({ chapter, lens, query }) => {
  let all = [];
  try { all = getGlossaryEntriesAtChapter(chapter) || []; } catch { all = []; }
  const normalizedQuery = text(query).trim().toLocaleLowerCase();
  const records = all.filter((record) => !normalizedQuery || `${labelFor(record)} ${summaryFor(record)} ${(record.synonyms || []).join(' ')}`.toLocaleLowerCase().includes(normalizedQuery));
  const group = (record) => lens === 'certainty' ? slugLabel(record.certainty || record.canonLevel || 'Documented') : slugLabel(record.domain || record.category || 'General');
  const { nodes, groups } = layoutRadial(records, (record) => node(record, { kind: 'glossary', importance: 1.4 }), group);
  return { nodes, edges: [], groups, world: freeze({ width: WORLD_WIDTH, height: WORLD_HEIGHT }), stats: freeze({ visible: nodes.length, total: all.length, label: 'glossary concepts' }) };
};

const buildSearch = ({ chapter, query, lens }) => {
  const normalizedQuery = text(query).trim();
  const results = normalizedQuery ? searchArchiveProduct(normalizedQuery, { chapter, limit: 180 }) : [];
  const records = results.map((result) => result.entity).filter(Boolean);
  const group = (record) => lens === 'people' ? ((record.entityType === 'character') ? 'People' : 'Other') : lens === 'systems' ? (/ability|guardian-beast/.test(record.entityType) ? 'Systems' : 'Other') : lens === 'space' ? (record.entityType === 'location' ? 'Space' : 'Other') : lens === 'evidence' ? (/source|evidence|knowledge/.test(record.entityType) ? 'Evidence' : 'Other') : slugLabel(record.entityType);
  const { nodes, groups } = layoutRadial(records, (record) => node(record, { importance: 1.5 }), group);
  return { nodes, edges: [], groups, world: freeze({ width: WORLD_WIDTH, height: WORLD_HEIGHT }), stats: freeze({ visible: nodes.length, total: nodes.length, label: normalizedQuery ? 'search results' : 'search results awaiting a query' }) };
};

const buildStory = ({ chapter, lens, query }) => buildEvents({ chapter, lens: lens === 'story' ? 'story' : lens, query });

export function buildSuccessionExplorerModel({
  routeId,
  chapter,
  view = null,
  lens = null,
  depth = 'recap',
  filters = {},
}) {
  const boundary = Math.max(MIN_CHAPTER, Number(chapter) || MIN_CHAPTER);
  const query = filters.query || '';
  const args = { routeId, chapter: boundary, view, lens, depth, query, filters };
  let model;
  if (routeId === 'timeline') model = buildTimeline(args);
  else if (routeId === 'story') model = buildStory(args);
  else if (routeId === 'characters') model = buildCharacters(args);
  else if (routeId === 'princes' || routeId === 'queens') model = buildRoyal(args);
  else if (routeId === 'bodyguards') model = buildAssignments(args);
  else if (routeId === 'organizations') model = buildOrganizations(args);
  else if (routeId === 'black-whale' || routeId === 'locations') model = buildLocations(args);
  else if (routeId === 'nen' || routeId === 'guardian-spirit-beasts') model = buildNen(args);
  else if (routeId === 'events') model = buildEvents(args);
  else if (routeId === 'relationships') model = buildRelationships(args);
  else if (routeId === 'chapters') model = buildChapters(args);
  else if (routeId === 'research') model = buildResearch(args);
  else if (routeId === 'glossary') model = buildGlossary(args);
  else if (routeId === 'search') model = buildSearch(args);
  else if (routeId === 'reader') model = buildChapters(args);
  else model = buildStory(args);

  const filteredNodes = model.nodes.filter((item) => {
    if (filters.entityType && filters.entityType !== 'all') {
      const entity = item.entityId ? getEntityById(item.entityId) : null;
      if (entity?.entityType !== filters.entityType) return false;
    }
    if (filters.nenOnly && !/ability|guardian-beast/.test(item.kind)) return false;
    return true;
  });
  const visibleIds = new Set(filteredNodes.map((item) => item.id));
  const entityToNode = new Map(filteredNodes.filter((item) => item.entityId).map((item) => [item.entityId, item.id]));
  const filteredEdges = model.edges.map((item) => {
    const source = visibleIds.has(item.source) ? item.source : entityToNode.get(item.source) || item.source;
    const target = visibleIds.has(item.target) ? item.target : entityToNode.get(item.target) || item.target;
    return source === item.source && target === item.target ? item : freeze({ ...item, source, target });
  }).filter((item) => visibleIds.has(item.source) && visibleIds.has(item.target));

  return freeze({
    routeId,
    chapter: boundary,
    view,
    lens,
    depth,
    nodes: freeze(filteredNodes),
    edges: freeze(filteredEdges),
    groups: freeze(model.groups || []),
    world: model.world || freeze({ width: WORLD_WIDTH, height: WORLD_HEIGHT }),
    stats: model.stats || freeze({ visible: filteredNodes.length, total: model.nodes.length, label: 'records' }),
    trackLabels: routeId === 'timeline' ? freeze(timelineTracks.map((track) => track.label)) : freeze([]),
  });
}

export const successionExplorerWorldSize = freeze({ width: WORLD_WIDTH, height: WORLD_HEIGHT });
