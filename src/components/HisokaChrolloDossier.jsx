import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, BookOpen, ExternalLink, Eye, Map, Zap } from 'lucide-react';
import SafeImage from './SafeImage';
import { characterMedia, characterPortrait } from '../data/entityRegistry';
import {
  aftermathNodes,
  aftermathImages,
  bodyStates,
  comboSteps,
  debateRows,
  fightAbilities,
  fightChapters,
  fightSources,
  knowledgeRows,
  strategyColumns,
} from '../data/hisokaChrollo';

const portraitFor = (name) => characterPortrait(name);
const mediaFor = (name) => characterMedia(name);

export default function HisokaChrolloDossier({ initialChapter = 351, initialAbility = 'sun-moon' }) {
  const validInitialChapter = fightChapters.some((record) => record.number === Number(initialChapter)) ? Number(initialChapter) : 351;
  const validInitialAbility = fightAbilities.some((record) => record.id === initialAbility) ? initialAbility : 'sun-moon';
  const [chapterNumber, setChapterNumber] = useState(validInitialChapter);
  const [abilityId, setAbilityId] = useState(validInitialAbility);
  const [showAftermath, setShowAftermath] = useState(false);
  const chapterRail = useRef(null);
  const chapter = fightChapters.find((record) => record.number === chapterNumber) || fightChapters[0];
  const ability = fightAbilities.find((record) => record.id === abilityId) || fightAbilities[0];
  const activeAbilityIds = useMemo(() => new Set(chapter.mechanics.map((name) => fightAbilities.find((record) => record.name === name)?.id).filter(Boolean)), [chapter]);

  useEffect(() => {
    if (fightChapters.some((record) => record.number === Number(initialChapter))) setChapterNumber(Number(initialChapter));
  }, [initialChapter]);
  useEffect(() => {
    if (fightAbilities.some((record) => record.id === initialAbility)) setAbilityId(initialAbility);
  }, [initialAbility]);

  const preserveSelectionInUrl = (nextChapter, nextAbility) => {
    const params = new URLSearchParams({ chapter: String(nextChapter), ability: nextAbility });
    window.history.replaceState(null, '', `#/reference/hisoka-chrollo?${params}`);
  };
  const selectChapter = (number) => {
    setChapterNumber(number);
    preserveSelectionInUrl(number, abilityId);
  };
  const selectAbility = (id) => {
    setAbilityId(id);
    preserveSelectionInUrl(chapterNumber, id);
  };
  const scrollToSection = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const moveChapterTab = (event, index) => {
    const commands = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    if (!commands[event.key] && event.key !== 'Home' && event.key !== 'End') return;
    event.preventDefault();
    const nextIndex = event.key === 'Home' ? 0 : event.key === 'End' ? fightChapters.length - 1 : (index + commands[event.key] + fightChapters.length) % fightChapters.length;
    selectChapter(fightChapters[nextIndex].number);
    chapterRail.current?.querySelectorAll('[role="tab"]')[nextIndex]?.focus();
  };

  return (
    <section className="fight-dossier" id="hisoka-vs-chrollo">
      <div className="fight-hero">
        <article className="fight-hero__fighter fight-hero__fighter--hisoka">
          <SafeImage src={portraitFor('Hisoka Morow')} media={mediaFor('Hisoka Morow')} alt="Hisoka Morow portrait from Hunterpedia" eager />
          <div><span>Challenger · Transmuter</span><h2>Hisoka</h2><p>Reactive improvisation, elastic movement and a willingness to solve an opponent during combat.</p><a href={fightSources.hisoka} target="_blank" rel="noreferrer">Hunterpedia profile <ExternalLink size={11} /></a></div>
        </article>
        <div className="fight-hero__center">
          <span>Volume 34 · Chapters 351–357</span>
          <h1>Battle to the Death</h1>
          <p>One fighter enters for the ideal duel. The other turns an arena, an audience and six overlapping abilities into a prepared execution system.</p>
          <dl><div><dt>Location</dt><dd>Heavens Arena</dd></div><div><dt>Official winner</dt><dd>Chrollo</dd></div><div><dt>Long result</dt><dd>Spider-wide hunt</dd></div></dl>
        </div>
        <article className="fight-hero__fighter fight-hero__fighter--chrollo">
          <SafeImage src={portraitFor('Chrollo Lucilfer')} media={mediaFor('Chrollo Lucilfer')} alt="Chrollo Lucilfer portrait from Hunterpedia" eager />
          <div><span>Floor Master · Specialist</span><h2>Chrollo</h2><p>Preparation, information control and a multi-ability system engineered around Hisoka’s choices.</p><a href={fightSources.chrollo} target="_blank" rel="noreferrer">Hunterpedia profile <ExternalLink size={11} /></a></div>
        </article>
      </div>

      <nav className="fight-local-nav" aria-label="Hisoka versus Chrollo dossier sections">
        <button type="button" onClick={() => scrollToSection('fight-reconstruction')}>Reconstruction</button><button type="button" onClick={() => scrollToSection('fight-abilities')}>Ability system</button><button type="button" onClick={() => scrollToSection('fight-arena')}>Arena</button><button type="button" onClick={() => scrollToSection('fight-information')}>Information</button><button type="button" onClick={() => scrollToSection('fight-outcome')}>Outcome</button>
      </nav>

      <div className="fight-fact-strip">
        <div><strong>7</strong><span>Fight chapters</span></div><div><strong>9</strong><span>Indexed abilities</span></div><div><strong>2</strong><span>Floor Masters</span></div><div><strong>1</strong><span>Prepared kill system</span></div><div><strong>∞</strong><span>Consequences still active</span></div>
      </div>

      <section className="fight-context">
        <div className="fight-section-heading"><span>01 · Context</span><h2>The fight starts years before the bell</h2><p>Chrollo’s lost Nen, Hisoka’s pursuit and the eventual exorcism turn this match into a delayed promise. The delay matters: Chrollo does not merely recover—he prepares a combination and an environment.</p></div>
        <div className="fight-context-flow">
          {[
            ['Yorknew', 'Hisoka engineers an opportunity, then discovers Chrollo cannot use Nen.'],
            ['Exorcism', 'Hisoka helps make Chrollo’s restoration and the future fight possible.'],
            ['Preparation', 'Chrollo selects abilities, learns their interactions and chooses Heavens Arena.'],
            ['Acceptance', 'Hisoka knowingly accepts a lethal match under Chrollo’s prepared conditions.'],
          ].map(([title, text], index) => <article key={title}><i>{index + 1}</i><h3>{title}</h3><p>{text}</p>{index < 3 && <ArrowRight aria-hidden="true" />}</article>)}
        </div>
        <div className="fight-context-note"><strong>Central tension</strong><p>Hisoka believes live adaptation can overcome preparation. Chrollo believes preparation can make adaptation irrelevant before Hisoka understands the whole system.</p></div>
      </section>

      <section className="fight-reconstruction" id="fight-reconstruction">
        <div className="fight-section-heading"><span>02 · Interactive reconstruction</span><h2>Seven chapters, one tightening trap</h2><p>Select a chapter to change the explanation, active ability stack, sourced image and arena positions.</p></div>
        <div className="fight-chapter-rail" role="tablist" aria-label="Fight chapters" ref={chapterRail}>{fightChapters.map((record, index) => <button type="button" role="tab" id={`fight-tab-${record.number}`} aria-controls="fight-chapter-panel" aria-selected={chapterNumber === record.number} tabIndex={chapterNumber === record.number ? 0 : -1} className={chapterNumber === record.number ? 'is-active' : ''} onClick={() => selectChapter(record.number)} onKeyDown={(event) => moveChapterTab(event, index)} key={record.number}><span>Chapter</span><strong>{record.number}</strong><small>{record.title}</small></button>)}</div>
        <div className="fight-chapter-stage">
          <figure className="fight-chapter-stage__visual">
            <SafeImage src={chapter.image} alt={chapter.imageAlt} />
            <figcaption><span>Chapter {chapter.number} visual</span><strong>{chapter.phase}</strong><a href={chapter.source} target="_blank" rel="noreferrer">Verify on Hunterpedia <ExternalLink size={11} /></a></figcaption>
          </figure>
          <article className="fight-chapter-stage__record" id="fight-chapter-panel" role="tabpanel" aria-labelledby={`fight-tab-${chapter.number}`}>
            <header><span>{chapter.phase}</span><h3>Chapter {chapter.number}: {chapter.title}</h3><p>{chapter.thesis}</p></header>
            <ol>{chapter.events.map((event) => <li key={event}>{event}</li>)}</ol>
            <div className="fight-state-pair"><div><span>Hisoka’s state</span><p>{chapter.hisokaState}</p></div><div><span>Chrollo’s state</span><p>{chapter.chrolloState}</p></div></div>
            <footer><div>{chapter.mechanics.map((mechanic) => <button type="button" onClick={() => selectAbility(fightAbilities.find((record) => record.name === mechanic)?.id || abilityId)} key={mechanic}>{mechanic}</button>)}</div><a href={chapter.source} target="_blank" rel="noreferrer">Chapter source <ExternalLink size={11} /></a></footer>
          </article>
        </div>
      </section>

      <section className="fight-ability-system" id="fight-abilities">
        <div className="fight-section-heading fight-section-heading--light"><span>03 · Ability architecture</span><h2>Chrollo does not use six tricks. He builds one machine.</h2><p>Choose any node to inspect its role, condition and owner. Bright nodes are active in the currently selected chapter.</p></div>
        <div className="fight-ability-workbench">
          <div className="fight-combo-flow">{comboSteps.map(([name, role, id], index) => <button type="button" className={`${abilityId === id ? 'is-selected' : ''}${activeAbilityIds.has(id) ? ' is-active' : ''}`} onClick={() => selectAbility(id)} key={id}><span>{String(index + 1).padStart(2, '0')}</span><strong>{name}</strong><small>{role}</small>{index < comboSteps.length - 1 && <i aria-hidden="true" />}</button>)}</div>
          <aside className={`fight-ability-inspector fight-ability-inspector--${ability.color}`}>
            <SafeImage src={ability.image} alt={`${ability.name} shown during Hisoka versus Chrollo`} />
            <span>{ability.owner} · {ability.type}</span><h3>{ability.name}</h3><p>{ability.role}</p><dl><div><dt>Constraint</dt><dd>{ability.condition}</dd></div><div><dt>Selected chapter</dt><dd>{activeAbilityIds.has(ability.id) ? `Active in Chapter ${chapter.number}` : `Not foregrounded in Chapter ${chapter.number}`}</dd></div></dl><a href={ability.source} target="_blank" rel="noreferrer">Open Hunterpedia source <ExternalLink size={11} /></a>
          </aside>
        </div>
        <div className="fight-hisoka-tools">
          <article><Zap size={20} /><span>Elasticity</span><h3>Movement</h3><p>Ceiling anchors, recoil and sudden changes of direction keep Hisoka alive until explosions remove his secure routes.</p></article>
          <article><Eye size={20} /><span>Adhesion</span><h3>Tracking and control</h3><p>Invisible attachments turn bodies and heads into weapons, but every attachment also depends on surviving material and space.</p></article>
          <article><BookOpen size={20} /><span>Post-death command</span><h3>The concealed final move</h3><p>Hisoka’s only fully hidden instruction is not designed to win the official match; it is designed to act after death.</p></article>
        </div>
      </section>

      <section className="fight-arena-section" id="fight-arena">
        <div className="fight-section-heading"><span>04 · Spatial reading</span><h2>The audience is the battlefield</h2><p>This schematic is explanatory rather than an invented floor plan. Positions are approximate visualizations of the selected phase; the chapter remains the authority.</p></div>
        <div className="fight-arena-workbench">
          <div className="fight-arena-map" aria-label={`Approximate arena positions for Chapter ${chapter.number}`}>
            <div className="fight-arena-map__stand fight-arena-map__stand--outer"><span>Upper audience</span></div>
            <div className="fight-arena-map__stand fight-arena-map__stand--inner"><span>Lower audience</span></div>
            <div className="fight-arena-map__floor"><span>Arena floor</span></div>
            <i className="fight-marker fight-marker--hisoka" style={{ left: `${chapter.arena.hisoka[0]}%`, top: `${chapter.arena.hisoka[1]}%` }}><b>H</b><span>Hisoka</span></i>
            <i className="fight-marker fight-marker--chrollo" style={{ left: `${chapter.arena.chrollo[0]}%`, top: `${chapter.arena.chrollo[1]}%` }}><b>C</b><span>Chrollo</span></i>
            <i className="fight-marker fight-marker--threat" style={{ left: `${chapter.arena.threat[0]}%`, top: `${chapter.arena.threat[1]}%` }}><b>!</b><span>Threat mass</span></i>
          </div>
          <aside><span>Chapter {chapter.number} · {chapter.zone}</span><h3>{chapter.arena.label}</h3><p>{chapter.thesis}</p><ul><li>Close range risks Black Voice.</li><li>Long range gives Chrollo production time.</li><li>The crowd supplies concealment and bodies.</li><li>Explosions progressively remove safe movement.</li></ul><a href={fightSources.arena} target="_blank" rel="noreferrer"><Map size={13} /> Heavens Arena source</a></aside>
        </div>
        <div className="fight-pressure-board" aria-label="Why the arena favors Chrollo's prepared system">
          <article><span>Hisoka closes distance</span><h3>Black Voice becomes decisive</h3><p>One successful antenna placement can end the fight, so aggression carries an instant-control risk.</p></article>
          <article><span>Hisoka keeps distance</span><h3>Production time increases</h3><p>Chrollo gains time to copy bodies, stamp puppets, mark bombs and relocate through the audience.</p></article>
          <article><span>Hisoka attacks the crowd</span><h3>The resource becomes a weapon</h3><p>Heads, bodies, copies and marked remains keep changing roles, overloading identification and movement.</p></article>
        </div>
      </section>

      <section className="fight-information" id="fight-information">
        <div className="fight-section-heading"><span>05 · Information battle</span><h2>Knowing a rule is not the same as controlling it</h2><p>Hisoka correctly understands many individual mechanics. Chrollo wins by making those mechanics overlap faster than Hisoka can convert understanding into control.</p></div>
        <div className="fight-knowledge-table" role="table" aria-label="Hisoka information-state tracker">
          <header role="row"><span role="columnheader">Question</span><span role="columnheader">How learned</span><span role="columnheader">State</span><span role="columnheader">Why it matters</span></header>
          {knowledgeRows.map(([question, learned, state, meaning]) => <div role="row" key={question}><strong role="cell">{question}</strong><span role="cell">{learned}</span><b role="cell" data-state={state.toLowerCase().replaceAll(' ', '-')}>{state}</b><p role="cell">{meaning}</p></div>)}
        </div>
        <div className="fight-strategy-grid">{strategyColumns.map((column) => <article className={`fight-strategy fight-strategy--${column.side.toLowerCase()}`} key={column.side}><span>{column.side}</span><h3>{column.title}</h3><ol>{column.points.map((point) => <li key={point}>{point}</li>)}</ol><p>{column.conclusion}</p></article>)}</div>
      </section>

      <section className="fight-outcome" id="fight-outcome">
        <div className="fight-section-heading"><span>06 · Body state and result</span><h2>The official result and the result that matters</h2><p>Chrollo wins the match. Hisoka’s revival does not erase that victory; it changes what happens after it.</p></div>
        <div className="fight-body-timeline">{bodyStates.map(([phase, state, detail], index) => <article key={phase}><i>{index + 1}</i><span>{phase}</span><h3>{state}</h3><p>{detail}</p></article>)}</div>
        <button type="button" className="fight-aftermath-toggle" aria-expanded={showAftermath} onClick={() => setShowAftermath((value) => !value)}>{showAftermath ? 'Hide full aftermath spoilers' : 'Reveal Chapter 357 and Black Whale aftermath'}</button>
        {showAftermath && <div className="fight-aftermath">
          <div className="fight-aftermath-gallery">{aftermathImages.map((item) => <figure key={item.caption}><SafeImage src={item.image} alt={item.alt} /><figcaption>{item.caption}</figcaption></figure>)}</div>
          <div className="fight-aftermath-flow">{aftermathNodes.map(([title, detail], index) => <article key={title}><i>{index + 1}</i><div><h3>{title}</h3><p>{detail}</p></div>{index < aftermathNodes.length - 1 && <ArrowRight />}</article>)}</div>
        </div>}
      </section>

      <section className="fight-debate">
        <div className="fight-section-heading"><span>07 · Fact, interpretation and dispute</span><h2>Was it fair? Did Chrollo “cheat”?</h2><p>The dossier separates what the chapters establish from the conclusions readers draw from those facts.</p></div>
        <div className="fight-debate-grid">{debateRows.map((row) => <article className={`fight-debate-card fight-debate-card--${row.label.toLowerCase()}`} key={row.title}><span>{row.label}</span><h3>{row.title}</h3><p>{row.text}</p></article>)}</div>
        <blockquote><strong>Best-supported conclusion</strong><p>Chrollo won by preparing a system that controlled environment, information and sequence. Hisoka repeatedly solved immediate threats, but he accepted a battlefield where each solution could be converted into material for the next stage.</p></blockquote>
      </section>

    </section>
  );
}
