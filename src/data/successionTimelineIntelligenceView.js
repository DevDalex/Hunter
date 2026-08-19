import { timelineNenDevelopments } from './successionTimelineIntelligence.js';

const normalize = (value) => String(value || '').toLocaleLowerCase();

const developmentMatchers = Object.freeze([
  Object.freeze({ chapter: 360, title: 'Guardian Spirit Beasts become an explicit operational fact', terms: Object.freeze(['guardian spirit beast', 'invisible entities', 'nen beasts']) }),
  Object.freeze({ chapter: 373, title: 'Cat’s Name demonstrates counteractive resurrection', terms: Object.freeze(['cat’s name', "cat's name", 'camilla', 'revives', 'counteractive']) }),
  Object.freeze({ chapter: 374, title: 'Magical Worm establishes Fugetsu’s door route', terms: Object.freeze(['magical worm', 'fugetsu', 'tunnel', 'door']) }),
  Object.freeze({ chapter: 375, title: 'Zhang Lei’s Guardian Spirit Beast begins producing coins', terms: Object.freeze(['zhang lei', 'coin']) }),
  Object.freeze({ chapter: 375, title: 'Halkenburg’s collective aura becomes detectable shipwide', terms: Object.freeze(['halkenburg', 'aura wave', 'shared moment']) }),
  Object.freeze({ chapter: 383, title: 'Without You manifests after Kacho’s death', terms: Object.freeze(['without you', 'kacho dies', 'kacho’s guardian', "kacho's guardian"]) }),
  Object.freeze({ chapter: 385, title: 'Tserriednich’s Zetsu-linked temporal anomaly appears', terms: Object.freeze(['time skipped', 'temporal anomaly', 'headshot', 'zetsu']) }),
  Object.freeze({ chapter: 401, title: 'Moonlight Act formalizes truth and contract conditions', terms: Object.freeze(['moonlight act', 'longhi', 'contract']) }),
  Object.freeze({ chapter: 401, title: 'Beyond’s curse-child system enters the Succession Contest', terms: Object.freeze(['curse children', 'curse-child', 'beyond', 'sacrific']) }),
  Object.freeze({ chapter: 416, title: 'Dust in the Wind: Hell Fruit activates', terms: Object.freeze(['hell fruit', 'moswana', 'ghostly hand', 'curse visibly spreads']) }),
  Object.freeze({ chapter: 416, title: 'TSK-17 is used against Camilla', terms: Object.freeze(['tsk-17', 'infects camilla', 'incurable disease']) }),
  Object.freeze({ chapter: 417, title: 'Gypsy Life: Bohemian Rhapsody mechanics are revealed', terms: Object.freeze(['gypsy life', 'bohemian rhapsody', 'future host', 'benjamin baton']) }),
]);

export const strictTimelineNenForEvent = (event) => {
  const chapter = Number(event.chapter);
  const text = normalize(`${event.title} ${event.detail} ${(event.tracks || []).join(' ')}`);
  return timelineNenDevelopments.filter((development) => {
    if (Number(development.chapter) !== chapter) return false;
    const matcher = developmentMatchers.find((item) => item.chapter === chapter && item.title === development.title);
    return matcher ? matcher.terms.some((term) => text.includes(normalize(term))) : false;
  });
};
