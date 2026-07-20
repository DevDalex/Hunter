import { ArrowRight, MapPinned, Orbit, Search, Swords, UsersRound } from 'lucide-react';
import SafeImage from './SafeImage';
import { ArchiveCard, ArchiveLedger, ArchiveSection, EvidenceBadge, SourceStack, StatusPill } from './ArchiveUI';

const entrances = [
  {
    id: 'pre',
    number: '01',
    view: 'series',
    target: '',
    title: 'Pre-Succession',
    range: 'Volume 0 · Chapters 1–339 · 2011 anime',
    copy: 'The journey from Kurapika’s childhood and the Hunter Exam through the Chairman Election. Six arcs, each with its own visual system.',
    image: '/media/portraits/gon-freecss.webp',
    imageAlt: 'Gon Freecss portrait from Hunterpedia',
    accent: '#d7a945',
  },
  {
    id: 'succession',
    number: '02',
    view: 'succession',
    target: 'overview',
    title: 'Succession',
    range: 'Chapters 340–413 · Black Whale voyage',
    copy: 'Fourteen royal households, Guardian Spirit Beasts, guards, mafia, justice, voyage time, ship geography, and the expedition beyond.',
    image: '/media/portraits/kurapika.webp',
    imageAlt: 'Kurapika portrait from Hunterpedia',
    accent: '#b34842',
  },
];

const tools = [
  ['characters', 'Characters', '644 indexed names', UsersRound, 'reference', 'encyclopedia', { category: 'characters' }],
  ['world', 'World map', 'Places and story routes', MapPinned, 'reference', 'atlas'],
  ['nen', 'Nen', 'Visual principles and abilities', Orbit, 'reference', 'nen'],
  ['fight', 'Hisoka vs. Chrollo', 'The complete fight dossier', Swords, 'reference', 'conflicts', { case: 'hisoka-chrollo' }],
];

const designLedger = [
  { label: 'Primitives', value: '6 shared UI pieces' },
  { label: 'Evidence tones', value: '7 states' },
  { label: 'Gate', value: '15 audits' },
];

export default function SiteHome({ onNavigate, onPrefetch, onOpenSearch }) {
  return (
    <div className="simple-home">
      <section className="simple-home__masthead">
        <div>
          <span>Hunterpedia-sourced · manga + 2011 anime</span>
          <h1>Hunter × Hunter<br /><em>Archive</em></h1>
        </div>
        <div className="simple-home__intro">
          <p>A visual encyclopedia built to explain how the story fits together. Choose an era, then follow people, places, Nen, and events without losing the larger structure.</p>
          <button type="button" onClick={onOpenSearch}><Search size={16} /> Search the entire archive <kbd>/</kbd></button>
        </div>
      </section>

      <section className="simple-home__eras" aria-label="Choose a story era">
        {entrances.map((entry, index) => (
          <button
            type="button"
            style={{ '--home-accent': entry.accent }}
            onPointerEnter={() => onPrefetch?.(entry.view, entry.target)}
            onFocus={() => onPrefetch?.(entry.view, entry.target)}
            onClick={() => onNavigate(entry.view, entry.target)}
            key={entry.id}
          >
            <figure><SafeImage src={entry.image} alt={entry.imageAlt} eager={index === 0} priority={index === 0 ? 'high' : 'auto'} /></figure>
            <div>
              <span>{entry.number} · {entry.range}</span>
              <h2>{entry.title}</h2>
              <p>{entry.copy}</p>
              <strong>Enter the era <ArrowRight size={16} /></strong>
            </div>
          </button>
        ))}
      </section>

      <section className="simple-home__tools" aria-label="Open a core encyclopedia tool">
        <header><span>Or enter by subject</span></header>
        <div>
          {tools.map(([id, title, note, Icon, view, target, params]) => (
            <button type="button" onClick={() => onNavigate(view, target, params)} onPointerEnter={() => onPrefetch?.(view, target)} onFocus={() => onPrefetch?.(view, target)} key={id}>
              <Icon size={18} /><span><strong>{title}</strong><small>{note}</small></span><ArrowRight size={14} />
            </button>
          ))}
        </div>
      </section>

      <ArchiveSection
        id="archive-ui-library"
        compact
        kicker="Batch 12"
        title="Design-system foundation"
        description="Reusable archive primitives now carry source blocks, evidence language, ledgers, cards, and status tokens so future pages stop becoming one-off layouts."
        actions={<StatusPill tone="debt">Design-system debt tracked separately</StatusPill>}
      >
        <div className="archive-ui-home-grid">
          <ArchiveCard tone="ink" eyebrow="Evidence" title="Shared state language" meta="Confirmed · inferred · unclear · deferred">
            <EvidenceBadge state="confirmed">Confirmed</EvidenceBadge>
            <EvidenceBadge state="inferred">Inferred</EvidenceBadge>
            <EvidenceBadge state="unclear">Unclear</EvidenceBadge>
          </ArchiveCard>
          <ArchiveCard tone="steel" eyebrow="Release gate" title="Reusable primitives are audited" meta="No dead design-system code">
            <ArchiveLedger items={designLedger} label="Batch 12 design-system counts" />
          </ArchiveCard>
          <ArchiveCard eyebrow="Source policy" title="Hunterpedia boundary remains visible" meta="Source blocks are reusable now">
            <SourceStack sources={[{ label: 'Hunterpedia / Fandom', href: 'https://hunterxhunter.fandom.com/', note: 'The archive’s approved factual and media source boundary.' }]} />
          </ArchiveCard>
        </div>
      </ArchiveSection>
    </div>
  );
}
