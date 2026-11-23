# CarExpense Tracker v1.7.8 BÉTA — Safety & Regression

A futtatható PWA fájljai a gyökérkönyvtárban vannak. A `tests/` és `scripts/` fejlesztői eszközök, nem tartalmaznak felhasználói adatot.

A készülékes ellenőrzési lépések: `TESTPLAN.md`.

**Kiadás előtti kötelező ellenőrzés:** `node scripts/release-check.cjs` és `node --test tests/*.test.cjs`. Node.js 20+ szükséges.

**2026-11: v1.7.8 — Safety & Regression**
- Kiadási ellenőrzés: HTML `<title>`, fejléc, Névjegy, Súgó, verziótörténet, service worker cache és csomagfájlok egyezése.
- A jelenlegi JavaScript-függvényeket futtató tesztek: adatellenőrzés, helyi/felhő merge, törlés-módosítás ütközés, elágazó felhőgráf, megszakadt letöltés és sérült gráf.
- Helyi tranzakció forráskód-szerkezeti ellenőrzése és kézi tesztterv a valódi IndexedDB-hez.
- A protokoll, a rekordtárolás, a Google-token kezelés és a felhasználói adatok nem változtak.
- **Korlát:** a tesztek nem igazolják a két valóban egyidejű feltöltés atomi biztonságát; az automatikus szinkron tiltva marad.

## Korábbi kiadások

## v1.5.1 — történeti bejegyzés

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
## v1.7.6 BÉTA – iPad Safari dátummező

A Határidők esedékességi dátummezője egységes 46 px magas, balra igazított kijelzést kapott, üres és kitöltött állapotban egyaránt. A látható dátumot az átlátszó, kattintható natív `<input type="date">` vezérlő frissíti; az értékbeolvasás és a kötelezőmező-ellenőrzés változatlan. A szinkronizációs motor, a séma és a mentések nem változtak.

Valódi iPadOS Safari ellenőrzés szükséges: üres állapot, dátumválasztás, mentés, szerkesztés, álló és fekvő tájolás.

## v1.7.7 – ellenőrzött kiadás
Korábbi v1.7.6 ZIP hibája: az index.html fejléc és title v1.7.5-öt mutatott, bár a service worker verziószáma v1.7.6 volt. Most minden élő verziójelző v1.7.7. A dátummező v1.7.6-os megjelenítése megmaradt. A Google Drive és az adatséma nem változott.


## v1.8.0 BÉTA – Reliable Sync I

A Drive GET olvasások átmeneti hálózati hibánál vagy HTTP 429/500/502/503/504 esetén korlátozottan (legfeljebb összesen három próbálkozással) ismétlődnek, 350/900 ms várakozással. A tokenlejárat és az offline állapot külön hiba marad. **POST feltöltés automatikus ismétlése tilos**, mert a szerver már létrehozhatta a pillanatképet. Ilyenkor az alkalmazás a helyi adatokat megtartja, és következő kézi szinkronban ellenőrizhető a Drive előzmény.

A kiadás **nem** oldja meg atomi módon az egyidejű feltöltéseket, ezért az automatikus szinkron továbbra is le van tiltva. Ez egy konzervatív, első Reliable Sync részkiadás, nem a teljes v1.8-as cél lezárása.


## v1.8.1 BÉTA – Egygombos Google-csatlakozás és kézi szinkron
- Ha egy korábban csatlakoztatott Google-fiók hozzáférési tokenje lejárt, a Szinkronizálás most gomb nem tiltott: Google-csatlakozás és szinkronizálás feliratot mutat.
- A felhasználói gombnyomásból kér rövid életű tokent; annak sikeres beérkezése és a Drive mentéslista sikeres lekérése után a szokásos megerősítéssel indítja a kézi szinkront.
- Google hibánál vagy sikertelen listaolvasásnál nem indít szinkront.
- A már érvényes tokennel a szokásos kézi szinkron működik. Automatikus szinkron továbbra is tiltott.
- Nem érinti a helyi adatbázist, a rekordokat és a Google Drive-pillanatképek formátumát.


## v1.8.2 BÉTA – Reliable Sync II
- Bizonytalan eredményű Drive POST feltöltést soha nem ismétel automatikusan.
- Az egyedi nevű felhőpillanatképet GET-tel visszakeresi, a szülőket és az összes szinkronizált rekordot ellenőrzi.
- Csak egyetlen, ellenőrzött találatnál használja az új pillanatkép-azonosítót.
- Hiányzó, hibás vagy többértelmű eredménynél biztonságosan megáll, a helyi állapot marad.
- A szinkron előtti JSON-biztonsági mentésről szóló figyelmeztetés emlékeztető; továbbra sem készít automatikus fájlmentést.
- **Az automatikus szinkron továbbra is letiltott**, mert két eszköz ténylegesen egyidejű írása nem atomi.
- A mentési séma, Drive-fájlformátum és `.github/workflows/safety-check.yml` változatlan.


## v1.8.3 BÉTA – Reliable Sync III

- Ha a böngésző támogatja a Web Locks API-t, ugyanazon webhely és böngészőprofil párhuzamos lapjai/PWA-ablakai közül egyszerre csak egy indíthat kézi szinkront. Ha foglalt, az új kérés figyelmeztetéssel leáll.
- A feltöltés nélküli, csak helyi szinkron is újraellenőrzi a felhőelőzmény-végpontokat közvetlenül az IndexedDB-mentés előtt. A közben megváltozott felhőnél nem mentünk elavult szinkronalapot.
- **Korlát:** Web Locks nincs minden környezetben; a zárolás nem működik külön eszközök és külön böngészőprofilok között. A Google Drive továbbra sem biztosít atomi összehasonlítás-plusz-feltöltést. A ténylegesen egyidejű iPhone/iPad feltöltést ezért NEM tekintjük biztonságosnak; automatikus szinkron kikapcsolva marad.
- Drive protokoll, JSON adatséma, felhasználói rekordok és workflow-fájl **nem változtak**.
- Új célzott tesztek: az egyablakos zárolás, foglalt zárolás, Web Locks nélküli kompatibilitás és a végső no-upload felhőellenőrzés ellenőrzése.
