import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, ExternalLink, Image as ImageIcon, Search } from 'lucide-react';
import SourcePortrait from './SourcePortrait';
import SafeImage from './SafeImage';
import { nenAbilityDirectory, nenGroups, nenRecords, nenSource } from '../data/nenEncyclopedia';
import { priorityPortraitByName } from '../data/priorityMedia.generated';

const nenAsset = (name) => `/media/nen/${name}.svg`;

const categories = [
  { name: 'Enhancement', position: 'Top', result: 'Water volume changes', idea: 'Strengthen what already exists', example: 'Gon Freecss' },
  { name: 'Transmutation', position: 'Upper-right', result: 'Water taste changes', idea: 'Give aura another quality', example: 'Killua Zoldyck' },
  { name: 'Conjuration', position: 'Lower-right', result: 'Impurities appear', idea: 'Materialize an object or structure', example: 'Kurapika' },
  { name: 'Specialization', position: 'Bottom', result: 'A different change occurs', idea: 'Produce an effect outside the regular five', example: 'Chrollo Lucilfer' },
  { name: 'Manipulation', position: 'Lower-left', result: 'The leaf moves', idea: 'Control a target or process', example: 'Illumi Zoldyck' },
  { name: 'Emission', position: 'Upper-left', result: 'Water color changes', idea: 'Separate aura and retain its function', example: 'Leorio Paradinight' },
];

const foundations = [
  { number: '01', name: 'Aura and aura nodes', people: ['Wing', 'Gon Freecss'], summary: 'Aura is life energy. Learning begins by perceiving its flow and understanding how the body’s nodes release it.', look: 'Compare the teacher who explains the system with the student whose nodes are opened.', source: `${nenSource}#Aura` },
  { number: '02', name: 'Ten', people: ['Gon Freecss', 'Killua Zoldyck'], summary: 'Keep the nodes open while containing aura as a stable shroud around the body.', look: 'Ten prevents uncontrolled leakage and provides the baseline for defense and sustained Nen use.', source: `${nenSource}#Ten` },
  { number: '03', name: 'Zetsu', people: ['Gon Freecss', 'Hisoka Morow'], summary: 'Close aura output to suppress presence and recover sensitivity, while giving up most aura defense.', look: 'Read Zetsu as a strategic trade: concealment and recovery versus exposure.', source: `${nenSource}#Zetsu` },
  { number: '04', name: 'Ren', people: ['Hisoka Morow', 'Isaac Netero'], summary: 'Produce and sustain substantially more aura than ordinary Ten.', look: 'Pressure, output, stamina, and emotional intent all matter; visible intensity alone is not a complete measurement.', source: `${nenSource}#Ren` },
  { number: '05', name: 'Hatsu', people: ['Kurapika', 'Killua Zoldyck'], summary: 'Express aura through the user’s natural category, training, individuality, and chosen ability system.', look: 'Hatsu is not simply the name of every ability; the source distinguishes foundational expression from named abilities.', source: `${nenSource}#Hatsu` },
  { number: '06', name: 'Water Divination', people: ['Gon Freecss', 'Kurapika'], summary: 'A glass of water and a floating leaf reveal natural category through the type of change produced.', look: 'The result identifies affinity—not the person’s complete future ability, mastery, or personality.', source: `${nenSource}#Water_Divination` },
];

const principles = [
  { name: 'Ten', position: 'top', kanji: '纏', action: 'Contain', summary: 'Keep aura flowing around the body instead of leaking away. Ten is the stable shroud underneath defense, endurance, Shu, En, Ken, and Ko.', risk: 'Limited protection by itself; it does not replace stronger defensive applications.', image: nenAsset('ten') },
  { name: 'Zetsu', position: 'right', kanji: '絶', action: 'Suppress', summary: 'Close the aura nodes and stop outward flow. Presence becomes difficult to sense, fatigue eases, and outside aura becomes easier to feel.', risk: 'The body loses its aura defense and becomes highly vulnerable to Nen attacks.', image: nenAsset('zetsu') },
  { name: 'Ren', position: 'bottom', kanji: '練', action: 'Output', summary: 'Produce and sustain much more aura than Ten. Ren supplies the volume behind pressure, Gyo, En, Ken, and stronger Hatsu use.', risk: 'Higher output consumes aura and stamina; hostile Ren can overwhelm an unprotected person.', image: nenAsset('ren') },
  { name: 'Hatsu', position: 'left', kanji: '発', action: 'Express', summary: 'Give aura an individual function through affinity, training, personality, conditions, and design. Named Nen abilities are applications of Hatsu.', risk: 'A badly matched or overloaded design can waste potential; conditions and vows carry real costs.', image: nenAsset('hatsu') },
];

