import { useEffect, useMemo } from 'react';
import { getCharacterDossier } from '../data/succession/successionData';

export default function TimelineCharacterSpatialFollower({ requestedState = {}, onNavigate }) {
  const characterId = requestedState.character || '';
  const chapter = Number(requestedState.chapter);
  const locationId = useMemo(() => {
    if (!characterId || !Number.isFinite(chapter)) return '';
    const dossier = getCharacterDossier(characterId, chapter);
    return dossier?.location?.id || dossier?.state?.locationId || '';
  }, [chapter, characterId]);

  useEffect(() => {
    if (!locationId || requestedState.spaceLocation === locationId) return;
    const { event: _event, ...preserved } = requestedState;
    onNavigate?.({ ...preserved, scope: 'events', chapter, spaceLocation: locationId });
  }, [chapter, locationId, onNavigate, requestedState]);

  return null;
}
