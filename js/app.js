import { INGREDIENTS, CATEGORIES } from './data/ingredients.js?v=mwugdqnj';
import { TEMPLATE_BY_ID, CUISINES } from './data/templates.js?v=mwugdqnj';
import { validate, gramTargets, DEFAULT_TARGET, sumNutrition } from './engine/macros.js?v=mwugdqnj';
import { generateOptions, generateDay, reoptimize, renderSteps, swapOptions } from './engine/generator.js?v=mwugdqnj';

// ---------- Állapot ----------
const KEY = 'ketochef.v1';
const DEFAULT_STATE = {
  settings: {
    meals: [
      { name: 'Reggeli', type: 'reggeli', kcal: 550 },
      { name: 'Ebéd', type: 'foetel', kcal: 675 },
      { name: 'Vacsora', type: 'foetel', kcal: 675 },
    ],
    ratios: { ...DEFAULT_TARGET.ratios },
    tolerance: 0.1,
    kcalTolerance: 0.05,
    exclude: [],
  },
  days: {},
  favorites: [],
  overrides: {},
  shopChecked: {},
  fast: {},
  dayCount: {},
  templateMealKeys: {},
};

function load() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY));
    if (s && s.settings) return { ...structuredClone(DEFAULT_STATE), ...s, settings: { ...DEFAULT_STATE.settings, ...s.settings } };
  } catch {}
  return structuredClone(DEFAULT_STATE);
}
let state = load();
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
}

function buildDb() {
  const db = {};
  for (const ing of INGREDIENTS) {
    const o = state.overrides[ing.id];
    db[ing.id] = o ? { ...ing, per100: { ...ing.per100, ...o }, q: 'címke', src: 'Saját címkeadat' } : ing;
  }
  return db;
}
let db = buildDb();
const target = () => ({ ratios: state.settings.ratios, tolerance: state.settings.tolerance, kcalTolerance: state.settings.kcalTolerance });

// ---------- Segédek ----------
const $ = (s, r = document) => r.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const nf0 = new Intl.NumberFormat('hu-HU', { maximumFractionDigits: 0 });
const nf1 = new Intl.NumberFormat('hu-HU', { maximumFractionDigits: 1, minimumFractionDigits: 1 });
const n0 = (x) => nf0.format(Math.round(x));
const n1 = (x) => nf1.format(x);
const pct = (x) => nf1.format(x * 100) + '%';
const signedPct = (x) => (x > 0 ? '+' : x < 0 ? '−' : '±') + nf1.format(Math.abs(x * 100)) + '%';
const iso = (d) => d.toLocaleDateString('sv-SE');
const todayIso = () => iso(new Date());
const addDays = (s, n) => { const d = new Date(s + 'T12:00:00'); d.setDate(d.getDate() + n); return iso(d); };
const ingName = (id) => db[id]?.name || id;
const shortName = (id) => ingName(id).split(',')[0].replace(/\s*\(.*\)/, '');

function qtyText(it) {
  const ing = db[it.id];
  if (ing?.unit) {
    const pcs = it.g / ing.unit.g;
    return `${Number.isInteger(pcs) ? pcs : n1(pcs)} ${ing.unit.name}`;
  }
  return `${n0(it.g)} g`;
}

let toastTimer;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (t.hidden = true), 2200);
}

// Receptkeret-fotó: img/<keret>.jpg, ha nincs, az elem eltűnik
const imgTag = (tid, cls) => `<img class="${cls}" src="img/${tid}.jpg" alt="" loading="lazy" onerror="this.remove()" />`;

const LOCK_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>`;
const UNLOCK_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 7.5-2"/></svg>`;

function statusPill(v) {
  if (v.status === 'PASS') return `<span class="pill pass" title="Makróellenőrzött">✓ OK</span>`;
  if (v.status === 'UNVERIFIED') return `<span class="pill warn">Nincs adat</span>`;
  return `<span class="pill fail">Eltér</span>`;
}

function ratioBar(r, withMarks = true) {
  const t = state.settings.ratios;
  return `<div class="ratio-wrap"><div class="ratio" role="img" aria-label="Zsír ${pct(r.f)}, fehérje ${pct(r.p)}, szénhidrát ${pct(r.c)}">
    <i class="p" style="width:${r.p * 100}%"></i><i class="f" style="width:${r.f * 100}%"></i><i class="c" style="width:${r.c * 100}%"></i></div>
    ${withMarks ? `<span class="mark" style="left:calc(${t.p * 100}% - 1px)"></span><span class="mark" style="left:calc(${(t.p + t.f) * 100}% - 1px)"></span>` : ''}</div>`;
}

function macrosInline(n) {
  return `<div class="macros-inline num"><span><b>${n0(n.kcal)}</b>&nbsp;kcal</span>
    <span title="Fehérje"><i class="dot p"></i>${n0(n.p)}</span><span title="Zsír"><i class="dot f"></i>${n0(n.f)}</span><span title="Szénhidrát"><i class="dot c"></i>${n1(n.c)}</span></div>`;
}

// ---------- Routing ----------
const ui = {
  date: todayIso(),
  gen: { mealIdx: 1, kcal: null, cuisine: null, must: [], exclude: [], results: null, reason: null, busy: false },
  sheet: null, // { recipe, source: 'day'|'gen'|'fav', date, mealIdx }
  shopRange: 'week',
};

function route() {
  const tab = (location.hash || '#menu').slice(1);
  document.querySelectorAll('#tabs a').forEach((a) => a.classList.toggle('active', a.dataset.tab === tab));
  const v = $('#view');
  if (tab === 'gen') v.innerHTML = viewGen();
  else if (tab === 'lista') v.innerHTML = viewShop();
  else if (tab === 'beall') v.innerHTML = viewSettings();
  else v.innerHTML = viewMenu();
  bindView(tab);
}
window.addEventListener('hashchange', () => {
  if (ui.sheet) { ui.sheet = null; $('#sheet').hidden = true; document.body.style.overflow = ''; }
  route(); window.scrollTo(0, 0);
});

