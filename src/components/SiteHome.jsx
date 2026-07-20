import {
  ArrowRight,
  BookOpenText,
  Clock3,
  Compass,
  MapPinned,
  Orbit,
  Ship,
  Sparkles,
  Swords,
  UsersRound,
} from 'lucide-react';
import SafeImage from './SafeImage';

const gateways = [
  {
    id: 'story',
    title: 'Story',
    copy: 'Follow the complete journey arc by arc, chapter by chapter.',
    meta: 'Volume 0 · Chapters 1–413',
    action: 'Read chronologically',
    icon: BookOpenText,
    image: '/media/portraits/gon-freecss.webp',
    imageAlt: 'Gon Freecss portrait from Hunterpedia',
    view: 'series',
    target: '',
  },
  {
    id: 'characters',
    title: 'Characters',
    copy: 'Browse identities, affiliations, abilities, status, and relationships.',
    meta: '644 indexed names',
    action: 'Browse profiles',
    icon: UsersRound,
    image: '/media/portraits/killua-zoldyck.webp',
    imageAlt: 'Killua Zoldyck portrait from Hunterpedia',
    view: 'reference',
    target: 'encyclopedia',
    params: { category: 'characters' },
  },
  {
    id: 'world',
    title: 'World',
    copy: 'Explore cities, nations, routes, institutions, and the Black Whale.',
    meta: '119 maintained places',
    action: 'Explore the atlas',
    icon: MapPinned,
    image: '/world-map-reference.png',
    imageAlt: 'Hunter x Hunter world map reference',
    view: 'reference',
    target: 'atlas',
  },
  {
    id: 'nen',
    title: 'Nen',
    copy: 'Study aura principles, categories, techniques, abilities, and costs.',
    meta: 'System encyclopedia',
    action: 'Study Nen',
    icon: Orbit,
    view: 'reference',
    target: 'nen',
  },
];

const arcs = [
  ['Hunter Exam', 'series', 'hunter-exam'],
  ['Zoldyck Family', 'series', 'zoldyck-family'],
  ['Heavens Arena', 'series', 'heavens-arena'],
  ['Yorknew City', 'series', 'yorknew-city'],
  ['Greed Island', 'series', 'greed-island'],
  ['Chimera Ant', 'series', 'chimera-ant'],
  ['Election', 'series', 'chairman-election'],
  ['Succession Contest', 'succession', 'overview'],
];

const deskLinks = [
  ['Chapter catalogue', '413 numbered chapter records', 'series', 'chapters'],
  ['Character directory', '644 canonical identities', 'reference', 'encyclopedia', { category: 'characters' }],
  ['Voyage timeline', '134 selected Succession events', 'succession', 'succession-timeline'],
  ['Conflict archive', '54 maintained conflicts', 'reference', 'conflicts'],
];

function RouteButton({ className = '', view, target = '', params, onNavigate, onPrefetch, children }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => onNavigate(view, target, params)}
      onPointerEnter={() => onPrefetch?.(view, target)}
      onFocus={() => onPrefetch?.(view, target)}
    >
      {children}
    </button>
  );
}

