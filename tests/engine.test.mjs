import { test } from 'node:test';
import assert from 'node:assert/strict';
import { INGREDIENTS, BY_ID } from '../js/data/ingredients.js';
import { TEMPLATES } from '../js/data/templates.js';
import { sumNutrition, ratiosOf, validate, gramTargets, ratioBands, relativeDeviation, DEFAULT_TARGET } from '../js/engine/macros.js';
import { optimize } from '../js/engine/optimizer.js';
import { generateOptions, generateDay, reoptimize, mulberry32, renderSteps, matchingTemplates } from '../js/engine/generator.js';

const db = BY_ID;

test('adatbázis: a címke-kcal és a makróból számolt energia közel van egymáshoz', () => {
  for (const ing of INGREDIENTS) {
    const { kcal, p, f, c, fiber } = ing.per100;
    if (kcal < 100) continue;
    const est = 9 * f + 4 * p + 4 * c + 2 * (fiber || 0);
    assert.ok(Math.abs(est - kcal) / kcal < 0.15, `${ing.id}: ${kcal} vs ${est.toFixed(0)}`);
  }
});

test('adatbázis: minden receptkeret-hivatkozás létező alapanyag, a tartományok érvényesek', () => {
  for (const t of TEMPLATES) {
    const ids = [...t.fixed.map((f) => f.id), ...t.slots.flatMap((s) => s.options), ...Object.keys(t.ranges || {})];
    for (const id of ids) assert.ok(db[id], `${t.id}: ismeretlen ${id}`);
    for (const [id, r] of Object.entries(t.ranges || {})) assert.ok(r[0] <= r[1] && r[1] <= r[2], `${t.id}.${id}`);
  }
  for (const i of INGREDIENTS) assert.ok(i.range[0] <= i.range[1] && i.range[1] <= i.range[2], i.id);
});

test('arány-sávok: relatív 10%, nem százalékpont', () => {
  const b = ratioBands();
  assert.ok(Math.abs(b.f[0] - 0.59688) < 1e-4 && Math.abs(b.f[1] - 0.72952) < 1e-4);
  assert.ok(Math.abs(b.p[0] - 0.24633) < 1e-4 && Math.abs(b.p[1] - 0.30107) < 1e-4);
  assert.ok(Math.abs(b.c[0] - 0.05688) < 1e-4 && Math.abs(b.c[1] - 0.06952) < 1e-4);
});

test('gramm-célok: 600 és 700 kcal', () => {
  const t6 = gramTargets(600);
  assert.equal(t6.f.toFixed(1), '44.2');
  assert.equal(t6.p.toFixed(1), '41.1');
  assert.equal(t6.c.toFixed(1), '9.5');
  const t7 = gramTargets(700);
  assert.equal(t7.f.toFixed(1), '51.6');
  assert.equal(t7.p.toFixed(1), '47.9');
  assert.equal(t7.c.toFixed(1), '11.1');
});

test('összegzés grammarányosan, 0 g tétel nem számít', () => {
  const n = sumNutrition([{ id: 'tojas', g: 100 }, { id: 'olivaolaj', g: 10 }, { id: 'brokkoli', g: 0 }], db);
  assert.ok(Math.abs(n.p - 12.6) < 1e-9);
  assert.ok(Math.abs(n.f - 19.5) < 1e-9);
  assert.ok(Math.abs(n.c - 0.7) < 1e-9);
  assert.equal(n.g, 110);
});

test('arány a 9/4/4 energiatényezőkből', () => {
  const r = ratiosOf({ f: 10, p: 10, c: 10 });
  assert.ok(Math.abs(r.f - 9 / 17) < 1e-12);
  assert.ok(Math.abs(r.p - 4 / 17) < 1e-12);
});

test('10%-os határ: pontosan a határon PASS, fölötte FAIL', () => {
  // Kontrollált tesztadatbázis: tiszta zsír, tiszta fehérje, tiszta szénhidrát
  const tdb = {
    F: { id: 'F', per100: { kcal: 900, p: 0, f: 100, c: 0 }, q: 'ref' },
    P: { id: 'P', per100: { kcal: 400, p: 100, f: 0, c: 0 }, q: 'ref' },
    C: { id: 'C', per100: { kcal: 400, p: 0, f: 0, c: 100 }, q: 'ref' },
  };
  const target = DEFAULT_TARGET;
  // A szénhidrátarány pontosan 1,0999 * cél és 1,1001 * cél
  const make = (cRatio) => {
    const E = 1000;
    const cE = cRatio * E;
    const rest = E - cE;
    const fE = (rest * target.ratios.f) / (target.ratios.f + target.ratios.p);
    const pE = rest - fE;
    return [{ id: 'F', g: fE / 9 }, { id: 'P', g: pE / 4 }, { id: 'C', g: cE / 4 }];
  };
  const ok = validate(make(target.ratios.c * 1.0999), tdb, null, target);
  assert.equal(ok.status, 'PASS');
  const bad = validate(make(target.ratios.c * 1.1001), tdb, null, target);
  assert.equal(bad.status, 'FAIL');
  assert.ok(bad.deviation.c > 0.1);
});

