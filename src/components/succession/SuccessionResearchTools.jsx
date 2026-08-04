import { useMemo, useState } from 'react';
import { Bookmark, Check, Clipboard, Download, FlaskConical, GitCompareArrows, Share2 } from 'lucide-react';
import { getEntitiesByType, getEntityById } from '../../data/succession/successionData';
import { explanationModes } from '../../data/succession/readingExperience';
import { evidenceKinds, openQuestionStatuses } from '../../data/succession/researchSemantics';
import { collectChapterChanges } from '../../lib/succession/chapterDiff';
import { loadResearchWorkspace, saveInvestigation, toggleBookmark } from '../../lib/succession/researchWorkspace';
import { buildResearchCitation, buildShareSnapshotUrl, exportRecordsAsCsv, exportRecordsAsJson } from '../../lib/succession/shareAndExport';

const downloadText = (name, content, type = 'text/plain') => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  URL.revokeObjectURL(url);
};

const copyText = async (value, onDone) => {
  await navigator.clipboard.writeText(value);
  onDone(true);
  window.setTimeout(() => onDone(false), 1400);
};

export default function SuccessionResearchTools({ routeId, routeParams = {}, spoilerLimit, onNavigate }) {
  const [workspace, setWorkspace] = useState(() => loadResearchWorkspace());
  const [copied, setCopied] = useState('');
  const [fromChapter, setFromChapter] = useState(Math.max(340, spoilerLimit - 1));
  const [toChapter, setToChapter] = useState(spoilerLimit);
  const [investigationTitle, setInvestigationTitle] = useState('');
  const selectedEntity = routeParams.entity ? getEntityById(routeParams.entity) : null;
  const bookmark = {
    domain: routeId,
    id: selectedEntity?.id || `${routeId}:${JSON.stringify(routeParams)}`,
    label: selectedEntity?.name || routeId,
    route: routeId,
    params: routeParams,
    chapter: spoilerLimit,
  };
  const bookmarked = workspace.bookmarks.some((item) => item.domain === bookmark.domain && item.id === bookmark.id);
  const allRecords = useMemo(() => [
    ...getEntitiesByType('event'),
    ...getEntitiesByType('relationship'),
    ...getEntitiesByType('assignment'),
    ...getEntitiesByType('ability'),
  ], []);
  const changes = useMemo(() => {
    try { return collectChapterChanges({ records: allRecords, fromChapter, toChapter }); }
    catch { return []; }
  }, [allRecords, fromChapter, toChapter]);

  const toggleCurrentBookmark = () => setWorkspace(toggleBookmark(bookmark));
  const createInvestigation = () => {
    const title = investigationTitle.trim();
    if (!title) return;
    const next = saveInvestigation({
      id: `investigation-${Date.now()}`,
      title,
      chapter: spoilerLimit,
      records: [bookmark],
      notes: '',
      status: 'open',
    });
    setWorkspace(next);
    setInvestigationTitle('');
  };
  const snapshotUrl = buildShareSnapshotUrl({ route: routeId, params: routeParams, chapter: spoilerLimit });
  const citation = buildResearchCitation({ title: selectedEntity?.name || routeId, chapter: spoilerLimit, route: routeId });

  return <section className="succession-research-tools" aria-labelledby="succession-research-tools-title">
    <header>
      <div><span>Research controls</span><h2 id="succession-research-tools-title">Use the archive, do not merely browse it.</h2></div>
      <button type="button" onClick={toggleCurrentBookmark} aria-pressed={bookmarked}><Bookmark size={16} /> {bookmarked ? 'Bookmarked' : 'Bookmark view'}</button>
    </header>

    {['story', 'chapters'].includes(routeId) && <div className="succession-research-tools__modes">
      <h3>Explanation depth</h3>
      <div>{explanationModes.map((mode) => <button type="button" key={mode.id} className={routeParams.mode === mode.id ? 'is-active' : ''} onClick={() => onNavigate(routeId, { ...routeParams, mode: mode.id })}><strong>{mode.label}</strong><span>{mode.description}</span></button>)}</div>
    </div>}

    <div className="succession-research-tools__grid">
      <article>
        <GitCompareArrows size={19} aria-hidden="true" />
        <h3>Chapter changes</h3>
        <div className="succession-research-tools__range"><label>From<input type="number" min="340" max={spoilerLimit} value={fromChapter} onChange={(event) => setFromChapter(Number(event.target.value))} /></label><label>To<input type="number" min="340" max={spoilerLimit} value={toChapter} onChange={(event) => setToChapter(Number(event.target.value))} /></label></div>
        <p>{changes.length} records changed or appeared in this range.</p>
        <ul>{changes.slice(0, 6).map((record) => <li key={record.id}>{record.name || record.label || record.id}</li>)}</ul>
        {changes.length > 6 && <small>Plus {changes.length - 6} more records.</small>}
      </article>

      <article>
        <FlaskConical size={19} aria-hidden="true" />
        <h3>Investigation board</h3>
        <div className="succession-research-tools__create"><input value={investigationTitle} onChange={(event) => setInvestigationTitle(event.target.value)} placeholder="Name a question or theory…" /><button type="button" onClick={createInvestigation}>Create</button></div>
        <ul>{workspace.investigations.slice(-5).reverse().map((item) => <li key={item.id}><strong>{item.title}</strong><span>Chapter {item.chapter} · {item.records?.length || 0} saved records</span></li>)}</ul>
        {!workspace.investigations.length && <p>No investigations yet.</p>}
      </article>

      <article>
        <Share2 size={19} aria-hidden="true" />
        <h3>Share and cite</h3>
        <button type="button" onClick={() => copyText(snapshotUrl, (value) => setCopied(value ? 'share' : ''))}>{copied === 'share' ? <Check size={15} /> : <Clipboard size={15} />} Copy research snapshot</button>
        <button type="button" onClick={() => copyText(citation, (value) => setCopied(value ? 'citation' : ''))}>{copied === 'citation' ? <Check size={15} /> : <Clipboard size={15} />} Copy citation</button>
        <p>Snapshot preserves route, filters, and Chapter {spoilerLimit} boundary.</p>
      </article>

      <article>
        <Download size={19} aria-hidden="true" />
        <h3>Export current research</h3>
        <button type="button" onClick={() => downloadText(`hunter-${routeId}-${spoilerLimit}.json`, exportRecordsAsJson(changes), 'application/json')}>Export JSON</button>
        <button type="button" onClick={() => downloadText(`hunter-${routeId}-${spoilerLimit}.csv`, exportRecordsAsCsv(changes), 'text/csv')}>Export CSV</button>
        <p>Chapter-image binaries and protected administrator data are excluded.</p>
      </article>
    </div>

    <details className="succession-research-tools__semantics">
      <summary>Evidence and question vocabulary</summary>
      <div><strong>Evidence:</strong> {evidenceKinds.join(', ')}</div>
      <div><strong>Question states:</strong> {openQuestionStatuses.join(', ')}</div>
    </details>
  </section>;
}
