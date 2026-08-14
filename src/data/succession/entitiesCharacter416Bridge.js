import { successionArchiveData as base } from './entitiesCharacter415Bridge.js';

const freeze = (value) => Object.freeze(value);
const mozbe = freeze({
  id:'character:mozbe', entityType:'character', slug:'mozbe', name:'Mozbe', aliases:freeze([]),
  summary:'A member of Camilla’s guard detail. In Chapter 416, Mozbe and Taler confront Benjamin’s armed team outside Camilla’s residence before standing down when outmatched.',
  sourceIds:freeze(['source:chapter-389','source:chapter-416']), publicationStatus:'published', canonLevel:'canon',
  createdAt:'2026-08-14', updatedAt:'2026-08-14',
  status:freeze({ life:'alive', certainty:'confirmed', asOfChapter:416, note:'Active outside Camilla’s residence during Benjamin’s Chapter 416 assault.' }),
  roles:freeze(['guard']), affiliations:freeze([]), tags:freeze(['camilla-guard','succession-contest']),
  media:freeze({ portrait:null, galleryIds:freeze([]), source:null }), referenceUrl:'https://hunterxhunter.fandom.com/wiki/Mozbe',
  princeOrder:null, queenRank:null, royalMother:null,
});

const characters = freeze([
  ...base.characters.filter((record)=>record.id!==mozbe.id),
  mozbe,
].sort((a,b)=>a.name.localeCompare(b.name)));

export const successionArchiveData = freeze({ ...base, characters });
