import assert from 'node:assert/strict';
import test from 'node:test';
import { successionDays, successionPreludeEvents } from '../src/data/successionTimeline.js';
import {
  getEntitiesByType,
  getEventsForAbility,
  getEventsForOrganization,
} from '../src/data/succession/successionData.js';

const timelineEventIds = new Set([
  ...successionPreludeEvents.map((event) => event.id),
  ...successionDays.flatMap((day) => day.events.map((event) => event.id)),
]);

const intersectingEventIds = (entities, getEvents) => new Set(entities.flatMap((entity) => (
  getEvents(entity.id) || []
).map((event) => event.id).filter((id) => timelineEventIds.has(id))));

test('Timeline organization lens has explicit canonical event intersections', () => {
  const organizations = getEntitiesByType('organization');
  const intersections = intersectingEventIds(organizations, getEventsForOrganization);
  assert.ok(intersections.size > 0, 'no canonical organization-linked events intersect the Timeline chronology');
});

test('Timeline Nen lens has explicit canonical ability-event intersections', () => {
  const abilities = getEntitiesByType('ability');
  const intersections = intersectingEventIds(abilities, getEventsForAbility);
  assert.ok(intersections.size > 0, 'no canonical ability-linked events intersect the Timeline chronology');
});

test('Timeline knowledge lens has chapter-bounded published records', () => {
  const records = getEntitiesByType('knowledge-record');
  assert.ok(records.length > 0, 'no published knowledge records are available to the Timeline lens');
  assert.ok(records.every((record) => Number.isFinite(Number(record.chapterRange?.start))), 'knowledge lens contains records without a chapterRange.start');
});
