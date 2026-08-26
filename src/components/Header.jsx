import { Search } from 'lucide-react';
import { routeToHref } from '../lib/appRouter';

const primaryNav = [
  { id: 'archive', view: 'succession', target: 'archive', label: 'Succession Archive' },
  { id: 'nen-library', view: 'succession', target: 'nen', params: { scope: 'encyclopedia' }, label: 'Nen Library' },
];

export default function Header({
  activeView,
  routeTarget,
  routeParams = {},
  onNavigate,
  onOpenSearch,
  onPrefetch,
}) {
  const navigate = (view, target = '', params = {}) => {
    onNavigate(view, target, params);
  };

  const itemIsActive = (item) => {
    if (activeView !== 'succession') return false;
    if (item.id === 'nen-library') return routeTarget === 'nen' && routeParams.scope === 'encyclopedia';
    return item.id === 'archive' && routeParams.scope !== 'encyclopedia';
  };

  return (
    <header className="site-header">
      <nav
        id="primary-navigation"
        className="header-links"
        aria-label="Succession Contest archive navigation"
      >
        {primaryNav.map((item) => {
          const active = itemIsActive(item);
          const href = routeToHref(item.view, item.target, item.params);

          return (
            <a
              href={href}
              className={active ? 'is-active' : ''}
              aria-current={active ? 'page' : undefined}
              onPointerEnter={() => onPrefetch?.(item.view, item.target)}
              onFocus={() => onPrefetch?.(item.view, item.target)}
              onClick={(event) => {
                event.preventDefault();
                navigate(item.view, item.target, item.params);
              }}
              key={item.id}
            >
              {item.label}
            </a>
          );
        })}
      </nav>

      <div className="header-actions">
        <button
          className="header-search-button"
          onPointerEnter={() => onPrefetch?.('succession', 'search')}
          onFocus={() => onPrefetch?.('succession', 'search')}
          onClick={onOpenSearch}
          aria-label="Search the Succession Contest Archive"
        >
          <Search size={16} />
          <span>Search</span>
          <kbd>Ctrl K</kbd>
        </button>
      </div>
    </header>
  );
}