const techniques = [
  { name: 'Gyo', bases: ['Ren'], base: 'Ren', detail: 'Concentrate more aura in one body part; the eyes can perceive aura hidden with In.', image: nenAsset('gyo'), position: 'gyo' },
  { name: 'In', bases: ['Zetsu'], base: 'Zetsu', detail: 'Conceal aura or an aura construct without making it cease to exist.', image: nenAsset('in'), position: 'in' },
  { name: 'En', bases: ['Ten', 'Ren'], base: 'Ten + Ren', detail: 'Expand and contain a controlled aura field to detect intrusion and movement.', image: nenAsset('en'), position: 'en' },
  { name: 'Shu', bases: ['Ten'], base: 'Ten', detail: 'Extend the aura shroud around an object so it functions as part of the user.', image: nenAsset('shu'), position: 'shu' },
  { name: 'Ko', bases: ['Ten', 'Zetsu', 'Ren', 'Hatsu'], base: 'Ten + Zetsu + Ren + Hatsu + Gyo', detail: 'Concentrate nearly all usable aura at one point and leave the rest exposed.', image: nenAsset('ko'), position: 'ko' },
  { name: 'Ken', bases: ['Ten', 'Ren'], base: 'Ten + Ren', detail: 'Maintain a powerful, even, full-body defensive shroud.', image: nenAsset('ken'), position: 'ken' },
  { name: 'Ryu', bases: [], defaultPrinciple: 'Ren', base: 'Gyo + Ken', detail: 'Redistribute aura percentages during combat as attack and defense change.', image: nenAsset('ryu'), position: 'ryu' },
];

const principlePoints = {
  Ten: [50, 21],
  Zetsu: [79, 50],
  Ren: [50, 79],
  Hatsu: [21, 50],
};

const techniquePoints = {
  Gyo: [21, 9],
  In: [79, 9],
  En: [92, 35],
  Shu: [86, 76],
  Ko: [50, 91],
  Ken: [14, 76],
  Ryu: [8, 35],
};

const anatomy = [
  ['Effect', 'What physically or informationally changes?'],
  ['Activation', 'What action, target, object, phrase, mark, or state starts it?'],
  ['Conditions', 'What must remain true, and what restriction increases power?'],
  ['Range and duration', 'Where does it operate, how long does it persist, and what ends it?'],
  ['Cost and risk', 'Aura, injury, time, lifespan, information, or death may be the price.'],
  ['Evidence', 'Separate confirmed mechanics, character inference, translation variation, and unresolved behavior.'],
];

const portraitItem = (name) => {
  const media = priorityPortraitByName.get(name);
  return media
    ? { id: name, name, source: media.articleSource, image: media.src, media }
    : { id: name, name, source: `https://hunterxhunter.fandom.com/wiki/${encodeURIComponent(name.replaceAll(' ', '_'))}` };
};

function Portrait({ name }) {
  return <SourcePortrait item={portraitItem(name)} alt={`${name} portrait from Hunterpedia`} />;
}

