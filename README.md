# CarExpense Tracker v1.2.1 BÉTA

## Javítások
- Egységes iOS-megosztási felület a kézi JSON mentésnél, JSON import előtti mentésnél, Drive-visszaállítás előtti mentésnél és gyári adatok visszaállítása előtt.
- Az adatokat felülíró műveletek csak akkor folytatódnak, ha a felhasználó megerősítette, hogy a biztonsági mentést valóban eltárolta.
- Új PWA-frissítésjelző sáv és Beállítások / Adatkezelés / Alkalmazásfrissítés ellenőrzése gomb. Nem kell törölni a főképernyő ikont a frissítéshez.
- A kétirányú Google Drive-szinkronizáció és automatikus béta funkció változatlan.

## Figyelmeztetés
Az iOS megosztási API-ja nem tudja igazolni, hogy a felhasználó valóban mentette-e a fájlt, ezért a program ezt külön megkérdezi. A mentés elhagyása vagy megszakítása esetén nem indul visszaállítás.
Az iOS telepített PWA frissítésjelzése böngésző- és rendszerfüggő; ha nem jelenik meg, a PWA teljes bezárása és újranyitása segíthet. A főképernyőről való törlés a helyi adatokat is elveszítheti.
A szinkronizáció továbbra is béta; egyidejű felhőfeltöltés ellen nincs teljes tranzakcionális védelem.
