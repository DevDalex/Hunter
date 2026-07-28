import { describe, expect, it } from 'vitest';
import { chimeraPortraitMediaId } from '../../src/data/chimeraAntMedia.js';
import {
  mediaManifest,
  resolveMediaAsset,
} from '../../src/media/mediaManifest.js';

describe('managed Chimera Ant media', () => {
  it('registers all major phase and invasion portraits', () => {
    expect(mediaManifest.records).toHaveLength(14);
    expect(new Set(mediaManifest.records.map((record) => record.id)).size).toBe(14);

    for (const record of mediaManifest.records) {
      expect(record.variants.card).toMatchObject({ width: 720, height: 480, format: 'avif' });
      expect(record.variants.portrait).toMatchObject({ width: 600, height: 750, format: 'avif' });
    }
  });

  it('keeps phase variants for the five primary phase figures', () => {
    const phaseIds = [
      'media:chimera-ant:kite-phase',
      'media:chimera-ant:meruem-phase',
      'media:chimera-ant:komugi-phase',
      'media:chimera-ant:netero-phase',
      'media:chimera-ant:gon-phase',
    ];

    for (const id of phaseIds) {
      expect(resolveMediaAsset(id, 'phase')).toMatchObject({ width: 1200, height: 800 });
    }
  });

  it('resolves canonical aliases used by live components', () => {
    expect(chimeraPortraitMediaId('Pitou')).toBe('media:chimera-ant:neferpitou');
    expect(chimeraPortraitMediaId('Youpi')).toBe('media:chimera-ant:menthuthuyoupi');
    expect(chimeraPortraitMediaId('Netero')).toBe('media:chimera-ant:netero-phase');
    expect(chimeraPortraitMediaId('Killua')).toBe('media:chimera-ant:killua');
  });

  it('resolves generated card URLs with declared dimensions', () => {
    expect(resolveMediaAsset('media:chimera-ant:neferpitou', 'card')).toMatchObject({
      src: '/media/generated/chimera-ant/neferpitou-card.avif',
      width: 720,
      height: 480,
      storage: 'local-generated',
    });
  });
});
