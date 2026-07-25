import { ChevronLeft, ChevronRight, Eye, EyeOff, LockKeyhole } from 'lucide-react';

const boundaries = [
  [339, 'Pre-Succession story'],
  [358, 'Expedition and contest setup'],
  [383, 'Voyage through Day 8'],
  [390, 'First Nen class complete'],
  [400, 'Heil-Ly route investigation'],
  [411, 'Researched chapter boundary'],
];

export default function SpoilerControl({ value, latestChapter, onChange }) {
  const choices = [...boundaries.filter(([chapter]) => chapter <= latestChapter)];
  if (!choices.some(([chapter]) => chapter === latestChapter)) choices.push([latestChapter, 'Full current catalogue']);
  const selectedIsPreset = choices.some(([chapter]) => chapter === value);
  const previousPreset = [...choices].reverse().find(([chapter]) => chapter < value)?.[0] || 1;
  const atLatest = value >= latestChapter;

  return (
    <div className="spoiler-control" data-boundary-state={atLatest ? 'current' : 'bounded'}>
      <div className="spoiler-control__label">
        {atLatest ? <Eye size={15} aria-hidden="true" /> : <EyeOff size={15} aria-hidden="true" />}
        <span>
          <b>Spoiler boundary</b>
          <small>Show chapter-linked records through Chapter {value}</small>
        </span>
        <em className="spoiler-control__state">{atLatest ? 'Current authorized' : 'Bounded view'}</em>
      </div>

      <div className="spoiler-control__fields">
        <label>
          <span>Research checkpoint</span>
          <select value={selectedIsPreset ? value : 'custom'} onChange={(event) => event.target.value !== 'custom' && onChange(Number(event.target.value))}>
            {choices.map(([chapter, label]) => <option value={chapter} key={chapter}>{label} · Ch. {chapter}</option>)}
            {!selectedIsPreset && <option value="custom">Custom · Ch. {value}</option>}
          </select>
        </label>
        <label>
          <span>Max chapter</span>
          <input type="number" min="1" max={latestChapter} value={value} onChange={(event) => onChange(Math.min(latestChapter, Math.max(1, Number(event.target.value) || 1)))} />
        </label>
      </div>

      <div className="spoiler-control__navigation" aria-label="Chapter boundary navigation">
        <button type="button" disabled={value <= 1} onClick={() => onChange(previousPreset)}>
          <ChevronLeft size={13} aria-hidden="true" /> Previous preset
        </button>
        <span aria-live="polite">Ch. {value} / {latestChapter}</span>
        <button type="button" disabled={atLatest} onClick={() => onChange(latestChapter)}>
          Latest authorized <ChevronRight size={13} aria-hidden="true" />
        </button>
      </div>

      <p className="spoiler-control__release-note">
        <LockKeyhole size={13} aria-hidden="true" />
        Unreleased or unimported chapters remain excluded until they pass the archive publication boundary.
      </p>
    </div>
  );
}
