import { useMemo, useState } from 'react';
import { Crown, Link2, Shield, Users } from 'lucide-react';
import { princeDossiers } from '../../data/successionDossier';
import { biologicalRoyalFamilyTree, legalRoyalFamilyTree } from '../../data/successionRoster';
import { getOrganizationMembers } from '../../data/succession/successionData';
import { entityWorkspaceTarget } from './SuccessionArchivePrimitives';
import {
  abilityLabelFor,
  beastForHost,
  buildProtectionNodes,
  cleanBranchName,
  dossierByOrder,
  dossierByShort,
  entityForName,
  mafiaConnections,
  normalizeLookup,
  organizationForName,
  personSummary,
  queenDossierByShort,
  statusLabel,
} from './RoyalFamilyBoardModel';
import {
  ForceRail,
  KingMapNode,
  MapInspector,
  PrinceMapNode,
  QueenMapNode,
} from './RoyalFamilyBoardNodes';
import './RoyalFamilyGuardTree.css';
import './RoyalFamilyGuardTreeFixes.css';
import './RoyalFamilyBoardInteractionFixes.css';

const MAP_WIDTH = 1660;
const MAP_HEIGHT = 1050;
const PRINCE_WIDTH = 350;
const PRINCE_HEIGHT = 154;
const QUEEN_WIDTH = 58;
const QUEEN_HEIGHT = 62;

const PRINCE_LAYOUT = Object.freeze({
  1: { x: 300, y: 155 }, 2: { x: 300, y: 335 }, 5: { x: 300, y: 515 }, 9: { x: 300, y: 695 }, 12: { x: 300, y: 875 },
  3: { x: 725, y: 155 }, 4: { x: 725, y: 335 }, 7: { x: 725, y: 515 }, 10: { x: 725, y: 695 }, 13: { x: 725, y: 875 },
  6: { x: 1150, y: 155 }, 8: { x: 1150, y: 335 }, 11: { x: 1150, y: 515 }, 14: { x: 1150, y: 695 },
});

const QUEEN_LAYOUT = Object.freeze({
  Unma: { x: 240, y: 225 },
  Duazul: { x: 240, y: 520 },
  'Tang Zhao Li': { x: 658, y: 180 },
  Katrono: { x: 1083, y: 180 },
  'Swinko-swinko': { x: 1575, y: 360 },
  Seiko: { x: 1083, y: 620 },
  Sevanti: { x: 658, y: 900 },
  Oito: { x: 1575, y: 730 },
});

const FORCE_LAYOUT = Object.freeze({
  allies: { x: 20, y: 74 },
  'xi-yu': { x: 20, y: 210 },
  'heil-ly': { x: 20, y: 346 },
  'cha-r': { x: 20, y: 482 },
});

const recordKey = (record) => record?.key || '';
const sameRecord = (a, b) => recordKey(a) === recordKey(b);
const princeAnchor = (order) => ({
  x: PRINCE_LAYOUT[order].x + PRINCE_WIDTH / 2,
  y: PRINCE_LAYOUT[order].y + PRINCE_HEIGHT / 2,
});

const personRecord = ({ key, kind, name, entity, eyebrow, summary, ability, beast, facts = [], princeOrder = null, linkedOrders = [], openTarget = null }) => ({
  key, kind, name, entity, eyebrow, summary, ability, beast, facts, princeOrder, linkedOrders, openTarget,
});

const buildForceGroups = () => {
  const alliedNames = ['Kurapika', 'Bill', 'Biscuit Krueger', 'Melody'];
  const allies = {
    key: 'allies',
    label: 'Allied placements',
    relation: 'Hunters and allied specialists placed across lower-prince households.',
    linkedOrders: [5, 11, 13, 14],
    members: alliedNames.map((name) => ({ name, entity: entityForName(name) })).filter(({ entity }) => entity),
  };

  const mafia = mafiaConnections.map((connection) => {
    const organization = organizationForName(connection.name);
    const leader = entityForName(connection.leader);
    const excluded = new Set([normalizeLookup(connection.leader), normalizeLookup(dossierByOrder.get(connection.princeOrder)?.name)]);
    const members = organization
      ? getOrganizationMembers(organization.id)
        .map(({ character }) => character)
        .filter((character) => character && !excluded.has(normalizeLookup(character.name)))
        .slice(0, 4)
        .map((entity) => ({ name: entity.name, entity }))
      : [];
    return {
      key: connection.key,
      label: connection.name,
      leader: connection.leader,
      leaderEntity: leader,
      organization,
      relation: connection.relation,
      linkedOrders: [connection.princeOrder],
      members,
    };
  });

  return [allies, ...mafia];
};

