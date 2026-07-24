import { roomAssignmentLedger } from './successionArchive';
import { successionRosterGroups } from './successionRoster';

const dedicatedRosterGroupByPrince = new Map([
  [1, 'benjamin-guard'],
  [2, 'camilla-guard'],
]);

const numberWords = new Map([
  ['one', 1], ['two', 2], ['three', 3], ['four', 4], ['five', 5],
  ['six', 6], ['seven', 7], ['eight', 8], ['nine', 9], ['ten', 10],
  ['eleven', 11], ['twelve', 12], ['thirteen', 13], ['fourteen', 14], ['fifteen', 15],
]);

const complementPattern = /\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|\d+)\s+(personal guards?|royal guards?|queen-assigned guards?|higher-queen spies?|provisional hunters?|pro hunters?|hunters?|servants?|attendants?)\b/gi;

const normalizeLabel = (value = '') => String(value)
  .replace(/\s+/g, ' ')
  .trim();

const countFrom = (value) => {
  const normalized = String(value || '').toLowerCase();
  return numberWords.get(normalized) || Number(normalized) || 0;
};

const roomByPrince = new Map(roomAssignmentLedger.map((record) => [record.order, record]));
const rosterGroupById = new Map(successionRosterGroups.map((group) => [group.id, group]));

const actor = (name, kind, eyebrow, description, extra = {}) => ({
  name,
  kind,
  eyebrow,
  description,
  ...extra,
});

const categorizedActorsByPrince = new Map([
  [2, [
    actor('Musse', 'observer', 'Benjamin surveillance', 'Benjamin soldier embedded around Camilla before she killed him; shown as hostile surveillance, not as Camilla-loyal protection.'),
  ]],
  [3, [
    actor('Coventoba', 'observer', 'Benjamin observer', 'Benjamin soldier assigned to monitor Zhang Lei. He belongs to the surveillance layer rather than Zhang Lei’s loyal guard core.'),
  ]],
  [6, [
    actor('Izunavi', 'kurapika-placement', 'Kurapika-recruited Hunter', 'Hunter recruited by Kurapika and placed in Tyson’s household as part of the wider information and survival network.'),
    actor('Higher-queen spies', 'spy', 'Royal surveillance group', 'The room record confirms spies from higher-ranked queens embedded in Tyson’s household.', { entity: null, isGroup: true }),
  ]],
  [7, [
    actor('Bashō', 'kurapika-placement', 'Kurapika-recruited Hunter', 'Hunter recruited by Kurapika and placed in Luzurus’s household.'),
    actor('Satobi', 'observer', 'Household observer', 'Royal guard associated with surveillance and Nen-class reporting around Luzurus’s room.'),
    actor('Scairt', 'observer', 'Queen surveillance interest', 'Guard representing overlapping queen-household surveillance interests in Luzurus’s room.'),
    actor('Ridge', 'observer', 'Military surveillance interest', 'Military-linked observer attached to the Luzurus room network.'),
  ]],
  [8, [
    actor('Rihan', 'hostile', 'Benjamin infiltration', 'Benjamin soldier who analyzed and destroyed Sale-sale’s Guardian Spirit Beast.'),
    actor('Yushohi', 'hostile', 'Benjamin assassination operation', 'Benjamin soldier involved in the operation that completed Sale-sale’s assassination.'),
    actor('Higher-queen spies', 'spy', 'Royal surveillance group', 'The room record confirms spies from higher-ranked queens inside Sale-sale’s household.', { entity: null, isGroup: true }),
  ]],
  [9, [
    actor('Higher-queen spy', 'spy', 'Royal surveillance group', 'Halkenburg’s original room complement includes one spy from a higher-ranked queen.', { entity: null, isGroup: true }),
  ]],
  [10, [
    actor('Melody', 'kurapika-placement', 'Kurapika-recruited Hunter', 'Hunter recruited by Kurapika and placed in Kacho’s household, later central to the twins’ escape plan.'),
    actor('Higher-queen spies', 'spy', 'Royal surveillance group', 'The Kacho room record includes spies sent by higher-ranked queens.', { entity: null, isGroup: true }),
  ]],
  [11, [
    actor('Higher-queen spies', 'spy', 'Royal surveillance group', 'The Fugetsu room record includes spies sent by higher-ranked queens.', { entity: null, isGroup: true }),
  ]],
  [12, [
    actor('Hanzo', 'kurapika-placement', 'Kurapika-recruited Hunter', 'Hunter recruited by Kurapika and placed in Momoze’s household before later reassignment.'),
    actor('Tuffdy', 'hostile', 'Embedded murderer', 'Member of Momoze’s reduced guard detail who murdered her; shown as infiltration, not loyal protection.'),
  ]],
  [13, [
    actor('Biscuit Krueger', 'kurapika-placement', 'Kurapika-recruited Hunter', 'Hunter recruited by Kurapika and placed in Marayam’s household.'),
    actor('Hanzo', 'ally', 'Reassigned protector', 'Kurapika-recruited Hunter transferred into Marayam’s protection network after Momoze’s death.'),
  ]],
  [14, [
    actor('Babimyna', 'observer', 'Benjamin observer', 'Benjamin soldier stationed in Room 1014 as an observer after Vincent’s failed attack.'),
    actor('Slakka', 'observer', 'Duazul surveillance', 'Duazul-linked guard reassigned into Room 1014 with mixed protection and reporting interests.'),
    actor('Sakata', 'ally', 'Zhang Lei reinforcement', 'Guard sent by Zhang Lei’s camp to reinforce Woble under the lower-prince alliance.'),
    actor('Hashito', 'ally', 'Zhang Lei reinforcement', 'Guard sent by Zhang Lei’s camp to reinforce Woble under the lower-prince alliance.'),
  ]],
]);

const complementGroupsFor = (room) => {
  if (!room) return [];
  const records = [];
  const seen = new Set();
  const sourceText = normalizeLabel(room.original);
  let match;
  complementPattern.lastIndex = 0;
  while ((match = complementPattern.exec(sourceText))) {
    const count = countFrom(match[1]);
    const label = normalizeLabel(match[2]);
    const key = `${count}:${label.toLowerCase()}`;
    if (!count || seen.has(key)) continue;
    seen.add(key);
    records.push({
      id: `complement-${room.order}-${key.replace(/[^a-z0-9]+/g, '-')}`,
      name: `${count} ${label}`,
      count,
      kind: /spies?/i.test(label) ? 'spy' : 'complement',
      eyebrow: /spies?/i.test(label) ? 'Royal surveillance group' : 'Documented complement',
      description: `${room.prince}'s original room record lists ${count} ${label}. Named members are shown separately; this node preserves the full documented complement where individual names are not all available.`,
    });
  }
  return records;
};

export function getProtectionNetworkSeed(prince) {
  const room = roomByPrince.get(prince.order) || null;
  const dedicatedGroupId = dedicatedRosterGroupByPrince.get(prince.order) || null;
  const dedicatedGroup = dedicatedGroupId ? rosterGroupById.get(dedicatedGroupId) : null;

  return {
    room,
    dedicatedGroupId,
    dedicatedNames: dedicatedGroup?.members.map((member) => member.name) || [],
    teamNames: prince.team || [],
    categorizedActors: categorizedActorsByPrince.get(prince.order) || [],
    complementGroups: dedicatedGroup ? [] : complementGroupsFor(room),
  };
}