test('eltérés képlete', () => {
  assert.ok(Math.abs(relativeDeviation(0.07, 0.0632) - 0.10759) < 1e-4);
});

test('hiányzó adat: UNVERIFIED, nem PASS', () => {
  const v = validate([{ id: 'nemletezo', g: 100 }, { id: 'tojas', g: 150 }], db, 600);
  assert.equal(v.status, 'UNVERIFIED');
  const r = optimize([{ id: 'nemletezo', range: [0, 50, 100] }, { id: 'tojas' }], db, 600);
  assert.equal(r.status, 'UNVERIFIED');
});

test('nem megoldható korlátok: INFEASIBLE, nem hamisít', () => {
  // Csak zöldség és olaj: a fehérjearány elérhetetlen
  const r = optimize([{ id: 'brokkoli' }, { id: 'olivaolaj' }], db, 600);
  assert.equal(r.status, 'INFEASIBLE');
  assert.notEqual(r.validation.status, 'PASS');
});

test('optimalizáló: valós alapanyagokból 600 kcal PASS, a grammok a tartományban és lépésközön', () => {
  const spec = [
    { id: 'csirkecomb' }, { id: 'gomba' }, { id: 'brokkoli' }, { id: 'olivaolaj' }, { id: 'parmezan' }, { id: 'fokhagyma' },
  ];
  const r = optimize(spec, db, 600);
  assert.equal(r.status, 'PASS');
  for (const it of r.items) {
    const ing = db[it.id];
    assert.ok(it.g >= ing.range[0] - 1e-9 && it.g <= ing.range[2] + 1e-9, `${it.id} ${it.g}`);
    assert.ok(Math.abs(it.g / ing.step - Math.round(it.g / ing.step)) < 1e-9, `${it.id} lépésköz`);
  }
  assert.ok(Math.abs(r.validation.kcalDeviation) <= 0.05);
});

test('tojás egész darabban', () => {
  const r = optimize([{ id: 'tojas' }, { id: 'bacon' }, { id: 'spenot' }, { id: 'paradicsom' }, { id: 'vaj' }, { id: 'cheddar' }], db, 550);
  const egg = r.items.find((i) => i.id === 'tojas');
  assert.equal(egg.g % 50, 0);
});

test('hús zsírtartalom csere: 10% -> 20% marha, újraoptimalizálás után ismét PASS', () => {
  const rng = mulberry32(3);
  const { options } = generateOptions({ mealType: 'foetel', kcal: 675, mustInclude: ['marha10'], cuisine: 'olasz', count: 1, db, rng });
  assert.equal(options.length, 1);
  const recipe = options[0];
  const idx = recipe.items.findIndex((i) => i.id === 'marha10');
  const swapped = { ...recipe, items: recipe.items.map((it, i) => (i === idx ? { ...it, id: 'marha20' } : it)) };
  const before = validate(recipe.items, db, 675);
  const after = validate(swapped.items, db, 675);
  assert.ok(after.nutrition.f > before.nutrition.f, 'a zsír nő');
  const fixed = reoptimize(swapped, db);
  assert.equal(fixed.status, 'PASS');
  assert.ok(fixed.items.some((i) => i.id === 'marha20'));
});

test('zárolt tétel grammja nem változik újraoptimalizáláskor', () => {
  const rng = mulberry32(11);
  const { options } = generateOptions({ mealType: 'foetel', kcal: 675, mustInclude: ['csirkecomb'], count: 1, db, rng });
  const r = options[0];
  const idx = r.items.findIndex((i) => i.id === 'csirkecomb');
  const locked = { ...r, items: r.items.map((it, i) => (i === idx ? { ...it, g: 200, locked: true } : it)) };
  const out = reoptimize(locked, db);
  assert.equal(out.items[idx].g, 200);
});

test('generátor: minden opció PASS és egyenként teljesíti az arányt', () => {
  const rng = mulberry32(99);
  for (const [mealType, kcal] of [['reggeli', 550], ['foetel', 675], ['foetel', 600]]) {
    const { options } = generateOptions({ mealType, kcal, count: 3, db, rng });
    assert.equal(options.length, 3, `${mealType} ${kcal}`);
    for (const o of options) {
      const v = validate(o.items, db, kcal);
      assert.equal(v.status, 'PASS', o.name);
      for (const m of ['f', 'p', 'c']) assert.ok(v.deviation[m] <= 0.1);
    }
  }
});

test('generátor: rögzített konyha és alapanyagok (ázsiai, marha, brokkoli)', () => {
  const rng = mulberry32(5);
  const { options } = generateOptions({ mealType: 'foetel', kcal: 675, cuisine: 'azsiai', mustInclude: ['marha10', 'brokkoli'], count: 3, db, rng });
  assert.ok(options.length >= 1);
  for (const o of options) {
    const ids = o.items.map((i) => i.id);
    assert.ok(ids.includes('marha10') && ids.includes('brokkoli'));
    assert.equal(o.cuisine, 'azsiai');
  }
});

