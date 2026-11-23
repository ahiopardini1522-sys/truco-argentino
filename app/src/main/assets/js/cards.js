/* Naipes españoles dibujados en SVG: pintas, palos y figuras (sota, caballo, rey). */
(function (root) {
'use strict';
const COL = { oro: '#c98f12', copa: '#c3302a', espada: '#2759a3', basto: '#3c7a2a' };
const GAPS = { oro: 0, copa: 1, espada: 2, basto: 3 };

const DEFS = `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>
<radialGradient id="g-oro" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#ffe9a3"/><stop offset=".55" stop-color="#f0bb33"/><stop offset="1" stop-color="#b47a0c"/></radialGradient>
<linearGradient id="g-copa" x1="0" x2="1"><stop offset="0" stop-color="#e0574c"/><stop offset=".5" stop-color="#c3302a"/><stop offset="1" stop-color="#8e1d18"/></linearGradient>
<linearGradient id="g-hoja" x1="0" x2="1"><stop offset="0" stop-color="#e8f0fa"/><stop offset=".5" stop-color="#b9cce6"/><stop offset="1" stop-color="#7f9cc7"/></linearGradient>
<linearGradient id="g-palo" x1="0" x2="1"><stop offset="0" stop-color="#9cc46a"/><stop offset=".55" stop-color="#5f9a3a"/><stop offset="1" stop-color="#346020"/></linearGradient>
<pattern id="dorso" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="10" height="10" fill="#9b2620"/><rect width="5" height="5" fill="#b8352c"/><circle cx="7.5" cy="7.5" r="1.2" fill="#e9c46a"/></pattern>
<symbol id="p-oro" viewBox="0 0 40 40"><circle cx="20" cy="20" r="18.5" fill="url(#g-oro)" stroke="#8a5b06" stroke-width="1.6"/><circle cx="20" cy="20" r="12.5" fill="none" stroke="#8a5b06" stroke-width="1.2"/><g stroke="#8a5b06" stroke-width="1.1">${[0,45,90,135].map(a=>`<line x1="20" y1="9" x2="20" y2="31" transform="rotate(${a} 20 20)"/>`).join('')}</g><circle cx="20" cy="20" r="5" fill="#f7cf55" stroke="#8a5b06" stroke-width="1.2"/></symbol>
<symbol id="p-copa" viewBox="0 0 40 56"><path d="M5 6h30q2 20-11 25v9q6 1 9 5v4H7v-4q3-4 9-5v-9Q3 26 5 6z" fill="url(#g-copa)" stroke="#6e1410" stroke-width="1.6" stroke-linejoin="round"/><path d="M7 11h26" stroke="#f3c94e" stroke-width="2.6"/><path d="M14 40h12" stroke="#f3c94e" stroke-width="2"/><ellipse cx="20" cy="6.5" rx="15" ry="2.4" fill="#f3c94e" stroke="#6e1410" stroke-width="1"/></symbol>
<symbol id="p-espada" viewBox="0 0 24 80"><path d="M12 1l5 8v44h-10V9z" fill="url(#g-hoja)" stroke="#173a73" stroke-width="1.3" stroke-linejoin="round"/><path d="M12 6v46" stroke="#5c7fb3" stroke-width="1"/><path d="M1 53q11 5 22 0v4q-11 4-22 0z" fill="#e2b13c" stroke="#7a5408" stroke-width="1.1"/><rect x="9.5" y="58" width="5" height="14" rx="1.5" fill="#173a73"/><circle cx="12" cy="75" r="3.6" fill="#e2b13c" stroke="#7a5408" stroke-width="1"/></symbol>
<symbol id="p-basto" viewBox="0 0 26 80"><path d="M9 78Q5 40 6 10Q13 -1 21 9q2 34-4 69z" fill="url(#g-palo)" stroke="#24460f" stroke-width="1.4" stroke-linejoin="round"/><g fill="#24460f"><ellipse cx="10" cy="24" rx="2.2" ry="3"/><ellipse cx="17" cy="38" rx="2" ry="3"/><ellipse cx="10.5" cy="52" rx="2" ry="2.8"/><ellipse cx="15" cy="65" rx="1.8" ry="2.6"/></g><path d="M8 14q3-6 8-4" stroke="#c7e39b" stroke-width="1.6" fill="none"/></symbol>
</defs></svg>`;

function inject(doc) { if (doc.getElementById('p-oro')) return; const d = doc.createElement('div'); d.innerHTML = DEFS; doc.body.prepend(d.firstChild); }

const ROUND = {
  1: [[50, 75, 54]], 2: [[50, 42, 30], [50, 108, 30]], 3: [[50, 34, 27], [50, 75, 27], [50, 116, 27]],
  4: [[32, 44, 27], [68, 44, 27], [32, 106, 27], [68, 106, 27]],
  5: [[30, 40, 25], [70, 40, 25], [50, 75, 25], [30, 110, 25], [70, 110, 25]],
  6: [[32, 36, 24], [68, 36, 24], [32, 75, 24], [68, 75, 24], [32, 114, 24], [68, 114, 24]],
  7: [[32, 34, 23], [68, 34, 23], [50, 55, 23], [32, 75, 23], [68, 75, 23], [32, 116, 23], [68, 116, 23]]
};
const TALL = {
  1: [[50, 75, 104]], 2: [[40, 75, 84, -18], [60, 75, 84, 18]], 3: [[30, 75, 72], [50, 75, 72], [70, 75, 72]],
  4: [[34, 46, 50], [66, 46, 50], [34, 104, 50], [66, 104, 50]],
  5: [[28, 46, 48], [72, 46, 48], [50, 75, 52], [28, 104, 48], [72, 104, 48]],
  6: [[28, 46, 48], [50, 46, 48], [72, 46, 48], [28, 104, 48], [50, 104, 48], [72, 104, 48]],
  7: [[28, 38, 40], [50, 38, 40], [72, 38, 40], [50, 75, 26, 90], [28, 112, 40], [50, 112, 40], [72, 112, 40]]
};
function pip(s, x, y, h, rot) {
  if (s === 'oro') return `<use href="#p-oro" x="${x - h / 2}" y="${y - h / 2}" width="${h}" height="${h}"/>`;
  if (s === 'copa') { const w = h * 40 / 56 * 1.25, hh = h * 1.25; return `<use href="#p-copa" x="${x - w / 2}" y="${y - hh / 2}" width="${w}" height="${hh}"/>`; }
  const w = h * 26 / 80, id = s === 'espada' ? 'p-espada' : 'p-basto';
  return `<use href="#${id}" x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}"${rot ? ` transform="rotate(${rot} ${x} ${y})"` : ''}/>`;
}
function frame(s) {
  const c = COL[s], g = GAPS[s];
  // marco interior con las "pintas": cortes que identifican el palo
  let top = '';
  if (!g) top = `<path d="M9 9H91M9 141H91"/>`;
  else {
    const seg = [], L = 82, gap = 7, w = (L - gap * g) / (g + 1);
    for (let k = 0; k <= g; k++) { const a = 9 + k * (w + gap); seg.push(`M${a} 9H${a + w}M${a} 141H${a + w}`); }
    top = `<path d="${seg.join('')}"/>`;
  }
  return `<g fill="none" stroke="${c}" stroke-width="1.6">${top}<path d="M9 9V141M91 9V141"/></g>`;
}
function figure(c) {
  const col = COL[c.s], n = c.n;
  const skin = '#f1cfa8', dark = '#2a2019';
  const robe2 = { oro: '#7b3f9b', copa: '#2e6a3e', espada: '#b8432f', basto: '#c48a1f' }[c.s];
  let art = `<rect x="15" y="17" width="70" height="116" rx="3" fill="#fbf0d9"/>`;
  if (n === 11) {
    // caballo
    art += `<path d="M22 118q-2-22 10-30q14-6 30-2q10 2 14-8q3-8 9-6q4 3 1 12q-3 10-10 14q4 8 2 20z" fill="#efe7d6" stroke="${dark}" stroke-width="1.4"/>
      <path d="M78 70q6-2 8 3l-4 6" fill="#efe7d6" stroke="${dark}" stroke-width="1.3"/><circle cx="80.5" cy="72.5" r="1.2" fill="${dark}"/>
      <path d="M70 76q4 6 2 10" stroke="${col}" stroke-width="2" fill="none"/>
      <path d="M30 118v12M44 118v12M62 118v12M72 116v14" stroke="${dark}" stroke-width="3" stroke-linecap="round"/>
      <path d="M38 88q2-26 12-30q12 2 12 30z" fill="${col}" stroke="${dark}" stroke-width="1.3"/>
      <path d="M40 88q10 6 22 0v6q-11 5-22 0z" fill="${robe2}"/>
      <circle cx="50" cy="47" r="8" fill="${skin}" stroke="${dark}" stroke-width="1.2"/>
      <path d="M41 44q9-12 18 0q-3-3-9-3t-9 3z" fill="${robe2}" stroke="${dark}" stroke-width="1"/>`;
    art += pip(c.s, 68, 46, c.s === 'oro' ? 16 : c.s === 'copa' ? 16 : 32, c.s === 'espada' || c.s === 'basto' ? 25 : 0);
  } else {
    const king = n === 12;
    art += `<path d="M30 132q-2-46 8-62q12-8 24 0q10 16 8 62z" fill="${col}" stroke="${dark}" stroke-width="1.4"/>
      <path d="M34 132q2-30 16-40q14 10 16 40z" fill="${robe2}" opacity=".9"/>
      <path d="M38 76q12 8 24 0" stroke="#f4d36b" stroke-width="3" fill="none"/>
      <circle cx="50" cy="56" r="10" fill="${skin}" stroke="${dark}" stroke-width="1.3"/>
      <circle cx="46.5" cy="55" r="1.1" fill="${dark}"/><circle cx="53.5" cy="55" r="1.1" fill="${dark}"/>`;
    if (king) art += `<path d="M42 62q8 12 16 0q-2 8-8 10q-6-2-8-10z" fill="#e9e4da" stroke="${dark}" stroke-width="1"/>
      <path d="M39 47l3-12 5 7 3-9 3 9 5-7 3 12z" fill="#f2c13e" stroke="#7a5408" stroke-width="1.2"/>
      <path d="M30 132q-6-30 4-58l-6 2q-8 30-2 56z" fill="${robe2}" stroke="${dark}" stroke-width="1"/>`;
    else art += `<path d="M38 50q2-12 12-12q11 0 13 10q-4-3-13-3q-8 0-12 5z" fill="${robe2}" stroke="${dark}" stroke-width="1.1"/><circle cx="62" cy="45" r="2.5" fill="#f4d36b"/>`;
    art += `<path d="M66 84l8 6" stroke="${skin}" stroke-width="4" stroke-linecap="round"/>`;
    art += pip(c.s, 74, c.s === 'oro' || c.s === 'copa' ? 82 : 76, c.s === 'oro' ? 18 : c.s === 'copa' ? 18 : 40, c.s === 'espada' || c.s === 'basto' ? 12 : 0);
  }
  return art;
}
function corner(c) {
  const col = COL[c.s];
  return `<g fill="${col}" font-family="'Alfa Slab One',Georgia,serif" font-size="17" text-anchor="middle"><text x="16" y="25">${c.n}</text><text x="84" y="137" transform="rotate(180 84 131)">${c.n}</text></g>`;
}
function svg(c) {
  let body = '';
  if (c.n <= 7) {
    const tall = c.s === 'espada' || c.s === 'basto';
    const L = (tall ? TALL : ROUND)[c.n];
    if (c.n === 1 && c.s === 'espada') body += `<ellipse cx="50" cy="75" rx="30" ry="56" fill="#eef3fb" stroke="#2759a3" stroke-width="1" stroke-dasharray="2 3"/>`;
    if (c.n === 1 && c.s === 'basto') body += `<ellipse cx="50" cy="75" rx="30" ry="56" fill="#f0f6e8" stroke="#3c7a2a" stroke-width="1" stroke-dasharray="2 3"/>`;
    body += L.map(([x, y, h, r]) => pip(c.s, x, y, h, r)).join('');
  } else body = figure(c);
  return `<svg viewBox="0 0 100 150" class="cs" aria-hidden="true"><rect x="1" y="1" width="98" height="148" rx="8" fill="#fdfaf1"/>${frame(c.s)}${body}${corner(c)}</svg>`;
}
function back() {
  return `<svg viewBox="0 0 100 150" class="cs" aria-hidden="true"><rect x="1" y="1" width="98" height="148" rx="8" fill="#fdfaf1"/><rect x="6" y="6" width="88" height="138" rx="5" fill="url(#dorso)"/><rect x="6" y="6" width="88" height="138" rx="5" fill="none" stroke="#e9c46a" stroke-width="1.5"/><ellipse cx="50" cy="75" rx="20" ry="28" fill="#7c1b16" stroke="#e9c46a" stroke-width="2"/><text x="50" y="84" text-anchor="middle" font-family="'Alfa Slab One',Georgia,serif" font-size="24" fill="#e9c46a">T</text></svg>`;
}
const SUITNAME = { oro: 'oro', copa: 'copa', espada: 'espada', basto: 'basto' };
const label = c => ({ 1: 'Ancho', 10: 'Sota', 11: 'Caballo', 12: 'Rey' }[c.n] ? ({ 1: 'As', 10: 'Sota', 11: 'Caballo', 12: 'Rey' }[c.n]) : c.n) + ' de ' + SUITNAME[c.s];
root.Naipes = { inject, svg, back, COL, label };
})(typeof window !== 'undefined' ? window : globalThis);
