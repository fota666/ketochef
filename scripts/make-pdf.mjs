// Nyomtatható menü (PDF) egy ajánlott tervből: bevásárlólisták, majd naponként a receptek képpel.
// Használat: node scripts/make-pdf.mjs [tervkulcs] [kimenet.pdf]
import { writeFileSync, mkdirSync, readdirSync, copyFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { PLANS } from '../js/data/plans.js';
import { BY_ID, CATEGORIES } from '../js/data/ingredients.js';
import { TEMPLATE_BY_ID } from '../js/data/templates.js';
import { validate } from '../js/engine/macros.js';
import { renderSteps } from '../js/engine/generator.js';

const KEY = process.argv[2] || 'lidl48-v3';
const OUT = resolve(process.argv[3] || '../ketochef-menu.pdf');
const PEOPLE = [1, 2, 2]; // reggeli, ebéd, vacsora
const MEAL = ['Reggeli', 'Ebéd', 'Vacsora'];
const WD = ['vasárnap', 'hétfő', 'kedd', 'szerda', 'csütörtök', 'péntek', 'szombat'];
const pl = PLANS[KEY];
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const nf = (x, d = 0) => x.toLocaleString('hu-HU', { maximumFractionDigits: d, minimumFractionDigits: d });
const day = (d) => { const x = new Date(d + 'T12:00:00'); return `${x.getMonth() + 1}.${String(x.getDate()).padStart(2, '0')}. ${WD[x.getDay()]}`; };
function qty(id, g, shop) {
  const u = BY_ID[id].unit;
  if (u) return `${shop ? Math.ceil(g / u.g - 0.05) : nf(g / u.g, Number.isInteger(g / u.g) ? 0 : 1)} ${u.name}`;
  if (shop && g >= 1000) return `${nf(Math.ceil(g / 100) / 10, 1)} kg`;
  return `${nf(shop ? Math.ceil(g / 10) * 10 : g)} g`;
}

function shopList(t) {
  const sums = {};
  const add = (d, ok) => pl.days[d].forEach((r, i) => { for (const it of r.items) if (it.g > 0 && ok(it.id) && (!t.only || t.only.includes(it.id))) sums[it.id] = (sums[it.id] || 0) + it.g * PEOPLE[i]; });
  t.days.forEach((d) => add(d, () => true));
  (t.also?.days || []).forEach((d) => add(d, (id) => !t.also.except.includes(id)));
  const groups = {};
  for (const [id, g] of Object.entries(sums)) (groups[BY_ID[id].cat] ||= []).push([id, g]);
  return `<section class="shop"><h2>Bevásárlás ${esc(t.label)}</h2><p class="note">${esc(t.note || '')}</p><div class="cols">
  ${Object.keys(CATEGORIES).filter((c) => groups[c]).map((c) => `<div class="grp"><h4>${esc(CATEGORIES[c])}</h4>${groups[c].sort((a, b) => BY_ID[a[0]].name.localeCompare(BY_ID[b[0]].name, 'hu')).map(([id, g]) => `<div class="row"><span>☐ ${esc(BY_ID[id].name)}</span><b>${qty(id, g, true)}</b></div>`).join('')}</div>`).join('')}
  </div></section>`;
}

function recipe(r, i) {
  const v = validate(r.items, BY_ID, r.kcalTarget);
  const n = v.nutrition;
  const t = TEMPLATE_BY_ID[r.templateId];
  const ppl = PEOPLE[i];
  const img = `img/${r.templateId}.jpg`;
  return `<article class="rec">
  <img src="${img}" alt="">
  <div class="body">
    <div class="eyebrow">${MEAL[i]} · ${r.time} perc · ${esc(r.method)}</div>
    <h3>${esc(r.name)}</h3>
    <div class="mac"><b>${nf(n.kcal)} kcal</b> · fehérje ${nf(n.p)} g · zsír ${nf(n.f)} g · szénhidrát ${nf(n.c, 1)} g <span>(${v.status === 'PASS' ? 'makró OK' : v.status})</span></div>
    <table class="ing"><tr><th></th><th>Neked</th>${ppl > 1 ? `<th>${ppl} főre</th>` : ''}</tr>
    ${r.items.filter((it) => it.g > 0).map((it) => `<tr><td>${esc(BY_ID[it.id].name)}</td><td>${qty(it.id, it.g)}</td>${ppl > 1 ? `<td>${qty(it.id, it.g * ppl)}</td>` : ''}</tr>`).join('')}
    </table>
    ${t?.spices ? `<p class="spice">+ ${esc(t.spices)}</p>` : ''}
    <ol>${renderSteps(r, BY_ID).map((s) => `<li>${esc(s)}</li>`).join('')}</ol>
  </div></article>`;
}

const days = Object.entries(pl.days);
const html = `<!doctype html><html lang="hu"><head><meta charset="utf-8"><title>${esc(pl.title)}</title><style>
@page { size: A4; margin: 12mm; }
* { box-sizing: border-box; }
body { font-family: Inter, "Segoe UI", Arial, sans-serif; color: #111; font-size: 9.5pt; line-height: 1.35; margin: 0; }
h1 { font-size: 22pt; margin: 0 0 2mm; letter-spacing: -.02em; }
h2 { font-size: 14pt; margin: 0 0 1mm; border-bottom: 2px solid #111; padding-bottom: 1mm; }
.sub { color: #555; margin: 0 0 5mm; }
table.over { width: 100%; border-collapse: collapse; margin-bottom: 6mm; }
table.over th, table.over td { border: 1px solid #ccc; padding: 1.5mm 2mm; text-align: left; vertical-align: top; }
table.over th { background: #111; color: #fff; font-weight: 600; }
.shop { break-inside: avoid; margin-bottom: 6mm; }
.note { color: #555; margin: 1mm 0 2mm; }
.cols { columns: 2; column-gap: 8mm; }
.grp { break-inside: avoid; margin-bottom: 3mm; }
.grp h4 { font-size: 8pt; text-transform: uppercase; letter-spacing: .06em; color: #1a7f37; margin: 0 0 1mm; }
.row { display: flex; justify-content: space-between; border-bottom: 1px dotted #bbb; padding: .6mm 0; }
.day { break-before: page; }
.day h2 { margin-bottom: 4mm; }
.rec { display: flex; gap: 5mm; break-inside: avoid; margin-bottom: 5mm; padding-bottom: 4mm; border-bottom: 1px solid #ddd; }
.rec img { width: 42mm; height: 42mm; object-fit: cover; flex: none; }
.rec .body { flex: 1; min-width: 0; }
.eyebrow { font-size: 7.5pt; text-transform: uppercase; letter-spacing: .08em; color: #1a7f37; font-weight: 700; }
.rec h3 { font-size: 12.5pt; margin: .5mm 0 1mm; }
.mac { margin-bottom: 1.5mm; } .mac span { color: #1a7f37; }
table.ing { border-collapse: collapse; margin-bottom: 1mm; }
table.ing td, table.ing th { padding: .3mm 4mm .3mm 0; text-align: left; }
table.ing th { font-size: 7.5pt; color: #555; font-weight: 600; }
table.ing td:not(:first-child) { font-variant-numeric: tabular-nums; white-space: nowrap; }
.spice { color: #555; margin: 0 0 1mm; }
ol { margin: 1mm 0 0; padding-left: 4.5mm; } li { margin-bottom: .6mm; }
</style></head><body>
<h1>${esc(pl.title)}</h1>
<p class="sub">${day(days[0][0])} – ${day(days[days.length - 1][0])} · Reggeli 1 főre, ebéd és vacsora 2 főre · minden adag makróellenőrzött (zsír 66%, fehérje 27%, szénhidrát 6%)</p>
<table class="over"><tr><th>Nap</th>${MEAL.map((m) => `<th>${m}</th>`).join('')}</tr>
${days.map(([d, rs]) => `<tr><td><b>${day(d)}</b></td>${rs.map((r) => `<td>${esc(r.name)}</td>`).join('')}</tr>`).join('')}</table>
${(pl.trips || []).map(shopList).join('')}
${days.map(([d, rs]) => `<section class="day"><h2>${day(d)}</h2>${rs.map(recipe).join('')}</section>`).join('')}
</body></html>`;

// Ékezetmentes ideiglenes mappában, külön Chrome-profillal (a futó böngészőt nem zavarja)
const dir = resolve(tmpdir(), 'ketochef-print');
mkdirSync(dir, { recursive: true });
mkdirSync(resolve(dir, 'img'), { recursive: true });
for (const f of readdirSync('img')) copyFileSync(resolve('img', f), resolve(dir, 'img', f)); // cpSync összeomlik ékezetes útvonalon
writeFileSync(resolve(dir, 'menu.html'), html);
const pdf = resolve(dir, 'menu.pdf');
execFileSync('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--disable-gpu', '--no-pdf-header-footer', `--user-data-dir=${resolve(dir, 'profile')}`, `--print-to-pdf=${pdf}`, pathToFileURL(resolve(dir, 'menu.html')).href], { stdio: 'ignore' });
copyFileSync(pdf, OUT);
console.log('PDF:', OUT);
