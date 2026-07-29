import '../../styles/succession-archive.css';
import './SuccessionArchiveContrast.css';
import './SuccessionArchiveLayoutFixes.css';
import './SuccessionArchiveCatalog.css';
import './SuccessionBlackWhaleTheme.css';
import './SuccessionCommandHome.css';
import './SuccessionOperationalWorkspaces.css';
import './SuccessionRoyalRegistry.css';
import './SuccessionVesselAtlas.css';
import './SuccessionNenContainment.css';
import './SuccessionIntelligenceOperations.css';
import './SuccessionTimelineCommand.css';
import './SuccessionReaderCommand.css';
import SuccessionArchiveApp from './SuccessionArchiveApp';
import SuccessionArchiveReaderRoute from './SuccessionArchiveReaderRoute';

export default function SuccessionArchiveEntry(props) {
  if (props.routeTarget === 'reader') return <SuccessionArchiveReaderRoute {...props} />;
  return <SuccessionArchiveApp {...props} />;
}
