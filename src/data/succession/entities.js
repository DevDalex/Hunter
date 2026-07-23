import { successionRosterGroups } from '../successionRoster.js';
import {
  guardianBeasts as dossierGuardianBeasts,
  princeDossiers,
  queenDossiers,
  successionChapterResearch,
} from '../successionDossier.js';
import { statusNoteOf, statusOf } from '../successionStatus.js';

const ARCHIVE_DATE = '2026-07-23';
const DIRECTORY_SOURCE_ID = 'source:hunterpedia-current-arc-character-directory';
const ARC_SOURCE_ID = 'source:hunterpedia-succession-contest';
const directoryUrl = 'https://hunterxhunter.fandom.com/wiki/List_of_Hunter_%C3%97_Hunter_Characters/Chapters_340-current';
const arcUrl = 'https://hunterxhunter.fandom.com/wiki/Succession_Contest_arc';

const slugify = (value = '') => String(value).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
  .replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const characterId = (name) => `character:${slugify(name)}`;
const organizationId = (slug) => `organization:${slug}`;
const chapterSourceId = (number) => `source:chapter-${number}`;
const unique = (values) => [...new Set(values.filter(Boolean))];
const ordinalWords = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth', 'thirteenth', 'fourteenth'];
const ordinalLabel = (order) => `${order}${order === 1 ? 'st' : order === 2 ? 'nd' : order === 3 ? 'rd' : 'th'}`;

const base = ({ id, entityType, slug, name, aliases = [], summary, sourceIds = [], publicationStatus = 'published', canonLevel = 'canon' }) => ({
  id, entityType, slug, name, aliases, summary, sourceIds, publicationStatus, canonLevel,
  createdAt: ARCHIVE_DATE, updatedAt: ARCHIVE_DATE,
});

export const sources = Object.freeze([
  {
    ...base({ id: DIRECTORY_SOURCE_ID, entityType: 'source', name: 'Hunterpedia current-arc character directory', summary: 'Hunterpedia directory for characters appearing in Chapters 340 onward.' }),
    sourceType: 'reference', url: directoryUrl, note: 'Primary roster and portrait index for the canonical Succession character catalogue.',
  },
  {
    ...base({ id: ARC_SOURCE_ID, entityType: 'source', name: 'Hunterpedia Succession Contest reference', summary: 'Hunterpedia overview for the Kakin succession conflict.' }),
    sourceType: 'reference', url: arcUrl, note: 'Arc-level reference for royal, institutional, and ritual records.',
  },
  ...successionChapterResearch.map((record) => ({
    ...base({ id: chapterSourceId(record.number), entityType: 'source', name: `Chapter ${record.number}`, summary: record.focus || `Primary manga reference for Chapter ${record.number}.` }),
    sourceType: 'chapter', chapter: record.number, pages: [], url: record.source, note: record.focus || `Primary manga reference for Chapter ${record.number}.`,
  })),
]);

const org = ({ slug, name, organizationType, summary, objectives, leaders = [], parentOrganizationId = null, sourceIds = [DIRECTORY_SOURCE_ID] }) => ({
  ...base({ id: organizationId(slug), entityType: 'organization', slug, name, summary, sourceIds }),
  organizationType, status: 'active', objectives, leaderIds: leaders.map(characterId), parentOrganizationId,
});

