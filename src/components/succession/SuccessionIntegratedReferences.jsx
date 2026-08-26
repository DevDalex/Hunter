import { lazy, Suspense } from 'react';
import PageIntro from '../PageIntro';
import ReferenceBackbonePanel from '../ReferenceBackbonePanel';
import SpoilerControl from '../SpoilerControl';
import { ARCHIVE_BOUNDARY } from '../../data/archiveMeta';
import { referencePages } from '../../data/routeManifest';
import { routeModuleLoaders } from '../../lib/routePreload';
import './SuccessionIntegratedReferences.css';
import './SuccessionIntegratedReferenceReboot.css';

const NenEncyclopedia = lazy(routeModuleLoaders.nen);
const nenReferencePage = referencePages.find((page) => page.id === 'nen');

const RouteLoading = ({ label }) => (
  <section className="route-loading" role="status" aria-live="polite" aria-busy="true">
    <span />
    <strong>Opening {label}…</strong>
  </section>
);

export default function SuccessionIntegratedReferences({
  routeParams,
  spoilerLimit,
  onSpoilerChange,
  onNavigate,
}) {
  return (
    <section className="succession-integrated-reference" aria-label={`${nenReferencePage.title} inside the Succession Contest Archive`}>
      <PageIntro
        kicker={`${nenReferencePage.kicker} · Succession Contest Archive`}
        title={nenReferencePage.title}
        description={`${nenReferencePage.description} This reference lives inside the unified Succession Contest application.`}
      >
        <dl className="page-intro__facts">
          <div><dt>Archive</dt><dd>Succession Contest</dd></div>
          <div><dt>Module</dt><dd>General Nen library</dd></div>
          <div><dt>Reading boundary</dt><dd>Ch. {spoilerLimit}</dd></div>
        </dl>
      </PageIntro>

      <details className="spoiler-settings">
        <summary>Reading boundary <b>Chapter {spoilerLimit}</b></summary>
        <SpoilerControl
          value={spoilerLimit}
          latestChapter={ARCHIVE_BOUNDARY}
          onChange={onSpoilerChange}
        />
      </details>

      <ReferenceBackbonePanel
        domain="nen"
        onSearch={(search) => onNavigate('nen', { scope: 'encyclopedia', search })}
      />

      <Suspense fallback={<RouteLoading label={nenReferencePage.label.toLowerCase()} />}>
        <NenEncyclopedia
          initialQuery={routeParams.search || ''}
          spoilerLimit={spoilerLimit}
        />
      </Suspense>
    </section>
  );
}
