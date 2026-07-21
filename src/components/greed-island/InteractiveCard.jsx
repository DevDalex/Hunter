import { useEffect, useState } from 'react';
import './GreedIslandCardMedia.css';

function CardArtwork({ card }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setFailed(false);
  }, [card.id, card.media?.remote]);

  return <span className={`gi-card__media${loaded ? ' is-loaded' : ''}${failed ? ' is-failed' : ''}`}>
    {!failed && card.media?.remote && <img
      src={card.media.remote}
      alt=""
      draggable="false"
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      data-card-media="hunterpedia"
      data-card-file={card.media.fileName}
      onLoad={() => setLoaded(true)}
      onError={() => { setLoaded(false); setFailed(true); }}
    />}
    <span className="gi-card__fallback" aria-hidden="true">
      <span className="gi-card__top"><b>{card.id}</b><i>{card.rank}-{card.conversionLimit}</i></span>
      <span className="gi-card__fallback-art"><i>G</i><b>GREED ISLAND</b><i>I</i></span>
      <strong>{card.name}</strong>
      <small>Verified card image temporarily unavailable</small>
    </span>
  </span>;
}

export default function InteractiveCard({ card, held = false, inserted = false, disabled = false, displayOnly = false, onHold, onDragStart }) {
  const className = `gi-card${held ? ' is-held' : ''}${inserted ? ' is-inserted' : ''}${disabled ? ' is-disabled' : ''}`;
  const content = <CardArtwork card={card} />;

  if (displayOnly) return <span className={className} aria-hidden="true">{content}</span>;

  return <button
    type="button"
    className={className}
    draggable={!disabled}
    disabled={disabled}
    aria-pressed={held}
    aria-label={`${held ? 'Held card' : 'Hold card'} ${card.id}, ${card.name}, rank ${card.rank}, conversion limit ${card.conversionLimit}`}
    data-card-source={card.media?.filePage}
    onClick={() => onHold?.(card.id)}
    onDragStart={(event) => {
      if (disabled) return;
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', card.id);
      onDragStart?.(card.id);
    }}
  >{content}</button>;
}
