import { z } from 'zod';

const archiveIdPattern = /^[a-z][a-z0-9]*(?::[a-z0-9][a-z0-9-]*)+$/;
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const localMediaPathPattern = /^(public|src)\/[a-zA-Z0-9_./-]+$/;

export const archiveIdSchema = z.string().trim().regex(archiveIdPattern, 'Use a namespaced archive id.');
export const slugSchema = z.string().trim().regex(slugPattern, 'Use a lowercase kebab-case slug.');

/** @param {string} label */
const orderedRangeSchema = (label) =>
  z.tuple([z.number().int().nonnegative(), z.number().int().nonnegative()]).superRefine(([start, end], context) => {
    if (end < start) {
      context.addIssue({
        code: 'custom',
        message: `${label} range must end at or after its start.`,
      });
    }
  });

export const episodeRangeSchema = orderedRangeSchema('Episode');
export const chapterRangeSchema = orderedRangeSchema('Chapter');

export const confidenceSchema = z.enum([
  'explicit',
  'strong-inference',
  'reasonable-interpretation',
  'contested',
  'unknown',
]);

export const sourceRecordSchema = z.object({
  id: archiveIdSchema,
  kind: z.enum(['manga', 'anime', 'guidebook', 'production', 'reference', 'research-note']),
  title: z.string().trim().min(1),
  href: z.url(),
  chapter: z.number().int().positive().optional(),
  episode: z.number().int().positive().optional(),
  page: z.number().int().positive().optional(),
  timestampSeconds: z.number().nonnegative().optional(),
  reviewedAt: z.iso.datetime().optional(),
});

export const focalPointSchema = z.object({
  x: z.number().min(0).max(1),
  y: z.number().min(0).max(1),
});

export const mediaVariantSchema = z.object({
  outputPath: z.string().trim().regex(localMediaPathPattern),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  format: z.enum(['avif', 'webp', 'jpeg', 'png']),
  quality: z.number().int().min(1).max(100).default(82),
});

export const mediaRecordSchema = z
  .object({
    id: archiveIdSchema,
    alt: z.string().trim().min(1),
    sourcePath: z.string().trim().regex(localMediaPathPattern).optional(),
    sourceUrl: z.url().optional(),
    sourceRecordId: archiveIdSchema.optional(),
    subjects: z.array(archiveIdSchema).default([]),
    focalPoint: focalPointSchema.default({ x: 0.5, y: 0.5 }),
    safeTextRegion: z.enum(['none', 'top', 'right', 'bottom', 'left']).default('none'),
    variants: z.record(z.string().min(1), mediaVariantSchema).default({}),
  })
  .superRefine((record, context) => {
    if (!record.sourcePath && !record.sourceUrl) {
      context.addIssue({
        code: 'custom',
        message: 'A media record requires sourcePath or sourceUrl.',
      });
    }
  });

export const claimEvidenceSchema = z.object({
  sourceId: archiveIdSchema,
  page: z.number().int().positive().optional(),
  timestampSeconds: z.number().nonnegative().optional(),
  confidence: confidenceSchema,
  note: z.string().trim().min(1).optional(),
});

export const claimSchema = z
  .object({
    id: archiveIdSchema,
    subject: archiveIdSchema,
    predicate: z.string().trim().min(1),
    object: z.union([archiveIdSchema, z.string().trim().min(1), z.number(), z.boolean()]),
    validFromChapter: z.number().int().positive().optional(),
    validToChapter: z.number().int().positive().optional(),
    evidence: z.array(claimEvidenceSchema).min(1),
    reviewStatus: z.enum(['draft', 'reviewed', 'verified', 'contested']),
  })
  .superRefine((claim, context) => {
    if (
      claim.validFromChapter !== undefined &&
      claim.validToChapter !== undefined &&
      claim.validToChapter < claim.validFromChapter
    ) {
      context.addIssue({
        code: 'custom',
        message: 'Claim validity cannot end before it begins.',
      });
    }
  });

export const characterRecordSchema = z.object({
  id: archiveIdSchema,
  name: z.string().trim().min(1),
  aliases: z.array(z.string().trim().min(1)).default([]),
  firstChapter: z.number().int().positive().optional(),
  firstEpisode: z.number().int().positive().optional(),
  spoilerBoundary: z.object({
    chapter: z.number().int().positive().optional(),
    episode: z.number().int().positive().optional(),
  }),
  mediaIds: z.array(archiveIdSchema).default([]),
  sourceIds: z.array(archiveIdSchema).min(1),
});

export const phaseRecordSchema = z.object({
  id: slugSchema,
  number: z.number().int().positive(),
  episodes: episodeRangeSchema,
  title: z.string().trim().min(1),
  shortTitle: z.string().trim().min(1),
  openingCondition: z.string().trim().min(1),
  turningPoint: z.string().trim().min(1),
  closingCondition: z.string().trim().min(1),
  composition: slugSchema,
  tone: slugSchema,
});

export const phaseCollectionSchema = z.array(phaseRecordSchema).min(1).superRefine((phases, context) => {
  const ids = new Set();
  const numbers = new Set();

  phases.forEach((phase, index) => {
    if (ids.has(phase.id)) {
      context.addIssue({ code: 'custom', path: [index, 'id'], message: `Duplicate phase id: ${phase.id}` });
    }
    if (numbers.has(phase.number)) {
      context.addIssue({ code: 'custom', path: [index, 'number'], message: `Duplicate phase number: ${phase.number}` });
    }
    if (phase.number !== index + 1) {
      context.addIssue({
        code: 'custom',
        path: [index, 'number'],
        message: `Phase numbers must be sequential; expected ${index + 1}.`,
      });
    }
    if (index > 0 && phase.episodes[0] !== phases[index - 1].episodes[1] + 1) {
      context.addIssue({
        code: 'custom',
        path: [index, 'episodes'],
        message: `Phase ${phase.number} must begin immediately after Phase ${phase.number - 1}.`,
      });
    }
    ids.add(phase.id);
    numbers.add(phase.number);
  });
});

export const mediaManifestSchema = z
  .object({
    schemaVersion: z.literal(1),
    generatedAt: z.iso.datetime().optional(),
    records: z.array(mediaRecordSchema),
  })
  .superRefine((manifest, context) => {
    const ids = new Set();
    for (const [index, record] of manifest.records.entries()) {
      if (ids.has(record.id)) {
        context.addIssue({
          code: 'custom',
          path: ['records', index, 'id'],
          message: `Duplicate media id: ${record.id}`,
        });
      }
      ids.add(record.id);
    }
  });

/** @param {unknown} input */
export const parseMediaManifest = (input) => mediaManifestSchema.parse(input);
