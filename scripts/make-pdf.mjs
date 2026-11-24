// Nyomtatható menü (PDF) egy ajánlott tervből: borító, bevásárlólisták, oldalanként két nap képekkel.
// Használat: node scripts/make-pdf.mjs [tervkulcs] [kimenet.pdf]
import { writeFileSync, mkdirSync, readdirSync, copyFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { PLANS } from '../js/data/plans.js';
import { BY_ID, CATEGORIES } from '../js/data/ingredients.js';
import { validate } from '../js/engine/macros.js';

const KEY = process.argv[2] || 'lidl48-v3';
const OUT = resolve(process.argv[3] || '../ketochef-menu.pdf');
const PEOPLE = [1, 2, 2]; // reggeli, ebéd, vacsora
const MEAL = ['Reggeli', 'Ebéd', 'Vacsora'];
const WD = ['vasárnap', 'hétfő', 'kedd', 'szerda', 'csütörtök', 'péntek', 'szombat'];
const pl = PLANS[KEY];
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const nf = (x, d = 0) => x.toLocaleString('hu-HU', { maximumFractionDigits: d, minimumFractionDigits: d });
const mdOf = (d) => { const x = new Date(d + 'T12:00:00'); return `${x.getMonth() + 1}.${String(x.getDate()).padStart(2, '0')}.`; };
const wdOf = (d) => WD[new Date(d + 'T12:00:00').getDay()];
const short = (id) => BY_ID[id].name.split(',')[0].replace(/\s*\(.*\)/, '').replace(/\s+\d+%.*$/, '').toLowerCase();

function qty(id, g) {
  const u = BY_ID[id].unit;
  if (u) return `${Math.ceil(g / u.g - 0.05)} ${u.name}`;
  if (g >= 1000) return `${nf(Math.ceil(g / 100) / 10, 1)} kg`;
  return `${nf(Math.ceil(g / 10) * 10)} g`;
}

function shopList(t) {
  const sums = {};
  const add = (d, ok) => pl.days[d].forEach((r, i) => { for (const it of r.items) if (it.g > 0 && ok(it.id) && (!t.only || t.only.includes(it.id))) sums[it.id] = (sums[it.id] || 0) + it.g * PEOPLE[i]; });
  t.days.forEach((d) => add(d, () => true));
  (t.also?.days || []).forEach((d) => add(d, (id) => !t.also.except.includes(id)));
  const groups = {};
  for (const [id, g] of Object.entries(sums)) (groups[BY_ID[id].cat] ||= []).push([id, g]);
  return `<section class="trip"><h2><span style="text-transform:capitalize">${wdOf(t.date)}</span> ${mdOf(t.date)}<small>${esc(t.note || '')}</small></h2><div class="cols">
  ${Object.keys(CATEGORIES).filter((c) => groups[c]).map((c) => `<div class="grp"><h4>${esc(CATEGORIES[c])}</h4>${groups[c].sort((a, b) => short(a[0]).localeCompare(short(b[0]), 'hu')).map(([id, g]) => `<div class="it"><span>${esc(short(id))}</span><b>${qty(id, g)}</b></div>`).join('')}</div>`).join('')}
  </div></section>`;
}

const kcalOf = (r) => validate(r.items, BY_ID, r.kcalTarget).nutrition;
function card(r, i) {
  const n = kcalOf(r);
  const ings = [...new Set(r.items.filter((it) => it.g > 0).map((it) => short(it.id)))];
  return `<article class="card">
    <div class="ph"><img src="img/${r.templateId}.jpg" alt=""><span class="tag">${MEAL[i]}${PEOPLE[i] > 1 ? ` · ${PEOPLE[i]} fő` : ''}</span></div>
    <h3>${esc(r.name)}</h3>
    <div class="mac"><b>${nf(n.kcal)}</b> kcal<i>F ${nf(n.p)}</i><i>Zs ${nf(n.f)}</i><i>Sz ${nf(n.c)}</i></div>
    <p class="ings">${esc(ings.join(', '))}</p>
  </article>`;
}

const days = Object.entries(pl.days);
const dayKcal = (rs) => rs.reduce((a, r) => a + kcalOf(r).kcal, 0);
const dayBlock = ([d, rs]) => `<section class="day">
  <header><span class="wd">${wdOf(d)}</span><span class="md">${mdOf(d)}</span><span class="dk">${nf(dayKcal(rs))} kcal</span></header>
  <div class="row3">${rs.map(card).join('')}</div></section>`;
const pairs = [];
for (let i = 0; i < days.length; i += 2) pairs.push(days.slice(i, i + 2));
const kc = days.map(([, rs]) => dayKcal(rs));
const foot = (n) => `<div class="foot"><span>Reggeli 1 főre · ebéd, vacsora 2 főre</span><span>${n}</span></div>`;

const html = `<!doctype html><html lang="hu"><head><meta charset="utf-8"><title>${esc(pl.title)}</title><style>
@page { size: A4; margin: 0; }
* { box-sizing: border-box; margin: 0; padding: 0; }
:root { --ink: #111; --mute: #777; --line: #e3e3e3; --acc: #1a7f37; }
body { font-family: "Segoe UI", Inter, Arial, sans-serif; color: var(--ink); font-size: 9pt; line-height: 1.35; }
.page { width: 210mm; height: 297mm; padding: 14mm 14mm 16mm; break-after: page; position: relative; overflow: hidden; display: flex; flex-direction: column; }
.page:last-child { break-after: auto; }
.foot { position: absolute; bottom: 7mm; left: 14mm; right: 14mm; display: flex; justify-content: space-between; font-size: 6.8pt; color: var(--mute); letter-spacing: .14em; text-transform: uppercase; }
.kicker { font-size: 8pt; letter-spacing: .25em; text-transform: uppercase; color: var(--acc); font-weight: 700; }
.cover h1 { font-size: 58pt; line-height: .95; font-weight: 800; letter-spacing: -.045em; margin: 4mm 0 3mm; }
.cover .dates { font-size: 13pt; color: var(--mute); margin-bottom: 8mm; }
.mosaic { display: grid; grid-template-columns: 24mm repeat(3, 1fr); grid-auto-rows: 1fr; gap: 1.6mm; flex: 1; min-height: 0; }
.mosaic .h { font-size: 7pt; letter-spacing: .2em; text-transform: uppercase; color: var(--mute); align-self: end; }
.mosaic .d { display: flex; flex-direction: column; justify-content: center; border-top: 2px solid var(--ink); font-weight: 800; font-size: 10pt; text-transform: capitalize; }
.mosaic .d small { font-weight: 400; color: var(--mute); font-size: 7.5pt; }
.mosaic img { width: 100%; height: 100%; object-fit: cover; display: block; min-height: 0; }
.stats { display: flex; gap: 12mm; margin-top: 7mm; border-top: 2px solid var(--ink); padding-top: 3mm; }
.stats b { display: block; font-size: 18pt; font-weight: 800; letter-spacing: -.02em; }
.stats span { font-size: 7pt; color: var(--mute); text-transform: uppercase; letter-spacing: .14em; }
.shop-h { font-size: 30pt; font-weight: 800; letter-spacing: -.035em; margin: 3mm 0 7mm; }
.trip { margin-bottom: 8mm; }
.trip h2 { display: flex; align-items: baseline; gap: 4mm; font-size: 16pt; font-weight: 800; border-bottom: 2px solid var(--ink); padding-bottom: 1.5mm; }
.trip h2 small { font-size: 8.5pt; font-weight: 400; color: var(--mute); }
.cols { columns: 3; column-gap: 7mm; margin-top: 3.5mm; }
.grp { break-inside: avoid; margin-bottom: 3.5mm; }
.grp h4 { font-size: 6.8pt; text-transform: uppercase; letter-spacing: .16em; color: var(--acc); margin-bottom: .8mm; }
.it { display: flex; justify-content: space-between; gap: 2mm; padding: .6mm 0; border-bottom: 1px solid var(--line); }
.it b { font-weight: 600; white-space: nowrap; font-variant-numeric: tabular-nums; }
.it span::first-letter { text-transform: uppercase; }
.it span::before { content: ""; display: inline-block; width: 2.4mm; height: 2.4mm; border: 1px solid var(--ink); margin-right: 1.8mm; vertical-align: -.3mm; }
.day { flex: 1; display: flex; flex-direction: column; }
.day + .day { margin-top: 6mm; }
.day header { display: flex; align-items: baseline; gap: 3mm; border-bottom: 2px solid var(--ink); padding-bottom: 1.5mm; margin-bottom: 4mm; }
.wd { font-size: 26pt; font-weight: 800; letter-spacing: -.035em; text-transform: capitalize; }
.md { font-size: 12pt; color: var(--mute); }
.dk { margin-left: auto; font-size: 9pt; font-weight: 600; }
.row3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 5mm; }
.ph { position: relative; aspect-ratio: 1; overflow: hidden; margin-bottom: 2.5mm; }
.ph img { width: 100%; height: 100%; object-fit: cover; display: block; }
.tag { position: absolute; left: 0; top: 0; background: var(--ink); color: #fff; font-size: 6.6pt; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; padding: 1.2mm 2.2mm; }
.card h3 { font-size: 10.5pt; font-weight: 700; line-height: 1.2; letter-spacing: -.01em; margin-bottom: 1.2mm; min-height: 2.4em; }
.mac { font-size: 7.8pt; margin-bottom: 1.4mm; }
.mac b { font-size: 10pt; }
.mac i { font-style: normal; color: var(--mute); margin-left: 2.2mm; }
.ings { font-size: 7.8pt; color: #555; }
</style></head><body>

<div class="page cover">
  <div class="kicker">KetoChef · Lidl akciós hét</div>
  <h1>Keto hét</h1>
  <div class="dates">${mdOf(days[0][0])} ${wdOf(days[0][0])} – ${mdOf(days[days.length - 1][0])} ${wdOf(days[days.length - 1][0])}</div>
  <div class="mosaic">
    <div></div>${MEAL.map((m) => `<div class="h">${m}</div>`).join('')}
    ${days.map(([d, rs]) => `<div class="d">${wdOf(d)}<small>${mdOf(d)}</small></div>${rs.map((r) => `<img src="img/${r.templateId}.jpg" alt="">`).join('')}`).join('')}
  </div>
  <div class="stats">
    <div><b>${nf(Math.min(...kc))}–${nf(Math.max(...kc))}</b><span>kcal naponta</span></div>
    <div><b>66 / 27 / 6</b><span>zsír / fehérje / szénh. %</span></div>
    <div><b>${days.length * 3}</b><span>étel, mind makró OK</span></div>
  </div>
  ${foot(1)}
</div>

<div class="page">
  <div class="kicker">Lidl</div>
  <div class="shop-h">Bevásárlás</div>
  ${(pl.trips || []).map(shopList).join('')}
  ${foot(2)}
</div>

${pairs.map((pp, k) => `<div class="page">${pp.map(dayBlock).join('')}${foot(k + 3)}</div>`).join('')}
</body></html>`;

// Ékezetmentes ideiglenes mappában, külön Chrome-profillal (a futó böngészőt nem zavarja)
const dir = resolve(tmpdir(), 'ketochef-print');
mkdirSync(resolve(dir, 'img'), { recursive: true });
for (const f of readdirSync('img')) copyFileSync(resolve('img', f), resolve(dir, 'img', f)); // cpSync összeomlik ékezetes útvonalon
writeFileSync(resolve(dir, 'menu.html'), html);
const pdf = resolve(dir, 'menu.pdf');
execFileSync('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--disable-gpu', '--no-pdf-header-footer', `--user-data-dir=${resolve(dir, 'profile')}`, `--print-to-pdf=${pdf}`, pathToFileURL(resolve(dir, 'menu.html')).href], { stdio: 'ignore' });
copyFileSync(pdf, OUT);
console.log('PDF:', OUT);