test('generátor: kizárt alapanyag nem kerül bele', () => {
  const rng = mulberry32(8);
  for (let i = 0; i < 5; i++) {
    const { options } = generateOptions({ mealType: 'foetel', kcal: 675, exclude: ['fokhagyma', 'csirkecomb'], count: 3, db, rng });
    for (const o of options) assert.ok(!o.items.some((x) => x.id === 'fokhagyma' || x.id === 'csirkecomb'));
  }
});

test('generátor: értelmetlen feltétel esetén üres eredmény indoklással', () => {
  const { options, reason } = generateOptions({ mealType: 'reggeli', kcal: 550, mustInclude: ['steak', 'kokusztej'], count: 3, db });
  assert.equal(options.length, 0);
  assert.ok(reason);
});

test('ízlésprofil: tofu, tonhal, kacsa nincs az adatbázisban, lazac ritka', () => {
  for (const id of ['tofu', 'tonhal', 'kacsamell', 'tempeh', 'szejtan']) assert.equal(db[id], undefined);
  const rng = mulberry32(21);
  let lazac = 0;
  let total = 0;
  for (let i = 0; i < 20; i++) {
    const { options } = generateOptions({ mealType: 'foetel', kcal: 675, count: 3, db, rng });
    for (const o of options) {
      total++;
      if (o.items.some((x) => x.id === 'lazac')) lazac++;
    }
  }
  assert.ok(lazac / total < 0.05);
});

test('egész nap: 3 étkezés, mind PASS, a napi összeg ±5%-on belül', () => {
  const rng = mulberry32(1234);
  const meals = [{ type: 'reggeli', kcal: 550 }, { type: 'foetel', kcal: 675 }, { type: 'foetel', kcal: 675 }];
  for (let d = 0; d < 7; d++) {
    const day = generateDay({ meals, db, rng });
    assert.equal(day.filter(Boolean).length, 3);
    let kcal = 0;
    for (const [i, r] of day.entries()) {
      const v = validate(r.items, db, meals[i].kcal);
      assert.equal(v.status, 'PASS');
      kcal += v.nutrition.kcal;
    }
    assert.ok(Math.abs(kcal - 1900) / 1900 <= 0.05, `nap ${d}: ${kcal}`);
    assert.notEqual(day[1].templateId, day[2].templateId, 'ebéd és vacsora különböző');
  }
});

test('lépések: az üres slotra hivatkozó lépés kimarad, nincs bent kapcsos zárójel', () => {
  const rng = mulberry32(77);
  const { options } = generateOptions({ mealType: 'foetel', kcal: 675, count: 3, db, rng });
  for (const o of options) {
    const steps = renderSteps(o, db);
    assert.ok(steps.length >= 2);
    for (const s of steps) assert.ok(!/[{}]/.test(s));
  }
});

test('receptkeret-szűrés konyhára és étkezésre', () => {
  assert.ok(matchingTemplates({ mealType: 'reggeli' }).every((t) => t.meals.includes('reggeli')));
  assert.ok(matchingTemplates({ cuisine: 'magyaros' }).every((t) => t.cuisine === 'magyaros'));
});

test('étkezés-hozzárendelés: templateOk felülírja a reggeli/főétel típust', () => {
  const rng = mulberry32(31);
  const ok = (t) => t.id === 'smash-tal';
  const { options } = generateOptions({ mealType: 'reggeli', kcal: 550, templateOk: ok, count: 2, db, rng });
  assert.ok(options.length >= 1);
  for (const o of options) assert.equal(o.templateId, 'smash-tal');
  const day = generateDay({ meals: [{ type: 'reggeli', kcal: 550, templateOk: (t) => t.id === 'bolognai' }], db, rng });
  assert.equal(day[0].templateId, 'bolognai');
});

test('napi 1 és 2 étkezés: 1900 és 950 kcal-os adag is PASS', () => {
  const rng = mulberry32(55);
  for (const kcal of [950, 1900]) {
    const { options } = generateOptions({ mealType: 'foetel', kcal, count: 3, db, rng });
    assert.equal(options.length, 3, `${kcal}`);
    for (const o of options) assert.equal(validate(o.items, db, kcal).status, 'PASS');
  }
});

test('paprikás csirke: a fűszerpaprika is számít a makróba', () => {
  const rng = mulberry32(4);
  const { options } = generateOptions({ mealType: 'foetel', kcal: 675, cuisine: 'magyaros', mustInclude: ['fuszerpaprika'], count: 2, db, rng });
  assert.ok(options.length >= 1);
  for (const o of options) {
    const p = o.items.find((x) => x.id === 'fuszerpaprika');
    assert.ok(p && p.g >= 3);
    assert.equal(validate(o.items, db, 675).status, 'PASS');
  }
});
