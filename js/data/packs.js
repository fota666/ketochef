// Bolti kiszerelések (magyar szupermarket, Lidl jellegű), hogy a bevásárlólista ne grammot, hanem megvehető mennyiséget mutasson.
// g: csomagméretek grammban (folyadéknál ml ≈ g), ml: folyadék, pc: darabos áru (név, átlagos tömeg), mult: csak ennyi darabonként kapható.
export const PACKS = {
  csirkecomb: { g: [650] }, csirkemell: { g: [500] }, pulykamell: { g: [500] },
  marha5: { g: [500] }, marha10: { g: [500] }, marha15: { g: [500] }, marha20: { g: [500] },
  sertes10: { g: [500] }, sertes15: { g: [500] }, sertes20: { g: [500] },
  tarja: { g: [500] }, steak: { g: [300] }, bacon: { g: [250] }, prosciutto: { g: [100] },
  garnela: { g: [200] }, fustoltlazac: { g: [100] }, szardinia: { pc: 'konzerv', g: 90 }, lazac: { g: [250] },
  tojas: { pc: 'db', g: 50, mult: 10 }, tojasfeherje: { ml: [500] },
  cheddar: { g: [200] }, parmezan: { g: [100] }, mozzarella: { g: [125] }, burrata: { g: [125] }, feta: { g: [200] },
  kecskesajt: { g: [150] }, halloumi: { g: [200] }, gouda: { g: [400, 700] }, camembert: { g: [125] }, gorgonzola: { g: [150] },
  turo: { g: [250] }, cottage: { g: [200] }, tejfol: { g: [330, 800] }, gorogjoghurt: { g: [400] }, tejszin: { ml: [200, 500] }, kremsajt: { g: [200] },
  brokkoli: { pc: 'fej', g: 400 }, karfiol: { pc: 'fej', g: 700 }, kelbimbo: { g: [500] }, gomba: { g: [250, 500] }, spenot: { g: [200] },
  kaposzta: { pc: 'fej', g: 1200 }, lilakaposzta: { pc: 'fej', g: 1000 }, savanyukaposzta: { g: [500] }, kelkaposzta: { pc: 'fej', g: 800 },
  cukkini: { pc: 'db', g: 300 }, padlizsan: { pc: 'db', g: 350 }, paradicsom: { pc: 'db', g: 120 }, koktelparadicsom: { g: [250] },
  paprika: { g: [500] }, uborka: { pc: 'db', g: 350 }, romai: { pc: 'fej', g: 300 }, rukkola: { g: [100] }, jegsalata: { pc: 'fej', g: 500 },
  retek: { pc: 'csomó', g: 150 }, zeller: { pc: 'db', g: 500 }, porehagyma: { pc: 'szál', g: 250 }, zoldbab: { g: [450] }, pakchoi: { g: [250] },
  avokado: { pc: 'db', g: 150 }, zoldoliva: { g: [150] }, feketeoliva: { g: [150] },
  voroshagyma: { pc: 'db', g: 100 }, lilahagyma: { pc: 'db', g: 100 }, ujhagyma: { pc: 'csomó', g: 100 }, fokhagyma: { pc: 'fej', g: 50 },
  gyomber: { pc: 'darab', g: 60 }, chili: { pc: 'db', g: 15 }, kimchi: { g: [300] }, savanyuuborka: { g: [350] }, malna: { g: [125] },
  olivaolaj: { ml: [500] }, vaj: { g: [250] }, szezamolaj: { ml: [250] }, majonez: { g: [400] }, pesto: { g: [190] }, kokusztej: { ml: [400] },
  dio: { g: [200] }, mandula: { g: [200] }, mogyoro: { g: [200] }, pisztacia: { g: [150] }, tokmag: { g: [200] }, chiamag: { g: [300] },
  lenmag: { g: [250] }, szezammag: { g: [250] }, foldimogyoro: { g: [250] }, tahini: { g: [300] }, etcsoki: { g: [100] },
  szojaszosz: { ml: [150] }, sriracha: { ml: [200] }, mustar: { g: [300] }, ketchup0: { g: [500] }, citromle: { ml: [250] }, ecet: { ml: [1000] },
  kapribogyo: { g: [100] }, paradicsompure: { g: [140] }, fuszerpaprika: { g: [100] }, passata: { g: [500] },
  szarzeller: { pc: 'db', g: 400 }, napraforgoolaj: { ml: [1000] }, kinaikel: { pc: 'fej', g: 800 }, mungbabcsira: { g: [300] },
  karalabe: { pc: 'db', g: 300 }, edeskomeny: { pc: 'db', g: 300 }, sparga: { pc: 'csokor', g: 250 }, fejessalata: { pc: 'fej', g: 250 },
  disznozsir: { g: [500] }, zoldpaprika: { pc: 'db', g: 80 }, sargarepa: { pc: 'db', g: 100 }, finomliszt: { g: [1000] }, zabliszt: { g: [500] },
};

// Ami a legtöbb háztartásban van otthon: a lista végén, külön blokkban
export const PANTRY = new Set(['olivaolaj', 'napraforgoolaj', 'szezamolaj', 'disznozsir', 'szojaszosz', 'ecet', 'fuszerpaprika', 'finomliszt', 'zabliszt',
  'mustar', 'citromle', 'sriracha', 'paradicsompure', 'szezammag', 'tahini', 'majonez', 'ketchup0', 'kapribogyo']);

const sz = (g, liquid) => (g >= 1000 ? `${String(g / 1000).replace('.', ',')} ${liquid ? 'l' : 'kg'}` : `${g} ${liquid ? 'ml' : 'g'}`);

// A szükséges grammból megvehető mennyiség. 7% ráhagyás alatt nem veszünk még egy csomagot.
export function packFor(id, need) {
  const p = PACKS[id];
  const want = need * 0.93;
  if (!p) return { text: need >= 1000 ? `${(Math.ceil(need / 100) / 10).toString().replace('.', ',')} kg` : `${Math.ceil(need / 10) * 10} g`, buy: need };
  if (p.pc) {
    // Darabszámra pontosan (tojás), becsült darabtömegnél kis ráhagyással
    let n = Math.max(1, p.mult ? Math.ceil(need / p.g - 0.01) : Math.ceil(want / p.g));
    if (p.mult) n = Math.ceil(n / p.mult) * p.mult;
    return { text: `${n} ${p.pc}`, buy: n * p.g };
  }
  const sizes = p.g || p.ml;
  const liquid = !!p.ml;
  // Legkevesebb maradék, azon belül legkevesebb csomag (legfeljebb két méret)
  let best = null;
  const [a, b = 0] = sizes;
  for (let i = 0; i <= Math.ceil(want / a) + 1; i++) {
    for (let j = 0; j <= (b ? Math.ceil(want / b) + 1 : 0); j++) {
      const tot = i * a + j * b;
      if (tot < want || i + j === 0) continue;
      const k = [tot, i + j];
      if (!best || k[0] < best.k[0] || (k[0] === best.k[0] && k[1] < best.k[1])) best = { k, i, j };
    }
  }
  const parts = [];
  if (best.j) parts.push(`${best.j > 1 ? best.j + ' × ' : ''}${sz(b, liquid)}`);
  if (best.i) parts.push(`${best.i > 1 ? best.i + ' × ' : ''}${sz(a, liquid)}`);
  return { text: parts.join(' + '), buy: best.k[0] };
}