export default function SiteHome({ onNavigate, onPrefetch, latestChapter = 413, stats = {}, heroCharacters = [] }) {
  const heroPeople = [heroCharacters[0], heroCharacters[2]].filter(Boolean);
  const kurapika = heroCharacters.find((person) => person.name === 'Kurapika') || heroCharacters[2];

  return (
    <div className="archive-landing">
      <section className="archive-landing__hero" aria-labelledby="archive-home-title">
        <div className="archive-landing__hero-art" aria-hidden="true">
          {heroPeople.map((person, index) => (
            <figure className={`archive-landing__hero-person archive-landing__hero-person--${index === 0 ? 'left' : 'right'}`} key={person.name}>
              <SafeImage
                src={person.image}
                alt=""
                eager={index === 0}
                priority={index === 0 ? 'high' : 'auto'}
              />
            </figure>
          ))}
          <div className="archive-landing__hero-city" />
        </div>

        <div className="archive-landing__hero-copy">
          <span>Hunterpedia-sourced · manga + 2011 anime</span>
          <h1 id="archive-home-title">Hunter × Hunter <em>Archive</em></h1>
          <p>The connected research archive for Yoshihiro Togashi’s world—story, people, places, Nen, conflicts, and the ongoing voyage.</p>

          <dl className="archive-landing__hero-stats" aria-label="Archive coverage">
            <div><dt>{latestChapter}</dt><dd>Chapters</dd></div>
            <div><dt>{stats.characters || 644}</dt><dd>Characters</dd></div>
            <div><dt>{stats.places || 119}</dt><dd>Places</dd></div>
            <div><dt>{stats.records || 1111}</dt><dd>Records</dd></div>
          </dl>

          <div className="archive-landing__hero-actions">
            <RouteButton className="is-primary" view="series" onNavigate={onNavigate} onPrefetch={onPrefetch}>
              Begin reading <ArrowRight size={17} />
            </RouteButton>
            <RouteButton view="reference" target="encyclopedia" params={{ category: 'characters' }} onNavigate={onNavigate} onPrefetch={onPrefetch}>
              Browse encyclopedia
            </RouteButton>
          </div>
        </div>
      </section>

      <main className="archive-landing__body">
        <section className="archive-gateways" aria-labelledby="archive-gateways-title">
          <header className="archive-section-heading">
            <span>Four ways into the archive</span>
            <h2 id="archive-gateways-title">Choose your point of entry.</h2>
          </header>

          <div className="archive-gateways__grid">
            {gateways.map((gateway) => {
              const Icon = gateway.icon;
              return (
                <RouteButton
                  className={`archive-gateway archive-gateway--${gateway.id}`}
                  view={gateway.view}
                  target={gateway.target}
                  params={gateway.params}
                  onNavigate={onNavigate}
                  onPrefetch={onPrefetch}
                  key={gateway.id}
                >
                  {gateway.image && (
                    <figure>
                      <SafeImage src={gateway.image} alt={gateway.imageAlt} />
                    </figure>
                  )}
                  {gateway.id === 'nen' && (
                    <div className="archive-gateway__nen" aria-hidden="true">
                      <i>強</i><i>放</i><i>操</i><i>特</i><i>具</i><i>変</i><b>発</b>
                    </div>
                  )}
                  <div className="archive-gateway__shade" />
                  <div className="archive-gateway__copy">
                    <Icon size={20} />
                    <small>{gateway.meta}</small>
                    <h3>{gateway.title}</h3>
                    <p>{gateway.copy}</p>
                    <strong>{gateway.action} <ArrowRight size={15} /></strong>
                  </div>
                </RouteButton>
              );
            })}
          </div>
        </section>

        <section className="archive-storyline" aria-labelledby="archive-storyline-title">
          <header>
            <span>The story so far</span>
            <h2 id="archive-storyline-title">From the Hunter Exam to the Black Whale.</h2>
          </header>
          <div className="archive-storyline__rail">
            {arcs.map(([label, view, target], index) => (
              <RouteButton view={view} target={target} onNavigate={onNavigate} onPrefetch={onPrefetch} key={label}>
                <i>{String(index + 1).padStart(2, '0')}</i>
                <span>{label}</span>
              </RouteButton>
            ))}
          </div>
        </section>

        <section className="archive-preview-grid" aria-label="Archive previews">
          <article className="archive-preview archive-preview--character">
            <header><span>Character spotlight</span><Sparkles size={16} /></header>
            {kurapika && (
              <figure>
                <SafeImage src={kurapika.image} alt="Kurapika portrait from Hunterpedia" />
              </figure>
            )}
            <div>
              <h2>Kurapika</h2>
              <p>Hunter · Conjurer · Zodiac member</p>
              <dl>
                <div><dt>Story focus</dt><dd>Succession Contest</dd></div>
                <div><dt>Current setting</dt><dd>Black Whale 1</dd></div>
                <div><dt>Archive coverage</dt><dd>Profile + relationships</dd></div>
              </dl>
              <RouteButton view="reference" target="encyclopedia" params={{ category: 'characters', search: 'Kurapika' }} onNavigate={onNavigate} onPrefetch={onPrefetch}>
                Open dossier <ArrowRight size={15} />
              </RouteButton>
            </div>
          </article>

          <article className="archive-preview archive-preview--world">
            <header><span>Known world</span><Compass size={16} /></header>
            <figure><SafeImage src="/world-map-reference.png" alt="Hunter x Hunter world map reference" /></figure>
            <div>
              <p>Trace the Known World, Kakin, the Black Whale route, cities, institutions, and story geography.</p>
              <RouteButton view="reference" target="atlas" onNavigate={onNavigate} onPrefetch={onPrefetch}>
                Explore world <ArrowRight size={15} />
              </RouteButton>
            </div>
          </article>

          <article className="archive-preview archive-preview--nen">
            <header><span>Nen overview</span><Orbit size={16} /></header>
            <div className="archive-nen-wheel" aria-hidden="true">
              <i className="is-one">Enhancement</i>
              <i className="is-two">Emission</i>
              <i className="is-three">Manipulation</i>
              <i className="is-four">Specialization</i>
              <i className="is-five">Conjuration</i>
              <i className="is-six">Transmutation</i>
              <b>発<small>Nen</small></b>
            </div>
            <div>
              <p>Principles, six categories, advanced techniques, named abilities, conditions, and costs.</p>
              <RouteButton view="reference" target="nen" onNavigate={onNavigate} onPrefetch={onPrefetch}>
                Learn Nen <ArrowRight size={15} />
              </RouteButton>
            </div>
          </article>

          <article className="archive-preview archive-preview--status">
            <header><span>Current archive boundary</span><Clock3 size={16} /></header>
            <div className="archive-status-list">
              <div><BookOpenText size={18} /><span><small>Latest maintained chapter</small><b>{latestChapter}</b></span></div>
              <div><Ship size={18} /><span><small>Current arc</small><b>Succession Contest</b></span></div>
              <div><MapPinned size={18} /><span><small>Primary setting</small><b>Black Whale 1</b></span></div>
              <div><Sparkles size={18} /><span><small>Evidence boundary</small><b>Hunterpedia / Fandom</b></span></div>
            </div>
            <RouteButton view="succession" target="succession-timeline" onNavigate={onNavigate} onPrefetch={onPrefetch}>
              View timeline <ArrowRight size={15} />
            </RouteButton>
          </article>
        </section>

        <section className="archive-number-band" aria-labelledby="archive-numbers-title">
          <header><span>Archive by the numbers</span><h2 id="archive-numbers-title">The maintained collection.</h2></header>
          <dl>
            <div><dt>{latestChapter}</dt><dd>Chapters</dd></div>
            <div><dt>{stats.characters || 644}</dt><dd>Characters</dd></div>
            <div><dt>{stats.officialArcs || 7}</dt><dd>Official arcs</dd></div>
            <div><dt>{stats.conflicts || 54}</dt><dd>Conflicts</dd></div>
            <div><dt>{stats.places || 119}</dt><dd>Places</dd></div>
            <div><dt>{stats.voyageEvents || 134}</dt><dd>Voyage events</dd></div>
          </dl>
        </section>

        <section className="archive-final-grid" aria-label="Featured archive material">
          <article className="archive-featured-exhibit">
            <figure><SafeImage src="/black-whale-cutaway.png" alt="Black Whale cutaway reference" /></figure>
            <div>
              <span>Featured exhibit</span>
              <h2>Inside Black Whale 1</h2>
              <p>Explore tiers, rooms, access restrictions, occupants, routes, and the political machinery of the voyage.</p>
              <RouteButton view="succession" target="black-whale" onNavigate={onNavigate} onPrefetch={onPrefetch}>
                Explore the ship <ArrowRight size={15} />
              </RouteButton>
            </div>
          </article>

          <article className="archive-desk-links">
            <header><span>Research desks</span><h2>Continue by record type.</h2></header>
            <div>
              {deskLinks.map(([title, note, view, target, params]) => (
                <RouteButton view={view} target={target} params={params} onNavigate={onNavigate} onPrefetch={onPrefetch} key={title}>
                  <span><strong>{title}</strong><small>{note}</small></span>
                  <ArrowRight size={15} />
                </RouteButton>
              ))}
            </div>
            <RouteButton className="archive-desk-links__fight" view="reference" target="conflicts" params={{ case: 'hisoka-chrollo' }} onNavigate={onNavigate} onPrefetch={onPrefetch}>
              <Swords size={18} /><span><small>Featured conflict</small><strong>Hisoka vs. Chrollo</strong></span><ArrowRight size={15} />
            </RouteButton>
          </article>
        </section>
      </main>
    </div>
  );
}
