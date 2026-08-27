import React from 'react';
import {
  Annotation,
  ArtCanvas,
  BleedMedia,
  DisplayTitle,
  MetaRail,
  MonumentTitle,
  StoryBeat,
} from './ArtDirectionPrimitives';
import './ArtDirectionPrimitives.stories.css';

export default {
  title: 'Succession/Art Direction/Composition Grammar',
  parameters: {
    layout: 'fullscreen',
  },
};

export function MonumentAndBleed() {
  return <ArtCanvas className="succession-art-act" aria-label="Monument type and image bleed example">
    <div className="succession-art-story__copy">
      <MetaRail items={['Succession Contest', 'Chapter-aware', 'Editorial grammar']} />
      <MonumentTitle>Fourteen heirs. One vessel.</MonumentTitle>
      <p className="succession-art-copy">Typography and manga imagery are allowed to become architecture rather than content inside repeated component shells.</p>
    </div>
    <BleedMedia
      className="succession-art-story__media"
      src="/media/rooms/black-whale-exterior.webp"
      alt="Black Whale 1"
      bleed="right"
    />
    <Annotation className="succession-art-story__annotation">Content can occupy the interface instead of sitting inside it.</Annotation>
  </ArtCanvas>;
}

export function NarrativeBeat() {
  return <ArtCanvas className="succession-art-act" aria-label="Narrative beat example">
    <div className="succession-art-story__title">
      <MetaRail items={['Narrative', 'Progressive disclosure']} />
      <DisplayTitle>Information arrives when it matters.</DisplayTitle>
    </div>
    <div className="succession-art-story__beats">
      <StoryBeat title="Prince">Introduce the subject.</StoryBeat>
      <StoryBeat title="Protection">Reveal the surrounding personnel.</StoryBeat>
      <StoryBeat title="Conflict">Expose the relationship pressure.</StoryBeat>
      <StoryBeat title="Consequence">Resolve the change into chapter state.</StoryBeat>
    </div>
  </ArtCanvas>;
}
