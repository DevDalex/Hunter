import { specifiedCards as coreSpecifiedCards } from './specifiedCards.js';
import { getSpecifiedCardArchive } from './specifiedCardArchive.js';

function enrichCard(card) {
  const archive = getSpecifiedCardArchive(card.id);
  if (!archive) throw new Error(`Specified Slot ${card.id} is missing its deep archive record.`);

  return Object.freeze({
    ...card,
    description: archive.effect,
    materializedAs: archive.materializedAs,
    kind: archive.kind,
    acquisition: archive.acquisition,
    story: archive.story,
    verification: Object.freeze({
      ...card.verification,
      description: 'verified',
      acquisition: archive.acquisition.status,
      story: archive.story.status,
    }),
  });
}

export const enrichedSpecifiedCards = Object.freeze(coreSpecifiedCards.map(enrichCard));
export const enrichedSpecifiedCardById = new Map(enrichedSpecifiedCards.map((card) => [card.id, card]));
export const getEnrichedSpecifiedCard = (id) => enrichedSpecifiedCardById.get(String(id).padStart(3, '0')) || null;
