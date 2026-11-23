# KetoChef

Makróellenőrzött keto receptgenerátor és napi menü. Statikus oldal, nincs szerver, az adatok a böngészőben tárolódnak.

- Minden recept külön teljesíti a célarányt (alapból 66,32% zsír, 27,37% fehérje, 6,32% szénhidrát energiában, ±10% relatív tűréssel).
- A grammokat determinisztikus optimalizáló számolja (`js/engine/optimizer.js`), a tápértékek forrása `js/data/ingredients.js`.
- Receptkeretek: `js/data/templates.js`.

Futtatás helyben: `python -m http.server` a mappában. Tesztek: `node --test`.
