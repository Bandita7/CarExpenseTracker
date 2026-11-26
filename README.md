# CarExpense Tracker v2.6.0 BÉTA

**Stabil kiadás – 2026-11-25.** A felhasználó által sikeresen tesztelt v2.1 RC2 változat kiadási jelölése. A kétirányú automatikus szinkron eszközönként külön engedélyezhető, a megbízható kézi szinkron megmarad. A PC-s JSON-export működését az RC2-ben javítottuk és ellenőriztük. Az IndexedDB-adatmodell és a szinkronmotor változatlan.

**Fontos korlát:** a Google Drive nem biztosít atomi zárolást a külön eszközök pontosan egyidejű feltöltésére; ütközésnél szükség lehet kézi beavatkozásra. Külön JSON-mentések továbbra is javasoltak.

**GitHub:** `.github` változatlan; a `scripts/`, `tests/`, `index.html`, `sw.js`, README és TESTPLAN frissítendő.

---

# CarExpense Tracker v2.1 RC1 – Auto Sync Scheduling Safety

A 2.1.2 változatra épülő frissítés: ha a helyi mentéskor vagy egy előtérbe váltáskor éppen Drive-művelet fut, az automatikus szinkronigényt a rendszer később újraütemezi. A 12 másodperces minimális indítási intervallumban keletkezett kéréseket sem dobja el. Hiba, lejárt token, offline állapot vagy kézi feloldást igénylő ütközés esetén nincs automatikus végtelen újrapróbálás. A Drive-adatmodell és a konfliktusfeloldás változatlan.

A pontosan egyidejű, több eszközről történő feltöltés továbbra sem tranzakcióbiztos. Automatikus mód csak kísérleti jelleggel, mentés mellett, nem egyidejű módosításokkal ajánlott.

## GitHub
A `.github` mappát nem kell frissíteni. A teljes csomag többi fájlját, a `tests/` mappát is töltsd fel.

---

# CarExpense Tracker v2.1.1 BÉTA – stabil kiadás

**Stabil kiadás (2026-11-25).** A sikeresen tesztelt v2.0 STABLE-ből készült. A járműadatok sémája és a szinkronalgoritmus változatlan.

## Stabil kiadás tartalma

- Teljes automatizált regressziós tesztkészlet és kiadáskonzisztencia-ellenőrzés.
- A JSON-export valódi mentésének kézi megerősítése, import/visszaállítás előtti védelem, helyi ellenőrzések és PWA-frissítés védelme.
- iPhone + iPad + asztali böngésző manuális tesztje a TESTPLAN.md szerint.
- A Google Drive-os kézi szinkron és az ellenőrzött IndexedDB-gyorsítótár megtartása.

## Kiadáskorlátok

- Az automatikus, jóváhagyás nélküli feltöltés **tiltott**.
- A több eszközről pontosan egyszerre induló Drive-feltöltés nem tranzakcionális; éles adatokkal ne teszteld.
- A Google OAuth új engedélyezést kérhet. A felhőfigyelés olvasási művelet, nem szinkronizáció.
- A helyi/Drive állapotellenőrzések nem bizonyítják, hogy egy külön JSON-mentés ténylegesen el van tárolva.
- Az RC1 készülékes tesztjei sikeresek voltak; a további használat során is ajánlott a rendszeres JSON-export.

## GitHub feltöltés

Töltsd fel a csomag tartalmát, kivéve a változatlan `.github/` könyvtárat. A `scripts/` és `tests/` könyvtárat viszont frissítsd. A meglévő Safety & Release Check workflow változatlan.

---

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


## v1.8.4 BÉTA – Határidő dátumválasztó asztali böngészőben
A finom mutatós, hover-képes eszközökön a határidő natív dátummezője ismét látható, így a naptár ikon és a dátumválasztó az eredeti böngészős módon használható. Az iPhone/iPad érintős megjelenítése változatlan.
A Google Drive-szinkron és a JSON-adatformátum nem változott.


## v1.8.6 BÉTA – Reliable Sync IV + dátumválasztó
- A v1.8.4 asztali Határidők natív date picker CSS-javítását tartalmazza.
- A sikeres Drive POST után kötelező független GET visszaolvasás; format, szülőazonosítók és rekordok ellenőrzése.
- Visszaolvasási hiba vagy tartalmi eltérés esetén a helyi adatállomány és a közös szinkronalap változatlan marad. Újabb POST nem indul.
- Nem szünteti meg a külön eszközök közti atomi feltöltés hiányát. Automatikus szinkron továbbra is tiltva.
- A `.github/workflows/safety-check.yml` fájlt nem kell módosítani; a tesztmappa új tesztet kapott.


