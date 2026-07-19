import { useEffect, useRef, useState } from 'react';

export default function SafeImage({ src, alt, className = '', loading = 'lazy', eager = false, priority, media = null, onAvailabilityChange, style, ...props }) {
  const [failed, setFailed] = useState(!src);
  const [loaded, setLoaded] = useState(false);
  const availabilityCallback = useRef(onAvailabilityChange);

  useEffect(() => { availabilityCallback.current = onAvailabilityChange; }, [onAvailabilityChange]);

  useEffect(() => {
    setFailed(!src);
    setLoaded(false);
    availabilityCallback.current?.(Boolean(src));
  }, [src]);

  if (!src || failed) return null;

  return (
    <img
      {...props}
      className={`safe-image${className ? ` ${className}` : ''}`}
      src={src}
      alt={alt}
      width={media?.width || undefined}
      height={media?.height || undefined}
      loading={eager ? 'eager' : loading}
      decoding="async"
      fetchPriority={priority || (eager ? 'high' : 'auto')}
      referrerPolicy="no-referrer"
      data-image-loaded={loaded ? 'true' : 'false'}
      data-media-storage={media?.storage || undefined}
      style={{ ...style, ...(media?.focal ? { objectPosition: media.focal } : {}) }}
      onLoad={() => {
        setLoaded(true);
        availabilityCallback.current?.(true);
      }}
      onError={() => {
        setLoaded(false);
        setFailed(true);
        availabilityCallback.current?.(false);
      }}
    />
  );
}