function orthogonalPath(source, target, bendX = null) {
  const middleX = bendX ?? Math.round((source.x + target.x) / 2);
  return `M ${source.x} ${source.y} H ${middleX} V ${target.y} H ${target.x}`;
}

function RoyalMapConnectors({ branches, forceGroups, activePrinceOrders, activeForceKey }) {
  const kingSource = { x: MAP_WIDTH / 2, y: 126 };
  return <svg className="royal-map__connectors" viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} fill="none" aria-hidden="true">
    <g className="royal-map__royal-lines">
      {princeDossiers.map((prince) => {
        const target = { x: princeAnchor(prince.order).x, y: PRINCE_LAYOUT[prince.order].y };
        return <path
          key={`royal-${prince.order}`}
          className={activePrinceOrders.has(prince.order) ? 'is-active' : ''}
          d={`M ${kingSource.x} ${kingSource.y} V 142 H ${target.x} V ${target.y}`}
        />;
      })}
    </g>

    <g className="royal-map__maternal-lines">
      {branches.flatMap((branch) => {
        const queenPosition = QUEEN_LAYOUT[branch.short];
        if (!queenPosition) return [];
        const source = { x: queenPosition.x + QUEEN_WIDTH / 2, y: queenPosition.y + QUEEN_HEIGHT / 2 };
        return branch.princes.map((prince) => {
          const layout = PRINCE_LAYOUT[prince.order];
          const target = queenPosition.x < layout.x
            ? { x: layout.x, y: layout.y + 38 }
            : { x: layout.x + PRINCE_WIDTH, y: layout.y + 38 };
          return <path
            key={`maternal-${branch.short}-${prince.order}`}
            className={activePrinceOrders.has(prince.order) ? 'is-active' : ''}
            d={orthogonalPath(source, target)}
          />;
        });
      })}
    </g>

    <g className="royal-map__force-lines">
      {forceGroups.flatMap((group) => {
        const position = FORCE_LAYOUT[group.key];
        if (!position) return [];
        const source = { x: 236, y: position.y + 54 };
        return group.linkedOrders.map((order) => {
          const target = { x: PRINCE_LAYOUT[order].x, y: PRINCE_LAYOUT[order].y + 112 };
          return <path
            key={`force-${group.key}-${order}`}
            className={`is-${group.key}${activeForceKey === group.key || activePrinceOrders.has(order) ? ' is-active' : ''}`}
            d={orthogonalPath(source, target, 270 + (order % 3) * 12)}
          />;
        });
      })}
    </g>
  </svg>;
}

