# CarExpense Tracker v1.5.1 BÉTA — Sync Safety

## Biztonsági változások
- Szinkronizáció előtt és feltöltés után az összes szinkronpillanatkép szülőkapcsolatának ellenőrzése.
- Különálló párhuzamos felhőágak esetén a rendszer **nem választ önkényesen legújabb állapotot**, hanem leáll. A pillanatképek megmaradnak.
- Hiányos vagy sérült előzmény esetén a szinkron nem módosítja a helyi adatokat.
- Javított ütközésfeloldás: a „felhőváltozat megtartása” valóban a felhőbeli rekordot választja.
- Az automatikus szinkron szünetel, ha párhuzamos ágakat észlel.

## Ismert korlát
A Google Drive fájllista és az új fájl létrehozása nem alkot szerveroldali atomi tranzakciót. Az egyszerre futó feltöltések megelőzése **nem garantált**; a létrejött párhuzamos ágakat a következő ellenőrzés észleli és leállítja. Az ágak automatikus egyesítése még nincs megvalósítva. Ezért a két eszközön az automatikus szinkron egyidejű bekapcsolása továbbra sem javasolt.

## Teszt
1. JSON biztonsági mentés mindkét eszközön.
2. Frissítés után kézi szinkron mindkét eszközön egymás után.
3. Eltérő teszthatáridővel ütközés létrehozása; **felhőváltozat** kiválasztásának tesztelése.
4. Ellenőrizd, hogy a kiválasztott dátum mindkét eszközön megjelenik.

## v1.5.1 Google OAuth biztonság
- Megjegyzi a korábbi csatlakozás tényét, nem tárol tartós tokent.
- Lejárat/401 után leállítja a Drive-hozzáférést és a függő automatikus szinkronidőzítést.
- Újrakapcsolódáskor nem kényszeríti ki minden alkalommal a consent képernyőt.
- Google-fiókválasztás vagy jóváhagyás továbbra is szükséges lehet.
- A párhuzamos Drive-pillanatképek automatikus egyesítése még nem megoldott.
