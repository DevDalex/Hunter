import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, ExternalLink, X } from 'lucide-react';
import { LATEST_CHAPTER } from '../data/chapters';
import SafeImage from './SafeImage';

const Field = ({ label, children, empty = 'Not yet catalogued in this study index' }) => (
  <div className="detail-field"><dt>{label}</dt><dd>{children || <span className="muted-value">{empty}</span>}</dd></div>
);

const parseFandomSection = (html) => {
  const document = new DOMParser().parseFromString(html, 'text/html');
  const imageNode = document.querySelector('.mw-parser-output img, figure img');
  const image = imageNode?.getAttribute('data-src') || imageNode?.getAttribute('src') || '';
  const imageHref = imageNode?.closest('a')?.getAttribute('href') || '';
  const list = [...document.querySelectorAll('li')]
    .map((node) => node.textContent.replace(/\[[^\]]*\]/g, '').replace(/\s+/g, ' ').trim())
    .filter(Boolean);
  const links = [...document.querySelectorAll('.mw-parser-output a[href^="/wiki/"], a[href^="https://hunterxhunter.fandom.com/wiki/"]')]
    .map((node) => {
      const label = node.textContent.replace(/\s+/g, ' ').trim();
      const href = node.getAttribute('href') || '';
      const source = href.startsWith('/') ? `https://hunterxhunter.fandom.com${href}` : href;
      return label && !/^(edit|image|source)$/i.test(label) ? { label, source } : null;
    })
    .filter(Boolean);
  document.querySelectorAll('sup, table, figure, .mw-editsection, .reference, style, script').forEach((node) => node.remove());
  const text = document.body.textContent.replace(/\[[^\]]*\]/g, '').replace(/\s+/g, ' ').trim();
  const absoluteImageSource = imageHref.startsWith('//') ? `https:${imageHref}` : imageHref.startsWith('/') ? `https://hunterxhunter.fandom.com${imageHref}` : imageHref;
  return { text, list, links, image: image.startsWith('//') ? `https:${image}` : image, imageSource: absoluteImageSource };
};

const parseInfobox = (html) => {
  const document = new DOMParser().parseFromString(html, 'text/html');
  return [...document.querySelectorAll('.portable-infobox .pi-data, aside .pi-data')].map((row) => {
    const label = row.querySelector('.pi-data-label')?.textContent.replace(/\s+/g, ' ').trim();
    const value = row.querySelector('.pi-data-value')?.textContent.replace(/\[[^\]]*\]/g, '').replace(/\s+/g, ' ').trim();
    return label && value ? [label, value] : null;
  }).filter(Boolean).slice(0, 16);
};

const emptySourceRecord = { summary: '', characters: [], locations: [], conflicts: [], adaptations: [], trivia: [], sections: [], metadata: [], links: [], title: '', image: '', imageSource: '' };

