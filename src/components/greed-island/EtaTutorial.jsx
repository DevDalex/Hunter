import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ExternalLink,
  FastForward,
  Play,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { readStoredJson, writeStoredJson } from '../../lib/browserStorage';
import { specifiedCards, specifiedCardById } from '../../data/greed-island/specifiedCards';
import {
  CARD_ANATOMY_PARTS,
  CARD_RANK_ORDER,
  ETA_TUTORIAL_LESSONS,
  GREED_ISLAND_RULE_SOURCES,
  PROTECTION_TUTORIAL_EXAMPLES,
  SPELL_TUTORIAL_EXAMPLES,
} from '../../data/greed-island/tutorialRules';
import InteractiveCard from './InteractiveCard';
import './EtaTutorial.css';

const STORAGE_KEY = 'hxh-greed-island-eta-tutorial-v1';

function readProgress() {
  const stored = readStoredJson(STORAGE_KEY, []);
  if (!Array.isArray(stored)) return new Set();
  const valid = new Set(ETA_TUTORIAL_LESSONS.map((lesson) => lesson.id));
  return new Set(stored.filter((id) => valid.has(id)));
}

function buildRankSummaries() {
  return CARD_RANK_ORDER.reduce((summaries, rank) => {
    const cards = specifiedCards.filter((card) => card.rank === rank);
    const limits = cards.map((card) => card.conversionLimit);
    summaries[rank] = Object.freeze({
      rank,
      count: cards.length,
      minimumLimit: limits.length ? Math.min(...limits) : null,
      maximumLimit: limits.length ? Math.max(...limits) : null,
      example: cards[0] || null,
    });
    return summaries;
  }, {});
}

const rankSummaries = buildRankSummaries();

function RingPractice({ setSummoned, announce }) {
  return <div className="gi-rule-demo gi-rule-demo--ring">
    <div className="gi-rule-ring" aria-hidden="true"><i /><b>G.I.</b><i /></div>
    <div>
      <span>Recognized command words</span>
      <h4>The ring connects the player to Book and Gain.</h4>
      <p>These controls demonstrate the two commands without claiming to invoke a live fictional system.</p>
      <div className="gi-rule-actions">
        <button type="button" onClick={() => { setSummoned(true); announce('Eta: “Book” recognized. The Binder has been summoned below.'); }}><BookOpen size={16} /> Book</button>
        <button type="button" onClick={() => announce('Eta: “Gain” requires a card in hand. The full conversion demonstration appears in lesson eight.')}><Sparkles size={16} /> Gain</button>
      </div>
    </div>
  </div>;
}

function BookPractice({ summoned, setSummoned, announce }) {
  return <div className="gi-rule-demo gi-rule-demo--book">
    <div className={`gi-rule-book${summoned ? ' is-active' : ''}`} aria-hidden="true"><i /><span /><b /></div>
    <div>
      <span>Book status</span>
      <h4>{summoned ? 'The Binder is summoned.' : 'The Binder is not present.'}</h4>
      <p>The real Binder section remains fully interactive below the tutorial.</p>
      <button type="button" onClick={() => {
        setSummoned(!summoned);
        announce(`Eta: Book ${summoned ? 'dismissed' : 'summoned'}.`);
      }}>{summoned ? 'Dismiss Book' : 'Say “Book”'}</button>
    </div>
  </div>;
}

function BinderPractice({ setSummoned, announce }) {
  return <div className="gi-rule-demo gi-rule-demo--binder">
    <div className="gi-rule-stat"><b>100</b><span>Specified Slots</span><small>Numbered pockets</small></div>
    <div className="gi-rule-stat"><b>45</b><span>Free Slots</span><small>Unnumbered storage</small></div>
    <div className="gi-rule-stat"><b>List</b><span>Met players</span><small>Documented Binder function</small></div>
    <button type="button" onClick={() => { setSummoned(true); announce('Eta: The full Binder is available below the tutorial.'); }}>Open the working Binder</button>
  </div>;
}

