import { BookOpen, ExternalLink, Map } from 'lucide-react';
import { GREED_ISLAND_CARD_SOURCE } from '../../data/greed-island/specifiedCards';
import { GREED_ISLAND_RULE_SOURCES } from '../../data/greed-island/tutorialRules';
import { GREED_ISLAND_LIBRARY_SOURCE } from '../../data/greed-island/cardLibraries.js';
import { GREED_ISLAND_SYSTEM_SOURCES } from '../../data/greed-island/islandSystems.js';
import { GREED_ISLAND_TACTICAL_SOURCES } from '../../data/greed-island/tacticalRecords.js';
import { GREED_ISLAND_COMPLETION_SOURCES } from '../../data/greed-island/completionArchive.js';

const sourceRecords = [
  [GREED_ISLAND_CARD_SOURCE, 'Specified Slot registry, descriptions, ranks, limits, and card images.', BookOpen],
  [GREED_ISLAND_LIBRARY_SOURCE, 'Spell Cards, documented Free Slot cards, and Game Master-only cards.', BookOpen],
  [GREED_ISLAND_RULE_SOURCES.overview, 'Ring, Book, Gain, Binder, slots, and the one-minute card rule.', BookOpen],
  [GREED_ISLAND_RULE_SOURCES.eta, 'Eta, cards 001–099, the completion quiz, and card 000.', BookOpen],
  [GREED_ISLAND_SYSTEM_SOURCES.overview, 'Player systems, Book behavior, transport, and island overview.', Map],
  [GREED_ISLAND_SYSTEM_SOURCES.locations, 'Starting Point, Masadora, Soufrabi, Aiai, Limeiro, and the port.', Map],
  [GREED_ISLAND_SYSTEM_SOURCES.gameMasters, 'Game Master roles, restricted controls, and GM-only boundaries.', BookOpen],
  [GREED_ISLAND_TACTICAL_SOURCES.badlands, 'Biscuit training and Little Flower counter-reading.', BookOpen],
  [GREED_ISLAND_TACTICAL_SOURCES.razor, 'Razor, 14 Devils, dodgeball phases, and Plot of Beach.', BookOpen],
  [GREED_ISLAND_TACTICAL_SOURCES.bomber, 'Countdown, Little Flower, disarm conditions, and Release.', BookOpen],
  [GREED_ISLAND_COMPLETION_SOURCES.arc, 'Three-card reward sequence and the Greed Island endpoint.', BookOpen],
  [GREED_ISLAND_COMPLETION_SOURCES.eta, 'The 100-question quiz, Gon’s score, and Ruler’s Blessing.', BookOpen],
  [GREED_ISLAND_COMPLETION_SOURCES.chapter185, 'Magnetic Force, Accompany, and the route toward Kite.', BookOpen],
].filter(([source]) => source?.href);

export default function GreedIslandSources() {
  return <section className="gi-sources" aria-labelledby="gi-sources-title" data-greed-island-module="sources">
    <header className="gi-section-heading">
      <span>Research library</span>
      <h1 id="gi-sources-title">Greed Island sources</h1>
      <p>The full source registry lives on its own route. Individual modules still keep contextual source links beside the records they support.</p>
    </header>
    {sourceRecords.map(([source, note, Icon]) => <a key={`${source.href}-${source.label}`} href={source.href} target="_blank" rel="noreferrer noopener">
      <Icon size={18} />
      <span><strong>{source.label}</strong><small>{note}{source.verifiedAt ? ` · verified ${source.verifiedAt}` : ''}</small></span>
      <ExternalLink size={14} />
    </a>)}
  </section>;
}
