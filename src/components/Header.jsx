import { Menu, Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
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
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef(null);
  const menuButtonRef = useRef(null);
  const firstLinkRef = useRef(null);

  useEffect(() => { setMenuOpen(false); }, [activeView, routeTarget, routeParams.scope]);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const timer = window.setTimeout(() => firstLinkRef.current?.focus(), 20);
    const closeOutside = (event) => {
      if (!headerRef.current?.contains(event.target)) setMenuOpen(false);
    };
    const handleMenuKeyboard = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setMenuOpen(false);
        menuButtonRef.current?.focus();
        return;
      }

      if (event.key !== 'Tab' || !headerRef.current) return;
      const focusable = [...headerRef.current.querySelectorAll('.header-links a, .header-actions button')]
        .filter((node) => node.getClientRects().length && !node.disabled);
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('pointerdown', closeOutside);
    document.addEventListener('keydown', handleMenuKeyboard);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('pointerdown', closeOutside);
      document.removeEventListener('keydown', handleMenuKeyboard);
    };
  }, [menuOpen]);

  const navigate = (view, target = '', params = {}) => {
    setMenuOpen(false);
    onNavigate(view, target, params);
  };

  const itemIsActive = (item) => {
    if (activeView !== 'succession') return false;
    if (item.id === 'nen-library') return routeTarget === 'nen' && routeParams.scope === 'encyclopedia';
    return item.id === 'archive' && routeParams.scope !== 'encyclopedia';
  };

  return (
    <header ref={headerRef} className="site-header">
      <nav
        id="primary-navigation"
        className={`header-links${menuOpen ? ' is-open' : ''}`}
        aria-label="Succession Contest archive navigation"
      >
        {primaryNav.map((item, index) => {
          const active = itemIsActive(item);
          const href = routeToHref(item.view, item.target, item.params);

          return (
            <a
              ref={index === 0 ? firstLinkRef : undefined}
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
          onClick={() => {
            setMenuOpen(false);
            onOpenSearch();
          }}
          aria-label="Search the Succession Contest Archive"
        >
          <Search size={16} />
          <span>Search</span>
          <kbd>Ctrl K</kbd>
        </button>

        <button
          ref={menuButtonRef}
          className="mobile-menu-button"
          onClick={() => setMenuOpen((current) => !current)}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          aria-label={`${menuOpen ? 'Close' : 'Open'} archive navigation`}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
          <span>Browse</span>
        </button>
      </div>
    </header>
  );
}
