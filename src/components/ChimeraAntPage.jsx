import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpenText,
  ExternalLink,
  MapPinned,
  Orbit,
  Shield,
  Swords,
} from 'lucide-react';
import { storyArcPageById } from '../data/storyArcPages';
import { storyArcArtworkById } from '../data/storyArcArtwork';
import {
  chimeraAntPalette,
  chimeraAntPhases,
  chimeraAntSectionOrder,
} from '../data/chimeraAntExperience';
import SafeImage from './SafeImage';
import './ChimeraAntPage.css';
import './ChimeraAntBatch3.css';

const SECTION_META = Object.freeze({
  overview: Object.freeze({ label: 'Overview', kicker: 'Arc orientation', title: 'The conflict at a glance.' }),
  'before-the-arc': Object.freeze({ label: 'Before the arc', kicker: 'Transition in', title: 'Why the story arrives here.' }),
  premise: Object.freeze({ label: 'Premise', kicker: 'Central conflict', title: 'What the arc is asking.' }),
  'episode-phases': Object.freeze({ label: 'Episode phases', kicker: 'Episodes 76–136', title: 'Seven movements govern the archive.' }),
  timeline: Object.freeze({ label: 'Timeline', kicker: 'Narrative sequence', title: 'The arc changes state seven times.' }),
  characters: Object.freeze({ label: 'Characters', kicker: 'People in the story', title: 'Objectives, loyalties, and outcomes.' }),
  factions: Object.freeze({ label: 'Factions', kicker: 'Power groups', title: 'Institutions and colonies contest the field.' }),
  locations: Object.freeze({ label: 'Locations', kicker: 'Story geography', title: 'Movement changes the conflict.' }),
  nen: Object.freeze({ label: 'Nen', kicker: 'Power systems', title: 'Abilities matter through tactical function.' }),
  conflicts: Object.freeze({ label: 'Conflicts', kicker: 'Battles and operations', title: 'Objectives, disruptions, costs, and results.' }),
  objects: Object.freeze({ label: 'Objects', kicker: 'Evidence and symbols', title: 'Items carry rules, ownership, and consequence.' }),
  ending: Object.freeze({ label: 'Ending', kicker: 'Resolution and aftermath', title: 'How the central conflict closes.' }),
  adaptation: Object.freeze({ label: 'Manga vs anime', kicker: 'Adaptation record', title: 'How each medium carries the arc.' }),
  records: Object.freeze({ label: 'Records', kicker: 'Scoped directory', title: 'The arc’s chapter and episode boundaries.' }),
  sources: Object.freeze({ label: 'Sources', kicker: 'Reference boundary', title: 'Sources attached to this archive.' }),
});

const ARC_GLANCE_RECORDS = Object.freeze([
  Object.freeze({ label: 'Human field', title: 'Gon, Killua, Kite, Netero, Morel’s team', note: 'An investigation becomes an extermination operation with competing personal and institutional objectives.' }),
  Object.freeze({ label: 'Ant leadership', title: 'Meruem, the Royal Guards, and fractured squadrons', note: 'The colony develops hierarchy, memory, personality, political ambition, and conflicting loyalties.' }),
  Object.freeze({ label: 'Geographic path', title: 'Kakin coast → NGL → East Gorteau → Royal Palace', note: 'Each change of place enlarges the threat from isolated colony to state-scale crisis.' }),
  Object.freeze({ label: 'Narrative form', title: 'Ecological horror → military operation → intimate tragedy', note: 'The visual language should change with the story rather than repeat one component system.' }),
  Object.freeze({ label: 'Decisive rupture', title: 'Komugi is injured as the invasion begins', note: 'The planned target assignments fracture while Meruem’s priorities become inseparable from her survival.' }),
  Object.freeze({ label: 'Closing consequence', title: 'The King falls; Gon survives at catastrophic cost', note: 'The Ant crisis closes, but Netero’s death and Gon’s condition create the Election arc’s immediate agenda.' }),
]);

const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const rangeText = (range, prefix) => Array.isArray(range) ? `${prefix} ${range[0]}–${range[1]}` : 'Not available';
const sectionId = (id) => `chimera-${id}`;
const inclusiveCount = (range) => Array.isArray(range) ? range[1] - range[0] + 1 : 0;
const totalEpisodeCount = chimeraAntPhases.reduce((sum, phase) => sum + inclusiveCount(phase.episodes), 0);

