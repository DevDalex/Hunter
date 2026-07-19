import { ExternalLink } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { biologicalRoyalFamilyTree, legalRoyalFamilyTree, mafiaFamilyTree, successionRosterSource } from '../data/successionRoster';
import { princeDossiers } from '../data/successionDossier';
import { queenHouseholdLedger } from '../data/successionArchive';
import { deathLedger, isRoyalDeceased } from '../data/successionStatus';
import { characterMedia, characterPortrait, characterSource } from '../data/entityRegistry';
import HorizontalScrollHint from './HorizontalScrollHint';
import SafeImage from './SafeImage';

const cleanName = (name) => name.replace(/[†*]/g, '');
const portraitFor = (name) => characterPortrait(cleanName(name));
const mediaFor = (name) => characterMedia(cleanName(name));
const sourceFor = (name) => characterSource(cleanName(name));
const treeModes = [
  ['legal', '01', 'Legal household'],
  ['biological', '02', 'Biological reveal', 401],
  ['political', '03', 'Political / mafia links'],
];

const princeFor = (name) => princeDossiers.find((prince) => prince.short === cleanName(name));
const princeOrderFor = (name) => princeFor(name)?.order;
const deceasedByBoundary = (name, spoilerLimit) => {
  const cleaned = cleanName(name);
  const canonical = `${cleaned} Hui Guo Rou`;
  const record = deathLedger.find((item) => item.name === canonical);
  return isRoyalDeceased(cleaned) && (!record || Number(record.chapter) <= spoilerLimit);
};

