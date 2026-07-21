export default function InteractiveCard({ card, held = false, inserted = false, disabled = false, displayOnly = false, onHold, onDragStart }) {
  const className = `gi-card${held ? ' is-held' : ''}${inserted ? ' is-inserted' : ''}${disabled ? ' is-disabled' : ''}`;
  const content = <>
    <span className="gi-card__top"><b>{card.id}</b><i>{card.rank}-{card.conversionLimit}</i></span>
    <span className="gi-card__sigil" aria-hidden="true"><i /><i /><i /></span>
    <strong>{card.name}</strong>
    <small>{card.verification.description === 'verified' ? card.description : 'Description verification pending'}</small>
  </>;

  if (displayOnly) return <span className={className} aria-hidden="true">{content}</span>;

  return <button
    type="button"
    className={className}
    draggable={!disabled}
    disabled={disabled}
    aria-pressed={held}
    aria-label={`${held ? 'Held card' : 'Hold card'} ${card.id}, ${card.name}, rank ${card.rank}, conversion limit ${card.conversionLimit}`}
    onClick={() => onHold?.(card.id)}
    onDragStart={(event) => {
      if (disabled) return;
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', card.id);
      onDragStart?.(card.id);
    }}
  >{content}</button>;
}
