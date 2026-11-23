/* Sonidos sintetizados y voz de los cantos (TTS de Android o del navegador). */
(function (root) {
'use strict';
const A = { sound: true, voice: true, ctx: null };
function ctx() {
  if (!A.ctx) { const C = root.AudioContext || root.webkitAudioContext; if (!C) return null; try { A.ctx = new C(); } catch (e) { return null; } }
  if (A.ctx.state === 'suspended') A.ctx.resume().catch(() => {});
  return A.ctx;
}
function noise(c, t, dur, f, vol) {
  const len = Math.floor(c.sampleRate * dur), buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const s = c.createBufferSource(); s.buffer = buf;
  const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = f; bp.Q.value = .9;
  const g = c.createGain(); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.001, t + dur);
  s.connect(bp).connect(g).connect(c.destination); s.start(t);
}
function tone(c, t, f, dur, type, vol, f2) {
  const o = c.createOscillator(), g = c.createGain(); o.type = type; o.frequency.setValueAtTime(f, t);
  if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur);
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .01); g.gain.exponentialRampToValueAtTime(.001, t + dur);
  o.connect(g).connect(c.destination); o.start(t); o.stop(t + dur + .05);
}
A.play = function (name) {
  if (!A.sound) return; const c = ctx(); if (!c) return; const t = c.currentTime + .01;
  try {
    if (name === 'card') { noise(c, t, .09, 2600, .5); tone(c, t + .05, 180, .08, 'sine', .25, 90); }
    else if (name === 'deal') { for (let k = 0; k < 6; k++) noise(c, t + k * .11, .07, 3000, .35); }
    else if (name === 'call') { tone(c, t, 140, .22, 'sine', .5, 60); noise(c, t, .08, 900, .25); }
    else if (name === 'point') { tone(c, t, 988, .12, 'triangle', .18); tone(c, t + .09, 1319, .18, 'triangle', .18); }
    else if (name === 'turn') tone(c, t, 1600, .05, 'sine', .08);
    else if (name === 'win') [523, 659, 784, 1047].forEach((f, k) => tone(c, t + k * .13, f, .35, 'triangle', .22));
    else if (name === 'lose') [392, 330, 262].forEach((f, k) => tone(c, t + k * .2, f, .45, 'triangle', .2));
  } catch (e) {}
};
const PITCH = [1.0, .82, 1.18, .7];
A.speak = function (text, seat) {
  if (!A.voice || !text) return;
  const t = String(text).replace(/[¡!¿?]/g, '').replace(/·/g, ',');
  const p = PITCH[seat || 0] || 1;
  try { if (root.Android && root.Android.speak) { root.Android.speak(t, p, 1.05); return; } } catch (e) {}
  try {
    const s = root.speechSynthesis; if (!s) return;
    const u = new SpeechSynthesisUtterance(t); u.lang = 'es-AR'; u.pitch = p; u.rate = 1.05; s.speak(u);
  } catch (e) {}
};
A.vibrate = function (ms) {
  try { if (root.Android && root.Android.vibrate) { root.Android.vibrate(ms); return; } } catch (e) {}
  try { root.navigator && navigator.vibrate && navigator.vibrate(ms); } catch (e) {}
};
root.Sfx = A;
})(window);
