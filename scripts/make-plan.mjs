// Ajánlott menü összeállítása a valódi generátorral és optimalizálóval -> js/data/plans.js
// Használat: node scripts/make-plan.mjs
import { writeFileSync } from 'node:fs';
import { BY_ID } from '../js/data/ingredients.js';
import { generateOptions, mulberry32 } from '../js/engine/generator.js';
import { validate } from '../js/engine/macros.js';

const MEALS = [
  { type: 'reggeli', kcal: 550 },
  { type: 'foetel', kcal: 675 },
  { type: 'foetel', kcal: 675 },
];
// Nem akciós vagy drága tételek kizárása
const EXCLUDE = ['garnela', 'avokado', 'steak', 'burrata', 'fustoltlazac', 'kecskesajt', 'halloumi', 'feta', 'pesto', 'edeskomeny', 'sparga', 'gorgonzola'];

// [nap, [keret, kötelező alapanyagok, kivétel a kizárásból]]
const PLAN = {
  '2026-11-26': [
    ['szalonnas-rantotta', ['paprika', 'gouda', 'uborka']],
    ['lecso-csirke', ['csirkecomb', 'cukkini']],
    ['wok', ['csirkecomb', 'cukkini', 'paprika']],
  ],
  '2026-11-27': [
    ['omlett', ['gouda', 'paprika']],
    ['rakott-csirkes', ['csirkecomb', 'gouda']],
    ['sutos-csirke', ['csirkecomb', 'cukkini', 'mozzarella']],
  ],
  '2026-11-28': [
    ['lazacos-tojas', ['uborka'], ['fustoltlazac', 'avokado']],
    ['csirke-kelbimbo', ['csirkecomb', 'gouda']],
    ['paprikas', ['csirkecomb', 'brokkoli']],
  ],
  '2026-11-29': [
    ['szalonnas-rantotta', ['cukkini', 'gouda', 'romai']],
    ['lecso-csirke', ['csirkecomb']],
    ['steak', ['csirkecomb', 'kelbimbo', 'brokkoli']],
  ],
  // Hétfőtől (11.30–12.02) akciós: Trapper sajt (gouda-jellegű, a gouda adataival számolva), habtejszín, zellerszár
  '2026-11-30': [
    ['szalonnas-rantotta', ['paprika', 'gouda', 'romai']],
    ['paprikas', ['csirkecomb', 'karfiol']],
    ['wok', ['csirkecomb', 'brokkoli', 'szarzeller']],
  ],
  '2026-12-01': [
    ['omlett', ['gouda', 'koktelparadicsom']],
    ['gombas-tejszines', ['csirkecomb']],
    ['csirke-kelbimbo', ['csirkecomb']],
  ],
  '2026-12-02': [
    ['szalonnas-rantotta', ['cukkini', 'gouda', 'uborka']],
    ['rakott-csirkes', ['csirkecomb', 'gouda']],
    ['lecso-csirke', ['csirkecomb', 'cukkini']],
  ],
};

const days = {};
let seed = 48;
for (const [date, meals] of Object.entries(PLAN)) {
  days[date] = meals.map(([tid, must, allow = []], i) => {
    const meal = MEALS[i];
    for (let attempt = 0; attempt < 20; attempt++) {
      const { options } = generateOptions({
        mealType: meal.type, kcal: meal.kcal, templateOk: (t) => t.id === tid, mustInclude: must,
        exclude: EXCLUDE.filter((x) => !allow.includes(x)), count: 1, db: BY_ID, rng: mulberry32(seed++),
      });
      const r = options[0];
      if (r && validate(r.items, BY_ID, meal.kcal).status === 'PASS') {
        r.id = `lidl48-${date}-${i}`;
        r.createdAt = '2026-11-24T00:00:00.000Z';
        return r;
      }
    }
    throw new Error(`Nem sikerült: ${date} ${tid}`);
  });
}

const plan = {
  'lidl48-v3': {
    title: 'Lidl akciós menü, 7 nap',
    subtitle: '11.26. csütörtök – 12.02. szerda. Csütörtöktől vasárnapig: csirkecomb, szalonna, zöldség. Hétfőn: Trapper sajt, habtejszín, zellerszár.',
    days,
  },
};
writeFileSync('js/data/plans.js', `// Generálva: scripts/make-plan.mjs\nexport const PLANS = ${JSON.stringify(plan, null, 2)};\n`);
for (const [d, rs] of Object.entries(days)) {
  const kcal = rs.reduce((s, r) => s + validate(r.items, BY_ID, r.kcalTarget).nutrition.kcal, 0);
  console.log(d, Math.round(kcal), 'kcal |', rs.map((r) => r.name).join(' | '));
}
