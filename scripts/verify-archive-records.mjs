import { CHIMERA_ANT_EPISODE_RANGE, chimeraAntPhases } from '../src/data/chimeraAntExperience.js';
import { phaseCollectionSchema } from '../src/schemas/archiveSchemas.js';

const phases = phaseCollectionSchema.parse(chimeraAntPhases);
const firstEpisode = phases[0]?.episodes[0];
const lastEpisode = phases.at(-1)?.episodes[1];

if (firstEpisode !== CHIMERA_ANT_EPISODE_RANGE[0] || lastEpisode !== CHIMERA_ANT_EPISODE_RANGE[1]) {
  throw new Error(
    `Chimera Ant phases cover Episodes ${firstEpisode}–${lastEpisode}; expected ${CHIMERA_ANT_EPISODE_RANGE[0]}–${CHIMERA_ANT_EPISODE_RANGE[1]}.`,
  );
}

console.log(
  `Archive records verified: ${phases.length} Chimera Ant phases, contiguous Episodes ${firstEpisode}–${lastEpisode}.`,
);
