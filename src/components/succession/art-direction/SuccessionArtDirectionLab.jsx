import { useEffect } from 'react';
import {
  Annotation,
  ArtCanvas,
  BleedMedia,
  DisplayTitle,
  MetaRail,
  MonumentTitle,
  Reveal,
  StoryBeat,
} from './ArtDirectionPrimitives';
import './SuccessionArtDirectionLab.css';

export default function SuccessionArtDirectionLab() {
  useEffect(() => {
    document.title = 'Succession Art Direction Lab';
  }, []);

  return <main className="succession-art-lab succession-archive" aria-label="Succession art direction laboratory">
    <ArtCanvas className="succession-art-lab__intro">
      <Reveal className="succession-art-lab__intro-copy">
        <MetaRail items={['Succession Contest', 'Composition Lab', 'Not production']} />
        <MonumentTitle>The succession is the page.</MonumentTitle>
        <p className="succession-art-copy">
          This workshop tests scale, crop, overlap, pacing, annotation, and narrative hierarchy before any homepage system is committed to production.
        </p>
      </Reveal>

      <BleedMedia
        className="succession-art-lab__hero-media"
        src="/media/rooms/black-whale-exterior.webp"
        alt="Black Whale 1"
        bleed="right"
        eager
      />
      <Annotation className="succession-art-lab__hero-note">Image mass first. Interface furniture second.</Annotation>
      <span className="succession-art-index-number succession-art-lab__number" aria-hidden="true">14</span>
    </ArtCanvas>

    <ArtCanvas className="succession-art-act succession-art-lab__portrait-act">
      <BleedMedia
        className="succession-art-lab__portrait"
        src="/media/portraits/tserriednich-hui-guo-rou.webp"
        alt="Tserriednich Hui Guo Rou"
        focal="50% 18%"
        fragment
      />

      <Reveal className="succession-art-lab__portrait-copy">
        <div className="succession-art-meta">Fourth Prince · Royal branch</div>
        <DisplayTitle>Tserriednich</DisplayTitle>
        <p className="succession-art-copy">
          A subject can dominate the composition without being reduced to a profile card. Supporting facts can orbit the portrait, appear later, or surface only when the narrative requires them.
        </p>
      </Reveal>

      <Annotation className="succession-art-lab__portrait-note">Metadata attaches to the subject, not to a rectangle.</Annotation>

      <div className="succession-art-lab__threads">
        <StoryBeat title="Nen development">Reveal mechanics progressively rather than dumping the full ability record at once.</StoryBeat>
        <StoryBeat title="Theta">Relationships become narrative routes, not decorative connector lines.</StoryBeat>
        <StoryBeat title="Succession pressure">Temporal state determines what the composition is allowed to know.</StoryBeat>
      </div>
    </ArtCanvas>

    <ArtCanvas className="succession-art-act succession-art-lab__sequence">
      <div className="succession-art-lab__sequence-title">
        <MetaRail items={['Narrative sequence', 'Scroll choreography']} />
        <DisplayTitle>Complexity arrives in layers.</DisplayTitle>
        <p className="succession-art-copy">
          Scroll should explain the contest. The first frame does not need to contain the entire database.
        </p>
      </div>

      <div className="succession-art-lab__sequence-beats">
        <Reveal><StoryBeat title="Fourteen princes">Establish the bounded field before exposing its machinery.</StoryBeat></Reveal>
        <Reveal><StoryBeat title="Protection rings">Guards, queens, hunters, and surveillance enter only when they become relevant.</StoryBeat></Reveal>
        <Reveal><StoryBeat title="Tier 1 compresses">The royal conflict resolves spatially into the Black Whale rather than becoming another section.</StoryBeat></Reveal>
        <Reveal><StoryBeat title="Below deck">Mafia, Heil-Ly, and the Phantom Troupe alter the same visual world instead of opening a separate dashboard.</StoryBeat></Reveal>
        <Reveal><StoryBeat title="Consequences">Timeline and chapter state explain how the field changed.</StoryBeat></Reveal>
      </div>
    </ArtCanvas>

    <footer className="succession-art-lab__footer">
      <div>
        <div className="succession-art-meta">Lab contract</div>
        <p>No dashboard cards. No SVG-led visual language. No ornamental HUD. Every visual decision must improve hierarchy, narrative, spatial understanding, or discovery.</p>
      </div>
      <div className="succession-art-meta">DEV ONLY</div>
    </footer>
  </main>;
}
