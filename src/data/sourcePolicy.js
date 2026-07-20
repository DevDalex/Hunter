export const SOURCE_POLICY_VERSION = '2026-07-20';
export const HUNTERPEDIA_ORIGIN = 'https://hunterxhunter.fandom.com';
export const HUNTERPEDIA_WIKI_BASE = `${HUNTERPEDIA_ORIGIN}/wiki`;
export const HUNTERPEDIA_IMAGE_ORIGIN = 'https://static.wikia.nocookie.net';
export const APPROVED_SOURCE_HOSTS = Object.freeze([
  'hunterxhunter.fandom.com',
  'static.wikia.nocookie.net',
]);

const approvedSourceHosts = new Set(APPROVED_SOURCE_HOSTS);

export const hunterpediaArticle = (slug) => `${HUNTERPEDIA_WIKI_BASE}/${slug}`;
export const hunterpediaFileRedirect = (filename) => `${HUNTERPEDIA_WIKI_BASE}/Special:Redirect/file/${encodeURIComponent(filename)}`;

export const isApprovedSourceUrl = (value) => {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && approvedSourceHosts.has(url.hostname);
  } catch {
    return false;
  }
};

export const sourceRecord = ({ articleSource, imageSource = articleSource }) => ({
  articleSource,
  imageSource,
});

export const sourceRecordIsApproved = (record) => Boolean(record)
  && isApprovedSourceUrl(record.articleSource)
  && isApprovedSourceUrl(record.imageSource);
