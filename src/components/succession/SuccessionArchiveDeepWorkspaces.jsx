import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Crown,
  MapPin,
  Skull,
} from 'lucide-react';
import {
  getCharacterDossier,
  getEntitiesByType,
  getEntityById,
} from '../../data/succession/successionData';
import { EntityVisual } from './SuccessionArchivePrimitives';
import './SuccessionArchiveDeepWorkspaces.css';

const latestChapter = () => getEntitiesByType('chapter').at(-1)?.number || 414;
const normalizeText = (value) => String(value || '').toLocaleLowerCase();
const stateTone = (value = '') => /dead|deceased|ended/i.test(value)
  ? 'dead'
  : /exceptional|occupied|possess|continuation|displaced|unknown/i.test(value)
    ? 'exceptional'
    : /alive|active|living/i.test(value)
      ? 'active'
      : 'neutral';

export function QueensWorkspace({ routeParams = {}, spoilerLimit = latestChapter(), onNavigate }) {
  const queens = useMemo(() => getEntitiesByType('character')
    .filter((character) => (character.roles || []).includes('queen'))
    .sort((left, right) => Number.parseInt(left.queenRank, 10) - Number.parseInt(right.queenRank, 10)), []);
  const requested = routeParams.entity ? getEntityById(routeParams.entity) : null;
  const initialId = requested?.entityType === 'character' ? requested.id : routeParams.focus ? queens.find((queen) => normalizeText(queen.name).includes(normalizeText(routeParams.focus)))?.id : null;
  const [selectedId, setSelectedId] = useState(initialId || null);
  const selected = queens.find((queen) => queen.id === selectedId) || null;

  const openQueen = (queen) => {
    setSelectedId(queen.id);
    onNavigate('characters', { entity: queen.id });
  };

  if (selected) {
    const dossier = getCharacterDossier(selected.id, spoilerLimit);
    const children = queens.length ? getEntitiesByType('character').filter((character) => character.royalMother && normalizeText(character.royalMother).includes(normalizeText(selected.name.replace(/ Hui Guo Rou$/, '')))) : [];
    return <article className="succession-queen-dossier">
      <button type="button" className="succession-deep-back" onClick={() => { setSelectedId(null); onNavigate('queens'); }}><ArrowLeft size={15} aria-hidden="true" /> All queens</button>
      <section className="succession-queen-dossier__hero"><EntityVisual entity={selected} /><div><span>{selected.queenRank || 'Queen'} · {dossier?.state?.life || selected.status?.life}</span><h2>{selected.name}</h2><p>{dossier?.state?.operationalState || selected.summary}</p><small><MapPin size={13} aria-hidden="true" /> {dossier?.location?.name || 'Current location unresolved at this boundary'}</small></div></section>
      <div className="succession-queen-dossier__columns"><section><span>Household authority</span><h3>{dossier?.roleProfile?.label || 'Royal household authority'}</h3><p>{dossier?.roleProfile?.authority || selected.summary}</p></section><section><span>Current pressure</span><h3>Responsibilities and vulnerabilities</h3><p>{[...(dossier?.roleProfile?.responsibilities || []), ...(dossier?.roleProfile?.vulnerabilities || [])].join(' ') || 'No additional chapter-bounded pressure is published.'}</p></section></div>
      <section className="succession-queen-dossier__children" aria-labelledby="succession-queen-children-title"><header><Crown size={18} aria-hidden="true" /><div><span>Royal branch</span><h3 id="succession-queen-children-title">Connected princes and household actors</h3></div></header><div>{[...children, ...(dossier?.relationships?.relationships || []).flatMap((relationship) => [relationship.sourceEntity, relationship.targetEntity]).filter((entity) => entity?.entityType === 'character' && entity.id !== selected.id)].filter((entity, index, values) => values.findIndex((candidate) => candidate.id === entity.id) === index).slice(0, 14).map((entity) => <button type="button" key={entity.id} onClick={() => onNavigate('characters', { entity: entity.id })}><EntityVisual entity={entity} compact /><span>{entity.name}</span><small>{(entity.roles || []).join(' · ')}</small></button>)}</div></section>
    </article>;
  }

  return <section className="succession-queen-board" aria-labelledby="succession-queen-board-title">
    <header><div><span>Royal maternal hierarchy</span><h2 id="succession-queen-board-title">Eight chapter-bounded queen households</h2><p>Queen rank, household authority, current operation, location, assignments, relationships, and open questions come from the canonical character-state graph.</p></div><dl><div><dt>Queens</dt><dd>{queens.length}</dd></div><div><dt>Boundary</dt><dd>Ch. {spoilerLimit}</dd></div></dl></header>
    <div>{queens.map((queen) => {
      const dossier = getCharacterDossier(queen.id, spoilerLimit);
      return <button type="button" className={`succession-queen-card is-${stateTone(dossier?.state?.life)}`} key={queen.id} onClick={() => openQueen(queen)}><span className="succession-queen-card__rank">{queen.queenRank || 'Queen'}</span><EntityVisual entity={queen} /><div><span>{dossier?.state?.life || queen.status?.life}</span><h3>{queen.name}</h3><p>{dossier?.state?.operationalState || queen.summary}</p></div><dl><div><dt>Assignments</dt><dd>{dossier?.assignments?.assignments.length || 0}</dd></div><div><dt>Relationships</dt><dd>{dossier?.relationships?.relationships.length || 0}</dd></div></dl><footer><b>Open canonical dossier</b><ArrowRight size={14} aria-hidden="true" /></footer></button>;
    })}</div>
  </section>;
}

