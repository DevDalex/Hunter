import { useEffect, useMemo, useState } from 'react';
import {
  getEntitiesByType,
  getEntityById,
  getRoyalHouseholdMatrix,
} from '../../data/succession/successionData';
import {
  biologicalRoyalFamilyTree,
  successionRoster,
  successionRosterGroups,
} from '../../data/successionRoster';
import './SuccessionCharacterCourtMap.css';

const VALID_VIEWS = new Set(['all', 'courts', 'groups']);
const PAGE_SIZE = 96;
const SECURITY_POSITIVE = /(bodyguard|guard(?:ing)?|protect(?:ion|ive)?|security|escort|defen[cs]e|safeguard|watch over)/i;
const SECURITY_NEGATIVE = /(assassin|kill|curse|poison|infect|hostile|attack|target|surveil|spy|infiltrat|observe|custody|detain|instruction|teach|training|nen class|coerc|interrogate)/i;
const WIKI_FILE_BASE = 'https://hunterxhunter.fandom.com/wiki/Special:Redirect/file/';

const normalized = (value) => String(value || '')
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLocaleLowerCase()
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();

const compactName = (value) => normalized(String(value || '').replace(/ Hui Guo Rou$/i, '').replace(/[†*]/g, ''));
const entityLabel = (entity) => entity?.name || entity?.title || entity?.label || entity?.id || 'Unknown';
const initial = (entity) => entityLabel(entity).replace(/[^A-Za-z0-9]/g, '').slice(0, 1).toUpperCase() || '?';
const safe = (factory, fallback = []) => {
  try { return factory(); } catch { return fallback; }
};
const ordinal = (value) => {
  const number = Number(value);
  if (!Number.isFinite(number)) return '';
  if (number % 100 >= 11 && number % 100 <= 13) return `${number}th`;
  if (number % 10 === 1) return `${number}st`;
  if (number % 10 === 2) return `${number}nd`;
  if (number % 10 === 3) return `${number}rd`;
  return `${number}th`;
};
const readable = (value) => String(value || 'unknown').replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
const wikiFile = (filename) => `${WIKI_FILE_BASE}${encodeURIComponent(filename)}`;
const asciiDisplayName = (value) => String(value || '')
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[†*]/g, '')
  .trim();

const rosterIndex = new Map();
const rosterGroupIndex = new Map();
for (const group of successionRosterGroups) {
  for (const member of group.members) {
    const keys = new Set([normalized(member.name), compactName(member.name)]);
    for (const key of keys) {
      if (!rosterIndex.has(key)) rosterIndex.set(key, member);
      if (!rosterGroupIndex.has(key)) rosterGroupIndex.set(key, group);
    }
  }
}

const canonicalCharacters = safe(() => getEntitiesByType('character'), []);
const canonicalCharacterByName = new Map();
for (const character of canonicalCharacters) {
  for (const name of [entityLabel(character), ...(character.aliases || [])]) {
    for (const key of [normalized(name), compactName(name)]) {
      if (key && !canonicalCharacterByName.has(key)) canonicalCharacterByName.set(key, character);
    }
  }
}

function rosterRecordFor(entity) {
  if (!entity) return null;
  const label = entityLabel(entity);
  const keys = [normalized(label), compactName(label)];
  for (const key of keys) {
    if (rosterIndex.has(key)) return rosterIndex.get(key);
  }
  const compact = compactName(label);
  if (compact.length > 3) {
    const match = successionRoster.find((record) => {
      const candidate = compactName(record.name);
      return candidate === compact || candidate.startsWith(`${compact} `) || compact.startsWith(`${candidate} `);
    });
    if (match) return match;
  }
  return null;
}

function rosterGroupFor(entity) {
  if (!entity) return null;
  const label = entityLabel(entity);
  return rosterGroupIndex.get(normalized(label))
    || rosterGroupIndex.get(compactName(label))
    || null;
}

function canonicalCharacterForName(name) {
  return canonicalCharacterByName.get(normalized(name))
    || canonicalCharacterByName.get(compactName(name))
    || null;
}

function syntheticCharacter(name, extras = {}) {
  return {
    id: `synthetic:${compactName(name).replaceAll(' ', '-')}`,
    entityType: 'character',
    name,
    roles: [],
    aliases: [],
    ...extras,
  };
}

