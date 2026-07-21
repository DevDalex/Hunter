import { specifiedCards } from '../src/data/greed-island/specifiedCards.js';
import { specifiedCardMedia } from '../src/data/greed-island/specifiedCardMedia.js';

const assert = (condition, message) => {
  if (!condition) throw new Error(`Greed Island media audit failed: ${message}`);
};

assert(specifiedCards.length === 100, `expected 100 cards, found ${specifiedCards.length}`);
assert(specifiedCardMedia.length === 100, `expected 100 media records, found ${specifiedCardMedia.length}`);
assert(new Set(specifiedCardMedia.map((item) => item.fileName)).size === 100, 'file names are not unique');
assert(new Set(specifiedCardMedia.map((item) => item.remote)).size === 100, 'remote image URLs are not unique');

for (const [index, card] of specifiedCards.entries()) {
  const expectedId = String(index).padStart(3, '0');
  assert(card.id === expectedId, `card ${index} has id ${card.id}`);
  assert(card.verification.media === 'verified-remote', `card ${card.id} is not marked verified-remote`);
  assert(card.media?.cardId === card.id, `card ${card.id} is linked to the wrong media record`);
  assert(card.media?.sourcePage === 'https://hunterxhunter.fandom.com/wiki/Greed_Island_Card_Lists', `card ${card.id} has the wrong source page`);
  assert(card.media?.remote.startsWith('https://hunterxhunter.fandom.com/wiki/Special:Redirect/file/'), `card ${card.id} does not use the stable Hunterpedia file redirect`);
  assert(card.media?.filePage.startsWith('https://hunterxhunter.fandom.com/wiki/File:'), `card ${card.id} has no Hunterpedia file page`);
  assert(card.media?.fallback === 'generated-card-back', `card ${card.id} has an unsafe fallback`);
  assert(!/portraits|gon|killua|biscuit/i.test(`${card.media?.remote} ${card.media?.local || ''}`), `card ${card.id} points to character portrait media`);
}

assert(specifiedCards[2].media.fileName === 'Patch of Shore (G.I card) =scan=.png', 'card 002 filename exception was lost');
assert(specifiedCards[17].media.fileName === 'Breath of Archangel (G.I card) =scan=.png', 'card 017 filename exception was lost');
assert(specifiedCards[37].media.fileName === 'Fledgling Athlete (G.I card).png', 'card 037 filename exception was lost');
assert(specifiedCards[53].media.fileName === 'King Great White Beetle (G.I card) =scan=.png', 'card 053 filename exception was lost');
assert(specifiedCards[82].media.fileName === 'Staff of Judgement (G.I card) =scan=.png', 'card 082 filename exception was lost');
assert(specifiedCards[85].media.fileName === 'Sacrifice Armor (G.I card) =scan=.png', 'card 085 filename exception was lost');

console.log('Greed Island media audit passed: 100/100 Specified Slot cards have unique verified Hunterpedia image references and safe card-back fallbacks.');
