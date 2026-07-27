import { useMemo, useState } from 'react';
import { Building2, Crown, Shield, Sparkles, Users } from 'lucide-react';
import { princeDossiers } from '../../data/successionDossier';
import { biologicalRoyalFamilyTree, legalRoyalFamilyTree } from '../../data/successionRoster';
import { entityWorkspaceTarget } from './SuccessionArchivePrimitives';
import {
  abilityLabelFor, beastForHost, buildProtectionNodes, cleanBranchName, dossierByOrder, dossierByShort, entityForName,
  mafiaConnections, personSummary, queenDossierByShort,
} from './RoyalFamilyBoardModel';
import { BeastLayer, HoverCard, MafiaCard, Portrait, PrinceDossier, tooltipIdFor } from './RoyalFamilyBoardNodes';
import './RoyalFamilyGuardTree.css';
import './RoyalFamilyGuardTreeFixes.css';
import './RoyalFamilyBoardInteractionFixes.css';

const branchColumnIndexes = Object.freeze([[0, 2, 7], [1, 3, 4], [5, 6]]);

export default function RoyalFamilyGuardTree({ onNavigate, spoilerLimit = Number.MAX_SAFE_INTEGER, initialPrince = 14 }) {
  const royalTree = spoilerLimit >= 401 ? biologicalRoyalFamilyTree : legalRoyalFamilyTree;
  const initialDossier = princeDossiers.find((prince) => prince.order === initialPrince) || princeDossiers.at(-1);
  const [selectedOrder, setSelectedOrder] = useState(initialDossier.order);
  const [lockedKey, setLockedKey] = useState(null);
  const [activePrinceOrder, setActivePrinceOrder] = useState(null);
  const [activeMafiaKey, setActiveMafiaKey] = useState(null);
  const kingEntity = entityForName('Nasubi Hui Guo Rou');
  const kingBeast = beastForHost('Nasubi');
  const kingKey = 'king:nasubi';
  const kingTooltipId = tooltipIdFor(kingKey);
  const protectionByPrince = useMemo(() => new Map(princeDossiers.map((prince) => [prince.order, buildProtectionNodes(prince)])), []);
  const selectedBranchIndex = royalTree.findIndex((branch) => branch.children.some((child) => dossierByShort.get(cleanBranchName(child))?.order === selectedOrder));
  const selectedPrince = dossierByOrder.get(selectedOrder);
  const lockedMafiaConnection = mafiaConnections.find((connection) => (
    lockedKey === `mafia:${connection.key}` || lockedKey?.startsWith(`mafia-member:${connection.key}:`)
  ));
  const highlightedMafiaKey = activeMafiaKey || lockedMafiaConnection?.key || null;

  const openEntity = (entity) => {
    if (!entity) return;
    onNavigate?.(entityWorkspaceTarget(entity), { entity: entity.id });
  };

  const openPrince = (prince) => onNavigate?.('princes', { prince: prince.order });
  const toggleLock = (key) => setLockedKey((current) => current === key ? null : key);

  return <section className="royal-guard-tree royal-dossier-board" aria-labelledby="royal-guard-tree-title">
    <header className="royal-board__mast">
      <div>
        <span><Crown size={14} aria-hidden="true" /> Royal relationship board</span>
        <h2 id="royal-guard-tree-title">Kakin Royal Family</h2>
        <p>King · queens · princes · Guardian Spirit Beasts · protection circles · mafia links · Chapter {spoilerLimit}</p>
      </div>
      <div className="royal-board__legend" aria-label="Relationship legend">
        <span><i className="is-royal" /> Royal household</span>
        <span><i className="is-guard" /> Direct protection</span>
        <span><i className="is-placement" /> Placement / ally</span>
        <span><i className="is-intel" /> Observer / spy</span>
        <span><i className="is-mafia" /> Mafia connection</span>
        <span><i className="is-dead" /> Dead / removed</span>
      </div>
    </header>

    <div className="royal-board__canvas">
      <aside className="royal-board__mafia-rail" aria-labelledby="royal-board-mafia-title">
        <header><Building2 size={16} aria-hidden="true" /><span>External power</span><h3 id="royal-board-mafia-title">Mafia links</h3></header>
        {mafiaConnections.map((connection) => <MafiaCard
          key={connection.key}
          connection={connection}
          lockedKey={lockedKey}
          setLockedKey={setLockedKey}
          activeMafiaKey={highlightedMafiaKey}
          setActiveMafiaKey={setActiveMafiaKey}
          activePrinceOrder={activePrinceOrder}
          setActivePrinceOrder={setActivePrinceOrder}
          openEntity={openEntity}
        />)}
        <p>Hover a mafia family or member to isolate its royal connection.</p>
      </aside>

      <div className="royal-board__main">
        <div className="royal-board__topline">
          <button
            type="button"
            className={`royal-board__king${lockedKey === kingKey ? ' is-locked' : ''}`}
            aria-label="Nasubi Hui Guo Rou, King of Kakin"
            aria-pressed={lockedKey === kingKey}
            aria-describedby={kingTooltipId}
            onClick={() => toggleLock(kingKey)}
          >
            <BeastLayer beast={kingBeast} />
            <span className="royal-board__king-label">King of Kakin</span>
            <Portrait name="Nasubi Hui Guo Rou" entity={kingEntity} compact eager />
            <span className="royal-board__king-copy"><strong>Nasubi Hui Guo Rou</strong><small>Royal root · previous contest survivor</small></span>
            <HoverCard id={kingTooltipId} eyebrow="King of Kakin" name="Nasubi Hui Guo Rou" description={personSummary(kingEntity, 'The reigning Kakin king and sponsor of the current succession ritual.')} facts={[["Guardian beast", kingBeast?.ability], ["Beast status", kingBeast?.knowledge], ["Nen / ability", abilityLabelFor(kingEntity)], ["Role", 'Father of the fourteen legitimate princes']]} meta="Click to pin this preview" />
          </button>
          <div className="royal-board__instruction"><Sparkles size={14} aria-hidden="true" /><span>Hover or focus any portrait for essentials. Click to pin a preview.</span></div>
        </div>

        <div className="royal-board__branch-grid" aria-label="Eight maternal household dossiers">
          {branchColumnIndexes.map((branchIndexes, columnIndex) => <div className="royal-board__branch-column" key={`royal-column-${columnIndex + 1}`}>
            {branchIndexes.map((branchIndex) => {
              const branch = royalTree[branchIndex];
              if (!branch) return null;
              const queenShort = branch.queen.replace(' Hui Guo Rou', '');
              const queenEntity = entityForName(branch.queen);
              const queen = queenDossierByShort.get(queenShort);
              const active = selectedBranchIndex === branchIndex;
              const queenKey = `queen:${branchIndex + 1}`;
              const queenTooltipId = tooltipIdFor(queenKey);
              const locked = lockedKey === queenKey;
              const princes = branch.children.map((child) => dossierByShort.get(cleanBranchName(child))).filter(Boolean);
              return <section className={`royal-board__branch${active ? ' is-selected' : ''}`} key={branch.queen}>
                <button
                  type="button"
                  className={`royal-board__queen-anchor${locked ? ' is-locked' : ''}`}
                  aria-label={`${branch.order} ${branch.queen}. ${princes.length} child${princes.length === 1 ? '' : 'ren'}`}
                  aria-pressed={locked}
                  aria-current={active ? 'true' : undefined}
                  aria-describedby={queenTooltipId}
                  onClick={() => { if (princes[0]) setSelectedOrder(princes[0].order); toggleLock(queenKey); }}
                >
                  <span className="royal-board__queen-rank">{branch.order}</span>
                  <Portrait name={branch.queen} entity={queenEntity} compact />
                  <span><strong>{queenShort}</strong><small>{princes.length} child{princes.length === 1 ? '' : 'ren'}</small></span>
                  <HoverCard id={queenTooltipId} eyebrow={branch.order} name={branch.queen} description={queen?.role || branch.note || 'Kakin royal household branch.'} facts={[["Children", princes.map((prince) => prince.short).join(', ')], ["Nen / ability", abilityLabelFor(queenEntity)], ["Branch", active ? 'Current selected branch' : 'Royal household']]} meta="Click to pin this preview" />
                </button>

                <div className="royal-board__branch-princes">
                  {princes.map((prince) => <PrinceDossier
                    key={prince.order}
                    prince={prince}
                    guards={protectionByPrince.get(prince.order) || []}
                    selectedOrder={selectedOrder}
                    setSelectedOrder={setSelectedOrder}
                    lockedKey={lockedKey}
                    setLockedKey={setLockedKey}
                    activePrinceOrder={activePrinceOrder}
                    setActivePrinceOrder={setActivePrinceOrder}
                    activeMafiaKey={highlightedMafiaKey}
                    openPrince={openPrince}
                  />)}
                </div>
              </section>;
            })}
          </div>)}
        </div>
      </div>
    </div>

    <span className="sr-only" role="status" aria-live="polite">{`${selectedPrince?.name || `Prince ${selectedOrder}`} selected.${lockedKey ? ' Preview pinned.' : ''}`}</span>
    <footer className="royal-board__footer"><Shield size={14} aria-hidden="true" /><span>Portrait borders identify direct guards, placements and allies, intelligence actors, and group-level complements. A listed person is connected to the household but is not automatically loyal to it.</span><Users size={14} aria-hidden="true" /></footer>
  </section>;
}
