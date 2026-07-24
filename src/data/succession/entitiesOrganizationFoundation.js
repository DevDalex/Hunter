import { successionArchiveData as characterFoundationData } from './entitiesCharacterFoundation.js';
import {
  organizationPersonnelHistory,
  organizationStateProfiles,
} from './organizationStateFoundation.js';

export const successionArchiveData = Object.freeze({
  ...characterFoundationData,
  organizationStateProfiles,
  organizationPersonnelHistory,
});
