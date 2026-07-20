import { isApprovedSourceUrl } from './sourcePolicy';

export const LOCAL_MEDIA_PREFIX = '/media/';

export const isLocalMediaPath = (value = '') => value.startsWith(LOCAL_MEDIA_PREFIX);

export const mediaStateFor = (record) => {
  if (!record?.image) return 'text-only';
  if (isLocalMediaPath(record.image) && record.media?.storage === 'local') return 'local';
  return 'verified-remote';
};

export const attachCanonicalMediaSources = ({ derivative, articleSource, imageSource, reviewed }) => {
  if (!derivative) return null;
  const {
    articleSource: _generatedArticleSource,
    imageSource: _generatedImageSource,
    ...asset
  } = derivative;
  return {
    ...asset,
    storage: asset.storage || 'local',
    articleSource,
    imageSource,
    reviewed: asset.reviewed || reviewed || null,
  };
};

export const mediaRecordIsComplete = (record) => Boolean(record)
  && record.storage === 'local'
  && isLocalMediaPath(record.src || record.image || '')
  && Number.isInteger(record.width)
  && record.width > 0
  && Number.isInteger(record.height)
  && record.height > 0
  && /^\d+% \d+%$/.test(record.focal || '')
  && isApprovedSourceUrl(record.articleSource)
  && isApprovedSourceUrl(record.imageSource);

export const generatedProvenanceMatches = (derivative, canonical) => Boolean(derivative && canonical)
  && derivative.articleSource === canonical.articleSource
  && derivative.imageSource === canonical.imageSource;