// ---------- Menü ----------
function dayRecipes(date) {
  const d = state.days[date] || [];
  return dayMeals(date).map((_, i) => d[i] || null);
}

const isFast = (date) => !!state.fast?.[date];
const WD = ['V', 'H', 'K', 'Sze', 'Cs', 'P', 'Szo'];
const KEYS = ['reggeli', 'ebed', 'vacsora'];
const round25 = (x) => Math.round(x / 25) * 25;

// Egy nap étkezései: 3 (beállítás szerint), 2 (ebéd, vacsora) vagy 1 (egy nagy étkezés). A napi kalória ugyanannyi.
function dayMeals(date) {
  const base = state.settings.meals;
  const total = base.reduce((a, m) => a + Number(m.kcal), 0);
  const n = state.dayCount?.[date] ?? 3;
  if (n === 1) return [{ name: 'Étkezés', key: 'egy', type: 'foetel', kcal: total, accept: ['ebed', 'vacsora'] }];
  if (n === 2) {
    const a = round25(total / 2);
    return [
      { name: 'Ebéd', key: 'ebed', type: 'foetel', kcal: a, accept: ['ebed'] },
      { name: 'Vacsora', key: 'vacsora', type: 'foetel', kcal: total - a, accept: ['vacsora'] },
    ];
  }
  return base.map((m, i) => ({ ...m, kcal: Number(m.kcal), key: KEYS[i], accept: [KEYS[i]] }));
}

// Melyik étkezésre mehet egy receptkeret: saját beállítás, alapból a keret típusa szerint
function mealsFor(t) {
  const own = state.templateMealKeys?.[t.id];
  if (own) return own;
  const out = [];
  if (t.meals.includes('reggeli')) out.push('reggeli');
  if (t.meals.includes('foetel')) out.push('ebed', 'vacsora');
  return out;
}
const templateOkFor = (meal) => (t) => mealsFor(t).some((k) => meal.accept.includes(k));

function fillDay(date, keepExisting) {
  const meals = dayMeals(date).map((m) => ({ type: m.type, kcal: m.kcal, templateOk: templateOkFor(m) }));
  const fresh = generateDay({ meals, db, target: target(), exclude: state.settings.exclude });
  const cur = dayRecipes(date);
  state.days[date] = cur.map((r, k) => (keepExisting && r ? r : fresh[k]));
}

function calendarStrip() {
  const days = Array.from({ length: 14 }, (_, k) => addDays(todayIso(), k));
  return `<nav class="cal" aria-label="Napok">${days.map((ds) => {
    const d = new Date(ds + 'T12:00:00');
    const rec = dayRecipes(ds);
    const n = rec.filter(Boolean).length;
    const mark = isFast(ds) ? '<span class="cal-mark fast">B</span>' : `<span class="cal-mark">${rec.map((_, k) => `<i class="${k < n ? 'on' : ''}"></i>`).join('')}</span>`;
    return `<button class="cal-day ${ds === ui.date ? 'sel' : ''} ${ds === todayIso() ? 'today' : ''}" data-act="pick-day" data-d="${ds}">
      <span class="cal-wd">${WD[d.getDay()]}</span><span class="cal-n num">${d.getDate()}</span>${mark}</button>`;
  }).join('')}</nav>`;
}

function viewMenu() {
  const date = ui.date;
  const d = new Date(date + 'T12:00:00');
  const weekday = d.toLocaleDateString('hu-HU', { weekday: 'long' });
  const rel = date === todayIso() ? 'Ma' : date === addDays(todayIso(), 1) ? 'Holnap' : null;
  const fast = isFast(date);
  const meals = dayMeals(date);
  const recipes = dayRecipes(date);
  const total = sumNutrition(recipes.filter(Boolean).flatMap((r) => r.items), db);
  const dayKcal = meals.reduce((s, m) => s + m.kcal, 0);
  const tg = gramTargets(dayKcal, state.settings.ratios);
  const meter = (k, label, val, tgt, unit = 'g') => `<div class="meter"><div class="lbl">${label}</div><div class="val num"><b>${k === 'c' ? n1(val) : n0(val)}</b> / ${n0(tgt)} ${unit}</div>
    <div class="track"><div class="fill" style="width:${Math.min(100, (val / tgt) * 100)}%;background:var(--${k === 'f' ? 'fat' : k === 'p' ? 'protein' : 'carb'})"></div></div></div>`;
  const filled = recipes.filter(Boolean).length;
  const count = state.dayCount?.[date] ?? 3;

  return `
  ${calendarStrip()}
  <div class="day-head">
    <div><h1>${esc(rel || capital(weekday))}</h1><div class="date">${esc(rel ? capital(weekday) + ', ' : '')}${esc(d.toLocaleDateString('hu-HU', { month: 'long', day: 'numeric' }))}</div></div>
    <div class="day-tools">
      ${fast ? '' : `<div class="seg mini" role="group" aria-label="Étkezések száma">${[1, 2, 3].map((n) => `<button data-act="day-count" data-n="${n}" class="${n === count ? 'on' : ''}" aria-label="${n} étkezés">${n}×</button>`).join('')}</div>`}
      <button class="btn sm ${fast ? 'primary' : ''}" data-act="toggle-fast" aria-pressed="${fast}">${fast ? '✓ Böjt' : 'Böjt'}</button>
    </div>
  </div>

  ${fast ? `<section class="fast-block"><div class="big-kcal num">0<small>kcal</small></div><div class="muted">Böjtnap</div></section>` : `
  <section class="summary" aria-label="Napi összesítő">
    <div class="summary-top">
      <div class="big-kcal num">${n0(total.kcal)}<small>/ ${n0(dayKcal)} kcal</small></div>
      <span class="muted num" style="font-size:14px">${filled}/${recipes.length}</span>
    </div>
    <div class="meters num">
      ${meter('p', 'Fehérje', total.p, tg.p)}
      ${meter('f', 'Zsír', total.f, tg.f)}
      ${meter('c', 'Szénh.', total.c, tg.c)}
    </div>
  </section>

  <section class="meals">
    ${recipes.map((r, i) => mealCard(r, i)).join('')}
  </section>`}

  <div class="day-actions">
    ${!fast && filled < recipes.length ? `<button class="btn primary" data-act="fill-day">${filled ? 'Nap kitöltése' : 'Nap generálása'}</button>` : ''}
    ${!fast && filled ? `<button class="btn" data-act="regen-day">↻ Új nap</button>` : ''}
    <button class="btn" data-act="fill-week">Hét kitöltése</button>
  </div>`;
}

