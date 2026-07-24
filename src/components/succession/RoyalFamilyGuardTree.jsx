import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Crown, Shield, Sparkles, Users } from 'lucide-react';
import { princeDossiers, queenDossiers } from '../../data/successionDossier';
import { biologicalRoyalFamilyTree, legalRoyalFamilyTree } from '../../data/successionRoster';
import { getProtectionNetworkSeed } from '../../data/successionProtectionNetworks';
import { getEntitiesByType, getEntityById } from '../../data/succession/successionData';
import SafeImage from '../SafeImage';
import { entityWorkspaceTarget } from './SuccessionArchivePrimitives';
import './RoyalFamilyGuardTree.css';
import './RoyalFamilyGuardTreeFixes.css';

const cleanBranchName = (name = '') => String(name)
  .replace(/[†*]/g, '')
  .replace(/\s+\((?:birth|raised).*\)$/i, '')
  .trim();

const slugify = (value = '') => String(value)
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/&/g, ' and ')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

const normalizeLookup = (value = '') => String(value)
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const queenFullNameByShort = new Map(queenDossiers.map((queen) => [queen.name, `${queen.name} Hui Guo Rou`]));
const princeFullNameByShort = new Map(princeDossiers.map((prince) => [prince.short, prince.name]));
const dossierByShort = new Map(princeDossiers.map((prince) => [prince.short, prince]));
const queenDossierByShort = new Map(queenDossiers.map((queen) => [queen.name, queen]));
const characterEntities = getEntitiesByType('character');
const intelligenceKinds = new Set(['observer', 'spy', 'hostile']);
const placementKinds = new Set(['kurapika-placement', 'ally']);

const canonicalName = (name) => queenFullNameByShort.get(name) || princeFullNameByShort.get(name) || name;
const entityForName = (name) => {
  const canonical = canonicalName(name);
  const direct = getEntityById(`character:${slugify(canonical)}`);
  if (direct) return direct;
  const target = normalizeLookup(canonical);
  return characterEntities.find((entity) => [entity.name, ...(entity.aliases || [])].some((candidate) => normalizeLookup(candidate) === target)) || null;
};
const initials = (name = '') => name.split(/\s+/).filter(Boolean).map((part) => part[0]).slice(0, 2).join('').toUpperCase() || '?';

const statusLabel = (status) => status === 'deceased'
  ? 'Deceased'
  : status === 'exceptional'
    ? 'Exceptional state'
    : 'Active contender';

const networkKindLabel = (kind) => {
  if (kind === 'kurapika-placement') return 'Kurapika-recruited placement';
  if (kind === 'ally') return 'Allied reinforcement';
  if (kind === 'observer') return 'Embedded observer';
  if (kind === 'spy') return 'Royal spy network';
  if (kind === 'hostile') return 'Hostile infiltration';
  if (kind === 'complement') return 'Household complement';
  return 'Direct protection';
};

const personSummary = (entity, fallback) => entity?.summary || fallback;
const isRoyalEntity = (entity) => (entity?.roles || []).some((role) => ['king', 'queen', 'prince', 'royal-parent'].includes(role));

function Portrait({ name, entity, compact = false }) {
  const portrait = entity?.media?.portrait || '';
  const [available, setAvailable] = useState(Boolean(portrait));

  useEffect(() => setAvailable(Boolean(portrait)), [portrait]);

  if (!portrait || !available) {
    return <span className={`royal-guard-tree__fallback${compact ? ' is-compact' : ''}`} role="img" aria-label={`${name} portrait unavailable`}>{initials(name)}</span>;
  }

  return <span className={`succession-entity-visual${compact ? ' is-compact' : ''}`} data-has-visual="true">
    <SafeImage
      src={portrait}
      media={entity.media}
      fallbackLabel=""
      alt={`${name} archive portrait`}
      eager={!compact}
      onAvailabilityChange={setAvailable}
    />
  </span>;
}

function HoverCard({ eyebrow, name, description, meta }) {
  return <span className="royal-guard-tree__hover-card" role="tooltip">
    <small>{eyebrow}</small>
    <strong>{name}</strong>
    <span>{description}</span>
    {meta && <em>{meta}</em>}
  </span>;
}

