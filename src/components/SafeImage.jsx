import { useEffect, useMemo, useRef, useState } from 'react';
import { nenVisualForLabel } from '../data/nenVisuals';

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
  const embeddedNenVisual = useMemo(() => nenVisualForLabel(alt || fallbackLabel), [alt, fallbackLabel]);
  const sources = useMemo(() => [...new Set([embeddedNenVisual || src, fallbackSrc].filter(Boolean))], [embeddedNenVisual, fallbackSrc, src]);
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
      data-media-storage={media?.storage || undefined}
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
