import { z } from 'zod';
import { slugSchema } from './archiveSchemas.js';

export const CURRENT_ARCHIVE_SCHEMA_VERSION = 1;

const unversionedEnvelopeSchema = z
  .object({
    schemaVersion: z.number().int().nonnegative(),
    dataset: slugSchema,
    records: z.array(z.unknown()).optional(),
    items: z.array(z.unknown()).optional(),
    generatedAt: z.iso.datetime().optional(),
  })
  .passthrough();

export const archiveDatasetEnvelopeSchema = z.object({
  schemaVersion: z.literal(CURRENT_ARCHIVE_SCHEMA_VERSION),
  dataset: slugSchema,
  records: z.array(z.unknown()),
  generatedAt: z.iso.datetime().optional(),
});

/** @typedef {z.infer<typeof unversionedEnvelopeSchema>} UnversionedEnvelope */
/** @typedef {z.infer<typeof archiveDatasetEnvelopeSchema>} ArchiveDatasetEnvelope */
/** @typedef {(dataset: UnversionedEnvelope) => UnversionedEnvelope} ArchiveMigration */

/** @type {Map<number, ArchiveMigration>} */
const migrations = new Map([
  [
    0,
    (dataset) => {
      const records = dataset.records ?? dataset.items;
      if (!records) {
        throw new Error(`Schema 0 dataset ${dataset.dataset} requires records or items.`);
      }
      const { items: _legacyItems, ...rest } = dataset;
      return { ...rest, schemaVersion: 1, records };
    },
  ],
]);

/**
 * Migrate one canonical dataset to the current schema version.
 * The returned object is safe to pass to a dataset-specific record schema.
 * @param {unknown} input
 * @returns {ArchiveDatasetEnvelope}
 */
export function migrateArchiveDataset(input) {
  let dataset = unversionedEnvelopeSchema.parse(input);

  if (dataset.schemaVersion > CURRENT_ARCHIVE_SCHEMA_VERSION) {
    throw new Error(
      `Dataset ${dataset.dataset} uses future schema ${dataset.schemaVersion}; current code supports ${CURRENT_ARCHIVE_SCHEMA_VERSION}.`,
    );
  }

  while (dataset.schemaVersion < CURRENT_ARCHIVE_SCHEMA_VERSION) {
    const migration = migrations.get(dataset.schemaVersion);
    if (!migration) {
      throw new Error(`No migration registered from archive schema ${dataset.schemaVersion}.`);
    }
    const previousVersion = dataset.schemaVersion;
    dataset = unversionedEnvelopeSchema.parse(migration(dataset));
    if (dataset.schemaVersion <= previousVersion) {
      throw new Error(`Archive migration ${previousVersion} did not advance the schema version.`);
    }
  }

  return archiveDatasetEnvelopeSchema.parse(dataset);
}
