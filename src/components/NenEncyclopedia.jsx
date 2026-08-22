import NenSystemExpansionMap from './NenSystemExpansionMap';
import SuccessionContextualCompletion from './succession/SuccessionContextualCompletion';
import { nenRecords } from '../data/nenEncyclopedia';
import { nenDeepRecords } from '../data/nenDeepReference';
import { priorityPortraitByName } from '../data/priorityMedia.generated';
import '../nen-reference-map.css';
import '../nen-spectrum-expansion.css';
import '../nen-map-shell.css';

const expandedNenRecords = Object.freeze([...nenRecords, ...nenDeepRecords]);

const portraitItemFor = (name) => {
  const media = priorityPortraitByName.get(name);
  return media
    ? { id: name, name, source: media.articleSource, image: media.src, media }
    : { id: name, name, source: `https://hunterxhunter.fandom.com/wiki/${encodeURIComponent(name.replaceAll(' ', '_'))}` };
};

export default function NenEncyclopedia({ spoilerLimit = Number.MAX_SAFE_INTEGER }) {
  return <>
    <section className="nen-map-only" id="nen">
      <NenSystemExpansionMap records={expandedNenRecords} spoilerLimit={spoilerLimit} portraitItemFor={portraitItemFor} />
    </section>
    <SuccessionContextualCompletion spoilerLimit={spoilerLimit} encyclopedia />
  </>;
}