const buildProtectionNodes = (prince) => {
  const seed = getProtectionNetworkSeed(prince);
  const records = [];
  const seen = new Set();

  const addRecord = (name, supplied = {}) => {
    const normalized = normalizeLookup(name);
    if (!normalized || seen.has(normalized)) return;
    const entity = supplied.entity === undefined ? entityForName(name) : supplied.entity;
    if (entity && isRoyalEntity(entity)) return;
    seen.add(normalized);
    const isGroup = supplied.isGroup ?? !entity;
    const kind = supplied.kind || (isGroup ? 'complement' : 'protection');
    records.push({
      id: supplied.id || `${prince.order}-${slugify(name)}-${records.length}`,
      name,
      entity,
      isGroup,
      kind,
      count: supplied.count || null,
      eyebrow: supplied.eyebrow || networkKindLabel(kind) || (entity?.roles || []).slice(0, 2).join(' · '),
      description: supplied.description || personSummary(entity, `Documented member of ${prince.short}'s household network.`),
    });
  };

  for (const record of seed.categorizedActors) addRecord(record.name, record);
  for (const name of seed.dedicatedNames) addRecord(name, { kind: 'protection' });
  for (const name of seed.teamNames) addRecord(name, { kind: 'protection' });
  for (const group of seed.complementGroups) addRecord(group.name, { ...group, entity: null, isGroup: true });

  return records;
};