## v1.8.6 BÉTA – Reliable Sync V és asztali dátummező
A PC-s Határidők dátummező a Tankolások és Szerviz natív HTML date mezőjét használja. A speciális, rétegezett dátumkijelzés kizárólag iPhone/iPad eszközön jön létre. A Drive-feltöltés utáni ellenőrzést rövid stabilizációs várakozás és még egy teljes felhőelőzmény-olvasás követi, mielőtt a helyi állapot mentése megtörténne. Ez csökkenti a közel egyidejű feltöltések kockázatát, DE nem teszi atomi műveletté. Az automatikus szinkron kikapcsolva marad.


## v1.8.7 BÉTA – Reliable Sync VI: gyorsított, ellenőrzött előzményolvasás
A 70 mp-es kézi szinkron egyik valószínű oka, hogy az előzmények összes fájlját minden szinkronfázis újra letöltötte. Most a műveleten belül az azonos ID-val, módosítási idővel és mérettel listázott, korábban beolvasott JSON ismételt letöltése elmarad. A Drive fájllistáját minden biztonsági ellenőrzéskor frissen kérjük, és a korábban nem látott vagy változott fájlt visszaolvassuk. A frissen feltöltött fájl önálló tartalmi visszaellenőrzése nem marad el. A késleltetett ellenőrzést és a 1,2 mp-es várakozást megtartjuk, mert másik eszköz új felhőágát csak így van esélyünk észlelni. A szinkron időtartama az adatkezelési panelen megjelenik. A tényleges gyorsulás Drive- és eszközfüggő; nincs garantált idő.
A felhőben létrejövő párhuzamos ágak atomi kezelése továbbra sem garantált. Auto-sync továbbra is tiltott.


## v1.9.0 BÉTA – Reliable Sync VII
- A felhőállapot aláírása most minden ismert Drive-pillanatkép-azonosítóhoz a `modifiedTime` és `size` metaadatot is hozzárendeli. Így a már meglévő fájl módosítását is észlelheti a szinkron véglegesítése előtt.
- A szinkron alatt elkülönülő GET-kérésszám, olvasási újrapróbálás, média-letöltés, gyorsítótár-találat és szakaszidők láthatók. Az adatrekordok és a Google OAuth-token nem kerülnek naplózásra.
- Nem változik az adatséma, az OAuth-folyamat vagy a szinkron pillanatkép formátuma. Az automatikus szinkron kikapcsolva marad.
- Korlát: két független eszköz tökéletesen egyidejű Drive-feltöltése továbbra sem atomi, a feltöltések új felhőágat hozhatnak létre.


## v1.9.0 BÉTA – Ellenőrzött, tartós gyorsítótár
A Google Drive-fájlok minden szinkron előtt újra listázódnak. A már ellenőrzött történeti fájlok tartalma az IndexedDB-ben opcionális gyorsítótárba kerül, és csak azonos Drive ID + módosítási idő + méret + MD5 mellett használható újra. Ha az MD5 hiányzik, új letöltés történik. A hibás vagy tele tárhely nem gátolja az adatok szinkronizálását. A szinkron biztonsági ellenőrzései és a kézi üzemmód megmaradnak. A gyorsítótár nem szerepel a JSON exportban.


## v1.9.0 BÉTA – Reliable Sync IX
Feltöltés után észlelt párhuzamos Drive-felhőágak esetén az alkalmazás egyszer megkísérli az ütközésmentes egyesítést és egy változatlan előzményeket megőrző új, több szülős pillanatképet hoz létre. Azonos rekord eltérő módosításakor / törlés-módosításkor megáll, a helyi adatok változatlanok. Újabb versenyhelyzet esetén nem ismételgeti korlátlanul a feltöltést. A Drive nem támogat itt tranzakciós compare-and-swap-t; teljes egyidejűségi garancia nincs. Auto-sync tiltva.


## v1.9.1 BÉTA – Közös ősök biztonságos kezelése
A több egymással nem összehasonlítható közös ős nem blokkol minden esetet. Azonos szinkronrekordoknál az egyik bázis egyenértékű. Eltérő rekordsorozatoknál a közös gyökér konzervatív összevetési alap; az eltérő közös-ős rekordoknál a végpontok eltérését kötelező felhasználói konfliktusként kérjük feloldani. A többi független módosítás háromutas egyesítéssel kezelhető. Több mint két aktuális felhővégpont ilyen konfliktusánál biztonsági leállás. A Google Drive korábbi pillanatképei megmaradnak.


