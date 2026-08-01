import {
  AlertTriangle,
  BadgeCheck,
  BrainCircuit,
  Crown,
  Scale,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import {
  getCanonicalCharacterState,
  getCharacterAuthorityProfile,
  getCharacterLoyaltyProfile,
  getEntitiesByType,
  getEntityById,
  getRoyalDossierConsistencyProfile,
} from '../../data/succession/successionData';
import './SuccessionInformationConsistencyPanel.css';

const labelize = (value) => String(value || 'unknown')
  .replaceAll('-', ' ')
  .replace(/\b\w/g, (letter) => letter.toUpperCase());

const selectedCharacter = (activeId, routeParams = {}) => {
  if (!['characters', 'princes', 'queens'].includes(activeId)) return null;
  const direct = routeParams.entity ? getEntityById(routeParams.entity) : null;
  if (direct?.entityType === 'character') return direct;
  const princeOrder = Number(routeParams.prince);
  if (activeId === 'princes' && Number.isFinite(princeOrder)) {
    return getEntitiesByType('character').find((character) => character.princeOrder === princeOrder) || null;
  }
  if (activeId === 'queens' && routeParams.focus) {
    const focus = String(routeParams.focus).toLocaleLowerCase();
    return getEntitiesByType('character').find((character) => (character.roles || []).includes('queen')
      && character.name.toLocaleLowerCase().includes(focus)) || null;
  }
  return null;
};

const StateCell = ({ icon: Icon, label, value, description }) => <article>
  <header><Icon size={16} aria-hidden="true" /><span>{label}</span></header>
  <strong>{value}</strong>
  <p>{description}</p>
</article>;

export default function SuccessionInformationConsistencyPanel({ activeId, routeParams, spoilerLimit }) {
  const character = selectedCharacter(activeId, routeParams);
  if (!character) return null;

  const state = getCanonicalCharacterState(character.id, spoilerLimit);
  const authority = getCharacterAuthorityProfile(character.id, spoilerLimit);
  const loyalty = getCharacterLoyaltyProfile(character.id, spoilerLimit);
  const royal = getRoyalDossierConsistencyProfile(character.id, spoilerLimit);
  if (!state || !authority || !loyalty) return null;

  const officialRoles = authority.officialRoles.map((role) => role.label).join(' · ') || 'No formal role published';
  const declared = loyalty.declaredAffiliations
    .map((record) => record.organization?.name)
    .filter(Boolean);
  const operational = loyalty.operationalAlignments
    .map((record) => record.alignedWith?.name)
    .filter(Boolean);
  const missing = royal?.completeness.missing || [];
  const summaryColumns = royal ? 3 : 2;

  return <aside className="succession-information-consistency" aria-labelledby="succession-information-consistency-title">
    <header className="succession-information-consistency__header">
      <div>
        <span><BadgeCheck size={16} aria-hidden="true" /> Phase 3 normalized intelligence</span>
        <h2 id="succession-information-consistency-title">Identity, authority, and alignment are separate records.</h2>
        <p>The archive preserves chapter-local facts without converting official position, declared affiliation, or observed operations into a claim about private intent.</p>
      </div>
      <dl style={{ gridTemplateColumns: `repeat(${summaryColumns}, minmax(0, 1fr))` }}>
        <div><dt>Boundary</dt><dd>Chapter {spoilerLimit}</dd></div>
        <div><dt>State tuple</dt><dd>{state.impossibleStateReasons.length ? 'Review required' : 'Valid'}</dd></div>
        {royal && <div><dt>Royal sections</dt><dd>{royal.completeness.present}/{royal.completeness.total}</dd></div>}
      </dl>
    </header>

    <section className="succession-information-consistency__states" aria-label="Separated body, identity, and consciousness states">
      <StateCell icon={UserRound} label="Body" value={state.body.label} description={state.body.description} />
      <StateCell icon={Crown} label="Identity" value={state.identity.label} description={state.identity.description} />
      <StateCell icon={BrainCircuit} label="Consciousness" value={state.consciousness.label} description={state.consciousness.description} />
    </section>

    <div className="succession-information-consistency__separation">
      <section>
        <header><Scale size={17} aria-hidden="true" /><div><span>Official authority</span><h3>{labelize(authority.officialRoleKind)}</h3></div></header>
        <dl>
          <div><dt>Registered roles</dt><dd>{officialRoles}</dd></div>
          <div><dt>Mandate</dt><dd>{authority.mandate}</dd></div>
          <div><dt>Authority</dt><dd>{authority.authority}</dd></div>
        </dl>
      </section>

      <section>
        <header><ShieldCheck size={17} aria-hidden="true" /><div><span>Operational loyalty evidence</span><h3>{loyalty.evidenceLabel}</h3></div></header>
        <dl>
          <div><dt>Declared affiliations</dt><dd>{declared.join(' · ') || 'None published'}</dd></div>
          <div><dt>Operational alignments</dt><dd>{operational.join(' · ') || 'None demonstrated at this boundary'}</dd></div>
          <div><dt>Private intent</dt><dd>Not inferred</dd></div>
        </dl>
      </section>
    </div>

    {state.impossibleStateReasons.length > 0 && <section className="succession-information-consistency__warning">
      <AlertTriangle size={17} aria-hidden="true" />
      <div><strong>State tuple requires editorial review.</strong><p>{state.impossibleStateReasons.join(' ')}</p></div>
    </section>}

    {royal && <section className="succession-information-consistency__royal" aria-label="Royal dossier section consistency">
      <header><span>Royal dossier contract</span><strong>{royal.completeness.complete ? 'Complete structure' : `${missing.length} unresolved section${missing.length === 1 ? '' : 's'}`}</strong></header>
      <div>{Object.entries(royal.sections).map(([id, section]) => <span className={section.present ? 'is-present' : 'is-missing'} key={id}>{section.present ? <BadgeCheck size={13} aria-hidden="true" /> : <AlertTriangle size={13} aria-hidden="true" />}{labelize(id)}</span>)}</div>
    </section>}
  </aside>;
}
