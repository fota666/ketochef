// Receptgenerátor: receptkeretből véletlenszerűen, ízlés szerint súlyozva összeillő alapanyagokat választ,
// majd az optimalizálóval grammokat számol. Csak PASS receptet ad vissza.

import { TEMPLATES, TEMPLATE_BY_ID } from '../data/templates.js?v=mwuhn6bx';
import { optimize } from './optimizer.js?v=mwuhn6bx';
import { DEFAULT_TARGET } from './macros.js?v=mwuhn6bx';

export function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function weightedSample(pool, k, rng, weightOf) {
  const out = [];
  const rest = [...pool];
  while (out.length < k && rest.length) {
    const ws = rest.map(weightOf);
    const sum = ws.reduce((a, b) => a + b, 0);
    let r = rng() * sum;
    let idx = 0;
    for (; idx < rest.length - 1; idx++) {
      r -= ws[idx];
      if (r <= 0) break;
    }
    out.push(rest.splice(idx, 1)[0]);
  }
  return out;
}

const randInt = (rng, lo, hi) => lo + Math.floor(rng() * (hi - lo + 1));

export function templateIngredientIds(t) {
  return new Set([...t.fixed.map((f) => f.id), ...t.slots.flatMap((s) => s.options)]);
}

export function matchingTemplates({ mealType, cuisine, mustInclude = [], exclude = [], templateOk = null }) {
  return TEMPLATES.filter((t) => {
    if (templateOk) { if (!templateOk(t)) return false; }
    else if (mealType && !t.meals.includes(mealType)) return false;
    if (cuisine && t.cuisine !== cuisine) return false;
    const ids = templateIngredientIds(t);
    if (!mustInclude.every((id) => ids.has(id))) return false;
    if (t.fixed.some((f) => exclude.includes(f.id))) return false;
    return true;
  });
}

/** Egy keret kitöltése. Null, ha a korlátozásokkal nem tölthető ki. */
export function fillTemplate(t, { mustInclude = [], exclude = [], rng, db, avoid = [] }) {
  const chosen = new Set(t.fixed.map((f) => f.id));
  const items = t.fixed.map((f) => ({ id: f.id, slot: 'fix' }));
  for (const slot of t.slots) {
    const must = mustInclude.filter((id) => slot.options.includes(id) && !chosen.has(id));
    const groupOf = (id) => db[id]?.group || id;
    const chosenGroups = new Set([...chosen, ...must].map(groupOf));
    const pool = slot.options.filter((id) => !chosen.has(id) && !chosenGroups.has(groupOf(id)) && !exclude.includes(id) && !must.includes(id) && db[id]);
    const [lo, hi] = slot.pick;
    const k = Math.max(must.length, randInt(rng, lo, hi));
    const need = k - must.length;
    if (need > pool.length) {
      if (must.length + pool.length < lo) return null;
    }
    const picked = [
      ...must,
      ...weightedSample(pool, pool.length, rng, (id) => {
        const s = db[id].score ?? 5;
        const penalty = avoid.includes(id) ? 0.25 : 1;
        return s * s * penalty;
      })
        // azonos csoportból (pl. paradicsom és koktélparadicsom) csak egy
        .filter((id, k, arr) => arr.findIndex((x) => groupOf(x) === groupOf(id)) === k)
        .slice(0, Math.max(0, need)),
    ];
    for (const id of picked) {
      chosen.add(id);
      items.push({ id, slot: slot.key });
    }
  }
  // Ha egy kötelező alapanyag csak más slotba került volna: ellenőrzés
  if (!mustInclude.every((id) => chosen.has(id))) return null;
  return items;
}

// Nagy adagnál (pl. napi 1-2 étkezés) a keret tartományai arányosan nőnek.
export function rangeScale(t, kcal) {
  const base = t?.meals?.includes('foetel') ? 675 : 550;
  const f = kcal / base;
  return f > 1.15 ? f : 1;
}

export function specFor(t, items, db, scale = 1) {
  return items.map((it) => {
    const ing = db[it.id];
    const r0 = t?.ranges?.[it.id] || ing.range;
    // Nagy adagnál a hús, sajt, zsiradék arányosan nő, a zöldség és a fűszer csak mérsékelten (max. 1,6x, 350 g)
    const isVeg = ing.cat === 'zold' || ing.cat === 'szosz' || ing.cat === 'egyeb';
    const f = isVeg ? Math.min(scale, 1.6) : scale;
    let range = f === 1 ? r0 : r0.map((x) => x * f);
    if (isVeg && scale > 1) range = range.map((x) => Math.min(x, Math.max(350, r0[2])));
    return { id: it.id, slot: it.slot, range, step: ing.step, locked: it.locked, g: it.g };
  });
}

export function tasteScore(items, db) {
  let w = 0;
  let s = 0;
  for (const it of items) {
    const ing = db[it.id];
    if (!ing || !(it.g > 0)) continue;
    const kcal = (ing.per100.kcal * it.g) / 100;
    w += kcal;
    s += kcal * (ing.score ?? 5);
  }
  return w ? s / w : 0;
}

let counter = 0;
const newId = () => `r${Date.now().toString(36)}${(counter++).toString(36)}${Math.floor(Math.random() * 1e6).toString(36)}`;