## v1.9.2 BÉTA – Reliable Sync stabilizáció
- A választható, helyi IndexedDB pillanatkép-cache váratlan olvasási hibája esetén a szinkron továbbra is végrehajtható friss felhőellenőrzéssel. A UI zárolása minden esetben felszabadul.
- Új, futtatható hiba-/ütközés-/helyreállítási regressziós tesztek, amelyek a tényleges függvényeket futtatják szimulált Drive- és IndexedDB-hibákkal.
- Szerveroldali atomi CAS hiányában a két eszköz szándékosan egyidejű feltöltésének biztonsága továbbra sem garantált. Automatikus szinkron változatlanul tiltva.
- A Drive-fájlformátum, a helyi adatmodell és a `.github/workflows/safety-check.yml` változatlan.


## v1.9.3 BÉTA – Felhőelőzmény ellenőrzése és biztonságos diagnosztika
- Új csak olvasó felhőellenőrzés: teljes DAG-validáció, felhőágak száma, helyi közös szinkronalap ellenőrzése.
- Eredmény a Beállítások → Adatkezelés oldalon jelenik meg; a művelet nem végez Drive POST-ot és nem írja át a helyi rekordokat.
- Diagnosztikai összefoglaló másolása: csak szinkronidők, kérésstatisztikák és állapot, személyes autóadatok nélkül.
- A kézi egyesítés, az MD5-ellenőrzött tartós gyorsítótár és az automatikus szinkron tiltása változatlan.


## v1.9.4 BÉTA – Előtérbeli, csak olvasó felhőellenőrzés
Az Adatkezelésben külön aktiválható automatikus felhőelőzmény-ellenőrzés, ha az alkalmazás láthatóvá válik. Legfeljebb ötpercenként próbálkozik, aktív token és internet kell hozzá. Nem indít feltöltést, helyi rekordcserét vagy automatikus Google-engedélyezést. Az automatikus kétirányú szinkron továbbra is tiltott.

## v1.9.5 BÉTA – Felhőváltozás-jelzés
- Opt-in előtéri csak olvasó Drive-előzmény-ellenőrzés továbbra is minimum ötpercenként.
- Az alkalmazás tetején tartós értesítés jelenik meg, ha a korábbi sikeres szinkronalaphoz képest a felhőben eltérő rekordállapot van. Párhuzamos ágak, ismeretlen/eltérő szinkronalap és első szinkron esetén külön üzenet.
- Hiba esetén nem törli a korábbi figyelmeztetést. Sikeres kézi szinkron vagy Google-kijelentkezés törli.
- Nincs automatikus Drive-feltöltés, engedélykérés, rekordmódosítás vagy új adatmodell. A Google Drive tranzakcionális zárolása továbbra sem biztosított.


## v1.9.6 BÉTA – egygombos szinkron a felhőváltozás-jelzésből
- Új felhőadat / párhuzamos ág: a felső értesítésben **Szinkronizálás most**. A gomb az Adatkezelés oldalra navigál, majd a meglévő, egygombos kézi szinkront indítja (lejárt token esetén a szokásos Google-csatlakozással). A biztonsági JSON-figyelmeztetés, ütközéskezelés és jóváhagyás megmarad.
- Eltérő helyi alap / első szinkron: **Adatkezelés megnyitása** – nincs közvetlen szinkronindítás.
- Sem az értesítés, sem a háttérbeli felhőellenőrzés nem indít automatikus feltöltést vagy bejelentkezést. Az automatikus szinkron tiltott.


## v1.9.7 BÉTA – Smart Sync állapotáttekintés
A csak olvasó felhőellenőrzés után külön megjelenik a helyi, utolsó szinkron óta módosult adatkategóriák száma, a távoli felhőállapot és a felhőágak száma. A másolható diagnosztika csak ezeket az összesítő értékeket tartalmazza, nem tartalmaz járműadatokat vagy rekordazonosítókat. A funkció nem indít automatikus szinkront, OAuth-ot vagy feltöltést.


## v1.9.8 BÉTA – V2.0 előtti helyi ellenőrzés

