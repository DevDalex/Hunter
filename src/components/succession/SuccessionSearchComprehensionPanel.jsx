import { useEffect, useState } from 'react';
import { ArrowRight, BookmarkPlus, BrainCircuit, Check, FileWarning, HelpCircle, MapPin, SearchCheck, ShieldAlert } from 'lucide-react';
import {
  getChapterWhatChanged,
  getCharacterStateAtChapter,
  getEntitiesByType,
  getEntityById,
  getKnowledgeWarfareMatrix,
  getThreatAssassinationMatrix,
} from '../../data/succession/successionData';
import { saveSuccessionArchiveSearch } from '../../data/succession/archiveMemory';
import { getSuccessionMysteryCasesAtChapter } from '../../data/succession/successionMysteryCases';
import { readBrowserRoute } from '../../lib/appRouter';
import { entityWorkspaceTarget } from './SuccessionArchivePrimitives';
import './SuccessionSearchComprehensionPanel.css';

const normalize = (value) => String(value || '').trim().toLocaleLowerCase().replace(/[?!.]+$/g, '');
const labelize = (value) => String(value || 'unknown').replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());

export const parseSuccessionSearchIntent = (query = '') => {
  const raw = normalize(query);
  if (!raw) return null;
  let match = raw.match(/^who\s+(?:is\s+)?targeting\s+(.+)$/);
  if (match) return { type: 'targeting', term: match[1].trim() };
  match = raw.match(/^who\s+knows(?:\s+about)?\s+(.+)$/);
  if (match) return { type: 'knowledge', term: match[1].trim() };
  match = raw.match(/^(?:what\s+changed(?:\s+in)?|changes(?:\s+in)?)\s+(?:chapter\s+)?(\d{3})$/);
  if (match) return { type: 'changes', chapter: Number(match[1]), term: `chapter ${match[1]}` };
  match = raw.match(/^where\s+is\s+(.+)$/);
  if (match) return { type: 'location', term: match[1].trim() };
  match = raw.match(/^(?:show\s+)?unresolved\s+(.+)$/);
  if (match) return { type: 'unresolved', term: match[1].trim() };
  return null;
};

const matchesEntity = (entity, term) => normalize([
  entity?.name,
  entity?.id,
  ...(entity?.aliases || []),
].filter(Boolean).join(' ')).includes(normalize(term));

function EntityButton({ entity, onNavigate, children }) {
  if (!entity) return null;
  return <button type="button" className="succession-search-intent__entity" onClick={() => onNavigate(entityWorkspaceTarget(entity), { entity: entity.id })}>{children || entity.name}<ArrowRight size={11} aria-hidden="true" /></button>;
}

function SaveSearchControl({ query, chapter }) {
  const [saved, setSaved] = useState(false);
  useEffect(() => setSaved(false), [query, chapter]);
  const cleanQuery = String(query || '').trim();
  if (!cleanQuery) return null;
  const save = () => {
    saveSuccessionArchiveSearch(cleanQuery, chapter);
    setSaved(true);
  };
  return <div className="succession-search-intent__save">
    <span>Keep this question in Research Memory at the current Chapter {chapter} boundary.</span>
    <button type="button" aria-pressed={saved} onClick={save}>{saved ? <Check size={12} aria-hidden="true" /> : <BookmarkPlus size={12} aria-hidden="true" />}{saved ? 'Saved search' : 'Save search'}</button>
  </div>;
}

function TargetingAnswer({ term, chapter, onNavigate }) {
  const rows = getThreatAssassinationMatrix(chapter).filter((row) => matchesEntity(row.target, term));
  return <section><header><span><ShieldAlert size={14} aria-hidden="true" /> Direct answer</span><h3>Who is targeting “{term}”?</h3><p>{rows.length ? `${rows.length} maintained threat signal${rows.length === 1 ? '' : 's'} match the target at Chapter ${chapter}.` : `No maintained threat signal resolves that target at Chapter ${chapter}.`}</p></header>{!!rows.length && <ol>{rows.slice(0, 12).map((row) => <li key={row.id}><div><b>{row.source?.name || 'Unknown source'} → {row.target?.name || term}</b><small>{labelize(row.method)} · {labelize(row.status)} · {labelize(row.sourceType)}</small></div>{row.source && <EntityButton entity={getEntityById(row.source.id)} onNavigate={onNavigate}>Open source</EntityButton>}</li>)}</ol>}{rows.length > 12 && <small className="succession-search-intent__shown">Showing 12 of {rows.length} threat signals.</small>}</section>;
}

function KnowledgeAnswer({ term, chapter }) {
  const rows = getKnowledgeWarfareMatrix(chapter).filter((row) => normalize([row.name, row.acquisition, ...(row.subjectLabels || [])].filter(Boolean).join(' ')).includes(normalize(term)));
  return <section><header><span><BrainCircuit size={14} aria-hidden="true" /> Direct answer</span><h3>Who knows about “{term}”?</h3><p>{rows.length ? `${rows.length} maintained knowledge record${rows.length === 1 ? '' : 's'} match at Chapter ${chapter}.` : `No maintained knowledge record matches that phrase at Chapter ${chapter}.`}</p></header>{!!rows.length && <ol>{rows.slice(0, 10).map((row) => <li key={row.id}><div><b>{row.name}</b><small>Known by: {row.knowerLabels?.join(' · ') || 'No published knower labels'} </small><small>Hidden / misinformed: {row.misinformedLabels?.join(' · ') || 'None published'}</small></div></li>)}</ol>}{rows.length > 10 && <small className="succession-search-intent__shown">Showing 10 of {rows.length} matching knowledge records.</small>}</section>;
}

