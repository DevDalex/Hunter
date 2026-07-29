import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Maximize2, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import SourcePortrait from './SourcePortrait';

const MAP_WIDTH = 2500;
const MAP_HEIGHT = 1450;
const MIN_SCALE = 0.34;
const MAX_SCALE = 2;
const VIEW_MARGIN = 8;
const PAN_STEP = 76;

const categories = [
  { key: 'category:enhancement', name: 'Enhancement', code: 'En', mark: '強', cx: 1250, cy: 240, water: 'Water volume changes', summary: 'Strengthen the body, aura, objects, or an existing quality.', users: [['Gon Freecss', 'Jajanken', 1040, 34], ['Uvogin', 'Big Bang Impact', 1260, 34]] },
  { key: 'category:transmutation', name: 'Transmutation', code: 'Tr', mark: '変', cx: 1630, cy: 470, water: 'Water taste changes', summary: 'Give aura the properties of another substance or phenomenon.', users: [['Killua Zoldyck', 'Godspeed', 1745, 382], ['Hisoka Morow', 'Bungee Gum', 1745, 482]] },
  { key: 'category:conjuration', name: 'Conjuration', code: 'Co', mark: '具', cx: 1630, cy: 930, water: 'Impurities appear', summary: 'Materialize an object, structure, creature, or rule-bearing construct.', users: [['Kurapika', 'Conjured chains', 1745, 872], ['Shizuku Murasaki', 'Blinky', 1745, 972]] },
  { key: 'category:specialization', name: 'Specialization', code: 'Sp', mark: '特', cx: 1250, cy: 1160, water: 'A unique change occurs', summary: 'Produce an exceptional effect outside the regular five categories.', users: [['Chrollo Lucilfer', 'Skill Hunter', 1040, 1284], ['Neon Nostrade', 'Lovely Ghostwriter', 1260, 1284]] },
  { key: 'category:manipulation', name: 'Manipulation', code: 'Ma', mark: '操', cx: 870, cy: 930, water: 'The leaf moves', summary: 'Control a person, object, creature, substance, or process.', users: [['Illumi Zoldyck', 'Needle People', 575, 872], ['Shalnark', 'Black Voice', 575, 972]] },
  { key: 'category:emission', name: 'Emission', code: 'Em', mark: '放', cx: 870, cy: 470, water: 'Water color changes', summary: 'Separate aura from the body while retaining its force or function.', users: [['Leorio Paradinight', 'Remote Punch', 575, 382], ['Razor', '14 Devils', 575, 482]] },
];

const foundationNodes = [
  { key: 'concept:life-energy', kind: 'concept', name: 'Life energy', mark: '生', x: 48, y: 72, w: 150, h: 66, summary: 'The living energy from which aura is expressed.' },
  { key: 'concept:aura', kind: 'concept', name: 'Aura', mark: '気', x: 228, y: 72, w: 150, h: 66, summary: 'Life energy released from the body and controlled through Nen.' },
  { key: 'concept:aura-nodes', kind: 'concept', name: 'Aura nodes', mark: '点', x: 408, y: 72, w: 166, h: 66, summary: 'Openings through which aura leaves the body.' },
  { key: 'nen', kind: 'core', name: 'Nen', eyebrow: 'Aura control', x: 610, y: 58, w: 192, h: 94, summary: 'The discipline of sensing, retaining, producing, shaping, and applying aura.' },
  { key: 'concept:ten', kind: 'principle', name: 'Ten', mark: '纏', x: 286, y: 235, w: 158, h: 68, summary: 'Keep aura around the body to reduce leakage and maintain a stable defensive layer.' },
  { key: 'concept:zetsu', kind: 'principle', name: 'Zetsu', mark: '絶', x: 472, y: 235, w: 158, h: 68, summary: 'Close aura nodes and suppress outward aura, trading defense for concealment and recovery.' },
  { key: 'concept:ren', kind: 'principle', name: 'Ren', mark: '練', x: 658, y: 235, w: 158, h: 68, summary: 'Produce and maintain a larger quantity of aura.' },
  { key: 'concept:hatsu', kind: 'center', name: 'Hatsu', eyebrow: 'Aura expression', x: 1110, y: 625, w: 280, h: 180, summary: 'Personal expression of aura through training, affinity, and developed effects.' },
];