export const organizations = Object.freeze([
  org({ slug: 'hunter-association', name: 'Hunter Association', organizationType: 'professional-association', summary: 'The professional organization whose Zodiacs, contracted Hunters, and expedition personnel operate across the voyage.', objectives: ['Support the Dark Continent expedition and fulfill assigned voyage duties.'], leaders: ['Cheadle Yorkshire'] }),
  org({ slug: 'zodiacs', name: 'Zodiacs', organizationType: 'professional-association', summary: 'The Hunter Association leadership group assigned to the Dark Continent expedition and Beyond Netero operation.', objectives: ['Oversee the Association expedition and contain Beyond Netero.'], leaders: ['Cheadle Yorkshire'], parentOrganizationId: organizationId('hunter-association') }),
  org({ slug: 'kakin-royal-family', name: 'Kakin Royal Family', organizationType: 'royal-house', summary: 'Kakin’s ruling dynasty: King Nasubi, eight queens, and fourteen princes bound to the Succession Contest.', objectives: ['Determine the next ruler of Kakin through the royal succession system.'], leaders: ['Nasubi Hui Guo Rou'], sourceIds: [ARC_SOURCE_ID, chapterSourceId(349)] }),
  org({ slug: 'kakin-military', name: 'Kakin Military', organizationType: 'military', summary: 'Kakin military and Royal Army personnel enforcing security, custody, surveillance, and special martial law aboard the Black Whale.', objectives: ['Maintain ship security and execute lawful Kakin authority.'], sourceIds: [DIRECTORY_SOURCE_ID, chapterSourceId(380)] }),
  org({ slug: 'kakin-justice-bureau', name: 'Kakin Justice Bureau', organizationType: 'government-agency', summary: 'The institution handling investigations, custody, hearings, and legal procedure aboard the Black Whale.', objectives: ['Investigate crimes and preserve legal procedure during the voyage.'], sourceIds: [DIRECTORY_SOURCE_ID, chapterSourceId(383)] }),
  org({ slug: 'benjamin-private-army', name: 'Benjamin’s Private Army', organizationType: 'military', summary: 'The First Prince’s elite military unit, deployed across rival royal rooms for surveillance and direct operations.', objectives: ['Protect Benjamin and execute his succession strategy.'], leaders: ['Benjamin Hui Guo Rou', 'Balsamilco Might'], parentOrganizationId: organizationId('kakin-military'), sourceIds: [DIRECTORY_SOURCE_ID, chapterSourceId(361)] }),
  org({ slug: 'camilla-private-guard', name: 'Camilla’s Private Guard', organizationType: 'royal-guard-unit', summary: 'The Second Prince’s private soldiers and Have-Not curse network.', objectives: ['Protect Camilla and prepare curse operations against rival princes.'], leaders: ['Camilla Hui Guo Rou'], parentOrganizationId: organizationId('kakin-royal-family'), sourceIds: [DIRECTORY_SOURCE_ID, chapterSourceId(389)] }),
  org({ slug: 'xi-yu', name: 'Xi-Yu Family', organizationType: 'mafia-family', summary: 'A Kakin mafia family led by Onior Longbao and connected to Third Prince Zhang Lei.', objectives: ['Protect Xi-Yu territory, contain Heil-Ly, and manage the Hisoka search.'], leaders: ['Onior Longbao'], sourceIds: [DIRECTORY_SOURCE_ID, chapterSourceId(378)] }),
  org({ slug: 'heil-ly', name: 'Heil-Ly Family', organizationType: 'mafia-family', summary: 'Morena Prudo’s Contagion network, conducting a violent campaign against Kakin society aboard the Black Whale.', objectives: ['Advance Morena’s plan through Contagion and systematic killing.'], leaders: ['Morena Prudo'], sourceIds: [DIRECTORY_SOURCE_ID, chapterSourceId(378)] }),
  org({ slug: 'cha-r', name: 'Cha-R Family', organizationType: 'mafia-family', summary: 'A Kakin mafia family led by Brocco Li and connected to Seventh Prince Luzurus.', objectives: ['Protect Cha-R territory, contain Heil-Ly, and manage the Troupe relationship.'], leaders: ['Brocco Li'], sourceIds: [DIRECTORY_SOURCE_ID, chapterSourceId(378)] }),
  org({ slug: 'phantom-troupe', name: 'Phantom Troupe', organizationType: 'criminal-organization', summary: 'The Meteor City criminal group searching the Black Whale for Hisoka while becoming entangled in the mafia conflict.', objectives: ['Find Hisoka and destroy Heil-Ly interference.'], leaders: ['Chrollo Lucilfer'], sourceIds: [DIRECTORY_SOURCE_ID, chapterSourceId(379)] }),
]);