export default function RoyalFamilyGuardTree({ onNavigate, spoilerLimit = Number.MAX_SAFE_INTEGER, initialPrince = 14 }) {
  const royalTree = spoilerLimit >= 401 ? biologicalRoyalFamilyTree : legalRoyalFamilyTree;
  const initialOrder = PRINCE_LAYOUT[initialPrince] ? initialPrince : 14;
  const [selectedOrder, setSelectedOrder] = useState(initialOrder);
  const [hoveredRecord, setHoveredRecord] = useState(null);
  const [pinnedRecord, setPinnedRecord] = useState(null);

  const protectionByPrince = useMemo(() => new Map(princeDossiers.map((prince) => [prince.order, buildProtectionNodes(prince)])), []);
  const forceGroups = useMemo(buildForceGroups, []);

  const princeRecords = useMemo(() => new Map(princeDossiers.map((prince) => {
    const entity = entityForName(prince.name);
    const beast = beastForHost(prince.short);
    const guards = protectionByPrince.get(prince.order) || [];
    const direct = guards.filter((guard) => guard.kind === 'protection' && !guard.isGroup).length;
    const placed = guards.filter((guard) => ['kurapika-placement', 'ally'].includes(guard.kind)).length;
    const intelligence = guards.filter((guard) => ['observer', 'spy', 'hostile'].includes(guard.kind)).length;
    return [prince.order, personRecord({
      key: `prince:${prince.order}`,
      kind: 'prince',
      name: prince.name,
      entity,
      eyebrow: `${prince.order}${prince.order === 1 ? 'st' : prince.order === 2 ? 'nd' : prince.order === 3 ? 'rd' : 'th'} Prince · ${statusLabel(prince.status)}`,
      summary: prince.strategy,
      ability: prince.nen,
      beast: beast?.ability || prince.beast,
      facts: [
        ['Mother', `Queen ${prince.mother}`],
        ['Room', prince.room],
        ['Bodyguards', String(guards.length)],
        ['Direct / placed / intel', `${direct} / ${placed} / ${intelligence}`],
      ],
      princeOrder: prince.order,
      linkedOrders: [prince.order],
      openTarget: { type: 'prince', order: prince.order },
    })];
  })), [protectionByPrince]);

  const branches = useMemo(() => royalTree.map((branch, index) => {
    const short = branch.queen.replace(' Hui Guo Rou', '');
    const entity = entityForName(branch.queen);
    const dossier = queenDossierByShort.get(short);
    const princes = branch.children.map((child) => dossierByShort.get(cleanBranchName(child))).filter(Boolean);
    return {
      ...branch,
      short,
      princes,
      record: personRecord({
        key: `queen:${index + 1}`,
        kind: 'queen',
        name: branch.queen,
        entity,
        eyebrow: branch.order,
        summary: dossier?.role || branch.note || 'Kakin maternal household branch.',
        ability: abilityLabelFor(entity),
        facts: [['Children', princes.map((prince) => prince.short).join(', ')], ['Branch', branch.note || 'Royal household']],
        princeOrder: princes[0]?.order || null,
        linkedOrders: princes.map((prince) => prince.order),
        openTarget: entity ? { type: 'entity', entity } : null,
      }),
    };
  }), [royalTree]);

  const kingEntity = entityForName('Nasubi Hui Guo Rou');
  const kingBeast = beastForHost('Nasubi');
  const kingRecord = personRecord({
    key: 'king:nasubi',
    kind: 'king',
    name: 'Nasubi Hui Guo Rou',
    entity: kingEntity,
    eyebrow: 'King of Kakin',
    summary: personSummary(kingEntity, 'The reigning Kakin king and sponsor of the current succession ritual.'),
    ability: abilityLabelFor(kingEntity),
    beast: kingBeast?.ability,
    facts: [['Role', 'Father of the fourteen legitimate princes'], ['Contest', 'Previous-generation survivor']],
    linkedOrders: princeDossiers.map((prince) => prince.order),
    openTarget: kingEntity ? { type: 'entity', entity: kingEntity } : null,
  });

  const forceRecords = useMemo(() => new Map(forceGroups.map((group) => {
    const linked = group.linkedOrders.map((order) => princeRecords.get(order)?.name).filter(Boolean).join(', ');
    const entity = group.organization || group.leaderEntity || group.members[0]?.entity || null;
    return [group.key, personRecord({
      key: `force:${group.key}`,
      kind: group.key === 'allies' ? 'alliance' : 'mafia',
      name: group.label,
      entity,
      eyebrow: group.key === 'allies' ? 'Outside force' : 'Mafia / external tie',
      summary: group.relation,
      ability: group.leaderEntity ? abilityLabelFor(group.leaderEntity) : 'Mixed documented abilities',
      facts: [['Linked princes', linked], ['Members shown', String(group.members.length)]],
      princeOrder: group.linkedOrders[0] || null,
      linkedOrders: group.linkedOrders,
      openTarget: group.organization ? { type: 'entity', entity: group.organization } : null,
    })];
  })), [forceGroups, princeRecords]);

  const activeRecord = hoveredRecord || pinnedRecord;
  const activeKey = recordKey(activeRecord);
  const activePrinceOrders = new Set(activeRecord?.linkedOrders?.length ? activeRecord.linkedOrders : [selectedOrder]);
  const activeForceKey = activeRecord?.kind === 'mafia' || activeRecord?.kind === 'alliance'
    ? activeRecord.key.replace('force:', '')
    : null;

  const preview = (record) => setHoveredRecord(record);
  const clearPreview = () => setHoveredRecord(null);
  const pin = (record) => {
    if (['prince', 'guard', 'force-member'].includes(record.kind) && record.princeOrder) setSelectedOrder(record.princeOrder);
    setPinnedRecord((current) => sameRecord(current, record) ? null : record);
  };
  const openRecord = (record) => {
    if (record?.openTarget?.type === 'prince') {
      onNavigate?.('princes', { prince: record.openTarget.order });
      return;
    }
    if (record?.openTarget?.entity) {
      const entity = record.openTarget.entity;
      onNavigate?.(entityWorkspaceTarget(entity), { entity: entity.id });
    }
  };

  const guardRecordFor = (guard, prince) => personRecord({
    key: `guard:${prince.order}:${guard.id}`,
    kind: 'guard',
    name: guard.name,
    entity: guard.entity,
    eyebrow: guard.eyebrow,
    summary: guard.description,
    ability: abilityLabelFor(guard.entity),
    facts: [['Assigned to', prince.name], ['Category', guard.kind], ['Record', guard.isGroup ? 'Group-level complement' : 'Named person']],
    princeOrder: prince.order,
    linkedOrders: [prince.order],
    openTarget: guard.entity ? { type: 'entity', entity: guard.entity } : null,
  });

  const forceMemberRecordFor = (member, group) => personRecord({
    key: `force-member:${group.key}:${member.entity?.id || normalizeLookup(member.name)}`,
    kind: 'force-member',
    name: member.name,
    entity: member.entity,
    eyebrow: group.label,
    summary: personSummary(member.entity, `Documented member of ${group.label}.`),
    ability: abilityLabelFor(member.entity),
    facts: [['Linked princes', group.linkedOrders.join(', ')], ['Relationship', group.relation]],
    princeOrder: group.linkedOrders[0] || null,
    linkedOrders: group.linkedOrders,
    openTarget: member.entity ? { type: 'entity', entity: member.entity } : null,
  });

  return <section
    className="royal-map"
    aria-labelledby="royal-map-title"
    onKeyDown={(event) => {
      if (event.key === 'Escape') {
        setPinnedRecord(null);
        setHoveredRecord(null);
      }
    }}
  >
    <header className="royal-map__toolbar">
      <div>
        <span><Crown size={14} aria-hidden="true" /> Royal relationship map</span>
        <h2 id="royal-map-title">Kakin Royal Family</h2>
        <p>King · queens · fourteen princes · Guardian Spirit Beasts · complete protection circles · mafia ties · Chapter {spoilerLimit}</p>
      </div>
      <div className="royal-map__legend" aria-label="Relationship legend">
        <span><i className="is-royal" /> Royal line</span>
        <span><i className="is-maternal" /> Maternal branch</span>
        <span><i className="is-protection" /> Protection / ally</span>
        <span><i className="is-mafia" /> Mafia / external tie</span>
      </div>
    </header>

    <div className="royal-map__viewport" tabIndex="0" aria-label="Scrollable Kakin royal relationship map">
      <div className="royal-map__canvas" style={{ width: MAP_WIDTH, height: MAP_HEIGHT }}>
        <RoyalMapConnectors
          branches={branches}
          forceGroups={forceGroups}
          activePrinceOrders={activePrinceOrders}
          activeForceKey={activeForceKey}
        />

        <ForceRail
          groups={forceGroups}
          forceRecords={forceRecords}
          activeKey={activeKey}
          pinnedKey={recordKey(pinnedRecord)}
          onPreview={preview}
          onClear={clearPreview}
          onPin={pin}
          memberRecordFor={forceMemberRecordFor}
          layout={FORCE_LAYOUT}
        />

        <KingMapNode
          record={kingRecord}
          beast={kingBeast}
          active={activeKey === kingRecord.key}
          pinned={recordKey(pinnedRecord) === kingRecord.key}
          onPreview={preview}
          onClear={clearPreview}
          onPin={pin}
        />

        {branches.map((branch) => <QueenMapNode
          key={branch.short}
          branch={branch}
          position={QUEEN_LAYOUT[branch.short]}
          active={activeKey === branch.record.key || branch.princes.some((prince) => activePrinceOrders.has(prince.order))}
          pinned={recordKey(pinnedRecord) === branch.record.key}
          onPreview={preview}
          onClear={clearPreview}
          onPin={pin}
        />)}

        {princeDossiers.map((prince) => <PrinceMapNode
          key={prince.order}
          prince={prince}
          record={princeRecords.get(prince.order)}
          guards={protectionByPrince.get(prince.order) || []}
          position={PRINCE_LAYOUT[prince.order]}
          selected={selectedOrder === prince.order}
          active={activePrinceOrders.has(prince.order)}
          activeKey={activeKey}
          pinnedKey={recordKey(pinnedRecord)}
          onPreview={preview}
          onClear={clearPreview}
          onPin={pin}
          guardRecordFor={guardRecordFor}
        />)}
      </div>
    </div>

    <MapInspector
      record={activeRecord}
      pinned={sameRecord(pinnedRecord, activeRecord)}
      onOpen={openRecord}
      onUnpin={() => setPinnedRecord(null)}
    />

    <footer className="royal-map__footer">
      <Shield size={14} aria-hidden="true" />
      <span>Every documented guard is shown. Hover or focus a portrait to inspect essentials. Click or tap to pin. Press Escape to clear.</span>
      <Users size={14} aria-hidden="true" />
      <Link2 size={14} aria-hidden="true" />
    </footer>
  </section>;
}