Az Adatkezelés oldal új **Helyi állapotellenőrzés (csak olvasás)** gombja frissen olvassa az IndexedDB-ben elmentett adatállományt. A korábbi ellenőrző szerkezeti hibáit/figyelmeztetéseit darabszámként mutatja, ellenőrzi a szinkronalap adatszerkezetét, és ha elérhető, megjeleníti a böngésző teljes webhelyhez tartozó becsült tárhely-kihasználtságát. Nem módosít adatot, nem indít Drive-kérést vagy szinkront, és nem helyettesíti a külön JSON-mentést.

A szinkronprotokoll, az automatikus szinkron tiltása és a tartós gyorsítótár változatlan.


## v1.9.9 BÉTA – v2.0 előkészítő ellenőrzőjelentés
Az Adatkezelésben új, kizárólag helyi olvasási művelet: mentett IndexedDB szerkezeti ellenőrzése, JSON körút (serializálás és visszaolvasás), helyi szinkronalap szerkezete, PWA service worker és becsült tárhelyhasználat. Másolható technikai jelentés, rekordértékek és azonosítók nélkül. Nem készít tényleges biztonsági mentést és nem ellenőrzi a Drive aktuális állapotát. A szinkronizációs motor és adatséma változatlan.


## v2.1.1 BÉTA – KÍSÉRLETI automatikus szinkron
A v2.0 STABLE kiadástól külön tesztverzió. Alapértelmezett mód: kézi szinkron. Az Adatkezelésben eszközönként, Google-kapcsolat és előzetes sikeres kézi szinkron után, külön figyelmeztetés jóváhagyásával lehet bekapcsolni. Előtérbe kerüléskor kb. 3 mp, helyi mentés után kb. 20 mp késleltetés; csak online és érvényes token mellett. Automatikus újrabejelentkezést nem próbál. Konfliktus, több felhőág, hiba esetén felfüggesztés és kézi ellenőrzés. A Drive NEM ad atomi többkészülékes zárolást: ne engedélyezd egyszerre két készüléken éles adatokkal! Előbb készíts ellenőrizhető külön JSON-exportokat.


## v2.1.1 – Szinkronizáció eredményének megjelenítése
Minden sikeres automatikus és kézi szinkron után a felső státuszban megjelenik a felhőbe és a felhőből átvett rekordváltozások száma, időtartam, időpont. A számítás a szinkron előtti és végleges rekordállapotból történik; új, szerkesztett és törölt rekord egyaránt számít. Az eredmény későbbi lapváltáskor és újraindításkor is látható. A push értesítés továbbra sem része a szerver nélküli kiadásnak.


## v2.1.2 BÉTA – Auto Sync hibatűrés és visszajelzés
A felső státuszsor külön jelzi a pillanatnyi offline helyzetet, a lejárt vagy hiányzó Google-hozzáférést és a sikertelen automatikus szinkront. A sikertelen művelet figyelmeztetése újraindítás után is megmarad; sikeres szinkron törli. Az utolsó sikeres szinkron külön látható, de nem bizonyítja a jelenlegi felhőegyezést. A kézi szinkron és a Drive-adatmodell változatlan.


## v2.1 RC1 – kiadásjelölt
Az RC1 a v2.1.3 BÉTA tesztelt funkcionalitására épül: opcionális automatikus kétirányú szinkron, tartós gyorsítótár, hibajelzés, helyreállítás, ütemezési védelem. A motor és az adatséma változatlan. A külön eszközök közel egyidejű Google Drive-feltöltése továbbra sem tranzakcióbiztos, ezért az automatikus szinkron kísérleti és készülékenként külön kapcsolható.


## v2.1 RC2 – asztali JSON-export javítás
Windows/asztali böngészőn a JSON mentés közvetlen letöltéssel indul; a mobilos megosztás megmarad. Az export státusza nem keveredik a visszaállítással. Visszaállítás előtt továbbra is kötelező külön mentés és a mentés felhasználói megerősítése. A szinkronmotor és az adatséma változatlan.


## v2.3.0 BÉTA – Gördülő átlag és megjelenés
Az Áttekintés fogyasztásdiagramján választható a 3 / 5 / 10 tankolási szakaszos gördülő átlag. A számítás az utolsó N értékelhető szakasz teljes literéből és távolságából történik, nem az egyes százkilométeres értékek számtani átlagából. A felület fejlécében Világos / Sötét / Rendszer szerint mód választható. A beállítások kizárólag helyi localStorage kulcsok, nem részei az IndexedDB járműadatainak és a Drive-szinkronnak.


