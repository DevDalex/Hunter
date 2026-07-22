import { specifiedCards } from '../src/data/greed-island/specifiedCards.js';
import { specifiedCardMedia } from '../src/data/greed-island/specifiedCardMedia.js';
import { specifiedCardLocalMedia } from '../src/data/greed-island/specifiedCardLocalMedia.generated.js';

const assert = (condition, message) => {
  if (!condition) throw new Error(`Greed Island media audit failed: ${message}`);
};

assert(specifiedCards.length === 100, `expected 100 cards, found ${specifiedCards.length}`);
assert(specifiedCardMedia.length === 100, `expected 100 media records, found ${specifiedCardMedia.length}`);
assert(specifiedCardLocalMedia.length === 100, `expected 100 stabilized local records, found ${specifiedCardLocalMedia.length}`);
assert(new Set(specifiedCardMedia.map((item) => item.fileName)).size === 100, 'file names are not unique');
assert(new Set(specifiedCardMedia.map((item) => item.remote)).size === 100, 'remote image URLs are not unique');
assert(new Set(specifiedCardMedia.map((item) => item.local)).size === 100, 'local image paths are not unique');

for (const [index, card] of specifiedCards.entries()) {
  const expectedId = String(index).padStart(3, '0');
  assert(card.id === expectedId, `card ${index} has id ${card.id}`);
  assert(card.media?.cardId === card.id, `card ${card.id} is linked to the wrong media record`);
  assert(card.media?.sourcePage === 'https://hunterxhunter.fandom.com/wiki/Greed_Island_Card_Lists', `card ${card.id} has the wrong source page`);
  assert(card.media?.remote.startsWith('https://hunterxhunter.fandom.com/wiki/Special:Redirect/file/'), `card ${card.id} does not use the stable Hunterpedia file redirect`);
  assert(card.media?.filePage.startsWith('https://hunterxhunter.fandom.com/wiki/File:'), `card ${card.id} has no Hunterpedia file page`);
  assert(card.media?.local === `/media/greed-island/cards/${card.id}.webp`, `card ${card.id} has the wrong local WebP path`);
  assert(card.media?.storage === 'local-webp-with-remote-source', `card ${card.id} is not marked as locally stabilized`);
  assert(Number.isInteger(card.media?.width) && card.media.width >= 200, `card ${card.id} has invalid local width`);
  assert(Number.isInteger(card.media?.height) && card.media.height >= 200, `card ${card.id} has invalid local height`);
  assert(card.media?.fallback === 'generated-card-back', `card ${card.id} has an unsafe fallback`);
  assert(!/\/media\/portraits\//i.test(`${card.media?.remote} ${card.media?.local || ''}`), `card ${card.id} points to a portrait path`);
}

assert(specifiedCards[2].media.fileName === 'Patch of Shore (G.I card) =scan=.png', 'card 002 filename exception was lost');
assert(specifiedCards[17].media.fileName === 'Breath of Archangel (G.I card) =scan=.png', 'card 017 filename exception was lost');
assert(specifiedCards[37].media.fileName === 'Fledgling Athlete (G.I card).png', 'card 037 filename exception was lost');
assert(specifiedCards[53].media.fileName === 'King Great White Beetle (G.I card) =scan=.png', 'card 053 filename exception was lost');
assert(specifiedCards[82].media.fileName === 'Staff of Judgement (G.I card) =scan=.png', 'card 082 filename exception was lost');
assert(specifiedCards[85].media.fileName === 'Sacrifice Armor (G.I card) =scan=.png', 'card 085 filename exception was lost');

console.log('Greed Island media audit passed: 100/100 Specified Slot cards have exact Hunterpedia provenance, verified local WebPs, remote sources, and safe card-back fallbacks.');