const rosterGroupById = new Map(successionRosterGroups.map((group) => [group.id, group]));
const princeByName = new Map(princeDossiers.map((record) => [record.name, record]));
const princeByShort = new Map(princeDossiers.map((record) => [record.short, record]));
const queenByName = new Map(queenDossiers.map((record) => [`${record.name} Hui Guo Rou`, record]));
const fullRoyalName = (name) => name === 'Nasubi' ? 'Nasubi Hui Guo Rou' : princeByShort.get(name)?.name || `${name} Hui Guo Rou`;
const excludedName = (name) => /^(Unnamed |Stone Wall |V6 Leader |Temp Hunter |Cha-R Associate |Tserriednich Friend |Heil-Ly Associate )/.test(name)
  || name === 'Kakin Announcer' || name === 'Silent Majority user';

const hunterNames = new Set(['Basho', 'Belerainte', 'Bill', 'Biscuit Krueger', 'Botobai Gigante', 'Cheadle Yorkshire', 'Cluck', 'Gel', 'Ginta', 'Hanzo', 'Hisoka Morow', 'Izunavi', 'Kanzai', 'Kurapika', 'Kurton', 'Leorio Paradinight', 'Melody', 'Mizaistom Nana', 'Pyon', 'Saccho Kobayakawa', 'Saiyu', 'Sayird']);
const zodiacNames = new Set(['Botobai Gigante', 'Cheadle Yorkshire', 'Cluck', 'Gel', 'Ginta', 'Kanzai', 'Kurapika', 'Leorio Paradinight', 'Mizaistom Nana', 'Pyon', 'Saccho Kobayakawa', 'Saiyu']);
const troupeNames = new Set(['Chrollo Lucilfer', 'Nobunaga Hazama', 'Feitan Portor', 'Machi Komacine', 'Phinks Magcub', 'Franklin Bordeau', 'Shizuku Murasaki', 'Bonolenov Ndongo', 'Illumi Zoldyck', 'Kalluto Zoldyck']);
const mafiaBosses = new Set(['Onior Longbao', 'Morena Prudo', 'Brocco Li']);
const mafiaUnderbosses = new Set(['Hinrigh Biganduffno', "Ken'i Wang"]);
const aliasesByName = new Map([
  ['Nasubi Hui Guo Rou', ['King Nasubi']],
  ['Salé-salé Hui Guo Rou', ['Sale-sale Hui Guo Rou', 'Prince Salé-salé', 'Eighth Prince Salé-salé']],
  ['Basho', ['Bashō']],
  ["Ken'i Wang", ['Ken-i Wang']],
]);
const keySummaries = new Map([
  ['Kurapika', 'A licensed Hunter and Zodiac serving as Queen Oito’s contracted bodyguard, Prince Woble’s chief strategist, and the organizer of the Room 1014 Nen classes.'],
  ['Woble Hui Guo Rou', 'The Fourteenth Prince of Kakin, an infant protected by Queen Oito, Kurapika, Bill, and the Room 1014 alliance network.'],
  ['Oito Hui Guo Rou', 'The Eighth Queen of Kakin, Woble’s mother, Kurapika’s employer, and an active participant in reconnaissance and alliance-building.'],
  ['Bill', 'A Hunter serving in Prince Woble’s bodyguard detail and assisting Kurapika throughout the voyage.'],
  ['Morena Prudo', 'The leader of the Heil-Ly Family and organizer of its Contagion campaign aboard the Black Whale.'],
  ['Borksen', 'A Kakin soldier and Tserriednich associate drawn into Morena Prudo’s negotiation and Heil-Ly conflict.'],
  ['Nasubi Hui Guo Rou', 'The King of Kakin, father of the fourteen princes, and the reigning survivor of an earlier succession contest.'],
]);

const groupsByCharacter = new Map();
for (const group of successionRosterGroups) {
  for (const member of group.members) {
    if (excludedName(member.name)) continue;
    const current = groupsByCharacter.get(member.name) || { member, groupIds: [] };
    current.groupIds.push(group.id);
    if (!current.member.image && member.image) current.member = member;
    groupsByCharacter.set(member.name, current);
  }
}

