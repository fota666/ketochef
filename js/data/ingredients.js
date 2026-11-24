// Tápértékek 100 g nyers, ehető részre.
// c = szénhidrát EU-címke szerint (rost NÉLKÜL). USDA-adatnál c = total carbohydrate - fiber.
// q: 'ref' = USDA FoodData Central (SR Legacy) általános referencia
//    'becsült' = tipikus magyar/EU címkeérték vagy zsír%-ból számított érték, termékcímkével pontosítandó
// range: [min, javasolt, max] gramm egy adagban, a receptkeret felülírhatja
// score: ízlésprofil 1-10

const USDA = 'USDA FDC SR Legacy';
const CIMKE = 'Tipikus EU/HU címkeérték';

export const CATEGORIES = {
  hus: 'Húsok',
  hal: 'Hal, tenger gyümölcsei',
  tojas: 'Tojás',
  tej: 'Sajtok, tejtermékek',
  zold: 'Zöldségek',
  zsir: 'Zsiradékok',
  mag: 'Magvak',
  szosz: 'Szószok, ízesítők',
  egyeb: 'Egyéb',
};

const I = (id, name, cat, kcal, p, f, c, fiber, q, src, range, score, extra = {}) => ({
  id, name, cat, per100: { kcal, p, f, c, fiber }, q, src, range, score, step: 5, ...extra,
});

