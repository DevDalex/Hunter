import { princeDossiers } from '../data/successionDossier';
import { getEntityById } from '../data/succession/successionData';
import { routeToHref } from '../lib/appRouter';
import RoyalFamilyGuardTree from './succession/RoyalFamilyGuardTree';

export default function FamilyTree({ onOpenPrince, spoilerLimit = Number.MAX_SAFE_INTEGER }) {
  const navigate = (target, params = {}) => {
    if (target === 'princes') {
      const entity = params.entity ? getEntityById(params.entity) : null;
      const prince = princeDossiers.find((record) => record.name === entity?.name)
        || princeDossiers.find((record) => record.order === Number(params.prince));
      if (prince) {
        onOpenPrince?.(prince.order);
        return;
      }
    }

    if (typeof window !== 'undefined') {
      window.location.assign(routeToHref('succession', target, params));
    }
  };

  return <RoyalFamilyGuardTree onNavigate={navigate} spoilerLimit={spoilerLimit} initialPrince={14} />;
}