const rolesFor = (name, groupIds) => {
  const roles = [];
  const prince = princeByName.get(name);
  const queen = queenByName.get(name);
  if (name === 'Nasubi Hui Guo Rou') roles.push('king', 'royal-parent');
  if (prince) roles.push('prince', `${ordinalWords[prince.order - 1]}-prince`);
  if (queen) roles.push('queen', `${slugify(queen.rank)}-queen`, 'royal-parent');
  if (groupIds.includes('royal-bodyguards')) roles.push('bodyguard');
  if (groupIds.includes('royal-servants')) roles.push('royal-servant');
  if (groupIds.includes('kakin-soldiers')) roles.push('military', 'soldier');
  if (groupIds.includes('justice-bureau')) roles.push('justice-official');
  if (groupIds.includes('benjamin-guard')) roles.push('military', 'bodyguard', 'benjamin-soldier');
  if (groupIds.includes('camilla-guard')) roles.push('bodyguard', 'camilla-soldier');
  if (groupIds.some((id) => ['xi-yu', 'heil-ly', 'cha-r'].includes(id))) roles.push('mafia-member');
  if (mafiaBosses.has(name)) roles.push('mafia-boss');
  if (mafiaUnderbosses.has(name)) roles.push('mafia-underboss');
  if (hunterNames.has(name)) roles.push('hunter');
  if (zodiacNames.has(name)) roles.push('zodiac');
  if (troupeNames.has(name)) roles.push('phantom-troupe-member');
  if (name === 'Kurapika') roles.push('nen-instructor');
  return unique(roles.length ? roles : ['arc-character']);
};

const affiliationsFor = (name, groupIds, roles) => {
  const affiliations = [];
  const add = (slug, role) => affiliations.push({ organizationId: organizationId(slug), role, status: 'active' });
  if (roles.some((role) => role === 'king' || role === 'prince' || role === 'queen' || role === 'royal-parent')) add('kakin-royal-family', 'Royal family');
  if (roles.includes('hunter')) add('hunter-association', 'Hunter');
  if (roles.includes('zodiac')) add('zodiacs', 'Zodiac');
  if (groupIds.includes('kakin-soldiers')) add('kakin-military', 'Soldier');
  if (groupIds.includes('justice-bureau')) add('kakin-justice-bureau', 'Justice Bureau official');
  if (groupIds.includes('benjamin-guard')) add('benjamin-private-army', 'Private soldier');
  if (groupIds.includes('camilla-guard')) add('camilla-private-guard', 'Private guard');
  if (groupIds.includes('xi-yu')) add('xi-yu', mafiaBosses.has(name) ? 'Boss' : mafiaUnderbosses.has(name) ? 'Underboss' : 'Member');
  if (groupIds.includes('heil-ly')) add('heil-ly', name === 'Morena Prudo' ? 'Boss' : 'Member');
  if (groupIds.includes('cha-r')) add('cha-r', mafiaBosses.has(name) ? 'Boss' : mafiaUnderbosses.has(name) ? 'Underboss' : 'Member');
  if (troupeNames.has(name)) add('phantom-troupe', name === 'Chrollo Lucilfer' ? 'Leader' : 'Member');
  return affiliations;
};

const summaryFor = (name, groupIds, member, roles) => {
  if (keySummaries.has(name)) return keySummaries.get(name);
  const prince = princeByName.get(name);
  if (prince) return `${prince.short} is the ${ordinalLabel(prince.order)} Prince of Kakin. ${prince.strategy}`;
  const queen = queenByName.get(name);
  if (queen) return `${queen.rank} Queen of Kakin and mother or guardian of ${queen.children.join(', ')}. ${queen.role}`;
  if (roles.includes('mafia-boss')) return `${name} leads a Kakin mafia family active in the Black Whale conflict.`;
  if (roles.includes('bodyguard')) return `${name} is indexed among the royal bodyguards and security personnel active during the Succession Contest.`;
  if (roles.includes('military')) return `${name} is Kakin military personnel active during the Black Whale voyage.`;
  if (roles.includes('hunter')) return `${name} is a Hunter active in the expedition or royal-security layer of the current story.`;
  return `${name} is a named ${member.group || rosterGroupById.get(groupIds[0])?.title || 'current-arc'} character indexed in the Succession Contest archive.`;
};