function AnatomyPractice({ part, setPart, announce }) {
  const card = specifiedCardById.get('002');
  const active = CARD_ANATOMY_PARTS.find((item) => item.id === part) || CARD_ANATOMY_PARTS[0];
  return <div className="gi-rule-demo gi-rule-demo--anatomy">
    <div className="gi-anatomy-visual">
      <InteractiveCard card={card} displayOnly />
      {CARD_ANATOMY_PARTS.map((item, index) => <span key={item.id} className={`gi-anatomy-marker gi-anatomy-marker--${item.id}${part === item.id ? ' is-active' : ''}`} aria-hidden="true">{index + 1}</span>)}
    </div>
    <div>
      <span>{active.position}</span>
      <h4>{active.label}</h4>
      <p>{active.note}</p>
      <div className="gi-anatomy-list" role="list" aria-label="Card anatomy parts">
        {CARD_ANATOMY_PARTS.map((item, index) => <button key={item.id} type="button" className={part === item.id ? 'is-active' : ''} onClick={() => { setPart(item.id); announce(`Eta: ${item.label}, ${item.position}.`); }}><i>{index + 1}</i>{item.label}</button>)}
      </div>
    </div>
  </div>;
}

function SlotPractice({ slotType, setSlotType, announce }) {
  const specified = slotType === 'specified';
  return <div className="gi-rule-demo gi-rule-demo--slots">
    <div className="gi-slot-switch" role="group" aria-label="Compare Binder slot types">
      <button type="button" className={specified ? 'is-active' : ''} aria-pressed={specified} onClick={() => { setSlotType('specified'); announce('Eta: Specified Slots require the matching numbered card.'); }}>Specified</button>
      <button type="button" className={!specified ? 'is-active' : ''} aria-pressed={!specified} onClick={() => { setSlotType('free'); announce('Eta: Free Slots store Free Slot and Spell cards.'); }}>Free</button>
    </div>
    <div className={`gi-slot-comparison gi-slot-comparison--${slotType}`}>
      <i>{specified ? '081' : '—'}</i>
      <strong>{specified ? 'Matching number required' : 'General card storage'}</strong>
      <span>{specified ? '100 pockets · completion set' : '45 pockets · optional inventory'}</span>
    </div>
    <p>{specified ? 'A Specified card only counts toward completion while placed in its designated pocket.' : 'Free Slots can hold ordinary Free Slot cards and the game’s Spell Cards.'}</p>
  </div>;
}

function RankPractice({ rank, setRank, announce }) {
  const summary = rankSummaries[rank];
  return <div className="gi-rule-demo gi-rule-demo--ranks">
    <div className="gi-rank-ladder" role="list" aria-label="Card acquisition difficulty ranks from H to SS">
      {CARD_RANK_ORDER.map((item) => <button type="button" role="listitem" key={item} className={rank === item ? 'is-active' : ''} onClick={() => { setRank(item); announce(`Eta: Rank ${item} selected.`); }}>{item}</button>)}
    </div>
    <div className="gi-rank-readout">
      <span>Selected acquisition rank</span><b>{rank}</b>
      <dl>
        <div><dt>Specified cards</dt><dd>{summary.count}</dd></div>
        <div><dt>Observed limits</dt><dd>{summary.minimumLimit === null ? 'None in 000–099' : `${summary.minimumLimit}–${summary.maximumLimit}`}</dd></div>
        <div><dt>Example</dt><dd>{summary.example ? `${summary.example.id} ${summary.example.name}` : 'No Specified example'}</dd></div>
      </dl>
      <p>Rank measures documented acquisition difficulty and scarcity. It should not be read as a universal combat-strength ranking.</p>
    </div>
  </div>;
}

