import {
  CHIMERA_ANT_EPISODE_RANGE,
  chimeraAntPhaseDataset,
} from '../src/data/chimeraAntExperience.js';
import { phaseCollectionSchema } from '../src/schemas/archiveSchemas.js';
import {
  CURRENT_ARCHIVE_SCHEMA_VERSION,
  migrateArchiveDataset,
} from '../src/schemas/archiveMigrations.js';

const dataset = migrateArchiveDataset(chimeraAntPhaseDataset);
const phases = phaseCollectionSchema.parse(dataset.records);
const firstEpisode = phases[0]?.episodes[0];
const lastEpisode = phases.at(-1)?.episodes[1];

if (dataset.dataset !== 'chimera-ant-phases') {
  throw new Error(`Unexpected archive dataset: ${dataset.dataset}.`);
}
if (firstEpisode !== CHIMERA_ANT_EPISODE_RANGE[0] || lastEpisode !== CHIMERA_ANT_EPISODE_RANGE[1]) {
  throw new Error(
    `Chimera Ant phases cover Episodes ${firstEpisode}–${lastEpisode}; expected ${CHIMERA_ANT_EPISODE_RANGE[0]}–${CHIMERA_ANT_EPISODE_RANGE[1]}.`,
  );
}

console.log(
  `Archive records verified: schema ${CURRENT_ARCHIVE_SCHEMA_VERSION}, ${phases.length} Chimera Ant phases, contiguous Episodes ${firstEpisode}–${lastEpisode}.`,
);
