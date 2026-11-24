/* Naipes españoles dibujados en SVG, al estilo de la baraja clásica:
   bastos y espadas cruzados, oros y copas ornamentados, figuras de cuerpo entero. */
(function (root) {
'use strict';
const COL = { oro: '#b8860b', copa: '#b8281f', espada: '#1f4f99', basto: '#2f6b22' };
const GAPS = { oro: 0, copa: 1, espada: 2, basto: 3 };
const INK = '#2a1a10', SKIN = '#f3d1ac', GOLD = '#f2c13e', RED = '#c0392b', BLUE = '#2f5fa8', GREEN = '#3d8a3a';

const star = (cx, cy, r1, r2, k) => { let d = ''; for (let i = 0; i < k * 2; i++) { const r = i % 2 ? r2 : r1, a = Math.PI * i / k - Math.PI / 2; d += (i ? 'L' : 'M') + (cx + r * Math.cos(a)).toFixed(2) + ' ' + (cy + r * Math.sin(a)).toFixed(2); } return d + 'Z'; };
const beads = (cx, cy, r, k, rr, fill) => { let s = ''; for (let i = 0; i < k; i++) { const a = 2 * Math.PI * i / k; s += `<circle cx="${(cx + r * Math.cos(a)).toFixed(2)}" cy="${(cy + r * Math.sin(a)).toFixed(2)}" r="${rr}" fill="${fill}"/>`; } return s; };

const DEFS = `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>
<radialGradient id="g-oro" cx="38%" cy="32%" r="75%"><stop offset="0" stop-color="#fff1b8"/><stop offset=".5" stop-color="#f2c13e"/><stop offset="1" stop-color="#b07a0a"/></radialGradient>
<linearGradient id="g-copa" x1="0" x2="1"><stop offset="0" stop-color="#fbe38c"/><stop offset=".45" stop-color="#efbd3a"/><stop offset="1" stop-color="#a8720b"/></linearGradient>
<linearGradient id="g-hoja" x1="0" x2="1"><stop offset="0" stop-color="#f2f6fc"/><stop offset=".45" stop-color="#b8cbe6"/><stop offset="1" stop-color="#5f80b3"/></linearGradient>
<linearGradient id="g-palo" x1="0" x2="1"><stop offset="0" stop-color="#d6e08a"/><stop offset=".4" stop-color="#9bb84a"/><stop offset="1" stop-color="#4f7424"/></linearGradient>
<linearGradient id="g-tela" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".25"/><stop offset="1" stop-color="#000" stop-opacity=".18"/></linearGradient>
<pattern id="dorso" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="12" height="12" fill="#1f3f7a"/><path d="M0 6H12M6 0V12" stroke="#2f5fa8" stroke-width="2"/><circle cx="6" cy="6" r="1.6" fill="#e9c46a"/></pattern>
<symbol id="p-oro" viewBox="0 0 40 40" overflow="visible">
 <circle cx="20" cy="20" r="18.8" fill="url(#g-oro)" stroke="#6b4300" stroke-width="1.3"/>
 <circle cx="20" cy="20" r="15.3" fill="none" stroke="${RED}" stroke-width="2.6"/>${beads(20, 20, 15.3, 14, .9, '#fbe39a')}
 <circle cx="20" cy="20" r="11.4" fill="#f5c843" stroke="#6b4300" stroke-width=".9"/>
 <path d="${star(20, 20, 10.6, 5, 8)}" fill="#e09c16" stroke="#6b4300" stroke-width=".7" stroke-linejoin="round"/>
 <circle cx="20" cy="20" r="4" fill="${RED}" stroke="#6b4300" stroke-width=".6"/><circle cx="20" cy="20" r="1.6" fill="${BLUE}"/>
 <path d="M9 12q4-5 9-6" stroke="#fff6cf" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".8"/></symbol>
<symbol id="p-copa" viewBox="0 0 40 60" overflow="visible">
 <path d="M7 57q13-8 26 0v2H7z" fill="url(#g-copa)" stroke="#6b4300" stroke-width="1.1"/>
 <path d="M10 55q10-5 20 0" stroke="${RED}" stroke-width="1.6" fill="none"/>
 <path d="M17.5 36h5l1 18h-7z" fill="url(#g-copa)" stroke="#6b4300" stroke-width="1"/>
 <ellipse cx="20" cy="41" rx="5.2" ry="3.4" fill="${BLUE}" stroke="#1a3260" stroke-width=".9"/><ellipse cx="18.6" cy="40" rx="1.6" ry="1" fill="#9fc0ee"/>
 <ellipse cx="20" cy="48" rx="3.6" ry="2" fill="${RED}" stroke="#6b1410" stroke-width=".7"/>
 <path d="M4 7q0 25 16 29q16-4 16-29z" fill="url(#g-copa)" stroke="#6b4300" stroke-width="1.2" stroke-linejoin="round"/>
 <path d="M5 15q15 7 30 0v5q-15 8-30 0z" fill="${RED}" stroke="#6b1410" stroke-width=".7"/>${beads(20, 18.5, 0, 1, 1.6, '#fbe39a')}
 <path d="M8.5 25q11.5 7 23 0" stroke="${BLUE}" stroke-width="1.4" fill="none"/>
 <ellipse cx="20" cy="7" rx="16.4" ry="3.4" fill="#f9d96d" stroke="#6b4300" stroke-width="1.1"/><ellipse cx="20" cy="7.2" rx="13" ry="1.7" fill="#7a1d17"/>
 <path d="M8 11q1 12 6 18" stroke="#fff6cf" stroke-width="1.5" fill="none" stroke-linecap="round" opacity=".75"/></symbol>
<symbol id="p-espada" viewBox="0 0 24 100" overflow="visible">
 <path d="M12 1l4.4 9V66H7.6V10z" fill="url(#g-hoja)" stroke="#173a73" stroke-width="1.1" stroke-linejoin="round"/>
 <path d="M12 6V64" stroke="#6d8fc0" stroke-width=".9"/>
 <path d="M0 66q12 6 24 0v5q-12 7-24 0z" fill="${GOLD}" stroke="#6b4300" stroke-width=".9"/>
 <circle cx="1.4" cy="68.6" r="2.6" fill="${GOLD}" stroke="#6b4300" stroke-width=".8"/><circle cx="22.6" cy="68.6" r="2.6" fill="${GOLD}" stroke="#6b4300" stroke-width=".8"/>
 <rect x="9.4" y="74" width="5.2" height="15" rx="1.6" fill="${RED}" stroke="#6b1410" stroke-width=".7"/>
 <path d="M9.6 78h4.8M9.6 82h4.8M9.6 86h4.8" stroke="${GOLD}" stroke-width="1"/>
 <circle cx="12" cy="93" r="4.4" fill="${GOLD}" stroke="#6b4300" stroke-width=".9"/><circle cx="12" cy="93" r="1.6" fill="${BLUE}"/></symbol>
<symbol id="p-espadac" viewBox="0 0 24 100" overflow="visible">
 <path d="M8 1q16 26 9 65H8.2q5-34-0.2-65z" fill="url(#g-hoja)" stroke="#173a73" stroke-width="1.1" stroke-linejoin="round"/>
 <path d="M9 7q10 26 4.4 57" stroke="#6d8fc0" stroke-width=".9" fill="none"/>
 <path d="M0 66q12 6 24 0v5q-12 7-24 0z" fill="${GOLD}" stroke="#6b4300" stroke-width=".9"/>
 <circle cx="1.4" cy="68.6" r="2.6" fill="${GOLD}" stroke="#6b4300" stroke-width=".8"/><circle cx="22.6" cy="68.6" r="2.6" fill="${GOLD}" stroke="#6b4300" stroke-width=".8"/>
 <rect x="9.4" y="74" width="5.2" height="15" rx="1.6" fill="${RED}" stroke="#6b1410" stroke-width=".7"/>
 <path d="M9.6 78h4.8M9.6 82h4.8M9.6 86h4.8" stroke="${GOLD}" stroke-width="1"/>
 <circle cx="12" cy="93" r="4.4" fill="${GOLD}" stroke="#6b4300" stroke-width=".9"/><circle cx="12" cy="93" r="1.6" fill="${BLUE}"/></symbol>
<symbol id="p-basto" viewBox="0 0 30 100" overflow="visible">
 <path d="M4.6 34q-3.8-3-6-1.2q1 3.6 5.8 5.2z" fill="#8aa83e" stroke="#2f4a12" stroke-width=".9"/>
 <path d="M24.6 52q4-2.6 6-.6q-1.4 3.4-6.2 4.4z" fill="#8aa83e" stroke="#2f4a12" stroke-width=".9"/>
 <path d="M7.4 72q-3.6-1.8-5.4 0q1.6 3 5.6 3.4z" fill="#8aa83e" stroke="#2f4a12" stroke-width=".9"/>
 <path d="M10.4 98Q6 62 5 26Q4.4 5 15 2.4Q26 4 25.4 24Q24.4 62 18.6 98z" fill="url(#g-palo)" stroke="#2f4a12" stroke-width="1.2" stroke-linejoin="round"/>
 <ellipse cx="14.5" cy="97.6" rx="4.2" ry="1.5" fill="#ecd391" stroke="#6b4a12" stroke-width=".7"/>
 <g fill="#3d5c18"><ellipse cx="10" cy="20" rx="1.8" ry="2.6"/><ellipse cx="19" cy="30" rx="1.6" ry="2.4"/><ellipse cx="11.2" cy="46" rx="1.6" ry="2.4"/><ellipse cx="18.4" cy="62" rx="1.4" ry="2.2"/><ellipse cx="13" cy="80" rx="1.3" ry="2"/></g>
 <path d="M9 10q3-5 8-4.6" stroke="#eef5bf" stroke-width="1.5" fill="none" stroke-linecap="round"/>
 <path d="M8.6 30q1 30 3.4 60" stroke="#e3ecaa" stroke-width="1" fill="none" opacity=".7"/></symbol>
</defs></svg>`;

function inject(doc) { if (doc.getElementById('p-oro')) return; const d = doc.createElement('div'); d.innerHTML = DEFS; doc.body.prepend(d.firstChild); }

/* --- disposición de las pintas, como en la baraja española --- */
const ROUND = {
  oro: {
    1: [[50, 76, 56]], 2: [[50, 40, 30], [50, 110, 30]], 3: [[32, 36, 27], [50, 75, 27], [68, 114, 27]],
    4: [[32, 44, 27], [68, 44, 27], [32, 106, 27], [68, 106, 27]],
    5: [[31, 38, 25], [69, 38, 25], [50, 75, 25], [31, 112, 25], [69, 112, 25]],
    6: [[32, 36, 24], [68, 36, 24], [32, 75, 24], [68, 75, 24], [32, 114, 24], [68, 114, 24]],
    7: [[32, 32, 22], [68, 32, 22], [50, 54, 22], [32, 76, 22], [68, 76, 22], [32, 118, 22], [68, 118, 22]]
  },
  copa: {
    1: [[50, 76, 50]], 2: [[50, 42, 28], [50, 108, 28]], 3: [[50, 34, 25], [50, 75, 25], [50, 116, 25]],
    4: [[32, 44, 25], [68, 44, 25], [32, 106, 25], [68, 106, 25]],
    5: [[31, 38, 23], [69, 38, 23], [50, 75, 23], [31, 112, 23], [69, 112, 23]],
    6: [[32, 36, 22], [68, 36, 22], [32, 75, 22], [68, 75, 22], [32, 114, 22], [68, 114, 22]],
    7: [[32, 33, 21], [68, 33, 21], [50, 54, 21], [32, 76, 21], [68, 76, 21], [32, 117, 21], [68, 117, 21]]
  }
};
// [x, y, largo, giro, espejo]
const X = (y, l, a) => [[50, y, l, -a, 1], [50, y, l, a, -1]];
const TALL = {
  1: [[50, 76, 112, 0, 1]],
  2: X(75, 118, 22),
  3: [...X(75, 118, 24), [50, 75, 112, 0, 1]],
  4: [...X(46, 66, 30), ...X(104, 66, 30)],
  5: [[50, 75, 120, 0, 1, 's'], ...X(44, 62, 30), ...X(106, 62, 30)],
  6: [...X(36, 50, 32), ...X(75, 50, 32), ...X(114, 50, 32)],
  7: [[50, 75, 124, 0, 1, 's'], ...X(36, 50, 32), ...X(75, 50, 32), ...X(114, 50, 32)]
};
function pip(s, x, y, h, rot = 0, flip = 1, curved = false) {
  if (s === 'oro') return `<use href="#p-oro" x="${x - h / 2}" y="${y - h / 2}" width="${h}" height="${h}"/>`;
  if (s === 'copa') { const w = h * 40 / 60 * 1.3, hh = h * 1.3; return `<use href="#p-copa" x="${x - w / 2}" y="${y - hh / 2}" width="${w}" height="${hh}"/>`; }
  const asp = s === 'espada' ? .24 : .3, w = h * asp;
  const id = s === 'espada' ? (curved ? 'p-espadac' : 'p-espada') : 'p-basto';
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${flip} 1)"><use href="#${id}" x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}"/></g>`;
}
function frame(s) {
  const c = COL[s], g = GAPS[s];
  let d;
  if (!g) d = 'M9 9H91M9 141H91';
  else { const seg = [], L = 82, gap = 7, w = (L - gap * g) / (g + 1); for (let k = 0; k <= g; k++) { const a = 9 + k * (w + gap); seg.push(`M${a.toFixed(1)} 9H${(a + w).toFixed(1)}M${a.toFixed(1)} 141H${(a + w).toFixed(1)}`); } d = seg.join(''); }
  return `<g fill="none" stroke="${c}" stroke-width="1.5"><path d="${d}M9 9V141M91 9V141"/></g>`;
}
function corner(c) {
  const fs = c.n >= 10 ? 13 : 15;
  return `<g fill="${COL[c.s]}" font-family="Georgia,'Times New Roman',serif" font-weight="700" font-size="${fs}" text-anchor="middle"><text x="15" y="25">${c.n}</text><text x="85" y="137">${c.n}</text></g>`;
}

/* --- figuras --- */
const PAL = {
  oro:    { a: RED,   b: BLUE,  c: GREEN, hose: BLUE,  horse: '#f1ece0', hair: '#7a4a1e' },
  copa:   { a: BLUE,  b: RED,   c: GOLD,  hose: RED,   horse: '#a3672e', hair: '#3b2414' },
  espada: { a: RED,   b: GREEN, c: BLUE,  hose: GREEN, horse: '#d8d2c6', hair: '#5a3a1e' },
  basto:  { a: GREEN, b: RED,   c: BLUE,  hose: RED,   horse: '#6e4424', hair: '#a0682a' }
};
const st = `stroke="${INK}" stroke-width="1" stroke-linejoin="round"`;
function face(cx, cy, s, P, opt = {}) {
  // s = escala; cara mirando al frente con pelo
  const k = v => (v * s).toFixed(2);
  let h = `<g transform="translate(${cx} ${cy})">`;
  h += `<path d="M${k(-8.6)} ${k(2)}Q${k(-9.6)} ${k(-11)} 0 ${k(-11.4)}Q${k(9.6)} ${k(-11)} ${k(8.6)} ${k(2)}L${k(8.4)} ${k(10)}Q${k(6)} ${k(8)} ${k(5.6)} ${k(3)}L${k(-5.6)} ${k(3)}Q${k(-6)} ${k(8)} ${k(-8.4)} ${k(10)}z" fill="${P.hair}" ${st}/>`;
  h += `<ellipse cx="0" cy="0" rx="${k(6.6)}" ry="${k(8)}" fill="${SKIN}" ${st}/>`;
  h += `<path d="M${k(-6.4)} ${k(-3)}Q0 ${k(-9)} ${k(6.4)} ${k(-3)}Q${k(5)} ${k(-8.6)} 0 ${k(-8.6)}Q${k(-5)} ${k(-8.6)} ${k(-6.4)} ${k(-3)}z" fill="${P.hair}"/>`;
  h += `<path d="M${k(-4.4)} ${k(-1.6)}h${k(2.6)}M${k(1.8)} ${k(-1.6)}h${k(2.6)}" stroke="${INK}" stroke-width=".8"/>`;
  h += `<circle cx="${k(-3)}" cy="${k(0.4)}" r="${k(.9)}" fill="${INK}"/><circle cx="${k(3)}" cy="${k(0.4)}" r="${k(.9)}" fill="${INK}"/>`;
  h += `<path d="M0 ${k(1)}l${k(-1)} ${k(2.6)}h${k(1.6)}" stroke="#b0805a" stroke-width=".7" fill="none"/>`;
  h += `<ellipse cx="${k(-4)}" cy="${k(3)}" rx="${k(1.6)}" ry="${k(1)}" fill="#f0a08a" opacity=".6"/><ellipse cx="${k(4)}" cy="${k(3)}" rx="${k(1.6)}" ry="${k(1)}" fill="#f0a08a" opacity=".6"/>`;
  if (opt.beard) h += `<path d="M${k(-6.4)} ${k(1)}Q${k(-7)} ${k(13)} 0 ${k(15)}Q${k(7)} ${k(13)} ${k(6.4)} ${k(1)}Q${k(4)} ${k(6.6)} 0 ${k(6.8)}Q${k(-4)} ${k(6.6)} ${k(-6.4)} ${k(1)}z" fill="#e9e2d6" ${st}/><path d="M${k(-2.4)} ${k(5)}q${k(2.4)} ${k(-1.6)} ${k(4.8)} 0" stroke="${INK}" stroke-width=".7" fill="none"/>`;
  else h += `<path d="M${k(-1.8)} ${k(5)}q${k(1.8)} ${k(1.2)} ${k(3.6)} 0" stroke="#b5302a" stroke-width="1" fill="none" stroke-linecap="round"/>`;
  if (opt.crown) h += `<path d="M${k(-8)} ${k(-7)}L${k(-9)} ${k(-19)}L${k(-4.4)} ${k(-13)}L0 ${k(-21)}L${k(4.4)} ${k(-13)}L${k(9)} ${k(-19)}L${k(8)} ${k(-7)}z" fill="${GOLD}" stroke="#6b4300" stroke-width="1"/><path d="M${k(-8)} ${k(-8.6)}h${k(16)}" stroke="${RED}" stroke-width="${k(1.6)}"/><circle cx="0" cy="${k(-13)}" r="${k(1.5)}" fill="${RED}"/><circle cx="${k(-9)}" cy="${k(-19)}" r="${k(1.2)}" fill="${GOLD}" stroke="#6b4300" stroke-width=".6"/><circle cx="0" cy="${k(-21)}" r="${k(1.2)}" fill="${GOLD}" stroke="#6b4300" stroke-width=".6"/><circle cx="${k(9)}" cy="${k(-19)}" r="${k(1.2)}" fill="${GOLD}" stroke="#6b4300" stroke-width=".6"/>`;
  if (opt.hat) h += `<path d="M${k(-10.5)} ${k(-6)}Q${k(-11)} ${k(-15)} 0 ${k(-15)}Q${k(11)} ${k(-15)} ${k(10.5)} ${k(-6)}Q0 ${k(-9)} ${k(-10.5)} ${k(-6)}z" fill="${opt.hat}" ${st}/><path d="M${k(-11)} ${k(-6)}Q0 ${k(-10)} ${k(11)} ${k(-6)}" stroke="${GOLD}" stroke-width="${k(1.6)}" fill="none"/><path d="M${k(5)} ${k(-14)}q${k(9)} ${k(-8)} ${k(14)} ${k(-3)}q${k(-6)} ${k(-1)} ${k(-12)} ${k(5)}z" fill="#fff" ${st}/>`;
  return h + '</g>';
}
function standing(c, king) {
  const P = PAL[c.s];
  let h = '';
  if (king) h += `<path d="M36 52Q22 98 22 136H78Q78 98 64 52z" fill="${P.b}" ${st}/><path d="M36 52Q22 98 22 136H78Q78 98 64 52z" fill="url(#g-tela)"/>`;
  // piernas (la sota muestra las calzas)
  if (!king) h += `<path d="M42 98l-2 33h6l3-33zM51 98l3 33h6l-2-33z" fill="${P.hose}" ${st}/><ellipse cx="42.5" cy="132.5" rx="5" ry="2.6" fill="${INK}"/><ellipse cx="57.5" cy="132.5" rx="5" ry="2.6" fill="${INK}"/>`;
  // túnica
  const hem = king ? 134 : 100;
  h += `<path d="M38.5 52Q50 47 61.5 52L${king ? 67 : 68} ${hem}Q50 ${hem + 5} ${king ? 33 : 32} ${hem}z" fill="${P.a}" ${st}/><path d="M38.5 52Q50 47 61.5 52L${king ? 67 : 68} ${hem}Q50 ${hem + 5} ${king ? 33 : 32} ${hem}z" fill="url(#g-tela)"/>`;
  h += `<path d="M46 51h8l${king ? 1.6 : 2} ${hem - 51}h-${king ? 11.2 : 12}z" fill="${king ? '#fbf7ee' : P.c}" ${st}/>`;
  if (king) for (let y = 58; y < 130; y += 9) h += `<path d="M50 ${y}l-1 2.4h2z" fill="${INK}"/>`;
  else h += `<path d="M47 60h6M46.6 70h6.8M46.2 88h7.6" stroke="${GOLD}" stroke-width="1.4"/>`;
  h += `<path d="M${king ? 34 : 33} ${hem - 1}Q50 ${hem + 4} ${king ? 66 : 67} ${hem - 1}" stroke="${GOLD}" stroke-width="2" fill="none"/>`;
  h += `<rect x="37" y="76" width="26" height="4.4" rx="1.4" fill="${GOLD}" stroke="#6b4300" stroke-width=".8"/><rect x="47.6" y="75.4" width="4.8" height="5.6" rx="1" fill="${RED}" stroke="#6b4300" stroke-width=".7"/>`;
  // brazo izquierdo (en la cadera)
  h += `<path d="M39 53Q30 60 31 79l5.6 1Q36 66 42 59z" fill="${P.b}" ${st}/><path d="M31 77l5.6 1" stroke="${GOLD}" stroke-width="1.6"/><circle cx="34" cy="82" r="3.4" fill="${SKIN}" ${st}/>`;
  // cuello y gorguera
  h += `<rect x="47" y="43" width="6" height="7" fill="${SKIN}" ${st}/><path d="M39 50q11 5 22 0q-1 4-11 5q-10-1-11-5z" fill="#fff" ${st}/>`;
  // brazo derecho que sostiene el palo
  const up = c.s === 'espada' || c.s === 'basto';
  h += up ? `<path d="M61 53Q70 54 72 62l-4.6 3Q66 59 59 59z" fill="${P.b}" ${st}/><circle cx="70.4" cy="64.6" r="3.4" fill="${SKIN}" ${st}/>`
          : `<path d="M61 53Q71 58 71 70l-5 1Q65 62 59 59z" fill="${P.b}" ${st}/><circle cx="68.6" cy="72" r="3.4" fill="${SKIN}" ${st}/>`;
  h += face(50, 34, 1, P, king ? { crown: 1, beard: 1 } : { hat: P.b });
  // el palo
  if (c.s === 'oro') h += pip('oro', 72, 62, 20);
  else if (c.s === 'copa') h += pip('copa', 73, 60, 18);
  else if (c.s === 'espada') h += pip('espada', 72, 44, 64, 8, 1);
  else h += pip('basto', 74, 46, 58, 14, 1);
  return h;
}
function rider(c) {
  const P = PAL[c.s], hc = P.horse, dk = c.s === 'basto' || c.s === 'copa' ? '#3a2412' : '#6b5a48';
  let h = '';
  // cola y patas traseras de fondo
  h += `<path d="M82 92q10 4 8 30q-3-10-9-22z" fill="${dk}" ${st}/>`;
  h += `<path d="M74 104l4 30h5l-3-31z" fill="${hc}" ${st}/><path d="M33 106l-6 28h5l7-26z" fill="${hc}" ${st}/>`;
  // cuerpo
  h += `<path d="M24 100Q22 84 38 82L70 80Q86 82 86 98Q86 108 78 110L32 112Q24 110 24 100z" fill="${hc}" ${st}/>`;
  // cuello y cabeza mirando a la izquierda
  h += `<path d="M30 92Q24 76 21 64Q19 56 25 55Q33 56 37 66L44 84z" fill="${hc}" ${st}/>`;
  h += `<path d="M25 55Q16 57 11 66Q9.6 71 14 72L22 70Q27 66 27 60z" fill="${hc}" ${st}/><circle cx="20" cy="61" r="1.2" fill="${INK}"/><path d="M12.6 69.4l2.4-.6" stroke="${INK}" stroke-width=".8"/>`;
  h += `<path d="M24 55l1-6 3 5z" fill="${hc}" ${st}/>`;
  h += `<path d="M27 54Q36 60 42 80Q37 66 31 58z" fill="${dk}"/>`;
  // patas delanteras y traseras
  h += `<path d="M38 108l-2 26h5l3-26zM66 108l2 26h5l-1-26z" fill="${hc}" ${st}/>`;
  [[38.5, 134], [70.5, 134], [29.5, 134], [80.5, 134]].forEach(([x, y]) => h += `<rect x="${x - 3}" y="${y - 1}" width="6" height="3.4" rx="1" fill="${INK}"/>`);
  // manta y arreos
  h += `<path d="M44 80L68 79L70 104L42 105z" fill="${P.b}" ${st}/><path d="M43 103L70 102" stroke="${GOLD}" stroke-width="2"/><path d="M44 82L68 81" stroke="${GOLD}" stroke-width="1.4"/>`;
  h += `<path d="M15 64Q30 66 50 70" stroke="#5a2e12" stroke-width="1.2" fill="none"/><path d="M14 66q6 3 12 1" stroke="#5a2e12" stroke-width="1.2" fill="none"/>`;
  // jinete
  h += `<path d="M52 84l-3 20l6 2l4-22z" fill="${P.hose}" ${st}/><ellipse cx="51" cy="106" rx="4.6" ry="2.4" fill="${INK}"/>`;
  h += `<path d="M47 56Q56 52 65 56L67 86L45 86z" fill="${P.a}" ${st}/><path d="M47 56Q56 52 65 56L67 86L45 86z" fill="url(#g-tela)"/>`;
  h += `<path d="M53 55h6l1 31h-8z" fill="${P.c}" ${st}/><rect x="45" y="72" width="22" height="3.6" rx="1.2" fill="${GOLD}" stroke="#6b4300" stroke-width=".7"/>`;
  h += `<path d="M47 58Q41 64 45 72l4-1Q47 66 50 62z" fill="${P.b}" ${st}/><circle cx="47.6" cy="71.6" r="2.8" fill="${SKIN}" ${st}/>`;
  h += `<rect x="53.4" y="46" width="5.2" height="6" fill="${SKIN}" ${st}/><path d="M47 53q9 4 18 0q-1 3-9 4q-8-1-9-4z" fill="#fff" ${st}/>`;
  const up = c.s === 'espada' || c.s === 'basto';
  h += `<path d="M64 56Q72 56 74 ${up ? 50 : 62}l-4 ${up ? -2 : 3}Q68 60 62 61z" fill="${P.b}" ${st}/><circle cx="${up ? 73 : 72.4}" cy="${up ? 48.6 : 64}" r="3" fill="${SKIN}" ${st}/>`;
  h += face(56, 38, .86, P, { hat: P.b });
  if (c.s === 'oro') h += pip('oro', 76, 54, 18);
  else if (c.s === 'copa') h += pip('copa', 77, 54, 16);
  else if (c.s === 'espada') h += pip('espada', 76, 30, 56, 14, 1);
  else h += pip('basto', 77, 32, 50, 18, 1);
  return h;
}
function ace(c) {
  let h = '';
  if (c.s === 'espada') {
    h += `<g stroke="#2a5a1a" stroke-width=".8">${[-1, 1].map(sd => [0, 1, 2, 3, 4].map(k => `<ellipse cx="${50 + sd * (13 + k * 1.2)}" cy="${102 - k * 9}" rx="2.6" ry="5.4" fill="${k % 2 ? '#5e9a3a' : '#3d8a3a'}" transform="rotate(${sd * (-30 + k * 9)} ${50 + sd * (13 + k * 1.2)} ${102 - k * 9})"/>`).join('')).join('')}</g>`;
    h += `<path d="M36 108q14 10 28 0l-2 6q-12 7-24 0z" fill="${RED}" stroke="#6b1410" stroke-width=".8"/>`;
    h += pip('espada', 50, 74, 116);
    h += `<path d="M42 14l2-6 3 4 3-6 3 6 3-4 2 6z" fill="${GOLD}" stroke="#6b4300" stroke-width=".8"/>`;
  } else if (c.s === 'basto') {
    h += pip('basto', 50, 76, 112);
    h += `<g stroke="#2a5a1a" stroke-width=".8"><ellipse cx="38" cy="36" rx="3" ry="6.4" fill="#5e9a3a" transform="rotate(-40 38 36)"/><ellipse cx="63" cy="56" rx="3" ry="6.4" fill="#3d8a3a" transform="rotate(40 63 56)"/><ellipse cx="36" cy="88" rx="2.6" ry="5.6" fill="#3d8a3a" transform="rotate(-50 36 88)"/></g>`;
  } else if (c.s === 'oro') {
    h += `<circle cx="50" cy="76" r="32" fill="none" stroke="${RED}" stroke-width="1" stroke-dasharray="1.5 3"/>` + pip('oro', 50, 76, 56);
  } else h += pip('copa', 50, 74, 52);
  return h;
}
function svg(c) {
  let body;
  if (c.n === 1) body = ace(c);
  else if (c.n <= 7) {
    if (c.s === 'oro' || c.s === 'copa') body = ROUND[c.s][c.n].map(([x, y, h]) => pip(c.s, x, y, h)).join('');
    else body = TALL[c.n].map(([x, y, l, r, f, k]) => pip(c.s, x, y, l, r, f, c.s === 'espada' && c.n > 1 && !k)).join('');
  } else if (c.n === 11) body = rider(c);
  else body = standing(c, c.n === 12);
  return `<svg viewBox="0 0 100 150" class="cs" aria-hidden="true"><rect x="1" y="1" width="98" height="148" rx="8" fill="#fdfbf4"/>${frame(c.s)}${body}${corner(c)}</svg>`;
}
function back() {
  return `<svg viewBox="0 0 100 150" class="cs" aria-hidden="true"><rect x="1" y="1" width="98" height="148" rx="8" fill="#fdfbf4"/><rect x="6" y="6" width="88" height="138" rx="5" fill="url(#dorso)"/><rect x="9" y="9" width="82" height="132" rx="4" fill="none" stroke="#e9c46a" stroke-width="1.2"/><ellipse cx="50" cy="75" rx="22" ry="30" fill="#162e5c" stroke="#e9c46a" stroke-width="2"/><use href="#p-oro" x="38" y="63" width="24" height="24"/></svg>`;
}
const label = c => ({ 1: 'As', 10: 'Sota', 11: 'Caballo', 12: 'Rey' }[c.n] || c.n) + ' de ' + c.s;
root.Naipes = { inject, svg, back, COL, label };
})(typeof window !== 'undefined' ? window : globalThis);
