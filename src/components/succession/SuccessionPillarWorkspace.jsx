import SuccessionExplorerSurface from './SuccessionExplorerSurface';
import { SuccessionExplorerProvider } from './SuccessionExplorerState';
import './SuccessionPillarWorkspace.css';

const characterTargets = new Set([
  'characters', 'princes', 'queens', 'bodyguards', 'organizations', 'relationships',
]);
const nenTargets = new Set(['nen', 'guardian-spirit-beasts']);

const destinationFor = (target, params = {}) => {
  const path = characterTargets.has(target)
    ? '/characters'
    : nenTargets.has(target)
      ? '/nen'
      : '/timeline';
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params || {})) {
    if (value !== undefined && value !== null && value !== '') query.set(key, String(value));
  }
  const search = query.toString();
  return `${path}${search ? `?${search}` : ''}`;
};

const labels = {
  characters: {
    eyebrow: 'Succession Contest · People',
    title: 'Characters',
    description: 'Royalty, guards, Hunters, mafia, the Troupe, affiliations, assignments, relationships, status, knowledge, and movement live here as one character intelligence system.',
  },
  nen: {
    eyebrow: 'Succession Contest · Systems',
    title: 'Nen',
    description: 'Abilities, Guardian Spirit Beasts, curses, conditions, costs, ritual mechanics, possession, instruction, Contagion, and unresolved Nen questions live here as one systems workspace.',
  },
};

export default function SuccessionPillarWorkspace({ pillar, requestedState = {}, spoilerLimit, onNavigate }) {
  const copy = labels[pillar] || labels.characters;
  const navigateExplorer = (target, params = {}) => onNavigate?.(destinationFor(target || pillar, params));

  return <article className={`succession-pillar-workspace succession-pillar-workspace--${pillar}`}>
    <nav className="succession-pillar-workspace__nav" aria-label="Succession archive">
      <a href="/">Home</a>
      <a href="/timeline">Timeline</a>
      <a href="/characters" aria-current={pillar === 'characters' ? 'page' : undefined}>Characters</a>
      <a href="/nen" aria-current={pillar === 'nen' ? 'page' : undefined}>Nen</a>
    </nav>

    <header className="succession-pillar-workspace__intro">
      <span>{copy.eyebrow}</span>
      <h1>{copy.title}</h1>
      <p>{copy.description}</p>
    </header>

    <SuccessionExplorerProvider spoilerLimit={spoilerLimit}>
      <SuccessionExplorerSurface
        routeId={pillar}
        routeParams={requestedState}
        spoilerLimit={spoilerLimit}
        onNavigate={navigateExplorer}
      />
    </SuccessionExplorerProvider>
  </article>;
}
