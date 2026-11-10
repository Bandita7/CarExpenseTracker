# CarExpense Tracker v1.2.0 BÉTA

## Új: választható előtérbeli automatikus szinkronizáció
- Alapértelmezés: **kikapcsolva**. Beállítások → Adatkezelés → Automatikus szinkronizáció.
- Csak a nyitott PWA-ban, érvényes Google-hozzáférési tokennel működik. Bejelentkezés, előtérbe visszatérés és helyi mentés után próbálkozik (helyi módosítás után kb. 20 másodperc).
- Első szinkronizáció mindkét eszközön továbbra is **kézi**.
- A korábbi kézi szinkronizáció, Google Drive mentés és JSON export/import megmarad.
- A token lejárta után a Google-fiókot újra kell csatlakoztatni. iOS nem garantál háttérfuttatást.
- Az automatikus szinkronizáció nem oldja meg a két eszköz **egyidejű felhőfeltöltésének** versenyhelyzetét. Egyelőre ne módosítsd/szinkronizáld a két eszközt pontosan egyszerre. Ez BÉTA, nem tranzakcionális többeszközös szinkron.
- Ütközéskor nem ír felül eltérő rekordokat. JSON-mentést rendszeresen készíts.
- Importálás, felhőmentés visszaállítása és gyári adatok visszaállítása kikapcsolja az automatikus szinkront.

## Telepítés
A ZIP tartalmát töltsd fel a GitHub Pages repository gyökerébe. A `sw.js` cache-verziója változott.