## v2.3.0 BÉTA – Karbantartási áttekintés
A Szervizfigyelő már meglévő MasterData, járműspecifikus intervallum és szervizelőzmény alapján számolja az esedékességet. Új: állapotjelzés az Áttekintésen, állapotszűrő a Szervizfigyelőben, valamint hiányzó szerviz-alapadatok és kevés tankolási szakasz egyértelmű jelzése. Nincs adatmodell- vagy Drive-protokoll változás.


## v2.4.0 BÉTA – Rekordszűrés, járműarchívum, grafikon tooltip
A keresés mellett dátumtartomány- és kategóriaszűrés; archivált járművek megjelenítése és visszaaktiválása. Áttekintés SVG diagramokon pontos érték egérrel, érintéssel, fókuszban. Az adatséma és a Drive-szinkronprotokoll változatlan.


## v2.6.0 BÉTA – Költségösszehasonlítás és 12 havi trend
- Az Áttekintésen minden jármű (archivált is) összesített költsége és Ft/km mutatója megjelenik a kiválasztott évben vagy összes évre.
- A hiányos kilométeróra-adatokból nem készül megtévesztő Ft/km mutató.
- A kiválasztott járműnél havi és 12 havi gördülő költséggrafikon látható. A teljes 12 havi ablak előtt nincs görbe.
- Az adatmodell, a Drive-szinkron, az automatikus szinkron ütemezése és a .github/workflows/safety-check.yml változatlan.


## v2.6.0 BÉTA – Gumiprofilmérés és DOT
A meglévő DOT mező értelmezése és egy garnitúra rekordjához opcionálisan csatolt, dátumozott négy pozíciós profilmélység-előzmény. Régi rekordokhoz nem kell alapérték, sémaverzió nem változik. Az azonos garnitúrát különböző eszközökön egyidejűleg módosítva a meglévő rekordütközés-védelem lép életbe. A mérések nem helyettesítik a gumik szakszerű állapotfelmérését.


## v2.8.0 BÉTA – PDF autóelőélet
A főmenü új **PDF autóelőélet** oldalán járművenként nyomtatható előnézet készül a szerviz-, tankolási, egyéb költség-, gumigarnitúra- és gumiciklus-bejegyzésekből. A rendszám, VIN, költségek és megjegyzések alapértelmezetten nincsenek benne a megosztható változatban. A **PDF mentése / nyomtatás** a böngésző natív nyomtatási párbeszédablakát indítja: válaszd a PDF-mentést. A kimenet a készüléken készül, offline is működik. Nem igényel külső PDF könyvtárat, Drive engedélyt vagy új adatmodell mezőt.


## v2.8.0 – Mobil PDF és járműfotó
A jármű adatlapon és a riportban egy JPEG formátumra alakított, legfeljebb 95 KB méretű kép menthető. A kép a járműrekord része: a JSON exportba, Drive-szinkronba és annak pillanatkép-előzményeibe is bekerül. A nagyobb tartalmi méret miatt szinkron lassulás lehetséges. Másik eszközön csak frissített v2.8 klienssel szerkeszd.
A PDF offline, böngészőoldali Canvas→JPEG→PDF eljárással készül; iOS-en a megosztási felületből válaszd a Mentés a Fájlokba lehetőséget, Windows alatt a letöltés működik. A PDF nyomtatható és többoldalas; a szöveg képként kerül a PDF-be (nem kijelölhető).


## v2.9.0 BÉTA – PDF és UI finomítások
A PDF készítője az oldaltörések előtt összeszámolja a szakaszcím, oszlopfejléc és táblázatsorok várható magasságát. Egy teljesen elférő táblázatot nem bont oldalakra, hosszabb táblázatnál pedig az oszlopfejlécet megismétli. A szakaszcím az első rekordokkal együtt marad. A felület a billentyűzetfókuszt, vezérlőméretet, státuszok tördelését, PDF-beállításokat és sötét módot egységesíti. Nincs adatmodell- vagy szinkronprotokoll-módosítás.


## v2.10.1 BÉTA – Mobile Navigation & Appearance
Mobil menü bal/jobb oldal választással; hamburgergomb a választott oldalon. Megjelenés a Beállítások részen, helyi színséma és sűrűség. iOS natív dátummezők szélességvédelme. Szinkron és adatséma változatlan.


## v2.10.1 BÉTA – Mobil hotfix
A Járművek űrlapon az iOS dátummező kereten belüli kijelzést és natív dátumválasztót kap. A mobilmenü a kiválasztott képernyőszél felől behúzható és visszasöpörhető; a hamburgergomb és a menüoldal választása változatlanul működik. Az adatséma és a szinkronmotor változatlan.
