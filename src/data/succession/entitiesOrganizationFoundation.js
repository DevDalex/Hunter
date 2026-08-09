import { successionArchiveData as characterFoundationData } from './entitiesCharacterFoundation.js';
import {
  organizationPersonnelHistory as baseOrganizationPersonnelHistory,
  organizationStateProfiles as baseOrganizationStateProfiles,
} from './organizationStateFoundation.js';
import {
  organizationPersonnelHistoryCorrections,
  organizationStateProfileCorrections,
} from './organizationStateCorrections.js';
import { organizationState379Corrections } from './organizationState379Corrections.js';
import { organizationState384Corrections } from './organizationState384Corrections.js';

const mergeRecordMaps = (baseMap, ...correctionMaps) => Object.freeze(Object.fromEntries(
  [...new Set([
    ...Object.keys(baseMap),
    ...correctionMaps.flatMap((map) => Object.keys(map)),
  ])].map((key) => {
    const records = new Map((baseMap[key] || []).map((record) => [record.id, record]));
    for (const correctionMap of correctionMaps) {
      for (const correction of correctionMap[key] || []) records.set(correction.id, correction);
    }
    return [key, Object.freeze([...records.values()].sort((left, right) => left.chapterRange.start - right.chapterRange.start || left.id.localeCompare(right.id)))];
  }),
));

const organizationStateProfiles = mergeRecordMaps(
  baseOrganizationStateProfiles,
  organizationStateProfileCorrections,
  organizationState379Corrections,
  organizationState384Corrections,
);
const organizationPersonnelHistory = mergeRecordMaps(baseOrganizationPersonnelHistory, organizationPersonnelHistoryCorrections);

export const successionArchiveData = Object.freeze({
  ...characterFoundationData,
  organizationStateProfiles,
  organizationPersonnelHistory,
});