const rank = (it) => it.g * (['hus', 'hal'].includes(db[it.id]?.cat) ? 4 : 1);

function subtitle(r) {
  const top = [...r.items].filter((it) => it.g > 0 && !['zsir', 'szosz'].includes(db[it.id]?.cat) && (it.g > 15 || db[it.id]?.unit)).sort((a, b) => rank(b) - rank(a)).slice(0, 3).map((it) => shortName(it.id).toLowerCase());
  return top.length > 1 ? top.slice(0, -1).join(', ') + ' és ' + top[top.length - 1] : top.join('');
}

function mainIngredients(r) {
  const big = [...r.items].filter((it) => it.g > 15 || db[it.id]?.unit).sort((a, b) => b.g - a.g).slice(0, 5);
  return big.map((it, k) => (k ? shortName(it.id).toLowerCase() : shortName(it.id))).join(', ');
}

const capital = (s) => s.charAt(0).toUpperCase() + s.slice(1);

function mealCard(r, i) {
  const meal = dayMeals(ui.date)[i];
  if (!r) {
    return `<div class="meal empty"><div><div class="eyebrow">${esc(meal.name)}</div><div class="muted">${n0(meal.kcal)} kcal</div></div>
      <button class="btn sm" data-act="gen-for" data-i="${i}">+ Recept</button></div>`;
  }
  const v = validate(r.items, db, r.kcalTarget, target());
  const main = mainIngredients(r);
  return `<article class="meal" data-act="open-day" data-i="${i}" tabindex="0">
    ${imgTag(r.templateId, "meal-img")}
    <div class="meal-head"><span class="eyebrow">${esc(meal.name)}</span>${statusPill(v)}</div>
    <h3>${esc(r.name)}</h3>
    <div class="ings">${esc(main)}</div>
    <div class="meal-foot">${macrosInline(v.nutrition)}
      <div class="meal-actions">
        <button class="btn ghost sm" data-act="swap-meal" data-i="${i}" title="Másik recept">↻</button>
        <button class="btn ghost sm" data-act="clear-meal" data-i="${i}" aria-label="Törlés a menüből">✕</button>
      </div></div>
  </article>`;
}

// ---------- Generátor ----------
function genMeal() { const m = dayMeals(ui.date); return m[Math.min(ui.gen.mealIdx, m.length - 1)]; }
function genKcal() { return Number(ui.gen.kcal) || Number(genMeal().kcal); }

function viewGen() {
  const g = ui.gen;
  const meals = dayMeals(ui.date);
  if (g.mealIdx >= meals.length) g.mealIdx = meals.length - 1;
  const dateLabel = ui.date === todayIso() ? 'mai' : ui.date === addDays(todayIso(), 1) ? 'holnapi' : new Date(ui.date + 'T12:00:00').toLocaleDateString('hu-HU', { month: 'short', day: 'numeric' }) + '-i';
  return `
  <h1 class="page-title">Recept</h1>

  <div class="field"><div class="label">Étkezés <span class="hint">${esc(dateLabel)} menü</span></div>
    <div class="seg">${meals.map((m, i) => `<button data-act="gen-meal" data-i="${i}" class="${i === g.mealIdx ? 'on' : ''}">${esc(m.name)}<small>${n0(m.kcal)} kcal</small></button>`).join('')}</div>
    <div class="kcal-row"><input class="input num" type="number" inputmode="numeric" min="200" max="1500" step="25" id="gen-kcal" value="${genKcal()}" /> kcal</div>
  </div>

  <div class="field"><div class="label">Konyha</div>
    <div class="chips">
      <button class="chip ${!g.cuisine ? 'on' : ''}" data-act="gen-cuisine" data-c="">Bármi</button>
      ${Object.entries(CUISINES).map(([k, v]) => `<button class="chip ${g.cuisine === k ? 'on' : ''}" data-act="gen-cuisine" data-c="${k}">${esc(v)}</button>`).join('')}
    </div></div>

  <div class="field"><label for="must-input">Legyen benne</label>
    ${picker('must')}
    ${g.must.length ? `<div class="chips">${g.must.map((id) => `<span class="chip tag">${esc(shortName(id))}<button data-act="rm-must" data-id="${id}" aria-label="Eltávolítás">×</button></span>`).join('')}</div>` : ''}
  </div>

  <div class="field"><label for="exclude-input">Ne legyen benne</label>
    ${picker('exclude')}
    ${g.exclude.length ? `<div class="chips">${g.exclude.map((id) => `<span class="chip tag neg">${esc(shortName(id))}<button data-act="rm-exclude" data-id="${id}" aria-label="Eltávolítás">×</button></span>`).join('')}</div>` : ''}
  </div>

  <div class="gen-cta"><button class="btn primary block" data-act="generate">${g.results ? '↻ Újra' : 'Generálás'}</button></div>

  <section id="results" class="results">${resultsHtml()}</section>

  ${state.favorites.length ? `<div class="section-title"><h2>Kedvencek</h2><span class="muted">${state.favorites.length}</span></div>
    <div class="results">${state.favorites.map((r, i) => resultCard(r, i, 'fav')).join('')}</div>` : ''}`;
}

