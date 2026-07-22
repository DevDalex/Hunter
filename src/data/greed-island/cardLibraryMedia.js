const HUNTERPEDIA_ROOT = 'https://hunterxhunter.fandom.com';
const HUNTERPEDIA_API = `${HUNTERPEDIA_ROOT}/api.php`;
export const CARD_LIBRARY_MEDIA_VERIFIED_AT = '2026-07-22';

const encodeTitle = (value) => encodeURIComponent(value).replaceAll('%2F', '/');
const articleUrl = (title) => `${HUNTERPEDIA_ROOT}/wiki/${encodeTitle(title.replaceAll(' ', '_'))}`;
const fileUrl = (title) => `${HUNTERPEDIA_ROOT}/wiki/Special:Redirect/file/${encodeTitle(title)}`;
const filePageUrl = (title) => `${HUNTERPEDIA_ROOT}/wiki/File:${encodeTitle(title.replaceAll(' ', '_'))}`;

const spellFileTitles = Object.freeze({
  '1001': 'Steal (G.I card) =scan=.png',
  '1002': 'Fluroscopy (G.I card) =scan=.png',
  '1003': 'Defensive Wall (G.I card) =scan=.png',
  '1004': 'Reflection (G.I card) =scan=.png',
  '1005': 'Magnetic Force (G.I card) =scan=.png',
  '1006': 'Pick Pocket (G.I card) =scan=.png',
  '1007': 'Thief (G.I card) =scan=.png',
  '1008': 'Trade (G.I card) =scan=.png',
  '1009': 'Return (G.I card) =scan=.png',
  '1010': 'Transform (G.I card) =scan=.png',
  '1011': 'Clone (G.I card) =scan=.png',
  '1012': 'Railguide (G.I card) =scan=.png',
  '1013': 'Departure (G.I card) =scan=.png',
  '1014': 'Leap (G.I card) =scan=.png',
  '1015': 'Sightvision Rule (G.I card) =scan=.png',
  '1016': 'Drift (G.I card) =scan=.png',
  '1017': 'Collision (G.I card) =scan=.png',
  '1018': 'Levy (G.I card) =scan=.png',
  '1019': 'Castle Gate (G.I card) =scan=.png',
  '1020': 'Fake (G.I card) =scan=.png',
  '1021': 'Rob (G.I card) =scan=.png',
  '1022': 'Corruption (G.I card) =scan=.png',
  '1023': 'Compromise (G.I card) =scan=.png',
  '1024': 'Penetrate (G.I card) =scan=.png',
  '1025': 'Blackout Curtain (G.I card) =scan=.png',
  '1026': 'Holy Water (G.I card) =scan=.png',
  '1027': 'Trace (G.I card) =scan=.png',
  '1028': 'Stone Throw (G.I card) =scan=.png',
  '1029': 'Shot (G.I card) =scan=.png',
  '1030': 'Guidepost (G.I card) =scan=.png',
  '1031': 'Analysis (G.I card) =scan=.png',
  '1032': 'Lottery (G.I card) =scan=.png',
  '1033': 'Adhesion Rule (G.I card) =scan=.png',
  '1034': 'Purify (G.I card) =scan=.png',
  '1035': 'Prison (G.I card) =scan=.png',
  '1036': 'God Eye (G.I card) =scan=.png',
  '1037': 'Recycle (G.I card) =scan=.png',
  '1038': 'List (G.I card) =scan=.png',
  '1039': 'Accompany (G.I card) =scan=.png',
  '1040': 'Contact (G.I card) =scan=.png',
});

const directFileTitles = Object.freeze({
  ...spellFileTitles,
  '100': "Map 'empty' (G.I card) =scan=.png",
  '101': "Map 'detail' (G.I card) =scan=.png",
  '102': 'Voucher (G.I card).png',
  '110': "110 Ruler's Invitation v2.png",
  '163': 'Sick Villagers (G.I card) =scan=.png',
  '263': 'Healthy Villagers (G.I card) =scan=.png',
  '266': 'Passage Ticket (G.I card) =scan=.png',
  '-000': 'Debug (G.I card).png',
  '-003': 'Elliminate (G.I card).png',
});

const articleTitles = Object.freeze({
  '100': "Map of the Island 'empty' (G.I card)",
  '101': "Map of the Island 'detailed' (G.I card)",
  '102': 'Voucher (G.I card)',
  '110': "Ruler's Invitation (G.I card)",
  '163': 'Sick Villagers (G.I card)',
  '263': 'Healthy Villagers (G.I card)',
  '266': 'Transport Ticket (G.I card)',
  '572': 'Giant Cyclops (G.I card)',
  '585': 'Bubble Horse (G.I card)',
  '598': 'Chief of Wolf Pack (G.I card)',
  '607': 'J10,000 (G.I card)',
  '673': 'Hyper Puffball (G.I card)',
  '697': 'Melanin Lizard (G.I card)',
  '711': 'Radio Rat (G.I card)',
  '1217': 'Galgaida (G.I card)',
  '14170': 'Gasoline (G.I card)',
  '21449': 'Rock (G.I card)',
  '25008': 'Large Rock (G.I card)',
  '-000': 'Debug (G.I card)',
  '-001': 'Under Control (G.I card)',
  '-002': 'Reset (G.I card)',
  '-003': 'Eliminate (G.I card)',
});

