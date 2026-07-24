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
      kind: 'complement',
      eyebrow: 'Documented complement',
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
    roomText: [room?.original, room?.deployed, room?.current].filter(Boolean).join(' '),
    dedicatedGroupId,
    dedicatedNames: dedicatedGroup?.members.map((member) => member.name) || [],
    teamNames: prince.team || [],
    complementGroups: dedicatedGroup ? [] : complementGroupsFor(room),
  };
}
