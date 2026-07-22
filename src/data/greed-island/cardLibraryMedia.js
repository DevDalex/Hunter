import { cardLibraryLocalMediaById } from './cardLibraryLocalMedia.generated.js';

const HUNTERPEDIA_ROOT = 'https://hunterxhunter.fandom.com';
const CARD_LIST_PAGE = `${HUNTERPEDIA_ROOT}/wiki/Greed_Island_Card_Lists`;
export const CARD_LIBRARY_MEDIA_VERIFIED_AT = '2026-07-22';

const encodeTitle = (value) => encodeURIComponent(value).replaceAll('%2F', '/');
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

const freeSlotFileTitles = Object.freeze({
  '100': "Map 'empty' (G.I card) =scan=.png",
  '101': "Map 'detail' (G.I card) =scan=.png",
  '102': 'Voucher (G.I card).png',
  '110': "110 Ruler's Invitation v2.png",
  '163': 'Sick Villagers (G.I card) =scan=.png',
  '263': 'Healthy Villagers (G.I card) =scan=.png',
  '266': 'Passage Ticket (G.I card) =scan=.png',
  '572': 'Giant Cyclops (G.I card) =scan=.png',
  '585': 'Bubble Horse (G.I card) =scan=.png',
  '598': 'Chief of Wolf Pack (G.I card) =scan=.png',
  '607': '10000J (G.I Card Manga) =en=.png',
  '673': 'Hyper Puffball (G.I card) =scan=.png',
  '697': 'Melanin Lizard (G.I card) =scan=.png',
  '711': 'Radio Rat (G.I card) =scan=.png',
  '1217': 'Galgaida (G.I card).png',
  '14170': 'Gasoline (G.I card) =scan=.png',
  '21449': 'Rock (G.I card).png',
  '25008': 'Large Rock (G.I card) =scan=.png',
});

const gameMasterFileTitles = Object.freeze({
  '-000': 'Debug (G.I card).png',
  '-001': 'Under Control (G.I card).png',
  '-002': 'Reset (G.I card).png',
  '-003': 'Elliminate (G.I card).png',
});

const exactFileTitles = Object.freeze({
  ...spellFileTitles,
  ...freeSlotFileTitles,
  ...gameMasterFileTitles,
});

const sourceSection = (cardId) => {
  if (cardId.startsWith('-')) return `${CARD_LIST_PAGE}#List_of_Game_Master-only_Cards`;
  if (cardId.length === 4 && cardId.startsWith('10')) return `${CARD_LIST_PAGE}#List_of_the_40_Spell_Cards`;
  return `${CARD_LIST_PAGE}#List_of_the_Un-Restricted_Slot_Cards_(Free_Slots)`;
};

export const cardLibraryRemoteMedia = Object.freeze(Object.entries(exactFileTitles).map(([cardId, fileTitle]) => Object.freeze({
  cardId,
  fileTitle,
  remote: fileUrl(fileTitle),
  filePage: filePageUrl(fileTitle),
  sourcePage: sourceSection(cardId),
  verifiedAt: CARD_LIBRARY_MEDIA_VERIFIED_AT,
})));

export const cardLibraryRemoteMediaById = new Map(cardLibraryRemoteMedia.map((record) => [record.cardId, record]));

export function getDirectCardLibraryMedia(card) {
  const remote = cardLibraryRemoteMediaById.get(card.id);
  if (!remote) return null;
  const local = cardLibraryLocalMediaById.get(card.id);
  return Object.freeze({
    ...remote,
    src: local?.src || remote.remote,
    width: local?.width || null,
    height: local?.height || null,
    storage: local ? 'local' : 'remote',
    status: local ? 'verified-local-webp' : 'verified-remote-file',
  });
}

export async function resolveHunterpediaCardMedia() {
  return {};
}

export const CARD_LIBRARY_DIRECT_MEDIA_COUNT = cardLibraryRemoteMedia.length;
export const CARD_LIBRARY_ARTICLE_MEDIA_COUNT = cardLibraryRemoteMedia.length;
