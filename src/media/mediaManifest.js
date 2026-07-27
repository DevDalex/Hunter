/** @param {string} value */
const toPublicUrl = (value) => (value.startsWith('public/') ? `/${value.slice('public/'.length)}` : value);

/**
 * Canonical media inventory. This module is browser-safe data; build scripts
 * validate it with Zod before generating or packaging any variants.
 */
export const mediaManifest = {
  schemaVersion: 1,
  records: [
    {
      id: 'media:chimera-ant:kite-phase',
      alt: 'Kite during the Chimera Ant investigation in NGL',
      sourcePath: 'public/media/portraits/kite.webp',
      subjects: ['character:kite'],
      focalPoint: { x: 0.5, y: 0.16 },
      safeTextRegion: 'bottom',
      variants: {
        phase: {
          outputPath: 'public/media/generated/chimera-ant/kite-phase.avif',
          width: 1200,
          height: 800,
          format: 'avif',
          quality: 84,
        },
      },
    },
    {
      id: 'media:chimera-ant:meruem-phase',
      alt: 'Meruem during the Chimera Ant crisis and East Gorteau occupation',
      sourcePath: 'public/media/portraits/meruem.webp',
      subjects: ['character:meruem'],
      focalPoint: { x: 0.5, y: 0.14 },
      safeTextRegion: 'bottom',
      variants: {
        phase: {
          outputPath: 'public/media/generated/chimera-ant/meruem-phase.avif',
          width: 1200,
          height: 800,
          format: 'avif',
          quality: 84,
        },
      },
    },
    {
      id: 'media:chimera-ant:komugi-phase',
      alt: 'Komugi during her Gungi matches with Meruem',
      sourcePath: 'public/media/portraits/komugi.webp',
      subjects: ['character:komugi'],
      focalPoint: { x: 0.5, y: 0.13 },
      safeTextRegion: 'bottom',
      variants: {
        phase: {
          outputPath: 'public/media/generated/chimera-ant/komugi-phase.avif',
          width: 1200,
          height: 800,
          format: 'avif',
          quality: 84,
        },
      },
    },
    {
      id: 'media:chimera-ant:netero-phase',
      alt: 'Isaac Netero during the Royal Palace invasion',
      sourcePath: 'public/media/portraits/isaac-netero.webp',
      subjects: ['character:isaac-netero'],
      focalPoint: { x: 0.5, y: 0.1 },
      safeTextRegion: 'bottom',
      variants: {
        phase: {
          outputPath: 'public/media/generated/chimera-ant/netero-phase.avif',
          width: 1200,
          height: 800,
          format: 'avif',
          quality: 84,
        },
      },
    },
    {
      id: 'media:chimera-ant:gon-phase',
      alt: 'Gon Freecss during the Chimera Ant endgame',
      sourcePath: 'public/media/portraits/gon-freecss.webp',
      subjects: ['character:gon-freecss'],
      focalPoint: { x: 0.5, y: 0.12 },
      safeTextRegion: 'bottom',
      variants: {
        phase: {
          outputPath: 'public/media/generated/chimera-ant/gon-phase.avif',
          width: 1200,
          height: 800,
          format: 'avif',
          quality: 84,
        },
      },
    },
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