function buildCharacterDirectory() {
  const canonicalByName = new Map();

  for (const character of canonicalCharacters) {
    const names = [entityLabel(character), ...(character.aliases || [])];
    for (const name of names) {
      for (const key of [normalized(name), compactName(name)]) {
        if (key && !canonicalByName.has(key)) canonicalByName.set(key, character);
      }
    }
  }

  const directory = new Map();
  for (const group of successionRosterGroups) {
    for (const profile of group.members) {
      const match = canonicalByName.get(normalized(profile.name))
        || canonicalByName.get(compactName(profile.name))
        || null;
      if (match) {
        directory.set(match.id, match);
        continue;
      }
      const id = `succession-roster:${group.id}:${compactName(profile.name).replaceAll(' ', '-')}`;
      directory.set(id, {
        id,
        entityType: 'character',
        name: profile.name,
        roles: [],
        aliases: [],
        status: { life: profile.status || 'unknown' },
        summary: profile.note || profile.statusNote || '',
        rosterOnly: true,
      });
    }
  }

  for (const character of canonicalCharacters) {
    if (!directory.has(character.id)) directory.set(character.id, character);
  }

  return [...directory.values()].sort((left, right) => entityLabel(left).localeCompare(entityLabel(right)));
}

function portraitCandidatesFor(entity) {
  const record = rosterRecordFor(entity);
  const names = [
    record?.name,
    entityLabel(entity),
    ...(entity?.aliases || []),
  ].filter(Boolean);
  const files = [];
  if (record?.image) files.push(record.image);
  for (const rawName of names) {
    const display = String(rawName).replace(/[†*]/g, '').trim();
    const short = display.replace(/ Hui Guo Rou$/i, '').trim();
    const ascii = asciiDisplayName(display);
    const asciiShort = ascii.replace(/ Hui Guo Rou$/i, '').trim();
    for (const candidate of [
      `${display} SC Portrait.png`,
      `${short} SC Portrait.png`,
      `${ascii} SC Portrait.png`,
      `${asciiShort} SC Portrait.png`,
      `${display} Portrait.png`,
      `${short} Portrait.png`,
      `${asciiShort} 2011.png`,
      `${asciiShort}.png`,
    ]) {
      if (candidate.trim()) files.push(wikiFile(candidate));
    }
  }
  return [...new Set(files)].slice(0, 10);
}

function Portrait({ entity, className = '', eager = false }) {
  const candidates = useMemo(() => portraitCandidatesFor(entity), [entity]);
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [imageVisible, setImageVisible] = useState(false);
  const image = candidates[candidateIndex] || '';

  useEffect(() => {
    setCandidateIndex(0);
    setImageVisible(false);
  }, [entity?.id, entityLabel(entity)]);

  const tryNext = () => {
    setImageVisible(false);
    setCandidateIndex((index) => Math.min(index + 1, candidates.length));
  };

  return <span className={`court-portrait ${className}`.trim()} aria-hidden="true">
    <span className="court-portrait__fallback">{initial(entity)}</span>
    {image && <img
      src={image}
      alt=""
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      referrerPolicy="no-referrer"
      className={imageVisible ? 'is-visible' : ''}
      onLoad={(event) => {
        const { naturalWidth, naturalHeight } = event.currentTarget;
        if (!naturalWidth || !naturalHeight) {
          tryNext();
          return;
        }
        setImageVisible(true);
      }}
      onError={tryNext}
    />}
  </span>;
}

function assignmentText(assignment) {
  return [
    assignment?.assignmentType,
    assignment?.type,
    assignment?.name,
    assignment?.summary,
    assignment?.note,
    assignment?.authorityBasis,
    assignment?.operationalState,
  ].filter(Boolean).join(' ');
}

function isSecurityAssignment(assignment) {
  const text = assignmentText(assignment);
  return SECURITY_POSITIVE.test(text) && !SECURITY_NEGATIVE.test(text);
}

