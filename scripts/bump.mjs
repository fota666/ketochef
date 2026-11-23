// Gyorsítótár-ürítés: minden relatív JS/CSS hivatkozás kap egy ?v=<verzió> paramétert.
// Használat: node scripts/bump.mjs
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
const v = Date.now().toString(36);
const files = [];
const walk = (d) => { for (const f of readdirSync(d)) { const p = join(d, f); statSync(p).isDirectory() ? walk(p) : p.endsWith('.js') && files.push(p); } };
walk('js');
for (const f of files) {
  const s = readFileSync(f, 'utf8');
  const out = s.replace(/(from\s+'\.{1,2}\/[^'?]+\.js)(\?v=[^']*)?'/g, `$1?v=${v}'`);
  if (out !== s) writeFileSync(f, out);
}
const h = readFileSync('index.html', 'utf8').replace(/(href="css\/style\.css|src="js\/app\.js)(\?v=[^"]*)?"/g, `$1?v=${v}"`);
writeFileSync('index.html', h);
console.log('verzió', v);
