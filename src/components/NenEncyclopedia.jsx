import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, BookOpen, ExternalLink, Image as ImageIcon, Search } from 'lucide-react';
import SourcePortrait from './SourcePortrait';
import SafeImage from './SafeImage';
import { nenAbilityDirectory, nenGroups, nenRecords, nenSource } from '../data/nenEncyclopedia';
import { priorityPortraitByName } from '../data/priorityMedia.generated';

const hunterFile = (name) => `https://hunterxhunter.fandom.com/wiki/Special:Redirect/file/${encodeURIComponent(name)}`;

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
  { name: 'Ten', position: 'top', kanji: '纏', action: 'Contain', summary: 'Keep aura flowing around the body instead of leaking away. Ten is the stable shroud underneath defense, endurance, Shu, En, Ken, and Ko.', risk: 'Limited protection by itself; it does not replace stronger defensive applications.', image: hunterFile('Gon and Killua using Ten.png') },
  { name: 'Zetsu', position: 'right', kanji: '絶', action: 'Suppress', summary: 'Close the aura nodes and stop outward flow. Presence becomes difficult to sense, fatigue eases, and outside aura becomes easier to feel.', risk: 'The body loses its aura defense and becomes highly vulnerable to Nen attacks.', image: hunterFile('Gon using Zetsu.png') },
  { name: 'Ren', position: 'bottom', kanji: '練', action: 'Output', summary: 'Produce and sustain much more aura than Ten. Ren supplies the volume behind pressure, Gyo, En, Ken, and stronger Hatsu use.', risk: 'Higher output consumes aura and stamina; hostile Ren can overwhelm an unprotected person.', image: hunterFile('Zushi using Ren.png') },
  { name: 'Hatsu', position: 'left', kanji: '発', action: 'Express', summary: 'Give aura an individual function through affinity, training, personality, conditions, and design. Named Nen abilities are applications of Hatsu.', risk: 'A badly matched or overloaded design can waste potential; conditions and vows carry real costs.', image: hunterFile('Wing using Hatsu.png') },
];