function picker(kind) {
  return `<div class="picker"><input id="${kind}-input" data-picker="${kind}" type="search" autocomplete="off" placeholder="Keresés az alapanyagok között" /><div class="suggest" id="${kind}-suggest" hidden></div></div>`;
}

function resultsHtml() {
  const g = ui.gen;
  if (g.reason) return `<div class="empty-state">Nincs megfelelő recept.</div>`;
  if (!g.results) return '';
  return g.results.map((r, i) => resultCard(r, i, 'gen')).join('');
}

function resultCard(r, i, src) {
  const v = validate(r.items, db, r.kcalTarget, target());
  const items = r.items.filter((it) => it.g > 0);
  return `<article class="result">
    ${imgTag(r.templateId, "result-img")}
    <div class="meta"><span class="eyebrow">${esc(CUISINES[r.cuisine] || '')} · ${r.time} perc</span>${statusPill(v)}</div>
    <h3 data-act="open-${src}" data-i="${i}">${esc(r.name)}</h3>
    <p class="subtitle">${esc(subtitle(r))}</p>
    <ul class="ing-mini num">${items.map((it) => `<li><b>${esc(qtyText(it))}</b>${esc(shortName(it.id))}</li>`).join('')}</ul>
    ${ratioBar(v.ratios)}
    <div class="result-foot">${macrosInline(v.nutrition)}
      <div class="result-actions">
        <button class="btn sm" data-act="open-${src}" data-i="${i}">Nyit</button>
        <button class="btn primary sm" data-act="add-${src}" data-i="${i}">+ Menü</button>
      </div></div>
  </article>`;
}

function runGenerate() {
  const g = ui.gen;
  const meal = genMeal();
  const res = generateOptions({
    mealType: meal.type, templateOk: templateOkFor(meal), kcal: genKcal(), cuisine: g.cuisine, mustInclude: g.must,
    exclude: [...new Set([...g.exclude, ...state.settings.exclude])], count: 3, db, target: target(),
  });
  g.results = res.options.length ? res.options : null;
  g.reason = res.reason;
  route();
  $('#results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function bindPicker(kind) {
  const input = $(`#${kind}-input`);
  const box = $(`#${kind}-suggest`);
  if (!input) return;
  let hl = 0;
  let list = [];
  const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const render = () => {
    const q = norm(input.value.trim());
    const taken = new Set([...ui.gen.must, ...ui.gen.exclude]);
    list = q ? INGREDIENTS.filter((i) => !taken.has(i.id) && norm(i.name).includes(q)).slice(0, 8) : [];
    box.hidden = !list.length;
    box.innerHTML = list.map((i, k) => `<button type="button" data-id="${i.id}" class="${k === hl ? 'hl' : ''}">${esc(i.name)}<span>${esc(CATEGORIES[i.cat])}</span></button>`).join('');
  };
  const pick = (id) => {
    ui.gen[kind].push(id);
    ui.gen.results = null;
    ui.gen.reason = null;
    route();
    $(`#${kind}-input`)?.focus();
  };
  input.addEventListener('input', () => { hl = 0; render(); });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { hl = Math.min(hl + 1, list.length - 1); render(); e.preventDefault(); }
    if (e.key === 'ArrowUp') { hl = Math.max(hl - 1, 0); render(); e.preventDefault(); }
    if (e.key === 'Enter' && list[hl]) { pick(list[hl].id); e.preventDefault(); }
    if (e.key === 'Escape') { box.hidden = true; }
  });
  input.addEventListener('blur', () => setTimeout(() => (box.hidden = true), 150));
  box.addEventListener('mousedown', (e) => { const b = e.target.closest('button'); if (b) { e.preventDefault(); pick(b.dataset.id); } });
}

// ---------- Recept lap ----------
function openSheet(recipe, ctx) {
  ui.sheet = { recipe: structuredClone(recipe), ...ctx };
  const el = $('#sheet');
  el.hidden = false;
  document.body.style.overflow = 'hidden';
  renderSheet();
  $('.sheet-panel', el)?.focus();
}
function closeSheet() {
  ui.sheet = null;
  $('#sheet').hidden = true;
  document.body.style.overflow = '';
  route();
}

