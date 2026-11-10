# CarExpense Tracker v1.0.2 – iOS szinkronjavítás (BÉTA)

A v1.0.1 diagnosztika alapján a Drive szinkronlista elérhető volt, de a szinkron során ugyanaz a kérés Load failed hibával leállt.

## Javítás
- A szinkronizáció előtt **nem indul automatikus JSON-fájlletöltés**, mert az iOS fájlmegosztó/letöltő felülete felfüggesztheti a PWA-t és megszakíthatja a következő fetch kérést.
- A szinkron előtt a felhasználónak **kézzel** kell készítenie és ellenőriznie a JSON biztonsági mentést.
- A diagnosztikai gomb és a korábbi mentés-visszaállítás változatlan.
- A szinkron továbbra is BÉTA: egyidejű szinkronizáció és bonyolult ütközések esetén nem garantál teljes védelmet.

## Teszt
1. Készíts külön JSON-mentést az iPhone-on és az iPaden, és ellenőrizd a fájlokat.
2. Frissítsd a GitHub Pages fájljait, várd meg a települést.
3. iPhone: diagnosztika, majd Szinkronizálás most.
4. Ha sikeres, csak utána iPad.