function resolveQueen(prince, row) {
  const direct = row.biologicalMotherId ? getEntityById(row.biologicalMotherId) : null;
  if (direct?.entityType === 'character') return direct;
  const princeKey = compactName(entityLabel(prince));
  const branch = biologicalRoyalFamilyTree.find((entry) => (entry.children || []).some((child) => compactName(child) === princeKey));
  if (!branch) return null;
  return canonicalCharacterForName(branch.queen)
    || syntheticCharacter(branch.queen, { queenRank: branch.order, roles: ['queen'] });
}

function householdFromRow(row) {
  const prince = getEntityById(row.character?.id) || canonicalCharacterForName(row.character?.name);
  const queen = resolveQueen(prince, row);
  const king = canonicalCharacterForName('Nasubi Hui Guo Rou')
    || syntheticCharacter('Nasubi Hui Guo Rou', { roles: ['king'] });
  const assignments = (row.householdAssignmentIds || [])
    .map((id) => getEntityById(id))
    .filter(Boolean);
  const securityAssignments = assignments.filter(isSecurityAssignment);
  const securityByPerson = new Map();
  for (const assignment of securityAssignments) {
    const person = getEntityById(assignment.personId);
    if (person?.entityType === 'character' && person.id !== prince?.id && !securityByPerson.has(person.id)) {
      securityByPerson.set(person.id, person);
    }
  }
  return {
    ...row,
    king,
    prince,
    queen,
    assignments,
    securityAssignments,
    securityPersonnel: [...securityByPerson.values()],
    otherOperations: assignments.filter((assignment) => !isSecurityAssignment(assignment)),
  };
}

function updateCharacterRoute(onNavigate, params) {
  onNavigate?.('characters', params, { replace: true, preserveScroll: true });
}

function CharacterDossier({ character, chapter, onClose }) {
  if (!character) return <aside className="character-dossier character-dossier--empty" data-testid="character-detail">
    <span>Character dossier</span>
    <h2>Select anyone</h2>
    <p>The full Succession cast stays visible. Pick a portrait to inspect the record without leaving the directory.</p>
  </aside>;

  const roster = rosterRecordFor(character);
  const group = rosterGroupFor(character);
  const roles = Array.isArray(character.roles) ? character.roles : [];
  const aliases = Array.isArray(character.aliases) ? character.aliases : [];
  const life = character.status?.life || roster?.status || character.life || 'unknown';

  return <aside className="character-dossier" data-testid="character-detail">
    <button type="button" className="character-dossier__close" onClick={onClose} aria-label="Close character dossier">×</button>
    <div className="character-dossier__hero">
      <Portrait entity={character} className="character-dossier__portrait" eager />
      <div>
        <span>{group?.title || (character.rosterOnly ? 'Succession roster' : 'Canonical character')}</span>
        <h2>{entityLabel(character)}</h2>
        <p>{roster?.role || roles.map(readable).join(' · ') || 'Role not separately indexed'}</p>
      </div>
    </div>
    <dl className="character-dossier__facts">
      <div><dt>Archive state</dt><dd>Chapter {chapter}</dd></div>
      <div><dt>Status</dt><dd>{readable(life)}</dd></div>
      <div><dt>Roles</dt><dd>{roles.length ? roles.map(readable).join(', ') : roster?.role || 'Not separately indexed'}</dd></div>
      <div><dt>Aliases</dt><dd>{aliases.length ? aliases.join(', ') : 'None indexed'}</dd></div>
    </dl>
    {(character.summary || roster?.note || roster?.statusNote) && <div className="character-dossier__note">
      <span>Record note</span>
      <p>{character.summary || roster?.note || roster?.statusNote}</p>
    </div>}
  </aside>;
}

function CharacterCard({ character, selected, onSelect }) {
  const roster = rosterRecordFor(character);
  const group = rosterGroupFor(character);
  const roles = Array.isArray(character.roles) ? character.roles : [];
  return <button
    type="button"
    className={`character-directory-card ${selected ? 'is-selected' : ''}`}
    onClick={() => onSelect(character)}
    data-testid="character-card"
    aria-pressed={selected}
  >
    <Portrait entity={character} />
    <span className="character-directory-card__copy">
      <strong>{entityLabel(character)}</strong>
      <small>{roster?.role || roles.slice(0, 2).map(readable).join(' · ') || group?.title || 'Character'}</small>
    </span>
    {group && <em>{group.title}</em>}
  </button>;
}