const techniques = [
  { name: 'Gyo', bases: ['Ren'], base: 'Ren', detail: 'Concentrate more aura in one body part; the eyes can perceive aura hidden with In.', image: hunterFile('Zushi using Gyo.png'), position: 'gyo' },
  { name: 'In', bases: ['Zetsu'], base: 'Zetsu', detail: 'Conceal aura or an aura construct without making it cease to exist.', image: hunterFile("Uvogin trapped within Kurapika's chains, which are concealed from view through In.png"), position: 'in' },
  { name: 'En', bases: ['Ten', 'Ren'], base: 'Ten + Ren', detail: 'Expand and contain a controlled aura field to detect intrusion and movement.', image: hunterFile('Nobunaga using En.png'), position: 'en' },
  { name: 'Shu', bases: ['Ten'], base: 'Ten', detail: 'Extend the aura shroud around an object so it functions as part of the user.', image: hunterFile('Gon using Shu.png'), position: 'shu' },
  { name: 'Ko', bases: ['Ten', 'Zetsu', 'Ren', 'Hatsu'], base: 'Ten + Zetsu + Ren + Hatsu + Gyo', detail: 'Concentrate nearly all usable aura at one point and leave the rest exposed.', image: hunterFile('Biscuit using Ko.png'), position: 'ko' },
  { name: 'Ken', bases: ['Ten', 'Ren'], base: 'Ten + Ren', detail: 'Maintain a powerful, even, full-body defensive shroud.', image: hunterFile('Gon using Ken.png'), position: 'ken' },
  { name: 'Ryu', bases: ['Ten', 'Ren'], base: 'Gyo + Ken', detail: 'Redistribute aura percentages during combat as attack and defense change.', image: hunterFile('Biscuit using Ryu.png'), position: 'ryu' },
];

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
  const technique = techniques.find((item) => item.name === activeTechnique && item.bases.includes(activePrinciple)) || related[0];
  const choosePrinciple = (name) => {
    setActivePrinciple(name);
    setActiveTechnique(techniques.find((item) => item.bases.includes(name))?.name || 'Gyo');
  };

  return <section className="nen-principle-workbench" aria-labelledby="nen-principle-title">
    <header><div><span className="section-kicker">Hover, focus, or tap a principle</span><h3 id="nen-principle-title">Four principles → advanced techniques</h3></div><p>The bright outer nodes are the techniques that depend on the selected foundation. A technique can light up from more than one principle because Nen applications combine rules.</p></header>
    <div className="nen-principle-workbench__layout">
      <div className="nen-principle-map" aria-label="Interactive relationship map of the Four Major Principles and advanced Nen techniques">
        <SafeImage src={hunterFile('The four major principles of Nen.png')} alt="The Four Major Principles of Nen from Hunterpedia" />
        <i className="nen-principle-map__ring" aria-hidden="true" />
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
        {techniques.map((item) => {
          const connected = item.bases.includes(activePrinciple);
          return <button
            type="button"
            className={`nen-advanced-node is-${item.position}${connected ? ' is-related' : ''}${technique?.name === item.name ? ' is-active' : ''}`}
            aria-label={`${item.name}: ${item.base}`}
            onMouseEnter={() => connected && setActiveTechnique(item.name)}
            onFocus={() => connected && setActiveTechnique(item.name)}
            onClick={() => { setActiveTechnique(item.name); if (!connected) choosePrinciple(item.bases[0]); }}
            key={item.name}
          ><strong>{item.name}</strong><small>{item.base}</small></button>;
        })}
      </div>
      <aside className="nen-principle-inspector" aria-live="polite">
        <div className="nen-principle-inspector__foundation">
          <figure><SafeImage src={principle.image} alt={`${principle.name} demonstration from Hunterpedia`} /></figure>
          <span>Foundation · {principle.kanji}</span><h3>{principle.name}</h3><p>{principle.summary}</p><blockquote><b>Trade-off</b>{principle.risk}</blockquote>
        </div>
        <div className="nen-principle-inspector__advanced">
          <header><span>{related.length} dependent application{related.length === 1 ? '' : 's'}</span><strong>{technique?.name}</strong></header>
          {technique && <figure><SafeImage src={technique.image} alt={`${technique.name} demonstration from Hunterpedia`} /><figcaption>{technique.base}</figcaption></figure>}
          <p>{technique?.detail}</p>
          <div>{related.map((item) => <button type="button" className={technique?.name === item.name ? 'is-active' : ''} onMouseEnter={() => setActiveTechnique(item.name)} onFocus={() => setActiveTechnique(item.name)} onClick={() => setActiveTechnique(item.name)} key={item.name}>{item.name}</button>)}</div>
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
      <div><span className="section-kicker">Visual Nen curriculum</span><h2>Understand the rule before memorizing the name.</h2><p>The decorative SVG simulations are gone. Every visual subject is represented by actual Hunterpedia character media, and every lesson links to the system record that supports the explanation.</p><div><a href={nenSource} target="_blank" rel="noreferrer">Nen source <ExternalLink size={12} /></a><a href={nenAbilityDirectory} target="_blank" rel="noreferrer">Ability directory <ExternalLink size={12} /></a></div></div>
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
        <SafeImage src={hunterFile('Nen types distribution and relative position.png')} alt="Nen types distribution and relative position from Hunterpedia" />
        <div className="nen-category-hex__nodes">{categories.map((item) => <button type="button" data-position={item.position.toLowerCase()} className={activeCategory === item.name ? 'is-active' : ''} onMouseEnter={() => setActiveCategory(item.name)} onFocus={() => setActiveCategory(item.name)} onClick={() => setActiveCategory(item.name)} key={item.name}><strong>{item.name}</strong><small>{item.position}</small></button>)}</div>
        <span>Canonical Hunterpedia category chart beneath the interaction layer</span>
      </div>
      <article><Portrait name={selectedCategory.example} /><div><span>{selectedCategory.position} position · natural affinity example</span><h3>{selectedCategory.name}</h3><p>{selectedCategory.idea}</p><dl><div><dt>Water Divination</dt><dd>{selectedCategory.result}</dd></div><div><dt>Example subject</dt><dd>{selectedCategory.example}</dd></div><div><dt>Affinity distance</dt><dd>Adjacent types are normally easier and more efficient than distant types; Specialization is an exception.</dd></div><div><dt>Important limit</dt><dd>Affinity does not equal mastery, output, personality, or a complete future ability.</dd></div></dl><button onClick={() => openRecordSearch(selectedCategory.name)}>Open {selectedCategory.name} records <ArrowRight size={13} /></button></div></article>
    </section>}

    {lessonView === 'techniques' && <section className="nen-technique-view"><header><div><span className="section-kicker">Hunterpedia action imagery</span><h3>Advanced techniques as operational rules</h3></div><p>Every card pairs the dependency formula with a canonical visual example. The image explains what the technique looks like; the text explains what it actually does.</p></header><div className="nen-technique-gallery">{techniques.map((item, index) => <article key={item.name}><figure><SafeImage src={item.image} alt={`${item.name} demonstration from Hunterpedia`} /><i>{String(index + 1).padStart(2, '0')}</i></figure><div><small>{item.base}</small><h3>{item.name}</h3><p>{item.detail}</p><button onClick={() => openRecordSearch(item.name, 'Advanced applications')}>Open records <ArrowRight size={12} /></button></div></article>)}</div></section>}

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
