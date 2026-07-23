import { enrichedSpecifiedCards } from '../src/data/greed-island/specifiedCardsEnriched.js';
import {
  specifiedCardArchive,
  SPECIFIED_CARD_ARCHIVE_SOURCE,
} from '../src/data/greed-island/specifiedCardArchive.js';

const failures = [];
const allowedStatuses = new Set(['verified', 'unknown', 'undocumented']);
const hunterpediaHosts = new Set(['hunterxhunter.fandom.com', 'hunterxhunter.fandom.com']);

const isHunterpediaUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && hunterpediaHosts.has(url.hostname);
  } catch {
    return false;
  }
};

if (specifiedCardArchive.length !== 100) failures.push(`archive has ${specifiedCardArchive.length} records`);
if (enrichedSpecifiedCards.length !== 100) failures.push(`enriched registry has ${enrichedSpecifiedCards.length} records`);
if (!isHunterpediaUrl(SPECIFIED_CARD_ARCHIVE_SOURCE.href)) failures.push('archive table source is not an approved Hunterpedia URL');

for (const [index, card] of enrichedSpecifiedCards.entries()) {
  const expected = String(index).padStart(3, '0');
  if (card.id !== expected) failures.push(`${card.id}: expected ordered id ${expected}`);
  if (!card.description || card.description.length < 18) failures.push(`${card.id}: verified effect is missing or too short`);
  if (!card.materializedAs || card.materializedAs.length < 8) failures.push(`${card.id}: materialized form is missing`);
  if (!card.kind) failures.push(`${card.id}: material category is missing`);
  if (card.verification.description !== 'verified') failures.push(`${card.id}: description verification is not verified`);
  if (!allowedStatuses.has(card.acquisition.status)) failures.push(`${card.id}: invalid acquisition status ${card.acquisition.status}`);
  if (!new Set(['verified', 'undocumented']).has(card.story.status)) failures.push(`${card.id}: invalid story status ${card.story.status}`);
  if (!isHunterpediaUrl(card.acquisition.source)) failures.push(`${card.id}: invalid acquisition source`);
  if (!isHunterpediaUrl(card.story.source)) failures.push(`${card.id}: invalid story source`);
  if (card.acquisition.status === 'verified' && !card.acquisition.location) failures.push(`${card.id}: verified acquisition lacks a location`);
  if (card.story.status === 'verified') {
    if (!card.story.owners.length) failures.push(`${card.id}: verified story record has no documented owner or user`);
    if (!card.story.chapters.length && !card.story.episodes2011.length) failures.push(`${card.id}: verified story record has no chapter or episode mapping`);
  }
  if (!card.media?.filePage || !card.media?.remote) failures.push(`${card.id}: verified image provenance is incomplete`);
}

const effects = new Set(enrichedSpecifiedCards.map((card) => card.description));
if (effects.size !== 100) failures.push(`only ${effects.size}/100 effects are unique`);
const unknownAcquisitions = enrichedSpecifiedCards.filter((card) => card.acquisition.status === 'unknown');
if (!unknownAcquisitions.some((card) => card.id === '081')) failures.push('Blue Planet is not preserved as explicitly unknown');

if (failures.length) {
  throw new Error(`Greed Island archive audit failed:\n${failures.join('\n')}`);
}

const acquisitionCounts = Object.groupBy(enrichedSpecifiedCards, (card) => card.acquisition.status);
const verifiedStoryCount = enrichedSpecifiedCards.filter((card) => card.story.status === 'verified').length;
console.log(`Greed Island archive verified: 100/100 effects and material forms; ${acquisitionCounts.verified?.length || 0} verified acquisition routes; ${acquisitionCounts.unknown?.length || 0} explicitly unknown route; ${verifiedStoryCount} sourced story mappings.`);
