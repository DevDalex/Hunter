const GI_MAP = 'https://static.wikia.nocookie.net/hunterxhunter/images/0/05/GI_Map.png/revision/latest?cb=20120106130831';

const media = (src, alt, sourcePage, focal = '50% 50%') => Object.freeze({
  src,
  fallbackSrc: GI_MAP,
  alt,
  sourcePage,
  focal,
  storage: 'remote-verified',
  verifiedAt: '2026-07-22',
});

export const greedIslandOverviewMedia = media(
  GI_MAP,
  'The Greed Island map shown in Hunterpedia',
  'https://hunterxhunter.fandom.com/wiki/Greed_Island',
  '50% 50%',
);

export const greedIslandLocationMedia = Object.freeze({
  'starting-point': media(
    'https://static.wikia.nocookie.net/hunterxhunter/images/d/d6/Greed_Island_Entrance_2011.png/revision/latest?cb=20121223050216',
    'Greed Island Starting Point in the 2011 anime',
    'https://hunterxhunter.fandom.com/wiki/Greed_Island_Starting_Point',
    '50% 48%',
  ),
  masadora: media(
    'https://static.wikia.nocookie.net/hunterxhunter/images/c/ce/Masadora2011.png/revision/latest?cb=20230518220757',
    'Masadora, the Magic City, in the 2011 anime',
    'https://hunterxhunter.fandom.com/wiki/Masadora',
    '50% 52%',
  ),
  'spell-card-shop': media(
    'https://static.wikia.nocookie.net/hunterxhunter/images/0/08/Spell_Card_Store.png/revision/latest?cb=20221107010351',
    'The Spell Card Shop in Masadora',
    'https://hunterxhunter.fandom.com/wiki/Spell_Card_Shop',
    '50% 50%',
  ),
  'trade-shops': media(
    'https://static.wikia.nocookie.net/hunterxhunter/images/c/ce/Masadora2011.png/revision/latest?cb=20230518220757',
    'Masadora, one of the documented Trade Shop locations',
    'https://hunterxhunter.fandom.com/wiki/Trade_Shops',
    '52% 52%',
  ),
  badlands: media(
    'https://static.wikia.nocookie.net/hunterxhunter/images/3/31/GI_Badlands.png/revision/latest?cb=20230518220815',
    'The Greed Island Badlands in the 2011 anime',
    'https://hunterxhunter.fandom.com/wiki/Greed_Island_Badlands',
    '50% 50%',
  ),
  port: media(
    'https://static.wikia.nocookie.net/hunterxhunter/images/5/5e/Greed_Island_Port_%282011_Anime%29.png/revision/latest?cb=20220430195013',
    'Greed Island Port in the 2011 anime',
    'https://hunterxhunter.fandom.com/wiki/Greed_Island_Port',
    '50% 50%',
  ),
  soufrabi: media(
    'https://static.wikia.nocookie.net/hunterxhunter/images/4/46/Soufrabi.png/revision/latest?cb=20130217113825',
    'Soufrabi, the Port City, in the 2011 anime',
    'https://hunterxhunter.fandom.com/wiki/Soufrabi',
    '50% 48%',
  ),
  aiai: media(
    'https://static.wikia.nocookie.net/hunterxhunter/images/9/9e/City_Of_Aiai.png/revision/latest?cb=20190128200303',
    'Aiai, the City of Love, in the 2011 anime',
    'https://hunterxhunter.fandom.com/wiki/Aiai',
    '50% 48%',
  ),
  limeiro: media(
    'https://static.wikia.nocookie.net/hunterxhunter/images/9/91/Limeiro_2011.png/revision/latest?cb=20230528200106',
    'Limeiro, the capital of Greed Island, in the 2011 anime',
    'https://hunterxhunter.fandom.com/wiki/Limeiro',
    '50% 48%',
  ),
});

export const resolveGreedIslandLocationMedia = (locationId) => greedIslandLocationMedia[locationId] || greedIslandOverviewMedia;
