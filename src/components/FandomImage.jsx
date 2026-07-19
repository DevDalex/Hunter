import { useEffect, useRef, useState } from 'react';
import SafeImage from './SafeImage';

const titleFromSource = (source) => {
  try {
    const url = new URL(source);
    return decodeURIComponent(url.pathname.split('/wiki/')[1] || '').replaceAll('_', ' ');
  } catch {
    return '';
  }
};

export default function FandomImage({ source, title, alt, className = '', eager = false, linked = true, fallbackImage = '', media = null, onAvailabilityChange }) {
  const pageTitle = title || titleFromSource(source);
  const [available, setAvailable] = useState(Boolean(fallbackImage));
  const availabilityCallback = useRef(onAvailabilityChange);

  useEffect(() => { availabilityCallback.current = onAvailabilityChange; }, [onAvailabilityChange]);
  useEffect(() => {
    setAvailable(Boolean(fallbackImage));
    availabilityCallback.current?.(Boolean(fallbackImage));
  }, [fallbackImage]);

  if (!fallbackImage || !available) return null;
  const attributionSource = media?.imageSource || fallbackImage || source;
  const image = <SafeImage src={fallbackImage} media={media} alt={alt || `${pageTitle} image from Hunterpedia`} eager={eager} onAvailabilityChange={(next) => { setAvailable(next); availabilityCallback.current?.(next); }} />;

  return (
    <figure className={`fandom-image${className ? ` ${className}` : ''}`} data-image-frame data-media-state={media?.storage || 'verified-remote'}>
      {linked ? <a href={attributionSource} target="_blank" rel="noreferrer">{image}</a> : image}
      <figcaption>Hunterpedia image{media?.storage === 'local' ? ' · locally stored' : ''}</figcaption>
    </figure>
  );
}
