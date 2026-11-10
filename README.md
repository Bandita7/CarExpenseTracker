# CarExpense Tracker v1.0.0 BÉTA

Kézi kétirányú szinkronizáció a Google Drive appDataFolder rejtett tárhelyén.

## Biztonság
- A v0.9.0 időbélyeges kézi Drive-mentései megmaradnak.
- A szinkron minden feltöltésnél új, változtathatatlan felhőpillanatképet készít.
- A rendszer rekordazonosító alapján egyesít; ugyanazon rekord párhuzamos módosítása ütközés, és megszakítja a műveletet.
- A szinkron előtt helyi JSON-mentés töltődik le.
- Két eszközön *pontosan egyidejű* szinkronizáció versenyhelyzetét a béta még nem tudja teljesen kizárni. Egymás után szinkronizálj!
- Az újonnan csatlakozó eszközön eltérő azonosítójú rekordok egyesülnek, azonos azonosítójú, eltérő tartalmú rekordok ütköznek.
- Törlés és szerkesztés ütközése nem kerül automatikusan feloldásra.
- A céges proxy továbbra is blokkolhatja a Google Drive API-t.

## Első próba
1. Mindkét eszközön készíts JSON-mentést.
2. iPhone: Beállítások > Adatkezelés > Google csatlakozás > Szinkronizálás most.
3. iPad: ugyanott Szinkronizálás most.
4. Tesztelj két külön, új rekordot; szinkronizálj egymás után.
5. Ugyanazt a rekordot két eszközön eltérően módosítva az alkalmazásnak ütközést kell jeleznie.

A béta nem tartalmaz automatikus szinkronizációt és teljes tranzakcionális felhőzárat.