function renderSheet() {
  const s = ui.sheet;
  const r = s.recipe;
  const v = validate(r.items, db, r.kcalTarget, target());
  const t = TEMPLATE_BY_ID[r.templateId];
  const inMenu = s.source === 'day';
  const isFav = state.favorites.some((f) => f.id === r.id);
  $('#sheet').innerHTML = `<div class="sheet-panel" role="dialog" aria-modal="true" aria-label="${esc(r.name)}" tabindex="-1">
    <div class="sheet-top">
      <button class="icon-btn" data-act="sheet-close" aria-label="Bezárás">←</button>
      <button class="icon-btn" data-act="sheet-fav" aria-label="Kedvenc">${isFav ? '★' : '☆'}</button>
    </div>
    ${imgTag(r.templateId, "hero-img")}
    <div class="sheet-body">
      <div class="eyebrow">${esc(CUISINES[r.cuisine] || '')}${inMenu ? ' · ' + esc(dayMeals(s.date)[s.mealIdx]?.name || '') : ''}</div>
      <h1 class="recipe-title">${esc(r.name)}</h1>
      <p class="subtitle lg">${esc(subtitle(r))}</p>
      <div class="recipe-meta"><span>${r.time} perc</span><span>${esc(r.method)}</span><span>Ízlés ${n1(tasteOf(r))}</span></div>
      ${t ? `<div class="mehet"><span class="eyebrow">Mehet</span>${KEYS.map((k, j) => { const on = mealsFor(t).includes(k); return `<button class="tog ${on ? 'on' : ''}" data-act="meal-ok" data-k="${k}" aria-pressed="${on}">${on ? '✓ ' : ''}${esc(['Reggeli', 'Ebéd', 'Vacsora'][j])}</button>`; }).join('')}</div>` : ''}

      <section class="nutri" id="nutri">${nutriHtml(v, r)}</section>

      <div class="block-title"><h2>Hozzávalók</h2></div>
      <ul class="ing-list">${r.items.map((it, idx) => ingRow(r, it, idx)).join('')}</ul>
      ${t?.spices ? `<p class="spices">+ ${esc(t.spices)}</p>` : ''}

      <div class="block-title"><h2>Elkészítés</h2></div>
      <ol class="steps">${renderSteps(r, db).map((st) => `<li><span>${esc(st)}</span></li>`).join('')}</ol>

      <details class="sources"><summary>Források / 100 g</summary>
        <table class="src-table num"><thead><tr><th>Alapanyag</th><th>kcal</th><th>F</th><th>Zs</th><th>Sz</th></tr></thead><tbody>
        ${r.items.map((it) => { const g = db[it.id]; return `<tr><td>${esc(g.name)}<span class="muted">${esc(g.src)}${g.q === 'becsült' ? ' · becsült' : ''}</span></td><td>${n0(g.per100.kcal)}</td><td>${n1(g.per100.p)}</td><td>${n1(g.per100.f)}</td><td>${n1(g.per100.c)}</td></tr>`; }).join('')}
        </tbody></table>
        <p class="muted" style="font-size:12.5px">Szénhidrát rost nélkül. Energia 9/4/4 kcal/g.</p>
      </details>
    </div>
    <div class="sheet-bar">
      <button class="btn" data-act="sheet-fix">↻ Makrók</button>
      ${inMenu ? `<button class="btn primary" data-act="sheet-close">Kész</button>` : `<button class="btn primary" data-act="sheet-add">+ Menü</button>`}
    </div>
  </div>`;
}

function tasteOf(r) {
  let w = 0, s = 0;
  for (const it of r.items) { const g = db[it.id]; if (!g || !(it.g > 0)) continue; const k = (g.per100.kcal * it.g) / 100; w += k; s += k * (g.score ?? 5); }
  return w ? s / w : 0;
}

function nutriHtml(v, r) {
  const tol = state.settings.tolerance;
  const cell = (k, label, grams, digits) => {
    const dv = v.signedDeviation[k];
    const ok = Math.abs(dv) <= tol + 1e-12;
    return `<div class="nutri-cell"><div class="v num">${digits ? n1(grams) : n0(grams)}<small>g</small></div>
      <div class="k"><i class="dot ${k}"></i>${label} · ${pct(v.ratios[k])}</div>
      <div class="d ${ok ? 'ok' : 'bad'} num">${signedPct(dv)}</div></div>`;
  };
  const kOk = v.kcalOk;
  let note = '';
  if (v.status === 'FAIL') note = `<div class="note err">Tűrésen kívül. ↻ Makrók: a zárolt tételek maradnak.</div>`;
  else if (v.status === 'UNVERIFIED') note = `<div class="note err">Hiányzó adat, nincs garancia.</div>`;
  else if (v.estimated.length) note = `<div class="note">Becsült: ${v.estimated.map((id) => esc(shortName(id).toLowerCase())).join(', ')}</div>`;
  return `<div class="nutri-head"><span class="eyebrow">Adag</span>${statusPill(v)}</div>
    <div class="nutri-grid">
      <div class="nutri-cell"><div class="v num">${n0(v.nutrition.kcal)}<small>kcal</small></div>
        <div class="k">Cél <input class="input num" style="width:78px;min-height:30px;padding:3px 8px;font-size:14px;margin-left:2px" type="number" step="25" min="200" max="1500" data-act="sheet-kcal" value="${r.kcalTarget}" aria-label="Kalóriacél" /></div>
        <div class="d ${kOk ? 'ok' : 'bad'} num">${signedPct(v.kcalDeviation)}</div></div>
      ${cell('p', 'Fehérje', v.nutrition.p)}
      ${cell('f', 'Zsír', v.nutrition.f)}
      ${cell('c', 'Szénh.', v.nutrition.c, true)}
    </div>
    ${ratioBar(v.ratios)}
    <div class="ratio-legend num"><span>Cél <i class="dot p"></i> ${pct(state.settings.ratios.p)} &nbsp;<i class="dot f"></i> ${pct(state.settings.ratios.f)} &nbsp;<i class="dot c"></i> ${pct(state.settings.ratios.c)}</span><span>tűrés ±${n0(tol * 100)}%</span></div>
    ${note}`;
}

