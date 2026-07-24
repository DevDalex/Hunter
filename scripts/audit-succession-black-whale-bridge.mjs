import { readFile } from 'node:fs/promises';
import { createServer } from 'vite';

const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession Black Whale bridge audit failed: ${message}`);
};

const [guide, app] = await Promise.all([
  readFile(new URL('../src/components/BlackWhaleGuide.jsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/components/succession/SuccessionArchiveApp.jsx', import.meta.url), 'utf8'),
]);

assert(guide.includes('getBlackWhaleCanonicalBridge'), 'visual atlas must resolve canonical bridge records');
assert(guide.includes('getLocationSnapshot'), 'visual atlas must read chapter-specific canonical snapshots');
assert(guide.includes('Open Chapter {spoilerLimit} snapshot'), 'hotspot inspector must open the selected canonical snapshot');
assert(guide.includes('Chapter {spoilerLimit} snapshot'), 'room cards must open canonical chapter snapshots');
assert(guide.includes('initialLocationId'), 'canonical locations must be able to focus the visual atlas');
assert(app.includes('initialLocationId={routeParams.entity ||'), 'archive route must pass canonical location IDs into the atlas');
assert(app.includes("onOpenCanonicalLocation={(params) => onNavigate('locations', params)}"), 'atlas selections must route into the canonical location workspace');

const vite = await createServer({
  appType: 'custom',
  logLevel: 'error',
  server: { middlewareMode: true },
});

try {
  const [bridgeModule, archiveModule, blackWhaleModule] = await Promise.all([
    vite.ssrLoadModule('/src/data/succession/blackWhaleCanonicalMap.js'),
    vite.ssrLoadModule('/src/data/succession/successionData.js'),
    vite.ssrLoadModule('/src/data/blackWhale.js'),
  ]);

  const {
    blackWhaleCanonicalBridgeStats,
    blackWhaleCanonicalHotspotMap,
    blackWhaleCanonicalRoomMap,
    getBlackWhaleCanonicalBridge,
    getBlackWhaleRoyalRoomBridge,
  } = bridgeModule;
  const { getEntityById, getLocationSnapshot } = archiveModule;
  const { blackWhaleHotspots, blackWhaleRooms } = blackWhaleModule;

  assert(blackWhaleCanonicalBridgeStats.hotspots === blackWhaleHotspots.length, `all ${blackWhaleHotspots.length} hotspots must have explicit bridge records`);
  assert(blackWhaleCanonicalBridgeStats.rooms >= 40, 'the visual room directory must retain broad canonical bridge coverage');
  assert(Object.keys(blackWhaleCanonicalHotspotMap).length === blackWhaleHotspots.length, 'hotspot bridge map must not omit visual markers');
  assert(Object.keys(blackWhaleCanonicalRoomMap).length <= blackWhaleRooms.length, 'room bridge map cannot exceed the visual room directory');

  for (const hotspot of blackWhaleHotspots) {
    const record = getBlackWhaleCanonicalBridge({ hotspotId: hotspot.id, roomName: hotspot.roomName, tier: hotspot.tier });
    assert(record?.locationId, `${hotspot.id} must resolve a canonical location ID`);
    const location = getEntityById(record.locationId);
    assert(location?.entityType === 'location', `${hotspot.id} bridge must resolve an existing location entity`);
    assert(getLocationSnapshot(location.id, 414)?.location?.id === location.id, `${hotspot.id} bridge must produce a Chapter 414 snapshot`);
  }

  for (let roomNumber = 1001; roomNumber <= 1014; roomNumber += 1) {
    const record = getBlackWhaleRoyalRoomBridge(roomNumber);
    const location = getEntityById(record?.locationId);
    assert(location?.entityType === 'location', `Room ${roomNumber} must resolve its canonical royal-room entity`);
  }

  assert(blackWhaleCanonicalHotspotMap.justice.precision === 'legacy-id', 'Justice hierarchy inconsistency must remain explicit rather than silently rewritten');
  assert(blackWhaleCanonicalHotspotMap['xi-yu'].precision === 'aggregate', 'Xi-Yu hierarchy conflict must remain attached to Tier 4 until reconciled');

  console.log(`Succession Black Whale bridge audit passed: ${blackWhaleHotspots.length} hotspots, ${Object.keys(blackWhaleCanonicalRoomMap).length} room bridges, fourteen royal-room IDs, and chapter snapshots are connected.`);
} finally {
  await vite.close();
}
