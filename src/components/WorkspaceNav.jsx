export default function WorkspaceNav({ items, activeId, onSelect, onIntent, label = 'Sections' }) {
  return (
    <nav className="workspace-nav" aria-label={label}>
      <div className="workspace-nav__desktop">
        {items.map((item) => (
          <button
            type="button"
            className={activeId === item.id ? 'is-active' : ''}
            aria-current={activeId === item.id ? 'page' : undefined}
            onPointerEnter={() => onIntent?.(item.id)}
            onFocus={() => onIntent?.(item.id)}
            onClick={() => onSelect(item.id)}
            key={item.id}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
