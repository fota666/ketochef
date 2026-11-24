// Receptkeret-javaslatok ellenőrzése a valódi optimalizálóval.
// Használat: node scripts/check-templates.mjs <javaslat.mjs> [kcal]
// A javaslat modul exportálhat: templates (tömb, a templates.js formátumában), ingredients (új alapanyagok, ingredients.js I() mezőivel, objektumként).
import { pathToFileURL } from 'node:url';
import { INGREDIENTS } from '../js/data/ingredients.js';
import { fillTemplate, specFor, rangeScale, mulberry32 } from '../js/engine/generator.js';
import { optimize } from '../js/engine/optimizer.js';

const mod = await import(pathToFileURL(process.argv[2]).href);
const db = Object.fromEntries(INGREDIENTS.map((i) => [i.id, i]));
for (const ing of mod.ingredients || []) db[ing.id] = { step: 5, ...ing };

const rng = mulberry32(42);
let bad = 0;
for (const t of mod.templates) {
  const ids = [...t.fixed.map((f) => f.id), ...t.slots.flatMap((s) => s.options), ...Object.keys(t.ranges || {})];
  const unknown = ids.filter((id) => !db[id]);
  if (unknown.length) { console.log(`${t.id}: ISMERETLEN alapanyag: ${unknown.join(', ')}`); bad++; continue; }
  const kcals = process.argv[3] ? [Number(process.argv[3])] : t.meals.includes('reggeli') && !t.meals.includes('foetel') ? [550] : t.meals.includes('reggeli') ? [550, 675] : [675];
  for (const kcal of kcals) {
    let pass = 0;
    const n = 40;
    let example = null;
    for (let i = 0; i < n; i++) {
      const items = fillTemplate(t, { rng, db });
      if (!items) continue;
      const r = optimize(specFor(t, items, db, rangeScale(t, kcal)), db, kcal);
      if (r.status === 'PASS') { pass++; if (!example) example = r; }
    }
    const rate = pass / n;
    if (rate < 0.6) bad++;
    console.log(`${t.id.padEnd(24)} ${kcal} kcal  PASS ${pass}/${n}${rate < 0.6 ? '  <-- TÚL ALACSONY (min. 24/40)' : ''}`);
    if (example) {
      const v = example.validation;
      console.log('   példa:', example.items.filter((x) => x.g > 0).map((x) => `${db[x.id].name} ${x.g} g`).join(', '));
      console.log(`   kcal ${v.nutrition.kcal.toFixed(0)}  feh ${v.nutrition.p.toFixed(1)}  zsír ${v.nutrition.f.toFixed(1)}  szénh ${v.nutrition.c.toFixed(1)}`);
    }
  }
}
process.exit(bad ? 1 : 0);