function AllCharactersView({ characters, selected, chapter, initialGroup, onSelect, onNavigate }) {
  const [query, setQuery] = useState('');
  const [groupId, setGroupId] = useState(initialGroup || '');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    setGroupId(initialGroup || '');
    setVisibleCount(PAGE_SIZE);
  }, [initialGroup]);

  const filtered = useMemo(() => {
    const needle = normalized(query);
    return characters.filter((character) => {
      const roster = rosterRecordFor(character);
      const group = rosterGroupFor(character);
      if (groupId && group?.id !== groupId) return false;
      if (!needle) return true;
      const haystack = normalized([
        entityLabel(character),
        roster?.role,
        roster?.note,
        group?.title,
        ...(character.roles || []),
        ...(character.aliases || []),
      ].filter(Boolean).join(' '));
      return haystack.includes(needle);
    });
  }, [characters, groupId, query]);

  useEffect(() => setVisibleCount(PAGE_SIZE), [query, groupId]);

  const shown = filtered.slice(0, visibleCount);
  const selectCharacter = (character) => {
    onSelect(character);
    updateCharacterRoute(onNavigate, { view: 'all', entity: character.id, chapter, ...(groupId ? { group: groupId } : {}) });
  };

  const clearSelected = () => {
    onSelect(null);
    updateCharacterRoute(onNavigate, { view: 'all', chapter, ...(groupId ? { group: groupId } : {}) });
  };

  return <section className="characters-directory" data-testid="characters-mode-all">
    <div className="characters-directory__tools">
      <label className="characters-search">
        <span>Search all characters</span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Kurapika, Babimyna, Morena…"
          data-testid="character-search"
        />
      </label>
      <label className="characters-group-filter">
        <span>Group</span>
        <select value={groupId} onChange={(event) => setGroupId(event.target.value)}>
          <option value="">Every group</option>
          {successionRosterGroups.map((group) => <option key={group.id} value={group.id}>{group.title}</option>)}
        </select>
      </label>
    </div>

    <div className="characters-directory__summary">
      <strong>{filtered.length.toLocaleString()} matching characters</strong>
      <span>{characters.length.toLocaleString()} in-scope Succession records · {successionRoster.length.toLocaleString()} detailed roster profiles</span>
    </div>

    <div className="characters-directory__body">
      <div>
        <div className="characters-directory__grid" data-testid="character-grid">
          {shown.map((character) => <CharacterCard
            key={character.id}
            character={character}
            selected={selected?.id === character.id}
            onSelect={selectCharacter}
          />)}
        </div>
        {!shown.length && <p className="characters-empty">No character record matches this filter.</p>}
        {visibleCount < filtered.length && <button
          type="button"
          className="characters-show-more"
          onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
        >Show {Math.min(PAGE_SIZE, filtered.length - visibleCount)} more</button>}
      </div>
      <CharacterDossier character={selected} chapter={chapter} onClose={clearSelected} />
    </div>
  </section>;
}

function RoyalPortrait({ entity, title, subtitle, className = '' }) {
  return <figure className={`royal-lineage-portrait ${className}`.trim()}>
    <Portrait entity={entity} eager />
    <figcaption>
      <small>{title}</small>
      <strong>{entityLabel(entity)}</strong>
      {subtitle && <span>{subtitle}</span>}
    </figcaption>
  </figure>;
}

function SecurityMember({ character }) {
  return <figure className="court-security-member">
    <Portrait entity={character} />
    <figcaption>{entityLabel(character)}</figcaption>
  </figure>;
}