function scrollToRecord(id) {
  document.getElementById(sectionId(id))?.scrollIntoView({
    block: 'start',
    behavior: reducedMotion() ? 'auto' : 'smooth',
  });
}

function SectionFrame({ id, index, children, tone = 'paper' }) {
  const meta = SECTION_META[id];
  return <section
    id={sectionId(id)}
    className={`chimera-ant-section chimera-ant-section--${tone}`}
    data-section-id={id}
    aria-labelledby={`${sectionId(id)}-title`}
  >
    <header className="chimera-ant-section__heading">
      <span className="chimera-ant-section__number">{String(index + 1).padStart(2, '0')}</span>
      <div>
        <span className="chimera-ant-section__kicker">{meta.kicker}</span>
        <h2 id={`${sectionId(id)}-title`}>{meta.title}</h2>
      </div>
    </header>
    {children}
  </section>;
}

function ReadingRail({ activeSection, activePhase, progress }) {
  const phase = chimeraAntPhases.find((item) => item.id === activePhase) || chimeraAntPhases[0];
  return <aside className="chimera-ant-rail" aria-label="Chimera Ant reading rail">
    <div className="chimera-ant-rail__sticky">
      <div className="chimera-ant-rail__progress" aria-label={`${Math.round(progress * 100)} percent through this page`}>
        <span style={{ '--chimera-progress': `${Math.max(0, Math.min(progress, 1)) * 100}%` }} />
      </div>
      <div className="chimera-ant-rail__identity">
        <span>Story 06</span>
        <strong>Chimera Ant</strong>
        <small>Desktop archive</small>
      </div>
      <nav aria-label="Page sections">
        {chimeraAntSectionOrder.map((id, index) => <button
          type="button"
          key={id}
          className={activeSection === id ? 'is-active' : ''}
          aria-current={activeSection === id ? 'location' : undefined}
          onClick={() => scrollToRecord(id)}
        >
          <i>{String(index + 1).padStart(2, '0')}</i>
          <span>{SECTION_META[id].label}</span>
        </button>)}
      </nav>
      <div className="chimera-ant-rail__phase" aria-live="polite">
        <span>Current phase</span>
        <strong>{String(phase.number).padStart(2, '0')} · {phase.shortTitle}</strong>
        <small>Episodes {phase.episodes[0]}–{phase.episodes[1]}</small>
      </div>
    </div>
  </aside>;
}

function CinematicHero({ arc, onNavigate }) {
  const artwork = storyArcArtworkById.get(arc.id);
  const episodeCount = inclusiveCount(arc.anime2011?.pageRange);
  const chapterCount = inclusiveCount(arc.manga?.pageRange);
  return <header className="chimera-ant-hero-v2">
    <figure className="chimera-ant-hero-v2__art" aria-hidden="true">
      <SafeImage
        src={artwork?.image || arc.visual.hero[0]}
        fallbackSrc={artwork?.fallback || arc.visual.hero[0]}
        alt=""
        eager
        priority="high"
        style={{
          '--chimera-hero-position': artwork?.position || 'center',
          '--chimera-hero-fit': artwork?.fit || 'cover',
        }}
      />
    </figure>
    <div className="chimera-ant-hero-v2__veil" />
    <nav className="chimera-ant-hero-v2__route" aria-label="Arc navigation">
      <button type="button" onClick={() => onNavigate('series', arc.previousId)}><ArrowLeft size={15} /> Greed Island</button>
      <button type="button" onClick={() => onNavigate('series')}>All story arcs</button>
      <button type="button" onClick={() => onNavigate('series', arc.nextId)}>Election <ArrowRight size={15} /></button>
    </nav>
    <div className="chimera-ant-hero-v2__content">
      <div className="chimera-ant-hero-v2__kicker"><i /> Story 06 · Complete illustrated archive</div>
      <h1>{arc.title}</h1>
      <p>{arc.premise}</p>
      <div className="chimera-ant-hero-v2__actions">
        <button type="button" onClick={() => scrollToRecord('overview')}>Enter the archive <ArrowRight size={15} /></button>
        <button type="button" onClick={() => scrollToRecord('episode-phases')}>View episode structure</button>
      </div>
    </div>
    <aside className="chimera-ant-hero-v2__field-note" aria-label="Arc field classification">
      <span>Field classification</span>
      <strong>Biological threat becomes a war over what counts as human.</strong>
      <dl>
        <div><dt>Terrain</dt><dd>NGL and East Gorteau</dd></div>
        <div><dt>Threat</dt><dd>Adaptive colony and state-scale Selection</dd></div>
        <div><dt>Form</dt><dd>Expedition, siege, duel, aftermath</dd></div>
      </dl>
    </aside>
    <dl className="chimera-ant-hero-v2__facts">
      <div><dt>Manga</dt><dd>{rangeText(arc.manga?.pageRange, 'Ch.')} · {chapterCount} chapters</dd></div>
      <div><dt>2011 anime</dt><dd>{rangeText(arc.anime2011?.pageRange, 'Ep.')} · {episodeCount} episodes</dd></div>
      <div><dt>Structure</dt><dd>7 episode phases</dd></div>
      <div><dt>Story path</dt><dd>NGL → East Gorteau → Palace</dd></div>
      <div><dt>Primary lens</dt><dd>{arc.focus?.[0] || 'Humanity and monstrosity'}</dd></div>
    </dl>
  </header>;
}

