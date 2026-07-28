/**
 * @typedef {{
 *   outputPath: string;
 *   width: number;
 *   height: number;
 *   format: 'avif' | 'webp' | 'jpeg' | 'png';
 *   quality: number;
 * }} BrowserMediaVariant
 */

/**
 * @typedef {{
 *   id: string;
 *   alt: string;
 *   sourcePath?: string;
 *   sourceUrl?: string;
 *   subjects: string[];
 *   focalPoint: { x: number; y: number };
 *   safeTextRegion: 'none' | 'top' | 'right' | 'bottom' | 'left';
 *   variants: Record<string, BrowserMediaVariant>;
 * }} BrowserMediaRecord
 */

/** @param {string} value */
const toPublicUrl = (value) => (value.startsWith('public/') ? `/${value.slice('public/'.length)}` : value);

/**
 * @param {string} outputPath
 * @param {number} width
 * @param {number} height
 * @returns {BrowserMediaVariant}
 */
const avifVariant = (outputPath, width, height) => ({ outputPath, width, height, format: 'avif', quality: 84 });

/**
 * @param {{
 *   id: string;
 *   alt: string;
 *   slug: string;
 *   subjects: string[];
 *   focalPoint: { x: number; y: number };
 *   phase?: boolean;
 * }} options
 * @returns {BrowserMediaRecord}
 */
const chimeraPortrait = ({ id, alt, slug, subjects, focalPoint, phase = false }) => ({
  id,
  alt,
  sourcePath: `public/media/portraits/${slug}.webp`,
  subjects,
  focalPoint,
  safeTextRegion: 'bottom',
  variants: {
    ...(phase
      ? { phase: avifVariant(`public/media/generated/chimera-ant/${slug}-phase.avif`, 1200, 800) }
      : {}),
    card: avifVariant(`public/media/generated/chimera-ant/${slug}-card.avif`, 720, 480),
    portrait: avifVariant(`public/media/generated/chimera-ant/${slug}-portrait.avif`, 600, 750),
  },
});

/**
 * Canonical media inventory. This module is browser-safe data; build scripts
 * validate it with Zod before generating or packaging any variants.
 * @type {{ schemaVersion: 1; records: BrowserMediaRecord[] }}
 */
export const mediaManifest = {
  schemaVersion: 1,
  records: [
    chimeraPortrait({
      id: 'media:chimera-ant:kite-phase',
      alt: 'Kite during the Chimera Ant investigation in NGL',
      slug: 'kite',
      subjects: ['character:kite'],
      focalPoint: { x: 0.5, y: 0.16 },
      phase: true,
    }),
    chimeraPortrait({
      id: 'media:chimera-ant:meruem-phase',
      alt: 'Meruem during the Chimera Ant crisis and East Gorteau occupation',
      slug: 'meruem',
      subjects: ['character:meruem'],
      focalPoint: { x: 0.5, y: 0.14 },
      phase: true,
    }),
    chimeraPortrait({
      id: 'media:chimera-ant:komugi-phase',
      alt: 'Komugi during her Gungi matches with Meruem',
      slug: 'komugi',
      subjects: ['character:komugi'],
      focalPoint: { x: 0.5, y: 0.13 },
      phase: true,
    }),
    chimeraPortrait({
      id: 'media:chimera-ant:netero-phase',
      alt: 'Isaac Netero during the Royal Palace invasion',
      slug: 'isaac-netero',
      subjects: ['character:isaac-netero'],
      focalPoint: { x: 0.5, y: 0.1 },
      phase: true,
    }),
    chimeraPortrait({
      id: 'media:chimera-ant:gon-phase',
      alt: 'Gon Freecss during the Chimera Ant endgame',
      slug: 'gon-freecss',
      subjects: ['character:gon-freecss'],
      focalPoint: { x: 0.5, y: 0.12 },
      phase: true,
    }),
    chimeraPortrait({
      id: 'media:chimera-ant:killua',
      alt: 'Killua Zoldyck during the Chimera Ant operation',
      slug: 'killua-zoldyck',
      subjects: ['character:killua-zoldyck'],
      focalPoint: { x: 0.5, y: 0.18 },
    }),
    chimeraPortrait({
      id: 'media:chimera-ant:neferpitou',
      alt: 'Neferpitou during the Royal Palace conflict',
      slug: 'neferpitou',
      subjects: ['character:neferpitou'],
      focalPoint: { x: 0.5, y: 0.16 },
    }),
    chimeraPortrait({
      id: 'media:chimera-ant:shaiapouf',
      alt: 'Shaiapouf during the Royal Palace conflict',
      slug: 'shaiapouf',
      subjects: ['character:shaiapouf'],
      focalPoint: { x: 0.5, y: 0.17 },
    }),
    chimeraPortrait({
      id: 'media:chimera-ant:menthuthuyoupi',
      alt: 'Menthuthuyoupi during the Royal Palace invasion',
      slug: 'menthuthuyoupi',
      subjects: ['character:menthuthuyoupi'],
      focalPoint: { x: 0.5, y: 0.17 },
    }),
    chimeraPortrait({
      id: 'media:chimera-ant:morel',
      alt: 'Morel Mackernasey during the extermination mission',
      slug: 'morel-mackernasey',
      subjects: ['character:morel-mackernasey'],
      focalPoint: { x: 0.5, y: 0.18 },
    }),
    chimeraPortrait({
      id: 'media:chimera-ant:knov',
      alt: 'Knov during the Royal Palace preparation operation',
      slug: 'knov',
      subjects: ['character:knov'],
      focalPoint: { x: 0.5, y: 0.16 },
    }),
    chimeraPortrait({
      id: 'media:chimera-ant:knuckle',
      alt: 'Knuckle Bine during the extermination mission',
      slug: 'knuckle-bine',
      subjects: ['character:knuckle-bine'],
      focalPoint: { x: 0.5, y: 0.18 },
    }),
    chimeraPortrait({
      id: 'media:chimera-ant:shoot',
      alt: 'Shoot McMahon during the extermination mission',
      slug: 'shoot-mcmahon',
      subjects: ['character:shoot-mcmahon'],
      focalPoint: { x: 0.5, y: 0.18 },
    }),
    chimeraPortrait({
      id: 'media:chimera-ant:zeno',
      alt: 'Zeno Zoldyck during the Royal Palace entry',
      slug: 'zeno-zoldyck',
      subjects: ['character:zeno-zoldyck'],
      focalPoint: { x: 0.5, y: 0.16 },
    }),
  ],
};

export const mediaRecordById = new Map(mediaManifest.records.map((record) => [record.id, record]));

/**
 * Resolve a manifest record to a browser-ready source and metadata.
 * @param {string | null | undefined} mediaId
 * @param {string} [variantName]
 */
export function resolveMediaAsset(mediaId, variantName = 'phase') {
  if (!mediaId) return null;
  const record = mediaRecordById.get(mediaId);
  if (!record) return null;

  const variant = record.variants[variantName];
  const source = variant?.outputPath || record.sourcePath || record.sourceUrl;
  if (!source) return null;

  return {
    id: record.id,
    src: source.startsWith('http') ? source : toPublicUrl(source),
    alt: record.alt,
    width: variant?.width,
    height: variant?.height,
    safeTextRegion: record.safeTextRegion,
    focal: `${record.focalPoint.x * 100}% ${record.focalPoint.y * 100}%`,
    storage: source.startsWith('public/') ? 'local-generated' : record.sourceUrl ? 'external' : 'local',
  };
}
