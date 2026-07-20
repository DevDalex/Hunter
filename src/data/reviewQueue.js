import { makeArchiveEntityId } from './entityIds.js';

export const REVIEW_QUEUE_VERSION = 'Batch 11 / 2026-07-20';

export const reviewQueueStatuses = [
  { id: 'queued', label: 'Queued', description: 'Known work item, not started.' },
  { id: 'blocked', label: 'Blocked', description: 'Requires another data system or page before it can be finished.' },
  { id: 'active-next', label: 'Active next', description: 'Good candidate for the next implementation batch.' },
  { id: 'watch', label: 'Watch', description: 'Keep visible but do not expand until related chapters/systems mature.' },
];

export const reviewQueueLanes = [
  { id: 'source', title: 'Source/citation cleanup', owner: 'archive governance', description: 'Records needing bibliography IDs, approved source checks, or better source display.' },
  { id: 'identity', title: 'Entity identity cleanup', owner: 'data model', description: 'Records needing stable IDs, dedupe checks, or naming convention decisions.' },
  { id: 'content-depth', title: 'Content depth', owner: 'story/content', description: 'Records that exist but need deeper local summaries or structured sections.' },
  { id: 'cross-links', title: 'Cross-links', owner: 'future graph/search', description: 'Records needing explicit inbound/outbound relationship, chapter, location, or conflict links.' },
  { id: 'qa', title: 'QA and performance', owner: 'release', description: 'Records needing route, audit, visual, or bundle proof.' },
];

const item = ({ id, lane, title, entityId, status = 'queued', priority = 'medium', reason, nextAction, dependsOn = [], evidenceState = 'not-yet-reviewed' }) => ({
  id,
  lane,
  title,
  entityId,
  status,
  priority,
  reason,
  nextAction,
  dependsOn,
  evidenceState,
});

export const reviewQueueItems = [
  item({ id: 'rq-bibliography-source-ledgers', lane: 'source', title: 'Replace repeated raw source links with bibliography IDs', entityId: 'source.src-arc-chimera-ant', priority: 'high', status: 'active-next', reason: 'Sources currently live inside many modules; a central registry is now available but not yet fully adopted.', nextAction: 'Start with Story arc pages and the four reference backbone domains.' }),
  item({ id: 'rq-character-source-index-depth', lane: 'content-depth', title: 'Mark source-index characters clearly before expanding profiles', entityId: makeArchiveEntityId('char', 'source index characters'), priority: 'high', reason: 'Batch 9 preserved all characters, but most are intentionally not full dossiers yet.', nextAction: 'Use evidence state source-index-only and add profile candidates gradually.' }),
  item({ id: 'rq-chapter-ledger-seed', lane: 'content-depth', title: 'Seed the complete chapter ledger', entityId: 'chapter.001', priority: 'high', status: 'blocked', reason: 'The future chapter encyclopedia needs consistent chapter IDs, source references, and schema fields.', nextAction: 'Use Batch 13 to create chapter records in controlled ranges.', dependsOn: ['Batch 11 governance'] }),
  item({ id: 'rq-cross-link-orphans', lane: 'cross-links', title: 'Detect orphan records before graph/search expansion', entityId: 'operation.palace-invasion', priority: 'high', status: 'blocked', reason: 'Graph and advanced search should not launch on weak or one-way links.', nextAction: 'Batch 15 should generate inbound/outbound link reports.', dependsOn: ['Batch 13 chapter ledger', 'Batch 14 timeline'] }),
  item({ id: 'rq-nen-ability-records', lane: 'content-depth', title: 'Convert Nen examples into full ability records', entityId: 'nen.core-system', priority: 'medium', status: 'blocked', reason: 'The reference backbone is visible; ability records need chapters, conflicts, and evidence labels.', nextAction: 'Batch 18 should build ability data with conditions, costs, weaknesses, and source IDs.', dependsOn: ['Batch 13 chapter ledger', 'Batch 15 cross-links'] }),
  item({ id: 'rq-organization-hierarchies', lane: 'identity', title: 'Normalize organization hierarchy IDs', entityId: 'faction.hunter-association', priority: 'medium', reason: 'Organizations need stable member/role/operation IDs before visual hierarchy maps.', nextAction: 'Batch 19 should map Hunter Association, Troupe, Chimera Ants, Kakin, mafia, and Zoldyck records.' }),
  item({ id: 'rq-atlas-map-layers', lane: 'cross-links', title: 'Prepare atlas map-layer records', entityId: 'location.east-gorteau', priority: 'medium', status: 'blocked', reason: 'Deep zoom maps should not load until location/entity IDs and link records are stable.', nextAction: 'Batch 20 should lazy-load map layers and audit route-to-location links.', dependsOn: ['Batch 15 cross-links'] }),
  item({ id: 'rq-visual-workflow-proof', lane: 'qa', title: 'Stop relying on no-workflow GitHub status', entityId: 'operation.release-qa', priority: 'high', status: 'blocked', reason: 'Latest commits repeatedly show no workflow runs, so the repo lacks CI proof.', nextAction: 'Batch 26 should add GitHub workflows and artifact checks.', dependsOn: ['Batch 24 performance hardening', 'Batch 25 browser QA'] }),
  item({ id: 'rq-succession-current-arc-depth', lane: 'content-depth', title: 'Hold Succession mega-expansion until systems exist', entityId: 'arc.succession-contest', priority: 'medium', status: 'watch', reason: 'Succession is too complex to expand cleanly before chapters, timeline, graph, search, and QA systems.', nextAction: 'Return in Batch 27 after the technical backbone is stable.', dependsOn: ['Batch 13', 'Batch 14', 'Batch 15', 'Batch 16', 'Batch 25'] }),
  item({ id: 'rq-design-system-extraction', lane: 'qa', title: 'Extract reusable design-system primitives', entityId: 'operation.design-system', priority: 'medium', status: 'active-next', reason: 'Recent batches introduced strong surfaces but still rely on multiple page-specific components.', nextAction: 'Batch 12 should document reusable templates, tokens, and component contracts.' }),
];

export const reviewQueueStats = {
  version: REVIEW_QUEUE_VERSION,
  lanes: reviewQueueLanes.length,
  items: reviewQueueItems.length,
  highPriority: reviewQueueItems.filter((entry) => entry.priority === 'high').length,
  blocked: reviewQueueItems.filter((entry) => entry.status === 'blocked').length,
};
