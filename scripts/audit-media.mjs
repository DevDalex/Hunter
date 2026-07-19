import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { priorityPortraits } from '../src/data/priorityMedia.generated.js';
import { blackWhaleRoomMedia } from '../src/data/blackWhaleMedia.generated.js';

const root = process.cwd();
const assert = (condition, message) => { if (!condition) throw new Error(`Media audit failed: ${message}`); };
const unique = (values) => new Set(values).size === values.length;
const approvedHosts = new Set(['hunterxhunter.fandom.com', 'static.wikia.nocookie.net']);
const approvedUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && approvedHosts.has(url.hostname);
  } catch { return false; }
};

assert(priorityPortraits.length === 106, `expected 106 priority portraits, found ${priorityPortraits.length}`);
assert(unique(priorityPortraits.map((record) => record.name)), 'priority portrait names must be unique');
assert(unique(priorityPortraits.map((record) => record.src)), 'local portrait paths must be unique');
assert(priorityPortraits.every((record) => record.storage === 'local' && record.src.startsWith('/media/portraits/') && record.src.endsWith('.webp')), 'every priority portrait must use a local WebP path');
assert(priorityPortraits.every((record) => Number.isInteger(record.width) && record.width > 0 && Number.isInteger(record.height) && record.height > 0), 'every priority portrait must have positive intrinsic dimensions');
assert(priorityPortraits.every((record) => /^\d+% \d+%$/.test(record.focal)), 'every priority portrait must have a percentage focal point');
assert(priorityPortraits.every((record) => approvedUrl(record.articleSource) && approvedUrl(record.imageSource)), 'every priority portrait must retain approved Hunterpedia article and image sources');
await Promise.all(priorityPortraits.map((record) => access(path.join(root, 'public', record.src.slice(1)))));

assert(blackWhaleRoomMedia.length === 29, `expected 29 stabilized Black Whale images, found ${blackWhaleRoomMedia.length}`);
assert(unique(blackWhaleRoomMedia.map((record) => record.imageSource)), 'Black Whale source images must be unique');
assert(unique(blackWhaleRoomMedia.map((record) => record.src)), 'Black Whale local image paths must be unique');
assert(blackWhaleRoomMedia.every((record) => record.storage === 'local' && record.src.startsWith('/media/rooms/') && record.src.endsWith('.webp')), 'every stabilized Black Whale image must use a local WebP path');
assert(blackWhaleRoomMedia.every((record) => Number.isInteger(record.width) && record.width > 0 && Number.isInteger(record.height) && record.height > 0), 'every Black Whale image must have positive intrinsic dimensions');
assert(blackWhaleRoomMedia.every((record) => /^\d+% \d+%$/.test(record.focal)), 'every Black Whale image must have a percentage focal point');
assert(blackWhaleRoomMedia.every((record) => approvedUrl(record.articleSource) && approvedUrl(record.imageSource)), 'every Black Whale image must retain approved Hunterpedia sources');
await Promise.all(blackWhaleRoomMedia.map((record) => access(path.join(root, 'public', record.src.slice(1)))));

const portraitFiles = (await readdir(path.join(root, 'public/media/portraits'))).filter((file) => !file.startsWith('.'));
assert(portraitFiles.length === priorityPortraits.length, `portrait directory contains ${portraitFiles.length} files for ${priorityPortraits.length} manifest records`);
assert(portraitFiles.every((file) => file.endsWith('.webp')), 'portrait directory may contain only normalized WebP files');

const fandomImage = await readFile(path.join(root, 'src/components/FandomImage.jsx'), 'utf8');
const safeImage = await readFile(path.join(root, 'src/components/SafeImage.jsx'), 'utf8');
const mediaRegistry = await readFile(path.join(root, 'src/data/mediaRegistry.js'), 'utf8');
const sourcePortrait = await readFile(path.join(root, 'src/components/SourcePortrait.jsx'), 'utf8');
const roster = await readFile(path.join(root, 'src/components/SuccessionRoster.jsx'), 'utf8');
const connectionBoard = await readFile(path.join(root, 'src/components/SuccessionConnectionBoard.jsx'), 'utf8');
const changelog = await readFile(path.join(root, 'src/data/referenceEntities.js'), 'utf8');

assert(!/\bfetch\s*\(|api\.php|localStorage|sessionStorage/.test(fandomImage), 'FandomImage must not perform network discovery or browser caching');
assert(fandomImage.includes('if (!fallbackImage || !available) return null'), 'image-less records must collapse instead of leaving a frame');
assert(safeImage.includes('width={media?.width') && safeImage.includes('height={media?.height') && safeImage.includes('objectPosition: media.focal'), 'SafeImage must apply dimensions and focal metadata');
assert(mediaRegistry.includes("return 'text-only'") && mediaRegistry.includes("find((record) => record.id === 'characters')?.textOnly"), 'media registry must retain text-only state and count character portrait candidates');
assert(sourcePortrait.includes('Special:Redirect/file') && sourcePortrait.includes('exhaustedPortraits') && !/\bfetch\s*\(|api\.php|localStorage|sessionStorage/.test(sourcePortrait), 'source portrait recovery must use bounded Hunterpedia file redirects with an explicit exhausted state');
assert(roster.includes("character.image && <div className=\"roster-card__image\""), 'Succession roster must omit the media area when no portrait exists');
assert(connectionBoard.includes('member.image && <span data-image-frame>'), 'connection board must omit the media area when no portrait exists');
assert(changelog.includes('Phase 7B media stabilization'), 'archive changelog is missing Phase 7B');

const componentDirectory = path.join(root, 'src/components');
const componentFiles = (await readdir(componentDirectory)).filter((file) => file.endsWith('.jsx'));
for (const file of componentFiles) {
  const source = await readFile(path.join(componentDirectory, file), 'utf8');
  for (const match of source.matchAll(/<FandomImage\b[\s\S]*?\/>/g)) {
    assert(/\bfallbackImage=/.test(match[0]), `${file} renders FandomImage without an explicit image record`);
  }
}

let legacyResolverExists = true;
try { await access(path.join(root, 'src/lib/hunterpediaMedia.js')); } catch { legacyResolverExists = false; }
assert(!legacyResolverExists, 'legacy runtime portrait resolver must remain removed');

console.log(`Media audit passed: ${priorityPortraits.length} local portraits, bounded Hunterpedia source recovery, and ${blackWhaleRoomMedia.length} stabilized Black Whale images; dimensions, focal points, and sources verified.`);