export const characters = Object.freeze([...groupsByCharacter.entries()].map(([name, { member, groupIds }]) => {
  const roles = rolesFor(name, groupIds);
  const prince = princeByName.get(name);
  const queen = queenByName.get(name);
  const status = statusOf(name);
  return {
    ...base({
      id: characterId(name), entityType: 'character', slug: slugify(name), name,
      aliases: aliasesByName.get(name) || (prince ? [`Prince ${prince.short}`, `${ordinalLabel(prince.order)} Prince ${prince.short}`] : queen ? [`Queen ${queen.name}`] : []),
      summary: summaryFor(name, groupIds, member, roles), sourceIds: [DIRECTORY_SOURCE_ID],
    }),
    status: { life: status === 'deceased' ? 'dead' : status === 'active' || status === 'exceptional' ? 'alive' : 'unknown', certainty: status === 'exceptional' ? 'probable' : 'confirmed', asOfChapter: 413, note: statusNoteOf(name) },
    roles, affiliations: affiliationsFor(name, groupIds, roles),
    tags: unique([...groupIds, ...roles, 'succession-contest']),
    media: { portrait: member.image || null, galleryIds: [], source: member.imageSource || null, ...(member.media || {}) },
    referenceUrl: member.source || directoryUrl,
    princeOrder: prince?.order || null,
    queenRank: queen?.rank || null,
    royalMother: prince?.mother || null,
  };
}).sort((left, right) => left.name.localeCompare(right.name)));

const characterByName = new Map(characters.map((record) => [record.name, record]));

export const abilities = Object.freeze([
  {
    ...base({ id: 'ability:emperor-time', entityType: 'ability', slug: 'emperor-time', name: 'Emperor Time', summary: 'Kurapika’s specialist state grants full efficiency across Nen categories at a severe personal cost.', sourceIds: [chapterSourceId(369)] }),
    ownerIds: [characterId('Kurapika')], classification: { nenTypes: ['specialization'], certainty: 'confirmed' }, category: 'efficiency-state', activation: 'Active while Kurapika’s eyes are scarlet.', conditions: [], limitations: [], costs: ['Consumes Kurapika’s lifespan while active.'], knownUses: [],
  },
  {
    ...base({ id: 'ability:parallel-future', entityType: 'ability', slug: 'parallel-future', name: 'Parallel Future', summary: 'Tserriednich’s future-perception ability, developed through his Nen training and use of Zetsu.', sourceIds: [chapterSourceId(385)] }),
    ownerIds: [characterId('Tserriednich Hui Guo Rou')], classification: { nenTypes: ['specialization'], certainty: 'confirmed' }, category: 'future-perception', activation: 'Connected to the user entering Zetsu.', conditions: [], limitations: [], costs: [], knownUses: [],
  },
]);

const beastNenType = (value = '') => ['enhancement', 'transmutation', 'emission', 'conjuration', 'manipulation', 'specialization'].includes(value.toLowerCase()) ? value.toLowerCase() : 'unknown';
export const guardianBeasts = Object.freeze(dossierGuardianBeasts.map((record) => ({
  ...base({
    id: `guardian-beast:${slugify(record.host)}`, entityType: 'guardian-beast', slug: `${slugify(record.host)}-guardian-spirit-beast`, name: `${record.host}’s Guardian Spirit Beast`,
    aliases: record.host === 'Kacho' ? ['Without You'] : record.host === 'Fugetsu' ? ['Magical Worm'] : [],
    summary: record.ability, sourceIds: [ARC_SOURCE_ID, chapterSourceId(349)], canonLevel: record.knowledge === 'Suspected' ? 'inference' : 'canon',
  }),
  hostCharacterId: characterId(fullRoyalName(record.host)),
  classification: { nenTypes: [beastNenType(record.type)], certainty: record.knowledge === 'Unknown' ? 'unknown' : 'probable' },
  knowledge: record.knowledge, conditions: [record.conditions], knownAbilityIds: [], suspectedAbilityIds: [],
  media: { portrait: record.image || null, galleryIds: [] }, referenceUrl: record.source,
})));