function NenPrincipleMap({ onOpenRecord }) {
  const [activePrinciple, setActivePrinciple] = useState('Zetsu');
  const [activeTechnique, setActiveTechnique] = useState('In');
  const principle = principles.find((item) => item.name === activePrinciple) || principles[0];
  const related = techniques.filter((item) => item.bases.includes(activePrinciple));
  const chained = activePrinciple === 'Ren' ? techniques.find((item) => item.name === 'Ryu') : null;
  const visibleTechniques = chained ? [...related, chained] : related;
  const technique = techniques.find((item) => item.name === activeTechnique) || related[0];
  const isChainedTechnique = Boolean(technique && technique.bases.length === 0);
  const [originX, originY] = principlePoints[activePrinciple] || principlePoints.Ten;

  const choosePrinciple = (name) => {
    setActivePrinciple(name);
    setActiveTechnique(techniques.find((item) => item.bases.includes(name))?.name || 'Gyo');
  };

  const chooseTechnique = (item) => {
    const nextPrinciple = item.bases.includes(activePrinciple)
      ? activePrinciple
      : (item.bases[0] || item.defaultPrinciple);
    if (nextPrinciple) setActivePrinciple(nextPrinciple);
    setActiveTechnique(item.name);
  };

  return <section className="nen-principle-workbench" aria-labelledby="nen-principle-title">
    <header><div><span className="section-kicker">Hover, focus, or tap a principle</span><h3 id="nen-principle-title">Four principles → advanced techniques</h3></div><p>Each active principle owns its direct applications. Ryu remains separately marked because it is Gyo performed while maintaining Ken, not a direct branch of one foundation.</p></header>
    <div className="nen-principle-workbench__layout">
      <div className={`nen-principle-map is-stack-${activePrinciple.toLowerCase()}`} aria-label="Interactive relationship map of the Four Major Principles and advanced Nen techniques">
        <SafeImage src={nenAsset('principles')} fallbackLabel="Four principles" alt="Local diagram of the Four Major Principles of Nen" />
        <i className="nen-principle-map__ring" aria-hidden="true" />
        <svg className="nen-principle-links" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {related.map((item) => {
            const [targetX, targetY] = techniquePoints[item.name];
            return <line x1={originX} y1={originY} x2={targetX} y2={targetY} key={`${activePrinciple}-${item.name}`} />;
          })}
        </svg>
        <div className="nen-principle-map__center"><span>念</span><small>Nen</small></div>
        {principles.map((item) => <button
          type="button"
          className={`nen-principle-node is-${item.position}${activePrinciple === item.name ? ' is-active' : ''}`}
          aria-pressed={activePrinciple === item.name}
          onMouseEnter={() => choosePrinciple(item.name)}
          onFocus={() => choosePrinciple(item.name)}
          onClick={() => choosePrinciple(item.name)}
          key={item.name}
        ><i>{item.kanji}</i><span><strong>{item.name}</strong><small>{item.action}</small></span></button>)}
        {visibleTechniques.map((item) => {
          const connected = item.bases.includes(activePrinciple);
          const isChained = item.bases.length === 0;
          return <button
            type="button"
            className={`nen-advanced-node is-${item.position}${connected ? ' is-related' : ''}${isChained ? ' is-chained' : ''}${technique?.name === item.name ? ' is-active' : ''}`}
            aria-label={`${item.name}: ${item.base}${isChained ? '; chained technique, not a direct Four Major Principle application' : ''}`}
            onMouseEnter={() => chooseTechnique(item)}
            onFocus={() => chooseTechnique(item)}
            onClick={() => chooseTechnique(item)}
            key={item.name}
          ><strong>{item.name}</strong><small>{item.base}</small></button>;
        })}
      </div>
      <aside className="nen-principle-inspector" aria-live="polite">
        <div className="nen-principle-inspector__foundation">
          <figure><SafeImage src={principle.image} fallbackLabel={principle.name} alt={`${principle.name} Nen concept diagram`} /></figure>
          <span>Foundation · {principle.kanji}</span><h3>{principle.name}</h3><p>{principle.summary}</p><blockquote><b>Trade-off</b>{principle.risk}</blockquote>
        </div>
        <div className="nen-principle-inspector__advanced">
          <header><span>{isChainedTechnique ? 'Chained advanced application' : `${related.length} direct application${related.length === 1 ? '' : 's'}`}</span><strong>{technique?.name}</strong></header>
          {technique && <figure><SafeImage src={technique.image} fallbackLabel={technique.name} alt={`${technique.name} Nen concept diagram`} /><figcaption>{technique.base}</figcaption></figure>}
          <p>{technique?.detail}</p>
          {isChainedTechnique && <small className="nen-principle-inspector__chain">Ryu is Gyo used while maintaining Ken. It is therefore shown as a second-stage technique, not as a direct branch of Ten or Ren.</small>}
          <div>{visibleTechniques.map((item) => <button type="button" className={technique?.name === item.name ? 'is-active' : ''} onMouseEnter={() => chooseTechnique(item)} onFocus={() => chooseTechnique(item)} onClick={() => chooseTechnique(item)} key={item.name}>{item.name}</button>)}</div>
          <button type="button" className="nen-principle-inspector__records" onClick={() => onOpenRecord(technique?.name || activePrinciple, technique ? 'Advanced applications' : 'Four Major Principles')}>Open matching records <ArrowRight size={13} /></button>
        </div>
      </aside>
    </div>
  </section>;
}

