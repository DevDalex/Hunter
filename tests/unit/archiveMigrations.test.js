import { describe, expect, it } from 'vitest';
import {
  CURRENT_ARCHIVE_SCHEMA_VERSION,
  migrateArchiveDataset,
} from '../../src/schemas/archiveMigrations.js';

describe('archive dataset migrations', () => {
  it('accepts the current version unchanged', () => {
    const dataset = migrateArchiveDataset({
      schemaVersion: CURRENT_ARCHIVE_SCHEMA_VERSION,
      dataset: 'chimera-ant-phases',
      records: [{ id: 'phase-one' }],
    });

    expect(dataset).toEqual({
      schemaVersion: CURRENT_ARCHIVE_SCHEMA_VERSION,
      dataset: 'chimera-ant-phases',
      records: [{ id: 'phase-one' }],
    });
  });

  it('migrates a schema-zero items collection to records', () => {
    const dataset = migrateArchiveDataset({
      schemaVersion: 0,
      dataset: 'legacy-phases',
      items: [{ id: 'phase-one' }],
    });

    expect(dataset.schemaVersion).toBe(CURRENT_ARCHIVE_SCHEMA_VERSION);
    expect(dataset.records).toEqual([{ id: 'phase-one' }]);
    expect(dataset).not.toHaveProperty('items');
  });

  it('rejects future schemas instead of guessing', () => {
    expect(() =>
      migrateArchiveDataset({
        schemaVersion: CURRENT_ARCHIVE_SCHEMA_VERSION + 1,
        dataset: 'future-records',
        records: [],
      }),
    ).toThrow(/future schema/);
  });

  it('rejects legacy datasets without migratable records', () => {
    expect(() =>
      migrateArchiveDataset({
        schemaVersion: 0,
        dataset: 'broken-records',
      }),
    ).toThrow(/requires records or items/);
  });
});
