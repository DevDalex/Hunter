import { Eye, EyeOff } from 'lucide-react';

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

  return (
    <div className="spoiler-control">
      <div className="spoiler-control__label">{value < latestChapter ? <EyeOff size={15} /> : <Eye size={15} />}<span><b>Spoiler boundary</b><small>Show chapter-linked records through Chapter {value}</small></span></div>
      <label>
        <span className="sr-only">Choose spoiler boundary</span>
        <select value={selectedIsPreset ? value : 'custom'} onChange={(event) => event.target.value !== 'custom' && onChange(Number(event.target.value))}>
          {choices.map(([chapter, label]) => <option value={chapter} key={chapter}>{label} · Ch. {chapter}</option>)}
          {!selectedIsPreset && <option value="custom">Custom · Ch. {value}</option>}
        </select>
      </label>
      <label className="spoiler-control__number"><span>Max chapter</span><input type="number" min="1" max={latestChapter} value={value} onChange={(event) => onChange(Math.min(latestChapter, Math.max(1, Number(event.target.value) || 1)))} /></label>
    </div>
  );
}
