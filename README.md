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


## v1.5.2 BÉTA
- Ütközéskor rekordtípus, felismerhető rekordnév és mezőnkénti helyi/felhő összehasonlítás jelenik meg.
- A JSON csak külön lenyitható technikai részlet; a döntés továbbra is teljes rekordra vonatkozik.
- A törlés külön figyelmeztetést és egyértelmű választási lehetőséget kap.
- A meglévő Drive-szinkronizációs protokoll változatlan; a párhuzamos feltöltés még nem tranzakcionális.

## v1.5.3 BÉTA – Data Integrity
- Kötelező és opcionális adattáblák szerkezeti ellenőrzése.
- Hiányzó/duplikált rekordazonosítók kiszűrése JSON-visszaállítás és szinkron során.
- A helyben megjegyzett közös felhőállapot azonosítójának ellenőrzése a Drive-előzményben.
- Az egyesített állapot ellenőrzése feltöltés előtt.
- Nem teljes séma-validáció: az összes üzleti mező és hivatkozás még nem ellenőrzött.
- Az egyidejű Drive-feltöltés továbbra sem atomi; automatikus szinkront egyelőre ne kapcsold be.\n
## v1.5.4 BÉTA – Szervizszerkesztő hibajavítás
- A kategóriaváltáskor a teljes Megnevezés mezőblokk cserélődik, a felirat nem sokszorozódik.
- Kategóriaváltáskor a korábbi kategóriához tartozó megnevezés törlődik, új tétel választandó.
- A járműlap kapcsolódó legördülőjének ugyanilyen frissítési hibája is javítva.
- Meglévő szervizrekord kategória/megnevezés átírásakor az egyszerű költségmód régi tételhivatkozása nem marad meg.
- A szinkronizációs protokoll és az adatmodell nem változott.

- Az Egyéb költségek táblázatban a rögzített kilométeróra-állás immár külön oszlopban látható (üres adatnál —); adatmigrációra nincs szükség.


## v1.6.0 BÉTA – Data Safety Plus
- Visszaállítás előtt interaktív, közérthető mentés-előnézet a rekordok számával, blokkoló hibákkal és figyelmeztetésekkel.
- Járműre mutató idegen kulcsok ellenőrzése; hiányzó/duplikált rekordazonosítók blokkolása; típus-/gumihivatkozásoknál nem blokkoló figyelmeztetés.
- Tankolási kilométeróra-időrend ellenőrzése (nem blokkoló figyelmeztetés).
- A tényleges helyi adatcsere, a korábbi állapot helyi megőrzése és a szinkronalap törlése egyetlen IndexedDB-tranzakcióban.
- Visszaállítás előtt külön JSON-mentést kér, amelyet a felhasználó megerősít.
- Új „Adatállomány ellenőrzése” és „Helyi helyreállítási pont” gomb az Adatkezelés menüben.
- A helyreállítás automatikusan kikapcsolja az automatikus szinkronizációt; az első szinkront utána kézzel kell végezni.
- A meglévő schemaVersion=2 és IndexedDB v1 változatlan maradt, hogy a v1.5.x kompatibilitás megmaradjon.
- A helyi helyreállítási pont nem helyettesíti a külön mentett JSON-t: azonos böngésző-tárhelyen van, és a következő visszaállítás felülírja.
- Egyidejű Google Drive-feltöltések továbbra sem atomi műveletek: a kézi, egymás utáni szinkronizáció javasolt.


## v1.7.0 BÉTA – Sync Safety, kézi felhőág-egyesítés
- A v1-es szinkronfájlokat változatlanul olvassa. Az új pillanatképek `carexpense-sync-v2` formátumúak, több `parents` azonosítóval. A v1.6 vagy régebbi eszközök **nem tudják** az új v2 fájlokat olvasni: minden eszközt frissíts.
- A felhőgráf összes csomópontjának szerkezeti, rekord- és szülőellenőrzése (hiányzó szülő, kör, független gyökerek tiltása).
- Párhuzamos felhőágaknál közös ős alapján, háromutas egyesítéssel dolgozik; eltérő ugyanazon rekordnál az ismert döntési felületet használja. A törlés és módosítás ütközést okoz.
- Kézi megerősítés után immutábilis, több szülőhöz kapcsolt új felhőpillanatkép készül. A régi fájlokat sosem törli.
- Felhőelőzmény újraellenőrzése feltöltés előtt/után, helyi szinkronalap tartalmának összevetése a felhőben lévő őssel.
- Egy IndexedDB-tranzakcióban történik a helyi adat és a sikeres felhőazonosító elmentése; közben megváltozott helyi rekordoknál a művelet leáll.
- NINCS szerveroldali compare-and-swap/lock: az egyszerre feltöltő eszközök továbbra is új ágakat hozhatnak létre. Automatikus szinkronizációt ne kapcsold be.
- Független, közös ős nélküli Drive-előzmények esetén nem találgat: megszakítja az egyesítést.
- Első telepítéskor készíts JSON-mentést minden eszközön; tesztelj manuálisan, különböző tesztrekordokkal.