const techniqueNodes = [
  { key: 'concept:gyo', kind: 'technique', name: 'Gyo', x: 58, y: 560, w: 148, h: 60, summary: 'Concentrate a larger share of aura in one body part, commonly the eyes.' },
  { key: 'concept:in', kind: 'technique', name: 'In', x: 246, y: 560, w: 148, h: 60, summary: 'Conceal the presence of aura while the aura itself remains active.' },
  { key: 'concept:en', kind: 'technique', name: 'En', x: 434, y: 560, w: 148, h: 60, summary: 'Extend aura around the body as a field for sensing intrusion and movement.' },
  { key: 'concept:shu', kind: 'technique', name: 'Shu', x: 58, y: 668, w: 148, h: 60, summary: 'Extend Ten around an external object.' },
  { key: 'concept:ken', kind: 'technique', name: 'Ken', x: 246, y: 668, w: 148, h: 60, summary: 'Sustain a strong defensive layer through Ten and Ren.' },
  { key: 'concept:ko', kind: 'technique', name: 'Ko', x: 434, y: 668, w: 148, h: 60, summary: 'Concentrate nearly all available aura into one point through several principles and Gyo.' },
  { key: 'concept:ryu', kind: 'technique', name: 'Ryu', x: 246, y: 786, w: 148, h: 60, summary: 'Redistribute offensive and defensive aura dynamically during combat.' },
];

const classifierNodes = [
  { key: 'concept:water-divination', kind: 'classifier', name: 'Water Divination', mark: '水', x: 1940, y: 306, w: 220, h: 70, summary: 'A practical test used to identify a person’s natural Nen category.' },
  { key: 'concept:category-affinity', kind: 'classifier', name: 'Category affinity', mark: '%', x: 2200, y: 306, w: 220, h: 70, summary: 'Natural type and category distance shape ease, efficiency, and training compatibility.' },
];

const abilityNodes = [
  { key: 'ability:design', kind: 'hub', name: 'Ability design', eyebrow: 'Hatsu engineering', x: 1990, y: 500, w: 250, h: 88, summary: 'A developed ability combines an intended effect with activation rules, targets, range, duration, costs, and counters.' },
  { key: 'ability:effect', kind: 'ability', name: 'Effect', x: 1840, y: 636, w: 148, h: 56 },
  { key: 'ability:activation', kind: 'ability', name: 'Activation', x: 2012, y: 636, w: 148, h: 56 },
  { key: 'ability:target', kind: 'ability', name: 'Target', x: 2184, y: 636, w: 148, h: 56 },
  { key: 'ability:medium', kind: 'ability', name: 'Medium', x: 1840, y: 714, w: 148, h: 56 },
  { key: 'ability:range', kind: 'ability', name: 'Range', x: 2012, y: 714, w: 148, h: 56 },
  { key: 'ability:duration', kind: 'ability', name: 'Duration', x: 2184, y: 714, w: 148, h: 56 },
  { key: 'ability:counterplay', kind: 'ability', name: 'Counterplay', x: 2012, y: 792, w: 148, h: 56 },
];

const ruleNodes = [
  { key: 'rule:condition', kind: 'rule', name: 'Condition', mark: '条', x: 1772, y: 902, w: 150, h: 62, summary: 'A requirement that must be satisfied for an effect to activate or continue.' },
  { key: 'rule:limitation', kind: 'rule', name: 'Limitation', mark: '限', x: 1950, y: 902, w: 150, h: 62, summary: 'A boundary placed on target, method, time, range, or use.' },
  { key: 'rule:risk-cost', kind: 'rule', name: 'Risk / cost', mark: '代', x: 2128, y: 902, w: 150, h: 62, summary: 'The harm, loss, exposure, or sacrifice attached to an ability.' },
  { key: 'rule:vow', kind: 'rule', name: 'Vow', mark: '誓', x: 2306, y: 902, w: 150, h: 62, summary: 'A serious self-imposed pledge whose consequences can reinforce an ability.' },
  { key: 'rule:reinforcement', kind: 'rule', name: 'Reinforcement', mark: '増', x: 2128, y: 1000, w: 150, h: 62, summary: 'Potential amplification created by meaningful restrictions, risk, and resolve.' },
];

