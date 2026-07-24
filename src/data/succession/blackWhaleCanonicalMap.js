const shipId = 'location:black-whale';
const tierId = (number) => `${shipId}:tier-${number}`;
const roomId = (number) => `${tierId(1)}:room-${1000 + Number(number)}`;

const bridge = (locationId, precision = 'exact', note = '') => Object.freeze({
  locationId,
  precision,
  note,
});

const tierBridge = (number, note = 'The visual record is broader than a single canonical room, so it opens the containing tier.') => bridge(tierId(number), 'aggregate', note);

export const blackWhaleCanonicalHotspotMap = Object.freeze({
  'tier-1': bridge(tierId(1)),
  'king-gate': bridge(`${tierId(1)}:nasubi-quarters`, 'approximate', 'The marker covers Nasubi’s secured residence and gate rather than an independently surveyed floor-plan point.'),
  banquet: bridge(`${tierId(1)}:banquet-hall`),
  lifeboat: bridge(`${shipId}:lifeboat-area`),
  casino: bridge(`${tierId(1)}:casino`),
  'prince-ring': tierBridge(1, 'The atlas marker represents the entire royal residence ring; individual rooms open through the fourteen-room plan.'),
  'tier-2': bridge(tierId(2)),
  justice: bridge(`${tierId(1)}:justice-bureau`, 'legacy-id', 'The maintained canonical Justice record predates the atlas migration and retains its stable ID while hierarchy reconciliation remains queued.'),
  theatre: tierBridge(2),
  bulkhead: tierBridge(2, 'The security boundary is not yet published as an independent canonical location.'),
  'heil-ly': bridge(`${tierId(3)}:heil-ly-hideout`, 'approximate', 'The hidden band is represented by the canonical Heil-Ly hideout record because its exact physical coordinates remain unresolved.'),
  'tier-3': bridge(tierId(3)),
  'room-3101': bridge(`${tierId(3)}:room-3101`),
  hospital: tierBridge(3, 'The hospital is currently represented by its containing civic tier until a dedicated medical-facility entity is published.'),
  cineplex: tierBridge(3, 'The cineplex is currently represented by its containing civic tier.'),
  'tier-4': bridge(tierId(4)),
  'xi-yu': tierBridge(4, 'The visual Xi-Yu office remains attached to Tier 4 while the earlier canonical office record is reviewed for hierarchy consistency.'),
  'army-conference': tierBridge(4),
  sewage: bridge(shipId, 'aggregate', 'The service band remains a shipwide infrastructure record until a dedicated canonical facility is published.'),
  'tier-5': bridge(tierId(5)),
  warehouse: tierBridge(5),
  assembly: tierBridge(5),
  dining: bridge(`${tierId(5)}:dining-area`),
  'cha-r': tierBridge(5),
});

