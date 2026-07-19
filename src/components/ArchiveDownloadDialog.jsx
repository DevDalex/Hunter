import { Check, Cloud, Download, Globe2, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { SITES_SOURCE_PACKAGE_PATH, STANDALONE_PACKAGE_PATH } from '../data/downloads';

export default function ArchiveDownloadDialog({ open, onClose }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const prior = document.activeElement;
    const timer = window.setTimeout(() => closeRef.current?.focus(), 20);
    const handleKey = (event) => {
      if (event.key === 'Escape') { event.preventDefault(); onClose(); return; }
      if (event.key !== 'Tab') return;
      const nodes = [...dialogRef.current.querySelectorAll('button, a')].filter((node) => !node.disabled);
      const first = nodes[0];
      const last = nodes.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', handleKey);
    return () => { window.clearTimeout(timer); document.removeEventListener('keydown', handleKey); prior?.focus?.(); };
  }, [onClose, open]);

  if (!open) return null;
  return (
    <div className="download-dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section ref={dialogRef} className="download-dialog" role="dialog" aria-modal="true" aria-labelledby="download-dialog-title">
        <header>
          <div><span>Keep a complete copy</span><h2 id="download-dialog-title">Download the Archive</h2><p>Choose the maintainable project or the direct-open edition. Both contain the full encyclopedia.</p></div>
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Close download choices"><X size={20} /></button>
        </header>
        <div className="download-dialog__choices">
          <article>
            <Cloud size={22} />
            <span>For continued editing</span><h3>Sites-ready project</h3>
            <p>Source, content, components, styles, media, checks, and the current hosting identity.</p>
            <ul><li><Check size={14} />Move the project into another chat</li><li><Check size={14} />Continue building and publishing</li></ul>
            <a href={SITES_SOURCE_PACKAGE_PATH} download><Download size={16} />Download project</a>
          </article>
          <article>
            <Globe2 size={22} />
            <span>For reading anywhere</span><h3>Standalone website</h3>
            <p>An already-built edition with a single start file and the local portrait library.</p>
            <ul><li><Check size={14} />No Vite or Node required</li><li><Check size={14} />Does not call the hosted website</li></ul>
            <a href={STANDALONE_PACKAGE_PATH} download><Download size={16} />Download standalone</a>
          </article>
        </div>
        <p className="download-dialog__note">Your private browser notes, bookmarks, and progress are not included.</p>
      </section>
    </div>
  );
}
