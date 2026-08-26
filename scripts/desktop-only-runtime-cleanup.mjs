import { readFile, writeFile } from 'node:fs/promises';

const rewrite = async (file, transforms) => {
  const before = await readFile(file, 'utf8');
  let after = before;
  for (const transform of transforms) after = transform(after);
  if (after === before) {
    console.log(`${file}: no runtime cleanup needed`);
    return false;
  }
  await writeFile(file, after);
  console.log(`${file}: desktop-only runtime cleanup applied`);
  return true;
};

const replaceRequired = (needle, replacement, label) => (source) => {
  if (!source.includes(needle)) throw new Error(`Desktop-only runtime cleanup could not find ${label}`);
  return source.replace(needle, replacement);
};

await rewrite('src/components/SuccessionTimeline.jsx', [
  replaceRequired(
    '<HorizontalScrollHint>The concurrent-lane view preserves its shared day axis on smaller screens. A complete lane-by-lane mobile list appears directly below it.</HorizontalScrollHint>',
    '<HorizontalScrollHint>The concurrent-lane view preserves its shared day axis. Scroll the labelled lane region horizontally when the full chronology exceeds the workspace width.</HorizontalScrollHint>',
    'the legacy narrow-screen timeline hint',
  ),
  replaceRequired(
    `        <div className="timeline-command-voyage__mobile-lanes" aria-label="Concurrent story lanes as mobile lists">\n          {timelineTracks.filter((track) => track.id !== 'all' && (activeTrack === 'all' || activeTrack === track.id)).map((track) => {\n            const events = filteredEvents.filter((event) => event.tracks.includes(track.id));\n            if (!events.length) return null;\n            return <details key={track.id}><summary><span>{track.label}</span><b>{events.length}</b></summary><div>{events.map((event) => eventButton(event, true))}</div></details>;\n          })}\n        </div>\n`,
    '',
    'the duplicate narrow-screen timeline lane renderer',
  ),
]);

const timeline = await readFile('src/components/SuccessionTimeline.jsx', 'utf8');
if (timeline.includes('timeline-command-voyage__mobile-lanes') || /\bmobile\b/i.test(timeline)) {
  throw new Error('SuccessionTimeline still contains a device-specific timeline branch after cleanup');
}
