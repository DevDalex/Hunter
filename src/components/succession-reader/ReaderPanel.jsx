import { useEffect, useLayoutEffect, useRef } from 'react';
import { X } from 'lucide-react';
import ReaderPanelEnhancements from './ReaderPanelEnhancements.jsx';

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export default function ReaderPanel({ open, title, label, side = 'left', onClose, returnFocusRef, children, className = '' }) {
  const panelRef = useRef(null);
  const dismissOnOpen = title === 'Resume reading';

  useLayoutEffect(() => {
    if (open && dismissOnOpen) onClose();
  }, [dismissOnOpen, onClose, open]);

  useEffect(() => {
    if (!open || dismissOnOpen) return undefined;
    const panel = panelRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const first = panel?.querySelector('[data-reader-autofocus]') || panel?.querySelector(focusableSelector);
    window.setTimeout(() => first?.focus(), 0);

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !panel) return;
      const focusable = [...panel.querySelectorAll(focusableSelector)].filter((node) => !node.hasAttribute('hidden'));
      if (!focusable.length) return;
      const firstNode = focusable[0];
      const lastNode = focusable.at(-1);
      if (event.shiftKey && document.activeElement === firstNode) {
        event.preventDefault();
        lastNode.focus();
      } else if (!event.shiftKey && document.activeElement === lastNode) {
        event.preventDefault();
        firstNode.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      window.setTimeout(() => returnFocusRef?.current?.focus?.(), 0);
    };
  }, [dismissOnOpen, onClose, open, returnFocusRef]);

  if (!open || dismissOnOpen) return null;
  return <div className={`succession-reader-panel succession-reader-panel--${side} ${className}`} role="presentation" onMouseDown={(event) => {
    if (event.target === event.currentTarget) onClose();
  }}>
    <section ref={panelRef} role="dialog" aria-modal="true" aria-label={label || title}>
      <header>
        <div><span>Succession reader</span><h2>{title}</h2></div>
        <button type="button" onClick={onClose} aria-label={`Close ${label || title}`}><X aria-hidden="true" /></button>
      </header>
      <div className="succession-reader-panel__body">
        {children}
        <ReaderPanelEnhancements title={title} onClose={onClose} />
      </div>
    </section>
  </div>;
}
