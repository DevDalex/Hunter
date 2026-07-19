import { useEffect, useMemo, useState } from 'react';
import SafeImage from './SafeImage';

const resolvedPortraits = new Map();
const exhaustedPortraits = new Set();

const initialsFor = (name = '') => name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase();

const portraitAliases = {
  Lippo: ['Lippo HE Portrait.png'],
  Beans: ['Mamen Beans HE Portrait.png'],
  'Mamen Beans': ['Mamen Beans HE Portrait.png'],
  Zushi: ['Zushi HA Portrait.png'],
  Kastro: ['Kastro HA Portrait.png'],
  Gido: ['Gido HA Portrait.png'],
  Sadaso: ['Sadaso HA Portrait.png'],
  Riehlvelt: ['Riehlvelt HA Portrait.png'],
};

const portraitRedirect = (filename) => `https://hunterxhunter.fandom.com/wiki/Special:Redirect/file/${encodeURIComponent(filename)}`;
const sourceTitle = (source = '') => {
  try { return decodeURIComponent(new URL(source).pathname.split('/wiki/')[1] || '').replaceAll('_', ' '); }
  catch { return ''; }
};

const sourceCanResolvePortrait = (item) => {
  const title = sourceTitle(item?.source);
  if (!title || /^(List of|Category:|Unidentified|Unnamed)/i.test(title)) return false;
  if (/^(Unidentified|Unnamed|Cha-R Associate|Stone Wall|Temp Hunter|V6 Leader)/i.test(item?.name || '')) return false;
  return true;
};

const candidatesFor = (item) => {
  if (item?.image) return [item.image];
  if (!sourceCanResolvePortrait(item)) return [];
  const name = String(item.name || '').replace(/[†*]/g, '').replace(/\s*\([^)]*\)\s*$/, '').trim();
  return [
    ...(portraitAliases[name] || []),
    `${name} HE Portrait.png`,
    `${name} HA Portrait.png`,
    `${name} YN Portrait.png`,
    `${name} GI Portrait.png`,
    `${name} CA Portrait.png`,
    `${name} CE Portrait.png`,
    `${name} Portrait.png`,
    `${name} 2011 Portrait.png`,
    `${name} SC Portrait.png`,
    `${name} Manga Portrait.png`,
  ].map(portraitRedirect);
};

export default function SourcePortrait({ item, alt = '', className = '', eager = false, decorative = false, showState = false }) {
  const candidates = useMemo(() => candidatesFor(item), [item]);
  const cached = resolvedPortraits.get(item?.id || item?.name);
  const [candidateIndex, setCandidateIndex] = useState(() => cached ? Math.max(0, candidates.indexOf(cached)) : 0);
  const [available, setAvailable] = useState(() => Boolean(cached || candidates[0]));
  const key = item?.id || item?.name || '';

  useEffect(() => {
    const nextCached = resolvedPortraits.get(key);
    setCandidateIndex(nextCached ? Math.max(0, candidates.indexOf(nextCached)) : 0);
    setAvailable(Boolean(nextCached || candidates[0]) && !exhaustedPortraits.has(key));
  }, [candidates, key]);

  const source = cached || candidates[candidateIndex] || '';
  const moveToNextCandidate = () => {
    if (item?.image || candidateIndex >= candidates.length - 1) {
      exhaustedPortraits.add(key);
      setAvailable(false);
      return;
    }
    setCandidateIndex((index) => index + 1);
  };

  if (!source || !available) return <span className={`source-portrait source-portrait--missing${className ? ` ${className}` : ''}`} aria-label={`No verified Hunterpedia portrait available for ${item?.name || 'this record'}`}><b>{initialsFor(item?.name)}</b>{showState && <small>Portrait unavailable</small>}</span>;

  return <span className={`source-portrait${item?.image ? ' is-stored' : ' is-source-resolved'}${className ? ` ${className}` : ''}`} data-image-frame>
    <SafeImage
      src={source}
      media={item?.media}
      alt={decorative ? '' : (alt || `${item?.name} portrait from Hunterpedia`)}
      eager={eager}
      onAvailabilityChange={(next) => {
        if (next) { resolvedPortraits.set(key, source); setAvailable(true); }
        else { resolvedPortraits.delete(key); moveToNextCandidate(); }
      }}
    />
    {showState && <small>{item?.image ? 'Stored Hunterpedia portrait' : 'Hunterpedia source portrait'}</small>}
  </span>;
}

export const sourcePortraitStats = { locallyStored: 106, sourceCandidates: 538, totalCharacters: 644 };