const spellArticleTitles = Object.freeze({
  '1001': 'Peek (G.I card)', '1002': 'Fluoroscopy (G.I card)', '1003': 'Defensive Wall (G.I card)',
  '1004': 'Reflect (G.I card)', '1005': 'Magnetic Force (G.I card)', '1006': 'Pickpocket (G.I card)',
  '1007': 'Thief (G.I card)', '1008': 'Trade (G.I card)', '1009': 'Return (G.I card)',
  '1010': 'Mimic (G.I card)', '1011': 'Clone (G.I card)', '1012': 'Relegate (G.I card)',
  '1013': 'Origin (G.I card)', '1014': 'Leave (G.I card)', '1015': 'Clairvoyance (G.I card)',
  '1016': 'Drift (G.I card)', '1017': 'Collision (G.I card)', '1018': 'Levy (G.I card)',
  '1019': 'Drawbridge (G.I card)', '1020': 'Fake (G.I card)', '1021': 'Mug (G.I card)',
  '1022': 'Corruption (G.I card)', '1023': 'Compromise (G.I card)', '1024': 'Dispel (G.I card)',
  '1025': 'Blackout Curtain (G.I card)', '1026': 'Holy Water (G.I card)', '1027': 'Trace (G.I card)',
  '1028': 'Rock Toss (G.I card)', '1029': 'Bullet (G.I card)', '1030': 'Guidepost (G.I card)',
  '1031': 'Analysis (G.I card)', '1032': 'Lottery (G.I card)', '1033': 'Cling (G.I card)',
  '1034': 'Purify (G.I card)', '1035': 'Fortress (G.I card)', '1036': 'Eye of God (G.I card)',
  '1037': 'Recycle (G.I card)', '1038': 'List (G.I card)', '1039': 'Accompany (G.I card)',
  '1040': 'Contact (G.I card)',
});

const normalizeTitle = (value = '') => value.replaceAll('_', ' ').trim().toLowerCase();

export function getCardLibraryArticleTitle(card) {
  return spellArticleTitles[card.id] || articleTitles[card.id] || null;
}

export function getDirectCardLibraryMedia(card) {
  const fileTitle = directFileTitles[card.id];
  if (!fileTitle) return null;
  const title = getCardLibraryArticleTitle(card);
  return Object.freeze({
    src: fileUrl(fileTitle),
    fileTitle,
    filePage: filePageUrl(fileTitle),
    sourcePage: title ? articleUrl(title) : null,
    status: 'verified-file',
    verifiedAt: CARD_LIBRARY_MEDIA_VERIFIED_AT,
  });
}

export async function resolveHunterpediaCardMedia(cards, signal) {
  const unresolved = cards.filter((card) => !getDirectCardLibraryMedia(card) && getCardLibraryArticleTitle(card));
  if (!unresolved.length) return {};
  const requestedTitles = unresolved.map(getCardLibraryArticleTitle);
  const params = new URLSearchParams({
    action: 'query', format: 'json', origin: '*', redirects: '1', prop: 'pageimages',
    piprop: 'thumbnail|original|name', pithumbsize: '720', titles: requestedTitles.join('|'),
  });
  const response = await fetch(`${HUNTERPEDIA_API}?${params}`, { signal, mode: 'cors' });
  if (!response.ok) throw new Error(`Hunterpedia media request failed with ${response.status}.`);
  const payload = await response.json();
  const aliases = new Map();
  for (const item of [...(payload.query?.normalized || []), ...(payload.query?.redirects || [])]) aliases.set(normalizeTitle(item.from), normalizeTitle(item.to));
  const pagesByTitle = new Map(Object.values(payload.query?.pages || {}).map((page) => [normalizeTitle(page.title), page]));
  const resolved = {};
  for (const card of unresolved) {
    const requested = getCardLibraryArticleTitle(card);
    let key = normalizeTitle(requested);
    for (let guard = 0; guard < 4 && aliases.has(key); guard += 1) key = aliases.get(key);
    const page = pagesByTitle.get(key);
    const src = page?.thumbnail?.source || page?.original?.source;
    if (!src) continue;
    resolved[card.id] = Object.freeze({
      src,
      fileTitle: page.pageimage || null,
      filePage: page.pageimage ? filePageUrl(page.pageimage) : null,
      sourcePage: articleUrl(requested),
      status: 'verified-page-image',
      verifiedAt: CARD_LIBRARY_MEDIA_VERIFIED_AT,
    });
  }
  return resolved;
}

export const CARD_LIBRARY_DIRECT_MEDIA_COUNT = Object.keys(directFileTitles).length;
export const CARD_LIBRARY_ARTICLE_MEDIA_COUNT = Object.keys(articleTitles).length;