const specialNodes = [
  { key: 'special:post-mortem', kind: 'special', name: 'Post-mortem Nen', mark: '死', x: 1746, y: 1120, w: 174, h: 64, summary: 'Aura or an ability can persist or intensify after the user’s death.' },
  { key: 'special:curses', kind: 'special', name: 'Nen curses', mark: '呪', x: 1942, y: 1120, w: 174, h: 64, summary: 'Persistent imposed aura or rules attached to a person, object, or condition.' },
  { key: 'special:exorcism', kind: 'special', name: 'Exorcism', mark: '祓', x: 2138, y: 1120, w: 174, h: 64, summary: 'Removal or transfer of imposed Nen, often with a consequence for the exorcist.' },
  { key: 'special:nen-beasts', kind: 'special', name: 'Nen beasts', mark: '獣', x: 1746, y: 1220, w: 174, h: 64, summary: 'Aura-based entities governed by a user, an autonomous rule, or a host system.' },
  { key: 'special:parasitic', kind: 'special', name: 'Parasitic Nen', mark: '寄', x: 1942, y: 1220, w: 174, h: 64, summary: 'A Nen system attached to a host that consumes aura or acts through autonomous rules.' },
  { key: 'special:collaborative', kind: 'special', name: 'Collaborative', mark: '協', x: 2138, y: 1220, w: 174, h: 64, summary: 'Multiple users combine roles, conditions, or aura into one system.' },
  { key: 'special:ownership', kind: 'special', name: 'Loaned · stolen · inherited', mark: '継', x: 1936, y: 1320, w: 382, h: 64, summary: 'Abilities can be transferred, borrowed, stolen, copied, or inherited under specific rules.' },
];

const categoryNodes = categories.flatMap((category) => [
  { ...category, kind: 'category', x: category.cx - 78, y: category.cy - 78, w: 156, h: 156 },
  ...category.users.map(([name, ability, x, y]) => ({ key: `user:${name}`, kind: 'user', name, ability, category: category.name, categoryKey: category.key, x, y, w: 192, h: 82, portraitName: name })),
]);

const rawNodes = [
  ...foundationNodes,
  ...techniqueNodes,
  ...categoryNodes,
  ...classifierNodes,
  ...abilityNodes,
  ...ruleNodes,
  ...specialNodes,
];

const ringPairs = categories.map((category, index) => [category.key, categories[(index + 1) % categories.length].key]);
const userEdges = categoryNodes.filter((node) => node.kind === 'user').map((node) => ({ id: `user:${node.categoryKey}:${node.key}`, from: node.categoryKey, to: node.key, type: 'user' }));
const spokeEdges = categories.map((category) => ({ id: `spoke:${category.key}`, from: 'concept:hatsu', to: category.key, type: 'spoke' }));

