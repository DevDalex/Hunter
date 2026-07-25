import { lazy, Suspense } from 'react';
import { getEntitiesByType } from '../../data/succession/successionData';
import OriginalSuccessionArchiveApp from './SuccessionArchiveApp.jsx';
import SuccessionArchiveShell from './SuccessionArchiveShell';
import { ArchiveState } from './SuccessionArchivePrimitives';

const FamilyTree = lazy(() => import('../FamilyTree'));

const Loading = () => <ArchiveState kind="loading" title="Opening royal family tree" description="Loading the diagram inside the Succession Archive shell." />;

export default function SuccessionArchiveApp(props) {
  const treeView = props.routeTarget === 'princes' && props.routeParams?.view === 'tree';
  if (!treeView) return <OriginalSuccessionArchiveApp {...props} />;

  const princes = getEntitiesByType('character').filter((entity) => (entity.roles || []).includes('prince'));
  const openPrince = (order) => {
    const entity = princes.find((record) => record.princeOrder === Number(order));
    props.onNavigate('characters', entity ? { entity: entity.id } : {});
  };

  return <SuccessionArchiveShell
    activeId="princes"
    routeParams={props.routeParams}
    spoilerLimit={props.spoilerLimit}
    onSpoilerChange={props.onSpoilerChange}
    onNavigate={props.onNavigate}
    onExitArchive={props.onExitArchive}
    onOpenSearch={props.onOpenSearch}
    onIntent={props.onIntent}
  >
    <Suspense fallback={<Loading />}>
      <div className="succession-migration-note"><b>Diagram view</b><span>The family tree remains a visual companion; prince records open in the chapter-bounded character dossier.</span><button type="button" onClick={() => props.onNavigate('princes')}>Back to prince records</button></div>
      <FamilyTree spoilerLimit={props.spoilerLimit} onOpenPrince={openPrince} />
    </Suspense>
  </SuccessionArchiveShell>;
}
