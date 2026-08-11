import { successionArchiveData as characterFoundationData } from './entitiesCharacterFoundation.js';
import { organizationPersonnelHistory as baseOrganizationPersonnelHistory, organizationStateProfiles as baseOrganizationStateProfiles } from './organizationStateFoundation.js';
import { organizationPersonnelHistoryCorrections, organizationStateProfileCorrections } from './organizationStateCorrections.js';
import { organizationState379Corrections } from './organizationState379Corrections.js';
import { organizationState384Corrections } from './organizationState384Corrections.js';
import { organizationFoundation389Expansion } from './organizationFoundation389Expansion.js';
import { organizationState389Corrections } from './organizationState389Corrections.js';
import { organizationState390Corrections } from './organizationState390Corrections.js';
import { organizationState391Corrections } from './organizationState391Corrections.js';
import { organizationState392Corrections } from './organizationState392Corrections.js';
import { organizationState393Corrections } from './organizationState393Corrections.js';
import { organizationState394Corrections } from './organizationState394Corrections.js';
import { organizationState395Corrections } from './organizationState395Corrections.js';
import { organizationState399Corrections } from './organizationState399Corrections.js';
import { organizationState400Corrections } from './organizationState400Corrections.js';
import { organizationState400LegacySplits } from './organizationState400LegacySplits.js';
import { organizationState402LegacySplits } from './organizationState402LegacySplits.js';
import { organizationState402Corrections } from './organizationState402Corrections.js';
import { organizationState403LegacySplits } from './organizationState403LegacySplits.js';
import { organizationState403Corrections } from './organizationState403Corrections.js';
import { organizationState404LegacySplits } from './organizationState404LegacySplits.js';
import { organizationState404Corrections } from './organizationState404Corrections.js';
import { organizationState405LegacySplits } from './organizationState405LegacySplits.js';
import { organizationState405Corrections } from './organizationState405Corrections.js';

const uniqueById = (values) => [...new Map(values.map((value) => [value.id, value])).values()];
const mergeRecordMaps = (baseMap, ...correctionMaps) => Object.freeze(Object.fromEntries(
  [...new Set([...Object.keys(baseMap), ...correctionMaps.flatMap((map) => Object.keys(map))])].map((key) => {
    const records = new Map((baseMap[key] || []).map((record) => [record.id, record]));
    for (const correctionMap of correctionMaps) for (const correction of correctionMap[key] || []) records.set(correction.id, correction);
    return [key, Object.freeze([...records.values()].sort((left, right) => left.chapterRange.start - right.chapterRange.start || left.id.localeCompare(right.id)))];
  }),
));

const organizations = Object.freeze(uniqueById([...characterFoundationData.organizations, ...organizationFoundation389Expansion]));

const organizationStateProfiles = mergeRecordMaps(
  baseOrganizationStateProfiles,
  organizationStateProfileCorrections,
  organizationState379Corrections,
  organizationState384Corrections,
  organizationState389Corrections,
  organizationState390Corrections,
  organizationState391Corrections,
  organizationState392Corrections,
  organizationState393Corrections,
  organizationState394Corrections,
  organizationState395Corrections,
  organizationState399Corrections,
  organizationState400Corrections,
  organizationState400LegacySplits,
  organizationState402LegacySplits,
  organizationState402Corrections,
  organizationState403LegacySplits,
  organizationState403Corrections,
  organizationState404LegacySplits,
  organizationState404Corrections,
  organizationState405LegacySplits,
  organizationState405Corrections,
);
const organizationPersonnelHistory = mergeRecordMaps(baseOrganizationPersonnelHistory, organizationPersonnelHistoryCorrections);

export const successionArchiveData = Object.freeze({ ...characterFoundationData, organizations, organizationStateProfiles, organizationPersonnelHistory });