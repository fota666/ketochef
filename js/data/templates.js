// Receptkeretek: kulinárisan összeillő alapanyag-csoportok.
// slot.pick = [min, max] hány elem kerül a slotból a receptbe.
// ranges: az alapanyag alap [min, javasolt, max] grammját írja felül ebben a keretben.
// steps: {slotkulcs} helyére a kiválasztott alapanyagok neve kerül. Ha a slot üres, a lépés kimarad.

export const CUISINES = {
  azsiai: "Ázsiai",
  mediterran: "Mediterrán",
  burger: "Burger és grill",
  olasz: "Gombás-olaszos",
  magyaros: "Magyaros",
  klasszikus: "Klasszikus reggeli"
};

export const MEALS = {
  reggeli: "Reggeli",
  foetel: "Ebéd / vacsora"
};

// Négy független receptátnézés után (íz, állag, zöldség, makró-ellenőrzés), 2026-11-24
export const TEMPLATES = [
  {
    id: "wok",
    name: "Fokhagymás-gyömbéres wok",
    cuisine: "azsiai",
    meals: [
      "foetel"
    ],
    method: "Wok",
    time: 20,
    slots: [
      {
        key: "feh",
        label: "Fehérje",
        pick: [
          1,
          1
        ],
        options: [
          "csirkecomb",
          "csirkemell",
          "tarja",
          "steak"
        ]
      },
      {
        key: "zold",
        label: "Zöldség",
        pick: [
          2,
          3
        ],
        options: [
          "brokkoli",
          "karfiol",
          "zoldbab",
          "kaposzta",
          "kinaikel",
          "pakchoi",
          "spenot",
          "gomba",
          "paprika",
          "cukkini",
          "mungbabcsira",
          "szarzeller"
        ]
      },
      {
        key: "zsir",
        label: "Sütőolaj",
        pick: [
          1,
          1
        ],
        options: [
          "napraforgoolaj"
        ]
      },
      {
        key: "szosz",
        label: "Szósz",
        pick: [
          1,
          1
        ],
        options: [
          "majonez",
          "tahini"
        ]
      },
      {
        key: "ropi",
        label: "Ropogós feltét",
        pick: [
          1,
          1
        ],
        options: [
          "foldimogyoro",
          "szezammag",
          "mandula"
        ]
      },
      {
        key: "friss",
        label: "Friss feltét",
        pick: [
          1,
          1
        ],
        options: [
          "ujhagyma",
          "chili"
        ]
      }
    ],
    fixed: [
      {
        id: "fokhagyma"
      },
      {
        id: "gyomber"
      },
      {
        id: "szojaszosz"
      },
      {
        id: "szezamolaj"
      }
    ],
    ranges: {
      fokhagyma: [
        4,
        8,
        12
      ],
      gyomber: [
        3,
        6,
        10
      ],
      szojaszosz: [
        8,
        15,
        25
      ],
      szezamolaj: [
        3,
        5,
        10
      ],
      napraforgoolaj: [
        5,
        12,
        20
      ],
      majonez: [
        0,
        20,
        30
      ],
      tahini: [
        0,
        15,
        25
      ],
      foldimogyoro: [
        10,
        20,
        30
      ],
      mandula: [
        10,
        15,
        25
      ],
      szezammag: [
        5,
        8,
        12
      ],
      ujhagyma: [
        10,
        20,
        30
      ],
      chili: [
        3,
        6,
        10
      ],
      brokkoli: [
        60,
        120,
        200
      ],
      karfiol: [
        60,
        120,
        200
      ],
      zoldbab: [
        60,
        100,
        150
      ],
      kaposzta: [
        60,
        100,
        180
      ],
      kinaikel: [
        60,
        120,
        200
      ],
      pakchoi: [
        60,
        120,
        200
      ],
      spenot: [
        50,
        100,
        200
      ],
      gomba: [
        60,
        120,
        200
      ],
      paprika: [
        40,
        80,
        120
      ],
      cukkini: [
        60,
        120,
        200
      ]
    },
    spices: "chilipehely, fehér bors",
    steps: [
      "Vágd vékony csíkokra a fehérjét ({feh}), a garnélát hagyd egészben. Forgasd össze a szójaszósz felével.",
      "Vágd falatnyira a zöldséget ({zold}), aprítsd fel a fokhagymát és a gyömbért.",
      "Hevítsd a wokot füstölésig, tedd bele a sütőolaj ({zsir}) felét, és nagy lángon pirítsd a fehérjét: csirke és tarja 5-6 perc, marha 2 perc, garnéla 2-3 perc. Szedd ki.",
      "A maradék olajon pirítsd a zöldséget 3-4 percig, a spenótot, a pak choi levelét és a csírát csak az utolsó percben add hozzá. A fokhagymát és a gyömbért az utolsó 30 másodpercben keverd bele.",
      "Forgasd vissza a fehérjét, öntsd rá a maradék szójaszószt, és a tűzről levéve csorgasd rá a szezámolajat.",
      "Keverd ki a szószt ({szosz}) 1 ek vízzel és egy csipet chilipehellyel, csorgasd a tetejére.",
      "Szórd meg: {ropi}, {friss}."
    ]
  },
  {
    id: "koreai-tal",
    name: "Koreai darált húsos tál kimchivel",
    cuisine: "azsiai",
    meals: [
      "foetel"
    ],
    method: "Serpenyő",
    time: 25,
    slots: [
      {
        key: "feh",
        label: "Darált hús",
        pick: [
          1,
          1
        ],
        options: [
          "marha10",
          "marha15",
          "marha20",
          "sertes20"
        ]
      },
      {
        key: "alap",
        label: "Alap",
        pick: [
          1,
          1
        ],
        options: [
          "karfiol",
          "kinaikel",
          "kaposzta"
        ]
      },
      {
        key: "koret",
        label: "Köret (namul)",
        pick: [
          1,
          2
        ],
        options: [
          "uborka",
          "spenot",
          "mungbabcsira",
          "retek",
          "gomba",
          "brokkoli"
        ]
      },
      {
        key: "szosz",
        label: "Szósz",
        pick: [
          1,
          1
        ],
        options: [
          "majonez"
        ]
      },
      {
        key: "extra",
        label: "Feltét",
        pick: [
          1,
          2
        ],
        options: [
          "szezammag",
          "ujhagyma",
          "sriracha",
          "chili"
        ]
      }
    ],
    fixed: [
      {
        id: "fokhagyma"
      },
      {
        id: "gyomber"
      },
      {
        id: "szojaszosz"
      },
      {
        id: "kimchi"
      },
      {
        id: "szezamolaj"
      },
      {
        id: "tojas"
      }
    ],
    ranges: {
      fokhagyma: [
        4,
        8,
        12
      ],
      gyomber: [
        3,
        5,
        8
      ],
      szojaszosz: [
        8,
        15,
        20
      ],
      kimchi: [
        40,
        60,
        100
      ],
      szezamolaj: [
        3,
        8,
        12
      ],
      tojas: [
        50,
        50,
        100
      ],
      majonez: [
        0,
        15,
        30
      ],
      sriracha: [
        3,
        5,
        8
      ],
      chili: [
        3,
        5,
        8
      ],
      karfiol: [
        100,
        150,
        250
      ],
      kinaikel: [
        80,
        150,
        250
      ],
      kaposzta: [
        80,
        120,
        200
      ],
      uborka: [
        50,
        80,
        120
      ],
      spenot: [
        50,
        80,
        150
      ],
      mungbabcsira: [
        40,
        60,
        100
      ],
      retek: [
        30,
        50,
        80
      ],
      gomba: [
        50,
        80,
        150
      ]
    },
    spices: "gochugaru vagy chilipehely, 1 tk rizsecet vagy almaecet, só",
    steps: [
      "Aprítsd az alapot ({alap}): a karfiolt reszeld rizsszerűre, a káposztát vágd vékony csíkokra.",
      "Készítsd el a köretet ({koret}): az uborkát és a retket szeleteld vékonyra, sózd és ecetezd meg; a spenótot és a csírát 1 percig blansírozd, majd nyomkodd ki; a gombát szeleteld fel és 3-4 perc alatt pirítsd meg.",
      "Forró serpenyőben, a szezámolaj felén morzsold szét a darált húst ({feh}), és 6-8 perc alatt pirítsd ropogósra.",
      "Add hozzá a fokhagymát, a gyömbért és a szójaszószt, pirítsd 1 percig, majd szedd ki.",
      "Ugyanabban a serpenyőben 3-4 perc alatt pirítsd meg az alapot, utána a maradék olajon süss tükörtojást.",
      "Keverd el a majonézt ({szosz}) egy csipet gochugaruval vagy chilipehellyel.",
      "Tálban rendezd el: alap, hús, köret, kimchi, a tetejére a tükörtojás, majd szórd meg ({extra})."
    ]
  },
  {
    id: "thai-curry",
    name: "Thai kókuszos curry",
    cuisine: "azsiai",
    meals: [
      "foetel"
    ],
    method: "Serpenyő",
    time: 25,
    slots: [
      {
        key: "feh",
        label: "Fehérje",
        pick: [
          1,
          1
        ],
        options: [
          "csirkecomb",
          "csirkemell"
        ]
      },
      {
        key: "zold",
        label: "Zöldség",
        pick: [
          2,
          3
        ],
        options: [
          "brokkoli",
          "karfiol",
          "paprika",
          "cukkini",
          "zoldbab",
          "padlizsan",
          "gomba",
          "spenot",
          "pakchoi"
        ]
      },
      {
        key: "extra",
        label: "Feltét",
        pick: [
          1,
          2
        ],
        options: [
          "foldimogyoro",
          "ujhagyma",
          "citromle"
        ]
      }
    ],
    fixed: [
      {
        id: "kokusztej"
      },
      {
        id: "fokhagyma"
      },
      {
        id: "gyomber"
      },
      {
        id: "chili"
      },
      {
        id: "napraforgoolaj"
      }
    ],
    ranges: {
      kokusztej: [
        80,
        140,
        200
      ],
      napraforgoolaj: [
        0,
        5,
        15
      ],
      fokhagyma: [
        4,
        6,
        10
      ],
      gyomber: [
        3,
        5,
        8
      ],
      chili: [
        2,
        5,
        8
      ],
      foldimogyoro: [
        10,
        15,
        25
      ],
      ujhagyma: [
        10,
        15,
        20
      ],
      citromle: [
        5,
        8,
        12
      ],
      brokkoli: [
        50,
        100,
        150
      ],
      karfiol: [
        50,
        100,
        150
      ],
      paprika: [
        40,
        60,
        100
      ],
      cukkini: [
        60,
        100,
        150
      ],
      zoldbab: [
        50,
        80,
        120
      ],
      padlizsan: [
        60,
        100,
        150
      ],
      gomba: [
        60,
        100,
        150
      ],
      spenot: [
        40,
        80,
        150
      ],
      pakchoi: [
        60,
        100,
        150
      ]
    },
    spices: "fél tk vörös curry paszta (vagy kurkuma és őrölt koriander), 1 tk halszósz, friss koriander vagy thai bazsalikom, só",
    steps: [
      "Vágd falatnyira a fehérjét ({feh}) és a zöldséget ({zold}), aprítsd fel a fokhagymát, a gyömbért és a chilit.",
      "Az olajon közepes lángon 1 percig pirítsd a fokhagymát, a gyömbért, a chilit és a curry pasztát.",
      "Add hozzá a fehérjét, és pirítsd körbe 3-4 percig (a garnélát csak 1 percig, utána szedd ki, és az utolsó 2 percben tedd vissza).",
      "Öntsd fel a kókusztejjel és 2-3 ek vízzel, tedd bele a keményebb zöldséget, és gyöngyöző forrás mellett főzd 8-10 percig. A spenótot és a pak choit csak az utolsó 2 percben add hozzá.",
      "Ízesítsd halszósszal és sóval, tálaláskor add hozzá: {extra}."
    ]
  },
  {
    id: "azsiai-salata",
    name: "Ropogós ázsiai saláta szezámos öntettel",
    cuisine: "azsiai",
    meals: [
      "foetel"
    ],
    method: "Hideg / serpenyő",
    time: 20,
    slots: [
      {
        key: "feh",
        label: "Fehérje",
        pick: [
          1,
          1
        ],
        options: [
          "csirkecomb",
          "csirkemell",
          "tarja",
          "steak"
        ]
      },
      {
        key: "level",
        label: "Saláta",
        pick: [
          1,
          1
        ],
        options: [
          "romai",
          "jegsalata"
        ]
      },
      {
        key: "zold",
        label: "Ropogós zöldség",
        pick: [
          2,
          3
        ],
        options: [
          "uborka",
          "retek",
          "paprika",
          "lilakaposzta",
          "kaposzta",
          "kinaikel",
          "karalabe",
          "mungbabcsira"
        ]
      },
      {
        key: "mag",
        label: "Ropogós feltét",
        pick: [
          1,
          1
        ],
        options: [
          "foldimogyoro",
          "szezammag"
        ]
      },
      {
        key: "extra",
        label: "Feltét",
        pick: [
          0,
          1
        ],
        options: [
          "avokado",
          "ujhagyma",
          "chili"
        ]
      }
    ],
    fixed: [
      {
        id: "tahini"
      },
      {
        id: "majonez"
      },
      {
        id: "szezamolaj"
      },
      {
        id: "szojaszosz"
      },
      {
        id: "citromle"
      },
      {
        id: "fokhagyma"
      },
      {
        id: "gyomber"
      }
    ],
    ranges: {
      tahini: [
        10,
        20,
        30
      ],
      majonez: [
        5,
        10,
        20
      ],
      szezamolaj: [
        3,
        8,
        15
      ],
      szojaszosz: [
        5,
        12,
        20
      ],
      citromle: [
        5,
        10,
        15
      ],
      fokhagyma: [
        2,
        4,
        6
      ],
      gyomber: [
        1,
        3,
        6
      ],
      romai: [
        50,
        80,
        120
      ],
      jegsalata: [
        50,
        100,
        150
      ],
      uborka: [
        50,
        80,
        120
      ],
      retek: [
        30,
        60,
        100
      ],
      paprika: [
        40,
        60,
        100
      ],
      lilakaposzta: [
        40,
        60,
        100
      ],
      kaposzta: [
        40,
        70,
        120
      ],
      kinaikel: [
        50,
        80,
        150
      ],
      karalabe: [
        40,
        60,
        100
      ],
      mungbabcsira: [
        30,
        50,
        80
      ],
      foldimogyoro: [
        10,
        20,
        30
      ],
      szezammag: [
        5,
        10,
        15
      ],
      avokado: [
        40,
        80,
        120
      ],
      ujhagyma: [
        10,
        15,
        25
      ],
      chili: [
        2,
        5,
        8
      ]
    },
    spices: "chilipehely, friss koriander",
    steps: [
      "Forró serpenyőben, a szezámolaj felén süsd meg a fehérjét ({feh}): csirke 5-6 perc, tarja 4 perc, steak 2-3 perc, garnéla 1-2 perc oldalanként. Pihentesd 3 percig, majd szeleteld fel.",
      "Tépd fel a salátát ({level}), a többi zöldséget ({zold}) vágd vékony csíkokra.",
      "Keverd ki az öntetet: tahini, majonéz, szójaszósz, citromlé, reszelt fokhagyma és gyömbér, a maradék szezámolaj, és 2-3 ek víz, hogy krémes legyen.",
      "Forgasd össze a zöldséget az öntet felével, tedd rá a húst, és locsold meg a maradék öntettel.",
      "Szórd a tetejére: {mag}.",
      "Tedd rá: {extra}."
    ]
  },
  {
    id: "medi-salata",
    name: "Mediterrán főétel-saláta",
    cuisine: "mediterran",
    meals: [
      "foetel"
    ],
    method: "Hideg / serpenyő",
    time: 20,
    slots: [
      {
        key: "feh",
        label: "Fehérje",
        pick: [
          1,
          1
        ],
        options: [
          "csirkecomb",
          "csirkemell",
          "tarja",
          "tojas",
          "szardinia"
        ]
      },
      {
        key: "sajt",
        label: "Sajt",
        pick: [
          1,
          1
        ],
        options: [
          "feta",
          "mozzarella",
          "kecskesajt"
        ]
      },
      {
        key: "level",
        label: "Saláta",
        pick: [
          1,
          1
        ],
        options: [
          "romai",
          "jegsalata",
          "fejessalata",
          "rukkola",
          "spenot"
        ]
      },
      {
        key: "zold",
        label: "Zöldség",
        pick: [
          2,
          2
        ],
        options: [
          "paradicsom",
          "koktelparadicsom",
          "uborka",
          "paprika",
          "retek",
          "edeskomeny",
          "szarzeller"
        ]
      },
      {
        key: "zsir",
        label: "Olaj",
        pick: [
          1,
          1
        ],
        options: [
          "olivaolaj"
        ]
      },
      {
        key: "sav",
        label: "Sav",
        pick: [
          1,
          1
        ],
        options: [
          "ecet",
          "citromle"
        ]
      },
      {
        key: "extra",
        label: "Extra",
        pick: [
          1,
          2
        ],
        options: [
          "zoldoliva",
          "feketeoliva",
          "avokado",
          "lilahagyma",
          "kapribogyo"
        ]
      },
      {
        key: "mag",
        label: "Ropogós",
        pick: [
          0,
          1
        ],
        options: [
          "dio",
          "tokmag"
        ]
      }
    ],
    fixed: [],
    ranges: {
      olivaolaj: [
        8,
        18,
        25
      ],
      ecet: [
        3,
        5,
        7
      ],
      citromle: [
        3,
        5,
        8
      ],
      tojas: [
        100,
        150,
        200
      ],
      romai: [
        50,
        80,
        150
      ],
      jegsalata: [
        50,
        90,
        150
      ],
      fejessalata: [
        40,
        70,
        120
      ],
      rukkola: [
        30,
        50,
        80
      ],
      spenot: [
        30,
        50,
        90
      ],
      paradicsom: [
        60,
        120,
        200
      ],
      koktelparadicsom: [
        60,
        120,
        180
      ],
      uborka: [
        50,
        100,
        180
      ],
      paprika: [
        40,
        80,
        150
      ],
      retek: [
        20,
        50,
        100
      ],
      edeskomeny: [
        30,
        60,
        120
      ],
      szarzeller: [
        30,
        50,
        100
      ],
      avokado: [
        40,
        60,
        100
      ],
      lilahagyma: [
        10,
        20,
        35
      ],
      kapribogyo: [
        5,
        8,
        15
      ],
      dio: [
        5,
        12,
        20
      ],
      tokmag: [
        5,
        10,
        20
      ]
    },
    spices: "só, bors, oregánó",
    steps: [
      "Készítsd el a fehérjét ({feh}): a csirkét sózd, borsozd, pár csepp olajon süsd meg (comb oldalanként 5-6, mell 4-5 perc), pihentesd, szeleteld. A garnélát 2-3 perc alatt süsd rózsaszínre, a tojást főzd 9 percig, a halat csak csepegtesd le és tépd fel.",
      "Tépd falatnyira a salátát ({level}), vágd fel a zöldséget ({zold}).",
      "Keverd ki az öntetet 4:1 arányban: olívaolaj és {sav}, só, bors, oregánó.",
      "Forgasd össze a salátát és a zöldséget az öntet kétharmadával, tedd rá a fehérjét, tépd vagy morzsold rá a sajtot ({sajt}), add hozzá az extrát ({extra}).",
      "Száraz serpenyőben 2-3 perc alatt pirítsd meg a magot ({mag}), szórd a tetejére.",
      "Locsold meg a maradék öntettel."
    ]
  },
  {
    id: "sutos-csirke",
    name: "Tepsis csirke sült mediterrán zöldségekkel",
    cuisine: "mediterran",
    meals: [
      "foetel"
    ],
    method: "Sütő",
    time: 40,
    slots: [
      {
        key: "feh",
        label: "Hús",
        pick: [
          1,
          1
        ],
        options: [
          "csirkecomb",
          "csirkemell"
        ]
      },
      {
        key: "zold",
        label: "Zöldség",
        pick: [
          2,
          2
        ],
        options: [
          "cukkini",
          "padlizsan",
          "paprika",
          "brokkoli",
          "karfiol",
          "kelbimbo",
          "koktelparadicsom",
          "gomba",
          "edeskomeny"
        ]
      },
      {
        key: "hagyma",
        label: "Hagyma",
        pick: [
          0,
          1
        ],
        options: [
          "lilahagyma"
        ]
      },
      {
        key: "zsir",
        label: "Olaj",
        pick: [
          1,
          1
        ],
        options: [
          "olivaolaj"
        ]
      },
      {
        key: "sajt",
        label: "Sajt",
        pick: [
          1,
          1
        ],
        options: [
          "feta",
          "halloumi",
          "mozzarella",
          "kecskesajt"
        ]
      },
      {
        key: "extra",
        label: "Tálaláskor",
        pick: [
          0,
          1
        ],
        options: [
          "zoldoliva",
          "feketeoliva",
          "pesto"
        ]
      }
    ],
    fixed: [
      {
        id: "fokhagyma"
      }
    ],
    ranges: {
      csirkecomb: [
        140,
        180,
        240
      ],
      csirkemell: [
        140,
        170,
        220
      ],
      olivaolaj: [
        10,
        20,
        28
      ],
      fokhagyma: [
        5,
        10,
        15
      ],
      lilahagyma: [
        15,
        30,
        50
      ],
      cukkini: [
        80,
        150,
        220
      ],
      padlizsan: [
        80,
        150,
        220
      ],
      paprika: [
        50,
        90,
        150
      ],
      brokkoli: [
        80,
        130,
        200
      ],
      karfiol: [
        80,
        150,
        220
      ],
      kelbimbo: [
        60,
        100,
        150
      ],
      koktelparadicsom: [
        60,
        100,
        150
      ],
      gomba: [
        80,
        150,
        220
      ],
      edeskomeny: [
        60,
        100,
        150
      ],
      feta: [
        40,
        60,
        90
      ],
      halloumi: [
        40,
        60,
        90
      ],
      mozzarella: [
        40,
        70,
        110
      ],
      kecskesajt: [
        30,
        50,
        80
      ],
      pesto: [
        10,
        15,
        25
      ]
    },
    spices: "só, bors, rozmaring, kakukkfű, oregánó, füstölt paprika, chilipehely",
    steps: [
      "Melegítsd elő a sütőt 220 °C-ra (légkeveréssel 200 °C).",
      "Vágd 3-4 cm-es darabokra a húst ({feh}) és a zöldséget ({zold}), forgasd össze az olajjal, a megtört fokhagymagerezdekkel, sóval és a fűszerekkel.",
      "Vágd cikkekre a hagymát ({hagyma}), forgasd a többi közé.",
      "Terítsd egy rétegben, zsúfolás nélkül egy sütőpapíros tepsibe, és süsd 25 percig, félidőben forgasd meg.",
      "Tedd rá a sajtot ({sajt}) morzsolva, szeletelve vagy reszelve, és süsd még 6-8 percig, amíg megpirul.",
      "Tálaláskor tedd rá: {extra}."
    ]
  },
  {
    id: "gambas",
    name: "Fokhagymás-chilis serpenyős csirke vagy tarja",
    cuisine: "mediterran",
    meals: [
      "foetel"
    ],
    method: "Serpenyő",
    time: 25,
    slots: [
      {
        key: "feh",
        label: "Fehérje",
        pick: [
          1,
          1
        ],
        options: [
          "csirkecomb",
          "tarja"
        ]
      },
      {
        key: "zold",
        label: "Köret",
        pick: [
          1,
          2
        ],
        options: [
          "cukkini",
          "spenot",
          "koktelparadicsom",
          "brokkoli",
          "gomba",
          "sparga",
          "paprika"
        ]
      },
      {
        key: "friss",
        label: "Friss zöld",
        pick: [
          0,
          1
        ],
        options: [
          "rukkola"
        ]
      },
      {
        key: "zsir",
        label: "Zsiradék",
        pick: [
          2,
          2
        ],
        options: [
          "olivaolaj",
          "vaj"
        ]
      },
      {
        key: "extra",
        label: "Extra",
        pick: [
          1,
          2
        ],
        options: [
          "avokado",
          "parmezan",
          "feta"
        ]
      }
    ],
    fixed: [
      {
        id: "fokhagyma"
      },
      {
        id: "chili"
      },
      {
        id: "citromle"
      }
    ],
    ranges: {
      fokhagyma: [
        6,
        10,
        15
      ],
      chili: [
        3,
        6,
        10
      ],
      citromle: [
        5,
        10,
        15
      ],
      olivaolaj: [
        0,
        12,
        25
      ],
      vaj: [
        0,
        10,
        20
      ],
      cukkini: [
        80,
        150,
        220
      ],
      spenot: [
        80,
        150,
        250
      ],
      koktelparadicsom: [
        60,
        100,
        150
      ],
      brokkoli: [
        80,
        130,
        200
      ],
      gomba: [
        80,
        150,
        220
      ],
      sparga: [
        80,
        130,
        200
      ],
      paprika: [
        50,
        80,
        130
      ],
      rukkola: [
        20,
        40,
        60
      ],
      avokado: [
        40,
        70,
        110
      ],
      parmezan: [
        10,
        20,
        30
      ],
      feta: [
        30,
        50,
        70
      ],
      csirkecomb: [
        150,
        190,
        240
      ],
      tarja: [
        140,
        170,
        220
      ]
    },
    spices: "só, petrezselyem, citromhéj",
    steps: [
      "Vágd a húst ({feh}) 2 cm-es falatokra, sózd. Szeleteld vékonyra a fokhagymát és a chilit, vágd falatnyira a köretet ({zold}).",
      "A zsiradék ({zsir}) harmadán, erős lángon pirítsd a köretet 4-6 percig (brokkolit és spárgát fedő alatt, 2 evőkanál vízzel), sózd, tedd tányérra.",
      "Ugyanott, erős lángon süsd a húst 6-8 percig, amíg minden oldala megbarnul és átsül (csirkecombot teljesen át).",
      "Vedd lejjebb a lángot, add hozzá a maradék zsiradékot, a fokhagymát és a chilit, 1-2 percig forgasd, hogy ne égjen meg. Locsold meg citromlével.",
      "Tedd a húst a köret mellé, egy marék friss zöldre ({friss}).",
      "Öntsd rá a fokhagymás-chilis zsiradékot, és tálald ezzel: {extra}."
    ]
  },
  {
    id: "shakshuka",
    name: "Shakshuka sajttal",
    cuisine: "mediterran",
    meals: [
      "reggeli",
      "foetel"
    ],
    method: "Serpenyő",
    time: 25,
    veg: true,
    slots: [
      {
        key: "feh",
        label: "Tojás",
        pick: [
          1,
          1
        ],
        options: [
          "tojas"
        ]
      },
      {
        key: "zold",
        label: "Zöldség",
        pick: [
          1,
          2
        ],
        options: [
          "paprika",
          "spenot",
          "cukkini",
          "padlizsan",
          "gomba"
        ]
      },
      {
        key: "sajt",
        label: "Sajt",
        pick: [
          1,
          1
        ],
        options: [
          "feta",
          "kecskesajt",
          "mozzarella"
        ]
      },
      {
        key: "zsir",
        label: "Olaj",
        pick: [
          1,
          1
        ],
        options: [
          "olivaolaj"
        ]
      },
      {
        key: "extra",
        label: "Extra",
        pick: [
          0,
          1
        ],
        options: [
          "avokado",
          "zoldoliva",
          "chili"
        ]
      }
    ],
    fixed: [
      {
        id: "paradicsom"
      },
      {
        id: "passata"
      },
      {
        id: "voroshagyma"
      },
      {
        id: "fokhagyma"
      }
    ],
    ranges: {
      tojas: [
        150,
        200,
        250
      ],
      paradicsom: [
        80,
        120,
        180
      ],
      passata: [
        20,
        40,
        60
      ],
      voroshagyma: [
        10,
        15,
        30
      ],
      fokhagyma: [
        4,
        6,
        10
      ],
      olivaolaj: [
        5,
        12,
        25
      ],
      paprika: [
        30,
        50,
        90
      ],
      spenot: [
        40,
        80,
        150
      ],
      cukkini: [
        40,
        70,
        120
      ],
      padlizsan: [
        40,
        60,
        100
      ],
      gomba: [
        40,
        80,
        150
      ],
      feta: [
        30,
        50,
        80
      ],
      kecskesajt: [
        30,
        45,
        70
      ],
      mozzarella: [
        40,
        60,
        90
      ],
      avokado: [
        30,
        50,
        80
      ],
      zoldoliva: [
        15,
        25,
        40
      ],
      chili: [
        2,
        4,
        8
      ]
    },
    spices: "római kömény, füstölt paprika, chilipehely, só, petrezselyem vagy koriander",
    steps: [
      "Aprítsd fel a hagymát és a fokhagymát, kockázd fel a paradicsomot, vágd 1 cm-es darabokra a zöldséget ({zold}).",
      "Egy 20-24 cm-es serpenyőben, az olajon 3-4 perc alatt pirítsd üvegesre a hagymát, add hozzá a fokhagymát és a fűszereket, fél percig pirítsd.",
      "Tedd bele a zöldséget ({zold}), és pirítsd 5-6 percig (a padlizsánt 8 percig, a spenótot csak 1 percig fonnyaszd).",
      "Add hozzá a paradicsomot és a passatát, közepes lángon 5 percig rotyogtasd sűrűre, sózd.",
      "Nyomj 3-4 mélyedést a szószba, üsd bele a tojásokat ({feh}), és fedő alatt, alacsony lángon 5-7 percig főzd, amíg a fehérje megszilárdul, a sárgája folyós marad.",
      "Morzsold vagy tépd rá a sajtot ({sajt}), szórd meg petrezselyemmel.",
      "Tálald ezzel: {extra}."
    ]
  },
  {
    id: "smash-tal",
    name: "Smash burger tál",
    cuisine: "burger",
    meals: [
      "foetel"
    ],
    method: "Serpenyő",
    time: 20,
    slots: [
      {
        key: "feh",
        label: "Darált hús",
        pick: [
          1,
          1
        ],
        options: [
          "marha15",
          "marha20",
          "sertes20"
        ]
      },
      {
        key: "sajt",
        label: "Sajt",
        pick: [
          1,
          1
        ],
        options: [
          "cheddar",
          "gouda"
        ]
      },
      {
        key: "salata",
        label: "Saláta",
        pick: [
          1,
          1
        ],
        options: [
          "jegsalata",
          "romai"
        ]
      },
      {
        key: "paradicsom",
        label: "Paradicsom",
        pick: [
          1,
          1
        ],
        options: [
          "paradicsom",
          "koktelparadicsom"
        ]
      },
      {
        key: "zold",
        label: "Zöldség",
        pick: [
          0,
          1
        ],
        options: [
          "uborka",
          "retek"
        ]
      },
      {
        key: "hagyma",
        label: "Hagyma",
        pick: [
          0,
          1
        ],
        options: [
          "lilahagyma",
          "ujhagyma"
        ]
      },
      {
        key: "extra",
        label: "Feltét",
        pick: [
          0,
          1
        ],
        options: [
          "bacon",
          "tojas"
        ]
      }
    ],
    fixed: [
      {
        id: "majonez"
      },
      {
        id: "ketchup0"
      },
      {
        id: "mustar"
      },
      {
        id: "savanyuuborka"
      }
    ],
    ranges: {
      majonez: [
        5,
        15,
        30
      ],
      ketchup0: [
        5,
        10,
        20
      ],
      mustar: [
        5,
        10,
        20
      ],
      savanyuuborka: [
        30,
        60,
        80
      ],
      jegsalata: [
        60,
        100,
        150
      ],
      romai: [
        60,
        100,
        150
      ],
      retek: [
        30,
        60,
        100
      ],
      lilahagyma: [
        10,
        20,
        30
      ],
      ujhagyma: [
        10,
        20,
        30
      ],
      tojas: [
        50,
        50,
        50
      ],
      bacon: [
        10,
        20,
        30
      ]
    },
    spices: "só, bors, füstölt paprika",
    steps: [
      "Tépd falatnyira a salátát ({salata}), szeleteld fel a paradicsomot ({paradicsom}), és rakd tálba.",
      "Szeleteld vékonyra, és tedd hozzá: {zold}.",
      "Vágd vékony karikára a hagymát ({hagyma}).",
      "Keverd ki a szószt: majonéz, ketchup, mustár, a savanyú uborka felének apróra vágva, csipet füstölt paprika.",
      "Száraz serpenyőben készítsd el a feltétet ({extra}): a bacont 4-5 perc alatt ropogósra, a tojást tükörtojásnak.",
      "Formázz a húsból ({feh}) 2 lazán gyúrt golyót. Öntöttvas serpenyőt hevíts füstölésig, tedd bele a golyókat, és spatulával nyomd őket 1 cm vékonyra. Sózd, borsozd.",
      "2 perc után, amikor az alja sötétbarna, kapard fel és fordítsd meg, tedd rá a sajtot ({sajt}), és még 1 percig süsd (sertéshúsnál 2 percig, átsütve).",
      "Tedd a burgereket a salátára, locsold meg a szósszal, szórd rá a maradék savanyú uborkát."
    ]
  },
  {
    id: "coleslaw-burger",
    name: "Mustáros burgerpogácsa coleslaw-val",
    cuisine: "burger",
    meals: [
      "foetel"
    ],
    method: "Serpenyő / grill",
    time: 25,
    slots: [
      {
        key: "feh",
        label: "Darált hús",
        pick: [
          1,
          1
        ],
        options: [
          "marha10",
          "marha15",
          "sertes20"
        ]
      },
      {
        key: "zold",
        label: "Káposzta",
        pick: [
          1,
          1
        ],
        options: [
          "kaposzta",
          "lilakaposzta"
        ]
      },
      {
        key: "ropi",
        label: "Coleslaw plusz",
        pick: [
          0,
          1
        ],
        options: [
          "karalabe",
          "sargarepa"
        ]
      },
      {
        key: "hagyma",
        label: "Hagyma",
        pick: [
          0,
          1
        ],
        options: [
          "lilahagyma",
          "ujhagyma"
        ]
      },
      {
        key: "sajt",
        label: "Sajt",
        pick: [
          0,
          1
        ],
        options: [
          "cheddar",
          "gouda",
          "gorgonzola"
        ]
      },
      {
        key: "bacon",
        label: "Bacon",
        pick: [
          0,
          1
        ],
        options: [
          "bacon"
        ]
      },
      {
        key: "savanyu",
        label: "Savanyúság",
        pick: [
          0,
          1
        ],
        options: [
          "savanyuuborka"
        ]
      }
    ],
    fixed: [
      {
        id: "majonez"
      },
      {
        id: "tejfol"
      },
      {
        id: "mustar"
      },
      {
        id: "ecet"
      }
    ],
    ranges: {
      majonez: [
        5,
        15,
        30
      ],
      tejfol: [
        10,
        30,
        60
      ],
      ecet: [
        3,
        6,
        10
      ],
      mustar: [
        5,
        15,
        20
      ],
      savanyuuborka: [
        30,
        60,
        80
      ],
      kaposzta: [
        80,
        150,
        250
      ],
      lilakaposzta: [
        80,
        120,
        200
      ],
      karalabe: [
        50,
        80,
        150
      ],
      sargarepa: [
        10,
        20,
        30
      ],
      lilahagyma: [
        10,
        15,
        25
      ],
      ujhagyma: [
        10,
        15,
        25
      ],
      bacon: [
        10,
        20,
        30
      ]
    },
    spices: "só, bors, fokhagymapor, csipet édesítő a dresszingbe",
    steps: [
      "Gyaluld vékony csíkokra a káposztát ({zold}), sózd meg, gyúrd át, és 10 percig hagyd állni, majd nyomkodd ki a levét.",
      "Reszeld durvára, és keverd hozzá: {ropi}.",
      "Vágd vékonyra, és keverd hozzá: {hagyma}.",
      "Keverd ki a dresszinget: majonéz, tejföl, a mustár fele, ecet, bors, csipet édesítő. Forgasd össze a zöldséggel, és tálalásig tedd hűtőbe.",
      "Száraz serpenyőben süsd ropogósra a bacont ({bacon}) 4-5 perc alatt, vedd ki, a zsírját hagyd a serpenyőben.",
      "Formázz a húsból ({feh}) 2 db 1,5 cm vastag pogácsát, a közepüket nyomd kissé be, sózd, borsozd. Forró serpenyőben süsd oldalanként 3-4 percig (sertéshúsnál 4-5 percig, átsütve), az utolsó percben kend meg a tetejüket a maradék mustárral.",
      "Tedd a pogácsákra a sajtot ({sajt}), fedd le 1 percre, hogy megolvadjon.",
      "Tálald a coleslaw-val és a savanyú uborkával ({savanyu})."
    ]
  },
  {
    id: "steak",
    name: "Serpenyős hús vajas-fokhagymás zöldséggel",
    cuisine: "burger",
    meals: [
      "foetel"
    ],
    method: "Serpenyő",
    time: 25,
    slots: [
      {
        key: "feh",
        label: "Hús",
        pick: [
          1,
          1
        ],
        options: [
          "steak",
          "tarja",
          "csirkecomb"
        ]
      },
      {
        key: "zold",
        label: "Zöldség",
        pick: [
          2,
          2
        ],
        options: [
          "brokkoli",
          "kelbimbo",
          "zoldbab",
          "gomba",
          "spenot",
          "karfiol",
          "cukkini"
        ]
      },
      {
        key: "feltet",
        label: "Sajt",
        pick: [
          0,
          1
        ],
        options: [
          "parmezan",
          "gorgonzola"
        ]
      },
      {
        key: "bacon",
        label: "Bacon",
        pick: [
          0,
          1
        ],
        options: [
          "bacon"
        ]
      },
      {
        key: "martas",
        label: "Mártás",
        pick: [
          0,
          1
        ],
        options: [
          "tejszin"
        ]
      }
    ],
    fixed: [
      {
        id: "olivaolaj"
      },
      {
        id: "vaj"
      },
      {
        id: "fokhagyma"
      }
    ],
    ranges: {
      spenot: [
        50,
        120,
        200
      ],
      olivaolaj: [
        3,
        6,
        12
      ],
      vaj: [
        8,
        18,
        28
      ],
      fokhagyma: [
        4,
        8,
        12
      ],
      tejszin: [
        20,
        40,
        60
      ],
      parmezan: [
        10,
        15,
        25
      ],
      gorgonzola: [
        15,
        25,
        40
      ],
      bacon: [
        15,
        25,
        40
      ]
    },
    spices: "só, durvára tört bors, kakukkfű vagy rozmaring",
    steps: [
      "A húst ({feh}) 20 perccel előtte vedd ki a hűtőből, itasd szárazra, sózd.",
      "Vágd falatnyira a zöldséget ({zold}). A brokkolit, karfiolt, kelbimbót, zöldbabot 4 percig főzd elő sós vízben, és csepegtesd le.",
      "Süsd ropogósra a bacont ({bacon}) száraz serpenyőben 4-5 perc alatt, vedd ki, a zsírját hagyd a serpenyőben.",
      "Az olajat hevítsd füstölésig. A steaket 2,5 cm vastagon oldalanként 2-3 percig süsd (közepesen átsütött), a tarját 1,5 cm vastagon oldalanként 4-5 percig, a csirkecombot oldalanként 5-6 percig, átsütve.",
      "Az utolsó percben add hozzá a vaj felét, a zúzott fokhagyma felét és a kakukkfüvet, kanállal locsold a húsra. Pihentesd 5 percig.",
      "Ugyanabban a serpenyőben, a maradék vajon és fokhagymán 4-5 perc alatt pirítsd meg a zöldséget.",
      "A kiürült serpenyőt öntsd fel a tejszínnel ({martas}), szórd bele a durvára tört borsot, és 2 perc alatt forrald sűrűre.",
      "Szeleteld fel a húst, és tedd mellé a zöldséget.",
      "Szórd a húsra és a zöldségre a sajtot ({feltet}).",
      "Morzsold rá a bacont ({bacon})."
    ]
  },
  {
    id: "tarja-kaposzta",
    name: "Grillezett tarja párolt káposztával",
    cuisine: "magyaros",
    meals: [
      "foetel"
    ],
    method: "Serpenyő",
    time: 35,
    slots: [
      {
        key: "feh",
        label: "Hús",
        pick: [
          1,
          1
        ],
        options: [
          "tarja"
        ]
      },
      {
        key: "zold",
        label: "Káposzta",
        pick: [
          1,
          1
        ],
        options: [
          "savanyukaposzta",
          "kaposzta",
          "kelkaposzta"
        ]
      },
      {
        key: "zsir",
        label: "Zsiradék",
        pick: [
          1,
          1
        ],
        options: [
          "disznozsir",
          "vaj"
        ]
      },
      {
        key: "bacon",
        label: "Bacon",
        pick: [
          0,
          1
        ],
        options: [
          "bacon"
        ]
      },
      {
        key: "friss",
        label: "Friss mellé",
        pick: [
          0,
          1
        ],
        options: [
          "retek",
          "ujhagyma"
        ]
      }
    ],
    fixed: [
      {
        id: "voroshagyma"
      },
      {
        id: "tejfol"
      },
      {
        id: "mustar"
      },
      {
        id: "fuszerpaprika"
      }
    ],
    ranges: {
      voroshagyma: [
        15,
        30,
        50
      ],
      tejfol: [
        20,
        50,
        80
      ],
      mustar: [
        5,
        10,
        20
      ],
      fuszerpaprika: [
        1,
        2,
        4
      ],
      disznozsir: [
        5,
        10,
        20
      ],
      vaj: [
        5,
        10,
        20
      ],
      bacon: [
        15,
        25,
        40
      ],
      savanyukaposzta: [
        120,
        200,
        300
      ],
      kaposzta: [
        100,
        200,
        300
      ],
      kelkaposzta: [
        100,
        200,
        300
      ],
      retek: [
        30,
        60,
        100
      ]
    },
    spices: "só, bors, egész kömény, babérlevél",
    steps: [
      "A tarját ({feh}) vágd 1,5 cm vastag szeletekre, klopfold ki enyhén, sózd, borsozd, szórd meg a fűszerpaprika felével.",
      "Ha van bacon ({bacon}), vágd csíkokra, és a lábasban pirítsd ki 3-4 perc alatt.",
      "A zsiradékon ({zsir}) 5 perc alatt pirítsd üvegesre a felaprított hagymát.",
      "Add hozzá a káposztát ({zold}), a köményt, a babérlevelet és 0,5 dl vizet, és fedő alatt, lassú tűzön párold 20-25 percig. A savanyú káposztát előtte kóstold meg, ha túl savanyú, öblítsd át.",
      "Közben grillserpenyőben, nagy lángon süsd a tarját oldalanként 4-5 percig, majd pihentesd 3 percig.",
      "Keverd a maradék fűszerpaprikát a tejfölbe.",
      "Tálald a tarját a káposztával, a tetejére tejföl, a hús mellé mustár és friss zöldség ({friss})."
    ]
  },
  {
    id: "rakott-karfiol",
    name: "Rakott karfiol",
    cuisine: "magyaros",
    meals: [
      "foetel"
    ],
    method: "Sütő",
    time: 50,
    slots: [
      {
        key: "feh",
        label: "Darált hús",
        pick: [
          1,
          1
        ],
        options: [
          "marha10",
          "marha15",
          "marha20",
          "sertes20"
        ]
      },
      {
        key: "sajt",
        label: "Sajt",
        pick: [
          1,
          1
        ],
        options: [
          "gouda",
          "cheddar",
          "mozzarella"
        ]
      },
      {
        key: "zold",
        label: "Plusz zöldség",
        pick: [
          0,
          1
        ],
        options: [
          "brokkoli",
          "gomba",
          "zoldpaprika"
        ]
      },
      {
        key: "bacon",
        label: "Bacon",
        pick: [
          0,
          1
        ],
        options: [
          "bacon"
        ]
      }
    ],
    fixed: [
      {
        id: "karfiol"
      },
      {
        id: "tejfol"
      },
      {
        id: "tojas"
      },
      {
        id: "voroshagyma"
      },
      {
        id: "fokhagyma"
      },
      {
        id: "fuszerpaprika"
      }
    ],
    ranges: {
      karfiol: [
        120,
        200,
        300
      ],
      tejfol: [
        30,
        60,
        100
      ],
      tojas: [
        50,
        50,
        50
      ],
      voroshagyma: [
        10,
        20,
        30
      ],
      fokhagyma: [
        3,
        5,
        8
      ],
      fuszerpaprika: [
        1,
        2,
        3
      ],
      brokkoli: [
        50,
        80,
        120
      ],
      gomba: [
        50,
        80,
        150
      ],
      zoldpaprika: [
        30,
        50,
        80
      ],
      bacon: [
        15,
        25,
        40
      ]
    },
    spices: "só, bors, majoranna",
    steps: [
      "Melegítsd elő a sütőt 200 °C-ra. Szedd rózsáira a karfiolt, és sós vízben 6-7 perc alatt főzd félpuhára, csepegtesd le jól.",
      "A brokkolit főzd a karfiollal együtt, a gombát vagy a paprikát vágd apróra, és pirítsd a hússal ({zold}).",
      "Ha van bacon ({bacon}), csíkokra vágva pirítsd ki egy serpenyőben, és a zsírján folytasd.",
      "Pirítsd meg a hagymát és a fokhagymát, add hozzá a darált húst ({feh}), a fűszerpaprikát és a majoránnát, sózd, és 8-10 percig pirítsd morzsásra.",
      "Keverd simára a tejfölt a tojással és egy csipet sóval.",
      "Kivajazott tálban rétegezd: karfiol fele, hús, karfiol másik fele, rá a tejfölös öntet, végül a reszelt sajt ({sajt}).",
      "200 °C-on süsd 20-25 percig, amíg a teteje aranybarna. 5 percig hagyd állni, mielőtt szeleteled."
    ]
  },
  {
    id: "paprikas",
    name: "Paprikás csirke",
    cuisine: "magyaros",
    meals: [
      "foetel"
    ],
    method: "Lábas",
    time: 45,
    slots: [
      {
        key: "feh",
        label: "Hús",
        pick: [
          1,
          1
        ],
        options: [
          "csirkecomb"
        ]
      },
      {
        key: "zsir",
        label: "Zsiradék",
        pick: [
          1,
          1
        ],
        options: [
          "disznozsir",
          "vaj"
        ]
      },
      {
        key: "koret",
        label: "Köret",
        pick: [
          1,
          1
        ],
        options: [
          "karfiol",
          "brokkoli",
          "cukkini"
        ]
      },
      {
        key: "salata",
        label: "Saláta",
        pick: [
          0,
          1
        ],
        options: [
          "uborka"
        ]
      }
    ],
    fixed: [
      {
        id: "tejfol"
      },
      {
        id: "tejszin"
      },
      {
        id: "voroshagyma"
      },
      {
        id: "zoldpaprika"
      },
      {
        id: "paradicsom"
      },
      {
        id: "fuszerpaprika"
      }
    ],
    ranges: {
      tejfol: [
        40,
        70,
        100
      ],
      voroshagyma: [
        15,
        30,
        50
      ],
      zoldpaprika: [
        20,
        40,
        70
      ],
      paradicsom: [
        20,
        40,
        70
      ],
      fuszerpaprika: [
        3,
        5,
        8
      ],
      disznozsir: [
        5,
        12,
        20
      ],
      vaj: [
        5,
        12,
        20
      ],
      tejszin: [
        10,
        30,
        50
      ],
      csirkecomb: [
        150,
        200,
        250
      ],
      karfiol: [
        80,
        150,
        250
      ],
      brokkoli: [
        80,
        120,
        200
      ],
      cukkini: [
        80,
        150,
        250
      ],
      uborka: [
        50,
        80,
        120
      ]
    },
    spices: "só, bors, kevés ecet az uborkasalátához",
    steps: [
      "A zsiradékon ({zsir}) közepes lángon 6-8 perc alatt pirítsd üvegesre a finomra vágott hagymát.",
      "Húzd le a tűzről, keverd bele a fűszerpaprikát (ne égjen meg), és azonnal add hozzá a falatnyira vágott húst ({feh}), forgasd át.",
      "Add hozzá a felkockázott zöldpaprikát és paradicsomot, sózd, önts alá 1 dl vizet, és fedő alatt, lassú tűzön párold 25-30 percig, amíg a hús puha.",
      "Közben készítsd el a köretet ({koret}): a karfiolt 10-12 perc alatt főzd puhára, és törd pürévé, a brokkolit vagy a cukkinit 5-6 percig párold.",
      "Az uborkát ({salata}) gyalud vékonyra, sózd, 10 perc után nyomkodd ki, ízesítsd ecettel, borssal, és szórd meg fűszerpaprikával.",
      "A tejfölt keverd simára a tejszínnel és egy merőkanál forró szafttal.",
      "Húzd le a pörköltet a tűzről, keverd bele a tejfölös keveréket, és 1-2 percig melegítsd, de ne forrald."
    ]
  },
  {
    id: "gombas-tejszines",
    name: "Tejszínes-parmezános gombás hús",
    cuisine: "olasz",
    meals: [
      "foetel"
    ],
    method: "Serpenyő",
    time: 25,
    slots: [
      {
        key: "feh",
        label: "Hús",
        pick: [
          1,
          1
        ],
        options: [
          "csirkecomb",
          "csirkemell",
          "tarja",
          "pulykamell"
        ]
      },
      {
        key: "zold",
        label: "Zöldség",
        pick: [
          1,
          1
        ],
        options: [
          "spenot",
          "brokkoli",
          "cukkini",
          "zoldbab"
        ]
      },
      {
        key: "krem",
        label: "Plusz krém",
        pick: [
          0,
          1
        ],
        options: [
          "kremsajt"
        ]
      },
      {
        key: "ropi",
        label: "Ropogós feltét",
        pick: [
          0,
          1
        ],
        options: [
          "bacon"
        ]
      }
    ],
    fixed: [
      {
        id: "gomba"
      },
      {
        id: "tejszin"
      },
      {
        id: "vaj"
      },
      {
        id: "parmezan"
      },
      {
        id: "fokhagyma"
      }
    ],
    ranges: {
      gomba: [
        150,
        200,
        300
      ],
      tejszin: [
        40,
        70,
        100
      ],
      vaj: [
        5,
        10,
        20
      ],
      parmezan: [
        15,
        20,
        30
      ],
      fokhagyma: [
        3,
        5,
        8
      ],
      kremsajt: [
        15,
        30,
        50
      ],
      bacon: [
        15,
        25,
        40
      ],
      spenot: [
        80,
        120,
        200
      ],
      brokkoli: [
        80,
        120,
        180
      ],
      cukkini: [
        80,
        150,
        220
      ],
      zoldbab: [
        80,
        120,
        180
      ]
    },
    spices: "só, bors, kakukkfű, chilipehely",
    steps: [
      "A zöldséget ({zold}) készítsd elő: a brokkolit rózsáira szedve, a zöldbabot végeit levágva 4 percig főzd elő sós vízben, a cukkinit vágd félkarikára, a spenót nyersen megy.",
      "A húst ({feh}) vágd 2 cm-es csíkokra, sózd, borsozd. Forró serpenyőben, a vaj felén 5-6 perc alatt süsd körbe aranybarnára, vedd ki.",
      "Ugyanott közepes lángon 4 perc alatt süsd ropogósra a felcsíkozott bacont ({ropi}), vedd ki, a zsírja maradjon a serpenyőben.",
      "A maradék vajon erős lángon pirítsd a vastagra szelt gombát 6-8 percig, ritkán keverd, amíg elfő a leve és megbarnul. Add hozzá a zúzott fokhagymát és a kakukkfüvet, 30 másodperc.",
      "Öntsd fel a tejszínnel, keverd bele a reszelt parmezánt, 2-3 percig forrald, amíg bevonja a kanalat.",
      "Keverd bele a krémsajtot ({krem}), hogy selymesebb legyen a szósz.",
      "Tedd bele a zöldséget ({zold}) és a húst a kifolyt levével, 3-4 percig főzd, amíg a hús átsül (a spenótnak 1 perc elég).",
      "Tálaláskor szórd a tetejére a bacont ({ropi})."
    ]
  },
  {
    id: "gombasteak-tojas",
    name: "Pirított gomba parmezánnal és lágy tojással",
    cuisine: "olasz",
    meals: [
      "reggeli",
      "foetel"
    ],
    method: "Serpenyő",
    time: 15,
    veg: true,
    slots: [
      {
        key: "feh",
        label: "Tojás",
        pick: [
          1,
          1
        ],
        options: [
          "tojas"
        ]
      },
      {
        key: "zold",
        label: "Zöldség",
        pick: [
          1,
          1
        ],
        options: [
          "spenot",
          "koktelparadicsom",
          "cukkini"
        ]
      },
      {
        key: "friss",
        label: "Friss zöld",
        pick: [
          0,
          1
        ],
        options: [
          "rukkola",
          "ujhagyma"
        ]
      },
      {
        key: "zsir",
        label: "Zsiradék",
        pick: [
          1,
          2
        ],
        options: [
          "vaj",
          "olivaolaj"
        ]
      },
      {
        key: "sajt",
        label: "Plusz sajt",
        pick: [
          0,
          1
        ],
        options: [
          "kecskesajt",
          "cheddar",
          "mozzarella"
        ]
      },
      {
        key: "ropi",
        label: "Ropogós",
        pick: [
          0,
          1
        ],
        options: [
          "dio",
          "tokmag"
        ]
      }
    ],
    fixed: [
      {
        id: "gomba"
      },
      {
        id: "parmezan"
      },
      {
        id: "fokhagyma"
      }
    ],
    ranges: {
      gomba: [
        150,
        250,
        350
      ],
      tojas: [
        100,
        150,
        200
      ],
      parmezan: [
        10,
        20,
        30
      ],
      fokhagyma: [
        3,
        5,
        8
      ],
      spenot: [
        50,
        100,
        150
      ],
      koktelparadicsom: [
        50,
        80,
        120
      ],
      cukkini: [
        60,
        100,
        150
      ],
      rukkola: [
        15,
        30,
        50
      ],
      ujhagyma: [
        10,
        15,
        25
      ],
      kecskesajt: [
        20,
        35,
        50
      ],
      cheddar: [
        15,
        25,
        40
      ],
      mozzarella: [
        30,
        50,
        70
      ],
      dio: [
        5,
        10,
        20
      ],
      tokmag: [
        5,
        10,
        15
      ],
      vaj: [
        0,
        10,
        25
      ],
      olivaolaj: [
        0,
        10,
        25
      ]
    },
    spices: "só, bors, kakukkfű, chilipehely",
    steps: [
      "Forralj vizet, a szobahőmérsékletű tojásokat ({feh}) főzd 6,5 percig, tedd jeges vízbe, majd pucold meg.",
      "Száraz serpenyőben 2-3 perc alatt pirítsd meg a magot ({ropi}), vágd durvára, tedd félre.",
      "A gombát vágd 1 cm vastag szeletekre. A zsiradékon ({zsir}) erős lángon, egy rétegben pirítsd 6-8 percig, félidőben fordítsd, csak a végén sózd. Az utolsó percben add hozzá a szeletelt fokhagymát.",
      "Tedd bele a zöldséget ({zold}), 2 percig pirítsd, amíg a spenót összeesik, a paradicsom megpattan, a cukkini széle megbarnul.",
      "Tányéron reszelj bőven parmezánt a forró gombára, tedd rá a kettévágott tojásokat és a sajtot ({sajt}).",
      "Szórd meg a friss zölddel ({friss}).",
      "A tetejére szórd a pirított magot ({ropi})."
    ]
  },
  {
    id: "parmigiana",
    name: "Padlizsános parmigiana húsos paradicsomszósszal",
    cuisine: "olasz",
    meals: [
      "foetel"
    ],
    method: "Sütő",
    time: 50,
    slots: [
      {
        key: "feh",
        label: "Darált hús",
        pick: [
          1,
          1
        ],
        options: [
          "marha10",
          "marha15",
          "marha20",
          "sertes20"
        ]
      },
      {
        key: "zold",
        label: "Zöldség",
        pick: [
          1,
          1
        ],
        options: [
          "padlizsan",
          "cukkini"
        ]
      },
      {
        key: "reteg",
        label: "Plusz réteg",
        pick: [
          0,
          1
        ],
        options: [
          "gomba",
          "spenot"
        ]
      },
      {
        key: "zsir",
        label: "Olaj",
        pick: [
          1,
          1
        ],
        options: [
          "olivaolaj"
        ]
      }
    ],
    fixed: [
      {
        id: "mozzarella"
      },
      {
        id: "parmezan"
      },
      {
        id: "passata"
      },
      {
        id: "fokhagyma"
      }
    ],
    ranges: {
      passata: [
        40,
        70,
        110
      ],
      olivaolaj: [
        5,
        15,
        25
      ],
      padlizsan: [
        150,
        200,
        300
      ],
      cukkini: [
        150,
        200,
        300
      ],
      fokhagyma: [
        3,
        5,
        8
      ],
      mozzarella: [
        40,
        60,
        100
      ],
      parmezan: [
        10,
        20,
        30
      ],
      gomba: [
        60,
        100,
        150
      ],
      spenot: [
        50,
        80,
        120
      ]
    },
    spices: "só, bors, bazsalikom, oregánó",
    steps: [
      "Melegítsd elő a sütőt 220 °C-ra. Szeleteld a zöldséget ({zold}) hosszában 1 cm-esre, sózd, 10 perc múlva itasd fel a levét.",
      "Kend meg az olaj felével, sütőpapíros tepsiben süsd 15-20 percig, félidőben fordítsd, amíg puha és foltokban barna.",
      "Közben a maradék olajon 1 percig pirítsd a fokhagymát, add hozzá a darált húst ({feh}), morzsold szét, és erős lángon pirítsd 6-8 percig.",
      "Add a húshoz a plusz réteget ({reteg}): a szeletelt gombát 4 percig pirítsd vele, a spenótnak 1 perc elég.",
      "Öntsd hozzá a passatát, fűszerezd, 10 percig sűrítsd, amíg nem folyós.",
      "Kis sütőtálban rétegezd: zöldség, szósz, tépett mozzarella, ismételd, a teteje mozzarella legyen. Szórd meg a reszelt parmezánnal.",
      "Kapcsold le a sütőt 200 °C-ra, süsd 15-20 percig, amíg bugyog és a teteje barnul. Vágás előtt 5 percig pihentesd."
    ]
  },
  {
    id: "bolognai",
    name: "Cukkinispagetti bolognai",
    cuisine: "olasz",
    meals: [
      "foetel"
    ],
    method: "Serpenyő",
    time: 35,
    slots: [
      {
        key: "feh",
        label: "Darált hús",
        pick: [
          1,
          1
        ],
        options: [
          "marha10",
          "marha15",
          "marha20",
          "sertes20"
        ]
      },
      {
        key: "zsir",
        label: "Zsiradék",
        pick: [
          1,
          1
        ],
        options: [
          "olivaolaj",
          "vaj"
        ]
      },
      {
        key: "extra",
        label: "Plusz zöldség",
        pick: [
          0,
          1
        ],
        options: [
          "gomba",
          "spenot"
        ]
      }
    ],
    fixed: [
      {
        id: "cukkini"
      },
      {
        id: "passata"
      },
      {
        id: "parmezan"
      },
      {
        id: "fokhagyma"
      },
      {
        id: "voroshagyma"
      },
      {
        id: "szarzeller"
      }
    ],
    ranges: {
      cukkini: [
        150,
        250,
        350
      ],
      passata: [
        40,
        80,
        120
      ],
      voroshagyma: [
        10,
        15,
        25
      ],
      szarzeller: [
        15,
        30,
        50
      ],
      fokhagyma: [
        3,
        5,
        8
      ],
      parmezan: [
        10,
        20,
        30
      ],
      gomba: [
        60,
        100,
        150
      ],
      spenot: [
        50,
        80,
        120
      ],
      olivaolaj: [
        5,
        15,
        25
      ],
      vaj: [
        5,
        15,
        25
      ]
    },
    spices: "só, bors, oregánó, bazsalikom, babérlevél, chilipehely",
    steps: [
      "Aprítsd finomra a hagymát, a szárzellert és a fokhagymát.",
      "A zsiradék felén ({zsir}) közepes lángon 5 percig párold a hagymát és a zellert, add hozzá a fokhagymát, majd a darált húst ({feh}). Erős lángon, morzsolva 8 percig pirítsd, amíg barnulni kezd.",
      "Add hozzá a plusz zöldséget ({extra}): a szeletelt gombát 3 percig pirítsd a hússal, a spenótot a szósz végén keverd bele.",
      "Öntsd fel a passatával, tedd bele a babérlevelet, fedő nélkül 10-15 percig rotyogtasd sűrűre.",
      "Spirálozd a cukkinit, enyhén sózd, 5 perc után nyomkodd ki a levét. A maradék zsiradékon erős lángon 2 percig forgasd át, ne főzd puhára.",
      "Tálald a szósszal, reszelj rá parmezánt."
    ]
  },
  {
    id: "tojas-bacon-avokado",
    name: "Tükörtojás, bacon, avokádó",
    cuisine: "klasszikus",
    meals: [
      "reggeli"
    ],
    method: "Serpenyő",
    time: 15,
    slots: [
      {
        key: "feh",
        label: "Tojás",
        pick: [
          1,
          1
        ],
        options: [
          "tojas"
        ]
      },
      {
        key: "hus",
        label: "Hús",
        pick: [
          1,
          1
        ],
        options: [
          "bacon"
        ]
      },
      {
        key: "zold",
        label: "Sült zöldség",
        pick: [
          2,
          2
        ],
        options: [
          "paradicsom",
          "koktelparadicsom",
          "gomba",
          "spenot"
        ]
      },
      {
        key: "friss",
        label: "Friss zöld",
        pick: [
          0,
          1
        ],
        options: [
          "rukkola",
          "retek"
        ]
      },
      {
        key: "extra",
        label: "Extra",
        pick: [
          0,
          1
        ],
        options: [
          "cheddar",
          "chili"
        ]
      }
    ],
    fixed: [
      {
        id: "avokado"
      },
      {
        id: "vaj"
      }
    ],
    ranges: {
      tojas: [
        100,
        150,
        200
      ],
      avokado: [
        40,
        70,
        100
      ],
      vaj: [
        0,
        6,
        12
      ],
      bacon: [
        20,
        30,
        50
      ],
      paradicsom: [
        80,
        120,
        200
      ],
      koktelparadicsom: [
        80,
        120,
        200
      ],
      gomba: [
        80,
        120,
        200
      ],
      spenot: [
        50,
        100,
        150
      ],
      rukkola: [
        15,
        25,
        40
      ],
      retek: [
        30,
        60,
        100
      ],
      cheddar: [
        15,
        25,
        35
      ],
      chili: [
        2,
        4,
        8
      ]
    },
    spices: "só, bors, chilipehely, citromlé az avokádóra",
    steps: [
      "Hideg serpenyőbe tedd a bacont ({hus}), közepes lángon 6-8 perc alatt süsd ropogósra, vedd ki.",
      "A kisült zsíron és a vajon erős lángon pirítsd meg a zöldséget ({zold}): a gombát 5 percig, a félbevágott paradicsomot vágott felével lefelé 2-3 percig, a spenótot 1 percig.",
      "Ugyanott közepes lángon süss tükörtojást ({feh}) 3 perc alatt, a sárgája maradjon folyós.",
      "Szórd a tojásra: {extra} (a reszelt cheddart fedő alatt 1 percig olvaszd rá, a chilit vékony karikára vágd).",
      "Tálald a szeletelt, sózott avokádóval és a friss zölddel ({friss})."
    ]
  },
  {
    id: "omlett",
    name: "Gombás-sajtos omlett",
    cuisine: "klasszikus",
    meals: [
      "reggeli",
      "foetel"
    ],
    method: "Serpenyő",
    time: 15,
    veg: true,
    slots: [
      {
        key: "feh",
        label: "Tojás",
        pick: [
          1,
          1
        ],
        options: [
          "tojas"
        ]
      },
      {
        key: "zold",
        label: "Plusz zöldség",
        pick: [
          1,
          2
        ],
        options: [
          "spenot",
          "paprika",
          "koktelparadicsom",
          "ujhagyma"
        ]
      },
      {
        key: "sajt",
        label: "Sajt",
        pick: [
          1,
          1
        ],
        options: [
          "cheddar",
          "gouda",
          "feta",
          "kecskesajt",
          "parmezan"
        ]
      },
      {
        key: "extra",
        label: "Mellé",
        pick: [
          0,
          1
        ],
        options: [
          "tejfol",
          "avokado",
          "rukkola"
        ]
      }
    ],
    fixed: [
      {
        id: "gomba"
      },
      {
        id: "vaj"
      }
    ],
    ranges: {
      tojas: [
        150,
        200,
        250
      ],
      vaj: [
        5,
        10,
        20
      ],
      gomba: [
        80,
        150,
        250
      ],
      spenot: [
        50,
        100,
        150
      ],
      paprika: [
        50,
        80,
        120
      ],
      koktelparadicsom: [
        60,
        100,
        150
      ],
      ujhagyma: [
        10,
        20,
        30
      ],
      cheddar: [
        20,
        30,
        50
      ],
      gouda: [
        20,
        30,
        50
      ],
      feta: [
        25,
        40,
        60
      ],
      kecskesajt: [
        25,
        40,
        60
      ],
      parmezan: [
        10,
        20,
        30
      ],
      tejfol: [
        20,
        40,
        60
      ],
      avokado: [
        40,
        60,
        90
      ],
      rukkola: [
        15,
        25,
        40
      ]
    },
    spices: "só, bors, metélőhagyma",
    steps: [
      "A vaj felén erős lángon 5 percig pirítsd a szeletelt gombát, a végén add hozzá a többi zöldséget ({zold}) is 1-2 percre. Tedd félre.",
      "Verd fel a tojásokat ({feh}) sóval, borssal, csak addig, amíg egynemű.",
      "Kitörölt serpenyőben, a maradék vajon, közepes-alacsony lángon öntsd bele a tojást. Spatulával húzd a széleit középre 3-4 percig, amíg alul megköt, a teteje még krémes.",
      "Tedd az egyik felére a gombát és a sajtot ({sajt}), hajtsd rá a másik felét, fedő alatt 1 percig hagyd olvadni.",
      "Tálald mellé: {extra}."
    ]
  },
  {
    id: "turos-palacsinta",
    name: "Túrós lepénykék málnával",
    cuisine: "klasszikus",
    meals: [
      "reggeli"
    ],
    method: "Serpenyő",
    time: 25,
    slots: [
      {
        key: "liszt",
        label: "Liszt",
        pick: [
          1,
          1
        ],
        options: [
          "zabliszt",
          "finomliszt"
        ]
      },
      {
        key: "zsir",
        label: "Krém",
        pick: [
          1,
          1
        ],
        options: [
          "tejfol",
          "tejszin"
        ]
      },
      {
        key: "mag",
        label: "Magvak",
        pick: [
          0,
          1
        ],
        options: [
          "dio",
          "mandula",
          "mogyoro",
          "pisztacia"
        ]
      },
      {
        key: "extra",
        label: "Extra",
        pick: [
          0,
          1
        ],
        options: [
          "etcsoki"
        ]
      }
    ],
    fixed: [
      {
        id: "turo"
      },
      {
        id: "tojas"
      },
      {
        id: "vaj"
      },
      {
        id: "malna"
      }
    ],
    ranges: {
      turo: [
        80,
        100,
        120
      ],
      tojas: [
        100,
        100,
        150
      ],
      zabliszt: [
        4,
        6,
        8
      ],
      finomliszt: [
        4,
        6,
        8
      ],
      vaj: [
        8,
        12,
        18
      ],
      malna: [
        20,
        30,
        50
      ],
      tejfol: [
        20,
        40,
        60
      ],
      tejszin: [
        20,
        40,
        60
      ],
      dio: [
        5,
        10,
        15
      ],
      mandula: [
        5,
        10,
        15
      ],
      mogyoro: [
        5,
        10,
        15
      ],
      pisztacia: [
        5,
        8,
        12
      ],
      etcsoki: [
        0,
        6,
        10
      ]
    },
    spices: "eritrit vagy stevia, vanília, csipet só, fél tk sütőpor",
    steps: [
      "Botmixerrel turmixold teljesen simára a túrót és a tojásokat. Keverd bele a lisztet ({liszt}), a vaj harmadát megolvasztva, a sütőport, a sót, a vaníliát és az édesítőt, majd pihentesd 10 percig: sűrű, lassan folyó tésztát kapsz.",
      "Tapadásmentes serpenyőben, alacsony-közepes lángon olvassz fel egy kevés vajat. Evőkanállal tegyél bele 4 kis, kb. 8 cm átmérőjű, ujjnyi vastag lepényt. Nagyobbat ne, mert kevés lisztes tészta csak kis méretben fordítható.",
      "Fedő alatt süsd 3-4 percig, amíg a teteje matt és a széle megköt, az alja aranybarna. Vékony lapáttal fordítsd meg, a maradék vajon fedő nélkül süsd még 1-2 percig.",
      "Tálald a krémmel ({zsir}) és a málnával, a málna felét villával nyomd szét szósznak.",
      "Szórd meg száraz serpenyőben pirított, durvára vágott maggal ({mag}).",
      "Reszelj rá csokoládét ({extra})."
    ]
  },
  {
    id: "lazacos-tojas",
    weight: 0.35,
    name: "Füstölt lazacos rántotta avokádóval",
    cuisine: "klasszikus",
    meals: [
      "reggeli"
    ],
    method: "Serpenyő",
    time: 10,
    slots: [
      {
        key: "feh",
        label: "Tojás",
        pick: [
          1,
          1
        ],
        options: [
          "tojas"
        ]
      },
      {
        key: "hal",
        label: "Hal",
        pick: [
          1,
          1
        ],
        options: [
          "fustoltlazac"
        ]
      },
      {
        key: "zold",
        label: "Levél",
        pick: [
          1,
          1
        ],
        options: [
          "rukkola",
          "spenot"
        ]
      },
      {
        key: "friss",
        label: "Ropogós zöldség",
        pick: [
          1,
          2
        ],
        options: [
          "uborka",
          "koktelparadicsom",
          "retek",
          "paprika"
        ]
      },
      {
        key: "krem",
        label: "Krém",
        pick: [
          1,
          1
        ],
        options: [
          "kremsajt",
          "tejfol"
        ]
      },
      {
        key: "extra",
        label: "Extra",
        pick: [
          0,
          1
        ],
        options: [
          "kapribogyo",
          "lilahagyma",
          "ujhagyma"
        ]
      }
    ],
    fixed: [
      {
        id: "avokado"
      },
      {
        id: "vaj"
      }
    ],
    ranges: {
      tojas: [
        100,
        150,
        200
      ],
      fustoltlazac: [
        40,
        60,
        80
      ],
      avokado: [
        40,
        70,
        100
      ],
      vaj: [
        3,
        6,
        12
      ],
      kremsajt: [
        15,
        30,
        50
      ],
      tejfol: [
        15,
        30,
        50
      ],
      rukkola: [
        15,
        30,
        50
      ],
      spenot: [
        30,
        50,
        80
      ],
      uborka: [
        60,
        100,
        150
      ],
      koktelparadicsom: [
        60,
        100,
        150
      ],
      retek: [
        30,
        60,
        100
      ],
      paprika: [
        40,
        80,
        120
      ],
      kapribogyo: [
        5,
        8,
        12
      ],
      lilahagyma: [
        10,
        15,
        25
      ],
      ujhagyma: [
        10,
        15,
        25
      ]
    },
    spices: "só, bors, kapor, citromhéj",
    steps: [
      "Verd fel a tojásokat ({feh}) egy csipet sóval. A vajon, alacsony lángon, folyamatosan kevergetve 3-4 perc alatt süss belőle krémes rántottát. Amikor még kissé nedves, húzd le a tűzről, és keverd bele a krémet ({krem}).",
      "Tányérra tedd a levelet ({zold}), a felszeletelt zöldséget ({friss}) és a szeletelt, citromhéjjal megszórt avokádót.",
      "Tedd mellé a rántottát és a lazacot ({hal}), szórd meg kaporral.",
      "A tetejére szórd: {extra} (a hagymát vékony karikára vágva)."
    ]
  },
  {
    id: "medi-reggeli",
    name: "Mediterrán tojásos tányér",
    cuisine: "mediterran",
    meals: [
      "reggeli"
    ],
    method: "Hideg",
    time: 12,
    veg: true,
    slots: [
      {
        key: "feh",
        label: "Tojás",
        pick: [
          1,
          1
        ],
        options: [
          "tojas"
        ]
      },
      {
        key: "sajt",
        label: "Sajt",
        pick: [
          1,
          1
        ],
        options: [
          "feta",
          "mozzarella",
          "kecskesajt"
        ]
      },
      {
        key: "zold",
        label: "Zöldség",
        pick: [
          2,
          2
        ],
        options: [
          "paradicsom",
          "koktelparadicsom",
          "paprika",
          "uborka"
        ]
      },
      {
        key: "friss",
        label: "Friss zöld",
        pick: [
          0,
          1
        ],
        options: [
          "rukkola",
          "retek",
          "ujhagyma"
        ]
      },
      {
        key: "zsir",
        label: "Olaj",
        pick: [
          1,
          1
        ],
        options: [
          "olivaolaj"
        ]
      },
      {
        key: "extra",
        label: "Extra",
        pick: [
          1,
          2
        ],
        options: [
          "zoldoliva",
          "feketeoliva",
          "avokado"
        ]
      }
    ],
    fixed: [],
    ranges: {
      tojas: [
        100,
        150,
        200
      ],
      olivaolaj: [
        5,
        10,
        18
      ],
      paradicsom: [
        60,
        120,
        200
      ],
      koktelparadicsom: [
        60,
        100,
        180
      ],
      uborka: [
        50,
        100,
        160
      ],
      paprika: [
        40,
        70,
        120
      ],
      rukkola: [
        20,
        40,
        60
      ],
      retek: [
        20,
        50,
        80
      ],
      ujhagyma: [
        10,
        15,
        30
      ],
      feta: [
        30,
        50,
        80
      ],
      mozzarella: [
        40,
        60,
        100
      ],
      kecskesajt: [
        30,
        45,
        70
      ],
      zoldoliva: [
        15,
        25,
        40
      ],
      feketeoliva: [
        15,
        25,
        40
      ],
      avokado: [
        30,
        50,
        80
      ]
    },
    spices: "só, bors, oregánó, chilipehely",
    steps: [
      "Tedd a tojásokat ({feh}) forrásban lévő vízbe, főzd 6,5 percig lágyra vagy 9 percig keményre, hűtsd le hideg vízben, pucold meg.",
      "Vágd fel a zöldséget ({zold}), rakd tányérra a sajttal ({sajt}) és az extrával ({extra}).",
      "Tedd mellé a friss zöldet ({friss}).",
      "Tedd mellé a félbevágott tojásokat, sózd, borsozd, locsold meg olívaolajjal, szórd meg oregánóval."
    ]
  },
  {
    id: "kimchi-tojas",
    name: "Kimchis tojásos serpenyő",
    cuisine: "azsiai",
    meals: [
      "reggeli"
    ],
    method: "Serpenyő",
    time: 12,
    slots: [
      {
        key: "hus",
        label: "Hús",
        pick: [
          0,
          1
        ],
        options: [
          "bacon"
        ]
      },
      {
        key: "zold",
        label: "Zöld",
        pick: [
          1,
          2
        ],
        options: [
          "spenot",
          "pakchoi",
          "gomba",
          "cukkini"
        ]
      },
      {
        key: "extra",
        label: "Feltét",
        pick: [
          1,
          2
        ],
        options: [
          "avokado",
          "cheddar",
          "szezammag"
        ]
      }
    ],
    fixed: [
      {
        id: "tojas"
      },
      {
        id: "kimchi"
      },
      {
        id: "szezamolaj"
      },
      {
        id: "ujhagyma"
      },
      {
        id: "szojaszosz"
      }
    ],
    ranges: {
      tojas: [
        100,
        150,
        200
      ],
      kimchi: [
        40,
        70,
        100
      ],
      szezamolaj: [
        3,
        8,
        12
      ],
      ujhagyma: [
        10,
        15,
        25
      ],
      szojaszosz: [
        3,
        6,
        10
      ],
      bacon: [
        20,
        30,
        50
      ],
      spenot: [
        50,
        100,
        200
      ],
      pakchoi: [
        60,
        120,
        200
      ],
      gomba: [
        60,
        120,
        200
      ],
      cukkini: [
        60,
        120,
        200
      ],
      avokado: [
        40,
        70,
        100
      ],
      cheddar: [
        15,
        25,
        45
      ],
      szezammag: [
        5,
        8,
        12
      ]
    },
    spices: "gochugaru vagy chilipehely",
    steps: [
      "Kockázd fel a bacont ({hus}), és közepes lángon 4-5 perc alatt pirítsd ropogósra. Szedd ki, a zsírja maradjon a serpenyőben.",
      "A szezámolajon pirítsd 2-3 percig a zöldet ({zold}), a felaprított kimchit és az újhagyma fehér részét.",
      "Mélyíts bele fészkeket, üsd bele a tojásokat, csepegtesd meg szójaszósszal, és fedő alatt, közepes lángon süsd 3-4 percig, amíg a fehérje megszilárdul.",
      "Morzsold rá a bacont ({hus}).",
      "Tálaláskor tedd rá: {extra}, és szórd meg az újhagyma zöld részével."
    ]
  }
];

export const TEMPLATE_BY_ID = Object.fromEntries(TEMPLATES.map((t) => [t.id, t]));
