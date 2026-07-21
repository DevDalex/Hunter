import { useEffect, useMemo, useRef, useState } from 'react';
import { priorityPortraitByName } from '../data/priorityMedia.generated';

const normalizeSubject = (value = '') => value
  .toLowerCase()
  .replaceAll(/[^a-z0-9]+/g, ' ')
  .trim()
  .replaceAll(/\s+/g, ' ');

const portraitAliases = new Map([
  ['gon', 'Gon Freecss'],
  ['killua', 'Killua Zoldyck'],
  ['leorio', 'Leorio Paradinight'],
  ['hisoka', 'Hisoka Morow'],
  ['illumi', 'Illumi Zoldyck'],
  ['gittarackur', 'Illumi Zoldyck'],
  ['gittarackur illumi', 'Illumi Zoldyck'],
]);

const localPortraitBySubject = new Map(
  [...priorityPortraitByName.entries()].map(([name, media]) => [normalizeSubject(name), media.src]),
);

const inferLocalPortraitFallback = ({ fallbackLabel, alt }) => {
  const candidates = [fallbackLabel, String(alt || '').split(',')[0]];
  for (const candidate of candidates) {
    const normalized = normalizeSubject(candidate);
    if (!normalized) continue;
    const canonical = portraitAliases.get(normalized);
    const src = localPortraitBySubject.get(normalizeSubject(canonical || normalized));
    if (src) return src;
  }
  return '';
};

export default function SafeImage({
  src,
  fallbackSrc = '',
  fallbackLabel = '',
  alt,
  className = '',
  loading = 'lazy',
  eager = false,
  priority,
  media = null,
  onAvailabilityChange,
  style,
  ...props
}) {
  const inferredFallbackSrc = useMemo(
    () => inferLocalPortraitFallback({ fallbackLabel, alt }),
    [alt, fallbackLabel],
  );
  const sources = useMemo(
    () => [...new Set([src, fallbackSrc, inferredFallbackSrc].filter(Boolean))],
    [fallbackSrc, inferredFallbackSrc, src],
  );
  const [sourceIndex, setSourceIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const availabilityCallback = useRef(onAvailabilityChange);

  useEffect(() => { availabilityCallback.current = onAvailabilityChange; }, [onAvailabilityChange]);
  useEffect(() => {
    setSourceIndex(0);
    setLoaded(false);
    setUnavailable(false);
    availabilityCallback.current?.(Boolean(sources[0]));
  }, [sources]);

  const activeSrc = sources[sourceIndex] || '';
  if (!activeSrc || unavailable) {
    return fallbackLabel ? <span className={`safe-image-placeholder${className ? ` ${className}` : ''}`} role="img" aria-label={alt || fallbackLabel}><b>{fallbackLabel}</b><small>Visual unavailable</small></span> : null;
  }

  return (
    <img
      {...props}
      className={`safe-image${className ? ` ${className}` : ''}`}
      src={activeSrc}
      alt={alt}
      width={media?.width || undefined}
      height={media?.height || undefined}
      loading={eager ? 'eager' : loading}
      decoding="async"
      fetchPriority={priority || (eager ? 'high' : 'auto')}
      referrerPolicy="no-referrer"
      data-image-loaded={loaded ? 'true' : 'false'}
      data-image-fallback={sourceIndex > 0 ? 'true' : 'false'}
      data-media-storage={activeSrc.startsWith('/media/') ? 'local' : media?.storage || undefined}
      style={{ ...style, ...(media?.focal ? { objectPosition: media.focal } : {}) }}
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