function FocusedCourt({ household, chapter }) {
  if (!household) return <div className="court-empty">No royal household is available at this chapter boundary.</div>;
  const visibleSecurity = household.securityPersonnel.slice(0, 8);
  const extraSecurity = Math.max(0, household.securityPersonnel.length - visibleSecurity.length);
  const location = getEntityById(household.locationId);

  return <section className="court-focus" data-testid="focused-court">
    <header className="court-focus__meta">
      <div>
        <span>Royal portrait hierarchy</span>
        <strong>King → Queen → Prince → Guard formation</strong>
      </div>
      <div className="court-focus__facts">
        <span>Ch. {chapter}</span>
        <span>{household.securityPersonnel.length} confirmed guards</span>
        <span>{household.otherOperations.length} other operations excluded</span>
      </div>
    </header>

    <div className="court-lineage">
      <RoyalPortrait entity={household.king} title="King" className="royal-lineage-portrait--king" />
      <span className="court-lineage__connector" aria-hidden="true" />
      <RoyalPortrait
        entity={household.queen}
        title={household.queen?.queenRank || 'Queen'}
        subtitle="Royal household"
        className="royal-lineage-portrait--queen"
      />
      <span className="court-lineage__connector court-lineage__connector--long" aria-hidden="true" />

      <div className="court-formation-wrap">
        <div className="court-formation-grid">
          <div className="court-prince-card">
            <Portrait entity={household.prince} eager />
            <small>{ordinal(household.order)} Prince</small>
            <h2>{entityLabel(household.prince)}</h2>
            <p>{readable(household.life || 'unknown')} · {location ? entityLabel(location) : 'Location unresolved'}</p>
          </div>
          {visibleSecurity.map((person) => <SecurityMember key={person.id} character={person} />)}
        </div>
        <span className="court-formation-ring" aria-hidden="true" />
      </div>
    </div>

    {!visibleSecurity.length && <p className="court-focus__notice">No active assignment at this chapter is explicitly classified as protection, guard, security, escort, or defense. Other operations are deliberately not shown as guards.</p>}
    {!!extraSecurity && <p className="court-focus__notice">+{extraSecurity} additional confirmed security personnel are indexed for this court.</p>}
  </section>;
}

function CourtCard({ household, selected, onSelect }) {
  const security = household.securityPersonnel.slice(0, 4);
  return <button
    type="button"
    className={`court-card ${selected ? 'is-selected' : ''}`}
    onClick={() => onSelect(household)}
    aria-pressed={selected}
    data-testid="court-card"
  >
    <div className="court-card__topline">
      <span>{ordinal(household.order)} Prince</span>
      <em>{household.securityPersonnel.length} confirmed guards</em>
    </div>
    <div className="court-card__people">
      <Portrait entity={household.prince} className="court-card__prince" />
      <div className="court-card__security">
        {security.map((person) => <Portrait key={person.id} entity={person} />)}
        {!security.length && <span className="court-card__none">No confirmed guard assignment</span>}
      </div>
    </div>
    <strong>{entityLabel(household.prince)}</strong>
    <small>{household.queen ? `${entityLabel(household.queen)} household` : 'Royal household'}</small>
  </button>;
}

function CourtsView({ households, selectedId, chapter, onSelect, onNavigate }) {
  const selected = households.find((row) => row.prince?.id === selectedId) || households[0] || null;
  const selectCourt = (household) => {
    onSelect(household.prince.id);
    updateCharacterRoute(onNavigate, { view: 'courts', entity: household.prince.id, chapter });
  };

  return <section className="characters-courts" data-testid="characters-mode-courts">
    <FocusedCourt household={selected} chapter={chapter} />
    <header className="characters-section-heading">
      <div><span>Royal court lens</span><h2>Fourteen Prince courts</h2></div>
      <p>Every court keeps the royal portrait chain visible, then places confirmed guards around the selected Prince. Surveillance, threats, instruction, custody, and other operations remain outside the guard formation.</p>
    </header>
    <div className="courts-grid">
      {households.map((household) => <CourtCard
        key={household.prince.id}
        household={household}
        selected={selected?.prince.id === household.prince.id}
        onSelect={selectCourt}
      />)}
    </div>
  </section>;
}

function GroupsView({ onChooseGroup }) {
  return <section className="characters-groups" data-testid="characters-mode-groups">
    <header className="characters-section-heading">
      <div><span>Roster lens</span><h2>Succession groups</h2></div>
      <p>Groups are a shortcut into the full directory, not a replacement for it. Every detailed roster group remains available.</p>
    </header>
    <div className="groups-grid" data-testid="groups-grid">
      {successionRosterGroups.map((group) => <button type="button" className="group-card" key={group.id} onClick={() => onChooseGroup(group.id)}>
        <div className="group-card__portraits">
          {group.members.slice(0, 5).map((member) => <Portrait key={`${group.id}:${member.name}`} entity={{ name: member.name }} />)}
        </div>
        <span>{group.members.length} profiled characters</span>
        <h3>{group.title}</h3>
        <p>{group.description}</p>
      </button>)}
    </div>
  </section>;
}

