import { lazy, Suspense } from 'react';
import PageIntro from '../PageIntro';
import ReferenceBackbonePanel from '../ReferenceBackbonePanel';
import SpoilerControl from '../SpoilerControl';
import WorkspaceNav from '../WorkspaceNav';
import { ARCHIVE_BOUNDARY } from '../../data/archiveMeta';
import { referencePages } from '../../data/routeManifest';
import { routeModuleLoaders } from '../../lib/routePreload';
import './SuccessionIntegratedReferences.css';

const NenEncyclopedia = lazy(routeModuleLoaders.nen);
const WorldAtlas = lazy(routeModuleLoaders.worldAtlas);

const integratedPages = referencePages.map((page) => ({
  ...page,
  id: page.id === 'nen' ? 'nen-library' : 'world-library',
}));

const RouteLoading = ({ label }) => (
  <section className="route-loading" role="status" aria-live="polite" aria-busy="true">
    <span />
    <strong>Opening {label}…</strong>
  </section>
);

export default function SuccessionIntegratedReferences({
  mode,
  routeParams,
  spoilerLimit,
  onSpoilerChange,
  onNavigate,
}) {
  const isNen = mode === 'nen';
  const referencePage = referencePages.find((page) => page.id === (isNen ? 'nen' : 'atlas'));
  const activeId = isNen ? 'nen-library' : 'world-library';

  const selectIntegratedPage = (id) => {
    if (id === 'nen-library') {
      onNavigate('nen', { scope: 'encyclopedia' });
      return;
    }
    onNavigate('locations', { scope: 'world' });
  };

  return (
    <section className="succession-integrated-reference" aria-label={`${referencePage.title} inside the Succession Contest Archive`}>
      <PageIntro
        kicker={`${referencePage.kicker} · Succession Contest Archive`}
        title={referencePage.title}
        description={`${referencePage.description} This reference now lives inside the unified Succession Contest application.`}
      >
        <dl className="page-intro__facts">
          <div><dt>Archive</dt><dd>Succession Contest</dd></div>
          <div><dt>Module</dt><dd>{isNen ? 'General Nen library' : 'World and places'}</dd></div>
          <div><dt>Reading boundary</dt><dd>Ch. {spoilerLimit}</dd></div>
        </dl>
      </PageIntro>

      <WorkspaceNav
        items={integratedPages}
        activeId={activeId}
        onSelect={selectIntegratedPage}
        primaryIds={integratedPages.map((page) => page.id)}
        label="Succession reference modules"
      />

      <details className="spoiler-settings">
        <summary>Reading boundary <b>Chapter {spoilerLimit}</b></summary>
        <SpoilerControl
          value={spoilerLimit}
          latestChapter={ARCHIVE_BOUNDARY}
          onChange={onSpoilerChange}
        />
      </details>

      {isNen && (
        <ReferenceBackbonePanel
          domain="nen"
          onSearch={(search) => onNavigate('nen', { scope: 'encyclopedia', search })}
        />
      )}

      <Suspense fallback={<RouteLoading label={referencePage.label.toLowerCase()} />}>
        {isNen ? (
          <NenEncyclopedia
            initialQuery={routeParams.search || ''}
            spoilerLimit={spoilerLimit}
          />
        ) : (
          <WorldAtlas
            initialLocation={routeParams.location || routeParams.search || ''}
            initialMode={routeParams.mode || 'explore'}
            initialRoute={routeParams.route || ''}
            onOpenBlackWhale={() => onNavigate('black-whale')}
            onOpenEncyclopedia={(search) => onNavigate('nen', { scope: 'encyclopedia', search })}
            onOpenTimeline={(search) => onNavigate('timeline', { search })}
          />
        )}
      </Suspense>
    </section>
  );
}
