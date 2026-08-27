import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const storyField = readFileSync(new URL('../src/components/TimelineStoryField.jsx', import.meta.url), 'utf8');
const selectors = readFileSync(new URL('../src/data/succession/selectors.js', import.meta.url), 'utf8');
const knowledgeFoundation = readFileSync(new URL('../src/data/succession/highValueIntelligenceFoundation.js', import.meta.url), 'utf8');

test('Timeline organization lens is wired only through canonical organization-event selectors', () => {
  assert.match(selectors, /const getEventsForOrganization = \(organizationId\) => resolveMany\(indexes\.eventsByOrganization\.get\(organizationId\), indexes\)/);
  assert.match(storyField, /buildEventEntityMap\(organizations, getEventsForOrganization\)/);
  assert.match(storyField, /canonicalEvent\?\.organizationIds/);
});

test('Timeline Nen lens is wired through canonical ability-event selectors with an explicit tagged fallback', () => {
  assert.match(selectors, /const getEventsForAbility = \(abilityId\) => resolveMany\(indexes\.eventsByAbility\.get\(abilityId\), indexes\)/);
  assert.match(storyField, /buildEventEntityMap\(abilities, getEventsForAbility\)/);
  assert.match(storyField, /canonicalEvent\?\.abilityIds/);
  assert.match(storyField, /Other Nen \/ ritual activity/);
});

test('Timeline knowledge lens consumes chapter-bounded published knowledge records', () => {
  const knowledgeRecordCount = (knowledgeFoundation.match(/entityType: 'knowledge-record'/g) || []).length;
  assert.ok(knowledgeRecordCount > 0, 'knowledge foundation contains no published knowledge records');
  assert.match(knowledgeFoundation, /chapterRange: range\(/);
  assert.match(storyField, /getEntitiesByType\('knowledge-record'\)/);
  assert.match(storyField, /Number\(record\.chapterRange\?\.start\)/);
});
