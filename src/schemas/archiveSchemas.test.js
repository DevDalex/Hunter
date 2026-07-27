import { describe, expect, it } from 'vitest';
import { chimeraAntPhases } from '../data/chimeraAntExperience.js';
import {
  claimSchema,
  episodeRangeSchema,
  mediaManifestSchema,
  mediaRecordSchema,
  phaseCollectionSchema,
} from './archiveSchemas.js';

describe('archive schemas', () => {
  it('accepts ordered episode ranges', () => {
    expect(episodeRangeSchema.parse([76, 136])).toEqual([76, 136]);
  });

  it('rejects reversed episode ranges', () => {
    expect(() => episodeRangeSchema.parse([136, 76])).toThrow(/must end at or after/i);
  });

  it('requires media provenance', () => {
    expect(() =>
      mediaRecordSchema.parse({
        id: 'media:meruem-portrait',
        alt: 'Meruem portrait',
      }),
    ).toThrow(/sourcePath or sourceUrl/i);
  });

  it('rejects duplicate media ids', () => {
    const record = {
      id: 'media:meruem-portrait',
      alt: 'Meruem portrait',
      sourceUrl: 'https://example.com/meruem.webp',
    };

    expect(() =>
      mediaManifestSchema.parse({
        schemaVersion: 1,
        records: [record, record],
      }),
    ).toThrow(/duplicate media id/i);
  });

  it('requires evidence for canonical claims', () => {
    expect(() =>
      claimSchema.parse({
        id: 'claim:meruem-location',
        subject: 'character:meruem',
        predicate: 'locatedAt',
        object: 'location:east-gorteau-palace',
        evidence: [],
        reviewStatus: 'draft',
      }),
    ).toThrow();
  });

  it('validates the production Chimera Ant phase sequence', () => {
    const phases = phaseCollectionSchema.parse(chimeraAntPhases);
    expect(phases).toHaveLength(7);
    expect(phases[0].episodes).toEqual([76, 85]);
    expect(phases.at(-1)?.episodes).toEqual([132, 136]);
  });
});
