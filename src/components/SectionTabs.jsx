import { useRef } from 'react';

export default function SectionTabs({ items, activeId, onSelect, label }) {
  const refs = useRef([]);
  const move = (event, index) => {
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % items.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + items.length) % items.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = items.length - 1;
    else return;
    event.preventDefault();
    onSelect(items[next].id);
    window.requestAnimationFrame(() => refs.current[next]?.focus());
  };

  return (
    <nav className="section-tabs" aria-label={label}>
      {items.map((item, index) => (
        <button
          ref={(node) => { refs.current[index] = node; }}
          type="button"
          className={activeId === item.id ? 'is-active' : ''}
          aria-current={activeId === item.id ? 'page' : undefined}
          onClick={() => onSelect(item.id)}
          onKeyDown={(event) => move(event, index)}
          key={item.id}
        >
          <span>{String(index + 1).padStart(2, '0')}</span>
          <b>{item.label}</b>
          {item.note && <small>{item.note}</small>}
        </button>
      ))}
    </nav>
  );
}
