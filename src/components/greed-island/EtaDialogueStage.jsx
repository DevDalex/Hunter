import { useEffect, useMemo, useRef, useState } from 'react';
import './EtaDialogueStage.css';

const ETA_ASSETS = Object.freeze({
  room: '/media/greed-island/eta/eta-tutorial-room.webp',
  open: '/media/greed-island/eta/eta-open.webp',
  closed: '/media/greed-island/eta/eta-closed.webp',
  blink: '/media/greed-island/eta/eta-blink.webp',
  bubble: '/media/greed-island/eta/eta-dialogue-bubble.webp',
});

const GENERIC_ANNOUNCEMENTS = [
  'Tutorial ready.',
  'All twelve lessons are available for replay.',
  'Tutorial progress reset.',
];

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener?.('change', update);
    return () => media.removeEventListener?.('change', update);
  }, []);

  return reduced;
}

function normalizeEtaLine(announcement, lesson) {
  const raw = String(announcement || '').trim();
  const withoutName = raw.replace(/^Eta:\s*/i, '').replace(/^“|”$/g, '').trim();
  const generic = !withoutName
    || /^Lesson\s+\d+/i.test(withoutName)
    || GENERIC_ANNOUNCEMENTS.some((phrase) => withoutName.startsWith(phrase));
  return generic ? lesson.summary : withoutName;
}

function delayForCharacter(character) {
  if (character === '…') return 360;
  if (character === '.' || character === '?' || character === '!') return 235;
  if (character === ',' || character === ';' || character === ':') return 125;
  if (/\s/.test(character)) return 16;
  return 34;
}

export default function EtaDialogueStage({ lesson, announcement, onAdvance }) {
  const reducedMotion = useReducedMotion();
  const fullText = useMemo(() => normalizeEtaLine(announcement, lesson), [announcement, lesson]);
  const [visibleCount, setVisibleCount] = useState(reducedMotion ? fullText.length : 0);
  const [mouthOpen, setMouthOpen] = useState(false);
  const [blinking, setBlinking] = useState(false);
  const timerRef = useRef(null);
  const blinkRef = useRef(null);

  useEffect(() => {
    window.clearTimeout(timerRef.current);
    setVisibleCount(reducedMotion ? fullText.length : 0);
    setMouthOpen(false);
  }, [fullText, reducedMotion]);

  useEffect(() => {
    if (reducedMotion || visibleCount >= fullText.length) return undefined;
    const character = fullText[visibleCount] || '';
    timerRef.current = window.setTimeout(() => {
      setVisibleCount((count) => Math.min(fullText.length, count + 1));
    }, delayForCharacter(character));
    return () => window.clearTimeout(timerRef.current);
  }, [fullText, reducedMotion, visibleCount]);

  const isTyping = !reducedMotion && visibleCount < fullText.length;
  const isComplete = visibleCount >= fullText.length;

  useEffect(() => {
    if (!isTyping) {
      setMouthOpen(false);
      return undefined;
    }
    const interval = window.setInterval(() => setMouthOpen((open) => !open), 145);
    return () => window.clearInterval(interval);
  }, [isTyping]);

  useEffect(() => {
    window.clearTimeout(blinkRef.current);
    if (reducedMotion || isTyping) {
      setBlinking(false);
      return undefined;
    }

    const scheduleBlink = () => {
      const wait = 3200 + Math.round(Math.random() * 2600);
      blinkRef.current = window.setTimeout(() => {
        setBlinking(true);
        blinkRef.current = window.setTimeout(() => {
          setBlinking(false);
          scheduleBlink();
        }, 135);
      }, wait);
    };
    scheduleBlink();
    return () => window.clearTimeout(blinkRef.current);
  }, [isTyping, reducedMotion, fullText]);

  const sprite = reducedMotion
    ? ETA_ASSETS.closed
    : isTyping
      ? (mouthOpen ? ETA_ASSETS.open : ETA_ASSETS.closed)
      : blinking
        ? ETA_ASSETS.blink
        : ETA_ASSETS.closed;

  const state = reducedMotion ? 'reduced-motion' : isTyping ? 'speaking' : blinking ? 'blink' : 'idle';
  const visibleText = fullText.slice(0, visibleCount);

  const revealOrAdvance = () => {
    if (!isComplete) {
      window.clearTimeout(timerRef.current);
      setVisibleCount(fullText.length);
      setMouthOpen(false);
      return;
    }
    onAdvance?.();
  };

  return <section className="gi-eta-scene" aria-label={`Eta tutorial scene: ${lesson.title}`} data-eta-scene data-eta-state={state}>
    <img className="gi-eta-scene__room" src={ETA_ASSETS.room} alt="" aria-hidden="true" />
    <div className="gi-eta-scene__scanlines" aria-hidden="true" />
    <div className="gi-eta-scene__floor-glow" aria-hidden="true" />

    <img
      className="gi-eta-scene__sprite"
      src={sprite}
      alt="Pixel-art Eta seated at the Greed Island tutorial console"
      data-eta-sprite
      draggable="false"
    />

    <button
      type="button"
      className="gi-eta-scene__dialogue"
      style={{ '--eta-bubble': `url(${ETA_ASSETS.bubble})` }}
      onClick={revealOrAdvance}
      aria-label={isComplete ? 'Continue to the next Eta lesson' : 'Reveal the full Eta dialogue line'}
      data-eta-dialogue
    >
      <span className="gi-eta-scene__name">ETA</span>
      <span className="gi-eta-scene__lesson">LESSON {lesson.number} · {lesson.title}</span>
      <span className="gi-eta-scene__text" aria-hidden="true">{visibleText}<i className={isTyping ? 'is-typing' : ''} /></span>
      <span className="sr-only" aria-live="polite">{isComplete ? fullText : ''}</span>
      <span className={`gi-eta-scene__prompt${isComplete ? ' is-ready' : ''}`} aria-hidden="true">▼ PRESS A</span>
    </button>

    <p className="gi-eta-scene__hint">Tap the dialogue box or press the visible Continue control. First input reveals the line; the next advances.</p>
  </section>;
}
