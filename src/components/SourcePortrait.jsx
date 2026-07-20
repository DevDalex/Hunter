import { useEffect, useState } from 'react';
import SafeImage from './SafeImage';

const initialsFor = (name = '') => name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase();

export default function SourcePortrait({ item, alt = '', className = '', eager = false, decorative = false, showState = false }) {
  const source = item?.image || '';
  const [available, setAvailable] = useState(Boolean(source));

  useEffect(() => {
    setAvailable(Boolean(source));
  }, [source]);

  if (!source || !available) {
    return <span className={`source-portrait source-portrait--missing${className ? ` ${className}` : ''}`} aria-label={`No verified Hunterpedia portrait available for ${item?.name || 'this record'}`}><b>{initialsFor(item?.name)}</b>{showState && <small>Portrait unavailable</small>}</span>;
  }

  return <span className={`source-portrait${item?.media?.storage === 'local' ? ' is-stored' : ' is-verified-remote'}${className ? ` ${className}` : ''}`} data-image-frame>
    <SafeImage
      src={source}
      media={item?.media}
      alt={decorative ? '' : (alt || `${item?.name} portrait from Hunterpedia`)}
      eager={eager}
      onAvailabilityChange={setAvailable}
    />
    {showState && <small>{item?.media?.storage === 'local' ? 'Stored Hunterpedia portrait' : 'Verified Hunterpedia portrait'}</small>}
  </span>;
}

export const sourcePortraitStats = {
  locallyStored: 106,
  verifiedRemote: 14,
  sourceCandidates: 0,
  totalCharacters: 644,
};
