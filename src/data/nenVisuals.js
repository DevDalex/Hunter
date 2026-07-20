const encode = (value) => `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(value)}`;

const patterns = {
  rings: '<ellipse cx="480" cy="270" rx="165" ry="205" class="soft"/><ellipse cx="480" cy="270" rx="215" ry="250" class="line faint"/>',
  closed: '<circle cx="480" cy="270" r="135" class="dark"/><path d="M350 270h260" class="dash"/>',
  waves: '<circle cx="480" cy="270" r="105" class="line"/><circle cx="480" cy="270" r="165" class="line faint"/><circle cx="480" cy="270" r="230" class="line ghost"/>',
  burst: '<path d="M480 45l30 145 80-120-28 148 137-70-110 104 155-9-148 48 143 65-154-26 101 118-131-82 22 154-76-134-40 150-1-155-106 113 76-136-152 41 134-80-157-34 156-8-123-100 143 64-60-145 94 124z" class="soft"/>',
  focus: '<circle cx="480" cy="270" r="205" class="ghost"/><circle cx="610" cy="200" r="72" class="line"/><circle cx="610" cy="200" r="25" class="solid"/><path d="M480 270L610 200" class="dash"/>',
  conceal: '<path d="M250 270c70-105 390-105 460 0-70 105-390 105-460 0z" class="ghost"/><circle cx="480" cy="270" r="82" class="dark"/><path d="M270 400L690 140" class="dash"/>',
  field: '<circle cx="480" cy="270" r="100" class="soft"/><circle cx="480" cy="270" r="175" class="line"/><circle cx="480" cy="270" r="250" class="line faint"/>',
  coat: '<rect x="380" y="145" width="200" height="250" rx="30" class="dark"/><rect x="340" y="105" width="280" height="330" rx="60" class="line"/><rect x="305" y="70" width="350" height="400" rx="85" class="ghost"/>',
  point: '<circle cx="480" cy="270" r="225" class="ghost"/><path d="M480 75v390M285 270h390" class="dash"/><circle cx="480" cy="270" r="72" class="line"/><circle cx="480" cy="270" r="24" class="solid"/>',
  shield: '<path d="M480 85l175 65v125c0 120-72 185-175 220-103-35-175-100-175-220V150l175-65z" class="ghost"/><path d="M480 125l135 50v95c0 90-53 140-135 172-82-32-135-82-135-172v-95l135-50z" class="line"/>',
  flow: '<path d="M275 185c75-105 260-125 370-35l-52 8 34 41 60-81" class="line"/><path d="M685 355c-75 105-260 125-370 35l52-8-34-41-60 81" class="line"/><path d="M330 320c65-65 235-65 300 0" class="ghost"/>',
};

const makeVisual = ({ name, glyph, action, description, accent, pattern }) => encode(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540" role="img" aria-label="${name} Nen concept visual"><defs><radialGradient id="bg"><stop stop-color="#294235"/><stop offset=".58" stop-color="#15261e"/><stop offset="1" stop-color="#08100c"/></radialGradient><filter id="glow"><feGaussianBlur stdDeviation="8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><style>.line{fill:none;stroke:${accent};stroke-width:4}.faint{opacity:.55}.ghost{fill:none;stroke:${accent};stroke-width:3;opacity:.25}.soft{fill:${accent};opacity:.11;stroke:${accent};stroke-width:3}.solid{fill:${accent};filter:url(#glow)}.dark{fill:#08100c;stroke:${accent};stroke-width:3}.dash{fill:none;stroke:${accent};stroke-width:3;stroke-dasharray:10 12;opacity:.65}text{font-family:Georgia,serif}</style><rect width="960" height="540" fill="url(#bg)"/>${patterns[pattern]}<circle cx="480" cy="270" r="76" fill="#09110d" stroke="${accent}" stroke-width="3"/><circle cx="480" cy="270" r="96" fill="none" stroke="${accent}" stroke-width="2" opacity=".22"/><text x="480" y="292" text-anchor="middle" font-size="66" fill="#f4dfa2">${glyph}</text><text x="48" y="70" font-size="24" letter-spacing="5" fill="${accent}">${name.toUpperCase()} · ${action.toUpperCase()}</text><text x="48" y="474" font-size="28" fill="#f5f1e5">${description}</text><text x="48" y="508" font-family="Arial,sans-serif" font-size="16" fill="#aab9b0">Local archive visual · no external image dependency</text></svg>`);

const visuals = Object.fromEntries([
  ['Ten', '纏', 'Contain', 'Stable aura shroud', '#e5c96f', 'rings'],
  ['Zetsu', '絶', 'Suppress', 'Close aura output', '#9eb8aa', 'closed'],
  ['Ren', '練', 'Output', 'Increase aura pressure', '#f0c85f', 'waves'],
  ['Hatsu', '発', 'Express', 'Individual aura expression', '#d8b45b', 'burst'],
  ['Gyo', '凝', 'Focus', 'Concentrate aura at one point', '#e9cf78', 'focus'],
  ['In', '隠', 'Conceal', 'Hide aura from ordinary sight', '#a6b9b0', 'conceal'],
  ['En', '円', 'Field', 'Expand aura into a sensing field', '#d7be6a', 'field'],
  ['Shu', '周', 'Coat', 'Extend aura around an object', '#c8b76e', 'coat'],
  ['Ko', '硬', 'Concentrate', 'Gather aura at one point', '#f0cf68', 'point'],
  ['Ken', '堅', 'Guard', 'Maintain a full-body shroud', '#d4c17a', 'shield'],
  ['Ryu', '流', 'Flow', 'Redistribute aura during combat', '#d9c276', 'flow'],
].map(([name, glyph, action, description, accent, pattern]) => [name, makeVisual({ name, glyph, action, description, accent, pattern })]));

export const nenVisualForLabel = (label = '') => {
  const match = Object.keys(visuals).find((name) => label === name || label.startsWith(`${name} `));
  return match ? visuals[match] : '';
};

export default visuals;
