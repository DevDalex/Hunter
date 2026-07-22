import { Download, Menu, Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { routeToHref } from '../lib/appRouter';

const primaryNav = [
  { id: 'story', view: 'series', label: 'Story' },
  { id: 'characters', view: 'reference', target: 'encyclopedia', params: { category: 'characters' }, label: 'Characters' },
  { id: 'world', view: 'reference', target: 'atlas', label: 'World' },
  { id: 'nen', view: 'reference', target: 'nen', label: 'Nen' },
  { id: 'organizations', view: 'reference', target: 'systems', params: { view: 'overview' }, label: 'Organizations' },
  { id: 'conflicts', view: 'reference', target: 'conflicts', label: 'Fights' },
  { id: 'timeline', view: 'timeline', label: 'Timeline' },
];

export default function Header({ activeView, routeTarget, onNavigate, onOpenSearch, onOpenDownloads, onPrefetch, onPrefetchSearch }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef(null);
  const menuButtonRef = useRef(null);
  const firstLinkRef = useRef(null);

  useEffect(() => { setMenuOpen(false); }, [activeView, routeTarget]);

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
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
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
    if (item.id === 'story') return activeView === 'series' || activeView === 'succession';
    if (item.id === 'timeline') return activeView === 'timeline';
    if (activeView !== item.view) return false;
    if (item.id === 'characters') return routeTarget === 'encyclopedia' || !routeTarget;
    return routeTarget === item.target;
  };

  return (
    <header ref={headerRef} className="site-header">
      <nav id="primary-navigation" className={`header-links${menuOpen ? ' is-open' : ''}`} aria-label="Primary navigation">
        {primaryNav.map((item, index) => {
          const active = itemIsActive(item);
          const href = routeToHref(item.view, item.target, item.params);
          return <a ref={index === 0 ? firstLinkRef : undefined} href={href} className={active ? 'is-active' : ''} aria-current={active ? 'page' : undefined} onPointerEnter={() => onPrefetch?.(item.view, item.target)} onFocus={() => onPrefetch?.(item.view, item.target)} onClick={(event) => { event.preventDefault(); navigate(item.view, item.target, item.params); }} key={item.id}>{item.label}</a>;
        })}
      </nav>
      <div className="header-actions">
        <button className="header-download-button" onClick={() => { setMenuOpen(false); onOpenDownloads?.(); }} aria-label="Download the complete website" title="Download archive"><Download size={16} /><span>Download</span></button>
        <button className="header-search-button" onPointerEnter={onPrefetchSearch} onFocus={onPrefetchSearch} onClick={() => { setMenuOpen(false); onOpenSearch(); }} aria-label="Search the complete archive"><Search size={16} /><span>Search</span><kbd>Ctrl K</kbd></button>
        <button ref={menuButtonRef} className="mobile-menu-button" onClick={() => setMenuOpen((current) => !current)} aria-expanded={menuOpen} aria-controls="primary-navigation" aria-label={`${menuOpen ? 'Close' : 'Open'} primary navigation`}>
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
          <span>Browse</span>
        </button>
      </div>
    </header>
  );
}