- Az automatikus szinkron kapcsolója v1.7.0-ban tiltva van; a korábban beállított automatikus szinkron bekapcsolását felülírja.


## v1.7.1 BÉTA – szinkron-kompatibilitási hotfix
- Korábbi szinkronalapoknál csak a ténylegesen szinkronizált rekordtáblákat hasonlítja a Drive-on szereplő közös ős megfelelő tábláihoz; a metaadatok (`exportedAt` és egyéb nem szinkronizált mezők) eltérése nem ok a leállásra.
- A rekordadatok, törlések és szerkezeti ellenőrzések változatlanul szigorúak: eltérésnél leállás, nincs automatikus felülírás.
- Ha egy sikeres szinkron nem hoz létre új felhőfájlt, akkor a helyi `syncBase.snapshot` a tényleges Drive-pillanatképre mutató tartalomként frissül, nem a csak szemantikailag azonos helyi JSON-ra.
- A v2 szinkronprotokoll, JSON-séma és az automatikus szinkron tiltása változatlan.
- Az újracsatlakozás és a Drive-integráció élő tesztje szükséges iPhone-on/iPaden.

## v1.7.2 BÉTA – Sync Recovery és törlési figyelmeztetés
- A helyi rekordokat ténylegesen módosító sikeres szinkronok előtt az előző `all` állapot a külön `syncRecovery` kulcson kerül megőrzésre ugyanabban az IndexedDB tranzakcióban. Ez nem írja felül az import/visszaállítás `restoreRecovery` mentőpontját.
- A Beállítások → Adatkezelés → Szinkron előtti állapot gomb mentés-előnézettel, explicit megerősítéssel és külön JSON-exporttal teszi lehetővé az előző szinkron előtti helyi állapot visszaállítását. A visszaállítás a szinkronalapot törli.
- Ha ütközésnél a rekord egyik oldalon törölt, külön figyelmeztetés jelenik meg az esetleges következményekről.
- A szinkronprotokoll továbbra is carexpense-sync-v2; a JSON schemaVersion=2 változatlan.
- NINCS atomi, szerveroldali Drive CAS/lock; automatikus szinkron továbbra is tiltva.
- A szinkronmentőpont ugyanabban a böngészőtárhelyben van, minden következő módosító szinkron lecseréli; nem helyettesíti a külön mentett JSON-t.


## v1.7.3 BÉTA – iPad Határidők űrlap hotfix
- Csak a Határidők rekord szerkesztő rácsát módosítja.
- 1400 CSS px alatt tabletméretben két oszlop, 760 CSS px-ig egy oszlop.
- A dátummező nem csúszhat rá a mellette lévő mezőre; az iPad Safari natív mezőjének min-width/appearance kezelése javítva.
- A szinkronizációs algoritmus, JSON séma és IndexedDB szerkezet nem változott.


## v1.7.4 BÉTA – iPad Safari date input hotfix
- Határidők dátummező: egységes 48px magasság üresen és kitöltve, kétoszlopos iPad nézetben is.
- Visszaállítva a natív Safari dátumvezérlő; kizárólag a Határidők űrlap CSS-ét módosítja.
- A szinkronizáció és az adatmodell nem változott.
\n\n## v1.7.5 BÉTA – iPad dátummező és verziótörténet\n- A Határidők dátummezőnél eltávolítottuk a korábbi, iPad Safari alatt túlméretező belső pseudo-element szabályokat. A dátummező minden állapotban 46px magasságot kap, maximált mérettel és 100%-os szélességgel.\n- A verziótörténet kiadásainak számozását és sorrendjét javítottuk (v1.6.0, v1.7.0, v1.7.2, v1.7.3).\n- A Súgó és a Beállítások korábbi verzióhivatkozásai frissültek.\n- Nem változott: adatséma, szinkronprotokoll, üzleti logika.\n- Ellenőrizendő valódi iPadOS Safari alatt: üres és kitöltött dátummező, álló/fekvő nézet.\n