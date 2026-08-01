import { successionArchiveData as predecessorData } from './entitiesProductClosureCorrections.js';
import { normalizeInformationConsistencyData } from './informationConsistency.js';

/* Phase 3 is a compatibility-preserving data layer. It keeps every canonical
   entity, stable ID, chapter boundary, and legacy display sentence while adding
   structured state codes, normalized aliases, canonical role tokens, and an
   explicit version marker for downstream validation. */
export const successionArchiveData = normalizeInformationConsistencyData(predecessorData);
