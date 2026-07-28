import { ArrowRight, Droplets, Eye, Link2, Shield, Sparkles } from 'lucide-react';
import SourcePortrait from './SourcePortrait';

const typeRecords = [
  { name: 'Enhancement', code: 'En', mark: '強', slug: 'enhancement', position: 'top', summary: 'Strengthen the body, aura, objects, or an existing quality.', water: 'Water volume changes.', neighbors: ['Emission', 'Transmutation'], users: [['Gon Freecss', 'Jajanken'], ['Uvogin', 'Big Bang Impact']] },
  { name: 'Transmutation', code: 'Tr', mark: '変', slug: 'transmutation', position: 'upper-right', summary: 'Give aura the properties of another substance or phenomenon.', water: 'The water taste changes.', neighbors: ['Enhancement', 'Conjuration'], users: [['Killua Zoldyck', 'Godspeed'], ['Hisoka Morow', 'Bungee Gum']] },
  { name: 'Conjuration', code: 'Co', mark: '具', slug: 'conjuration', position: 'lower-right', summary: 'Materialize an object, structure, creature, or rule-bearing construct.', water: 'Impurities appear in the water.', neighbors: ['Transmutation', 'Specialization'], users: [['Kurapika', 'Conjured chains'], ['Shizuku Murasaki', 'Blinky']] },
  { name: 'Specialization', code: 'Sp', mark: '特', slug: 'specialization', position: 'bottom', summary: 'Produce an exceptional effect that does not fit the regular five categories.', water: 'A different or unique change occurs.', neighbors: ['Conjuration', 'Manipulation'], users: [['Chrollo Lucilfer', 'Skill Hunter'], ['Neon Nostrade', 'Lovely Ghostwriter']] },
  { name: 'Manipulation', code: 'Ma', mark: '操', slug: 'manipulation', position: 'lower-left', summary: 'Control a person, object, creature, substance, or process.', water: 'The leaf moves.', neighbors: ['Specialization', 'Emission'], users: [['Illumi Zoldyck', 'Needle People'], ['Shalnark', 'Black Voice']] },
  { name: 'Emission', code: 'Em', mark: '放', slug: 'emission', position: 'upper-left', summary: 'Separate aura from the body while retaining its force or function.', water: 'The water color changes.', neighbors: ['Manipulation', 'Enhancement'], users: [['Leorio Paradinight', 'Remote Punch'], ['Razor', '14 Devils']] },
];

const principles = [
  ['Ten', '纏', 'Contain aura around the body as a stable shroud.'],
  ['Zetsu', '絶', 'Suppress outward aura and presence while sacrificing aura defense.'],
  ['Ren', '練', 'Produce and sustain a larger quantity of aura.'],
  ['Hatsu', '発', 'Express aura through affinity, intent, training, and design.'],
];

const advanced = [
  ['Gyo', 'Concentrate aura in one area; the eyes can reveal concealed aura.'],
  ['In', 'Conceal aura or an aura construct without ending it.'],
  ['En', 'Expand a controlled aura field to detect intrusion and movement.'],
  ['Shu', 'Extend the aura shroud around an object.'],
  ['Ko', 'Concentrate almost all usable aura at one point.'],
  ['Ken', 'Maintain a powerful, even, full-body aura defense.'],
  ['Ryu', 'Redistribute aura percentages during combat.'],
];

function Portrait({ name, portraitItemFor }) {
  return <SourcePortrait item={portraitItemFor(name)} alt={`${name} portrait from Hunterpedia`} />;
}

function TypeNode({ item, active, onSelect, onOpenRecord, portraitItemFor }) {
  return <section className={`nen-reference-type is-${item.position}${active ? ' is-active' : ''}`} data-type={item.slug}>
    <button type="button" className="nen-reference-type__node" aria-pressed={active} onMouseEnter={() => onSelect(item.name)} onFocus={() => onSelect(item.name)} onClick={() => onSelect(item.name)}><i>{item.mark}</i><strong>{item.code}</strong><span>{item.name}</span></button>
    <div className="nen-reference-type__users">{item.users.map(([name, ability]) => <button type="button" onClick={() => onOpenRecord(name)} key={name}><Portrait name={name} portraitItemFor={portraitItemFor} /><span><strong>{name}</strong><small>{ability}</small></span></button>)}</div>
  </section>;
}

