import { ArchiveCard, ArchiveSection, EvidenceBadge, StatusPill } from '../ArchiveUI';
import {
  SUCCESSION_VISUAL_FOUNDATION_VERSION,
  successionSemanticStates,
  successionVisualComponentContracts,
  successionVisualPrinciples,
  successionVisualTokenGroups,
} from '../../data/succession/visualDesignSystem';
import { ArchiveState } from './SuccessionArchivePrimitives';
import './SuccessionVisualFoundationPreview.css';

const sampleStates = ['confirmed', 'inferred', 'uncertain', 'pending'];

/**
 * Development-only visual contract preview.
 *
 * This component is intentionally not registered as a public archive route.
 * Later Batch 1 work may mount it in a local-only harness or screenshot suite.
 */
export default function SuccessionVisualFoundationPreview() {
  return <main className="succession-visual-preview" aria-labelledby="succession-visual-foundation-preview-title">
    <ArchiveSection
      id="succession-visual-foundation-preview"
      kicker="Development contract"
      title="Succession visual foundation"
      description={SUCCESSION_VISUAL_FOUNDATION_VERSION}
    >
      <section className="succession-visual-preview__principles" aria-labelledby="succession-visual-preview-principles">
        <h2 id="succession-visual-preview-principles">Presentation principles</h2>
        <div>{successionVisualPrinciples.map((principle) => <ArchiveCard key={principle.id} eyebrow={principle.id} title={principle.rule} />)}</div>
      </section>

      <section aria-labelledby="succession-visual-preview-tokens">
        <h2 id="succession-visual-preview-tokens">Token groups</h2>
        <div className="succession-visual-preview__token-grid">
          {successionVisualTokenGroups.map((group) => <article key={group.id}><code>{group.cssPrefix}</code><strong>{group.id}</strong><p>{group.purpose}</p></article>)}
        </div>
      </section>

      <section aria-labelledby="succession-visual-preview-states">
        <h2 id="succession-visual-preview-states">Evidence and status states</h2>
        <div className="succession-visual-preview__states">
          {sampleStates.map((state) => state === 'pending'
            ? <StatusPill key={state} tone="debt">Pending</StatusPill>
            : <EvidenceBadge key={state} state={state === 'uncertain' ? 'unclear' : state}>{state}</EvidenceBadge>)}
        </div>
        <dl>{successionSemanticStates.map((state) => <div key={state.id}><dt>{state.label}</dt><dd>{state.description}</dd></div>)}</dl>
      </section>

      <section aria-labelledby="succession-visual-preview-components">
        <h2 id="succession-visual-preview-components">Component contracts</h2>
        <div className="succession-visual-preview__components">
          {successionVisualComponentContracts.map((contract) => <article key={contract.id}><code>{contract.selector}</code><strong>{contract.id}</strong><p>{contract.purpose}</p></article>)}
        </div>
      </section>

      <section aria-label="State examples" className="succession-visual-preview__state-grid">
        <ArchiveState kind="loading" title="Opening chapter intelligence" description="The loading state preserves layout and communicates activity without decorative noise." />
        <ArchiveState kind="empty" title="No matching canonical records" description="Empty states explain why information is absent and what the user can do next." />
        <ArchiveState kind="error" title="The workspace could not be opened" description="Error states preserve context and distinguish technical failure from missing research." />
      </section>
    </ArchiveSection>
  </main>;
}