function LimitPractice({ cardId, setCardId, copies, setCopies, announce }) {
  const card = specifiedCardById.get(cardId) || specifiedCards[81];
  const remaining = Math.max(0, card.conversionLimit - copies);
  const changeCard = (id) => { setCardId(id); setCopies(0); announce(`Eta: ${id}, ${specifiedCardById.get(id)?.name}, selected.`); };
  return <div className="gi-rule-demo gi-rule-demo--limits">
    <label>Specified card<select value={card.id} onChange={(event) => changeCard(event.target.value)}>{specifiedCards.map((item) => <option value={item.id} key={item.id}>{item.id} · {item.name}</option>)}</select></label>
    <div className="gi-limit-meter">
      <div><span>Copies currently in card form</span><b>{copies} / {card.conversionLimit}</b></div>
      <input type="range" min="0" max={card.conversionLimit} value={copies} onChange={(event) => setCopies(Number(event.target.value))} aria-label={`Simulated copies of ${card.name} currently in card form`} />
      <i><span style={{ width: `${card.conversionLimit ? (copies / card.conversionLimit) * 100 : 0}%` }} /></i>
    </div>
    <div className={`gi-limit-result${remaining === 0 ? ' is-full' : ''}`} role="status">
      <b>{remaining === 0 ? 'LIMIT REACHED' : `${remaining} conversion${remaining === 1 ? '' : 's'} available`}</b>
      <span>{remaining === 0 ? 'No new copy can enter card form until another copy leaves card form or relevant save data is lost.' : `This is a local rule simulation for Rank ${card.rank}, limit ${card.conversionLimit}.`}</span>
    </div>
    <button type="button" onClick={() => { setCopies(card.conversionLimit); announce(`Eta: ${card.name} has reached its simulated conversion limit.`); }}>Fill simulated limit</button>
  </div>;
}

function GainPractice({ cardId, setCardId, gained, setGained, announce }) {
  const card = specifiedCardById.get(cardId) || specifiedCards[3];
  return <div className="gi-rule-demo gi-rule-demo--gain">
    <div className={`gi-gain-card${gained ? ' is-converted' : ''}`}><InteractiveCard card={card} displayOnly /></div>
    <div className={`gi-gain-object${gained ? ' is-visible' : ''}`} aria-live="polite"><Sparkles size={26} /><strong>{card.name}</strong><span>{gained ? 'Material form · simulation' : 'Waiting for “Gain”'}</span></div>
    <div>
      <label>Card<select value={card.id} disabled={gained} onChange={(event) => { setCardId(event.target.value); setGained(false); }}>{specifiedCards.slice(1).map((item) => <option value={item.id} key={item.id}>{item.id} · {item.name}</option>)}</select></label>
      <p>In ordinary play, materializing a card is one-way. This archive control can reset only so the rule can be studied again.</p>
      <div className="gi-rule-actions">
        <button type="button" disabled={gained} onClick={() => { setGained(true); announce(`Eta: “Gain.” ${card.name} has returned to material form in this simulation.`); }}><Sparkles size={16} /> Say “Gain”</button>
        <button type="button" onClick={() => { setGained(false); announce('Eta: Archive simulation reset; canonical irreversibility remains explained.'); }}><RefreshCcw size={16} /> Reset demonstration</button>
      </div>
    </div>
  </div>;
}

function SpellPractice({ spellId, setSpellId, target, setTarget, outcome, setOutcome, announce }) {
  const spell = SPELL_TUTORIAL_EXAMPLES.find((item) => item.id === spellId) || SPELL_TUTORIAL_EXAMPLES[0];
  return <div className="gi-rule-demo gi-rule-demo--spell">
    <label>Spell Card<select value={spell.id} onChange={(event) => { setSpellId(event.target.value); setOutcome(''); }}>{SPELL_TUTORIAL_EXAMPLES.map((item) => <option value={item.id} key={item.id}>{item.id} · {item.name}</option>)}</select></label>
    <div className="gi-spell-card"><span>{spell.id}</span><b>{spell.name}</b><small>{spell.className}</small><p>{spell.effect}</p></div>
    <label>Target type: {spell.target}<input value={target} onChange={(event) => setTarget(event.target.value)} placeholder={`Enter ${spell.target}`} /></label>
    <button type="button" disabled={!target.trim()} onClick={() => { const text = `${spell.name} On ${target.trim()}: ${spell.outcome}`; setOutcome(text); announce(`Eta: ${text}`); }}><Play size={16} /> Cast with “On”</button>
    <p className="gi-spell-outcome" role="status">{outcome || 'Choose a documented spell example and target.'}</p>
    <small>Spell effects are shown as an archive demonstration. No direct-damage Spell Cards exist in the documented system.</small>
  </div>;
}

