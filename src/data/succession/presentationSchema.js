import { z } from 'zod';

const chapter = z.number().int().positive();
const focalPoint = z.string().regex(/^\d{1,3}% \d{1,3}%$/, 'Expected focal point such as "50% 35%"');

export const successionCompositionSchema = z.object({
  treatment: z.enum([
    'full-bleed',
    'portrait-crop',
    'panel-strip',
    'fragment',
    'background-mass',
    'edge-crop',
    'floating-plate',
    'chapter-sequence',
  ]),
  focal: focalPoint.optional(),
  emphasis: z.enum(['quiet', 'supporting', 'primary', 'monument']).default('supporting'),
  density: z.enum(['air', 'editorial', 'dense']).default('editorial'),
  preferredSpan: z.number().int().min(1).max(12).optional(),
}).strict();

export const successionPresentationRecordSchema = z.object({
  id: z.string().min(1),
  entityId: z.string().min(1).optional(),
  eventId: z.string().min(1).optional(),
  mediaId: z.string().min(1).optional(),
  spoilerFrom: chapter,
  validFrom: chapter.optional(),
  validThrough: chapter.nullable().optional(),
  importance: z.enum(['ambient', 'supporting', 'major', 'turning-point']).default('supporting'),
  certainty: z.enum(['confirmed', 'inferred', 'uncertain', 'disputed']).default('confirmed'),
  composition: successionCompositionSchema.optional(),
  storyThreadIds: z.array(z.string().min(1)).default([]),
  relatedEntityIds: z.array(z.string().min(1)).default([]),
}).strict().superRefine((record, context) => {
  if (record.validFrom && record.validFrom < record.spoilerFrom) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['validFrom'],
      message: 'validFrom cannot precede spoilerFrom',
    });
  }
  if (record.validThrough && record.validFrom && record.validThrough < record.validFrom) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['validThrough'],
      message: 'validThrough cannot precede validFrom',
    });
  }
});

export const parseSuccessionPresentationRecord = (record) => successionPresentationRecordSchema.parse(record);
export const safeParseSuccessionPresentationRecord = (record) => successionPresentationRecordSchema.safeParse(record);