export default function ChapterDrawer({ chapter, onClose, onMove, studied, toggleStudied, onOpenEntity }) {
  const dialogRef = useRef(null);
  const [sourceRecord, setSourceRecord] = useState(emptySourceRecord);
  const [sourceState, setSourceState] = useState('idle');

  useEffect(() => {
    if (!chapter) return undefined;
    const controller = new AbortController();
    const api = 'https://hunterxhunter.fandom.com/api.php';
    const page = `Chapter_${chapter.number}`;

    const loadSourceSummary = async () => {
      setSourceRecord(emptySourceRecord);
      setSourceState('loading');
      try {
        const sectionQuery = new URLSearchParams({ action: 'parse', page, prop: 'sections|displaytitle', format: 'json', origin: '*' });
        const sectionResponse = await fetch(`${api}?${sectionQuery}`, { signal: controller.signal });
        if (!sectionResponse.ok) throw new Error('Hunterpedia did not return a chapter record.');
        const sectionData = await sectionResponse.json();
        const sections = sectionData?.parse?.sections || [];
        const synopsisSection = sections.find((section) => /synopsis|summary/i.test(section.line))
          || sections.find((section) => /plot/i.test(section.line));
        const charactersSection = sections.find((section) => /characters.*appearance|characters/i.test(section.line));
        const locationsSection = sections.find((section) => /locations?|settings?/i.test(section.line));
        const conflictsSection = sections.find((section) => /battles?|conflicts?|confrontations?|events?/i.test(section.line));
        const adaptationsSection = sections.find((section) => /anime.*manga|adaptation|episode/i.test(section.line));
        const triviaSection = sections.find((section) => /trivia|notes/i.test(section.line));

        const loadSection = async (index) => {
          if (index === undefined) return { text: '', list: [], links: [], image: '', imageSource: '', html: '' };
          const query = new URLSearchParams({ action: 'parse', page, prop: 'text', section: String(index), format: 'json', origin: '*' });
          const response = await fetch(`${api}?${query}`, { signal: controller.signal });
          if (!response.ok) return { text: '', list: [], links: [], image: '' };
          const data = await response.json();
          const html = data?.parse?.text?.['*'] || '';
          return { ...parseFandomSection(html), html };
        };

        const [intro, synopsis, characters, locations, conflicts, adaptations, trivia] = await Promise.all([
          loadSection(0),
          loadSection(synopsisSection?.index ?? 0),
          loadSection(charactersSection?.index),
          loadSection(locationsSection?.index),
          loadSection(conflictsSection?.index),
          loadSection(adaptationsSection?.index),
          loadSection(triviaSection?.index),
        ]);
        if (!synopsis.text) throw new Error('No source synopsis is available yet.');
        const summary = synopsis.text.length > 1800 ? `${synopsis.text.slice(0, 1800).trim()}…` : synopsis.text;
        const linkedEntities = [...intro.links, ...synopsis.links, ...characters.links, ...locations.links, ...conflicts.links]
          .filter((item, index, all) => all.findIndex((candidate) => candidate.source === item.source) === index)
          .filter((item) => !/Chapter_|File:|Special:|Help:|Category:/i.test(item.source))
          .slice(0, 48);
        setSourceRecord({
          summary,
          characters: characters.list.slice(0, 80),
          locations: locations.list.slice(0, 40),
          conflicts: conflicts.list.slice(0, 40),
          adaptations: adaptations.list.slice(0, 30),
          trivia: trivia.list.slice(0, 20),
          sections: sections.map((section) => section.line.replace(/<[^>]+>/g, '').trim()).filter(Boolean),
          metadata: parseInfobox(intro.html),
          links: linkedEntities,
          title: parseFandomSection(sectionData?.parse?.displaytitle || '').text,
          image: intro.image || synopsis.image,
          imageSource: intro.imageSource || synopsis.imageSource,
        });
        setSourceState('loaded');
      } catch (error) {
        if (error.name !== 'AbortError') setSourceState('unavailable');
      }
    };

    loadSourceSummary();
    return () => controller.abort();
  }, [chapter]);

  useEffect(() => {
    if (!chapter || !dialogRef.current) return undefined;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    const dialog = dialogRef.current;
    document.body.style.overflow = 'hidden';
    dialog.querySelector('button')?.focus();
    const trapFocus = (event) => {
      if (event.key === 'Escape') { event.preventDefault(); onClose(); return; }
      if (event.key !== 'Tab') return;
      const focusable = [...dialog.querySelectorAll('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])')];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    dialog.addEventListener('keydown', trapFocus);
    return () => {
      dialog.removeEventListener('keydown', trapFocus);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus?.();
    };
  }, [chapter, onClose]);

  if (!chapter) return null;
  return (
    <div className="drawer-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <aside ref={dialogRef} className="chapter-drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title" aria-describedby="drawer-summary">
        <div className="chapter-drawer__top">
          <span>{chapter.label}</span><button onClick={onClose} aria-label="Close chapter"><X size={21} /></button>
        </div>
        <div className="chapter-drawer__body">
          <p className="chapter-drawer__kicker">{chapter.arcTitle} · {chapter.volume ? `Volume ${chapter.volume}` : 'Uncollected'}</p>
          <h2 id="drawer-title">{sourceRecord.title || chapter.title}</h2>
          {sourceRecord.image && <a className="chapter-drawer__image-link" href={sourceRecord.imageSource || chapter.sourceUrl} target="_blank" rel="noreferrer" data-image-frame><SafeImage className="chapter-drawer__image" src={sourceRecord.image} alt={`Hunterpedia image for ${chapter.label}`} eager /></a>}
          <p id="drawer-summary" className="chapter-drawer__lead">{sourceRecord.summary || chapter.summary}</p>
          <p className={`source-status source-status--${sourceState}`} role="status" aria-live="polite">
            {sourceState === 'loading' && 'Loading this chapter’s Hunterpedia synopsis…'}
            {sourceState === 'loaded' && 'Hunterpedia synopsis, appearance order, and notes loaded directly from the chapter page'}
            {sourceState === 'unavailable' && 'The live Hunterpedia synopsis is unavailable; showing the local catalogue note.'}
          </p>

          <div className="drawer-actions">
            <button className={`studied-button ${studied ? 'is-studied' : ''}`} onClick={() => toggleStudied(chapter.number)}><Check size={16} /> {studied ? 'Studied' : 'Mark as studied'}</button>
            <a className="source-link" href={chapter.sourceUrl} target="_blank" rel="noreferrer">Open Hunterpedia <ExternalLink size={14} /></a>
          </div>

          <section className="drawer-section"><h3>Chapter record</h3><dl className="detail-list">
            <Field label="Arc">{chapter.arcTitle}</Field><Field label="Volume">{chapter.volumeStatus}</Field>
            <Field label="Narrative movement">{chapter.studyPhase}</Field><Field label="Reading note">{chapter.studyPhase ? 'A study aid inside the official arc, not an additional arc' : null}</Field>
            <Field label="Pages">{chapter.pages ? `${chapter.pages} pages` : null}</Field><Field label="Original release">{chapter.releaseDate}</Field>
            <Field label="Tankōbon release">{chapter.tankobonDate}</Field><Field label="Record status">{chapter.researchStatus}</Field>
            <Field label="Last reviewed">{chapter.lastReviewed}</Field><Field label="Source policy">Hunterpedia / Fandom only</Field>
          </dl></section>

          <section className="drawer-section"><h3>Research coverage</h3><div className="chapter-coverage-grid">
            {[['Synopsis', Boolean(sourceRecord.summary || chapter.summary)], ['Title image', Boolean(sourceRecord.image)], ['Source metadata', Boolean(sourceRecord.metadata.length)], ['Appearance order', Boolean(sourceRecord.characters.length || chapter.characters.length)], ['Locations', Boolean(sourceRecord.locations.length || chapter.locations.length)], ['Conflicts', Boolean(sourceRecord.conflicts.length)], ['Adaptations', Boolean(sourceRecord.adaptations.length || chapter.adaptations.length)], ['Notes / trivia', Boolean(sourceRecord.trivia.length || chapter.notes.length)]].map(([label, available]) => <div className={available ? 'is-available' : ''} key={label}><i>{available ? '✓' : '—'}</i><span>{label}</span><small>{available ? 'Available in this record' : 'Not supplied by this source page'}</small></div>)}
          </div></section>

          {sourceRecord.metadata.length > 0 && <section className="drawer-section"><h3>Hunterpedia source metadata</h3><dl className="source-metadata-list">{sourceRecord.metadata.map(([label, value]) => <div key={`${label}-${value}`}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></section>}

          <section className="drawer-section"><h3>Study note</h3><p>{chapter.studyPrompt}</p></section>
          {chapter.research && <section className="drawer-section drawer-section--phase-context chapter-research-sheet">
            <header><div><span>Movement {chapter.research.phaseIndex} of {chapter.research.phaseCount}</span><h3>{chapter.research.phaseTitle}</h3></div><b>{chapter.research.beat}</b></header>
            <p>{chapter.research.titleSignal}</p>
            <blockquote><b>Arc-phase account</b>{chapter.research.phaseSummary}</blockquote>
            <blockquote><b>Structural shift</b>{chapter.research.structuralShift}</blockquote>
            <dl className="chapter-research-sheet__position"><div><dt>Position in phase</dt><dd>{chapter.research.phasePosition} of {chapter.research.phaseLength}</dd></div><div><dt>Previous</dt><dd>{chapter.research.continuity.previous}</dd></div><div><dt>Next</dt><dd>{chapter.research.continuity.next}</dd></div></dl>
            <div className="chapter-research-sheet__scopes"><div><b>People in this movement</b><span>{chapter.research.peopleScope.join(' · ')}</span></div><div><b>Factions</b><span>{chapter.research.factionScope.join(' · ')}</span></div><div><b>Places</b><span>{chapter.research.placeScope.join(' · ')}</span></div><div><b>Nen / mechanics</b><span>{chapter.research.nenScope.join(' · ')}</span></div><div><b>Conflicts</b><span>{chapter.research.conflictScope.join(' · ')}</span></div></div>
            <div className="chapter-research-sheet__consequence"><b>What this movement changes</b><p>{chapter.research.consequence}</p></div>
            <ol>{chapter.research.questions.map((item) => <li key={item}>{item}</li>)}</ol>
            <p className="chapter-research-sheet__boundary"><b>Evidence boundary:</b> phase people and places are not presented as a verified appearance list for this individual chapter.</p>
            <a className="source-link" href={chapter.research.phaseSource} target="_blank" rel="noreferrer">Open phase source <ExternalLink size={12} /></a>
          </section>}
          <section className="drawer-section"><h3>Characters in order of appearance</h3>{(sourceRecord.characters.length || chapter.characters.length) ? <ul className="drawer-chip-list drawer-chip-list--linked">{(sourceRecord.characters.length ? sourceRecord.characters : chapter.characters).map((item) => <li key={item}>{onOpenEntity ? <button onClick={() => onOpenEntity('characters', item)}>{item}</button> : item}</li>)}</ul> : <p className="muted-value">Hunterpedia has not returned an ordered appearance list for this record yet.</p>}</section>
          <section className="drawer-section"><h3>Locations</h3>{(sourceRecord.locations.length || chapter.locations.length) ? <ul className="drawer-chip-list drawer-chip-list--linked">{(sourceRecord.locations.length ? sourceRecord.locations : chapter.locations).map((item) => <li key={item}>{onOpenEntity ? <button onClick={() => onOpenEntity('locations', item)}>{item}</button> : item}</li>)}</ul> : <p className="muted-value">Hunterpedia has not returned a location list for this chapter.</p>}</section>
          <section className="drawer-section"><h3>Battles, conflicts, and operations</h3>{sourceRecord.conflicts.length ? <ul>{sourceRecord.conflicts.map((item) => <li key={item}>{item}</li>)}</ul> : <p className="muted-value">Hunterpedia has not returned a separate conflict section for this chapter.</p>}</section>
          <section className="drawer-section"><h3>Anime cross-reference</h3>{(sourceRecord.adaptations.length || chapter.adaptations.length) ? <ul>{(sourceRecord.adaptations.length ? sourceRecord.adaptations : chapter.adaptations).map((item) => <li key={item}>{item}</li>)}</ul> : <p className="muted-value">Hunterpedia has not returned a chapter-to-episode mapping for this record.</p>}</section>
          <section className="drawer-section"><h3>Notes & trivia</h3>{(sourceRecord.trivia.length || chapter.notes.length) ? <ul>{[...chapter.notes, ...sourceRecord.trivia].map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ul> : <p className="muted-value">No Hunterpedia notes have been returned for this chapter yet.</p>}</section>
          {sourceRecord.sections.length > 0 && <section className="drawer-section"><h3>Available Hunterpedia sections</h3><ul className="drawer-chip-list">{sourceRecord.sections.map((item) => <li key={item}>{item}</li>)}</ul></section>}
          {sourceRecord.links.length > 0 && <section className="drawer-section"><h3>Linked Hunterpedia entities</h3><div className="drawer-entity-links">{sourceRecord.links.map((item) => <a href={item.source} target="_blank" rel="noreferrer" key={item.source}>{item.label}<ExternalLink size={10} /></a>)}</div></section>}
        </div>
        <div className="chapter-drawer__footer">
          <button disabled={chapter.number === 1} onClick={() => onMove(-1)}><ArrowLeft size={16} /> Previous</button>
          <span>{chapter.number} / {LATEST_CHAPTER}</span>
          <button disabled={chapter.number === LATEST_CHAPTER} onClick={() => onMove(1)}>Next <ArrowRight size={16} /></button>
        </div>
      </aside>
    </div>
  );
}
