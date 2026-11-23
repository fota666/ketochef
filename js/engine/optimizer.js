// Grammoptimalizáló: dobozkorlátos konvex legkisebb négyzetek (koordináta-módszer),
// utána diszkretizálás a konyhai lépésközre és mohó helyi javítás a tényleges ellenőrzési pontra.

import { DEFAULT_TARGET, gramTargets, validate, errorScore } from './macros.js';

const MACROS = ['p', 'f', 'c'];
const WEIGHTS = { p: 1, f: 1, c: 1.5 };
const LAMBDA = 0.004; // realizmus: a javasolt gramm felé húz

function gridBounds(min, max, step) {
  const lo = Math.ceil(min / step - 1e-9) * step;
  const hi = Math.floor(max / step + 1e-9) * step;
  return [lo, Math.max(lo, hi)];
}

function snap(x, min, max, step) {
  const [lo, hi] = gridBounds(min, max, step);
  return Math.min(hi, Math.max(lo, Math.round(x / step) * step));
}

/**
 * spec: [{ id, range:[min,pref,max], step, locked?, g? }]
 * Visszaad: { items:[{id,g}], validation, status: 'PASS'|'INFEASIBLE'|'UNVERIFIED' }
 */
export function optimize(spec, db, kcal, target = DEFAULT_TARGET) {
  const T = gramTargets(kcal, target.ratios);
  const vars = spec.map((s) => {
    const ing = db[s.id];
    const step = s.step || ing?.step || 5;
    const [min, pref, max] = s.range || ing?.range || [0, 100, 200];
    const a = ing ? { p: ing.per100.p / 100, f: ing.per100.f / 100, c: ing.per100.c / 100 } : { p: 0, f: 0, c: 0 };
    const locked = !!s.locked;
    const x = locked ? Number(s.g) || 0 : Math.min(max, Math.max(min, pref));
    return { id: s.id, min, pref, max, step, a, locked, x, slot: s.slot };
  });

  // Hiányzó adat: nem optimalizálunk hamis számokra.
  const missing = vars.filter((v) => !db[v.id]);
  if (missing.length) {
    const items = vars.map((v) => ({ id: v.id, g: v.x, slot: v.slot }));
    return { items, validation: validate(items, db, kcal, target), status: 'UNVERIFIED' };
  }

  const S = { p: 0, f: 0, c: 0 };
  for (const v of vars) for (const m of MACROS) S[m] += v.a[m] * v.x;

  // 1. Folytonos megoldás
  for (let sweep = 0; sweep < 400; sweep++) {
    let moved = 0;
    for (const v of vars) {
      if (v.locked || v.max <= v.min) continue;
      const scale = Math.max(v.pref, 10);
      let grad = (2 * LAMBDA * (v.x - v.pref)) / (scale * scale);
      let H = (2 * LAMBDA) / (scale * scale);
      for (const m of MACROS) {
        const w = WEIGHTS[m] / (T[m] * T[m]);
        grad += 2 * w * v.a[m] * (S[m] - T[m]);
        H += 2 * w * v.a[m] * v.a[m];
      }
      const nx = Math.min(v.max, Math.max(v.min, v.x - grad / H));
      const d = nx - v.x;
      if (Math.abs(d) > 1e-7) {
        for (const m of MACROS) S[m] += v.a[m] * d;
        v.x = nx;
        moved += Math.abs(d);
      }
    }
    if (moved < 1e-5) break;
  }

  // 2. Konyhai lépésközre kerekítés
  for (const v of vars) if (!v.locked) v.x = snap(v.x, v.min, v.max, v.step);

  // 3. Mohó javítás a valódi ellenőrzési mértékre
  const asItems = () => vars.map((v) => ({ id: v.id, g: round2(v.x), slot: v.slot }));
  const prefPenalty = () => vars.reduce((s, v) => s + (v.locked ? 0 : ((v.x - v.pref) / Math.max(v.pref, 10)) ** 2), 0);
  const score = () => {
    const e = errorScore(validate(asItems(), db, kcal, target), target);
    // 0,7 alatt már a realizmus (javasolt gramm) számít
    return Math.max(e, 0.7) + 0.02 * prefPenalty() + 0.001 * e;
  };

  let best = score();
  for (let iter = 0; iter < 300; iter++) {
    let bestMove = null;
    for (const v of vars) {
      if (v.locked) continue;
      const [lo, hi] = gridBounds(v.min, v.max, v.step);
      for (const dir of [-1, 1]) {
        const nx = v.x + dir * v.step;
        if (nx < lo - 1e-9 || nx > hi + 1e-9) continue;
        const old = v.x;
        v.x = nx;
        const s = score();
        v.x = old;
        if (s < best - 1e-9) {
          best = s;
          bestMove = { v, nx };
        }
      }
    }
    if (!bestMove) break;
    bestMove.v.x = bestMove.nx;
  }

  const items = asItems();
  const validation = validate(items, db, kcal, target);
  return { items, validation, status: validation.status === 'PASS' ? 'PASS' : validation.status === 'UNVERIFIED' ? 'UNVERIFIED' : 'INFEASIBLE' };
}

function round2(x) {
  return Math.round(x * 100) / 100;
}
