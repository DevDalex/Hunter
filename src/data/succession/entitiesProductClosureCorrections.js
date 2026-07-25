import { successionArchiveData as productFoundationData } from './entitiesProductClosureFoundation.js';

const systemIdCorrections = Object.freeze({
  'nen-system:post-mortem-nen-continuation': 'nen-system:post-mortem-nen',
  'nen-system:royal-curse-networks': 'nen-system:curse-networks',
  'nen-system:contracts-vows-conditional-power': 'nen-system:contracts-vows-and-conditions',
  'nen-system:possession-consciousness-transfer': 'nen-system:possession-and-consciousness-transfer',
});

const glossaryEntries = Object.freeze((productFoundationData.glossaryEntries || []).map((entry) => Object.freeze({
  ...entry,
  relatedEntityIds: Object.freeze((entry.relatedEntityIds || []).map((id) => systemIdCorrections[id] || id)),
})));

export const successionArchiveData = Object.freeze({
  ...productFoundationData,
  glossaryEntries,
});
