import { encyclopediaCategories, encyclopediaRecords } from './encyclopedia';
import { isLocalMediaPath, mediaStateFor } from './mediaSchema';
import { APPROVED_SOURCE_HOSTS, isApprovedSourceUrl, SOURCE_POLICY_VERSION } from './sourcePolicy';

export const mediaRegistry = encyclopediaRecords.map((record) => ({
  id: `media-${record.id}`,
  entityId: record.id,
  category: record.category,
  name: record.name,
  articleSource: record.media?.articleSource || record.source,
  imageSource: record.media?.imageSource || record.imageSource || record.source,
  image: record.image || '',
  width: record.media?.width || null,
  height: record.media?.height || null,
  focal: record.media?.focal || null,
  reviewed: record.media?.reviewed || null,
  storage: record.media?.storage || null,
  state: mediaStateFor(record),
}));

export const mediaByEntityId = new Map(mediaRegistry.map((record) => [record.entityId, record]));

export const mediaCoverageByCategory = encyclopediaCategories.map((category) => {
  const records = mediaRegistry.filter((record) => record.category === category.id);
  const local = records.filter((record) => record.state === 'local').length;
  const verifiedRemote = records.filter((record) => record.state === 'verified-remote').length;
  const textOnly = records.filter((record) => record.state === 'text-only').length;
  return {
    id: category.id,
    label: category.label,
    total: records.length,
    local,
    verifiedRemote,
    textOnly,
    pictured: local + verifiedRemote,
    percent: records.length ? Math.round((local / records.length) * 100) : 0,
  };
});

const localRecords = mediaRegistry.filter((record) => record.state === 'local');
const remoteRecords = mediaRegistry.filter((record) => record.state === 'verified-remote');
const sourcesApproved = mediaRegistry.every((record) => (!record.articleSource || isApprovedSourceUrl(record.articleSource))
  && (!record.imageSource || isApprovedSourceUrl(record.imageSource)));
const remoteImagesApproved = remoteRecords.every((record) => isApprovedSourceUrl(record.image));
const localMetadataComplete = localRecords.every((record) => Number.isInteger(record.width) && record.width > 0
  && Number.isInteger(record.height) && record.height > 0
  && /^\d+% \d+%$/.test(record.focal || '')
  && (!record.articleSource || isApprovedSourceUrl(record.articleSource))
  && (!record.imageSource || isApprovedSourceUrl(record.imageSource)));
const uniqueLocalPaths = new Set(localRecords.map((record) => record.image)).size === new Set(localRecords.map((record) => record.name)).size;

export const mediaRegistryStats = {
  policyVersion: SOURCE_POLICY_VERSION,
  approvedHosts: APPROVED_SOURCE_HOSTS,
  records: mediaRegistry.length,
  local: localRecords.length,
  verifiedRemote: remoteRecords.length,
  textOnly: mediaRegistry.filter((record) => record.state === 'text-only').length,
  runtimeResolution: mediaCoverageByCategory.find((record) => record.id === 'characters')?.textOnly || 0,
  characters: mediaCoverageByCategory.find((record) => record.id === 'characters'),
  locations: mediaCoverageByCategory.find((record) => record.id === 'locations'),
  allowedHosts: sourcesApproved && remoteImagesApproved,
  sourcesApproved,
  localMetadataComplete,
  remoteImagesApproved,
  localPathsValid: localRecords.every((record) => isLocalMediaPath(record.image)),
  uniqueLocalPaths,
  uniqueIds: new Set(mediaRegistry.map((record) => record.id)).size === mediaRegistry.length,
};

export const mediaRecordFor = (entityId) => mediaByEntityId.get(entityId) || null;
