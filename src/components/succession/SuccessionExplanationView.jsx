import { useMemo } from 'react';
import { getEntitiesByType, getEntityById } from '../../data/succession/successionData';
import { explanationModes } from '../../data/succession/readingExperience';

const asArray = (value) => Array.isArray(value) ? value.filter(Boolean) : value ? [value] : [];
const textOf = (value) => {
  if (typeof value === 'string') return value;
  if (!value || typeof value !== 'object') return '';
  return value.summary || value.description || value.text || value.label || value.name || value.title || '';
};
const firstText = (...values) => values.flatMap(asArray).map(textOf).find(Boolean) || '';
const listText = (...values) => values.flatMap(asArray).map(textOf).filter(Boolean);

const resolveRecord = ({ routeId, routeParams, spoilerLimit }) => {
  if (routeParams.entity) return getEntityById(routeParams.entity);
  if (routeId === 'chapters') {
    const chapter = Number(routeParams.chapter || spoilerLimit);
    return getEntitiesByType('chapter').find((record) => Number(record.chapter || record.number) === chapter) || null;
  }
  if (routeId === 'story') {
    const records = getEntitiesByType('chapter').filter((record) => Number(record.chapter || record.number) <= spoilerLimit);
    return records.sort((a, b) => Number(b.chapter || b.number) - Number(a.chapter || a.number))[0] || null;
  }
  return null;
};

const buildView = (record, mode) => {
  const title = record?.name || record?.title || record?.label || `Chapter ${record?.chapter || record?.number || ''}`;
  const summary = firstText(record?.recap, record?.summary, record?.description, record?.overview);
  const scenes = listText(record?.scenes, record?.events, record?.beats, record?.sequence, record?.moments);
  const motives = listText(record?.motives, record?.objectives, record?.intentions, record?.strategy);
  const consequences = listText(record?.consequences, record?.outcomes, record?.stateChanges, record?.changes);
  const mechanics = listText(record?.mechanics, record?.rules, record?.abilities, record?.systems);
  const implications = listText(record?.implications, record?.analysis, record?.pressure, record?.threads);
  const questions = listText(record?.openQuestions, record?.unresolvedQuestions, record?.questions);
  const evidence = asArray(record?.evidence || record?.sources || record?.claims).map((item) => typeof item === 'string' ? { text: item } : item);

  if (mode === 'brief') return {
    title: `${title}: 60-second recap`,
    lead: summary || scenes[0] || 'No concise recap has been indexed for this record yet.',
    sections: [{ label: 'Remember these', items: [...scenes.slice(0, 3), ...consequences.slice(0, 2)].slice(0, 5) }],
  };
  if (mode === 'deep') return {
    title: `${title}: deep analysis`,
    lead: summary,
    sections: [
      { label: 'Scene and motive map', items: [...scenes, ...motives].slice(0, 10) },
      { label: 'Mechanics and causal links', items: [...mechanics, ...consequences].slice(0, 10) },
      { label: 'Implications and unresolved threads', items: [...implications, ...questions].slice(0, 10) },
    ],
  };
  if (mode === 'evidence') return {
    title: `${title}: evidence mode`,
    lead: 'Claims are separated from interpretation and shown with the strongest available provenance.',
    evidence,
    sections: [
      { label: 'Confirmed record', items: [summary, ...scenes, ...consequences].filter(Boolean).slice(0, 8) },
      { label: 'Interpretation and uncertainty', items: [...implications, ...questions].slice(0, 8) },
    ],
  };
  return {
    title: `${title}: normal explanation`,
    lead: summary,
    sections: [
      { label: 'What happened', items: scenes.slice(0, 8) },
      { label: 'Why it matters', items: [...motives, ...consequences, ...implications].slice(0, 8) },
      { label: 'What remains unresolved', items: questions.slice(0, 6) },
    ],
  };
};

export default function SuccessionExplanationView({ routeId, routeParams = {}, spoilerLimit }) {
  const mode = explanationModes.some((item) => item.id === routeParams.mode) ? routeParams.mode : 'standard';
  const record = useMemo(() => resolveRecord({ routeId, routeParams, spoilerLimit }), [routeId, routeParams, spoilerLimit]);
  const view = useMemo(() => buildView(record, mode), [record, mode]);
  if (!record || !['story', 'chapters'].includes(routeId)) return null;

  return <section className={`succession-explanation-view mode-${mode}`} aria-labelledby="succession-explanation-view-title">
    <header>
      <span>{explanationModes.find((item) => item.id === mode)?.label}</span>
      <h3 id="succession-explanation-view-title">{view.title}</h3>
      {view.lead && <p>{view.lead}</p>}
    </header>
    <div className="succession-explanation-view__sections">
      {view.sections.filter((section) => section.items.length).map((section) => <article key={section.label}>
        <h4>{section.label}</h4>
        <ol>{section.items.map((item, index) => <li key={`${section.label}:${index}`}>{item}</li>)}</ol>
      </article>)}
      {view.evidence?.length ? <article>
        <h4>Sources and claims</h4>
        <ul>{view.evidence.slice(0, 12).map((item, index) => <li key={item.id || index}><strong>{item.kind || item.type || 'Evidence'}</strong><span>{item.text || item.summary || item.label || item.source || 'Source record'}</span>{item.chapter && <small>Chapter {item.chapter}</small>}</li>)}</ul>
      </article> : null}
    </div>
  </section>;
}
