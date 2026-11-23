// Determinisztikus makrószámítás és ellenőrzés.

export const ENERGY = { f: 9, p: 4, c: 4 };

export const DEFAULT_TARGET = {
  ratios: { f: 0.6632, p: 0.2737, c: 0.0632 },
  tolerance: 0.10, // relatív eltérés makróarányonként
  kcalTolerance: 0.05, // relatív eltérés az adag kalóriacéljától
};

/** items: [{ id, g }], db: id -> ingredient. Visszaad: grammos összegek és kcal. */
export function sumNutrition(items, db) {
  const t = { g: 0, p: 0, f: 0, c: 0, fiber: 0, labelKcal: 0, missing: [] };
  for (const it of items) {
    const ing = db[it.id];
    const g = Number(it.g) || 0;
    if (!ing || !ing.per100 || [ing.per100.p, ing.per100.f, ing.per100.c].some((v) => typeof v !== 'number' || Number.isNaN(v))) {
      t.missing.push(it.id);
      continue;
    }
    if (g <= 0) continue;
    const k = g / 100;
    t.g += g;
    t.p += ing.per100.p * k;
    t.f += ing.per100.f * k;
    t.c += ing.per100.c * k;
    t.fiber += (ing.per100.fiber || 0) * k;
    t.labelKcal += (ing.per100.kcal || 0) * k;
  }
  t.kcal = t.f * ENERGY.f + t.p * ENERGY.p + t.c * ENERGY.c;
  return t;
}

export function ratiosOf(n) {
  const e = n.f * ENERGY.f + n.p * ENERGY.p + n.c * ENERGY.c;
  if (e <= 0) return { f: 0, p: 0, c: 0 };
  return { f: (n.f * ENERGY.f) / e, p: (n.p * ENERGY.p) / e, c: (n.c * ENERGY.c) / e };
}

export function relativeDeviation(actual, target) {
  return Math.abs(actual - target) / target;
}

/** Előjeles relatív eltérés, megjelenítéshez. */
export function signedDeviation(actual, target) {
  return (actual - target) / target;
}

/** Gramm-célok egy adott kalóriához. */
export function gramTargets(kcal, ratios = DEFAULT_TARGET.ratios) {
  return {
    f: (kcal * ratios.f) / ENERGY.f,
    p: (kcal * ratios.p) / ENERGY.p,
    c: (kcal * ratios.c) / ENERGY.c,
  };
}

/** Az elfogadható arány-sávok. */
export function ratioBands(target = DEFAULT_TARGET) {
  const b = {};
  for (const m of ['f', 'p', 'c']) {
    b[m] = [target.ratios[m] * (1 - target.tolerance), target.ratios[m] * (1 + target.tolerance)];
  }
  return b;
}

/**
 * Recept ellenőrzése.
 * status: PASS | FAIL | UNVERIFIED (hiányzó adat)
 * dataQuality: 'ref' ha minden tétel referenciaadat, 'becsült' ha van címkével pontosítandó tétel
 */
export function validate(items, db, kcalTarget, target = DEFAULT_TARGET) {
  const n = sumNutrition(items, db);
  const r = ratiosOf(n);
  const dev = {
    f: relativeDeviation(r.f, target.ratios.f),
    p: relativeDeviation(r.p, target.ratios.p),
    c: relativeDeviation(r.c, target.ratios.c),
  };
  const signed = {
    f: signedDeviation(r.f, target.ratios.f),
    p: signedDeviation(r.p, target.ratios.p),
    c: signedDeviation(r.c, target.ratios.c),
  };
  const kcalDev = kcalTarget ? signedDeviation(n.kcal, kcalTarget) : 0;
  const ratioOk = ['f', 'p', 'c'].every((m) => dev[m] <= target.tolerance + 1e-12);
  const kcalOk = !kcalTarget || Math.abs(kcalDev) <= target.kcalTolerance + 1e-12;
  const used = items.filter((it) => Number(it.g) > 0);
  const estimated = used.filter((it) => db[it.id] && db[it.id].q === 'becsült').map((it) => it.id);

  let status;
  if (n.missing.length) status = 'UNVERIFIED';
  else if (used.length === 0) status = 'FAIL';
  else status = ratioOk && kcalOk ? 'PASS' : 'FAIL';

  return {
    status,
    nutrition: n,
    ratios: r,
    deviation: dev,
    signedDeviation: signed,
    kcalDeviation: kcalDev,
    ratioOk,
    kcalOk,
    dataQuality: estimated.length ? 'becsült' : 'ref',
    estimated,
    missing: n.missing,
  };
}

/** Normált hibapont: <= 1 akkor PASS. */
export function errorScore(v, target = DEFAULT_TARGET) {
  return Math.max(
    v.deviation.f / target.tolerance,
    v.deviation.p / target.tolerance,
    v.deviation.c / target.tolerance,
    Math.abs(v.kcalDeviation) / target.kcalTolerance,
  );
}