export const INGREDIENTS = [
  // Húsok
  I('csirkecomb', 'Csirkecombfilé, bőr nélkül', 'hus', 121, 19.7, 4.1, 0, 0, 'ref', USDA + ' 05096', [120, 200, 260], 10),
  I('csirkemell', 'Csirkemell, bőr nélkül', 'hus', 120, 22.5, 2.6, 0, 0, 'ref', USDA + ' 05062', [120, 180, 240], 8),
  I('pulykamell', 'Pulykamell', 'hus', 114, 23.7, 1.5, 0, 0, 'ref', USDA, [120, 170, 230], 4),
  I('marha5', 'Darált marha 5% zsír', 'hus', 137, 21.4, 5.0, 0, 0, 'ref', USDA + ' 95/5', [120, 180, 240], 9),
  I('marha10', 'Darált marha 10% zsír', 'hus', 176, 20.0, 10.0, 0, 0, 'ref', USDA + ' 90/10', [120, 170, 230], 10),
  I('marha15', 'Darált marha 15% zsír', 'hus', 215, 18.6, 15.0, 0, 0, 'ref', USDA + ' 85/15', [110, 160, 220], 10),
  I('marha20', 'Darált marha 20% zsír', 'hus', 254, 17.2, 20.0, 0, 0, 'ref', USDA + ' 80/20', [100, 150, 210], 10),
  I('sertes10', 'Darált sertés 10% zsír', 'hus', 168, 19.5, 10.0, 0, 0, 'becsült', 'Számított a névleges zsír%-ból', [120, 170, 230], 8),
  I('sertes15', 'Darált sertés 15% zsír', 'hus', 208, 18.3, 15.0, 0, 0, 'becsült', 'Számított a névleges zsír%-ból', [110, 160, 220], 8),
  I('sertes20', 'Darált sertés 20% zsír', 'hus', 248, 17.0, 20.0, 0, 0, 'becsült', 'Számított a névleges zsír%-ból', [100, 150, 210], 8),
  I('tarja', 'Sertéstarja', 'hus', 212, 17.0, 16.0, 0, 0, 'becsült', USDA + ' pork shoulder blade, kerekítve', [120, 180, 230], 10),
  I('steak', 'Marha hátszín (steak)', 'hus', 201, 19.5, 13.0, 0, 0, 'ref', USDA + ' top sirloin, raw', [140, 200, 260], 10),
  I('bacon', 'Bacon', 'hus', 417, 13.0, 40.0, 1.4, 0, 'ref', USDA + ' cured bacon, raw', [15, 35, 60], 10),
  I('prosciutto', 'Prosciutto', 'hus', 250, 26.0, 16.0, 0.3, 0, 'becsült', CIMKE, [15, 30, 50], 4),

  // Hal
  I('garnela', 'Garnélarák, nyers', 'hal', 85, 20.1, 0.5, 0, 0, 'ref', USDA, [120, 180, 250], 7),
  I('fustoltlazac', 'Füstölt lazac', 'hal', 117, 18.3, 4.3, 0, 0, 'ref', USDA, [50, 80, 120], 9),
  I('szardinia', 'Szardínia olajban, lecsepegtetve', 'hal', 208, 24.6, 11.5, 0, 0, 'ref', USDA, [60, 90, 125], 7),
  I('lazac', 'Lazacfilé', 'hal', 208, 20.4, 13.4, 0, 0, 'ref', USDA, [120, 160, 200], 4),

  // Tojás
  I('tojas', 'Tojás', 'tojas', 143, 12.6, 9.5, 0.7, 0, 'ref', USDA + ' 01123', [100, 150, 250], 10, { unit: { name: 'db', g: 50 }, step: 50 }),
  I('tojasfeherje', 'Tojásfehérje', 'tojas', 52, 10.9, 0.2, 0.7, 0, 'ref', USDA, [0, 60, 120], 6, { step: 10 }),

  // Tejtermékek
  I('cheddar', 'Cheddar', 'tej', 403, 24.9, 33.1, 1.3, 0, 'ref', USDA, [15, 35, 70], 10),
  I('parmezan', 'Parmezán', 'tej', 392, 35.8, 25.8, 3.2, 0, 'ref', USDA, [10, 20, 40], 10),
  I('mozzarella', 'Mozzarella (golyó)', 'tej', 253, 18.0, 19.5, 1.0, 0, 'becsült', CIMKE, [30, 70, 125], 9),
  I('burrata', 'Burrata', 'tej', 236, 14.0, 20.0, 1.5, 0, 'becsült', CIMKE, [40, 70, 125], 8),
  I('feta', 'Feta', 'tej', 264, 16.5, 21.5, 0.7, 0, 'becsült', CIMKE, [25, 50, 90], 9),
  I('kecskesajt', 'Kecskesajt (friss)', 'tej', 264, 18.5, 21.0, 0.9, 0, 'ref', USDA + ' goat cheese soft', [25, 45, 80], 8),
  I('halloumi', 'Halloumi', 'tej', 321, 21.0, 25.0, 2.0, 0, 'becsült', CIMKE, [40, 70, 110], 6),
  I('gouda', 'Gouda', 'tej', 356, 24.9, 27.4, 2.2, 0, 'ref', USDA, [15, 35, 60], 7),
  I('camembert', 'Camembert / brie', 'tej', 300, 19.8, 24.3, 0.5, 0, 'ref', USDA, [30, 50, 80], 8),
  I('gorgonzola', 'Gorgonzola / kéksajt', 'tej', 353, 21.4, 28.7, 2.3, 0, 'ref', USDA + ' blue cheese', [15, 30, 50], 7),
  I('turo', 'Túró, félzsíros', 'tej', 119, 15.0, 5.0, 3.5, 0, 'becsült', CIMKE, [100, 200, 250], 8),
  I('cottage', 'Cottage cheese', 'tej', 98, 11.1, 4.3, 3.4, 0, 'ref', USDA, [100, 150, 250], 6),
  I('tejfol', 'Tejföl 20%', 'tej', 204, 2.7, 20.0, 3.4, 0, 'becsült', CIMKE, [20, 50, 100], 9),
  I('gorogjoghurt', 'Görög joghurt 10%', 'tej', 133, 5.0, 10.0, 4.0, 0, 'becsült', CIMKE, [50, 100, 150], 6),
  I('tejszin', 'Habtejszín 30%', 'tej', 292, 2.3, 30.0, 3.2, 0, 'becsült', CIMKE, [20, 50, 100], 8),
  I('kremsajt', 'Krémsajt', 'tej', 235, 5.9, 21.5, 3.2, 0, 'becsült', CIMKE, [20, 40, 70], 7),

  // Zöldségek (USDA, c = total - fiber)
  I('brokkoli', 'Brokkoli', 'zold', 34, 2.8, 0.4, 4.0, 2.6, 'ref', USDA, [80, 180, 300], 9, { step: 10 }),
  I('karfiol', 'Karfiol', 'zold', 25, 1.9, 0.3, 3.0, 2.0, 'ref', USDA, [80, 200, 350], 9, { step: 10 }),
  I('kelbimbo', 'Kelbimbó', 'zold', 43, 3.4, 0.3, 5.2, 3.8, 'ref', USDA, [80, 150, 220], 9, { step: 10 }),
  I('gomba', 'Csiperkegomba', 'zold', 22, 3.1, 0.3, 2.3, 1.0, 'ref', USDA, [80, 200, 350], 10, { step: 10 }),
  I('spenot', 'Spenót', 'zold', 23, 2.9, 0.4, 1.4, 2.2, 'ref', USDA, [50, 150, 300], 8, { step: 10 }),
  I('kaposzta', 'Fejes káposzta', 'zold', 25, 1.3, 0.1, 3.3, 2.5, 'ref', USDA, [80, 150, 250], 6, { step: 10 , group: 'kaposzta' }),
  I('lilakaposzta', 'Lila káposzta', 'zold', 31, 1.4, 0.2, 5.3, 2.1, 'ref', USDA, [50, 100, 180], 6, { step: 10 , group: 'kaposzta' }),
  I('savanyukaposzta', 'Savanyú káposzta', 'zold', 19, 0.9, 0.1, 1.4, 2.9, 'ref', USDA, [80, 150, 300], 8, { step: 10 }),
  I('kelkaposzta', 'Kelkáposzta', 'zold', 27, 2.0, 0.1, 3.0, 3.1, 'ref', USDA, [80, 150, 250], 7, { step: 10 }),
  I('cukkini', 'Cukkini', 'zold', 17, 1.2, 0.3, 2.1, 1.0, 'ref', USDA, [80, 180, 300], 7, { step: 10 }),
  I('padlizsan', 'Padlizsán', 'zold', 25, 1.0, 0.2, 2.9, 3.0, 'ref', USDA, [80, 180, 300], 8, { step: 10 }),
  I('paradicsom', 'Paradicsom', 'zold', 18, 0.9, 0.2, 2.7, 1.2, 'ref', USDA, [60, 150, 250], 10, { step: 10 , group: 'paradicsom' }),
  I('koktelparadicsom', 'Koktélparadicsom', 'zold', 18, 0.9, 0.2, 2.7, 1.2, 'ref', USDA, [50, 100, 200], 10, { step: 10 , group: 'paradicsom' }),
  I('paprika', 'Kaliforniai paprika', 'zold', 31, 1.0, 0.3, 3.9, 2.1, 'ref', USDA, [40, 100, 180], 7, { step: 10 }),
  I('uborka', 'Uborka', 'zold', 15, 0.7, 0.1, 3.1, 0.5, 'ref', USDA, [50, 120, 200], 6, { step: 10 }),
  I('romai', 'Római saláta', 'zold', 17, 1.2, 0.3, 1.2, 2.1, 'ref', USDA, [40, 100, 200], 7, { step: 10 , group: 'salata' }),
  I('rukkola', 'Rukkola', 'zold', 25, 2.6, 0.7, 2.1, 1.6, 'ref', USDA, [20, 50, 100], 7, { step: 10 }),
  I('jegsalata', 'Jégsaláta', 'zold', 14, 0.9, 0.1, 1.8, 1.2, 'ref', USDA, [50, 120, 200], 7, { step: 10 , group: 'salata' }),
  I('retek', 'Retek', 'zold', 16, 0.7, 0.1, 1.8, 1.6, 'ref', USDA, [30, 80, 150], 6, { step: 10 }),
  I('zeller', 'Zellergumó', 'zold', 42, 1.5, 0.3, 7.4, 1.8, 'ref', USDA, [40, 80, 150], 6, { step: 10 }),
  I('porehagyma', 'Póréhagyma', 'zold', 61, 1.5, 0.3, 12.4, 1.8, 'ref', USDA, [20, 40, 70], 8),
  I('zoldbab', 'Zöldbab', 'zold', 31, 1.8, 0.2, 4.3, 2.7, 'ref', USDA, [80, 150, 250], 7, { step: 10 }),
  I('pakchoi', 'Pak choi', 'zold', 13, 1.5, 0.2, 1.2, 1.0, 'ref', USDA, [80, 150, 250], 8, { step: 10 }),
  I('avokado', 'Avokádó', 'zold', 160, 2.0, 14.7, 1.8, 6.7, 'ref', USDA, [40, 80, 150], 10),
  I('zoldoliva', 'Zöld olívabogyó', 'zold', 145, 1.0, 15.3, 0.5, 3.3, 'ref', USDA, [15, 30, 60], 10, { group: 'oliva' }),
  I('feketeoliva', 'Fekete olívabogyó', 'zold', 115, 0.8, 10.7, 3.1, 3.2, 'ref', USDA, [15, 30, 50], 6, { group: 'oliva' }),
  I('voroshagyma', 'Vöröshagyma', 'zold', 40, 1.1, 0.1, 7.6, 1.7, 'ref', USDA, [10, 30, 60], 7, { group: 'hagyma' }),
  I('lilahagyma', 'Lilahagyma', 'zold', 40, 1.1, 0.1, 7.6, 1.7, 'ref', USDA + ' (vöröshagyma)', [10, 25, 50], 7, { group: 'hagyma' }),
  I('ujhagyma', 'Újhagyma', 'zold', 32, 1.8, 0.2, 4.7, 2.6, 'ref', USDA, [10, 20, 40], 8),
  I('fokhagyma', 'Fokhagyma', 'zold', 149, 6.4, 0.5, 31.0, 2.1, 'ref', USDA, [4, 8, 15], 10, { step: 1 }),
  I('gyomber', 'Gyömbér', 'zold', 80, 1.8, 0.8, 15.8, 2.0, 'ref', USDA, [3, 8, 15], 9, { step: 1 }),
  I('chili', 'Friss chili', 'zold', 40, 1.9, 0.4, 7.3, 1.5, 'ref', USDA, [2, 8, 15], 9, { step: 1 }),
  I('kimchi', 'Kimchi', 'zold', 15, 1.1, 0.5, 0.8, 1.6, 'ref', USDA, [30, 60, 120], 8, { step: 10 }),
  I('savanyuuborka', 'Cukormentes savanyú uborka', 'zold', 12, 0.5, 0.2, 1.4, 1.0, 'ref', USDA + ' dill pickle', [30, 60, 120], 10, { step: 10 }),
  I('malna', 'Málna', 'egyeb', 52, 1.2, 0.7, 5.4, 6.5, 'ref', USDA, [30, 60, 100], 10, { step: 10 }),

  // Zsiradékok
  I('olivaolaj', 'Extra szűz olívaolaj', 'zsir', 884, 0, 100, 0, 0, 'ref', USDA, [0, 12, 28], 10, { step: 1 }),
  I('vaj', 'Vaj', 'zsir', 717, 0.9, 81.1, 0.1, 0, 'ref', USDA, [0, 12, 28], 10, { step: 1 }),
  I('szezamolaj', 'Szezámolaj', 'zsir', 884, 0, 100, 0, 0, 'ref', USDA, [0, 8, 20], 9, { step: 1 }),
  I('majonez', 'Majonéz', 'zsir', 700, 1.0, 77.0, 1.3, 0, 'becsült', CIMKE, [0, 20, 40], 10, { step: 1 }),
  I('pesto', 'Bazsalikomos pesto', 'zsir', 520, 5.0, 52.0, 6.0, 0, 'becsült', CIMKE, [10, 20, 35], 8, { step: 1 }),
  I('kokusztej', 'Kókusztej (konzerv)', 'zsir', 197, 2.0, 21.0, 2.8, 0, 'becsült', CIMKE, [40, 100, 160], 7),

  // Magvak
  I('dio', 'Dió', 'mag', 654, 15.2, 65.2, 7.0, 6.7, 'ref', USDA, [5, 15, 30], 8, { step: 1 }),
  I('mandula', 'Mandula', 'mag', 579, 21.2, 49.9, 9.1, 12.5, 'ref', USDA, [5, 15, 30], 8, { step: 1 }),
  I('mogyoro', 'Törökmogyoró', 'mag', 628, 15.0, 60.8, 7.0, 9.7, 'ref', USDA, [5, 15, 30], 8, { step: 1 }),
  I('pisztacia', 'Pisztácia', 'mag', 560, 20.2, 45.3, 16.6, 10.6, 'ref', USDA, [5, 12, 20], 10, { step: 1 }),
  I('tokmag', 'Tökmag', 'mag', 559, 30.2, 49.1, 4.7, 6.0, 'ref', USDA, [5, 15, 30], 8, { step: 1 }),
  I('chiamag', 'Chiamag', 'mag', 486, 16.5, 30.7, 7.7, 34.4, 'ref', USDA, [5, 15, 25], 8, { step: 1 }),
  I('lenmag', 'Lenmag', 'mag', 534, 18.3, 42.2, 1.6, 27.3, 'ref', USDA, [5, 10, 20], 6, { step: 1 }),
  I('szezammag', 'Szezámmag', 'mag', 573, 17.7, 49.7, 11.6, 11.8, 'ref', USDA, [3, 8, 15], 8, { step: 1 }),
  I('foldimogyoro', 'Földimogyoró, pörkölt', 'mag', 567, 25.8, 49.2, 7.6, 8.5, 'ref', USDA, [5, 20, 35], 7, { step: 1 }),
  I('mandulaliszt', 'Mandulaliszt (blansírozott)', 'mag', 571, 21.4, 50.0, 10.7, 10.7, 'ref', USDA + ' almond flour', [10, 25, 40], 8, { step: 1 }),
  I('tahini', 'Tahini', 'mag', 595, 17.0, 53.8, 11.9, 9.3, 'ref', USDA, [5, 15, 30], 10, { step: 1 }),
  I('etcsoki', 'Étcsokoládé 85%', 'mag', 584, 12.5, 46.0, 19.0, 0, 'becsült', CIMKE, [0, 10, 20], 10, { step: 1 }),

  // Szószok
  I('szojaszosz', 'Szójaszósz', 'szosz', 53, 8.1, 0.6, 4.1, 0.8, 'ref', USDA, [5, 15, 25], 9, { step: 1 }),
  I('sriracha', 'Sriracha', 'szosz', 93, 1.9, 0.9, 17.0, 2.2, 'ref', USDA, [0, 5, 10], 8, { step: 1 }),
  I('mustar', 'Mustár', 'szosz', 60, 3.7, 3.3, 3.0, 3.3, 'becsült', USDA + ' / címke', [5, 15, 25], 10, { step: 1 }),
  I('ketchup0', 'Cukormentes ketchup', 'szosz', 30, 1.5, 0.2, 5.0, 1.0, 'becsült', 'Termékenként eltér, címke szerint pontosítsd', [0, 15, 25], 9, { step: 1 }),
  I('citromle', 'Citromlé', 'szosz', 22, 0.4, 0.2, 6.6, 0.3, 'ref', USDA, [0, 10, 20], 7, { step: 1 }),
  I('ecet', 'Borecet / almaecet', 'szosz', 21, 0, 0, 0.9, 0, 'ref', USDA, [0, 10, 20], 7, { step: 1 }),
  I('kapribogyo', 'Kapribogyó', 'szosz', 23, 2.4, 0.9, 1.7, 3.2, 'ref', USDA, [0, 10, 20], 4, { step: 1 }),
  I('paradicsompure', 'Paradicsompüré (sűrített)', 'szosz', 82, 4.3, 0.5, 14.8, 4.1, 'ref', USDA, [0, 15, 30], 8, { step: 1 }),
  I('fuszerpaprika', 'Fűszerpaprika, őrölt', 'szosz', 282, 14.1, 12.9, 19.1, 34.9, 'ref', USDA, [0, 3, 8], 9, { step: 1 }),
  I('passata', 'Passata', 'szosz', 32, 1.6, 0.2, 5.5, 1.5, 'becsült', CIMKE, [50, 100, 180], 8, { step: 10 }),
];

export const BY_ID = Object.fromEntries(INGREDIENTS.map((i) => [i.id, i]));

// Amit a recept nem számol (elhanyagolható mennyiség): só, bors, fűszerpaprika, chilipehely, kömény, oregánó, friss fűszernövény.
