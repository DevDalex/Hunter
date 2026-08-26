import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Maximize2, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import SourcePortrait from './SourcePortrait';
import {
  categoryMeta,
  namedAbilityProfiles,
  nenCategoryOrder,
  primaryCategoryUsers,
  secondaryPureUsers,
  spectrumPlacements,
} from '../data/nenSpectrumExpansion';

const MAP_WIDTH = 2300;
const MAP_HEIGHT = 1320;
const MIN_SCALE = 0.36;
const MAX_SCALE = 2;
const FIT_MAX_SCALE = 1;
const VIEW_MARGIN = 18;
const CONTENT_PADDING = 42;
const PAN_STEP = 76;
const INSPECTOR_RECT = { x: 1950, y: 32, w: 314, h: 310 };
const HATSU_CENTER = { x: 1040, y: 571 };

const categories = nenCategoryOrder.map((key) => ({ key, ...categoryMeta[key] }));
const categoryByKey = new Map(categories.map((category) => [category.key, category]));

const foundationNodes = [
  { key: 'concept:life-energy', kind: 'concept', name: 'Life energy', mark: '生', x: 44, y: 56, w: 126, h: 58, summary: 'The living energy from which aura is expressed.' },
  { key: 'concept:aura', kind: 'concept', name: 'Aura', mark: '気', x: 190, y: 56, w: 126, h: 58, summary: 'Life energy released from the body and controlled through Nen.' },
  { key: 'concept:aura-nodes', kind: 'concept', name: 'Aura nodes', mark: '点', x: 336, y: 56, w: 146, h: 58, summary: 'Openings through which aura leaves the body.' },
  { key: 'concept:awakening', kind: 'concept', name: 'Awakening / initiation', mark: '開', x: 336, y: 132, w: 180, h: 58, summary: 'Aura nodes may open through training, natural development, or forceful initiation.' },
  { key: 'nen', kind: 'core', name: 'Nen', eyebrow: 'Aura control', x: 715, y: 40, w: 200, h: 88, summary: 'The discipline of sensing, retaining, producing, shaping, and applying aura.' },
  { key: 'concept:ten', kind: 'principle', name: 'Ten', mark: '纏', x: 556, y: 194, w: 144, h: 64, summary: 'Keep aura around the body to reduce leakage and maintain a stable defensive layer.' },
  { key: 'concept:zetsu', kind: 'principle', name: 'Zetsu', mark: '絶', x: 724, y: 194, w: 144, h: 64, summary: 'Close aura nodes and suppress outward aura, trading defense for concealment and recovery.' },
  { key: 'concept:ren', kind: 'principle', name: 'Ren', mark: '練', x: 892, y: 194, w: 144, h: 64, summary: 'Produce and maintain a larger quantity of aura.' },
  { key: 'concept:hatsu', kind: 'center', name: 'Hatsu', eyebrow: 'Fourth major principle · aura expression', x: 930, y: 500, w: 220, h: 142, summary: 'The personal expression and release of aura through a user’s nature, training, categories, and developed effects.' },
];

const techniqueNodes = [
  { key: 'concept:gyo', kind: 'technique', name: 'Gyo', x: 50, y: 404, w: 138, h: 58, summary: 'Concentrate a larger share of aura in one body part, commonly the eyes.' },
  { key: 'concept:in', kind: 'technique', name: 'In', x: 218, y: 404, w: 138, h: 58, summary: 'Conceal the presence of aura while the aura itself remains active.' },
  { key: 'concept:en', kind: 'technique', name: 'En', x: 386, y: 404, w: 138, h: 58, summary: 'Extend aura around the body as a field for sensing intrusion and movement.' },
  { key: 'concept:shu', kind: 'technique', name: 'Shu', x: 50, y: 536, w: 138, h: 58, summary: 'Extend Ten around an external object.' },
  { key: 'concept:ken', kind: 'technique', name: 'Ken', x: 218, y: 536, w: 138, h: 58, summary: 'Sustain a strong defensive layer through Ten and Ren.' },
  { key: 'concept:ko', kind: 'technique', name: 'Ko', x: 386, y: 536, w: 138, h: 58, summary: 'Concentrate nearly all available aura into one point through several principles and Gyo.' },
  { key: 'concept:ryu', kind: 'technique', name: 'Ryu', x: 218, y: 688, w: 138, h: 58, summary: 'Redistribute offensive and defensive aura dynamically during combat.' },
];

const classifierNodes = [
  { key: 'concept:water-divination', kind: 'classifier', name: 'Water Divination', mark: '水', x: 1472, y: 188, w: 174, h: 62, summary: 'A practical test used to identify a person’s natural Nen category.' },
  { key: 'concept:category-affinity', kind: 'classifier', name: 'Category affinity', mark: '%', x: 1668, y: 188, w: 174, h: 62, summary: 'Natural type and category distance shape ease, efficiency, and training compatibility.' },
];

const abilitySystemNodes = [
  { key: 'ability:developed', kind: 'terminal', name: 'Developed ability', eyebrow: 'Hatsu output', x: 1510, y: 492, w: 174, h: 62, summary: 'A named ability is one developed use of Hatsu rather than a synonym for Hatsu itself.' },
  { key: 'ability:design', kind: 'hub', name: 'Ability design', eyebrow: 'Hatsu engineering', x: 1734, y: 484, w: 214, h: 80, summary: 'A developed ability combines an intended effect with activation rules, targets, range, duration, costs, category use, and counters.' },
  { key: 'ability:effect', kind: 'ability', name: 'Effect', x: 1560, y: 622, w: 142, h: 54 },
  { key: 'ability:activation', kind: 'ability', name: 'Activation', x: 1722, y: 622, w: 142, h: 54 },
  { key: 'ability:target', kind: 'ability', name: 'Target', x: 1884, y: 622, w: 142, h: 54 },
  { key: 'ability:medium', kind: 'ability', name: 'Medium', x: 1560, y: 696, w: 142, h: 54 },
  { key: 'ability:range', kind: 'ability', name: 'Range', x: 1722, y: 696, w: 142, h: 54 },
  { key: 'ability:duration', kind: 'ability', name: 'Duration', x: 1884, y: 696, w: 142, h: 54 },
  { key: 'ability:category-mix', kind: 'ability', name: 'Category mix', x: 1640, y: 770, w: 142, h: 54, summary: 'A developed ability may combine a natural category with one or more supporting categories.' },
  { key: 'ability:counterplay', kind: 'ability', name: 'Counterplay', x: 1802, y: 770, w: 142, h: 54 },
];