export const locations = Object.freeze([
  { ...base({ id: 'location:black-whale', entityType: 'location', slug: 'black-whale', name: 'Black Whale No. 1', aliases: ['Black Whale'], summary: 'The enormous Kakin vessel carrying the royal family, expedition personnel, and civilian population toward the New Continent.', sourceIds: [chapterSourceId(358)] }), locationType: 'vessel', parentId: null, ancestorIds: [], deck: null, accessLevel: 'mixed' },
  { ...base({ id: 'location:black-whale:tier-1', entityType: 'location', slug: 'black-whale-tier-1', name: 'Black Whale Tier 1', aliases: ['Tier 1'], summary: 'The highest-security royal tier containing the princes’ residential and ceremonial areas.', sourceIds: [chapterSourceId(358)] }), locationType: 'tier', parentId: 'location:black-whale', ancestorIds: ['location:black-whale'], deck: 1, accessLevel: 'restricted' },
  { ...base({ id: 'location:black-whale:tier-1:room-1014', entityType: 'location', slug: 'room-1014', name: 'Room 1014', summary: 'Prince Woble’s Tier 1 quarters and the primary base for Kurapika, Queen Oito, Bill, and Woble’s protection team.', sourceIds: [chapterSourceId(358), chapterSourceId(369), chapterSourceId(381)] }), locationType: 'room', parentId: 'location:black-whale:tier-1', ancestorIds: ['location:black-whale', 'location:black-whale:tier-1'], deck: 1, accessLevel: 'restricted' },
]);

export const locationHistory = Object.freeze([
  ['Kurapika', 358, 413], ['Woble Hui Guo Rou', 358, 413], ['Oito Hui Guo Rou', 358, 413], ['Bill', 358, 413],
].map(([name, start, end], index) => ({
  ...base({ id: `location-history:${slugify(name)}:room-1014:${String(index + 1).padStart(3, '0')}`, entityType: 'location-history', summary: `${name} is recorded in Room 1014 during the modeled Succession Contest period.`, sourceIds: [chapterSourceId(start), chapterSourceId(369), chapterSourceId(381)] }),
  characterId: characterId(name), locationId: 'location:black-whale:tier-1:room-1014', chapterRange: { start, end }, state: 'present', certainty: 'confirmed',
})));

export const events = Object.freeze([{
  ...base({ id: 'event:room-1014-nen-classes', entityType: 'event', slug: 'room-1014-nen-classes', name: 'Room 1014 Nen Classes', aliases: ['Kurapika’s Nen Classes'], summary: 'Kurapika conducts Nen instruction for bodyguards connected to the royal succession struggle, using the classes to improve Woble’s strategic position.', sourceIds: [chapterSourceId(369), chapterSourceId(381), chapterSourceId(411)] }),
  category: 'training', importance: 'major', chapterRange: { start: 369, end: 413 }, chronology: { sequence: 1, day: null, timeOfDay: null, certainty: 'approximate' },
  participantIds: [characterId('Kurapika'), characterId('Bill')], organizationIds: [organizationId('hunter-association')], locationIds: ['location:black-whale:tier-1:room-1014'], abilityIds: ['ability:emperor-time'],
  causes: ['Kurapika needs to expose and balance Nen knowledge among the princes’ bodyguards.'], outcomes: ['Multiple bodyguards begin learning Nen under Kurapika’s supervision.'], consequenceEventIds: [], status: 'ongoing',
}]);

export const chapters = Object.freeze(successionChapterResearch.map((record) => ({
  ...base({ id: `chapter:${record.number}`, entityType: 'chapter', slug: String(record.number), name: record.title ? `Chapter ${record.number} · ${record.title}` : `Chapter ${record.number}`, summary: record.focus || `Research record for Chapter ${record.number}.`, sourceIds: [chapterSourceId(record.number)] }),
  number: record.number, storyPhaseIds: [slugify(record.phase)], appearanceRecords: [], eventIds: record.number >= 369 && record.number <= 413 ? ['event:room-1014-nen-classes'] : [],
  locationIds: record.number >= 358 ? ['location:black-whale'] : [], abilityIds: record.number === 369 ? ['ability:emperor-time'] : record.number === 385 ? ['ability:parallel-future'] : [], organizationIds: [],
  reader: { manifestChapter: record.number }, voyageDay: record.voyageDay, lanes: record.lanes, referenceUrl: record.source,
})));