function ArcAtAGlance({ arc }) {
  return <div className="chimera-ant-at-glance">
    <div>
      <article className="chimera-ant-glance__lead">
        <span className="chimera-ant-glance__label">Central conflict</span>
        <h3>Stop an evolving species before extermination turns into mass conversion.</h3>
        <p>{arc.objective} The operation grows harder because the Ants inherit human memory and desire while the human response increasingly depends on coercion, sacrifice, and weapons of mass death.</p>
      </article>
      <div className="chimera-ant-glance__path" aria-label="Arc escalation path">
        <article><i>01 · Discover</i><strong>Investigate the colony</strong><p>Kite’s survey enters NGL as a biological mystery and meets a rapidly escalating predator.</p></article>
        <article><i>02 · Contain</i><strong>Break the state project</strong><p>The Hunters must stop the Selection after Meruem and the Royal Guards seize East Gorteau.</p></article>
        <article><i>03 · Survive</i><strong>Pay for victory</strong><p>The palace invasion succeeds only through irreversible costs that outlive the enemy.</p></article>
      </div>
    </div>
    <div className="chimera-ant-glance__records">
      {ARC_GLANCE_RECORDS.map((record) => <article className="chimera-ant-glance__record" key={record.label}>
        <span>{record.label}</span>
        <strong>{record.title}</strong>
        <p>{record.note}</p>
      </article>)}
    </div>
  </div>;
}

function EpisodePhaseRail({ activePhase, onSelectPhase }) {
  const selected = chimeraAntPhases.find((phase) => phase.id === activePhase) || chimeraAntPhases[0];
  const selectedCount = inclusiveCount(selected.episodes);
  const share = Math.round((selectedCount / totalEpisodeCount) * 100);
  return <div className="chimera-ant-phase-rail">
    <div className="chimera-ant-phase-rail__track" aria-label="Proportional seven-phase episode rail">
      {chimeraAntPhases.map((phase) => {
        const count = inclusiveCount(phase.episodes);
        return <button
          type="button"
          key={phase.id}
          data-phase-id={phase.id}
          className={`chimera-ant-phase-rail__segment ${activePhase === phase.id ? 'is-active' : ''}`}
          style={{ '--phase-weight': count }}
          aria-pressed={activePhase === phase.id}
          onClick={() => onSelectPhase(phase.id)}
        >
          <i>{String(phase.number).padStart(2, '0')}</i>
          <span>Ep. {phase.episodes[0]}–{phase.episodes[1]}</span>
          <strong>{phase.shortTitle}</strong>
        </button>;
      })}
    </div>
    <div className="chimera-ant-phase-rail__detail" id="chimera-phase-detail" aria-live="polite">
      <article className="chimera-ant-phase-rail__summary">
        <span className="chimera-ant-phase-rail__eyebrow">Phase {String(selected.number).padStart(2, '0')}</span>
        <strong>{selected.title}</strong>
        <p>Episodes {selected.episodes[0]}–{selected.episodes[1]}</p>
        <small>{selectedCount} episodes · {share}% of the arc</small>
      </article>
      <article className="chimera-ant-phase-rail__state"><dl><dt>Opening state</dt><dd>{selected.openingCondition}</dd></dl></article>
      <article className="chimera-ant-phase-rail__state"><dl><dt>Turning point</dt><dd>{selected.turningPoint}</dd></dl></article>
      <article className="chimera-ant-phase-rail__state"><dl><dt>Closing state</dt><dd>{selected.closingCondition}</dd></dl></article>
    </div>
  </div>;
}

