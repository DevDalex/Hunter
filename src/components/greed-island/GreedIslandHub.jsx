import { Activity, BookOpen, CheckCircle2, GraduationCap, LibraryBig, Map, NotebookTabs } from 'lucide-react';
import './GreedIslandHub.css';

const modules = [
  { id: 'eta', label: 'Eta Tutorial', note: 'Animated onboarding, rules, and guided demonstrations.', icon: GraduationCap },
  { id: 'binder', label: 'Binder', note: 'Open the Book and work with one ten-card spread at a time.', icon: NotebookTabs },
  { id: 'cards', label: 'Cards', note: 'Specified Slots, Spell Cards, Free Slot records, and GM cards.', icon: LibraryBig },
  { id: 'island', label: 'Island', note: 'Map, quests, player systems, and Game Master controls.', icon: Map },
  { id: 'tactics', label: 'Tactics', note: 'Training, Razor, Bomber mechanics, and final battles.', icon: Activity },
  { id: 'completion', label: 'Completion', note: 'Quiz boundary, rewards, route fork, and adaptation records.', icon: CheckCircle2 },
];

export default function GreedIslandHub({ onOpen }) {
  return <section className="gi-hub" aria-labelledby="gi-hub-title" data-greed-island-module="home">
    <div className="gi-hub__hero">
      <span>Story 05 · Chapters 120–185</span>
      <h1 id="gi-hub-title">Greed Island</h1>
      <p>Choose one system. Only the selected module is downloaded and mounted, so Eta, the Binder, card archives, island systems, tactics, and completion records no longer run together on one enormous page.</p>
      <div className="gi-hub__facts" aria-label="Greed Island archive summary">
        <div><b>100</b><span>Specified cards</span></div>
        <div><b>40</b><span>Spell Cards</span></div>
        <div><b>9</b><span>verified locations</span></div>
        <div><b>1</b><span>active module</span></div>
      </div>
    </div>

    <div className="gi-hub__modules">
      {modules.map(({ id, label, note, icon: Icon }, index) => <button type="button" key={id} onClick={() => onOpen(id)} data-gi-open-module={id}>
        <i>{String(index + 1).padStart(2, '0')}</i>
        <Icon size={24} />
        <span><strong>{label}</strong><small>{note}</small></span>
        <BookOpen size={17} aria-hidden="true" />
      </button>)}
    </div>
  </section>;
}