const relationship = ({ id, name, summary, sourceEntityId, targetEntityId, relationshipType, subtype, direction = 'directed', sentiment = 'allied', start = 349, end = null, sourceIds = [chapterSourceId(349)] }) => ({
  ...base({ id: `relationship:${id}`, entityType: 'relationship', slug: id, name, summary, sourceIds }), sourceEntityId, targetEntityId, relationshipType, subtype, direction, sentiment, status: 'active', chapterRange: { start, end },
});

const royalRelationships = [];
for (const queen of queenDossiers) {
  const queenName = `${queen.name} Hui Guo Rou`;
  for (const childLabel of queen.children) {
    const childShort = childLabel.replace(/\s*\(.+\)$/, '');
    const childRecord = princeByShort.get(childShort);
    if (!childRecord) continue;
    const subtype = childShort === 'Halkenburg' ? queen.name === 'Unma' ? 'biological-mother-child' : 'raised-mother-child' : 'mother-child';
    royalRelationships.push(relationship({ id: `${slugify(queen.name)}-${slugify(childShort)}-${subtype}`, name: `${queen.name} and ${childShort}`, summary: `${queen.name} is recorded as ${subtype.replaceAll('-', ' ')} in ${childShort}’s royal-family record.`, sourceEntityId: characterId(queenName), targetEntityId: characterId(childRecord.name), relationshipType: 'family', subtype }));
  }
}
for (const prince of princeDossiers) royalRelationships.push(relationship({ id: `nasubi-${slugify(prince.short)}-father-child`, name: `Nasubi and ${prince.short}`, summary: `King Nasubi is the father of ${prince.short}, the ${ordinalLabel(prince.order)} Prince of Kakin.`, sourceEntityId: characterId('Nasubi Hui Guo Rou'), targetEntityId: characterId(prince.name), relationshipType: 'family', subtype: 'father-child' }));

export const relationships = Object.freeze([
  ...royalRelationships,
  relationship({ id: 'kurapika-oito', name: 'Kurapika and Oito', summary: 'Kurapika serves Queen Oito as a bodyguard and strategic ally in the effort to protect Prince Woble.', sourceEntityId: characterId('Kurapika'), targetEntityId: characterId('Oito Hui Guo Rou'), relationshipType: 'professional', subtype: 'bodyguard-employer', direction: 'bidirectional', sourceIds: [chapterSourceId(358), chapterSourceId(381)], start: 358 }),
  relationship({ id: 'kurapika-woble', name: 'Kurapika and Woble', summary: 'Kurapika is committed to protecting Prince Woble throughout the Succession Contest.', sourceEntityId: characterId('Kurapika'), targetEntityId: characterId('Woble Hui Guo Rou'), relationshipType: 'protective', subtype: 'bodyguard-protected-prince', sourceIds: [chapterSourceId(358), chapterSourceId(381)], start: 358 }),
  relationship({ id: 'morena-heil-ly', name: 'Morena Prudo and the Heil-Ly Family', summary: 'Morena Prudo leads the Heil-Ly Family aboard the Black Whale.', sourceEntityId: characterId('Morena Prudo'), targetEntityId: organizationId('heil-ly'), relationshipType: 'professional', subtype: 'leader-organization', sourceIds: [chapterSourceId(378), chapterSourceId(400)], start: 378 }),
]);

if (!characterByName.has('Kurapika') || !characterByName.has('Woble Hui Guo Rou')) throw new Error('Succession character catalogue is missing required Woble-faction records.');

export const successionArchiveData = Object.freeze({ sources, organizations, characters, abilities, guardianBeasts, locations, locationHistory, events, chapters, relationships });