function ProtectionPractice({ defenseId, setDefenseId, outcome, setOutcome, announce }) {
  const defense = PROTECTION_TUTORIAL_EXAMPLES.find((item) => item.id === defenseId) || PROTECTION_TUTORIAL_EXAMPLES[0];
  return <div className="gi-rule-demo gi-rule-demo--protection">
    <div className="gi-attack-flow"><span>Pickpocket</span><i>Attack Spell</i><b>→</b><span>{defense.name}</span><i>Defense</i></div>
    <label>Protection<select value={defense.id} onChange={(event) => { setDefenseId(event.target.value); setOutcome(''); }}>{PROTECTION_TUTORIAL_EXAMPLES.map((item) => <option value={item.id} key={item.id}>{item.id} · {item.name}</option>)}</select></label>
    <button type="button" onClick={() => { const text = defense.outcome; setOutcome(text); announce(`Eta: ${defense.name}. ${text}`); }}><ShieldCheck size={16} /> Resolve attack</button>
    <div className="gi-protection-result" role="status"><ShieldCheck size={22} /><div><strong>{outcome || defense.name}</strong><span>{outcome || `Ready: ${defense.outcome}`}</span></div></div>
    <p>Attack spells wait briefly when the target’s Binder is open and the target owns a defensive spell, giving the player an opportunity to select protection.</p>
  </div>;
}

function CompletionPractice({ count, setCount, answer, setAnswer, announce }) {
  const quizUnlocked = count === 99;
  const correct = answer === '081';
  return <div className="gi-rule-demo gi-rule-demo--completion">
    <div className="gi-completion-sequence" aria-label="Greed Island completion sequence">
      <div className={count >= 99 ? 'is-complete' : ''}><i>1</i><strong>Collect 001–099</strong><span>{count}/99</span></div>
      <div className={quizUnlocked ? 'is-complete' : ''}><i>2</i><strong>100-question quiz</strong><span>{quizUnlocked ? 'Unlocked' : 'Locked'}</span></div>
      <div className={correct ? 'is-complete' : ''}><i>3</i><strong>Receive card 000</strong><span>{correct ? 'Sample complete' : 'Highest score'}</span></div>
    </div>
    <label>Simulated Specified cards 001–099<input type="range" min="0" max="99" value={count} onChange={(event) => { setCount(Number(event.target.value)); setAnswer(''); }} /></label>
    <button type="button" onClick={() => { setCount(99); setAnswer(''); announce('Eta: Cards 001 through 099 are complete. The quiz is now available.'); }}>Complete 001–099</button>
    <fieldset disabled={!quizUnlocked}>
      <legend>One-question archive sample: Which card is number 081?</legend>
      {['Blue Planet', 'Plot of Beach', 'Angel’s Breath'].map((label, index) => {
        const value = ['081', '002', '017'][index];
        return <label key={value}><input type="radio" name="eta-sample-quiz" value={value} checked={answer === value} onChange={() => { setAnswer(value); announce(value === '081' ? 'Eta: Correct. This sample demonstrates the quiz flow.' : 'Eta: Not correct. Review the card number and try again.'); }} />{label}</label>;
      })}
    </fieldset>
    <small>This is not a reconstruction of all canonical questions. The documented quiz contains 100 acquisition questions, and the highest score receives Ruler’s Blessing, card 000.</small>
  </div>;
}