export function BodyStatesWorkspace({ spoilerLimit = latestChapter(), onNavigate }) {
  const characters = useMemo(() => getEntitiesByType('character'), []);
  const dossiers = useMemo(() => characters.map((character) => getCharacterDossier(character.id, spoilerLimit)).filter(Boolean), [characters, spoilerLimit]);
  const exceptional = dossiers.filter((dossier) => /dead|unknown|possess|displaced|continuation|deceased|occupied/i.test(`${dossier.state?.life} ${dossier.state?.bodyState} ${dossier.state?.consciousnessState}`));
  const confirmedDead = dossiers.filter((dossier) => dossier.state?.life === 'dead');
  const bodyStates = [...new Map(exceptional.map((dossier) => [dossier.state?.bodyState, dossier])).values()];
  const consciousnessStates = [...new Map(exceptional.map((dossier) => [dossier.state?.consciousnessState, dossier])).values()];

  return <div className="succession-body-states">
    <section className="succession-body-states__hero"><div><span>Status discipline</span><h2>Death, body, consciousness, possession, and Nen continuation remain separate</h2><p>This route now reads directly from every chapter-bounded character dossier. It does not infer that a dead body, displaced consciousness, legal identity, and continuing Nen are the same state.</p></div><dl><div><dt>Exceptional records</dt><dd>{exceptional.length}</dd></div><div><dt>Confirmed dead</dt><dd>{confirmedDead.length}</dd></div><div><dt>Boundary</dt><dd>Ch. {spoilerLimit}</dd></div></dl></section>
    <section className="succession-body-state-ledger" aria-labelledby="succession-body-state-ledger-title"><header><Skull size={19} aria-hidden="true" /><div><span>Body-state ledger</span><h3 id="succession-body-state-ledger-title">Distinct body conditions in the canonical state graph</h3></div></header><div>{bodyStates.map((dossier) => <article className={`is-${stateTone(dossier.state?.bodyState)}`} key={`${dossier.character.id}-${dossier.state?.bodyState}`}><span>{dossier.state?.bodyState}</span><h4>{dossier.character.name}</h4><p>{dossier.state?.operationalState}</p></article>)}</div></section>
    <section className="succession-body-state-legend" aria-labelledby="succession-body-state-legend-title"><header><AlertTriangle size={18} aria-hidden="true" /><div><span>Consciousness distinctions</span><h3 id="succession-body-state-legend-title">Identity and continuation states requiring context</h3></div></header><div>{consciousnessStates.map((dossier) => <article key={`${dossier.character.id}-${dossier.state?.consciousnessState}`}><h4>{dossier.character.name}</h4><p>{dossier.state?.consciousnessState}</p></article>)}</div></section>
    <section className="succession-dead-directory" aria-labelledby="succession-dead-directory-title"><header><span>Confirmed canonical records</span><h3 id="succession-dead-directory-title">Characters known dead at Chapter {spoilerLimit}</h3></header><div>{confirmedDead.map((dossier) => <button type="button" key={dossier.character.id} onClick={() => onNavigate('characters', { entity: dossier.character.id })}><EntityVisual entity={dossier.character} compact /><span>{dossier.character.name}</span><small>{dossier.state?.bodyState}</small></button>)}</div></section>
  </div>;
}