function CharacterLedger({ arc, onNavigate }) {
  return <div className="chimera-ant-character-ledger">{arc.characters.map((character) => <article key={character.name}>
    {character.image && <figure><SafeImage src={character.image} alt={`${character.name} portrait from Hunterpedia`} /></figure>}
    <div>
      <span>{character.role}</span>
      <h3>{character.name}</h3>
      <p>{character.goal}</p>
      <dl><div><dt>Affiliation</dt><dd>{character.affiliation}</dd></div><div><dt>Arc status</dt><dd>{character.status}</dd></div></dl>
      <button type="button" onClick={() => onNavigate('reference', 'encyclopedia', { category: 'characters', search: character.name })}>Open dossier <ArrowRight size={14} /></button>
    </div>
  </article>)}</div>;
}

export default function ChimeraAntPage({ onNavigate }) {
  const arc = storyArcPageById.get('chimera-ant');
  const pageRef = useRef(null);
  const [activeSection, setActiveSection] = useState(chimeraAntSectionOrder[0]);
  const [activePhase, setActivePhase] = useState(chimeraAntPhases[0].id);
  const [progress, setProgress] = useState(0);

  const style = useMemo(() => ({
    '--chimera-void': chimeraAntPalette.void,
    '--chimera-charcoal': chimeraAntPalette.charcoal,
    '--chimera-bone': chimeraAntPalette.bone,
    '--chimera-paper': chimeraAntPalette.paper,
    '--chimera-ink': chimeraAntPalette.ink,
    '--chimera-olive': chimeraAntPalette.olive,
    '--chimera-moss': chimeraAntPalette.moss,
    '--chimera-rose': chimeraAntPalette.rose,
    '--chimera-royal': chimeraAntPalette.royal,
    '--chimera-mist': chimeraAntPalette.mist,
  }), []);

  useEffect(() => {
    const root = pageRef.current;
    if (!root || typeof IntersectionObserver === 'undefined') return undefined;
    const sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visible[0]?.target?.dataset?.sectionId) setActiveSection(visible[0].target.dataset.sectionId);
    }, { rootMargin: '-18% 0px -66% 0px', threshold: [0.01, 0.2, 0.45, 0.7] });
    const phaseObserver = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visible[0]?.target?.dataset?.phaseId) setActivePhase(visible[0].target.dataset.phaseId);
    }, { rootMargin: '-24% 0px -58% 0px', threshold: [0.01, 0.25, 0.6] });
    root.querySelectorAll('[data-section-id]').forEach((node) => sectionObserver.observe(node));
    root.querySelectorAll('[data-phase-section="true"]').forEach((node) => phaseObserver.observe(node));
    return () => {
      sectionObserver.disconnect();
      phaseObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const root = pageRef.current;
      if (!root) return;
      const top = root.offsetTop;
      const distance = Math.max(1, root.scrollHeight - window.innerHeight);
      setProgress(Math.max(0, Math.min(1, (window.scrollY - top) / distance)));
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  if (!arc) return null;

  return <article className="chimera-ant-page" style={style} ref={pageRef}>
    <CinematicHero arc={arc} onNavigate={onNavigate} />
    <div className="chimera-ant-shell">
      <ReadingRail activeSection={activeSection} activePhase={activePhase} progress={progress} />
      <div className="chimera-ant-canvas">
        <SectionFrame id="overview" index={0}><ArcAtAGlance arc={arc} /></SectionFrame>

        <SectionFrame id="before-the-arc" index={1} tone="bone">
          <div className="chimera-ant-reading-spread"><p>{arc.context}</p><aside><span>Transition in</span><p>This page follows Greed Island and begins with Gon and Killua’s next lead toward Ging.</p></aside></div>
        </SectionFrame>

        <SectionFrame id="premise" index={2}>
          <div className="chimera-ant-premise-ledger">
            <article><span>Objective</span><p>{arc.objective}</p></article>
            <article><span>Stakes</span><p>{arc.stakes}</p></article>
            <article><span>Narrative structure</span><p>{arc.structure}</p></article>
            <article><span>Central question</span><p>{arc.question}</p></article>
          </div>
        </SectionFrame>

        <SectionFrame id="episode-phases" index={3} tone="bone">
          <EpisodePhaseRail activePhase={activePhase} onSelectPhase={setActivePhase} />
        </SectionFrame>

        <SectionFrame id="timeline" index={4}>
          <ol className="chimera-ant-timeline">{chimeraAntPhases.map((phase) => <li key={phase.id}>
            <i>{String(phase.number).padStart(2, '0')}</i>
            <div><span>Episodes {phase.episodes[0]}–{phase.episodes[1]}</span><h3>{phase.shortTitle}</h3><p>{phase.closingCondition}</p></div>
          </li>)}</ol>
        </SectionFrame>

        <SectionFrame id="characters" index={5} tone="bone"><CharacterLedger arc={arc} onNavigate={onNavigate} /></SectionFrame>

        <SectionFrame id="factions" index={6}>
          <div className="chimera-ant-record-grid">{arc.factions.map((item) => <article key={item.name}><Shield size={19} /><h3>{item.name}</h3><dl><div><dt>Objective</dt><dd>{item.objective}</dd></div><div><dt>Leadership</dt><dd>{item.leadership}</dd></div><div><dt>Outcome</dt><dd>{item.outcome}</dd></div></dl></article>)}</div>
        </SectionFrame>

        <SectionFrame id="locations" index={7} tone="bone">
          <div className="chimera-ant-record-grid">{arc.locations.map((item) => <article key={item.name}><MapPinned size={19} /><h3>{item.name}</h3><p>{item.role}</p><small>{item.movement}</small><button type="button" onClick={() => onNavigate('reference', 'atlas', { search: item.name })}>Open in atlas <ArrowRight size={13} /></button></article>)}</div>
        </SectionFrame>

        <SectionFrame id="nen" index={8}>
          <div className="chimera-ant-nen-ledger">{arc.nen.map((item, index) => <article key={item}><i>{String(index + 1).padStart(2, '0')}</i><Orbit size={18} /><span>{item}</span></article>)}</div>
          <button className="chimera-ant-inline-action" type="button" onClick={() => onNavigate('reference', 'nen')}>Open complete Nen encyclopedia <ArrowRight size={14} /></button>
        </SectionFrame>

        <SectionFrame id="conflicts" index={9} tone="bone">
          <div className="chimera-ant-conflict-ledger">{arc.conflicts.map((item) => <article key={item.title}><Swords size={19} /><div><h3>{item.title}</h3><p><b>Participants:</b> {item.participants}</p><p><b>Objective:</b> {item.objective}</p><p><b>Result:</b> {item.result}</p></div></article>)}</div>
        </SectionFrame>

        <SectionFrame id="objects" index={10}>
          <div className="chimera-ant-record-grid">{arc.objects.map((item) => <article key={item.name}><BookOpenText size={18} /><span>{item.owner}</span><h3>{item.name}</h3><p>{item.function}</p><small>{item.importance}</small></article>)}</div>
        </SectionFrame>

        <SectionFrame id="ending" index={11} tone="bone">
          <div className="chimera-ant-ending"><p>{arc.ending}</p><aside><span>Connection forward</span><p>{arc.transition}</p><button type="button" onClick={() => onNavigate('series', arc.nextId)}>Continue to the Election arc <ArrowRight size={14} /></button></aside></div>
        </SectionFrame>

        <SectionFrame id="adaptation" index={12}>
          <div className="chimera-ant-adaptation"><dl><div><dt>Manga</dt><dd>{rangeText(arc.manga?.pageRange, 'Ch.')}</dd></div><div><dt>2011 anime</dt><dd>{rangeText(arc.anime2011?.pageRange, 'Ep.')}</dd></div></dl><ul>{arc.adaptation.map((item) => <li key={item}>{item}</li>)}</ul></div>
        </SectionFrame>

        <SectionFrame id="records" index={13} tone="bone">
          <div className="chimera-ant-record-summary"><div><span>Manga record</span><strong>{rangeText(arc.manga?.pageRange, 'Chapters')}</strong></div><div><span>Anime record</span><strong>{rangeText(arc.anime2011?.pageRange, 'Episodes')}</strong></div><button type="button" onClick={() => onNavigate('series', 'chapters', { arc: 'chimera-ant' })}>Open chapter directory <ArrowRight size={14} /></button></div>
        </SectionFrame>

        <SectionFrame id="sources" index={14}>
          <div className="chimera-ant-source-list">{arc.sources.map((item) => <a href={item.href} target="_blank" rel="noreferrer noopener" key={item.href}><span>{item.label}</span><ExternalLink size={14} /></a>)}</div>
        </SectionFrame>
      </div>
    </div>
  </article>;
}