function ChangesAnswer({ requestedChapter, boundary, onNavigate }) {
  if (requestedChapter < 340 || requestedChapter > boundary) return <section><header><span><FileWarning size={14} aria-hidden="true" /> Boundary check</span><h3>Chapter {requestedChapter} is outside this search boundary</h3><p>Structured chapter answers are limited to Chapters 340–{boundary} in the current Succession archive.</p></header></section>;
  const change = getChapterWhatChanged(requestedChapter);
  return <section><header><span><FileWarning size={14} aria-hidden="true" /> Direct answer</span><h3>What changed in Chapter {requestedChapter}?</h3><p>{change.summary.added} added · {change.summary.changed} changed · {change.summary.removed} removed records.</p></header><ol>{change.records.slice(0, 10).map((record) => <li key={record.entity.id}><div><b>{record.entity.name}</b><small>{labelize(record.status)} · {labelize(record.entity.entityType)}</small></div><EntityButton entity={getEntityById(record.entity.id)} onNavigate={onNavigate}>Open record</EntityButton></li>)}</ol>{change.records.length > 10 && <small className="succession-search-intent__shown">Showing 10 of {change.records.length} material record changes.</small>}<footer><button type="button" onClick={() => onNavigate('chapters', { chapter: requestedChapter, depth: 'deep' })}>Open Chapter {requestedChapter} state transition <ArrowRight size={13} /></button></footer></section>;
}

function LocationAnswer({ term, chapter, onNavigate }) {
  const characters = getEntitiesByType('character').filter((character) => matchesEntity(character, term)).slice(0, 6);
  const rows = characters.map((character) => {
    const state = getCharacterStateAtChapter(character.id, chapter);
    return { character, state, location: state?.locationId ? getEntityById(state.locationId) : null };
  });
  return <section><header><span><MapPin size={14} aria-hidden="true" /> Direct answer</span><h3>Where is “{term}” at Chapter {chapter}?</h3><p>{rows.length ? 'Locations come from the chapter-bounded character state selector.' : 'No matching canonical character record was found.'}</p></header>{!!rows.length && <ol>{rows.map(({ character, state, location }) => <li key={character.id}><div><b>{character.name}</b><small>{location?.name || 'Location unresolved at this boundary'} · {labelize(state?.life || 'unknown')}</small></div><EntityButton entity={character} onNavigate={onNavigate}>Open character</EntityButton></li>)}</ol>}</section>;
}

function UnresolvedAnswer({ term, chapter, onNavigate }) {
  const records = getSuccessionMysteryCasesAtChapter(chapter).filter((record) => record.status !== 'resolved' && normalize(`${record.title} ${record.question} ${record.summary} ${record.category} ${record.unknowns.join(' ')}`).includes(normalize(term)));
  return <section><header><span><HelpCircle size={14} aria-hidden="true" /> Direct answer</span><h3>Unresolved cases matching “{term}”</h3><p>{records.length ? `${records.length} open case${records.length === 1 ? '' : 's'} match the phrase.` : 'No open maintained case matches that phrase.'}</p></header>{!!records.length && <ol>{records.slice(0, 10).map((record) => <li key={record.id}><div><b>{record.title}</b><small>{record.unknowns.length} unknowns · {record.candidates.length} candidates</small></div><button type="button" className="succession-search-intent__entity" onClick={() => onNavigate('research', { mode: 'cases', case: record.id })}>Open case <ArrowRight size={11} /></button></li>)}</ol>}</section>;
}

const examples = [
  'who is targeting Woble',
  'who knows about TSK-17',
  'what changed in chapter 417',
  'where is Kurapika',
  'unresolved Tserriednich',
];

export default function SuccessionSearchComprehensionPanel({ query = '', chapter = 417, onQueryChange, onNavigate }) {
  const [seededRouteQuery, setSeededRouteQuery] = useState(false);
  useEffect(() => {
    if (seededRouteQuery) return;
    setSeededRouteQuery(true);
    if (query.trim()) return;
    const route = readBrowserRoute();
    const requested = route?.target === 'search' ? route.params?.query : '';
    if (typeof requested === 'string' && requested.trim()) onQueryChange(requested.trim());
  }, [onQueryChange, query, seededRouteQuery]);

  const intent = parseSuccessionSearchIntent(query);
  if (!query.trim()) return <section className="succession-search-intent is-empty" aria-labelledby="succession-search-intent-title"><header><span><SearchCheck size={14} aria-hidden="true" /> Structured questions</span><h2 id="succession-search-intent-title">Ask the graph a direct question</h2><p>These patterns use chapter-bounded canonical selectors; ordinary keyword search still works below.</p></header><div className="succession-search-intent__examples">{examples.map((example) => <button type="button" onClick={() => onQueryChange(example)} key={example}>{example}</button>)}</div></section>;
  if (!intent) return <SaveSearchControl query={query} chapter={chapter} />;

  return <section className="succession-search-intent" aria-label="Structured archive answer">
    {intent.type === 'targeting' && <TargetingAnswer term={intent.term} chapter={chapter} onNavigate={onNavigate} />}
    {intent.type === 'knowledge' && <KnowledgeAnswer term={intent.term} chapter={chapter} />}
    {intent.type === 'changes' && <ChangesAnswer requestedChapter={intent.chapter} boundary={chapter} onNavigate={onNavigate} />}
    {intent.type === 'location' && <LocationAnswer term={intent.term} chapter={chapter} onNavigate={onNavigate} />}
    {intent.type === 'unresolved' && <UnresolvedAnswer term={intent.term} chapter={chapter} onNavigate={onNavigate} />}
    <SaveSearchControl query={query} chapter={chapter} />
  </section>;
}