export default function RoyalFamilyGuardTree({ onNavigate, spoilerLimit = Number.MAX_SAFE_INTEGER, initialPrince = 14 }) {
  const royalTree = spoilerLimit >= 401 ? biologicalRoyalFamilyTree : legalRoyalFamilyTree;
  const initialDossier = princeDossiers.find((prince) => prince.order === initialPrince) || princeDossiers.at(-1);
  const initialBranchIndex = Math.max(0, royalTree.findIndex((branch) => branch.children.some((child) => cleanBranchName(child) === initialDossier.short)));
  const [selectedQueenIndex, setSelectedQueenIndex] = useState(initialBranchIndex);
  const [selectedOrder, setSelectedOrder] = useState(initialDossier.order);
  const [hoveredGuard, setHoveredGuard] = useState(null);
  const [lockedGuard, setLockedGuard] = useState(null);

  const selectedBranch = royalTree[selectedQueenIndex] || royalTree[0];
  const selectedPrince = princeDossiers.find((prince) => prince.order === selectedOrder)
    || dossierByShort.get(cleanBranchName(selectedBranch.children[0]))
    || initialDossier;
  const selectedPrinceEntity = entityForName(selectedPrince.name);
  const kingEntity = entityForName('Nasubi Hui Guo Rou');
  const guards = useMemo(() => buildProtectionNodes(selectedPrince), [selectedPrince]);
  const directGuardCount = guards.filter((guard) => guard.kind === 'protection' && !guard.isGroup).length;
  const placementCount = guards.filter((guard) => placementKinds.has(guard.kind)).length;
  const surveillanceCount = guards.filter((guard) => intelligenceKinds.has(guard.kind)).length;
  const groupGuardCount = guards.filter((guard) => guard.isGroup && !intelligenceKinds.has(guard.kind)).length;

  const focusedGuard = lockedGuard || hoveredGuard;
  const selectedQueenDossier = queenDossierByShort.get(selectedBranch.queen.replace(' Hui Guo Rou', ''));

  const selectQueen = (index) => {
    const branch = royalTree[index];
    const firstPrince = branch?.children.map((child) => dossierByShort.get(cleanBranchName(child))).find(Boolean);
    setSelectedQueenIndex(index);
    if (firstPrince) setSelectedOrder(firstPrince.order);
    setLockedGuard(null);
    setHoveredGuard(null);
  };

  const selectPrince = (prince) => {
    setSelectedOrder(prince.order);
    setLockedGuard(null);
    setHoveredGuard(null);
  };

  const openEntity = (entity) => {
    if (!entity) return;
    onNavigate?.(entityWorkspaceTarget(entity), { entity: entity.id });
  };

  return <section className="royal-guard-tree" aria-labelledby="royal-guard-tree-title">
    <header className="royal-guard-tree__header">
      <div>
        <span><Crown size={14} aria-hidden="true" /> Kakin royal structure</span>
        <h2 id="royal-guard-tree-title">The royal family, protection teams, and hidden observers</h2>
        <p>Select a queen and prince to inspect direct guards, Kurapika-recruited placements, allied reinforcements, royal spies, hostile infiltrators, and unnamed documented complements. Hover previews identity and role; clicking locks the information panel.</p>
      </div>
      <div className="royal-guard-tree__legend" aria-label="Diagram legend">
        <span><i className="is-royal" /> Royal line</span>
        <span><i className="is-branch" /> Maternal branch</span>
        <span><i className="is-guard" /> Direct protection</span>
        <span><i className="is-placement" /> Kurapika placement / ally</span>
        <span><i className="is-intel" /> Spy / observer / infiltrator</span>
      </div>
    </header>

    <div className="royal-guard-tree__family-stage">
      <div className="royal-guard-tree__king-wrap">
        <button type="button" className="royal-guard-tree__king" onClick={() => openEntity(kingEntity)} disabled={!kingEntity}>
          <Portrait name="Nasubi Hui Guo Rou" entity={kingEntity} />
          <span>King of Kakin</span>
          <strong>Nasubi Hui Guo Rou</strong>
          <small>Father of the fourteen legitimate princes</small>
          <HoverCard eyebrow="Royal root" name="Nasubi Hui Guo Rou" description={personSummary(kingEntity, 'The reigning Kakin king and surviving winner of the previous succession contest.')} meta="Open canonical record" />
        </button>
        <span className="royal-guard-tree__king-stem" aria-hidden="true" />
      </div>

      <div className="royal-guard-tree__queen-scroll" aria-label="Eight queen branches" tabIndex="0">
        <div className="royal-guard-tree__queen-line" aria-hidden="true" />
        <div className="royal-guard-tree__queen-grid">
          {royalTree.map((branch, index) => {
            const queenShort = branch.queen.replace(' Hui Guo Rou', '');
            const queenEntity = entityForName(branch.queen);
            const queen = queenDossierByShort.get(queenShort);
            const active = index === selectedQueenIndex;
            return <article className={`royal-guard-tree__branch${active ? ' is-selected' : ''}`} key={branch.queen}>
              <span className="royal-guard-tree__branch-stem" aria-hidden="true" />
              <button type="button" className="royal-guard-tree__queen" aria-pressed={active} onClick={() => selectQueen(index)}>
                <Portrait name={branch.queen} entity={queenEntity} compact />
                <span>{branch.order}</span>
                <strong>{queenShort}</strong>
                <small>{branch.children.length} child{branch.children.length === 1 ? '' : 'ren'}</small>
                <HoverCard eyebrow={branch.order} name={branch.queen} description={queen?.role || branch.note || 'Kakin royal household branch.'} meta={active ? 'Selected branch' : 'Select branch'} />
              </button>

              <div className="royal-guard-tree__children">
                {branch.children.map((child) => {
                  const prince = dossierByShort.get(cleanBranchName(child));
                  if (!prince) return null;
                  const entity = entityForName(prince.name);
                  const selected = prince.order === selectedPrince.order;
                  return <button type="button" className={selected ? 'is-selected' : ''} aria-pressed={selected} onClick={() => selectPrince(prince)} key={`${branch.queen}-${child}`}>
                    <Portrait name={prince.name} entity={entity} compact />
                    <span>{String(prince.order).padStart(2, '0')}</span>
                    <strong>{prince.short}</strong>
                    <HoverCard eyebrow={`${prince.order}${prince.order === 1 ? 'st' : prince.order === 2 ? 'nd' : prince.order === 3 ? 'rd' : 'th'} Prince`} name={prince.name} description={prince.strategy} meta={`${statusLabel(prince.status)} · Room ${prince.room}`} />
                  </button>;
                })}
              </div>
            </article>;
          })}
        </div>
      </div>
    </div>

    <div className="royal-guard-tree__selection-bar" aria-live="polite">
      <div><Sparkles size={16} aria-hidden="true" /><span>Selected maternal branch</span><strong>{selectedBranch.queen}</strong></div>
      <div><Crown size={16} aria-hidden="true" /><span>Selected contender</span><strong>{selectedPrince.order}. {selectedPrince.short}</strong></div>
      <button type="button" onClick={() => openEntity(selectedPrinceEntity)}>Open prince dossier <ArrowRight size={14} aria-hidden="true" /></button>
    </div>

    <div className="royal-guard-tree__focus-grid">
      <section className="royal-guard-tree__orbit-panel" aria-labelledby="royal-guard-tree-orbit-title">
        <header>
          <div><Shield size={18} aria-hidden="true" /><span>Household network</span><h3 id="royal-guard-tree-orbit-title">{selectedPrince.short}'s protection and intelligence circle</h3></div>
          <small>{directGuardCount} direct · {placementCount} placed/allied · {surveillanceCount} surveillance · {groupGuardCount} complement</small>
        </header>

        <div className={`royal-guard-tree__orbit${guards.length > 10 ? ' is-dense' : ''}`} style={{ '--guard-total': Math.max(guards.length, 1) }}>
          <div className={`royal-guard-tree__center-prince is-${selectedPrince.status}`}>
            <Portrait name={selectedPrince.name} entity={selectedPrinceEntity} />
            <span>{selectedPrince.order} · {statusLabel(selectedPrince.status)}</span>
            <strong>{selectedPrince.short}</strong>
            <small>Queen {selectedPrince.mother}</small>
          </div>

          {guards.map((guard, index) => {
            const angle = -90 + ((360 / Math.max(guards.length, 1)) * index);
            const radius = guards.length > 12 ? 272 : guards.length > 8 ? 250 : guards.length > 5 ? 225 : 195;
            const style = { '--angle': `${angle}deg`, '--radius': `${radius}px` };
            const locked = lockedGuard?.id === guard.id;
            return <div className="royal-guard-tree__guard-slot" style={style} key={guard.id}>
              <span className={`royal-guard-tree__guard-line is-${guard.kind}`} aria-hidden="true" />
              <button
                type="button"
                className={`royal-guard-tree__guard is-${guard.kind}${guard.isGroup ? ' is-group' : ''}${locked ? ' is-locked' : ''}`}
                aria-label={`${guard.name}. ${guard.eyebrow}`}
                aria-pressed={locked}
                onMouseEnter={() => setHoveredGuard(guard)}
                onMouseLeave={() => setHoveredGuard(null)}
                onFocus={() => setHoveredGuard(guard)}
                onBlur={() => setHoveredGuard(null)}
                onClick={() => setLockedGuard(locked ? null : guard)}
              >
                <Portrait name={guard.name} entity={guard.entity} compact />
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{guard.name}</strong>
                <HoverCard eyebrow={guard.eyebrow} name={guard.name} description={guard.description} meta={locked ? 'Click to release' : 'Click to lock details'} />
              </button>
            </div>;
          })}
        </div>
      </section>

      <aside className="royal-guard-tree__inspector" aria-live="polite">
        {focusedGuard ? <div className="royal-guard-tree__inspector-content" key={focusedGuard.id}>
          <span>{networkKindLabel(focusedGuard.kind)}</span>
          <div className="royal-guard-tree__inspector-portrait"><Portrait name={focusedGuard.name} entity={focusedGuard.entity} /></div>
          <h3>{focusedGuard.name}</h3>
          <p>{focusedGuard.description}</p>
          <dl>
            <div><dt>Connected to</dt><dd>{selectedPrince.short}</dd></div>
            <div><dt>Role</dt><dd>{focusedGuard.eyebrow}</dd></div>
            <div><dt>Category</dt><dd>{networkKindLabel(focusedGuard.kind)}</dd></div>
            <div><dt>Record</dt><dd>{focusedGuard.entity ? 'Canonical profile available' : 'Count or group-level record'}</dd></div>
          </dl>
          {focusedGuard.entity && <button type="button" onClick={() => openEntity(focusedGuard.entity)}>Open full record <ArrowRight size={14} aria-hidden="true" /></button>}
          <small>{lockedGuard ? 'Selection locked. Click the same node to release it.' : 'Hover another node to preview it.'}</small>
        </div> : <div className="royal-guard-tree__inspector-content is-prince" key={selectedPrince.order}>
          <span>Selected prince</span>
          <div className="royal-guard-tree__inspector-portrait"><Portrait name={selectedPrince.name} entity={selectedPrinceEntity} /></div>
          <h3>{selectedPrince.name}</h3>
          <p>{selectedPrince.strategy}</p>
          <dl>
            <div><dt>Mother</dt><dd>Queen {selectedPrince.mother}</dd></div>
            <div><dt>Room</dt><dd>{selectedPrince.room}</dd></div>
            <div><dt>Status</dt><dd>{statusLabel(selectedPrince.status)}</dd></div>
            <div><dt>Direct protection</dt><dd>{directGuardCount}</dd></div>
            <div><dt>Placed / allied</dt><dd>{placementCount}</dd></div>
            <div><dt>Surveillance</dt><dd>{surveillanceCount}</dd></div>
            <div><dt>Complement records</dt><dd>{groupGuardCount}</dd></div>
          </dl>
          <button type="button" onClick={() => openEntity(selectedPrinceEntity)}>Open full dossier <ArrowRight size={14} aria-hidden="true" /></button>
          <small>Hover any node for its exact relationship. A person appearing here is not automatically loyal to the selected prince.</small>
        </div>}
      </aside>
    </div>

    <footer className="royal-guard-tree__footer">
      <Users size={15} aria-hidden="true" />
      <span>Gold nodes are direct protection, blue nodes are Kurapika placements or allied reinforcements, and red nodes are spies, observers, or hostile infiltrators. Unnamed complements remain labeled group records.</span>
      {selectedQueenDossier && <a href={selectedQueenDossier.source} target="_blank" rel="noreferrer noopener">Queen reference <ArrowRight size={12} aria-hidden="true" /></a>}
    </footer>
  </section>;
}