export const blackWhaleCanonicalRoomMap = Object.freeze({
  'King’s Living Quarters': bridge(`${tierId(1)}:nasubi-quarters`),
  'Princes’ Living Quarters': tierBridge(1),
  'Banquet / Ceremony Hall': bridge(`${tierId(1)}:banquet-hall`),
  'Princes’ Burial Chamber': bridge(`${tierId(1)}:burial-chamber`),
  'Lifeboat Launch Site': bridge(`${shipId}:lifeboat-area`),
  'Lifeboat Interior & Control': bridge(`${shipId}:lifeboat-area`, 'aggregate'),
  'VVIP Casino': bridge(`${tierId(1)}:casino`),
  'King’s Quarters Gate': bridge(`${tierId(1)}:nasubi-quarters`, 'approximate'),
  'Banquet Hall Passage': bridge(`${tierId(1)}:royal-corridor`, 'approximate'),
  'Camilla’s First-Class Cell': bridge(`${tierId(1)}:justice-bureau:detention-wing`, 'approximate'),
  'Standard Cells': bridge(`${tierId(1)}:justice-bureau:detention-wing`, 'aggregate'),
  'Standard-Cell Corridor': bridge(`${tierId(1)}:justice-bureau:detention-wing`, 'aggregate'),
  'Theater Venue': tierBridge(2),
  'Justice Bureau': bridge(`${tierId(1)}:justice-bureau`, 'legacy-id'),
  'Justice Bureau Witness-Protection Area': bridge(`${tierId(1)}:justice-bureau`, 'aggregate'),
  'Justice Bureau Interview & Visitation Floors': bridge(`${tierId(1)}:justice-bureau`, 'aggregate'),
  'Tier 2–3 Bulkhead': tierBridge(2),
  'Heil-Ly Secret Hideout': bridge(`${tierId(3)}:heil-ly-hideout`, 'approximate'),
  'Shower / Rooms A and B': bridge(`${tierId(3)}:heil-ly-hideout`, 'aggregate'),
  'Processing & Disposal Rooms': bridge(`${tierId(3)}:heil-ly-hideout`, 'aggregate'),
  'Morena’s Office & Communal Area': bridge(`${tierId(3)}:heil-ly-hideout`, 'aggregate'),
  'Heil-Ly Laundry & Dormitory': bridge(`${tierId(3)}:heil-ly-hideout`, 'aggregate'),
  'Heil-Ly Kitchen & Meeting Space': bridge(`${tierId(3)}:heil-ly-hideout`, 'aggregate'),
  'First-Class & Standard Cabins': tierBridge(3),
  'Central Courthouse': tierBridge(3),
  'Central Police Station': tierBridge(3),
  'Community Safety Section': tierBridge(3),
  'Royal Army Office': tierBridge(3),
  'Medical Ward & Central Clinic': tierBridge(3),
  'Observation Deck': tierBridge(3),
  'Heil-Ly Family Office': tierBridge(3),
  'Movie Theatre': tierBridge(3),
  'Rooms 3101 & 3131': bridge(`${tierId(3)}:room-3101`, 'aggregate', 'Room 3101 has a canonical record; Room 3131 remains grouped with it in the visual directory.'),
  'First-Class Cabin Corridor': bridge(`${tierId(3)}:public-corridor`, 'approximate'),
  'Cineplex Lobby & Screen 8': tierBridge(3),
  'Kakin Royal Army Conference Room': tierBridge(4),
  'Xi-Yu Family Office': tierBridge(4),
  'Sewage Processing Facility': bridge(shipId, 'aggregate'),
  'Standard Passenger Cabins': tierBridge(5),
  '37564 Assembly Point': tierBridge(5),
  'Central Dining Hall': bridge(`${tierId(5)}:dining-area`),
  Warehouse: tierBridge(5),
  'Cha-R Family Office': tierBridge(5),
});

export const getBlackWhaleCanonicalBridge = ({ hotspotId = '', roomName = '', tier = '' } = {}) => {
  if (hotspotId && blackWhaleCanonicalHotspotMap[hotspotId]) return blackWhaleCanonicalHotspotMap[hotspotId];
  if (roomName && blackWhaleCanonicalRoomMap[roomName]) return blackWhaleCanonicalRoomMap[roomName];
  const tierNumber = String(tier).match(/tier-(\d)/)?.[1];
  return tierNumber ? bridge(tierId(tierNumber), 'aggregate') : bridge(shipId, 'aggregate');
};

export const getBlackWhaleRoyalRoomBridge = (roomNumber) => {
  const parsed = Number(String(roomNumber).replace(/\D/g, ''));
  if (!Number.isInteger(parsed) || parsed < 1001 || parsed > 1014) return null;
  return bridge(roomId(parsed - 1000));
};

export const findBlackWhaleHotspotForCanonicalLocation = (locationId) => Object.entries(blackWhaleCanonicalHotspotMap)
  .find(([, record]) => record.locationId === locationId)?.[0] || null;

export const blackWhaleCanonicalBridgeStats = Object.freeze({
  hotspots: Object.keys(blackWhaleCanonicalHotspotMap).length,
  rooms: Object.keys(blackWhaleCanonicalRoomMap).length,
  exactHotspots: Object.values(blackWhaleCanonicalHotspotMap).filter((record) => record.precision === 'exact').length,
});