function ingRow(r, it, idx) {
  const g = db[it.id];
  const opts = swapOptions(r, idx, db);
  const step = g.unit ? g.unit.g : g.step;
  const name = opts.length > 1
    ? `<select data-act="swap" data-idx="${idx}" aria-label="Alapanyag cseréje">${opts.map((id) => `<option value="${id}" ${id === it.id ? 'selected' : ''}>${esc(ingName(id))}</option>`).join('')}</select>`
    : `<span class="plain">${esc(g.name)}</span>`;
  const sub = [g.unit ? `${n1(it.g / g.unit.g)} db` : null, g.q === 'becsült' ? '<span class="est">becsült</span>' : null, it.g <= 0 ? 'kimarad' : null].filter(Boolean).join(' · ');
  return `<li class="ing-row" ${it.g <= 0 ? 'style="opacity:.5"' : ''}>
    <label class="qty"><input type="number" inputmode="decimal" min="0" step="${step}" value="${Math.round(it.g * 10) / 10}" data-act="grams" data-idx="${idx}" aria-label="${esc(g.name)} gramm" /><span>g</span></label>
    <div class="ing-name">${name}${sub ? `<span class="sub">${sub}</span>` : ''}</div>
    <button class="lock ${it.locked ? 'on' : ''}" data-act="lock" data-idx="${idx}" title="${it.locked ? 'Zárolva: a helyreállítás nem módosítja' : 'Zárolás'}" aria-pressed="${!!it.locked}">${it.locked ? LOCK_SVG : UNLOCK_SVG}</button>
  </li>`;
}

function persistSheet() {
  const s = ui.sheet;
  if (s.source === 'day') {
    (state.days[s.date] ||= [])[s.mealIdx] = structuredClone(s.recipe);
    save();
  } else if (s.source === 'fav') {
    const i = state.favorites.findIndex((f) => f.id === s.recipe.id);
    if (i >= 0) { state.favorites[i] = structuredClone(s.recipe); save(); }
  } else if (s.source === 'gen' && ui.gen.results) {
    ui.gen.results[s.idx] = structuredClone(s.recipe);
  }
}

function refreshNutri() {
  const r = ui.sheet.recipe;
  $('#nutri').innerHTML = nutriHtml(validate(r.items, db, r.kcalTarget, target()), r);
}

function addToMenu(recipe, mealIdx = ui.gen.mealIdx, date = ui.date) {
  const r = structuredClone(recipe);
  (state.days[date] ||= [])[mealIdx] = r;
  save();
  const label = dayMeals(date)[mealIdx]?.name || '';
  toast(`${label}: ${r.name}`);
}

// ---------- Bevásárlás ----------
function viewShop() {
  const ranges = { today: ['Ma', 0, 1], tomorrow: ['Holnap', 1, 1], week: ['7 nap', 0, 7] };
  const [, start, len] = ranges[ui.shopRange];
  const dates = Array.from({ length: len }, (_, i) => addDays(todayIso(), start + i));
  const sums = {};
  let meals = 0;
  for (const d of dates) if (!isFast(d)) for (const r of dayRecipes(d)) if (r) { meals++; for (const it of r.items) if (it.g > 0) sums[it.id] = (sums[it.id] || 0) + it.g; }
  const groups = {};
  for (const [id, g] of Object.entries(sums)) (groups[db[id]?.cat || 'egyeb'] ||= []).push({ id, g });
  const key = (id) => `${ui.shopRange}:${dates[0]}:${id}`;
  return `<h1 class="page-title">Bevásárlás</h1>
  <div class="seg" style="margin-bottom:8px">${Object.entries(ranges).map(([k, [l]]) => `<button data-act="shop-range" data-k="${k}" class="${ui.shopRange === k ? 'on' : ''}">${l}</button>`).join('')}</div>
  ${!meals ? `<div class="empty-state">Üres a menü.</div>` : ''}
  ${Object.keys(CATEGORIES).filter((c) => groups[c]).map((c) => `<div class="shop-group"><h3>${esc(CATEGORIES[c])}</h3>
    ${groups[c].sort((a, b) => ingName(a.id).localeCompare(ingName(b.id), 'hu')).map(({ id, g }) => {
      const done = !!state.shopChecked[key(id)];
      return `<label class="shop-item ${done ? 'done' : ''}"><input type="checkbox" data-act="shop-check" data-k="${esc(key(id))}" ${done ? 'checked' : ''}/><span class="nm">${esc(ingName(id))}</span><span class="q num">${esc(qtyText({ id, g }))}${db[id].unit ? '' : ''}</span></label>`;
    }).join('')}</div>`).join('')}`;
}

// ---------- Beállítások ----------
function viewSettings() {
  const s = state.settings;
  return `<h1 class="page-title">Beállítások</h1>
  <div class="card"><h2>Étkezések, kcal</h2>
    <div class="grid3">${s.meals.map((m, i) => `<label>${esc(m.name)}<input class="input num" type="number" step="25" min="200" max="1500" data-act="set-meal" data-i="${i}" value="${m.kcal}"/></label>`).join('')}</div>
    <p class="muted" style="margin:12px 0 0;font-size:14px">Napi: <b class="num">${n0(s.meals.reduce((a, m) => a + Number(m.kcal), 0))} kcal</b></p>
  </div>
  <div class="card"><h2>Makróarány, energia%</h2>
    <div class="grid3">
      <label>Zsír %<input class="input num" type="number" step="0.01" data-act="set-ratio" data-k="f" value="${(s.ratios.f * 100).toFixed(2)}"/></label>
      <label>Fehérje %<input class="input num" type="number" step="0.01" data-act="set-ratio" data-k="p" value="${(s.ratios.p * 100).toFixed(2)}"/></label>
      <label>Szénhidrát %<input class="input num" type="number" step="0.01" data-act="set-ratio" data-k="c" value="${(s.ratios.c * 100).toFixed(2)}"/></label>
    </div>
    <div class="grid3" style="margin-top:10px">
      <label>Tűrés %<input class="input num" type="number" step="1" min="1" max="30" data-act="set-tol" value="${n0(s.tolerance * 100)}"/></label>
      <label>Kcal tűrés %<input class="input num" type="number" step="1" min="1" max="20" data-act="set-ktol" value="${n0(s.kcalTolerance * 100)}"/></label>
      <label>&nbsp;<button class="btn block" data-act="reset-ratio">Alapérték</button></label>
    </div>
    <p id="ratio-sum" class="muted" style="margin:10px 0 0;font-size:13.5px">Összesen: ${n1((s.ratios.f + s.ratios.p + s.ratios.c) * 100)}%</p>
  </div>
  <div class="card"><h2>Tápérték / 100 g</h2><p>Írd át a saját címkéd szerint.</p>
    <input class="input" type="search" id="ing-search" placeholder="Keresés" style="margin-bottom:10px" />
    <div class="ing-table-row head"><span>Alapanyag</span><span>kcal</span><span>Feh.</span><span>Zsír</span><span>Szénh.</span><span></span></div>
    <div id="ing-table">${ingTable('')}</div>
  </div>
  <div class="card"><h2>Mentés</h2>
    <div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn" data-act="export">Export</button>
    <label class="btn">Import<input type="file" accept="application/json" data-act="import" hidden/></label></div>
  </div>`;
}

