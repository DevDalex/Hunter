import NenSystemReferenceMap from './NenSystemReferenceMap';
import { nenRecords } from '../data/nenEncyclopedia';
import { priorityPortraitByName } from '../data/priorityMedia.generated';
import '../nen-reference-map.css';

const portraitItemFor = (name) => {
  const media = priorityPortraitByName.get(name);
  return media
    ? { id: name, name, source: media.articleSource, image: media.src, media }
    : { id: name, name, source: `https://hunterxhunter.fandom.com/wiki/${encodeURIComponent(name.replaceAll(' ', '_'))}` };
};

export default function NenEncyclopedia({ spoilerLimit = Number.MAX_SAFE_INTEGER }) {
  return <section className="nen-map-only" id="nen">
    <NenSystemReferenceMap records={nenRecords} spoilerLimit={spoilerLimit} portraitItemFor={portraitItemFor} />
  </section>;
}
