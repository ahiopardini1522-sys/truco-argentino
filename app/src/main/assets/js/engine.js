/* Motor del Truco argentino: 2 o 4 jugadores en dos equipos, envido, flor, truco.
   Sin DOM: la interfaz se conecta por Truco.hooks. */
(function (root) {
'use strict';
const SUITS = ['espada', 'basto', 'oro', 'copa'], NUMS = [1, 2, 3, 4, 5, 6, 7, 10, 11, 12];
const DECK = []; SUITS.forEach(s => NUMS.forEach(n => DECK.push({ n, s, id: n + s })));
function str(c) {
  const n = c.n, s = c.s;
  if (n === 1 && s === 'espada') return 14; if (n === 1 && s === 'basto') return 13;
  if (n === 7 && s === 'espada') return 12; if (n === 7 && s === 'oro') return 11;
  return { 3: 10, 2: 9, 1: 8, 12: 7, 11: 6, 10: 5, 7: 4, 6: 3, 5: 2, 4: 1 }[n];
}
const ev = c => c.n >= 10 ? 0 : c.n;
function envPts(h) {
  if (!h.length) return 0;
  let b = Math.max(...h.map(ev));
  for (let i = 0; i < h.length; i++) for (let j = i + 1; j < h.length; j++) if (h[i].s === h[j].s) b = Math.max(b, 20 + ev(h[i]) + ev(h[j]));
  return b;
}
const hasFlor = h => h.length === 3 && h[0].s === h[1].s && h[1].s === h[2].s;
const florPts = h => 20 + h.reduce((s, c) => s + ev(c), 0);
const TL = { 2: 'Truco', 3: 'Retruco', 4: 'Vale cuatro' };
const TN = { 2: '¡Truco!', 3: '¡Quiero retruco!', 4: '¡Quiero vale cuatro!' };
const EV = { E: 2, R: 3 }, EN = { E: 'Envido', R: 'Real envido', F: 'Falta envido' };
const DIFF = {
  facil:   { samples: 25,  noise: .25, bluff: .02, envBluff: .03, smart: false, rnd: .35, acc: .52, call: .74, envAdj: 2 },
  normal:  { samples: 70,  noise: .08, bluff: .07, envBluff: .07, smart: false, rnd: 0,   acc: .38, call: .62, envAdj: 0 },
  dificil: { samples: 220, noise: 0,   bluff: .07, envBluff: .10, smart: true,  rnd: 0,   acc: 0,   call: .62, envAdj: 0 }
};
const ENVD = (() => { const d = new Array(34).fill(0); let N = 0; const deck = DECK.slice();
  for (let t = 0; t < 12000; t++) { for (let k = 0; k < 3; k++) { const j = k + Math.floor(Math.random() * (40 - k)); [deck[k], deck[j]] = [deck[j], deck[k]]; } d[envPts(deck.slice(0, 3))]++; N++; }
  return d.map(x => x / N); })();
// probabilidad de ganar el envido con e, si el rival cantó (b = cuánto miente)
function envWin(e, called, b) {
  let hi = 0, lo = 0, wHi = 0, wLo = 0;
  ENVD.forEach((p, v) => { const w = v < e ? 1 : v === e ? .5 : 0; if (v >= 26) { hi += p; wHi += p * w; } else { lo += p; wLo += p * w; } });
  if (!called) return wHi + wLo;
  return (1 - b) * (wHi / hi) + b * (wLo / lo);
}
const SENAS = [
  { t: c => c.n === 1 && c.s === 'espada', s: 'Levanta las cejas', m: 'ancho de espada' },
  { t: c => c.n === 1 && c.s === 'basto', s: 'Guiña un ojo', m: 'ancho de basto' },
  { t: c => c.n === 7 && c.s === 'espada', s: 'Tuerce la boca a la derecha', m: 'siete de espada' },
  { t: c => c.n === 7 && c.s === 'oro', s: 'Tuerce la boca a la izquierda', m: 'siete de oro' },
  { t: c => c.n === 3, s: 'Muerde el labio', m: 'un tres' },
  { t: c => c.n === 2, s: 'Hace trompita', m: 'un dos' }
];

const H = {
  render() {}, say() {}, sound() {}, deal() {}, play() {}, roundEnd() {}, handEnd() {}, matchEnd() {},
  senas() {}, loadStats() { return null; }, saveStats() {}
};
let sched = (f, ms) => setTimeout(f, ms);
let rand = Math.random;
let G = null;

const team = i => i % 2;
const n = () => G.n;
function name(i) { return G.names[i]; }
function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function responderOf(by) { const r = (by + 1) % n(); return team(r) === 0 ? 0 : r; }
function order() { const o = []; for (let k = 0; k < n(); k++) o.push((G.mano + k) % n()); return o; }
function teamName(t) { return G.n === 2 ? (t === 0 ? 'Vos' : G.names[1]) : (t === 0 ? 'Nosotros' : 'Ellos'); }

/* ---------- Partida y mano ---------- */
function newMatch(cfg) {
  const nn = cfg.mode === '2v2' ? 4 : 2;
  G = {
    cfg, n: nn, score: [0, 0], over: false, hands: 0,
    names: nn === 2 ? ['Vos', 'El Tano'] : ['Vos', 'El Tano', 'Cacho', 'Pocho'],
    mano: Math.floor(rand() * nn), log: [],
    stats: Object.assign({ envCalls: 0, envBluffs: 0, trCalls: 0, trBluffs: 0 }, H.loadStats() || {})
  };
  newHand();
}
function newHand() {
  if (!G || G.over) return;
  G.hands++;
  G.mano = (G.mano + 1) % n();
  const d = shuffle(DECK.map(c => ({ ...c })));
  G.hand = []; G.orig = [];
  for (let i = 0; i < n(); i++) { G.hand[i] = d.slice(i * 3, i * 3 + 3); G.orig[i] = [...G.hand[i]]; }
  G.played = [0, 1, 2].map(() => new Array(n()).fill(null));
  G.round = 0; G.results = []; G.roundWin = []; G.turn = G.mano;
  G.truco = { lvl: 1, owner: null };
  G.env = { done: false, decl: {} };
  G.flor = { sung: new Array(n()).fill(false), done: false };
  G.pending = null; G.saved = null; G.handOver = false; G.ended = false; G.awards = []; G.tried = {};
  G.note = ''; G.say = new Array(n()).fill(''); G.calls = [];
  if (n() === 4) H.senas(senasOf(2));
  H.deal();
  H.sound('deal');
  sched(continueTurn, 900);
}
function senasOf(i) {
  const h = G.orig[i], out = [];
  if (G.cfg.flor && hasFlor(h)) out.push({ s: 'Infla los cachetes', m: 'tiene flor' });
  h.forEach(c => { const x = SENAS.find(k => k.t(c)); if (x) out.push({ s: x.s, m: x.m }); });
  const e = envPts(h);
  if (e >= 27 && !(G.cfg.flor && hasFlor(h))) out.push({ s: 'Inclina la cabeza', m: 'tiene ' + e + ' de envido' });
  if (!out.length) out.push({ s: 'Cierra los ojos', m: 'no tiene nada' });
  return out;
}
function say(i, t) { G.say = new Array(n()).fill(''); G.say[i] = t; H.say(i, t); }
function award(t, pts, why) { G.score[t] += pts; G.awards.push({ t, pts, why }); H.sound('point'); }
function checkMatch() {
  if (G.score[0] >= G.cfg.target || G.score[1] >= G.cfg.target) {
    G.over = true; G.handOver = true; G.pending = null; learn(); H.render();
    sched(() => H.matchEnd(G.score[0] >= G.cfg.target ? 0 : 1), 1200); return true;
  }
  return false;
}
function endHand(t, why) {
  if (G.ended) return; G.ended = true;
  award(t, G.truco.lvl, why); G.handOver = true; G.pending = null;
  if (checkMatch()) return;
  learn(); H.render(); sched(() => H.handEnd(), 1100);
}
function continueTurn() {
  if (!G || G.over) return;
  H.render();
  if (G.handOver || G.pending) return;
  const i = G.turn;
  if (mustFlor(i)) { sched(() => { if (!G.handOver && !G.pending && G.turn === i && mustFlor(i)) singFlor(i); }, 650); return; }
  if (i !== 0) sched(() => AI.turn(i), 900);
}
function ask(j) {
  H.render();
  if (j !== 0) sched(() => AI.respond(j), 1150);
}

/* ---------- Truco ---------- */
function canRaiseTruco(i) { return G.truco.lvl < 4 && (G.truco.lvl === 1 || G.truco.owner === team(i)); }
function callTruco(i) {
  G.pending = { t: 'tr', by: i, lvl: G.truco.lvl + 1 };
  G.calls.push({ by: i, t: 'tr', lvl: G.pending.lvl });
  say(i, TN[G.pending.lvl]); H.sound('call');
  const r = responderOf(i);
  // la flor del rival va primero
  const fh = florHolderOf(team(r));
  if (G.pending.lvl === 2 && fh >= 0) { G.saved = G.pending; G.pending = null; sched(() => singFlor(fh), 1100); H.render(); return; }
  ask(r);
}
function respTruco(j, a) {
  const P = G.pending; if (!P || P.t !== 'tr') return;
  if (a === 'q') { G.truco.lvl = P.lvl; G.truco.owner = team(j); G.pending = null; say(j, '¡Quiero!'); continueTurn(); }
  else if (a === 'n') { say(j, 'No quiero'); endHand(team(P.by), TL[P.lvl] + ' no querido'); }
  else if (a === 'r' && P.lvl < 4) {
    G.truco.lvl = P.lvl; G.truco.owner = null;
    G.pending = { t: 'tr', by: j, lvl: P.lvl + 1 }; G.calls.push({ by: j, t: 'tr', lvl: P.lvl + 1 });
    say(j, TN[P.lvl + 1]); H.sound('call'); ask(responderOf(j));
  }
}

/* ---------- Envido ---------- */
function florBlocks(i) { return G.cfg.flor && hasFlor(G.orig[i]); }
function canEnvido(i) { return G.round === 0 && !G.env.done && G.truco.lvl === 1 && !florBlocks(i) && !G.flor.sung.some(x => x); }
function envOptions(ch) {
  if (!ch || !ch.length) return ['E', 'R', 'F'];
  const l = ch[ch.length - 1];
  if (l === 'F') return []; if (l === 'R') return ['F'];
  return ch.filter(k => k === 'E').length >= 2 ? ['R', 'F'] : ['E', 'R', 'F'];
}
function florHolderOf(t) {
  if (!G.cfg.flor || G.flor.done || G.round > 0) return -1;
  for (let i = 0; i < n(); i++) if (team(i) === t && hasFlor(G.orig[i]) && !G.flor.sung[i]) return i;
  return -1;
}
function callEnvido(i, k) {
  if (G.pending && G.pending.t === 'tr') { G.saved = G.pending; G.pending = null; }
  if (G.pending && G.pending.t === 'env') { G.pending.chain.push(k); G.pending.by = i; }
  else G.pending = { t: 'env', by: i, chain: [k] };
  G.calls.push({ by: i, t: 'env', k });
  say(i, '¡' + EN[k] + '!'); H.sound('call');
  const r = responderOf(i), fh = florHolderOf(team(r));
  if (fh >= 0) { G.pending = null; sched(() => singFlor(fh, true), 1100); H.render(); return; }
  ask(r);
}
function faltaPts(win) {
  const lead = Math.max(G.score[0], G.score[1]), T = G.cfg.target;
  if (T === 30 && lead < 15) return T - G.score[win];
  return T - lead;
}
function declare() {
  let best = -1, bt = -1, bp = -1; const decl = {}, parts = [];
  order().forEach(i => {
    const p = envPts(G.orig[i]);
    if (best < 0 || (team(i) !== bt && p > best)) { best = p; bt = team(i); bp = i; decl[i] = p; parts.push(name(i) + ': ' + p); }
    else if (team(i) !== bt) { decl[i] = 'b'; parts.push(name(i) + ': son buenas'); }
  });
  return { best, bt, bp, decl, text: parts.join(' · ') };
}
function respEnv(j, a) {
  const P = G.pending; if (!P || P.t !== 'env') return;
  const last = P.chain[P.chain.length - 1];
  if (a === 'q') {
    say(j, '¡Quiero!');
    const D = declare(); Object.assign(G.env.decl, D.decl);
    const pts = last === 'F' ? faltaPts(D.bt) : P.chain.reduce((s, k) => s + EV[k], 0);
    award(D.bt, pts, 'Envido (' + name(D.bp) + ' con ' + D.best + ')');
    G.note = D.text + ' → ' + teamName(D.bt) + ' +' + pts;
    H.say(D.bp, D.best + ' de envido');
    finishSide('env');
  } else if (a === 'n') {
    const pts = P.chain.length === 1 ? 1 : P.chain.slice(0, -1).reduce((s, k) => s + EV[k], 0);
    say(j, 'No quiero'); award(team(P.by), pts, EN[last] + ' no querido');
    G.note = teamName(team(P.by)) + ' +' + pts + ' por el envido';
    finishSide('env');
  } else if (envOptions(P.chain).includes(a)) callEnvido(j, a);
}
function finishSide(kind) {
  G.env.done = true; if (kind === 'flor') G.flor.done = true;
  G.pending = null;
  if (checkMatch()) return;
  if (G.saved) {
    G.pending = G.saved; G.saved = null; H.render();
    const b = G.pending.by;
    sched(() => {
      if (G.pending && !G.handOver) { say(b, 'Y el ' + TL[G.pending.lvl].toLowerCase() + ', ¿quieren?'); ask(responderOf(b)); }
    }, 1300);
  } else sched(continueTurn, 900);
}

/* ---------- Flor ---------- */
function mustFlor(i) { return G.cfg.flor && !G.flor.done && G.round === 0 && hasFlor(G.orig[i]) && !G.flor.sung[i] && !G.played[0][i]; }
function singFlor(i, overEnvido) {
  if (G.handOver || G.flor.sung[i]) return;
  G.flor.sung[i] = true; G.env.done = true; G.calls.push({ by: i, t: 'flor' });
  say(i, overEnvido ? '¡Flor! Se acabó el envido' : '¡Flor!'); H.sound('call');
  const opp = []; for (let k = 0; k < n(); k++) if (team(k) !== team(i) && hasFlor(G.orig[k]) && !G.flor.sung[k]) opp.push(k);
  if (opp.length && !G.flor.done) { G.pending = { t: 'flor', by: i, resp: opp[0] }; ask(opp[0]); return; }
  award(team(i), 3, 'Flor de ' + name(i));
  G.note = name(i) + ' cantó flor → ' + teamName(team(i)) + ' +3';
  // si el compañero también tiene flor, la cantará en su turno; la flor queda cerrada si no hay más
  const more = []; for (let k = 0; k < n(); k++) if (hasFlor(G.orig[k]) && !G.flor.sung[k]) more.push(k);
  if (!more.length) G.flor.done = true;
  if (checkMatch()) return;
  if (G.saved) { finishSide('florSolo'); return; }
  sched(continueTurn, 900);
}
function respFlor(j, a) {
  const P = G.pending; if (!P || P.t !== 'flor') return;
  for (let k = 0; k < n(); k++) if (hasFlor(G.orig[k])) G.flor.sung[k] = true;
  if (a === 'n') {
    say(j, 'Con flor me achico'); award(team(P.by), 4, 'Contraflor: ' + name(j) + ' se achicó');
    G.note = teamName(team(P.by)) + ' +4 por la flor';
  } else {
    say(j, a === 'r' ? '¡Contraflor al resto!' : '¡Contraflor!');
    let best = -1, bt = -1, bp = -1; const parts = [];
    order().forEach(k => { if (!hasFlor(G.orig[k])) return; const p = florPts(G.orig[k]); parts.push(name(k) + ': ' + p); if (p > best) { best = p; bt = team(k); bp = k; } });
    const pts = a === 'r' ? faltaPts(bt) : 6;
    award(bt, pts, 'Contraflor (' + name(bp) + ' con ' + best + ')');
    G.note = 'Flores — ' + parts.join(' · ') + ' → ' + teamName(bt) + ' +' + pts;
  }
  finishSide('flor');
}

/* ---------- Juego de cartas ---------- */
function mazo(i) { say(i, 'Me voy al mazo'); endHand(1 - team(i), name(i) + ' se fue al mazo'); }
function playCard(i, idx) {
  if (G.handOver || G.pending || G.turn !== i) return;
  if (mustFlor(i)) { singFlor(i); return; }
  const c = G.hand[i].splice(idx, 1)[0]; if (!c) return;
  G.played[G.round][i] = c; G.say[i] = '';
  H.play(i, c); H.sound('card');
  if (G.played[G.round].every(x => x)) resolveRound();
  else { G.turn = (i + 1) % n(); continueTurn(); }
}
function roundResult(row) {
  const b = [-1, -1], bp = [-1, -1];
  row.forEach((c, i) => { if (!c) return; const s = str(c), t = team(i); if (s > b[t]) { b[t] = s; bp[t] = i; } });
  if (b[0] > b[1]) return { r: 0, p: bp[0] };
  if (b[1] > b[0]) return { r: 1, p: bp[1] };
  return { r: 't', p: -1 };
}
function handWinnerOf(r, mano) {
  const a = r.filter(x => x === 0).length, b = r.filter(x => x === 1).length;
  if (a >= 2) return 0; if (b >= 2) return 1;
  if (r.length >= 2) { if (r[0] === 't' && r[1] !== 't') return r[1]; if (r[0] !== 't' && r[1] === 't') return r[0]; }
  if (r.length === 3) { if (a > b) return 0; if (b > a) return 1; return r[0] !== 't' ? r[0] : team(mano); }
  return null;
}
function resolveRound() {
  const R = roundResult(G.played[G.round]);
  G.results.push(R.r); G.roundWin.push(R.p);
  H.roundEnd(G.round, R);
  const w = handWinnerOf(G.results, G.mano);
  if (w !== null) {
    G.handOver = true; H.render();
    sched(() => endHand(w, 'Ganó las bazas' + (G.truco.lvl > 1 ? ' (' + TL[G.truco.lvl] + ')' : '')), 1000);
    return;
  }
  G.round++; G.turn = R.r === 't' ? G.mano : R.p;
  H.render(); sched(continueTurn, 700);
}

/* ---------- Aprende de tus cantos ---------- */
function learn() {
  if (G.learned === G.hands) return; G.learned = G.hands;
  const s = G.stats, h = G.orig[0];
  const avg = h.reduce((a, c) => a + str(c), 0) / 3;
  G.calls.forEach(c => {
    if (c.by !== 0) return;
    if (c.t === 'env') { s.envCalls++; if (envPts(h) < 25) s.envBluffs++; }
    if (c.t === 'tr') { s.trCalls++; if (avg < 6.5) s.trBluffs++; }
  });
  H.saveStats(s);
}
const bluffRate = (b, c) => (b + .5) / (c + 3);

/* ---------- Inteligencia ---------- */
const AI = {
  // ¿qué cartas conoce el jugador i? las suyas y, en 2v2, las del compañero (por las señas)
  sample(i) {
    const known = new Set(), fixed = {};
    G.orig[i].forEach(c => known.add(c.id));
    if (n() === 4) { const p = (i + 2) % 4; fixed[p] = G.hand[p].map(c => ({ ...c })); G.orig[p].forEach(c => known.add(c.id)); }
    G.played.forEach(row => row.forEach(c => c && known.add(c.id)));
    const unseen = DECK.filter(c => !known.has(c.id));
    let out = null;
    for (let tries = 0; tries < 30; tries++) {
      const pool = shuffle(unseen.slice()); let k = 0; const hs = {}; let ok = true;
      for (let j = 0; j < n(); j++) {
        if (j === i) { hs[j] = G.hand[i].map(c => ({ ...c })); continue; }
        if (fixed[j]) { hs[j] = fixed[j]; continue; }
        hs[j] = pool.slice(k, k + G.hand[j].length); k += G.hand[j].length;
        const full = hs[j].concat(G.played.map(r => r[j]).filter(Boolean));
        const d = G.env.decl[j];
        if (typeof d === 'number' && envPts(full) !== d) ok = false;
        if (G.cfg.flor) {
          const fl = hasFlor(full);
          if (G.flor.sung[j] && !fl) ok = false;
          if (!G.flor.sung[j] && G.played[0][j] && fl) ok = false;
        }
      }
      out = hs; if (ok) break;
    }
    return out;
  },
  policy(p, hand, row) {
    const t = team(p); let mine = -1, opp = -1;
    row.forEach((c, j) => { if (!c) return; const s = str(c); if (team(j) === t) mine = Math.max(mine, s); else opp = Math.max(opp, s); });
    const h = hand.map((c, k) => ({ k, v: str(c) })).sort((a, b) => a.v - b.v);
    if (opp < 0 && mine < 0) return h[h.length - 1].k;
    if (mine > opp) return h[0].k;
    const w = h.find(o => o.v > opp); return w ? w.k : h[0].k;
  },
  sim(hs, first) {
    const played = G.played.map(r => r.slice()), res = G.results.slice();
    let round = G.round, turn = G.turn, firstDone = false;
    const hands = {}; for (const j in hs) hands[j] = hs[j].slice();
    for (let guard = 0; guard < 20; guard++) {
      const row = played[round];
      if (!row[turn]) {
        let k;
        if (!firstDone && first != null && turn === first.p) { k = hands[turn].findIndex(c => c.id === first.id); firstDone = true; }
        else k = AI.policy(turn, hands[turn], row);
        row[turn] = hands[turn].splice(k, 1)[0];
      }
      if (row.every(x => x)) {
        const R = roundResult(row); res.push(R.r);
        const w = handWinnerOf(res, G.mano); if (w !== null) return w;
        round++; turn = R.r === 't' ? G.mano : R.p;
      } else turn = (turn + 1) % n();
    }
    return team(G.mano);
  },
  power(i, first) {
    const D = DIFF[G.cfg.diff]; let win = 0, tot = 0;
    // en difícil, si el rival cantó truco, sus manos fuertes pesan más (según cuánto miente)
    let caller = -1, b = .3;
    if (D.smart) { const c = G.calls.filter(x => x.t === 'tr' && team(x.by) !== team(i)).pop(); if (c) { caller = c.by; if (c.by === 0) b = bluffRate(G.stats.trBluffs, G.stats.trCalls); } }
    for (let s = 0; s < D.samples; s++) {
      const hs = AI.sample(i); let w = 1;
      if (caller >= 0) { const h = hs[caller].concat(G.played.map(r => r[caller]).filter(Boolean)); const st = h.map(str).sort((x, y) => y - x); const strong = st[0] >= 10 || (st[0] + (st[1] || 0)) >= 17; w = strong ? 1 : b; }
      tot += w; if (AI.sim(hs, first) === team(i)) win += w;
    }
    const p = win / tot + (rand() * 2 - 1) * D.noise;
    return Math.max(0, Math.min(1, p));
  },
  teamEnv(i) { let e = envPts(G.orig[i]); if (n() === 4) e = Math.max(e, envPts(G.orig[(i + 2) % 4])); return e; },
  choose(i) {
    const D = DIFF[G.cfg.diff], h = G.hand[i];
    if (h.length === 1) return 0;
    if (D.rnd && rand() < D.rnd) return Math.floor(rand() * h.length);
    if (D.smart) {
      let best = -1, bk = 0;
      h.map((c, k) => ({ c, k })).sort((a, b) => str(a.c) - str(b.c)).forEach(o => {
        const p = AI.power(i, { p: i, id: o.c.id });
        if (p > best + .03) { best = p; bk = o.k; }
      });
      return bk;
    }
    const row = G.played[G.round];
    if (G.round === 0 && row.every(x => !x)) { const s = h.map((c, k) => ({ k, v: str(c) })).sort((a, b) => a.v - b.v); return s[1].k; }
    return AI.policy(i, h, row);
  },
  turn(i) {
    if (!G || G.handOver || G.pending || G.turn !== i) return;
    const D = DIFF[G.cfg.diff], r = rand();
    if (canEnvido(i) && !G.tried['e' + team(i)]) {
      G.tried['e' + team(i)] = true;
      const e = AI.teamEnv(i); let k = null;
      const behind = G.score[1 - team(i)] - G.score[team(i)];
      if (e >= 31) k = (behind >= 6 && r < .6) || r < .2 ? 'F' : r < .6 ? 'R' : 'E';
      else if (e >= 28) k = r < .8 ? (r < .2 ? 'R' : 'E') : null;
      else if (e >= 26) k = r < .4 ? 'E' : null;
      else k = r < D.envBluff ? 'E' : null;
      if (G.cfg.diff === 'facil' && k) k = 'E';
      if (k) { callEnvido(i, k); return; }
    }
    if (canRaiseTruco(i) && !G.tried['t' + i + '_' + G.round + '_' + G.truco.lvl]) {
      G.tried['t' + i + '_' + G.round + '_' + G.truco.lvl] = true;
      const pw = AI.power(i), th = D.call + (G.truco.lvl - 1) * .07;
      const lastBluff = G.round === 2 && G.hand[i].length === 1 && rand() < D.bluff * 1.5;
      if (pw > th || rand() < D.bluff || lastBluff) { callTruco(i); return; }
    }
    playCard(i, AI.choose(i));
  },
  decide(j) {
    const P = G.pending, D = DIFF[G.cfg.diff], r = rand(); if (!P) return null;
    if (P.t === 'flor') {
      const p = florPts(G.orig[j]);
      if (G.cfg.diff === 'facil') return { a: 'q' };
      return { a: p >= 33 && r < .5 ? 'r' : p >= 27 ? 'q' : 'n' };
    }
    if (P.t === 'env') {
      let e = AI.teamEnv(j) + (team(G.mano) === team(j) ? .5 : 0);
      const last = P.chain[P.chain.length - 1], opts = envOptions(P.chain);
      if (D.smart) {
        const b = P.by === 0 ? bluffRate(G.stats.envBluffs, G.stats.envCalls) : .12;
        const pw = envWin(Math.floor(e) + (e % 1 ? .5 : 0), true, Math.min(.6, b / Math.max(1, P.chain.length - .5)));
        const V = last === 'F' ? faltaPts(team(j)) : P.chain.reduce((s, k) => s + EV[k], 0);
        const Rj = P.chain.length === 1 ? 1 : P.chain.slice(0, -1).reduce((s, k) => s + EV[k], 0);
        if (pw > .8 && opts.length && r < .7) return { a: opts.includes('R') && pw < .9 ? 'R' : opts.includes('F') && G.score[team(j)] + 6 < G.cfg.target ? 'F' : opts[0] };
        return { a: pw > (V - Rj) / (2 * V) + .06 ? 'q' : 'n' };
      }
      if (e >= 32 && opts.length && r < (G.cfg.diff === 'facil' ? .2 : .6)) return { a: e >= 33 && opts.includes('F') ? 'F' : opts.includes('R') ? 'R' : opts[0] };
      const need = (last === 'F' ? 30 : last === 'R' ? 28 : 27) + (P.chain.length > 1 ? 1 : 0) + D.envAdj;
      return { a: (e >= need || r < D.envBluff) ? 'q' : 'n' };
    }
    if (P.lvl === 2 && canEnvido(j) && !G.tried['e' + team(j)]) {
      const e = AI.teamEnv(j);
      if (e >= 28 || (e >= 26 && r < .4)) return { a: 'env', k: e >= 31 && r < .5 ? 'R' : 'E' };
    }
    let pw = AI.power(j);
    const lose = G.score[team(P.by)] + G.truco.lvl >= G.cfg.target;
    if (pw > .8 && P.lvl < 4 && r < .6) return { a: 'r' };
    const acc = D.smart ? (P.lvl - G.truco.lvl) / (2 * P.lvl) + .04 : D.acc;
    return { a: (pw >= acc || lose || r < D.bluff) ? 'q' : 'n' };
  },
  respond(j) {
    const P = G.pending; if (!P || G.handOver) return;
    const d = AI.decide(j); if (!d) return;
    if (P.t === 'flor') return respFlor(j, d.a);
    if (P.t === 'env') return respEnv(j, d.a);
    if (d.a === 'env') { G.tried['e' + team(j)] = true; return callEnvido(j, d.k); }
    respTruco(j, d.a);
  }
};

/* ---------- Acciones del jugador ---------- */
function human(a, k) {
  if (!G || G.handOver) return;
  const P = G.pending;
  if (P) {
    if (responderNow() !== 0) return;
    if (P.t === 'flor') return respFlor(0, a);
    if (P.t === 'env') return respEnv(0, a === 'env' ? k : a);
    if (a === 'env' && P.lvl === 2 && canEnvido(0)) return callEnvido(0, k);
    return respTruco(0, a);
  }
  if (G.turn !== 0) return;
  if (a === 'play') return playCard(0, k);
  if (a === 'env' && canEnvido(0)) return callEnvido(0, k);
  if (a === 'tr' && canRaiseTruco(0)) return callTruco(0);
  if (a === 'mazo') return mazo(0);
}
function responderNow() {
  const P = G && G.pending; if (!P) return -1;
  return P.resp != null ? P.resp : responderOf(P.by);
}
function hint() {
  if (!G || n() !== 4 || !G.pending || responderNow() !== 0) return null;
  const save = rand; const d = AI.decide(2); rand = save;
  return d;
}

root.Truco = {
  DECK, str, envPts, florPts, hasFlor, TL, TN, EN, EV, DIFF, team,
  hooks: H, setSched(f) { sched = f; }, setRand(f) { rand = f; },
  get G() { return G; }, newMatch, newHand, human, canEnvido, canRaiseTruco, envOptions,
  responderNow, hint, mustFlor, teamName, AI
};
})(typeof window !== 'undefined' ? window : globalThis);