function ingTable(q) {
  const nq = q.toLowerCase();
  return INGREDIENTS.filter((i) => !nq || i.name.toLowerCase().includes(nq)).map((base) => {
    const g = db[base.id];
    const ov = !!state.overrides[base.id];
    const f = (k) => `<input type="number" step="0.1" min="0" data-act="ov" data-id="${base.id}" data-k="${k}" value="${g.per100[k]}" aria-label="${esc(base.name)} ${k}"/>`;
    return `<div class="ing-table-row num"><span class="nm">${esc(base.name)}<small>${ov ? 'Saját címkeadat' : esc(base.src) + (base.q === 'becsült' ? ' · becsült' : '')}</small></span>
      ${f('kcal')}${f('p')}${f('f')}${f('c')}
      <span>${ov ? `<button class="lock" data-act="ov-reset" data-id="${base.id}" title="Visszaállítás">↺</button>` : ''}</span></div>`;
  }).join('');
}

// ---------- Események ----------
function bindView(tab) {
  if (tab === 'gen') {
    bindPicker('must');
    bindPicker('exclude');
    $('#gen-kcal')?.addEventListener('change', (e) => { ui.gen.kcal = Number(e.target.value) || null; });
  }
  if (tab === 'beall') {
    $('#ing-search')?.addEventListener('input', (e) => { $('#ing-table').innerHTML = ingTable(e.target.value); });
  }
}

document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-act]');
  if (!el) return;
  const act = el.dataset.act;
  const i = Number(el.dataset.i);
  switch (act) {
    case 'pick-day': ui.date = el.dataset.d; ui.gen.results = null; route(); break;
    case 'toggle-fast': (state.fast ||= {})[ui.date] = !isFast(ui.date); save(); route(); break;
    case 'day-count': {
      const n = Number(el.dataset.n);
      if ((state.dayCount?.[ui.date] ?? 3) === n) break;
      (state.dayCount ||= {})[ui.date] = n;
      state.days[ui.date] = [];
      save(); route();
      break;
    }
    case 'fill-week': {
      let n = 0;
      for (let k = 0; k < 7; k++) {
        const ds = addDays(ui.date, k);
        if (isFast(ds)) continue;
        if (dayRecipes(ds).some((r) => !r)) { fillDay(ds, true); n++; }
      }
      save(); route(); toast(n ? `${n} nap kitöltve` : 'A hét már tele');
      break;
    }
    case 'gen-for': ui.gen.mealIdx = i; ui.gen.kcal = null; ui.gen.results = null; ui.gen.reason = null; location.hash = '#gen'; break;
    case 'open-day': if (e.target.closest('.meal-actions')) return; openSheet(dayRecipes(ui.date)[i], { source: 'day', date: ui.date, mealIdx: i }); break;
    case 'clear-meal': e.stopPropagation(); state.days[ui.date][i] = null; save(); route(); break;
    case 'swap-meal': {
      e.stopPropagation();
      const cur = dayRecipes(ui.date)[i];
      const meal = dayMeals(ui.date)[i];
      const { options } = generateOptions({ mealType: meal.type, templateOk: templateOkFor(meal), kcal: meal.kcal, count: 1, db, target: target(), exclude: state.settings.exclude, avoidTemplates: [cur.templateId] });
      if (options[0]) { state.days[ui.date][i] = options[0]; save(); route(); }
      else toast('Nem találtam másikat.');
      break;
    }
    case 'fill-day':
    case 'regen-day': {
      fillDay(ui.date, act === 'fill-day');
      save(); route();
      break;
    }
    case 'gen-meal': ui.gen.mealIdx = i; ui.gen.kcal = null; ui.gen.results = null; ui.gen.reason = null; route(); break;
    case 'gen-cuisine': ui.gen.cuisine = el.dataset.c || null; ui.gen.results = null; ui.gen.reason = null; route(); break;
    case 'rm-must': ui.gen.must = ui.gen.must.filter((x) => x !== el.dataset.id); ui.gen.results = null; route(); break;
    case 'rm-exclude': ui.gen.exclude = ui.gen.exclude.filter((x) => x !== el.dataset.id); ui.gen.results = null; route(); break;
    case 'generate': {
      const k = $('#gen-kcal'); if (k) ui.gen.kcal = Number(k.value) || null;
      el.innerHTML = '<span class="spinner"></span>';
      setTimeout(runGenerate, 20);
      break;
    }
    case 'open-gen': openSheet(ui.gen.results[i], { source: 'gen', idx: i }); break;
    case 'add-gen': addToMenu(ui.gen.results[i]); location.hash = '#menu'; break;
    case 'open-fav': openSheet(state.favorites[i], { source: 'fav', idx: i }); break;
    case 'add-fav': {
      const meal = ui.gen.mealIdx;
      const r = structuredClone(state.favorites[i]);
      r.id = r.id + '-' + Date.now().toString(36);
      addToMenu(r, meal); location.hash = '#menu';
      break;
    }
    case 'sheet-close': closeSheet(); break;
    case 'sheet-add': {
      const s = ui.sheet;
      const mealIdx = s.source === 'fav' ? ui.gen.mealIdx : ui.gen.mealIdx;
      addToMenu(s.recipe, mealIdx);
      closeSheet(); location.hash = '#menu';
      break;
    }
    case 'sheet-fav': {
      const r = ui.sheet.recipe;
      const k = state.favorites.findIndex((f) => f.id === r.id);
      if (k >= 0) { state.favorites.splice(k, 1); }
      else { state.favorites.unshift(structuredClone(r)); }
      save(); renderSheet();
      break;
    }
    case 'sheet-fix': {
      const out = reoptimize(ui.sheet.recipe, db, target());
      if (out.status === 'PASS') {
        ui.sheet.recipe.items = out.items.map((it) => ({ id: it.id, g: it.g, slot: it.slot, locked: it.locked }));
        persistSheet(); renderSheet(); toast('✓ OK');
      } else {
        toast('Nem jön ki. Oldj fel egy zárat.');
      }
      break;
    }
    case 'meal-ok': {
      const t = TEMPLATE_BY_ID[ui.sheet.recipe.templateId];
      const k = el.dataset.k;
      const cur = new Set(mealsFor(t));
      if (cur.has(k)) { if (cur.size > 1) cur.delete(k); } else cur.add(k);
      (state.templateMealKeys ||= {})[t.id] = KEYS.filter((x) => cur.has(x));
      save(); renderSheet();
      break;
    }
    case 'lock': {
      const idx = Number(el.dataset.idx);
      const it = ui.sheet.recipe.items[idx];
      it.locked = !it.locked;
      persistSheet(); renderSheet();
      break;
    }
    case 'shop-range': ui.shopRange = el.dataset.k; route(); break;
    case 'reset-ratio': state.settings.ratios = { ...DEFAULT_TARGET.ratios }; state.settings.tolerance = 0.1; state.settings.kcalTolerance = 0.05; save(); route(); break;
    case 'ov-reset': delete state.overrides[el.dataset.id]; save(); db = buildDb(); $('#ing-table').innerHTML = ingTable($('#ing-search').value); break;
    case 'export': {
      const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `ketochef-${todayIso()}.json`;
      a.click();
      break;
    }
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && ui.sheet) closeSheet();
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('.meal[data-act]')) { e.preventDefault(); e.target.click(); }
});

