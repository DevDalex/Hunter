import { useEffect, useMemo, useRef, useState } from 'react';
import { resolveMediaAsset } from '../media/mediaManifest.js';

const normalizeSubject = (value = '') =>
  value
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, ' ')
    .trim()
    .replaceAll(/\s+/g, ' ');

const localPortraitBySubject = new Map([
  ['gon freecss', '/media/portraits/gon-freecss.webp'],
  ['gon', '/media/portraits/gon-freecss.webp'],
  ['killua zoldyck', '/media/portraits/killua-zoldyck.webp'],
  ['killua', '/media/portraits/killua-zoldyck.webp'],
  ['kurapika', '/media/portraits/kurapika.webp'],
  ['leorio paradinight', '/media/portraits/leorio-paradinight.webp'],
  ['leorio', '/media/portraits/leorio-paradinight.webp'],
  ['hisoka morow', '/media/portraits/hisoka-morow.webp'],
  ['hisoka', '/media/portraits/hisoka-morow.webp'],
  ['illumi zoldyck', '/media/portraits/illumi-zoldyck.webp'],
  ['illumi', '/media/portraits/illumi-zoldyck.webp'],
  ['gittarackur', '/media/portraits/illumi-zoldyck.webp'],
  ['gittarackur illumi', '/media/portraits/illumi-zoldyck.webp'],
  ['hanzo', '/media/portraits/hanzo.webp'],
  ['ponzu', '/media/portraits/ponzu.webp'],
  ['pokkle', '/media/portraits/pokkle.webp'],
  ['tonpa', '/media/portraits/tonpa.webp'],
  ['satotz', '/media/portraits/satotz.webp'],
  ['menchi', '/media/portraits/menchi.webp'],
  ['buhara', '/media/portraits/buhara.webp'],
  ['isaac netero', '/media/portraits/isaac-netero.webp'],
]);

const approvedExternalMediaHosts = new Set(['hunterxhunter.fandom.com', 'static.wikia.nocookie.net']);

/** @param {string} value */
const isApprovedExternalMedia = (value = '') => {
  try {
    const url = new URL(value, window.location.href);
    return url.protocol === 'https:' && approvedExternalMediaHosts.has(url.hostname);
  } catch {
    return false;
  }
};

/** @param {{ fallbackLabel?: string; alt?: string }} options */
const inferLocalPortraitFallback = ({ fallbackLabel, alt }) => {
  const candidates = [fallbackLabel, String(alt || '').split(',')[0]];
  for (const candidate of candidates) {
    const src = localPortraitBySubject.get(normalizeSubject(candidate));
    if (src) return src;
  }
  return '';
};

/**
 * @typedef {import('react').ImgHTMLAttributes<HTMLImageElement> & {
 *   fallbackSrc?: string;
 *   fallbackLabel?: string;
 *   eager?: boolean;
 *   priority?: 'high' | 'low' | 'auto';
 *   mediaId?: string;
 *   mediaVariant?: string;
 *   media?: { width?: number; height?: number; storage?: string; focal?: string } | null;
 *   onAvailabilityChange?: (available: boolean) => void;
 * }} SafeImageProps
 */

/** @param {SafeImageProps} imageProps */
export default function SafeImage(imageProps) {
  const {
    src,
    fallbackSrc = '',
    fallbackLabel = '',
    alt = '',
    className = '',
    loading = 'lazy',
    eager = false,
    priority,
    mediaId,
    mediaVariant = 'phase',
    media = null,
    onAvailabilityChange,
    style,
    ...props
  } = imageProps;

  const resolvedMedia = useMemo(() => resolveMediaAsset(mediaId, mediaVariant), [mediaId, mediaVariant]);
  const resolvedAlt = alt || resolvedMedia?.alt || fallbackLabel;
  const inferredFallbackSrc = useMemo(
    () => inferLocalPortraitFallback({ fallbackLabel, alt: resolvedAlt }),
    [fallbackLabel, resolvedAlt],
  );
  const sources = useMemo(
    () => [...new Set([resolvedMedia?.src, src, fallbackSrc, inferredFallbackSrc].filter(Boolean))],
    [fallbackSrc, inferredFallbackSrc, resolvedMedia?.src, src],
  );
  const [sourceIndex, setSourceIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [nearViewport, setNearViewport] = useState(eager);
  const availabilityCallback = useRef(onAvailabilityChange);
  const imageRef = useRef(/** @type {HTMLImageElement | null} */ (null));

  useEffect(() => {
    availabilityCallback.current = onAvailabilityChange;
  }, [onAvailabilityChange]);

  useEffect(() => {
    setSourceIndex(0);
    setLoaded(false);
    setUnavailable(false);
    setNearViewport(eager);
    availabilityCallback.current?.(Boolean(sources[0]));
  }, [eager, sources]);

  const activeSrc = sources[sourceIndex] || '';

  useEffect(() => {
    const image = imageRef.current;
    if (!image || nearViewport || eager) return undefined;
    if (typeof IntersectionObserver !== 'function') {
      setNearViewport(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        setNearViewport(true);
        observer.disconnect();
      },
      { rootMargin: '480px 0px' },
    );
    observer.observe(image);
    return () => observer.disconnect();
  }, [activeSrc, eager, nearViewport]);

  useEffect(() => {
    if (!activeSrc || loaded || unavailable || !nearViewport || !isApprovedExternalMedia(activeSrc)) return undefined;
    const timer = window.setTimeout(() => {
      setLoaded(false);
      if (sourceIndex < sources.length - 1) setSourceIndex((index) => index + 1);
      else {
        setUnavailable(true);
        availabilityCallback.current?.(false);
      }
    }, 2_200);
    return () => window.clearTimeout(timer);
  }, [activeSrc, loaded, nearViewport, sourceIndex, sources.length, unavailable]);

  if (!activeSrc || unavailable) {
    return fallbackLabel ? (
      <span
        className={`safe-image-placeholder${className ? ` ${className}` : ''}`}
        role="img"
        aria-label={resolvedAlt || fallbackLabel}
      >
        <b>{fallbackLabel}</b>
        <small>Visual unavailable</small>
      </span>
    ) : null;
  }

  return (
    <img
      {...props}
      ref={imageRef}
      className={`safe-image${className ? ` ${className}` : ''}`}
      src={activeSrc}
      alt={resolvedAlt}
      width={resolvedMedia?.width || media?.width || undefined}
      height={resolvedMedia?.height || media?.height || undefined}
      loading={eager ? 'eager' : loading}
      decoding="async"
      fetchPriority={priority || (eager ? 'high' : 'auto')}
      referrerPolicy="no-referrer"
      data-image-loaded={loaded ? 'true' : 'false'}
      data-image-fallback={sourceIndex > 0 ? 'true' : 'false'}
      data-media-id={resolvedMedia?.id || undefined}
      data-media-variant={resolvedMedia ? mediaVariant : undefined}
      data-media-safe-text={resolvedMedia?.safeTextRegion || undefined}
      data-media-storage={resolvedMedia?.storage || (activeSrc.startsWith('/media/') ? 'local' : media?.storage || undefined)}
      style={{ ...style, ...(resolvedMedia?.focal || media?.focal ? { objectPosition: resolvedMedia?.focal || media?.focal } : {}) }}
      onLoad={() => {
        setLoaded(true);
        availabilityCallback.current?.(true);
      }}
      onError={() => {
        setLoaded(false);
        if (sourceIndex < sources.length - 1) {
          setSourceIndex((index) => index + 1);
        } else {
          setUnavailable(true);
          availabilityCallback.current?.(false);
        }
      }}
    />
  );
}