const graphEdges = [
  { id: 'life-aura', from: 'concept:life-energy', to: 'concept:aura', type: 'backbone' },
  { id: 'aura-nodes', from: 'concept:aura', to: 'concept:aura-nodes', type: 'backbone' },
  { id: 'nodes-nen', from: 'concept:aura-nodes', to: 'nen', type: 'backbone' },
  { id: 'nen-ten', from: 'nen', to: 'concept:ten', type: 'principle' },
  { id: 'nen-zetsu', from: 'nen', to: 'concept:zetsu', type: 'principle' },
  { id: 'nen-ren', from: 'nen', to: 'concept:ren', type: 'principle' },
  { id: 'nen-hatsu', from: 'nen', to: 'concept:hatsu', type: 'backbone', points: [[720, 188], [720, 354], [1010, 354], [1010, 715]] },
  { id: 'ren-gyo', from: 'concept:ren', to: 'concept:gyo', type: 'composition' },
  { id: 'zetsu-in', from: 'concept:zetsu', to: 'concept:in', type: 'composition' },
  { id: 'ren-en', from: 'concept:ren', to: 'concept:en', type: 'composition' },
  { id: 'ten-shu', from: 'concept:ten', to: 'concept:shu', type: 'composition' },
  { id: 'ten-ken', from: 'concept:ten', to: 'concept:ken', type: 'composition' },
  { id: 'ren-ken', from: 'concept:ren', to: 'concept:ken', type: 'composition' },
  { id: 'ten-ko', from: 'concept:ten', to: 'concept:ko', type: 'composition' },
  { id: 'zetsu-ko', from: 'concept:zetsu', to: 'concept:ko', type: 'composition' },
  { id: 'ren-ko', from: 'concept:ren', to: 'concept:ko', type: 'composition' },
  { id: 'hatsu-ko', from: 'concept:hatsu', to: 'concept:ko', type: 'composition', points: [[1010, 715], [660, 715]] },
  { id: 'gyo-ko', from: 'concept:gyo', to: 'concept:ko', type: 'composition' },
  { id: 'ken-ryu', from: 'concept:ken', to: 'concept:ryu', type: 'composition' },
  { id: 'gyo-ryu', from: 'concept:gyo', to: 'concept:ryu', type: 'composition' },
  { id: 'nen-water', from: 'nen', to: 'concept:water-divination', type: 'classifier', points: [[720, 188], [1840, 188], [1840, 341]] },
  { id: 'water-affinity', from: 'concept:water-divination', to: 'concept:category-affinity', type: 'classifier' },
  { id: 'affinity-hatsu', from: 'concept:category-affinity', to: 'concept:hatsu', type: 'classifier', points: [[2310, 410], [1880, 410], [1880, 715], [1390, 715]] },
  { id: 'hatsu-ability', from: 'concept:hatsu', to: 'ability:design', type: 'ability', points: [[1390, 715], [1810, 715], [1810, 544]] },
  { id: 'design-effect', from: 'ability:design', to: 'ability:effect', type: 'ability' },
  { id: 'design-activation', from: 'ability:design', to: 'ability:activation', type: 'ability' },
  { id: 'design-target', from: 'ability:design', to: 'ability:target', type: 'ability' },
  { id: 'design-medium', from: 'ability:design', to: 'ability:medium', type: 'ability' },
  { id: 'design-range', from: 'ability:design', to: 'ability:range', type: 'ability' },
  { id: 'design-duration', from: 'ability:design', to: 'ability:duration', type: 'ability' },
  { id: 'design-counterplay', from: 'ability:design', to: 'ability:counterplay', type: 'ability' },
  { id: 'design-condition', from: 'ability:design', to: 'rule:condition', type: 'rule', points: [[1810, 544], [1708, 544], [1708, 933]] },
  { id: 'condition-limitation', from: 'rule:condition', to: 'rule:limitation', type: 'rule' },
  { id: 'limitation-risk', from: 'rule:limitation', to: 'rule:risk-cost', type: 'rule' },
  { id: 'risk-vow', from: 'rule:risk-cost', to: 'rule:vow', type: 'rule' },
  { id: 'vow-reinforcement', from: 'rule:vow', to: 'rule:reinforcement', type: 'rule' },
  { id: 'risk-reinforcement', from: 'rule:risk-cost', to: 'rule:reinforcement', type: 'rule' },
  { id: 'design-post-mortem', from: 'ability:design', to: 'special:post-mortem', type: 'special', points: [[1810, 544], [1682, 544], [1682, 1152]] },
  { id: 'design-curses', from: 'ability:design', to: 'special:curses', type: 'special' },
  { id: 'curses-exorcism', from: 'special:curses', to: 'special:exorcism', type: 'special' },
  { id: 'design-beasts', from: 'ability:design', to: 'special:nen-beasts', type: 'special', points: [[1810, 544], [1648, 544], [1648, 1252]] },
  { id: 'beasts-parasitic', from: 'special:nen-beasts', to: 'special:parasitic', type: 'special' },
  { id: 'design-collaborative', from: 'ability:design', to: 'special:collaborative', type: 'special' },
  { id: 'design-ownership', from: 'ability:design', to: 'special:ownership', type: 'special' },
  ...spokeEdges,
  ...userEdges,
];

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const center = (node) => ({ x: node.x + node.w / 2, y: node.y + node.h / 2 });
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const midpoint = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
const fittedView = (viewport) => {
  if (!viewport.width || !viewport.height) return { x: 0, y: 0, scale: 1 };
  const scale = clamp(Math.min((viewport.width - VIEW_MARGIN * 2) / MAP_WIDTH, (viewport.height - VIEW_MARGIN * 2) / MAP_HEIGHT), MIN_SCALE, 1);
  return { scale, x: (viewport.width - MAP_WIDTH * scale) / 2, y: (viewport.height - MAP_HEIGHT * scale) / 2 };
};
const boundedView = (next, viewport) => {
  const scale = clamp(next.scale, MIN_SCALE, MAX_SCALE);
  const scaledWidth = MAP_WIDTH * scale;
  const scaledHeight = MAP_HEIGHT * scale;
  const fixedX = scaledWidth <= viewport.width ? (viewport.width - scaledWidth) / 2 : clamp(next.x, viewport.width - scaledWidth - VIEW_MARGIN, VIEW_MARGIN);
  const fixedY = scaledHeight <= viewport.height ? (viewport.height - scaledHeight) / 2 : clamp(next.y, viewport.height - scaledHeight - VIEW_MARGIN, VIEW_MARGIN);
  return { scale, x: fixedX, y: fixedY };
};
const edgePath = (edge, source, target) => {
  const start = center(source);
  const end = center(target);
  if (edge.points?.length) return [`M ${start.x} ${start.y}`, ...edge.points.map(([x, y]) => `L ${x} ${y}`), `L ${end.x} ${end.y}`].join(' ');
  if (Math.abs(start.x - end.x) >= Math.abs(start.y - end.y)) {
    const bend = (start.x + end.x) / 2;
    return `M ${start.x} ${start.y} H ${bend} V ${end.y} H ${end.x}`;
  }
  const bend = (start.y + end.y) / 2;
  return `M ${start.x} ${start.y} V ${bend} H ${end.x} V ${end.y}`;
};