export default function NenSystemReferenceMap({ activeCategory = 'Enhancement', onSelectCategory, onOpenRecord, portraitItemFor }) {
  const selected = typeRecords.find((item) => item.name === activeCategory) || typeRecords[0];

  return <section className="nen-reference-sheet" aria-labelledby="nen-reference-title">
    <header className="nen-reference-sheet__title"><div><span>Fig. 01 · Hunter × Hunter reference project</span><h2 id="nen-reference-title">The complete<br />Nen system map</h2><p>The six categories and everything connected: aura control, affinities, advanced applications, conditions, curses, and the evidence needed to read an ability correctly.</p></div><div className="nen-reference-sheet__key" aria-label="Affinity key"><strong>Affinity guide</strong><span><i className="is-red" /> Natural type · 100%</span><span><i /> Adjacent · 80%</span><span><i /> Distant · 60%</span><span><i /> Opposite · 40%</span></div></header>

    <div className="nen-reference-sheet__body">
      <aside className="nen-reference-column is-left">
        <section className="nen-reference-panel"><header><i className="nen-reference-dot" /><h3>The four major principles</h3></header><ol>{principles.map(([name, mark, detail]) => <li key={name}><i>{mark}</i><span><strong>{name}</strong><p>{detail}</p></span></li>)}</ol></section>
        <section className="nen-reference-panel"><header><i className="nen-reference-dot" /><h3>Advanced techniques</h3></header><div className="nen-reference-techniques">{advanced.map(([name, detail]) => <button type="button" onClick={() => onOpenRecord(name)} key={name}><Eye size={15} aria-hidden="true" /><span><strong>{name}</strong><small>{detail}</small></span></button>)}</div></section>
        <section className="nen-reference-panel is-compact"><header><i className="nen-reference-dot" /><h3>Post-mortem Nen</h3></header><p>A powerful attachment, emotion, vow, or purpose may allow Nen to persist or intensify after death.</p></section>
        <section className="nen-reference-panel is-compact"><header><i className="nen-reference-dot" /><h3>Nen curses and exorcism</h3></header><p>Hostile Nen can remain attached to a target. Exorcism removes or transfers the effect, often under its own risks and conditions.</p></section>
      </aside>

      <div className="nen-reference-map" aria-label="Interactive complete Nen category map">
        <svg className="nen-reference-map__lines" viewBox="0 0 100 100" aria-hidden="true"><polygon points="50,9 85,29 85,71 50,91 15,71 15,29" /><polygon points="50,25 71,37 71,63 50,75 29,63 29,37" /><line x1="50" y1="50" x2="50" y2="9" /><line x1="50" y1="50" x2="85" y2="29" /><line x1="50" y1="50" x2="85" y2="71" /><line x1="50" y1="50" x2="50" y2="91" /><line x1="50" y1="50" x2="15" y2="71" /><line x1="50" y1="50" x2="15" y2="29" /></svg>
        <div className="nen-reference-map__center"><Sparkles size={21} aria-hidden="true" /><strong>Nen</strong><small>Complete system</small></div>
        <span className="nen-reference-percent is-top-left">80%</span><span className="nen-reference-percent is-top-right">80%</span><span className="nen-reference-percent is-right">60%</span><span className="nen-reference-percent is-bottom-right">80%</span><span className="nen-reference-percent is-bottom-left">80%</span><span className="nen-reference-percent is-left">60%</span>
        {typeRecords.map((item) => <TypeNode item={item} active={item.name === selected.name} onSelect={onSelectCategory} onOpenRecord={onOpenRecord} portraitItemFor={portraitItemFor} key={item.name} />)}
      </div>

      <aside className="nen-reference-column is-right">
        <section className="nen-reference-panel nen-reference-selected" data-type={selected.slug} aria-live="polite"><header><Droplets size={18} aria-hidden="true" /><h3>Water Divination</h3></header><div><Portrait name={selected.users[0][0]} portraitItemFor={portraitItemFor} /><span><small>{selected.code} · {selected.name}</small><strong>{selected.water}</strong><p>{selected.summary}</p></span></div><dl><div><dt>Adjacent</dt><dd>{selected.neighbors.join(' · ')}</dd></div><div><dt>Examples</dt><dd>{selected.users.map(([name]) => name).join(' · ')}</dd></div></dl><button type="button" onClick={() => onOpenRecord(selected.name)}>Open {selected.name} records <ArrowRight size={13} /></button></section>
        <section className="nen-reference-panel"><header><Link2 size={18} aria-hidden="true" /><h3>Conditions, restrictions, vows</h3></header><ul><li>Conditions define what must be true for an ability to work.</li><li>Restrictions reduce freedom in exchange for efficiency or power.</li><li>A vow is a binding promise carrying a meaningful consequence.</li><li>Greater risk can create greater effect, but does not erase affinity.</li></ul></section>
        <section className="nen-reference-panel"><header><Shield size={18} aria-hidden="true" /><h3>Rules of affinity</h3></header><ul><li>Natural category is the user’s strongest baseline.</li><li>Adjacent categories are normally easier to learn and use.</li><li>Efficiency falls with category distance.</li><li>Specialization does not follow the ordinary efficiency model.</li><li>Affinity is not the same as output, mastery, or intelligence.</li></ul></section>
        <section className="nen-reference-panel is-memo"><header><h3>Field memo</h3></header><p>Nen is simultaneously a physical discipline, a personal expression, and a rule system. Read every ability through effect, activation, conditions, range, cost, evidence, and unresolved behavior.</p></section>
      </aside>
    </div>

    <footer className="nen-reference-sheet__footer">
      <section><header><i className="nen-reference-dot" /><h3>The six types of Nen</h3></header><div>{typeRecords.map((item) => <button type="button" onClick={() => onSelectCategory(item.name)} className={selected.name === item.name ? 'is-active' : ''} key={item.name}><i>{item.mark}</i><span><strong>{item.name}</strong><small>{item.summary}</small></span></button>)}</div></section>
      <section><header><i className="nen-reference-dot" /><h3>Users between types</h3></header><p>Some users are placed between two categories in Togashi’s exhibition material. The placement indicates a relationship to both types; it should not be flattened into a separate seventh category.</p><div className="nen-reference-mini-map"><span>En</span><i /><span>Tr</span><i /><span>Co</span><i /><span>Sp</span><i /><span>Ma</span><i /><span>Em</span></div></section>
      <section><header><i className="nen-reference-dot" /><h3>Ability reading checklist</h3></header><ol><li>What changes?</li><li>What activates it?</li><li>What conditions persist?</li><li>What is its range and duration?</li><li>What does it cost or risk?</li><li>What is confirmed versus inferred?</li></ol></section>
    </footer>
  </section>;
}