const ruleNodes = [
  { key: 'rule:condition', kind: 'rule', name: 'Condition', mark: '条', x: 1470, y: 844, w: 148, h: 58, summary: 'A requirement that must be satisfied for an effect to activate or continue.' },
  { key: 'rule:limitation', kind: 'rule', name: 'Limitation', mark: '限', x: 1638, y: 844, w: 148, h: 58, summary: 'A boundary placed on target, method, time, range, or use.' },
  { key: 'rule:risk-cost', kind: 'rule', name: 'Risk / cost', mark: '代', x: 1806, y: 844, w: 148, h: 58, summary: 'The harm, loss, exposure, or sacrifice attached to an ability.' },
  { key: 'rule:vow', kind: 'rule', name: 'Vow', mark: '誓', x: 1974, y: 844, w: 148, h: 58, summary: 'A serious self-imposed pledge whose consequences can reinforce an ability.' },
  { key: 'rule:reinforcement', kind: 'rule', name: 'Potential reinforcement', mark: '増', x: 1806, y: 922, w: 182, h: 58, summary: 'Meaningful restrictions, credible consequences, and resolve can strengthen an ability.' },
];

const specialNodes = [
  { key: 'special:persistence-hub', kind: 'special-hub', name: 'Persistence', x: 1438, y: 988, w: 150, h: 52 },
  { key: 'special:post-mortem', kind: 'special', name: 'Post-mortem Nen', mark: '死', x: 1438, y: 1058, w: 158, h: 58, summary: 'Aura or an ability can persist or intensify after the user’s death.' },
  { key: 'special:imposed-hub', kind: 'special-hub', name: 'Imposed systems', x: 1610, y: 988, w: 150, h: 52 },
  { key: 'special:curses', kind: 'special', name: 'Nen curses', mark: '呪', x: 1610, y: 1058, w: 150, h: 58, summary: 'Persistent imposed aura or rules attached to a person, object, or condition.' },
  { key: 'special:exorcism', kind: 'special', name: 'Exorcism', mark: '祓', x: 1780, y: 1058, w: 150, h: 58, summary: 'Removal or transfer of imposed Nen, often with a consequence for the exorcist.' },
  { key: 'special:entities-hub', kind: 'special-hub', name: 'Aura entities', x: 1438, y: 1132, w: 150, h: 52 },
  { key: 'special:nen-beasts', kind: 'special', name: 'Nen beasts', mark: '獣', x: 1438, y: 1200, w: 150, h: 58, summary: 'Aura-based entities governed by a user, an autonomous rule, or a host system.' },
  { key: 'special:parasitic', kind: 'special', name: 'Parasitic Nen', mark: '寄', x: 1608, y: 1200, w: 150, h: 58, summary: 'A host-dependent Nen system that consumes aura or acts through autonomous rules.' },
  { key: 'special:multi-user-hub', kind: 'special-hub', name: 'Multi-user systems', x: 1780, y: 1132, w: 150, h: 52 },
  { key: 'special:collaborative', kind: 'special', name: 'Collaborative', mark: '協', x: 1780, y: 1200, w: 150, h: 58, summary: 'Multiple users combine roles, conditions, or aura into one system.' },
  { key: 'special:ownership-hub', kind: 'special-hub', name: 'Ability ownership', x: 1950, y: 1132, w: 164, h: 52 },
  { key: 'special:ownership', kind: 'special', name: 'Loaned · stolen · inherited', mark: '継', x: 1950, y: 1200, w: 210, h: 58, summary: 'Abilities can be transferred, borrowed, stolen, copied, or inherited under specific rules.' },
];

const junctionNodes = [
  { key: 'junction:principles', kind: 'junction', x: 880, y: 158, w: 0, h: 0 },
  { key: 'junction:hatsu-feed', kind: 'junction', x: 1040, y: 314, w: 0, h: 0 },
  { key: 'junction:ken', kind: 'junction', x: 287, y: 510, w: 0, h: 0 },
  { key: 'junction:ko', kind: 'junction', x: 470, y: 510, w: 0, h: 0 },
  { key: 'junction:ryu', kind: 'junction', x: 287, y: 662, w: 0, h: 0 },
  { key: 'junction:ability-fields', kind: 'junction', x: 1841, y: 594, w: 0, h: 0 },
  { key: 'junction:special-bus', kind: 'junction', x: 2074, y: 956, w: 0, h: 0 },
];

