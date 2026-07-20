import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { SITE_STATS } from '../src/data/archiveMeta.js';
import { characterDirectoryPolicy, characterProfileStats, featuredCharacterProfiles } from '../src/data/characterProfilePrototype.js';
import { isApprovedSourceUrl } from '../src/data/sourcePolicy.js';

const assert = (condition, message) => {
  if (!condition) throw new Error(`Character profile audit failed: ${message}`);
};
const unique = (values) => new Set(values).size === values.length;

const [encyclopediaData, charactersData, snapshotData, registryData, successionData] = await Promise.all([
  readFile(path.resolve('src/data/encyclopedia.js'), 'utf8'),
  readFile(path.resolve('src/data/characters.js'), 'utf8'),
  readFile(path.resolve('src/data/generalCharacterSnapshot.js'), 'utf8'),
  readFile(path.resolve('src/data/entityRegistry.js'), 'utf8'),
  readFile(path.resolve('src/data/successionRoster.js'), 'utf8'),
]);
const characterDirectorySources = `${charactersData}\n${snapshotData}\n${registryData}\n${successionData}`;

assert(SITE_STATS.characters >= 100, 'the character directory must remain a broad cast archive, not a reduced profile-only set');
assert(encyclopediaData.includes('export const encyclopediaRecords') && encyclopediaData.includes('characters: characterRecords.length'), 'the encyclopedia must retain its generated character directory and character statistics');
assert(encyclopediaData.includes("category: 'characters'") && encyclopediaData.includes('generalCharacterSnapshot.forEach'), 'the encyclopedia must continue building character records from the canonical directory sources');
assert(characterDirectoryPolicy.rules.some(([name]) => /No cast deletion/i.test(name)), 'directory policy must explicitly preserve all cast records');
assert(characterDirectoryPolicy.directoryLanes.length >= 3, 'character directory/dossier split needs visible lanes');
assert(characterProfileStats.profiles >= 6, 'Batch 9 must ship at least six flagship profile prototypes');
assert(unique(featuredCharacterProfiles.map((profile) => profile.id)), 'profile IDs must be unique');
assert(unique(featuredCharacterProfiles.map((profile) => profile.name)), 'profile names must be unique');

for (const profile of featuredCharacterProfiles) {
  assert(characterDirectorySources.includes(profile.name), `${profile.name} profile does not match the canonical character directory sources`);
  assert(isApprovedSourceUrl(profile.source), `${profile.name} primary source is not Hunterpedia/Fandom-approved`);
  assert(profile.sources.length >= 3 && profile.sources.every((source) => isApprovedSourceUrl(source.href)), `${profile.name} needs at least three approved source links`);
  for (const key of ['facts', 'story', 'relationships', 'nen', 'conflicts', 'organizations', 'locations', 'objects']) {
    assert(profile[key].length >= 3, `${profile.name} ${key} coverage is too thin`);
  }
  assert(profile.status && profile.lead && profile.role, `${profile.name} needs status, lead, and role copy`);
}

const component = await readFile(path.resolve('src/components/CharacterProfileDossier.jsx'), 'utf8');
assert(component.includes('DirectoryBoundary') && component.includes('characterDirectoryPolicy.rules'), 'component must show retained-directory state for non-profile characters');
assert(component.includes('characterProfileByName.get(selected.name)'), 'component must resolve profiles without replacing the base character record');
assert(component.includes('SourcePortrait'), 'profile dossiers must remain portrait-aware');

const encyclopedia = await readFile(path.resolve('src/components/EntityEncyclopedia.jsx'), 'utf8');
assert(encyclopedia.includes('CharacterProfileDossier') && encyclopedia.includes('<CharacterProfileDossier selected={selected} onOpenRelated={openRelated} />'), 'character encyclopedia must surface profile dossiers inside the selected record');
assert(encyclopedia.includes('Portrait gallery') && encyclopedia.includes('Research index') && encyclopedia.includes('Story groups'), 'existing character directory views must remain available');
assert(encyclopedia.includes('sourcePortraitStats.totalCharacters'), 'complete character directory coverage indicator must remain visible');

await access(path.resolve('src/components/CharacterProfileDossier.css'));
await access(path.resolve('docs/CHARACTER-PROFILES.md'));

console.log(`Character profile audit passed: ${SITE_STATS.characters} canonical character records, ${featuredCharacterProfiles.length} dossier prototypes, no deletion policy visible, and character directory views preserved.`);