function ReviewPractice({ answer, setAnswer, announce }) {
  const correct = answer === 'gain';
  return <div className="gi-rule-demo gi-rule-demo--review">
    <div className="gi-review-grid">
      <span><Check size={15} /> Book summons the Binder</span>
      <span><Check size={15} /> Gain materializes a held card</span>
      <span><Check size={15} /> Specified numbers must match</span>
      <span><Check size={15} /> Conversion limits create scarcity</span>
      <span><Check size={15} /> Spells use targets and counters</span>
      <span><Check size={15} /> 001–099 unlock the quiz for 000</span>
    </div>
    <fieldset>
      <legend>Which command returns a held card to material form?</legend>
      {['Book', 'Gain', 'On'].map((label) => <label key={label}><input type="radio" name="eta-review" checked={answer === label.toLowerCase()} onChange={() => { const value = label.toLowerCase(); setAnswer(value); announce(value === 'gain' ? 'Eta: Correct. Gain materializes the card.' : `Eta: ${label} serves a different function.`); }} />{label}</label>)}
    </fieldset>
    <p className={correct ? 'is-correct' : ''}>{correct ? 'Review complete. Every lesson remains replayable.' : 'Choose an answer to complete the practice check.'}</p>
  </div>;
}

export default function EtaTutorial({ mode, summoned, setSummoned }) {
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState(readProgress);
  const [announcement, setAnnouncement] = useState('Eta: Tutorial ready. Begin with the ring or choose any lesson.');
  const [anatomyPart, setAnatomyPart] = useState('number');
  const [slotType, setSlotType] = useState('specified');
  const [rank, setRank] = useState('H');
  const [limitCardId, setLimitCardId] = useState('081');
  const [copies, setCopies] = useState(0);
  const [gainCardId, setGainCardId] = useState('003');
  const [gained, setGained] = useState(false);
  const [spellId, setSpellId] = useState('1005');
  const [spellTarget, setSpellTarget] = useState('Gon');
  const [spellOutcome, setSpellOutcome] = useState('');
  const [defenseId, setDefenseId] = useState('1003');
  const [defenseOutcome, setDefenseOutcome] = useState('');
  const [completionCount, setCompletionCount] = useState(0);
  const [completionAnswer, setCompletionAnswer] = useState('');
  const [reviewAnswer, setReviewAnswer] = useState('');

  const lesson = ETA_TUTORIAL_LESSONS[step];
  const source = GREED_ISLAND_RULE_SOURCES[lesson.sourceId];
  const completionPercent = Math.round((completed.size / ETA_TUTORIAL_LESSONS.length) * 100);

  const persistCompleted = (next) => {
    setCompleted(next);
    writeStoredJson(STORAGE_KEY, [...next]);
  };
  const markComplete = (lessonId = lesson.id) => {
    const next = new Set(completed);
    next.add(lessonId);
    persistCompleted(next);
  };
  const selectLesson = (index) => {
    setStep(index);
    setAnnouncement(`Eta: Lesson ${ETA_TUTORIAL_LESSONS[index].number}, ${ETA_TUTORIAL_LESSONS[index].title}.`);
  };
  const nextLesson = () => {
    markComplete();
    if (step < ETA_TUTORIAL_LESSONS.length - 1) selectLesson(step + 1);
    else setAnnouncement('Eta: All twelve lessons are available for replay.');
  };
  const replay = () => {
    persistCompleted(new Set());
    setStep(0);
    setAnnouncement('Eta: Tutorial progress reset. Lesson one is ready.');
  };

  const practice = useMemo(() => {
    switch (lesson.id) {
      case 'ring': return <RingPractice setSummoned={setSummoned} announce={setAnnouncement} />;
      case 'book': return <BookPractice summoned={summoned} setSummoned={setSummoned} announce={setAnnouncement} />;
      case 'binder': return <BinderPractice setSummoned={setSummoned} announce={setAnnouncement} />;
      case 'anatomy': return <AnatomyPractice part={anatomyPart} setPart={setAnatomyPart} announce={setAnnouncement} />;
      case 'slots': return <SlotPractice slotType={slotType} setSlotType={setSlotType} announce={setAnnouncement} />;
      case 'ranks': return <RankPractice rank={rank} setRank={setRank} announce={setAnnouncement} />;
      case 'limits': return <LimitPractice cardId={limitCardId} setCardId={setLimitCardId} copies={copies} setCopies={setCopies} announce={setAnnouncement} />;
      case 'gain': return <GainPractice cardId={gainCardId} setCardId={setGainCardId} gained={gained} setGained={setGained} announce={setAnnouncement} />;
      case 'targeting': return <SpellPractice spellId={spellId} setSpellId={setSpellId} target={spellTarget} setTarget={setSpellTarget} outcome={spellOutcome} setOutcome={setSpellOutcome} announce={setAnnouncement} />;
      case 'protection': return <ProtectionPractice defenseId={defenseId} setDefenseId={setDefenseId} outcome={defenseOutcome} setOutcome={setDefenseOutcome} announce={setAnnouncement} />;
      case 'completion': return <CompletionPractice count={completionCount} setCount={setCompletionCount} answer={completionAnswer} setAnswer={setCompletionAnswer} announce={setAnnouncement} />;
      default: return <ReviewPractice answer={reviewAnswer} setAnswer={setReviewAnswer} announce={setAnnouncement} />;
    }
  }, [lesson.id, summoned, anatomyPart, slotType, rank, limitCardId, copies, gainCardId, gained, spellId, spellTarget, spellOutcome, defenseId, defenseOutcome, completionCount, completionAnswer, reviewAnswer, setSummoned]);

  return <section className="gi-eta-course" id="tutorial" aria-labelledby="gi-tutorial-title">
    <header className="gi-section-heading">
      <span>Stage 04 · complete interactive tutorial</span>
      <h2 id="gi-tutorial-title">Eta teaches the game system step by step.</h2>
      <p>{mode === 'story' ? 'Story Mode presents the rules in their intended learning order.' : 'Free Exploration allows any lesson to be opened without blocking the Binder.'}</p>
    </header>

    <div className="gi-eta-course__progress" aria-label={`${completed.size} of 12 Eta lessons completed`}>
      <div><span>Tutorial progress</span><b>{String(completed.size).padStart(2, '0')} / 12</b></div>
      <i><span style={{ width: `${completionPercent}%` }} /></i>
    </div>

    <div className="gi-eta-course__layout">
      <aside className="gi-eta-course__chapters" aria-label="Eta tutorial lessons">
        <ol>{ETA_TUTORIAL_LESSONS.map((item, index) => <li key={item.id}><button type="button" className={step === index ? 'is-active' : ''} onClick={() => selectLesson(index)} aria-current={step === index ? 'step' : undefined}><i>{item.number}</i><span>{item.title}</span>{completed.has(item.id) && <CheckCircle2 size={15} />}</button></li>)}</ol>
      </aside>

      <article className="gi-eta-course__lesson" aria-labelledby={`gi-lesson-${lesson.id}`}>
        <div className="gi-eta-course__eta" aria-hidden="true"><i /><span>ETA</span><i /><b /></div>
        <div className="gi-eta-course__dialogue">
          <span>Lesson {lesson.number} / 12</span>
          <h3 id={`gi-lesson-${lesson.id}`}>{lesson.title}</h3>
          <p>{lesson.summary}</p>
          <p className="gi-eta-course__announcement" role="status" aria-live="polite">{announcement}</p>
        </div>

        <div className="gi-eta-course__practice" data-lesson={lesson.id}>{practice}</div>

        <footer className="gi-eta-course__controls">
          <div>
            <button type="button" onClick={() => selectLesson(Math.max(0, step - 1))} disabled={step === 0}><ArrowLeft size={16} /> Previous</button>
            <button type="button" className="is-primary" onClick={nextLesson}>{step === ETA_TUTORIAL_LESSONS.length - 1 ? 'Mark complete' : 'Continue'} <ArrowRight size={16} /></button>
          </div>
          <div>
            <button type="button" onClick={replay}><RefreshCcw size={15} /> Replay all</button>
            <button type="button" onClick={() => selectLesson(ETA_TUTORIAL_LESSONS.length - 1)}><FastForward size={15} /> Skip to review</button>
            <a href={source.href} target="_blank" rel="noreferrer noopener"><ExternalLink size={15} /> Show source</a>
          </div>
        </footer>
      </article>
    </div>
  </section>;
}