export default function SuccessionCharacterCourtMap({ requestedState = {}, spoilerLimit, onNavigate }) {
  const chapter = Number(requestedState.chapter || spoilerLimit) || 410;
  const characters = useMemo(buildCharacterDirectory, []);
  const households = useMemo(() => safe(() => getRoyalHouseholdMatrix(chapter), [])
    .map(householdFromRow)
    .filter((row) => row.prince)
    .sort((left, right) => Number(left.order || 99) - Number(right.order || 99)), [chapter]);

  const requestedView = VALID_VIEWS.has(requestedState.view) ? requestedState.view : 'all';
  const [view, setView] = useState(requestedView);
  const [selectedCharacter, setSelectedCharacter] = useState(() => characters.find((row) => row.id === requestedState.entity) || null);
  const [selectedCourtId, setSelectedCourtId] = useState(() => households.find((row) => row.prince.id === requestedState.entity)?.prince.id || households[0]?.prince.id || '');
  const [groupFilter, setGroupFilter] = useState(requestedState.group || '');

  useEffect(() => setView(requestedView), [requestedView]);
  useEffect(() => {
    const requestedCharacter = characters.find((row) => row.id === requestedState.entity) || null;
    if (requestedCharacter) setSelectedCharacter(requestedCharacter);
    const requestedCourt = households.find((row) => row.prince.id === requestedState.entity);
    if (requestedCourt) setSelectedCourtId(requestedCourt.prince.id);
  }, [characters, households, requestedState.entity]);
  useEffect(() => setGroupFilter(requestedState.group || ''), [requestedState.group]);

  const changeView = (nextView) => {
    setView(nextView);
    const entity = nextView === 'courts' ? selectedCourtId : selectedCharacter?.id;
    updateCharacterRoute(onNavigate, { view: nextView, chapter, ...(entity ? { entity } : {}), ...(nextView === 'all' && groupFilter ? { group: groupFilter } : {}) });
  };

  const chooseGroup = (groupId) => {
    setGroupFilter(groupId);
    setView('all');
    updateCharacterRoute(onNavigate, { view: 'all', chapter, group: groupId });
  };

  return <main className="character-system" data-testid="characters-root">
    <header className="character-system__intro">
      <div>
        <span>Succession Contest · Character system</span>
        <h1>Characters</h1>
        <p>The whole in-scope cast is the archive. Courts and groups are visual lenses for navigating it, never substitutes for the complete Succession character index.</p>
      </div>
      <div className="character-system__counts">
        <strong>{characters.length.toLocaleString()}</strong><span>Succession character records</span>
        <small>{successionRoster.length.toLocaleString()} detailed roster profiles</small>
      </div>
    </header>

    <nav className="character-view-tabs" aria-label="Character views">
      <button type="button" className={view === 'all' ? 'is-active' : ''} onClick={() => changeView('all')}>All Characters <span>{characters.length}</span></button>
      <button type="button" className={view === 'courts' ? 'is-active' : ''} onClick={() => changeView('courts')}>Royal Courts <span>{households.length}</span></button>
      <button type="button" className={view === 'groups' ? 'is-active' : ''} onClick={() => changeView('groups')}>Groups <span>{successionRosterGroups.length}</span></button>
    </nav>

    {view === 'all' && <AllCharactersView
      characters={characters}
      selected={selectedCharacter}
      chapter={chapter}
      initialGroup={groupFilter}
      onSelect={setSelectedCharacter}
      onNavigate={onNavigate}
    />}
    {view === 'courts' && <CourtsView
      households={households}
      selectedId={selectedCourtId}
      chapter={chapter}
      onSelect={setSelectedCourtId}
      onNavigate={onNavigate}
    />}
    {view === 'groups' && <GroupsView onChooseGroup={chooseGroup} />}
  </main>;
}