export default function NenEncyclopedia({ initialQuery = '', spoilerLimit = Number.MAX_SAFE_INTEGER }) {
  const [query, setQuery] = useState(initialQuery);
  const [group, setGroup] = useState('all');
  const [recordType, setRecordType] = useState('all');
  const [lessonView, setLessonView] = useState('foundations');
  const [lessonIndex, setLessonIndex] = useState(1);
  const [activeCategory, setActiveCategory] = useState('Enhancement');
  const [selectedId, setSelectedId] = useState(nenRecords[0].id);
  const selectedLesson = foundations[lessonIndex] || foundations[0];
  const selectedCategory = categories.find((item) => item.name === activeCategory) || categories[0];
  const visible = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return nenRecords.filter((item) => (
      (!item.chapter || item.chapter <= spoilerLimit)
      && (group === 'all' || item.group === group)
      && (recordType === 'all' || (recordType === 'abilities' ? /ability/i.test(item.kind) : !/ability/i.test(item.kind)))
      && (!normalized || `${item.name} ${item.group} ${item.kind} ${item.user || ''} ${item.type || ''} ${item.summary} ${item.mechanics.join(' ')} ${item.related.join(' ')}`.toLowerCase().includes(normalized))
    ));
  }, [group, query, recordType, spoilerLimit]);
  const selected = visible.find((item) => item.id === selectedId) || visible[0];

  useEffect(() => setQuery(initialQuery), [initialQuery]);
  useEffect(() => {
    if (visible.length && !visible.some((item) => item.id === selectedId)) setSelectedId(visible[0].id);
  }, [selectedId, visible]);

  const openRecordSearch = (value, nextGroup = 'all') => { setGroup(nextGroup); setRecordType('all'); setQuery(value); };

  return <section className="nen-encyclopedia nen-image-desk" id="nen">
    <header className="nen-desk-hero">
      <div><span className="section-kicker">Visual Nen curriculum</span><h2>Understand the rule before memorizing the name.</h2><p>Each lesson uses a stable local concept diagram, while the evidence cards and record links keep the Hunterpedia sourcing visible. The visual explains the rule; the linked source supports the record.</p><div><a href={nenSource} target="_blank" rel="noreferrer">Nen source <ExternalLink size={12} /></a><a href={nenAbilityDirectory} target="_blank" rel="noreferrer">Ability directory <ExternalLink size={12} /></a></div></div>
      <div className="nen-desk-hero__portraits"><Portrait name="Wing" /><Portrait name="Gon Freecss" /><Portrait name="Killua Zoldyck" /><Portrait name="Kurapika" /><span><ImageIcon size={17} /> Verified Hunterpedia portraits</span></div>
    </header>

    <nav className="nen-lesson-tabs" aria-label="Nen visual lessons">
      {[['foundations', 'Four principles + divination'], ['categories', 'Six categories'], ['techniques', 'Advanced techniques'], ['anatomy', 'Ability anatomy']].map(([id, label], index) => <button className={lessonView === id ? 'is-active' : ''} onClick={() => setLessonView(id)} aria-pressed={lessonView === id} key={id}><i>{String(index + 1).padStart(2, '0')}</i><span>{label}</span></button>)}
    </nav>

    {lessonView === 'foundations' && <section className="nen-foundation-view">
      <NenPrincipleMap onOpenRecord={openRecordSearch} />
      <div className="nen-foundation-reference">
        <div className="nen-foundation-index">{foundations.map((lesson, index) => <button className={selectedLesson.name === lesson.name ? 'is-active' : ''} onClick={() => setLessonIndex(index)} key={lesson.name}><i>{lesson.number}</i><span><strong>{lesson.name}</strong><small>{lesson.people.join(' · ')}</small></span></button>)}</div>
        <article className="nen-evidence-card">
          <div className="nen-evidence-card__images">{selectedLesson.people.map((name) => <a href={portraitItem(name).source} target="_blank" rel="noreferrer" key={name}><Portrait name={name} /><span>{name}</span></a>)}</div>
          <div className="nen-evidence-card__copy"><span>Lesson {selectedLesson.number} · sourced visual subjects</span><h3>{selectedLesson.name}</h3><p>{selectedLesson.summary}</p><blockquote><b>What to notice</b>{selectedLesson.look}</blockquote><a href={selectedLesson.source} target="_blank" rel="noreferrer">Open the exact Hunterpedia section <ExternalLink size={12} /></a></div>
        </article>
      </div>
    </section>}

    {lessonView === 'categories' && <section className="nen-category-view nen-category-view--visual">
      <div className="nen-category-hex">
        <SafeImage src={nenAsset('categories')} fallbackLabel="Nen categories" alt="Local diagram of Nen category positions and affinities" />
        <div className="nen-category-hex__nodes">{categories.map((item) => <button type="button" data-position={item.position.toLowerCase()} className={activeCategory === item.name ? 'is-active' : ''} onMouseEnter={() => setActiveCategory(item.name)} onFocus={() => setActiveCategory(item.name)} onClick={() => setActiveCategory(item.name)} key={item.name}><strong>{item.name}</strong><small>{item.position}</small></button>)}</div>
        <span>Local category relationship diagram beneath the interaction layer</span>
      </div>
      <article><Portrait name={selectedCategory.example} /><div><span>{selectedCategory.position} position · natural affinity example</span><h3>{selectedCategory.name}</h3><p>{selectedCategory.idea}</p><dl><div><dt>Water Divination</dt><dd>{selectedCategory.result}</dd></div><div><dt>Example subject</dt><dd>{selectedCategory.example}</dd></div><div><dt>Affinity distance</dt><dd>Adjacent types are normally easier and more efficient than distant types; Specialization is an exception.</dd></div><div><dt>Important limit</dt><dd>Affinity does not equal mastery, output, personality, or a complete future ability.</dd></div></dl><button onClick={() => openRecordSearch(selectedCategory.name)}>Open {selectedCategory.name} records <ArrowRight size={13} /></button></div></article>
    </section>}

    {lessonView === 'techniques' && <section className="nen-technique-view"><header><div><span className="section-kicker">Local concept diagrams</span><h3>Advanced techniques as operational rules</h3></div><p>Every card pairs its dependency formula with a dedicated local diagram. The visual describes the operation; the text states the rule and limitation.</p></header><div className="nen-technique-gallery">{techniques.map((item, index) => <article key={item.name}><figure><SafeImage src={item.image} alt={`${item.name} Nen concept diagram`} /><i>{String(index + 1).padStart(2, '0')}</i></figure><div><small>{item.base}</small><h3>{item.name}</h3><p>{item.detail}</p><button onClick={() => openRecordSearch(item.name, 'Advanced applications')}>Open records <ArrowRight size={12} /></button></div></article>)}</div></section>}

    {lessonView === 'anatomy' && <section className="nen-anatomy-view"><div className="nen-anatomy-view__image"><Portrait name="Kurapika" /><Portrait name="Chrollo Lucilfer" /><Portrait name="Hisoka Morow" /></div><div><span className="section-kicker">Ability reading method</span><h3>Six questions prevent bad Nen explanations.</h3><ol>{anatomy.map(([name, detail], index) => <li key={name}><i>{String(index + 1).padStart(2, '0')}</i><span><strong>{name}</strong><p>{detail}</p></span></li>)}</ol></div></section>}

    <div className="nen-directory-heading"><div><span className="section-kicker">Reference directory</span><h3>Concepts and named abilities</h3></div><p>Use the image-led lessons for orientation, then inspect mechanics, users, conditions, examples, and sources.</p></div>
    <div className="nen-encyclopedia__toolbar">
      <label><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Technique, user, category, condition…" /></label>
      <div className="nen-record-type"><button className={recordType === 'all' ? 'is-active' : ''} onClick={() => setRecordType('all')}>All records</button><button className={recordType === 'concepts' ? 'is-active' : ''} onClick={() => setRecordType('concepts')}>System concepts</button><button className={recordType === 'abilities' ? 'is-active' : ''} onClick={() => setRecordType('abilities')}>Named abilities</button></div>
      <div><button className={group === 'all' ? 'is-active' : ''} onClick={() => setGroup('all')}>All groups</button>{nenGroups.map((item) => <button className={group === item ? 'is-active' : ''} onClick={() => setGroup(item)} key={item}>{item}</button>)}</div>
      <span role="status" aria-live="polite">{visible.length} records</span>
    </div>
    <div className="nen-browser">
      <div className="nen-browser__index" role="listbox" aria-label="Nen records">
        {visible.map((item) => <button role="option" aria-selected={selected?.id === item.id} className={selected?.id === item.id ? 'is-active' : ''} onClick={() => setSelectedId(item.id)} key={item.id}><span>{item.group}</span><strong>{item.name}</strong><small>{item.user || item.kind}</small></button>)}
        {!visible.length && <div className="library-empty">No Nen record matches this search and spoiler boundary.</div>}
      </div>
      {selected && <article className="nen-record">
        <header><span>{selected.kind} · {selected.group}</span><h3>{selected.name}</h3><p>{selected.summary}</p></header>
        {selected.user && <div className="nen-record__user"><Portrait name={selected.user.split(',')[0].trim()} /><span><small>Primary indexed user</small><strong>{selected.user}</strong></span></div>}
        {(selected.user || selected.type || selected.debut) && <dl><div><dt>User</dt><dd>{selected.user || 'System concept'}</dd></div><div><dt>Type</dt><dd>{selected.type || 'Multiple / not applicable'}</dd></div><div><dt>Debut or scope</dt><dd>{selected.debut || 'Nen system record'}</dd></div></dl>}
        {/ability/i.test(selected.kind) && <section className="nen-ability-anatomy"><header><span>Ability anatomy</span><strong>Read the effect as a rule system</strong></header><ol><li><i>01</i><span><small>Effect</small><p>{selected.summary}</p></span></li><li><i>02</i><span><small>Activation / operation</small><p>{selected.mechanics[0] || 'Not separately established in the local record.'}</p></span></li><li><i>03</i><span><small>Conditions / persistence</small><p>{selected.mechanics.slice(1).join(' ') || 'Open the Hunterpedia source for currently established conditions.'}</p></span></li><li><i>04</i><span><small>Evidence boundary</small><p>{selected.study}</p></span></li></ol></section>}
        <section><h4>Mechanics</h4><ul>{selected.mechanics.map((item) => <li key={item}>{item}</li>)}</ul></section>
        <section><h4>Study note</h4><p>{selected.study}</p></section>
        <section><h4>Related records</h4><div>{selected.related.map((item) => <button onClick={() => { const match = nenRecords.find((record) => record.name === item); if (match) { setGroup('all'); setQuery(''); setSelectedId(match.id); } else setQuery(item); }} key={item}>{item}</button>)}</div></section>
        <a href={selected.source} target="_blank" rel="noreferrer">Open Hunterpedia source <ExternalLink size={13} /></a>
      </article>}
    </div>
  </section>;
}