export default function FamilyTree({ onOpenPrince, spoilerLimit = Number.MAX_SAFE_INTEGER }) {
  const [treeMode, setTreeMode] = useState('legal');
  const treeTabRefs = useRef([]);
  const [selectedQueen, setSelectedQueen] = useState(0);
  const morenaBranch = mafiaFamilyTree.find((person) => person.name === 'Morena Prudo');
  const royalMafiaBranches = mafiaFamilyTree.filter((person) => person.name !== 'Morena Prudo');
  const activeRoyalTree = treeMode === 'biological' ? biologicalRoyalFamilyTree : legalRoyalFamilyTree;
  const selectedBranch = activeRoyalTree[selectedQueen];
  const selectedHousehold = queenHouseholdLedger.find((queen) => selectedBranch?.queen.startsWith(queen.name));
  const selectTreeMode = (mode, focus = false) => {
    if (mode === 'biological' && spoilerLimit < 401) return;
    setTreeMode(mode);
    if (focus) window.requestAnimationFrame(() => treeTabRefs.current[treeModes.findIndex(([id]) => id === mode)]?.focus());
  };

  useEffect(() => {
    if (treeMode === 'biological' && spoilerLimit < 401) setTreeMode('legal');
  }, [spoilerLimit, treeMode]);
  const handleTreeTabKeyDown = (event, index) => {
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % treeModes.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + treeModes.length) % treeModes.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = treeModes.length - 1;
    else return;
    event.preventDefault();
    selectTreeMode(treeModes[next][0], true);
  };

  return (
    <section className="family-tree-section" id="family-tree">
      <div className="section-heading">
        <div><span className="section-kicker">Family and political trees</span><h2>Kakin, without collapsing different relationships.</h2></div>
        <p>Switch between the public legal households, the spoiler-gated biological record, and the separate underworld line. Prince order remains visible inside every queen branch.</p>
      </div>

      <div className="tree-mode-switch" role="tablist" aria-label="Family tree display mode">
        {treeModes.map(([id, number, label, minimumChapter], index) => {
          const locked = minimumChapter && spoilerLimit < minimumChapter;
          return <button ref={(node) => { treeTabRefs.current[index] = node; }} type="button" role="tab" id={`tree-tab-${id}`} aria-controls={`tree-panel-${id}`} aria-selected={treeMode === id} aria-disabled={locked || undefined} tabIndex={treeMode === id ? 0 : -1} className={`${treeMode === id ? 'is-active' : ''}${locked ? ' is-locked' : ''}`} onClick={() => selectTreeMode(id)} onKeyDown={(event) => handleTreeTabKeyDown(event, index)} title={locked ? `Available at Chapter ${minimumChapter}` : undefined} key={id}><span>{number}</span> {label}{locked && <small> · Ch. {minimumChapter}</small>}</button>;
        })}
      </div>
      <HorizontalScrollHint>On smaller screens, the royal branches stack into a connected reading path; swipe sideways only when a wide political branch requires it. The text-and-table version remains available below.</HorizontalScrollHint>

      {(treeMode === 'legal' || treeMode === 'biological') && <div className="tree-display royal-tree" id={`tree-panel-${treeMode}`} role="tabpanel" aria-labelledby={`tree-tab-${treeMode}`} aria-label={`Nasubi, the eight queens, and their children in ${treeMode} relationship mode`}>
        <div className="tree-display__label">{treeMode === 'legal' ? 'Legal household tree · public and adoptive family structure' : 'Biological tree · Chapter 401 reveal applied'}</div>
        <div className="royal-tree__scroll">
          <div className="royal-tree__graphic">
            <a className="tree-person tree-person--king" href={sourceFor('Nasubi Hui Guo Rou')} target="_blank" rel="noreferrer">
              <SafeImage src={portraitFor('Nasubi Hui Guo Rou')} media={mediaFor('Nasubi Hui Guo Rou')} alt="Nasubi Hui Guo Rou Hunterpedia portrait" eager />
              <span>Trunk · King of Kakin</span>
              <strong>Nasubi Hui Guo Rou</strong>
              <small>Father of the fourteen legitimate princes</small>
            </a>
            <div className="tree-trunk" aria-hidden="true" />
            <div className="royal-tree__branches">
              {activeRoyalTree.map((branch, index) => (
                <article className={`royal-branch royal-branch--${index + 1}`} key={branch.queen}>
                  <div className="branch-stem" aria-hidden="true" />
                  <button type="button" className={`tree-person tree-person--queen${selectedQueen === index ? ' is-selected' : ''}`} onClick={() => setSelectedQueen(index)} aria-pressed={selectedQueen === index}>
                    <SafeImage src={portraitFor(branch.queen)} media={mediaFor(branch.queen)} alt={`${branch.queen} Hunterpedia portrait`} />
                    <span>{branch.order}</span>
                    <strong>{branch.queen}</strong>
                  </button>
                  <div className="royal-branch__children">
                    {branch.children.map((child) => (
                      <button type="button" onClick={() => onOpenPrince?.(princeOrderFor(child))} className={`${deceasedByBoundary(child, spoilerLimit) ? 'is-deceased' : ''}${child.includes('†') ? ' is-adoptive' : ''}`} key={child} title={`Open ${cleanName(child)} dossier`}>
                        <SafeImage src={portraitFor(child)} media={mediaFor(child)} alt={`${cleanName(child)} Hunterpedia portrait`} />
                        <span><b>{child}</b><small>{princeFor(child)?.order}. Prince · Room {princeFor(child)?.room}</small></span>
                        {deceasedByBoundary(child, spoilerLimit) && <span className="sr-only">Confirmed deceased</span>}
                      </button>
                    ))}
                  </div>
                  {branch.note && <small>{branch.note}</small>}
                </article>
              ))}
            </div>
            <div className="tree-line-legend" aria-label="Relationship line legend"><span><i className="is-solid" /> Biological / standard parent-child</span><span><i className="is-dashed" /> Adoptive / legal household</span><span><b>*</b> Later biological disclosure</span></div>
            <p className="tree-note">{treeMode === 'legal' ? 'The legal view keeps Halkenburg under Duazul and marks the adoptive relationship. It does not expose the later maternal disclosure.' : 'The biological view moves Halkenburg to Unma while preserving Duazul’s role in his legal and raised household record.'}</p>
          </div>
        </div>
        {selectedBranch && selectedHousehold && <aside className="tree-branch-inspector" aria-live="polite">
          <div className="tree-branch-inspector__identity">
            <SafeImage src={portraitFor(selectedBranch.queen)} media={mediaFor(selectedBranch.queen)} alt={`${selectedBranch.queen} Hunterpedia portrait`} eager />
            <span>{selectedBranch.order} · {selectedHousehold.status}</span>
            <h3>{selectedBranch.queen}</h3>
            <p>{selectedHousehold.action}</p>
            <a href={selectedHousehold.source} target="_blank" rel="noreferrer">Open queen source <ExternalLink size={11} /></a>
          </div>
          <dl><div><dt>Children</dt><dd>{selectedHousehold.children}</dd></div><div><dt>Residence</dt><dd>{selectedHousehold.residence}</dd></div><div><dt>Household and guards</dt><dd>{selectedHousehold.guards}</dd></div></dl>
          <div className="tree-branch-inspector__children">{selectedBranch.children.map((child) => <button onClick={() => onOpenPrince?.(princeOrderFor(child))} key={child}><SafeImage src={portraitFor(child)} media={mediaFor(child)} alt="" /><span><b>{cleanName(child)}</b><small>Prince {princeFor(child)?.order} · Room {princeFor(child)?.room}</small></span></button>)}</div>
        </aside>}
      </div>}

      {treeMode === 'political' && <div className="tree-display mafia-tree" id="tree-panel-political" role="tabpanel" aria-labelledby="tree-tab-political">
        <div className="mafia-tree__heading">
          <span className="section-kicker">Royal underworld tree</span>
          <h3>Half-siblings, illegitimate descent, and mafia sponsorship</h3>
        </div>
        <div className="mafia-tree__scroll">
          <div className="mafia-tree__graphic">
            <div className="tree-person tree-person--ancestor">
              <span>Root line</span>
              <strong>Previous Kakin royal line</strong>
              <small>Shared parentage behind the king and two mafia bosses</small>
            </div>
            <div className="underworld-trunk" aria-hidden="true"><i /><i /></div>
            <div className="mafia-tree__siblings">
              {royalMafiaBranches.map((person) => (
                <article key={person.name} className={`mafia-branch ${person.name === 'Nasubi Hui Guo Rou' ? 'mafia-branch--king' : ''}`}>
                  <div className="branch-stem" aria-hidden="true" />
                  <a className="tree-person" href={sourceFor(person.name)} target="_blank" rel="noreferrer">
                    <SafeImage src={portraitFor(person.name)} media={mediaFor(person.name)} alt={`${person.name} Hunterpedia portrait`} />
                    <span>{person.relation}</span>
                    <strong>{person.name}</strong>
                    <small>{person.family}</small>
                  </a>
                  <div className="mafia-branch__link">
                    <span>{person.link}</span>
                    <strong>{person.royal}</strong>
                  </div>
                </article>
              ))}
            </div>
            {morenaBranch && (
              <a className="morena-branch" href={sourceFor(morenaBranch.name)} target="_blank" rel="noreferrer">
                <SafeImage src={portraitFor(morenaBranch.name)} media={mediaFor(morenaBranch.name)} alt={`${morenaBranch.name} Hunterpedia portrait`} />
                <span>{morenaBranch.relation} · {morenaBranch.link}</span>
                <strong>{morenaBranch.name}</strong>
                <small>{morenaBranch.family} · linked to {morenaBranch.royal}</small>
              </a>
            )}
          </div>
        </div>
      </div>}

      {(treeMode === 'legal' || treeMode === 'biological') && <section className="royal-household-matrix" aria-labelledby="royal-household-matrix-title">
        <header><div><span className="section-kicker">Eight-household comparison</span><h3 id="royal-household-matrix-title">Queens, children, rooms and protection pressure</h3></div><p>Selecting a household above keeps the family relationship visible; this matrix makes resources, residence, guards, and current state comparable without pretending every household has equal information.</p></header>
        <div>{queenHouseholdLedger.map((household, index) => <button type="button" className={selectedQueen === index ? 'is-active' : ''} onClick={() => { setSelectedQueen(index); document.querySelector('.tree-branch-inspector')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }} key={household.name}><i>{String(index + 1).padStart(2, '0')}</i><span><small>{household.status}</small><strong>{household.name}</strong><em>{household.children}</em></span><dl><div><dt>Residence</dt><dd>{household.residence}</dd></div><div><dt>Guards</dt><dd>{household.guards}</dd></div></dl></button>)}</div>
      </section>}

      <details className="tree-text-equivalent">
        <summary>Open the text and table version of both family trees</summary>
        <div className="tree-text-equivalent__table-wrap"><table><thead><tr><th>Mode / parent branch</th><th>Children or royal link</th><th>Relationship note</th></tr></thead><tbody>
          {legalRoyalFamilyTree.map((branch) => <tr key={`legal-${branch.queen}`}><th>Legal · Nasubi + {branch.queen}</th><td>{branch.children.join(', ')}</td><td>{branch.note || `${branch.order} maternal branch`}</td></tr>)}
          {spoilerLimit >= 401 && biologicalRoyalFamilyTree.map((branch) => <tr key={`biological-${branch.queen}`}><th>Biological · Nasubi + {branch.queen}</th><td>{branch.children.join(', ')}</td><td>{branch.note || `${branch.order} maternal branch`}</td></tr>)}
          {mafiaFamilyTree.map((person) => <tr key={person.name}><th>{person.name}</th><td>{person.royal}</td><td>{person.relation}; {person.family}; {person.link}</td></tr>)}
        </tbody></table></div>
      </details>

      <a className="tree-source" href={successionRosterSource} target="_blank" rel="noreferrer">Relationship and roster source: Hunterpedia <ExternalLink size={13} /></a>
    </section>
  );
}
