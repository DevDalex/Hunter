import { successionArchive, successionContentDepth } from './successionData.js';
import { successionContentExpansion } from './contentDepthExpansion.js';

const freeze = (value = []) => Object.freeze(Array.isArray(value) ? [...value] : value);
const nameOf = (row) => row?.name || row?.title || row?.label || row?.id || 'record';

export const getResolvedLedgerCompletion = (chapter = 417) => {
  const rows = successionContentExpansion.getArchiveLedgers(chapter);
  const operations = successionContentDepth.getOrdersSurveillanceCustodyLedger(chapter) || {};
  const operationIds = [...(operations.assignmentIds || []), ...(operations.relationshipIds || [])];
  const operationRows = operationIds.map((id) => successionArchive.getEntityById(id)).filter(Boolean);
  return freeze(rows.map((row) => {
    if (row.id !== 'orders') return Object.freeze({ ...row, status: row.rows?.length ? 'known' : 'none-known', completeness: 100 });
    return Object.freeze({
      ...row,
      rows: freeze(operationRows),
      count: operationRows.length,
      preview: freeze(operationRows.slice(0, 18).map(nameOf)),
      status: operationRows.length ? 'known' : 'none-known',
      note: operationRows.length ? 'Resolved from the canonical orders/surveillance/custody assignmentIds and relationshipIds.' : 'No qualifying order/surveillance/custody records exist at this boundary.',
      completeness: 100,
    });
  }));
};