$('#sheet').addEventListener('click', (e) => { if (e.target.id === 'sheet') closeSheet(); });

document.addEventListener('input', (e) => {
  const el = e.target;
  const act = el.dataset?.act;
  if (act === 'grams' && ui.sheet) {
    const it = ui.sheet.recipe.items[Number(el.dataset.idx)];
    it.g = Math.max(0, Number(el.value) || 0);
    persistSheet(); refreshNutri();
  }
  if (act === 'sheet-kcal' && ui.sheet) {
    const v = Number(el.value);
    if (v >= 200 && v <= 1500) { ui.sheet.recipe.kcalTarget = v; persistSheet(); }
  }
});

document.addEventListener('change', (e) => {
  const el = e.target;
  const act = el.dataset?.act;
  if (act === 'swap' && ui.sheet) {
    const it = ui.sheet.recipe.items[Number(el.dataset.idx)];
    const old = it.id;
    it.id = el.value;
    const g = db[it.id];
    if (g.unit) it.g = Math.max(g.unit.g, Math.round(it.g / g.unit.g) * g.unit.g);
    persistSheet(); renderSheet();
    toast(`${shortName(old)} → ${shortName(it.id)}`);
  }
  if (act === 'sheet-kcal' && ui.sheet) refreshNutri();
  if (act === 'grams' && ui.sheet) renderSheet();
  if (act === 'set-meal') { state.settings.meals[Number(el.dataset.i)].kcal = Math.max(200, Math.min(1500, Number(el.value) || 0)); save(); route(); }
  if (act === 'set-ratio') {
    state.settings.ratios[el.dataset.k] = (Number(el.value) || 0) / 100;
    save();
    const s = state.settings.ratios;
    $('#ratio-sum').textContent = `Összesen: ${n1((s.f + s.p + s.c) * 100)}%` + (Math.abs(s.f + s.p + s.c - 1) > 0.001 ? ' (100% legyen)' : '');
  }
  if (act === 'set-tol') { state.settings.tolerance = Math.max(0.01, (Number(el.value) || 10) / 100); save(); }
  if (act === 'set-ktol') { state.settings.kcalTolerance = Math.max(0.01, (Number(el.value) || 5) / 100); save(); }
  if (act === 'ov') {
    const id = el.dataset.id;
    const base = INGREDIENTS.find((x) => x.id === id);
    const cur = state.overrides[id] || { kcal: base.per100.kcal, p: base.per100.p, f: base.per100.f, c: base.per100.c };
    cur[el.dataset.k] = Math.max(0, Number(el.value) || 0);
    state.overrides[id] = cur;
    save(); db = buildDb();
    toast('Mentve');
  }
  if (act === 'shop-check') { state.shopChecked[el.dataset.k] = el.checked; save(); el.closest('.shop-item').classList.toggle('done', el.checked); }
  if (act === 'import' && el.files?.[0]) {
    el.files[0].text().then((txt) => {
      try {
        const s = JSON.parse(txt);
        if (!s.settings) throw new Error();
        state = { ...structuredClone(DEFAULT_STATE), ...s };
        save(); db = buildDb(); route(); toast('Visszatöltve');
      } catch { toast('Ez nem KetoChef mentés.'); }
    });
  }
});

route();