export function buildRecipe(t, result, { mealType, kcal }) {
  return {
    id: newId(),
    templateId: t.id,
    name: t.name,
    cuisine: t.cuisine,
    method: t.method,
    time: t.time,
    mealType,
    kcalTarget: kcal,
    // Receptoldal-szokás: a legnagyobb tömegű hozzávaló elöl
    items: result.items.filter((it) => it.g > 0).map((it) => ({ id: it.id, g: it.g, slot: it.slot })).sort((x, y) => y.g - x.g),
    createdAt: new Date().toISOString(),
  };
}

/**
 * Opciók generálása.
 * opts: { mealType, kcal, cuisine?, mustInclude?, exclude?, count=3, rng, db, target, avoid? }
 */
export function generateOptions(opts) {
  const { mealType, kcal, cuisine = null, mustInclude = [], exclude = [], count = 3, db, target = DEFAULT_TARGET, avoid = [], avoidTemplates = [], templateOk = null } = opts;
  const rng = opts.rng || Math.random;
  const templates = matchingTemplates({ mealType, cuisine, mustInclude, exclude, templateOk });
  if (!templates.length) return { options: [], reason: 'Nincs olyan receptkeret, amibe ezek a feltételek beleférnek.' };

  const out = [];
  const seen = new Set();
  const usedTemplates = new Map();
  const maxAttempts = 60 + count * 30;
  let attempts = 0;
  let infeasible = 0;
  while (out.length < count && attempts < maxAttempts) {
    attempts++;
    // Kerülendő és már használt keretek kisebb súllyal
    const t = weightedSample(templates, 1, rng, (tt) => {
      const used = usedTemplates.get(tt.id) || 0;
      const avoidW = avoidTemplates.includes(tt.id) ? 0 : 1; // ha minden más elfogyott, a mintavétel az elsőt adja
      return ((tt.weight ?? 1) * avoidW) / (1 + 4 * used);
    })[0];
    const items = fillTemplate(t, { mustInclude, exclude, rng, db, avoid });
    if (!items) continue;
    const sig = t.id + ':' + items.map((i) => i.id).sort().join(',');
    if (seen.has(sig)) continue;
    seen.add(sig);
    const result = optimize(specFor(t, items, db, rangeScale(t, kcal)), db, kcal, target);
    if (result.status !== 'PASS') {
      infeasible++;
      continue;
    }
    const recipe = buildRecipe(t, result, { mealType, kcal });
    recipe.taste = tasteScore(recipe.items, db);
    out.push(recipe);
    usedTemplates.set(t.id, (usedTemplates.get(t.id) || 0) + 1);
  }
  return {
    options: out,
    attempts,
    infeasible,
    reason: out.length ? null : 'A megadott feltételekkel nem találtam a makróarányt teljesítő receptet.',
  };
}

/** Meglévő recept grammjainak újraoptimalizálása. A zárolt tételek grammja marad. */
export function reoptimize(recipe, db, target = DEFAULT_TARGET) {
  const t = TEMPLATE_BY_ID[recipe.templateId];
  const spec = specFor(t, recipe.items, db, rangeScale(t, recipe.kcalTarget));
  const result = optimize(spec, db, recipe.kcalTarget, target);
  return {
    ...result,
    items: result.items.map((it, i) => ({ ...it, locked: recipe.items[i].locked })),
  };
}

/** Lépések kitöltése a kiválasztott alapanyagokkal. Üres slotra hivatkozó lépés kimarad. */
export function renderSteps(recipe, db) {
  const t = TEMPLATE_BY_ID[recipe.templateId];
  if (!t) return [];
  const bySlot = {};
  for (const it of recipe.items) {
    if (!(it.g > 0)) continue;
    (bySlot[it.slot] ||= []).push(db[it.id]?.name.toLowerCase() || it.id);
  }
  return t.steps
    .map((s) => {
      let ok = true;
      const text = s.replace(/\{(\w+)\}/g, (_, k) => {
        if (!bySlot[k]) {
          ok = false;
          return '';
        }
        return bySlot[k].join(', ');
      });
      return ok ? text : null;
    })
    .filter(Boolean);
}

/** Csere-lehetőségek egy tételhez: ugyanannak a slotnak a többi opciója. */
export function swapOptions(recipe, itemIndex, db) {
  const t = TEMPLATE_BY_ID[recipe.templateId];
  const it = recipe.items[itemIndex];
  const used = new Set(recipe.items.map((i) => i.id));
  const slot = t?.slots.find((s) => s.key === it.slot);
  if (!slot) return [];
  // Zsírszázalék-változatok (darált marha, darált sertés) mindig cserélhetők egymásra
  const family = (id) => id.replace(/\d+$/, '');
  const variants = Object.keys(db).filter((id) => /\d+$/.test(id) && slot.options.some((o) => family(o) === family(id)));
  const opts = [...new Set([...slot.options, ...variants])];
  return opts.filter((id) => id === it.id || (!used.has(id) && db[id]));
}

/** Egész nap generálása változatossággal. */
export function generateDay({ meals, db, target = DEFAULT_TARGET, rng = Math.random, exclude = [] }) {
  const recipes = [];
  const avoid = [];
  const avoidTemplates = [];
  for (const meal of meals) {
    const { options } = generateOptions({ mealType: meal.type, kcal: meal.kcal, templateOk: meal.templateOk, count: 1, db, target, rng, avoid, avoidTemplates, exclude });
    const r = options[0] || null;
    recipes.push(r);
    if (r) {
      avoidTemplates.push(r.templateId);
      for (const it of r.items) if (['hus', 'hal', 'tej'].includes(db[it.id]?.cat) || it.slot === 'feh') avoid.push(it.id);
    }
  }
  return recipes;
}