function Portrait({ name, portraitItemFor }) {
  return <SourcePortrait item={portraitItemFor(name)} alt={`${name} portrait from Hunterpedia`} />;
}

function MapNode({ node, record, active, pinned, onPreview, onClear, onPin, portraitItemFor }) {
  const handlers = {
    onMouseEnter: () => onPreview(record),
    onMouseLeave: onClear,
    onFocus: () => onPreview(record),
    onBlur: onClear,
    onClick: () => onPin(record),
  };
  return <button type="button" className={`nen-pipe-node is-${node.kind}${active ? ' is-active' : ''}${pinned ? ' is-pinned' : ''}`} style={{ left: node.x, top: node.y, width: node.w, height: node.h }} aria-pressed={pinned} {...handlers}>
    {node.kind === 'user' && <Portrait name={node.portraitName} portraitItemFor={portraitItemFor} />}
    <span className="nen-pipe-node__copy">
      {node.mark && <i>{node.mark}</i>}
      {node.eyebrow && <small>{node.eyebrow}</small>}
      <strong>{node.name}</strong>
      {node.code && <em>{node.code} · {node.water}</em>}
      {node.ability && <em>{node.ability}</em>}
    </span>
  </button>;
}

export default function NenSystemReferenceMap({ records = [], portraitItemFor }) {
  const recordsByName = useMemo(() => new Map(records.map((record) => [record.name, record])), [records]);
  const enriched = useMemo(() => rawNodes.map((node) => {
    const source = recordsByName.get(node.name);
    return {
      ...node,
      record: {
        ...node,
        summary: source?.summary || node.summary || `${node.name} is connected to the wider Nen system.`,
        mechanics: source?.mechanics || [],
        study: source?.study || '',
        related: source?.related || [],
      },
    };
  }), [recordsByName]);
  const enrichedByKey = useMemo(() => new Map(enriched.map((node) => [node.key, node])), [enriched]);
  const incoming = useMemo(() => graphEdges.reduce((map, edge) => map.set(edge.to, [...(map.get(edge.to) || []), edge]), new Map()), []);
  const outgoing = useMemo(() => graphEdges.reduce((map, edge) => map.set(edge.from, [...(map.get(edge.from) || []), edge]), new Map()), []);
  const [hovered, setHovered] = useState(null);
  const [pinned, setPinned] = useState(null);
  const active = hovered || pinned;
  const inspected = active || enrichedByKey.get('nen')?.record;
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const [view, setView] = useState({ x: 0, y: 0, scale: 1 });
  const [dragging, setDragging] = useState(false);
  const viewportRef = useRef(null);
  const viewRef = useRef(view);
  const gestureRef = useRef({ pointers: new Map(), mode: null, startView: null, startPoint: null, startDistance: 0, startCenter: null, moved: false });
  const suppressClickUntilRef = useRef(0);
  const clearTimerRef = useRef(null);

  const activeGraph = useMemo(() => {
    const nodeKeys = new Set();
    const edgeIds = new Set();
    if (!active) return { nodeKeys, edgeIds };
    nodeKeys.add(active.key);

    const walkUpstream = (key, visited = new Set()) => {
      if (visited.has(key)) return;
      visited.add(key);
      (incoming.get(key) || []).forEach((edge) => {
        edgeIds.add(edge.id);
        nodeKeys.add(edge.from);
        if (edge.type !== 'user' && edge.type !== 'spoke') walkUpstream(edge.from, visited);
      });
    };
    walkUpstream(active.key);

    (outgoing.get(active.key) || []).forEach((edge) => {
      edgeIds.add(edge.id);
      nodeKeys.add(edge.to);
    });

    if (active.kind === 'category') {
      (outgoing.get(active.key) || []).filter((edge) => edge.type === 'user').forEach((edge) => {
        edgeIds.add(edge.id);
        nodeKeys.add(edge.to);
      });
    }

    return { nodeKeys, edgeIds };
  }, [active, incoming, outgoing]);

  const activeCategoryKey = active?.kind === 'category' ? active.key : active?.kind === 'user' ? active.categoryKey : null;
  const activeNode = active ? enrichedByKey.get(active.key) : null;

  useEffect(() => { viewRef.current = view; }, [view]);
  useEffect(() => () => window.clearTimeout(clearTimerRef.current), []);
  useLayoutEffect(() => {
    const element = viewportRef.current;
    if (!element) return undefined;
    const update = () => {
      const rect = element.getBoundingClientRect();
      setViewportSize({ width: rect.width, height: rect.height });
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  useLayoutEffect(() => {
    if (viewportSize.width && viewportSize.height) setView(fittedView(viewportSize));
  }, [viewportSize.width, viewportSize.height]);

  const updateView = useCallback((updater) => setView((current) => boundedView(typeof updater === 'function' ? updater(current) : updater, viewportSize)), [viewportSize]);
  const zoomAt = useCallback((nextScale, point = { x: viewportSize.width / 2, y: viewportSize.height / 2 }) => updateView((current) => {
    const scale = clamp(nextScale, MIN_SCALE, MAX_SCALE);
    const mapX = (point.x - current.x) / current.scale;
    const mapY = (point.y - current.y) / current.scale;
    return { scale, x: point.x - mapX * scale, y: point.y - mapY * scale };
  }), [updateView, viewportSize]);
  const fitAll = useCallback(() => setView(fittedView(viewportSize)), [viewportSize]);
  const resetView = useCallback(() => setView(boundedView({ scale: 1, x: (viewportSize.width - MAP_WIDTH) / 2, y: VIEW_MARGIN }, viewportSize)), [viewportSize]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return undefined;
    const onWheel = (event) => {
      if (event.target.closest?.('.nen-pipe-inspector,.nen-pipe-controls')) return;
      event.preventDefault();
      const rect = viewport.getBoundingClientRect();
      zoomAt(viewRef.current.scale * Math.exp(-event.deltaY * .0015), { x: event.clientX - rect.left, y: event.clientY - rect.top });
    };
    viewport.addEventListener('wheel', onWheel, { passive: false });
    return () => viewport.removeEventListener('wheel', onWheel);
  }, [zoomAt]);

  const pointerPoint = (event) => {
    const rect = viewportRef.current?.getBoundingClientRect();
    return { x: event.clientX - (rect?.left || 0), y: event.clientY - (rect?.top || 0) };
  };
  const pointerDown = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    const point = pointerPoint(event);
    const interactive = Boolean(event.target.closest?.('button,a,.nen-pipe-inspector,.nen-pipe-controls'));
    const gesture = gestureRef.current;
    gesture.pointers.set(event.pointerId, { point, interactive });
    if (gesture.pointers.size === 1 && !interactive) {
      gesture.mode = 'pan';
      gesture.startPoint = point;
      gesture.startView = viewRef.current;
      gesture.moved = false;
      event.currentTarget.setPointerCapture?.(event.pointerId);
    } else if (gesture.pointers.size === 2) {
      const [a, b] = [...gesture.pointers.values()].map((entry) => entry.point);
      gesture.mode = 'pinch';
      gesture.startDistance = Math.max(1, distance(a, b));
      gesture.startCenter = midpoint(a, b);
      gesture.startView = viewRef.current;
      gesture.moved = false;
    }
  };
  const pointerMove = (event) => {
    const gesture = gestureRef.current;
    const entry = gesture.pointers.get(event.pointerId);
    if (!entry) return;
    const point = pointerPoint(event);
    gesture.pointers.set(event.pointerId, { ...entry, point });
    if (gesture.mode === 'pinch' && gesture.pointers.size >= 2) {
      const [a, b] = [...gesture.pointers.values()].slice(0, 2).map((item) => item.point);
      const nextCenter = midpoint(a, b);
      const scale = clamp(gesture.startView.scale * (distance(a, b) / gesture.startDistance), MIN_SCALE, MAX_SCALE);
      const mapX = (gesture.startCenter.x - gesture.startView.x) / gesture.startView.scale;
      const mapY = (gesture.startCenter.y - gesture.startView.y) / gesture.startView.scale;
      gesture.moved = true;
      setDragging(true);
      setView(boundedView({ scale, x: nextCenter.x - mapX * scale, y: nextCenter.y - mapY * scale }, viewportSize));
      event.preventDefault();
    } else if (gesture.mode === 'pan') {
      const dx = point.x - gesture.startPoint.x;
      const dy = point.y - gesture.startPoint.y;
      if (Math.abs(dx) + Math.abs(dy) > 3) {
        gesture.moved = true;
        setDragging(true);
      }
      setView(boundedView({ ...gesture.startView, x: gesture.startView.x + dx, y: gesture.startView.y + dy }, viewportSize));
      event.preventDefault();
    }
  };
  const pointerEnd = (event) => {
    const gesture = gestureRef.current;
    const moved = gesture.moved;
    gesture.pointers.delete(event.pointerId);
    if (!gesture.pointers.size) {
      gesture.mode = null;
      gesture.moved = false;
      setDragging(false);
      if (moved) suppressClickUntilRef.current = performance.now() + 160;
    }
    try { event.currentTarget.releasePointerCapture?.(event.pointerId); } catch { /* already released */ }
  };
  const keyDown = (event) => {
    if (event.target !== event.currentTarget) return;
    if (event.key === 'ArrowLeft') updateView((current) => ({ ...current, x: current.x + PAN_STEP }));
    else if (event.key === 'ArrowRight') updateView((current) => ({ ...current, x: current.x - PAN_STEP }));
    else if (event.key === 'ArrowUp') updateView((current) => ({ ...current, y: current.y + PAN_STEP }));
    else if (event.key === 'ArrowDown') updateView((current) => ({ ...current, y: current.y - PAN_STEP }));
    else if (event.key === '+' || event.key === '=') zoomAt(viewRef.current.scale * 1.18);
    else if (event.key === '-') zoomAt(viewRef.current.scale / 1.18);
    else if (event.key === '0') fitAll();
    else if (event.key.toLowerCase() === 'r') resetView();
    else return;
    event.preventDefault();
  };

  const preview = (record) => {
    window.clearTimeout(clearTimerRef.current);
    setHovered(record);
  };
  const clearPreview = () => {
    window.clearTimeout(clearTimerRef.current);
    clearTimerRef.current = window.setTimeout(() => setHovered(null), 90);
  };
  const pin = (record) => setPinned((current) => current?.key === record.key ? null : record);
  const relatedNodes = (inspected?.related || []).map((name) => enriched.find((node) => node.name === name)).filter(Boolean).slice(0, 5);
  const inspectorX = 2050;
  const inspectorY = 34;
  const inspectorAnchor = { x: inspectorX, y: inspectorY + 122 };
  const inspectorPath = activeNode ? edgePath({ points: [[Math.max(center(activeNode).x + 70, 1900), center(activeNode).y], [1900, inspectorAnchor.y]] }, activeNode, { x: inspectorAnchor.x, y: inspectorAnchor.y, w: 0, h: 0 }) : null;

  return <section className={`nen-pipe-map${active ? ' has-active' : ''}`} aria-label="Interactive Nen system pipeline map" onKeyDown={(event) => {
    if (event.key === 'Escape') {
      setPinned(null);
      setHovered(null);
    }
  }}>
    <div ref={viewportRef} className={`nen-pipe-viewport${dragging ? ' is-dragging' : ''}`} tabIndex="0" aria-label="Pan and zoom the complete Nen map. Use arrows to pan, plus and minus to zoom, zero to fit, and R to reset." onKeyDown={keyDown} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerEnd} onPointerCancel={pointerEnd} onClickCapture={(event) => {
      if (performance.now() < suppressClickUntilRef.current) {
        event.preventDefault();
        event.stopPropagation();
      }
    }}>
      <div className="nen-pipe-canvas" style={{ width: MAP_WIDTH, height: MAP_HEIGHT, transform: `translate3d(${view.x}px,${view.y}px,0) scale(${view.scale})` }}>
        <svg className="nen-pipe-connectors" viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} fill="none" aria-hidden="true">
          {ringPairs.map(([fromKey, toKey]) => {
            const from = enrichedByKey.get(fromKey);
            const to = enrichedByKey.get(toKey);
            const a = center(from);
            const b = center(to);
            const activeRing = activeCategoryKey && (activeCategoryKey === fromKey || activeCategoryKey === toKey);
            return <g key={`${fromKey}-${toKey}`} className={activeRing ? 'is-active-ring' : ''}>
              <path className="is-ring-under" d={`M ${a.x} ${a.y} L ${b.x} ${b.y}`} />
              <path className="is-ring" d={`M ${a.x} ${a.y} L ${b.x} ${b.y}`} />
              {[0.24, 0.5, 0.76].map((ratio, index) => <circle key={ratio} className={index === 1 ? 'is-halfway' : ''} cx={a.x + (b.x - a.x) * ratio} cy={a.y + (b.y - a.y) * ratio} r={index === 1 ? 8 : 6} />)}
            </g>;
          })}
          {graphEdges.map((edge) => {
            const from = enrichedByKey.get(edge.from);
            const to = enrichedByKey.get(edge.to);
            if (!from || !to) return null;
            return <path key={edge.id} className={`is-graph-edge is-${edge.type}${activeGraph.edgeIds.has(edge.id) ? ' is-active' : ''}`} d={edgePath(edge, from, to)} />;
          })}
          {inspectorPath && <path className="is-inspector-link is-active" d={inspectorPath} />}
          {active && <circle className="is-inspector-junction" cx={inspectorAnchor.x} cy={inspectorAnchor.y} r="7" />}
        </svg>
        {enriched.map((node) => <MapNode key={node.key} node={node} record={node.record} active={activeGraph.nodeKeys.has(node.key)} pinned={pinned?.key === node.key} onPreview={preview} onClear={clearPreview} onPin={pin} portraitItemFor={portraitItemFor} />)}
        <aside className={`nen-pipe-inspector${pinned?.key === inspected?.key ? ' is-pinned' : ''}`} style={{ left: inspectorX, top: inspectorY }} onMouseEnter={() => window.clearTimeout(clearTimerRef.current)} onMouseLeave={clearPreview} aria-live="polite">
          <header>
            <span>{inspected?.eyebrow || inspected?.kind?.replaceAll('-', ' ')}</span>
            <h2>{inspected?.name}</h2>
            {pinned?.key === inspected?.key && <button type="button" onClick={() => setPinned(null)}>Unpin</button>}
          </header>
          <p>{inspected?.summary}</p>
          {inspected?.water && <dl><div><dt>Water Divination</dt><dd>{inspected.water}</dd></div><div><dt>Affinity code</dt><dd>{inspected.code}</dd></div></dl>}
          {inspected?.ability && <dl><div><dt>Ability</dt><dd>{inspected.ability}</dd></div><div><dt>Category</dt><dd>{inspected.category}</dd></div></dl>}
          {inspected?.mechanics?.length > 0 && <section><h3>Mechanics</h3><ul>{inspected.mechanics.slice(0, 3).map((item) => <li key={item}>{item}</li>)}</ul></section>}
          {inspected?.study && <section><h3>Reading note</h3><p>{inspected.study}</p></section>}
          {relatedNodes.length > 0 && <section><h3>Connected records</h3><div>{relatedNodes.map((node) => <button type="button" onClick={() => setPinned(node.record)} key={node.key}>{node.name}</button>)}</div></section>}
        </aside>
      </div>
      <div className="nen-pipe-controls" role="group" aria-label="Map controls">
        <button type="button" onClick={() => zoomAt(viewRef.current.scale * 1.2)} aria-label="Zoom in"><ZoomIn size={18} /></button>
        <button type="button" onClick={() => zoomAt(viewRef.current.scale / 1.2)} aria-label="Zoom out"><ZoomOut size={18} /></button>
        <button type="button" onClick={fitAll} aria-label="Fit entire map"><Maximize2 size={18} /></button>
        <button type="button" onClick={resetView} aria-label="Reset to one hundred percent"><RotateCcw size={18} /></button>
        <output aria-live="polite">{Math.round(view.scale * 100)}%</output>
      </div>
    </div>
  </section>;
}
