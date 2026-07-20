import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

export const slugifyMediaKey = (value) => String(value || '')
  .toLowerCase()
  .normalize('NFKD')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

export const stableHunterpediaImageUrl = (source) => {
  const marker = '/wiki/Special:Redirect/file/';
  if (!source.includes(marker)) return source;
  const filename = decodeURIComponent(source.split(marker)[1] || '').replaceAll(' ', '_');
  const hash = createHash('md5').update(filename).digest('hex');
  return `https://static.wikia.nocookie.net/hunterxhunter/images/${hash[0]}/${hash.slice(0, 2)}/${encodeURIComponent(filename).replaceAll('%2F', '/')}/revision/latest`;
};

export const readWebpDimensions = async (file) => {
  const bytes = await readFile(file);
  if (bytes.subarray(0, 4).toString('ascii') !== 'RIFF' || bytes.subarray(8, 12).toString('ascii') !== 'WEBP') {
    throw new Error(`Not a WebP file: ${file}`);
  }
  let offset = 12;
  while (offset + 8 <= bytes.length) {
    const type = bytes.subarray(offset, offset + 4).toString('ascii');
    const size = bytes.readUInt32LE(offset + 4);
    const data = offset + 8;
    if (type === 'VP8X' && data + 10 <= bytes.length) {
      return { width: bytes.readUIntLE(data + 4, 3) + 1, height: bytes.readUIntLE(data + 7, 3) + 1 };
    }
    if (type === 'VP8L' && data + 5 <= bytes.length && bytes[data] === 0x2f) {
      return {
        width: 1 + bytes[data + 1] + ((bytes[data + 2] & 0x3f) << 8),
        height: 1 + ((bytes[data + 2] & 0xc0) >> 6) + (bytes[data + 3] << 2) + ((bytes[data + 4] & 0x0f) << 10),
      };
    }
    if (type === 'VP8 ' && data + 10 <= bytes.length && bytes[data + 3] === 0x9d && bytes[data + 4] === 0x01 && bytes[data + 5] === 0x2a) {
      return { width: bytes.readUInt16LE(data + 6) & 0x3fff, height: bytes.readUInt16LE(data + 8) & 0x3fff };
    }
    offset = data + size + (size % 2);
  }
  throw new Error(`Could not read WebP dimensions for ${file}`);
};
