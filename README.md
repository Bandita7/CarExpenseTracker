# CarExpense Tracker v1.3.0 BÉTA

## Újdonságok
- Ütköző rekordok kézi feloldása: helyi vagy felhőbeli változat választása, a törléseket is beleértve.
- Újraellenőrzi a legfrissebb felhőpillanatképet, mielőtt közzéteszi a feloldott állapotot.
- Helyi módosítások jelzése az utolsó szinkronizált állapothoz képest (adatkategóriák száma, nem rekordszám).
- A v1.2.1 automatikus és kézi szinkron, iOS megosztás és PWA-frissítés megmaradt.

## Korlátozás
A Drive-on időbélyeges, különálló pillanatképek keletkeznek. A két eszköz egyidejű feltöltését a rendszer még nem tudja szerveroldali tranzakcióval vagy kizárólagos zárral garantáltan kizárni. Az automatikus szinkron alapértelmezésben kikapcsolt. Külön JSON-mentés ajánlott; két eszközön egymás után tesztelj.

## Próba
1. JSON biztonsági mentés mindkét eszközön.
2. Kézi szinkron mindkét eszközön.
3. Ugyanazt a tesztrekordot módosítsd eltérően a két eszközön offline, majd egymás után szinkronizálj.
4. Az ütköző rekordnál válassz helyi vagy felhőbeli változatot; indítsd újra a szinkront.
5. Ellenőrizd mindkét eszközön a választott adatot.
