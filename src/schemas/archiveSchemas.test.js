import { describe, expect, it } from 'vitest';
import {
  claimSchema,
  episodeRangeSchema,
  mediaManifestSchema,
  mediaRecordSchema,
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
});
