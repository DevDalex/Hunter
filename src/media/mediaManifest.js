import { parseMediaManifest } from '../schemas/archiveSchemas.js';

/**
 * Canonical media inventory.
 *
 * New local originals should live under public/media/originals and declare one
 * or more generated variants under public/media/generated. External-only
 * records remain valid for provenance, but the Sharp pipeline processes only
 * records with sourcePath.
 */
export const mediaManifest = parseMediaManifest({
  schemaVersion: 1,
  records: [],
});

export const mediaRecordById = new Map(mediaManifest.records.map((record) => [record.id, record]));
