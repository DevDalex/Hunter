import {
  Children,
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
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

const GROUP_GAP = 20;
const OVERSCAN_PX = 900;

const classIncludes = (element, className) => isValidElement(element)
  && typeof element.props.className === 'string'
  && element.props.className.split(/\s+/).includes(className);

const chapterCountForSection = (section) => {
  if (!isValidElement(section)) return 0;
  const cards = Children.toArray(section.props.children)
    .find((child) => isValidElement(child) && child.type === 'div');
  return cards ? Children.count(cards.props.children) : 0;
};

const estimatedSectionHeight = (section, compact) => {
  const chapterCount = Math.max(1, chapterCountForSection(section));
  const headerHeight = compact ? 112 : 82;
  const cardHeight = compact ? 112 : 74;
  const cardGap = compact ? 8 : 5;
  return headerHeight + (chapterCount * cardHeight) + (Math.max(0, chapterCount - 1) * cardGap);
};

function VirtualizedChapterBody({ children, onClose }) {
  const bodyRef = useRef(null);
  const groupsRef = useRef(null);
  const frameRef = useRef(null);
  const measuredRef = useRef(new Map());
  const [compact, setCompact] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 820);
  const [measurementVersion, setMeasurementVersion] = useState(0);
  const [range, setRange] = useState({ start: 0, end: 4 });

  const childList = Children.toArray(children);
  const groupsIndex = childList.findIndex((child) => classIncludes(child, 'succession-reader__chapter-groups'));
  const groupsElement = groupsIndex >= 0 ? childList[groupsIndex] : null;
  const groupChildren = groupsElement ? Children.toArray(groupsElement.props.children) : [];
  const sections = groupChildren.filter((child) => isValidElement(child) && child.type === 'section');
  const fallbackChildren = groupChildren.filter((child) => !isValidElement(child) || child.type !== 'section');
  const sectionKey = sections.map((section, index) => section.key ?? index).join('|');

  useEffect(() => {
    measuredRef.current.clear();
    setMeasurementVersion((version) => version + 1);
    setRange({ start: 0, end: Math.min(4, sections.length) });
  }, [compact, sectionKey, sections.length]);

  const layout = useMemo(() => {
    let top = 0;
    const rows = sections.map((section, index) => {
      const measured = measuredRef.current.get(index);
      const height = measured || estimatedSectionHeight(section, compact);
      const row = { top, height };
      top += height + GROUP_GAP;
      return row;
    });
    return {
      rows,
      totalHeight: Math.max(0, top - (sections.length ? GROUP_GAP : 0)),
    };
  }, [compact, measurementVersion, sectionKey, sections]);

  const updateRange = useCallback(() => {
    const body = bodyRef.current;
    const groups = groupsRef.current;
    if (!body || !groups || !layout.rows.length) return;

    const localTop = Math.max(0, body.scrollTop - groups.offsetTop);
    const localBottom = localTop + body.clientHeight;
    const minimum = Math.max(0, localTop - OVERSCAN_PX);
    const maximum = localBottom + OVERSCAN_PX;

    let start = 0;
    while (start < layout.rows.length && layout.rows[start].top + layout.rows[start].height < minimum) start += 1;
    let end = start;
    while (end < layout.rows.length && layout.rows[end].top < maximum) end += 1;

    start = Math.max(0, start - 1);
    end = Math.min(layout.rows.length, Math.max(start + 1, end + 1));
    setRange((current) => current.start === start && current.end === end ? current : { start, end });
  }, [layout]);

  const scheduleRangeUpdate = useCallback(() => {
    if (frameRef.current) return;
    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = null;
      updateRange();
    });
  }, [updateRange]);

  useLayoutEffect(() => {
    updateRange();
    const body = bodyRef.current;
    if (!body) return undefined;

    const updateCompact = () => setCompact(body.clientWidth <= 820);
    updateCompact();

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updateCompact);
      return () => window.removeEventListener('resize', updateCompact);
    }

    const observer = new ResizeObserver(() => {
      updateCompact();
      scheduleRangeUpdate();
    });
    observer.observe(body);
    return () => observer.disconnect();
  }, [scheduleRangeUpdate, updateRange]);

  useEffect(() => () => {
    if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
  }, []);

  const measureSection = useCallback((index, node) => {
    if (!node) return;
    const height = Math.ceil(node.getBoundingClientRect().height);
    if (!height || Math.abs((measuredRef.current.get(index) || 0) - height) < 2) return;
    measuredRef.current.set(index, height);
    setMeasurementVersion((version) => version + 1);
  }, []);

  if (!groupsElement || !sections.length) {
    return <div className="succession-reader-panel__body">
      {children}
      <ReaderPanelEnhancements title="Chapter drawer" onClose={onClose} />
    </div>;
  }

  const visibleSections = sections.slice(range.start, range.end).map((section, visibleIndex) => {
    const index = range.start + visibleIndex;
    const row = layout.rows[index];
    return cloneElement(section, {
      ref: (node) => measureSection(index, node),
      style: {
        ...section.props.style,
        position: 'absolute',
        insetInline: 0,
        top: `${row.top}px`,
      },
      'data-virtual-group-index': index,
    });
  });

  const virtualGroups = cloneElement(groupsElement, {
    ref: groupsRef,
    className: `${groupsElement.props.className || ''} is-virtualized`.trim(),
    style: {
      ...groupsElement.props.style,
      height: `${layout.totalHeight}px`,
      position: 'relative',
    },
    'data-virtual-start': range.start,
    'data-virtual-end': range.end,
  }, [...visibleSections, ...fallbackChildren]);

  const bodyChildren = [...childList];
  bodyChildren[groupsIndex] = virtualGroups;

  return <div
    ref={bodyRef}
    className="succession-reader-panel__body succession-reader-panel__body--virtualized"
    onScroll={scheduleRangeUpdate}
  >
    {bodyChildren}
    <ReaderPanelEnhancements title="Chapter drawer" onClose={onClose} />
  </div>;
}

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
  const chapterDrawer = title === 'Chapter drawer';

  return <div className={`succession-reader-panel succession-reader-panel--${side} ${className}`} role="presentation" onMouseDown={(event) => {
    if (event.target === event.currentTarget) onClose();
  }}>
    <section ref={panelRef} role="dialog" aria-modal="true" aria-label={label || title}>
      <header>
        <div><span>Succession reader</span><h2>{title}</h2></div>
        <button type="button" onClick={onClose} aria-label={`Close ${label || title}`}><X aria-hidden="true" /></button>
      </header>
      {chapterDrawer
        ? <VirtualizedChapterBody onClose={onClose}>{children}</VirtualizedChapterBody>
        : <div className="succession-reader-panel__body">
          {children}
          <ReaderPanelEnhancements title={title} onClose={onClose} />
        </div>}
    </section>
  </div>;
}