const categoryNodes = categories.map((category) => ({ ...category, kind: 'category', x: category.cx - 84, y: category.cy - 74, w: 168, h: 148 }));
const primaryUserNodes = categories.flatMap((category) => (primaryCategoryUsers[category.key] || []).map((user) => ({
  key: `user:${user.name}`, kind: 'user', name: user.name, ability: user.ability, category: category.name,
  categoryKey: category.key, x: user.x, y: user.y, w: 188, h: 82, portraitName: user.name,
})));
const detailsNode = { key: 'terminal:details', kind: 'terminal', name: 'Details', x: 1856, y: 144, w: 74, h: 44, summary: 'The inspector previews and pins records from the active map path.' };
const baseNodes = [...foundationNodes, ...techniqueNodes, ...categoryNodes, ...primaryUserNodes, ...classifierNodes, ...abilitySystemNodes, ...ruleNodes, ...specialNodes, detailsNode, ...junctionNodes];
const ringPairs = categories.map((category, index) => [category.key, categories[(index + 1) % categories.length].key]);

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const center = (node) => ({ x: node.x + node.w / 2, y: node.y + node.h / 2 });
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const midpoint = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
const unit = (x, y) => { const length = Math.hypot(x, y) || 1; return { x: x / length, y: y / length }; };
const port = (node, requested = 'center') => {
  if (!node || node.kind === 'junction' || node.kind === 'placement-anchor') return { x: node?.x || 0, y: node?.y || 0 };
  const side = typeof requested === 'string' ? requested : requested.side;
  const ratio = typeof requested === 'string' ? .5 : requested.ratio ?? .5;
  if (side === 'left') return { x: node.x, y: node.y + node.h * ratio };
  if (side === 'right') return { x: node.x + node.w, y: node.y + node.h * ratio };
  if (side === 'top') return { x: node.x + node.w * ratio, y: node.y };
  if (side === 'bottom') return { x: node.x + node.w * ratio, y: node.y + node.h };
  return center(node);
};
const edgePath = (edge, source, target) => {
  const start = port(source, edge.fromPort);
  const end = port(target, edge.toPort);
  if (edge.points?.length) return [`M ${start.x} ${start.y}`, ...edge.points.map(([x, y]) => `L ${x} ${y}`), `L ${end.x} ${end.y}`].join(' ');
  if (edge.direct) return `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
  if (Math.abs(start.x - end.x) >= Math.abs(start.y - end.y)) {
    const bend = (start.x + end.x) / 2;
    return `M ${start.x} ${start.y} H ${bend} V ${end.y} H ${end.x}`;
  }
  const bend = (start.y + end.y) / 2;
  return `M ${start.x} ${start.y} V ${bend} H ${end.x} V ${end.y}`;
};

const placementGeometry = spectrumPlacements.map((placement) => {
  const from = categoryByKey.get(placement.from);
  const to = categoryByKey.get(placement.to);
  const dx = to.cx - from.cx;
  const dy = to.cy - from.cy;
  const tangent = unit(dx, dy);
  let normal = { x: -tangent.y, y: tangent.x };
  const base = { x: from.cx + dx * placement.t, y: from.cy + dy * placement.t };
  const outward = { x: base.x - HATSU_CENTER.x, y: base.y - HATSU_CENTER.y };
  if (normal.x * outward.x + normal.y * outward.y < 0) normal = { x: -normal.x, y: -normal.y };
  const marker = { x: base.x + normal.x * placement.lane * 10, y: base.y + normal.y * placement.lane * 10 };
  return { ...placement, tangent, normal, base, marker, key: `placement:${placement.id}`, kind: 'placement' };
});

const primaryUserEdges = primaryUserNodes.map((node) => {
  const category = categoryByKey.get(node.categoryKey);
  const horizontal = Math.abs(node.x + node.w / 2 - category.cx) > Math.abs(node.y + node.h / 2 - category.cy);
  const fromPort = horizontal ? (node.x > category.cx ? 'right' : 'left') : (node.y > category.cy ? 'bottom' : 'top');
  const toPort = horizontal ? (node.x > category.cx ? 'left' : 'right') : (node.y > category.cy ? 'top' : 'bottom');
  return { id: `primary:${node.categoryKey}:${node.key}`, from: node.categoryKey, to: node.key, type: 'user', fromPort, toPort };
});
const spokeEdges = categories.map((category) => ({ id: `spoke:${category.key}`, from: 'concept:hatsu', to: category.key, type: 'spoke', direct: true }));

const baseEdges = [
  { id: 'life-aura', from: 'concept:life-energy', to: 'concept:aura', type: 'backbone', fromPort: 'right', toPort: 'left' },
  { id: 'aura-nodes', from: 'concept:aura', to: 'concept:aura-nodes', type: 'backbone', fromPort: 'right', toPort: 'left' },
  { id: 'nodes-nen', from: 'concept:aura-nodes', to: 'nen', type: 'backbone', fromPort: 'right', toPort: 'left', points: [[522, 85], [522, 84]] },
  { id: 'nodes-awakening', from: 'concept:aura-nodes', to: 'concept:awakening', type: 'modifier', fromPort: 'bottom', toPort: 'top' },
  { id: 'nen-principles', from: 'nen', to: 'junction:principles', type: 'backbone', fromPort: 'bottom' },
  { id: 'principles-ten', from: 'junction:principles', to: 'concept:ten', type: 'principle', points: [[880, 174], [628, 174]], toPort: 'top' },
  { id: 'principles-zetsu', from: 'junction:principles', to: 'concept:zetsu', type: 'principle', points: [[880, 174], [796, 174]], toPort: 'top' },
  { id: 'principles-ren', from: 'junction:principles', to: 'concept:ren', type: 'principle', points: [[880, 174], [964, 174]], toPort: 'top' },
  { id: 'principles-hatsu-feed', from: 'junction:principles', to: 'junction:hatsu-feed', type: 'principle', points: [[880, 174], [1040, 174]] },
  { id: 'hatsu-feed-hatsu', from: 'junction:hatsu-feed', to: 'concept:hatsu', type: 'backbone', toPort: 'top' },
  { id: 'ren-gyo', from: 'concept:ren', to: 'concept:gyo', type: 'composition', fromPort: 'bottom', toPort: 'top', points: [[964, 344], [119, 344]] },
  { id: 'hatsu-in', from: 'junction:hatsu-feed', to: 'concept:in', type: 'composition', toPort: 'top', points: [[1040, 364], [287, 364]] },
  { id: 'gyo-in-counter', from: 'concept:gyo', to: 'concept:in', type: 'counter', fromPort: 'right', toPort: 'left', label: 'common counter', labelAt: [203, 395] },
  { id: 'ren-en', from: 'concept:ren', to: 'concept:en', type: 'composition', fromPort: 'bottom', toPort: 'top', points: [[964, 382], [455, 382]] },
  { id: 'ten-shu', from: 'concept:ten', to: 'concept:shu', type: 'composition', fromPort: 'bottom', toPort: 'top', points: [[628, 322], [119, 322]] },
  { id: 'ten-ken', from: 'concept:ten', to: 'junction:ken', type: 'composition', fromPort: 'bottom', points: [[628, 302], [287, 302]] },
  { id: 'ren-ken', from: 'concept:ren', to: 'junction:ken', type: 'composition', fromPort: 'bottom', points: [[964, 326], [307, 326], [307, 510]] },
  { id: 'junction-ken', from: 'junction:ken', to: 'concept:ken', type: 'composition', toPort: 'top' },
  { id: 'ten-ko', from: 'concept:ten', to: 'junction:ko', type: 'composition', fromPort: 'bottom', points: [[628, 286], [490, 286], [490, 510]] },
  { id: 'zetsu-ko', from: 'concept:zetsu', to: 'junction:ko', type: 'composition', fromPort: 'bottom', points: [[796, 306], [510, 306], [510, 510]] },
  { id: 'ren-ko', from: 'concept:ren', to: 'junction:ko', type: 'composition', fromPort: 'bottom', points: [[964, 326], [530, 326], [530, 510]] },
  { id: 'hatsu-ko', from: 'junction:hatsu-feed', to: 'junction:ko', type: 'composition', points: [[1040, 344], [550, 344], [550, 510]] },
  { id: 'gyo-ko', from: 'concept:gyo', to: 'junction:ko', type: 'composition', fromPort: 'bottom', points: [[119, 490], [470, 490]] },
  { id: 'junction-ko', from: 'junction:ko', to: 'concept:ko', type: 'composition', toPort: 'top' },
  { id: 'gyo-ryu', from: 'concept:gyo', to: 'junction:ryu', type: 'composition', fromPort: 'bottom', points: [[119, 642], [287, 642]] },
  { id: 'ken-ryu', from: 'concept:ken', to: 'junction:ryu', type: 'composition', fromPort: 'bottom' },
  { id: 'ko-ryu', from: 'concept:ko', to: 'junction:ryu', type: 'composition', fromPort: 'bottom', points: [[455, 642], [287, 642]] },
  { id: 'junction-ryu', from: 'junction:ryu', to: 'concept:ryu', type: 'composition', toPort: 'top' },
  { id: 'hatsu-water', from: 'junction:hatsu-feed', to: 'concept:water-divination', type: 'classifier', points: [[1040, 144], [1559, 144]], toPort: 'top' },
  { id: 'water-affinity', from: 'concept:water-divination', to: 'concept:category-affinity', type: 'classifier', fromPort: 'right', toPort: 'left' },
  { id: 'hatsu-developed', from: 'junction:hatsu-feed', to: 'ability:developed', type: 'ability', points: [[1040, 128], [1597, 128], [1597, 492]], toPort: 'top' },
  { id: 'developed-design', from: 'ability:developed', to: 'ability:design', type: 'ability', fromPort: 'right', toPort: 'left' },
  { id: 'design-field-manifold', from: 'ability:design', to: 'junction:ability-fields', type: 'ability', fromPort: 'bottom' },
  { id: 'field-effect', from: 'junction:ability-fields', to: 'ability:effect', type: 'ability', toPort: 'top', points: [[1841, 594], [1631, 594]] },
  { id: 'field-activation', from: 'junction:ability-fields', to: 'ability:activation', type: 'ability', toPort: 'top', points: [[1841, 594], [1793, 594]] },
  { id: 'field-target', from: 'junction:ability-fields', to: 'ability:target', type: 'ability', toPort: 'top', points: [[1841, 594], [1955, 594]] },
  { id: 'field-medium', from: 'junction:ability-fields', to: 'ability:medium', type: 'ability', toPort: 'top', points: [[1841, 594], [1540, 594], [1540, 696], [1631, 696]] },
  { id: 'field-range', from: 'junction:ability-fields', to: 'ability:range', type: 'ability', toPort: 'top', points: [[1841, 594], [1793, 594]] },
  { id: 'field-duration', from: 'junction:ability-fields', to: 'ability:duration', type: 'ability', toPort: 'top', points: [[1841, 594], [2045, 594], [2045, 696], [1955, 696]] },
  { id: 'field-category-mix', from: 'junction:ability-fields', to: 'ability:category-mix', type: 'ability', toPort: 'top', points: [[1841, 594], [1711, 594], [1711, 770]] },
  { id: 'field-counterplay', from: 'junction:ability-fields', to: 'ability:counterplay', type: 'counter', toPort: 'top', points: [[1841, 594], [1873, 594], [1873, 770]] },
  { id: 'design-condition', from: 'ability:design', to: 'rule:condition', type: 'rule', fromPort: 'bottom', toPort: 'top', points: [[1841, 812], [1544, 812]] },
  { id: 'condition-limitation', from: 'rule:condition', to: 'rule:limitation', type: 'rule', fromPort: 'right', toPort: 'left' },
  { id: 'limitation-risk', from: 'rule:limitation', to: 'rule:risk-cost', type: 'rule', fromPort: 'right', toPort: 'left' },
  { id: 'risk-vow', from: 'rule:risk-cost', to: 'rule:vow', type: 'rule', fromPort: 'right', toPort: 'left' },
  { id: 'risk-reinforcement', from: 'rule:risk-cost', to: 'rule:reinforcement', type: 'rule', fromPort: 'bottom', toPort: 'top' },
  { id: 'vow-reinforcement', from: 'rule:vow', to: 'rule:reinforcement', type: 'rule', fromPort: 'bottom', toPort: 'right', points: [[2048, 930], [1988, 930]] },
  { id: 'design-special-bus', from: 'ability:design', to: 'junction:special-bus', type: 'special', fromPort: 'right', points: [[2074, 524], [2074, 956]] },
  { id: 'special-persistence', from: 'junction:special-bus', to: 'special:persistence-hub', type: 'special', toPort: 'top', points: [[2074, 968], [1513, 968]] },
  { id: 'persistence-post', from: 'special:persistence-hub', to: 'special:post-mortem', type: 'special', fromPort: 'bottom', toPort: 'top' },
  { id: 'special-imposed', from: 'junction:special-bus', to: 'special:imposed-hub', type: 'special', toPort: 'top', points: [[2074, 974], [1685, 974]] },
  { id: 'imposed-curses', from: 'special:imposed-hub', to: 'special:curses', type: 'special', fromPort: 'bottom', toPort: 'top' },
  { id: 'curses-exorcism', from: 'special:curses', to: 'special:exorcism', type: 'special', fromPort: 'right', toPort: 'left', label: 'removal / transfer', labelAt: [1770, 1048] },
  { id: 'special-entities', from: 'junction:special-bus', to: 'special:entities-hub', type: 'special', toPort: 'top', points: [[2074, 1118], [1513, 1118]] },
  { id: 'entities-beasts', from: 'special:entities-hub', to: 'special:nen-beasts', type: 'special', fromPort: 'bottom', toPort: 'top' },
  { id: 'beasts-parasitic', from: 'special:nen-beasts', to: 'special:parasitic', type: 'modifier', fromPort: 'right', toPort: 'left', label: 'host-dependent form', labelAt: [1600, 1190] },
  { id: 'special-multi-user', from: 'junction:special-bus', to: 'special:multi-user-hub', type: 'special', toPort: 'top', points: [[2074, 1118], [1855, 1118]] },
  { id: 'multi-collaborative', from: 'special:multi-user-hub', to: 'special:collaborative', type: 'special', fromPort: 'bottom', toPort: 'top' },
  { id: 'special-ownership', from: 'junction:special-bus', to: 'special:ownership-hub', type: 'special', toPort: 'top', points: [[2074, 1118], [2032, 1118]] },
  { id: 'ownership-transfer', from: 'special:ownership-hub', to: 'special:ownership', type: 'special', fromPort: 'bottom', toPort: 'top' },
  { id: 'details-inspector', from: 'terminal:details', to: 'terminal:inspector', type: 'inspector', fromPort: 'right', toPort: 'left' },
  ...spokeEdges,
  ...primaryUserEdges,
];

const computeBounds = (nodes, edges) => {
  const points = [];
  nodes.forEach((node) => {
    if (['junction', 'placement-anchor'].includes(node.kind)) points.push([node.x, node.y]);
    else { points.push([node.x, node.y]); points.push([node.x + node.w, node.y + node.h]); }
  });
  edges.forEach((edge) => edge.points?.forEach((point) => points.push(point)));
  points.push([INSPECTOR_RECT.x, INSPECTOR_RECT.y], [INSPECTOR_RECT.x + INSPECTOR_RECT.w, INSPECTOR_RECT.y + INSPECTOR_RECT.h]);
  const xs = points.map(([x]) => x);
  const ys = points.map(([, y]) => y);
  return { minX: Math.min(...xs) - CONTENT_PADDING, minY: Math.min(...ys) - CONTENT_PADDING, maxX: Math.max(...xs) + CONTENT_PADDING, maxY: Math.max(...ys) + CONTENT_PADDING };
};
const fittedView = (viewport, bounds) => {
  if (!viewport.width || !viewport.height) return { x: 0, y: 0, scale: 1 };
  const width = bounds.maxX - bounds.minX;
  const height = bounds.maxY - bounds.minY;
  const scale = clamp(Math.min((viewport.width - VIEW_MARGIN * 2) / width, (viewport.height - VIEW_MARGIN * 2) / height), MIN_SCALE, FIT_MAX_SCALE);
  return { scale, x: (viewport.width - width * scale) / 2 - bounds.minX * scale, y: (viewport.height - height * scale) / 2 - bounds.minY * scale };
};
const boundedView = (next, viewport, bounds) => {
  const scale = clamp(next.scale, MIN_SCALE, MAX_SCALE);
  const width = (bounds.maxX - bounds.minX) * scale;
  const height = (bounds.maxY - bounds.minY) * scale;
  const centeredX = (viewport.width - width) / 2 - bounds.minX * scale;
  const centeredY = (viewport.height - height) / 2 - bounds.minY * scale;
  return {
    scale,
    x: width <= viewport.width ? centeredX : clamp(next.x, viewport.width - bounds.maxX * scale - VIEW_MARGIN, VIEW_MARGIN - bounds.minX * scale),
    y: height <= viewport.height ? centeredY : clamp(next.y, viewport.height - bounds.maxY * scale - VIEW_MARGIN, VIEW_MARGIN - bounds.minY * scale),
  };
};
const affinityLabel = (activeKey, targetKey) => {
  if (!activeKey) return null;
  const activeIndex = categories.findIndex((item) => item.key === activeKey);
  const targetIndex = categories.findIndex((item) => item.key === targetKey);
  if (activeIndex < 0 || targetIndex < 0) return null;
  if (activeIndex === targetIndex) return '100%';
  if (categories[activeIndex].code === 'Sp' || categories[targetIndex].code === 'Sp') return 'varies';
  const rawDistance = Math.abs(activeIndex - targetIndex);
  const ringDistance = Math.min(rawDistance, categories.length - rawDistance);
  return ringDistance === 1 ? '80%' : ringDistance === 2 ? '60%' : '40%';
};

const expansionForCategory = (categoryKey) => {
  if (!categoryKey) return { nodes: [], edges: [], anchors: [] };
  const category = categoryByKey.get(categoryKey);
  const outward = unit(category.cx - HATSU_CENTER.x, category.cy - HATSU_CENTER.y);
  const tangent = { x: -outward.y, y: outward.x };
  const relevantPlacements = placementGeometry.filter((item) => item.from === categoryKey || item.to === categoryKey).slice(0, 6);
  const pure = (secondaryPureUsers[categoryKey] || []).slice(0, 3);
  const profiles = [
    ...relevantPlacements.map((item) => ({ type: 'placement', item })),
    ...pure.map((item) => ({ type: 'pure', item })),
  ];
  const nodes = [];
  const edges = [];
  const anchors = [];
  const userByName = new Map(primaryUserNodes.map((node) => [node.name, node]));

  profiles.forEach((profile, index) => {
    const placement = profile.type === 'placement' ? profile.item : null;
    const item = profile.item;
    const anchorPoint = placement ? placement.marker : {
      x: category.cx + outward.x * 76 + tangent.x * ((index - (profiles.length - 1) / 2) * 24),
      y: category.cy + outward.y * 76 + tangent.y * ((index - (profiles.length - 1) / 2) * 24),
    };
    const localOutward = placement?.normal || outward;
    const localTangent = placement?.tangent || tangent;
    const spread = (index - (profiles.length - 1) / 2) * 42;
    const cardCenter = {
      x: anchorPoint.x + localOutward.x * 126 + localTangent.x * spread,
      y: anchorPoint.y + localOutward.y * 126 + localTangent.y * spread,
    };
    const anchor = { key: `placement-anchor:${categoryKey}:${index}`, kind: 'placement-anchor', x: anchorPoint.x, y: anchorPoint.y, w: 0, h: 0 };
    const userNode = {
      key: `expanded-user:${categoryKey}:${item.name}`, kind: 'expanded-user', name: item.name,
      ability: item.ability || placement?.ability || '', category: item.natural || category.name,
      categoryKey, categoryKeys: placement ? [placement.from, placement.to] : [categoryKey],
      placementId: placement?.id || null, natural: placement?.natural || category.name,
      x: cardCenter.x - 88, y: cardCenter.y - 33, w: 176, h: 66, portraitName: item.name,
      summary: placement
        ? `${item.name} is placed between ${categoryMeta[placement.from].name} and ${categoryMeta[placement.to].name}; ${placement.natural} remains the natural type.`
        : `${item.name} is placed directly within ${category.name} on the Togashi exhibition chart.`,
    };
    anchors.push(anchor);
    nodes.push(userNode);
    userByName.set(item.name, userNode);
    edges.push({ id: `expand-anchor:${categoryKey}:${item.name}`, from: anchor.key, to: userNode.key, type: 'placement', direct: true });
  });

  const abilities = namedAbilityProfiles.filter((profile) => profile.naturalCategory === categoryKey || profile.supportingCategories.includes(categoryKey)).slice(0, 4);
  abilities.forEach((ability, index) => {
    let userNode = userByName.get(ability.user);
    if (!userNode) {
      const primary = primaryUserNodes.find((node) => node.name === ability.user);
      if (primary) userNode = primary;
    }
    if (!userNode) return;
    const railCenter = {
      x: category.cx + outward.x * 340 + tangent.x * ((index - (abilities.length - 1) / 2) * 122),
      y: category.cy + outward.y * 340 + tangent.y * ((index - (abilities.length - 1) / 2) * 122),
    };
    const abilityNode = {
      key: `named-ability:${ability.id}`, kind: 'named-ability', name: ability.name, user: ability.user,
      naturalCategory: ability.naturalCategory, supportingCategories: ability.supportingCategories,
      activation: ability.activation, cost: ability.cost, effect: ability.effect,
      x: railCenter.x - 96, y: railCenter.y - 42, w: 192, h: 84,
      summary: ability.effect,
    };
    nodes.push(abilityNode);
    edges.push({ id: `ability-user:${ability.id}`, from: userNode.key, to: abilityNode.key, type: 'named-ability', direct: true });
    ability.supportingCategories.forEach((supportKey) => {
      if (supportKey === categoryKey) return;
      edges.push({ id: `ability-support:${ability.id}:${supportKey}`, from: abilityNode.key, to: supportKey, type: 'support', direct: true });
    });
  });

  return { nodes, edges, anchors };
};

function Portrait({ name, portraitItemFor }) {
  return <SourcePortrait item={portraitItemFor(name)} alt={`${name} portrait from Hunterpedia`} />;
}

function MapNode({ node, record, active, pinned, expanded, onPreview, onClear, onPin, portraitItemFor }) {
  if (['junction', 'placement-anchor'].includes(node.kind)) return null;
  const handlers = { onMouseEnter: () => onPreview(record), onMouseLeave: onClear, onFocus: () => onPreview(record), onBlur: onClear, onClick: () => onPin(record) };
  const hasPortrait = ['user', 'expanded-user'].includes(node.kind);
  return <button
    type="button"
    className={`nen-pipe-node is-${node.kind}${active ? ' is-active' : ''}${pinned ? ' is-pinned' : ''}${expanded ? ' is-expanded' : ''}`}
    style={{ left: node.x, top: node.y, width: node.w, height: node.h }}
    aria-pressed={pinned}
    aria-expanded={node.kind === 'category' ? expanded : undefined}
    {...handlers}
  >
    {hasPortrait && <Portrait name={node.portraitName} portraitItemFor={portraitItemFor} />}
    <span className="nen-pipe-node__copy">
      {node.mark && <i>{node.mark}</i>}
      {node.eyebrow && <small>{node.eyebrow}</small>}
      <strong>{node.name}</strong>
      {node.code && <em>{node.code} · {node.water}</em>}
      {node.ability && <em>{node.ability}</em>}
      {node.kind === 'named-ability' && <em>{node.user}</em>}
    </span>
  </button>;
}

function PlacementMarker({ placement, active, onPreview, onClear, onPin }) {
  const record = {
    ...placement,
    key: `placement:${placement.id}`,
    kind: 'placement',
    summary: `${placement.name} is placed between ${categoryMeta[placement.from].name} and ${categoryMeta[placement.to].name}; ${placement.natural} remains the natural type.`,
  };
  return <button
    type="button"
    className={`nen-placement-marker${active ? ' is-active' : ''}`}
    style={{ left: placement.marker.x - 7, top: placement.marker.y - 7 }}
    aria-label={`${placement.name}: ${placement.natural}, placed between ${categoryMeta[placement.from].name} and ${categoryMeta[placement.to].name}`}
    onMouseEnter={() => onPreview(record)} onMouseLeave={onClear} onFocus={() => onPreview(record)} onBlur={onClear} onClick={() => onPin(record)}
  />;
}

export default function NenSystemExpansionMap({ records = [], portraitItemFor }) {
  const recordsByName = useMemo(() => new Map(records.map((record) => [record.name, record])), [records]);
  const [hovered, setHovered] = useState(null);
  const [pinned, setPinned] = useState(null);
  const [expandedCategoryKey, setExpandedCategoryKey] = useState(null);
  const expansion = useMemo(() => expansionForCategory(expandedCategoryKey), [expandedCategoryKey]);
  const visibleNodes = useMemo(() => [...baseNodes, ...expansion.anchors, ...expansion.nodes], [expansion]);
  const visibleEdges = useMemo(() => [...baseEdges, ...expansion.edges], [expansion]);
  const enriched = useMemo(() => visibleNodes.map((node) => {
    const source = recordsByName.get(node.name);
    return { ...node, record: { ...node, summary: source?.summary || node.summary || `${node.name} is connected to the wider Nen system.`, mechanics: source?.mechanics || [], study: source?.study || '', related: source?.related || [] } };
  }), [visibleNodes, recordsByName]);
  const inspectorNode = useMemo(() => ({ key: 'terminal:inspector', kind: 'junction', x: INSPECTOR_RECT.x, y: INSPECTOR_RECT.y + 150, w: 0, h: 0 }), []);
  const enrichedByKey = useMemo(() => new Map([...enriched, inspectorNode].map((node) => [node.key, node])), [enriched, inspectorNode]);
  const incoming = useMemo(() => visibleEdges.reduce((map, edge) => map.set(edge.to, [...(map.get(edge.to) || []), edge]), new Map()), [visibleEdges]);
  const outgoing = useMemo(() => visibleEdges.reduce((map, edge) => map.set(edge.from, [...(map.get(edge.from) || []), edge]), new Map()), [visibleEdges]);
  const contentBounds = useMemo(() => computeBounds(baseNodes, baseEdges), []);
  const active = hovered || pinned;
  const inspected = active || enrichedByKey.get('nen')?.record;
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const [view, setView] = useState({ x: 0, y: 0, scale: 1 });
  const [dragging, setDragging] = useState(false);
  const viewportRef = useRef(null);
  const viewRef = useRef(view);
  const clearTimerRef = useRef(null);
  const suppressClickUntilRef = useRef(0);
  const gestureRef = useRef({ pointers: new Map(), mode: null, startView: null, startPoint: null, startDistance: 0, startCenter: null, moved: false });

  const activeGraph = useMemo(() => {
    const nodeKeys = new Set();
    const edgeIds = new Set();
    if (!active) return { nodeKeys, edgeIds };
    const addEdge = (edge) => { if (!edge) return; edgeIds.add(edge.id); nodeKeys.add(edge.from); nodeKeys.add(edge.to); };
    const addById = (id) => addEdge(visibleEdges.find((edge) => edge.id === id));
    const walkUpstream = (key, visited = new Set()) => {
      if (visited.has(key)) return;
      visited.add(key);
      (incoming.get(key) || []).forEach((edge) => {
        if (['user', 'spoke', 'inspector'].includes(edge.type)) return;
        addEdge(edge);
        if (!['concept:hatsu', 'junction:hatsu-feed', 'nen'].includes(edge.from)) walkUpstream(edge.from, visited);
      });
    };
    nodeKeys.add(active.key);
    if (active.kind === 'placement') return { nodeKeys, edgeIds };
    if (['user', 'expanded-user'].includes(active.kind)) {
      (incoming.get(active.key) || []).forEach(addEdge);
      (outgoing.get(active.key) || []).forEach(addEdge);
      return { nodeKeys, edgeIds };
    }
    if (active.kind === 'named-ability') {
      (incoming.get(active.key) || []).forEach(addEdge);
      (outgoing.get(active.key) || []).forEach(addEdge);
      nodeKeys.add(active.naturalCategory);
      active.supportingCategories?.forEach((key) => nodeKeys.add(key));
      return { nodeKeys, edgeIds };
    }
    if (active.kind === 'category') {
      addById(`spoke:${active.key}`);
      (outgoing.get(active.key) || []).filter((edge) => edge.type === 'user').forEach(addEdge);
      nodeKeys.add('concept:water-divination');
      nodeKeys.add('concept:category-affinity');
      return { nodeKeys, edgeIds };
    }
    if (active.key === 'nen') { ['life-aura', 'aura-nodes', 'nodes-nen', 'nen-principles', 'principles-ten', 'principles-zetsu', 'principles-ren', 'principles-hatsu-feed'].forEach(addById); return { nodeKeys, edgeIds }; }
    if (active.key === 'concept:hatsu') { ['principles-hatsu-feed', 'hatsu-feed-hatsu', 'hatsu-water', 'hatsu-developed'].forEach(addById); return { nodeKeys, edgeIds }; }
    if (active.kind === 'principle') { (incoming.get(active.key) || []).forEach(addEdge); (outgoing.get(active.key) || []).forEach(addEdge); return { nodeKeys, edgeIds }; }
    if (active.kind === 'technique') { walkUpstream(active.key); (outgoing.get(active.key) || []).forEach(addEdge); return { nodeKeys, edgeIds }; }
    if (active.key === 'terminal:details') { addById('details-inspector'); return { nodeKeys, edgeIds }; }
    walkUpstream(active.key);
    (outgoing.get(active.key) || []).forEach(addEdge);
    return { nodeKeys, edgeIds };
  }, [active, incoming, outgoing, visibleEdges]);

  const activeCategoryKey = active?.kind === 'category'
    ? active.key
    : ['user', 'expanded-user'].includes(active?.kind)
      ? active.categoryKey
      : expandedCategoryKey;
  const activePlacementPair = active?.kind === 'placement'
    ? [active.from, active.to]
    : active?.placementId
      ? (() => { const item = placementGeometry.find((placement) => placement.id === active.placementId); return item ? [item.from, item.to] : null; })()
      : null;

  useEffect(() => { viewRef.current = view; }, [view]);
  useEffect(() => () => window.clearTimeout(clearTimerRef.current), []);
  useLayoutEffect(() => {
    const element = viewportRef.current;
    if (!element) return undefined;
    const update = () => { const rect = element.getBoundingClientRect(); setViewportSize({ width: rect.width, height: rect.height }); };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  useLayoutEffect(() => { if (viewportSize.width && viewportSize.height) setView(fittedView(viewportSize, contentBounds)); }, [viewportSize.width, viewportSize.height, contentBounds]);

  const updateView = useCallback((updater) => setView((current) => boundedView(typeof updater === 'function' ? updater(current) : updater, viewportSize, contentBounds)), [viewportSize, contentBounds]);
  const zoomAt = useCallback((nextScale, point = { x: viewportSize.width / 2, y: viewportSize.height / 2 }) => updateView((current) => {
    const scale = clamp(nextScale, MIN_SCALE, MAX_SCALE);
    const mapX = (point.x - current.x) / current.scale;
    const mapY = (point.y - current.y) / current.scale;
    return { scale, x: point.x - mapX * scale, y: point.y - mapY * scale };
  }), [updateView, viewportSize]);
  const fitAll = useCallback(() => setView(fittedView(viewportSize, contentBounds)), [viewportSize, contentBounds]);
  const resetView = useCallback(() => {
    const width = contentBounds.maxX - contentBounds.minX;
    const height = contentBounds.maxY - contentBounds.minY;
    setView(boundedView({ scale: 1, x: (viewportSize.width - width) / 2 - contentBounds.minX, y: (viewportSize.height - height) / 2 - contentBounds.minY }, viewportSize, contentBounds));
  }, [viewportSize, contentBounds]);

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

  const pointerPoint = (event) => { const rect = viewportRef.current?.getBoundingClientRect(); return { x: event.clientX - (rect?.left || 0), y: event.clientY - (rect?.top || 0) }; };
  const pointerDown = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    const point = pointerPoint(event);
    const interactive = Boolean(event.target.closest?.('button,a,.nen-pipe-inspector,.nen-pipe-controls'));
    const gesture = gestureRef.current;
    gesture.pointers.set(event.pointerId, { point, interactive });
    if (gesture.pointers.size === 1 && !interactive) { gesture.mode = 'pan'; gesture.startPoint = point; gesture.startView = viewRef.current; gesture.moved = false; event.currentTarget.setPointerCapture?.(event.pointerId); }
    else if (gesture.pointers.size === 2) { const [a, b] = [...gesture.pointers.values()].map((entry) => entry.point); gesture.mode = 'pinch'; gesture.startDistance = Math.max(1, distance(a, b)); gesture.startCenter = midpoint(a, b); gesture.startView = viewRef.current; gesture.moved = false; }
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
      setView(boundedView({ scale, x: nextCenter.x - mapX * scale, y: nextCenter.y - mapY * scale }, viewportSize, contentBounds));
      event.preventDefault();
    } else if (gesture.mode === 'pan') {
      const dx = point.x - gesture.startPoint.x;
      const dy = point.y - gesture.startPoint.y;
      if (Math.abs(dx) + Math.abs(dy) > 3) { gesture.moved = true; setDragging(true); }
      setView(boundedView({ ...gesture.startView, x: gesture.startView.x + dx, y: gesture.startView.y + dy }, viewportSize, contentBounds));
      event.preventDefault();
    }
  };
  const pointerEnd = (event) => {
    const gesture = gestureRef.current;
    const moved = gesture.moved;
    gesture.pointers.delete(event.pointerId);
    if (!gesture.pointers.size) { gesture.mode = null; gesture.moved = false; setDragging(false); if (moved) suppressClickUntilRef.current = performance.now() + 160; }
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

  const preview = (record) => { window.clearTimeout(clearTimerRef.current); setHovered(record); };
  const clearPreview = () => { window.clearTimeout(clearTimerRef.current); clearTimerRef.current = window.setTimeout(() => setHovered(null), 90); };
  const pin = (record) => {
    if (record.kind === 'category') {
      const next = expandedCategoryKey === record.key ? null : record.key;
      setExpandedCategoryKey(next);
      setPinned(next ? record : null);
      return;
    }
    setPinned((current) => current?.key === record.key ? null : record);
  };
  const clearAll = () => { setPinned(null); setHovered(null); setExpandedCategoryKey(null); };
  const isPinnedInspector = pinned?.key === inspected?.key;
  const relatedNodes = isPinnedInspector ? (inspected?.related || []).map((name) => enriched.find((node) => node.name === name)).filter(Boolean).slice(0, 5) : [];
  const inspectedCategoryName = inspected?.naturalCategory ? categoryMeta[inspected.naturalCategory]?.name : null;
  const inspectedSupportNames = inspected?.supportingCategories?.map((key) => categoryMeta[key]?.name).filter(Boolean) || [];

  return <section
    className={`nen-pipe-map nen-expansion-map${active ? ' has-active' : ''}${expandedCategoryKey ? ' has-expanded-category' : ''}`}
    aria-label="Interactive Nen system pipeline map"
    data-qa-pan-zoom-canvas="true"
    onKeyDown={(event) => { if (event.key === 'Escape') clearAll(); }}
  >
    <div
      ref={viewportRef}
      className={`nen-pipe-viewport${dragging ? ' is-dragging' : ''}`}
      tabIndex="0"
      aria-label="Pan and zoom the complete Nen map. Use arrows to pan, plus and minus to zoom, zero to fit, and R to reset. Pin a category to reveal more users and abilities."
      onKeyDown={keyDown}
      onPointerDown={pointerDown}
      onPointerMove={pointerMove}
      onPointerUp={pointerEnd}
      onPointerCancel={pointerEnd}
      onClickCapture={(event) => { if (performance.now() < suppressClickUntilRef.current) { event.preventDefault(); event.stopPropagation(); } }}
    >
      <div className="nen-pipe-canvas" data-qa-scaled-canvas="true" style={{ width: MAP_WIDTH, height: MAP_HEIGHT, transform: `translate3d(${view.x}px,${view.y}px,0) scale(${view.scale})` }}>
        <svg className="nen-pipe-connectors" viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} fill="none" aria-hidden="true">
          {ringPairs.map(([fromKey, toKey]) => {
            const from = enrichedByKey.get(fromKey);
            const to = enrichedByKey.get(toKey);
            const a = center(from);
            const b = center(to);
            const activeRing = activePlacementPair
              ? activePlacementPair.includes(fromKey) && activePlacementPair.includes(toKey)
              : activeCategoryKey && (activeCategoryKey === fromKey || activeCategoryKey === toKey);
            return <g key={`${fromKey}-${toKey}`} className={activeRing ? 'is-active-ring' : ''}>
              <path className="is-ring-under" d={`M ${a.x} ${a.y} L ${b.x} ${b.y}`} />
              <path className="is-ring" d={`M ${a.x} ${a.y} L ${b.x} ${b.y}`} />
              {[0.24, 0.5, 0.76].map((ratio, index) => <circle key={ratio} className={index === 1 ? 'is-halfway' : ''} cx={a.x + (b.x - a.x) * ratio} cy={a.y + (b.y - a.y) * ratio} r={index === 1 ? 8 : 6} />)}
            </g>;
          })}
          {visibleEdges.map((edge) => {
            const from = enrichedByKey.get(edge.from);
            const to = enrichedByKey.get(edge.to);
            if (!from || !to) return null;
            const activeEdge = activeGraph.edgeIds.has(edge.id);
            return <g key={edge.id} className={`nen-edge-group${activeEdge ? ' is-active' : ''}`}>
              <path className={`is-graph-edge is-${edge.type}${activeEdge ? ' is-active' : ''}`} d={edgePath(edge, from, to)} />
              {edge.label && edge.labelAt && <text className="nen-edge-label" x={edge.labelAt[0]} y={edge.labelAt[1]}>{edge.label}</text>}
            </g>;
          })}
          {junctionNodes.map((node) => <circle key={node.key} className={`nen-junction${activeGraph.nodeKeys.has(node.key) ? ' is-active' : ''}`} cx={node.x} cy={node.y} r="7" />)}
          {expansion.anchors.map((node) => <circle key={node.key} className="nen-expansion-anchor" cx={node.x} cy={node.y} r="5" />)}
          {activeCategoryKey && categories.map((category) => <g className="nen-efficiency-label" key={`efficiency:${category.key}`} transform={`translate(${category.cx},${category.cy - 96})`}>
            <rect x="-25" y="-12" width="50" height="24" rx="12" />
            <text textAnchor="middle" dominantBaseline="central">{affinityLabel(activeCategoryKey, category.key)}</text>
          </g>)}
        </svg>

        {placementGeometry.map((placement) => <PlacementMarker
          key={placement.id}
          placement={placement}
          active={active?.kind === 'placement' && active.id === placement.id}
          onPreview={preview}
          onClear={clearPreview}
          onPin={pin}
        />)}

        {enriched.map((node) => <MapNode
          key={node.key}
          node={node}
          record={node.record}
          active={activeGraph.nodeKeys.has(node.key)}
          pinned={pinned?.key === node.key}
          expanded={node.kind === 'category' && expandedCategoryKey === node.key}
          onPreview={preview}
          onClear={clearPreview}
          onPin={pin}
          portraitItemFor={portraitItemFor}
        />)}

        <aside className={`nen-pipe-inspector${isPinnedInspector ? ' is-pinned' : ''}`} style={{ left: INSPECTOR_RECT.x, top: INSPECTOR_RECT.y, width: INSPECTOR_RECT.w, maxHeight: INSPECTOR_RECT.h }} onMouseEnter={() => window.clearTimeout(clearTimerRef.current)} onMouseLeave={clearPreview} aria-live="polite">
          <header><span>{inspected?.eyebrow || inspected?.kind?.replaceAll('-', ' ')}</span><h2>{inspected?.name}</h2>{isPinnedInspector && <button type="button" onClick={() => setPinned(null)}>Unpin</button>}</header>
          <p>{inspected?.summary}</p>
          {inspected?.water && <dl><div><dt>Water Divination</dt><dd>{inspected.water}</dd></div><div><dt>Affinity code</dt><dd>{inspected.code}</dd></div></dl>}
          {inspected?.ability && <dl><div><dt>Ability</dt><dd>{inspected.ability}</dd></div><div><dt>Natural type</dt><dd>{inspected.natural || inspected.category}</dd></div></dl>}
          {inspectedCategoryName && <dl><div><dt>Natural category</dt><dd>{inspectedCategoryName}</dd></div><div><dt>Supporting categories</dt><dd>{inspectedSupportNames.length ? inspectedSupportNames.join(' · ') : 'None confirmed here'}</dd></div></dl>}
          {inspected?.activation && <section><h3>Activation</h3><p>{inspected.activation}</p></section>}
          {inspected?.cost && <section><h3>Cost / restriction</h3><p>{inspected.cost}</p></section>}
          {isPinnedInspector && inspected?.mechanics?.length > 0 && <section><h3>Mechanics</h3><ul>{inspected.mechanics.slice(0, 3).map((item) => <li key={item}>{item}</li>)}</ul></section>}
          {isPinnedInspector && inspected?.study && <section><h3>Reading note</h3><p>{inspected.study}</p></section>}
          {relatedNodes.length > 0 && <section><h3>Connected records</h3><div>{relatedNodes.map((node) => <button type="button" onClick={() => setPinned(node.record)} key={node.key}>{node.name}</button>)}</div></section>}
          {inspected?.kind === 'category' && <p className="nen-category-focus-note">{expandedCategoryKey === inspected.key ? 'Category focus is open. Pin an exposed user or ability for its detailed record.' : 'Click this hexagonal category node to reveal its additional users and named abilities.'}</p>}
        </aside>
      </div>

      <div className="nen-pipe-controls" role="group" aria-label="Map controls">
        <button type="button" onClick={() => zoomAt(viewRef.current.scale * 1.2)} aria-label="Zoom in"><ZoomIn size={18} /></button>
        <button type="button" onClick={() => zoomAt(viewRef.current.scale / 1.2)} aria-label="Zoom out"><ZoomOut size={18} /></button>
        <button type="button" onClick={fitAll} aria-label="Fit visible map content"><Maximize2 size={18} /></button>
        <button type="button" onClick={resetView} aria-label="Reset to one hundred percent"><RotateCcw size={18} /></button>
        <output aria-live="polite">{Math.round(view.scale * 100)}%</output>
      </div>
    </div>
  </section>;
}
