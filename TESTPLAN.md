# v2.1.3 – célzott tesztek

1. Két eszköz JSON-mentése, azonos kiinduló állapot.
2. Az egyik készüléken rövid időn belül több helyi tesztrekord mentése: az utolsó módosítás se maradjon feltöltetlen.
3. Mentés szinkronizáció közben: az aktuális szinkron vége után induljon egy új ellenőrzés, amennyiben a Google-kapcsolat érvényes.
4. Hiba vagy konfliktus esetén automatikus szüneteltetés, nincs ismétlődő feltöltés.
5. iPad/iPhone oda-vissza szinkron és státusz ellenőrzése.

# v2.0 STABLE – kiadásjelölt tesztmátrix

A teljes, eredeti TESTPLAN a dokumentum végén megmaradt. **Éles használat előtt legyen külön ellenőrzött JSON-mentés mindkét iOS-eszközön.**

| Terület | Eszköz | Elvárt eredmény |
|---|---|---|
| Verzió és PWA | PC/iPhone/iPad | v2.0 STABLE cím, fejléc, Névjegy, Súgó, verziótörténet, frissülő service worker |
| Indítás offline | iPhone/iPad | Korábban betöltött PWA indul és a helyi rekordok látszanak |
| Alapadatok | PC | Több jármű váltható, és az adott jármű tankolása, szervize, határidői, gumik és költségei látszanak |
| Dátumválasztók | PC/iPhone/iPad | Határidő, tankolás és szerviz dátummezői működnek; PC-n látszik a naptár ikon |
| Mentés | iPhone/iPad | JSON-export mentésének ellenőrzése; a fájl megvan, visszaolvasható |
| Import (csak tesztadat) | elkülönített böngészőprofil | előnézet, figyelmeztetés és megerősítés; rekordok nem tűnnek el |
| Lokális állapotellenőrzés | iPhone/iPad | hibák száma látható, rekordok nem változnak, offline is fut |
| Felhőelőzmény-ellenőrzés | iPhone/iPad | csak olvasás, új pillanatkép nem jön létre |
| Manuális szinkron | iPad → iPhone | változtatás mindkét eszközön megjelenik, adatok és gyorsítótár megmaradnak |
| Eltérő helyi módosítások | iPad és iPhone | két külön tesztrekord egymás utáni szinkronnal egyesül |
| Ütközési eset | csak elkülönített tesztadatok | eltérő azonos rekordnál nincs csendes felülírás |
| Felhőváltozás banner | iPhone/iPad | csak olvasó figyelés és kézzel indítható szinkron működik |
| Kiadás-ellenőrzés | GitHub Actions | Safety & Release Check zöld |

**Nem tesztelendő éles adatokon:** párhuzamos, pontosan egyidejű feltöltés; hibás JSON felülíró importja; webhelyadatok törlése. Az RC1 csak a készülékes ellenőrzések után válhat STABLE kiadássá.

---

# CarExpense Tracker v1.7.8 – kézi tesztterv

A tesztek az új funkciók helyett a meglévő adatbiztonsági műveleteket ellenőrzik. Nem kell minden tesztet ugyanazon a napon elvégezni.

## Előkészítés

1. Külön, ellenőrzött JSON-mentés iPhone-on és iPaden; a fájlok maradjanak a készüléken kívül is.
2. Minden szinkronizáló eszközön legalább v1.7.7; az új tesztkörhöz v1.7.8.
3. Automatikus szinkron tiltva. **Ne töröld a böngésző/PWA helyi adatait.**
4. Kizárólag könnyen felismerhető teszthatáridőkkel dolgozz.

## A – nem romolhat el a már működő folyamat

- [ ] Frissítés után fejléc, Névjegy és Verziótörténet egyaránt v1.7.8.
- [ ] A Határidők dátummezője iPaden üresen és kitöltve használható.
- [ ] Beállítások → Adatállomány ellenőrzése: nincs blokkoló hiba.
- [ ] iPhone és iPad egymás után kézi szinkronizál: sikeres.
- [ ] Két külön teszthatáridő oda-vissza megjelenik, törölt közös teszthatáridő nem tér vissza.

## B – biztonságos visszaállítás ellenőrzése (csak tudatosan)

- [ ] Friss JSON-mentés és helyi teszthatáridő megléte ellenőrizve.
- [ ] Az Adatkezelés → Szinkron előtti állapot gomb megmutatja az előző helyi állapot előnézetét, ha van ilyen pont.
- [ ] **Mégse** választással a helyi adatok változatlanok.
- [ ] A tényleges helyreállítás csak külön, saját mentésből biztonságosan megismételhető tesztkörnyezetben próbálandó; utána újra kézi szinkron szükséges.

## C – hibás hálózat és szinkron

- [ ] Kézi szinkron előtt a kapcsolat engedélyezése és a Drive elérhetősége ellenőrizve.
- [ ] Ha a hálózat megszakad: hibaüzenet és a helyi adatok megmaradása ellenőrizhető.
- [ ] Hibajelzés után **ne** indíts azonnal másik eszközről feltöltést. Először állítsd helyre a hálózatot, majd új kézi szinkronnal ellenőrizd az előzményeket.
- [ ] Elágazás vagy ütközés esetén a felhasználó döntése nélkül ne történjen felülírás.

## Biztonsági korlát

A Google Drive API szinkronfájlok létrehozása nem atomi művelet. A v1.7.8 nem oldja meg a teljesen egyidejű feltöltések szerveroldali zárolását. Az automatikus szinkron továbbra is letiltott. Az egyidejű, szándékosan provokált feltöltést ne végezd éles adatokon.

## Fejlesztői tesztek (Node.js 20+)

```
node scripts/release-check.cjs
node --test tests/*.test.cjs
```

A repo `.github/workflows/safety-check.yml` fájlja GitHub Actions-ben ugyanezeket futtatja a `main` ágra küldött commit után. Ez **nem** garantálja, hogy GitHub Pages csak sikeres teszt esetén publikál; a repo Pages/branch protection beállításaitól függ.


## v1.8.1 kézi ellenőrzés
1. Készíts friss JSON mentést iPhone-on és iPaden.
2. Token lejárata után a Beállítások → Adatkezelés → Google-csatlakozás és szinkronizálás gombra kattints.
3. Google-kapcsolat esetleges engedélyezése után ellenőrizd a kézi szinkron megerősítését.
4. Siker esetén ismét kattintva érvényes tokennel sima Szinkronizálás most szerepeljen.
5. Offline vagy Google-hiba esetén ne legyen feltöltés és ne módosuljanak a helyi rekordok.
6. Automatikus szinkron maradjon tiltva.


## v1.8.2 célzott készülékes próba
1. Készíts helyi JSON-mentést mindkét eszközön.
2. Kézi szinkron iPhone-on, majd iPaden; változatlan adatoknál nincs új feltöltés.
3. iPhone-on egy új teszthatáridő mentése, kézi szinkron, majd iPaden kézi szinkron: a rekord megmarad.
4. Érvénytelen/lejárt Google-kapcsolat esetén egygombos csatlakozás és szinkron teszt.
5. A feltöltés közbeni hálózatvesztést csak kontrollált tesztadatokkal és külön JSON-mentés után próbáljuk; ha bizonytalan, újabb POST nélkül ellenőrzi a fájlt.


## v1.8.3 ellenőrzés

1. Friss JSON export mindkét eszközön.
2. A v1.8.3 frissítése után normál kézi szinkron iPhone-on, majd iPaden; mindkettőn nincs különbség.
3. Egyik eszközön hozz létre tesztadatot, majd egymás után szinkronizálj; a másikon jelenjen meg.
4. PC-n (ha a Drive nem blokkolt), két külön lapon indított szinkronnál a második, átfedő kérés Web Locks API-t támogató böngészőben „már folyamatban” figyelmeztetést kapjon.
5. GitHub Actions: Safety & Release Check zöld.
**Ne tesztelj szándékosan egyidejű, külön eszközös feltöltést éles adatokkal.**


## v1.8.4 célzott kézi próba
1. Asztali Chrome/Edge: Határidők > Új rekord > Esedékesség mező. Jelenjen meg a natív naptár ikon, kattintással nyíljon a naptár, dátumválasztás után lehessen menteni.
2. Asztali meglévő határidő szerkesztése: a dátum legyen módosítható.
3. iPad/iPhone: üres és kitöltött határidő dátummező továbbra is egységes magasságú és a natív rendszer dátumválasztója nyíljon.
4. Ellenőrzés: minden más űrlap és kézi szinkron változatlan.


## v1.8.5 célzott tesztek
1. Friss JSON-mentés készítése mindkét készüléken.
2. Kiadásfrissítés és GitHub Safety & Release Check ellenőrzése.
3. Windows/asztali böngésző: Határidők → Új rekord → natív naptárválasztó megnyitása és dátum mentése.
4. iPhone és iPad: kézi szinkron egymás után, majd rekordegyezés.
5. Üres változásokkal ismételt kézi szinkron – ne keletkezzen felesleges új pillanatkép.
6. Hálózati bontást és versenyhelyzetet éles adatokon ne kényszeríts ki.


## v1.8.6 próbák
1. PC (Chrome/Edge) > Határidők > Új és Szerkesztés: a dátummezőben legyen natív naptár ikon és kattintásra nyíljon a dátumválasztó.
2. iPhone/iPad > Határidők: a bevált egységes magasságú mező és natív rendszer-dátumválasztó megmarad.
3. iPhone-on kézi szinkron, majd iPaden kézi szinkron: a rekordok maradjanak meg. Az új, rövid várakozás normális.
4. GitHub Safety & Release Check legyen zöld; `.github` változatlan.


## v1.8.7 BÉTA összevont teszt
- Először készíts külön JSON-mentést.
- Egyforma v1.8.7 legyen minden eszközön; kézi sync egymás után.
- Mérj 2 ismételt szinkront adatváltozás nélkül PC-n/iPad-en, majd egy új határidő felvitelekor. Az idők a Drive-panelen is megjelennek.
- A korábbi 70 mp-hez hasonlítsd a mért időket, de hálózati ingadozást is vegyél figyelembe.
- Másik készüléken hozott teszthatáridő szinkron után látszódjon; törlés is maradjon törölve.
- A v1.8.6-os PC-s dátumválasztó és iOS-megjelenítés maradjon jó.
- Futtasd a GitHub Actions Safety & Release Check-et, `.github` módosítás nem szükséges.


## v1.9.0 – Összevont teszt
1. Külön JSON export mindkét készüléken, v1.9.0 frissítés, GitHub Actions zöld.
2. iPad: módosíts egy teszthatáridőt, kézi szinkron; iPhone: utána kézi szinkron. Ellenőrizd az adatokat.
3. Egy újabb szinkron módosítás nélkül: ellenőrizd az időt és a GET/gyorsítótár értékeket.
4. Egyetlen készüléken: az üzenet ne jelenítsen meg rendszámot, rekordadatot vagy tokent.
5. Ne indíts valóban egyidejű feltöltést éles adatokkal; nincs tranzakciószintű zárolás.


## v1.9.0 BÉTA – Ellenőrzött, tartós gyorsítótár
1. Első szinkron (hideg cache): várhatóan a korábbihoz hasonló idő. 2. Második, változatlan szinkron: a GET és a média letöltésszám várhatóan jelentősen csökken. 3. iPad módosítás → iPhone szinkron: friss fájl letöltése és helyes merge. 4. Újraindítás után ellenőrizzük a gyorsítótár megmaradását. 5. Hibás/módosult/MD5 nélküli fájl nem használhatja a korábbi gyorsítótárat. Minden teszt előtt készíts külön JSON mentést.


## v1.9.0 – célzott próbák
- Két eszköz eltérő rekordokat módosít, egymás után szinkronizál: mindkét változás megmarad.
- Két felhőág ütközés nélkül: új közös, több szülős pillanatkép keletkezhet.
- Ugyanazon rekord két eltérő módosítása, illetve törlés–módosítás: felhasználói döntés kell.
- Feltöltés közben újabb harmadik ág: biztonsági leállítás; nincs végtelen feltöltési ciklus.
- Tartós cache sebessége továbbra is ellenőrzendő.
- Valódi egyidejű tesztet csak tesztadatokkal és mindkét eszközön külön JSON-mentéssel végezz.


## v1.9.1 kézi tesztek
1. iPaden és iPhone-on külön JSON-export ellenőrzése.
2. Javított verzió feltelepítése mindkét eszközre.
3. Először csak az egyik eszközön kézi szinkron, felhőágak megjelenésekor a feloldás ellenőrzése.
4. Csak siker után második eszköz szinkronja. Ellenőrizni mindkét tesztrekordot.
5. Egyidejű szinkron továbbra se induljon, és auto-sync letiltva maradjon.


## v1.9.2 – stabilizációs kézi próba
1. Külön JSON biztonsági mentés iPaden és iPhone-on, v1.9.2 telepítése mindkét eszközre.
2. Módosítás nélküli szinkron az első eszközön, teljes befejezés után a másodikon. Ellenőrizd a gyorsítótár miatti sebességet.
3. Egyik eszközön új tesztrekord, másikon eltérő tesztrekord; a két szinkron egymás után. Mindkét rekord legyen mindkét eszközön.
4. Megszakított Drive-kapcsolatot csak tesztadatokkal próbálj, ne a tényleges feltöltés pillanatában. Hiba után a szinkrongomb újra használható legyen; helyi rekord ne tűnjön el.
5. Ugyanazon tesztrekord két változata, illetve törlés–módosítás ütközés: ne történjen csendes felülírás; csak érthető felhasználói választás.
6. A GitHub Actions zöld; automatikus szinkron marad kikapcsolva.


## v1.9.3 – Kibővített kézi teszt
1. JSON-mentés iPaden és iPhone-on, új verzió ellenőrzése.
2. Google-csatlakozás, majd a Felhőelőzmény ellenőrzése (csak olvasás) gomb: a pillanatképszám, az ágak száma és a helyi alap állapota megjelenik.
3. Ellenőrizd, hogy a felhőellenőrzés NEM készít új felhőpillanatképet és nem módosítja a helyi rekordokat.
4. Diagnosztika másolása: az eredmény tartalmazza az időt és az ágak számát, de ne tartalmazzon rendszámot, autónevet, Google azonosítót vagy tokenadatot.
5. Egy normál kézi szinkron mindkét eszközön, majd ismételt gyors szinkron.
6. Két külön jármű eltérő rekordjait egymás utáni szinkronok egyesítsék. A szándékos párhuzamos feltöltést éles adatokkal ne teszteld.


## v1.9.4 célzott teszt
1. A szinkron sikeres kézi ellenőrzése után kapcsold be a külön 'Felhőellenőrzés automatikusan' opciót.
2. Válts másik alkalmazásra, majd térj vissza. Érvényes Google-token és online állapot mellett ellenőrizd a csak olvasó eredményt.
3. A vizsgálat NEM hozhat létre Drive-pillanatképet és NEM változtathatja a helyi járműrekordokat.
4. Ismételd meg öt percen belül: ne fusson újra.
5. Google-token nélkül vagy offline ne jelenjen meg OAuth ablak, és ne induljon felhőművelet.
6. Kikapcsolva ne induljon automatikus vizsgálat, a kézi szinkron változatlan maradjon.

## v1.9.5 – Eszközös teszt
1. JSON-mentés mindkét eszközön, majd frissítés. `.github` mappa változatlan.
2. Kapcsold be a csak olvasó előtéri felhőfigyelést mindkét eszközön, érvényes Google-kapcsolattal.
3. iPaden hozz létre egy tesztrekordot és kézzel szinkronizáld. iPhone-on öt perc elteltével vagy újbóli előtérbe hozáskor ellenőrizd az alkalmazás tetején az új felhőváltozás-jelzést.
4. A jelzés NEM módosíthatja az iPhone rekordjait; kézi szinkron után jelenjen meg a tesztrekord és tűnjön el a jelzés.
5. Lejárt token mellett nem nyílhat automatikusan Google engedélykérő. Offline esetben sem módosulhatnak rekordok.
6. Ellenőrizd, hogy az iPad/iPhone egymás utáni kézi szinkronja továbbra is működik.


## v1.9.6 kézi ellenőrzés
1. Mindkét eszközön készíts JSON-mentést, v1.9.6 telepítés és Actions zöld.
2. Egyik készüléken új tesztrekord + kézi szinkron. Másik készüléken a felhőellenőrzés jelzése után a banner Szinkronizálás most gombjára kattints. Ellenőrizd, hogy az Adatkezelésre visz, majd a szokásos JSON-figyelmeztetés / Google-csatlakozás után szinkronizál.
3. Sikeres szinkron után a banner eltűnik, a rekord átkerült.
4. Ellenőrizd, hogy az Adatkezelés saját Szinkronizálás most gombja tovább működik; lejárt Google-token esetén sem indul automatikus OAuth-folyamat a háttérből.
5. Ha csak figyelmeztetés / első szinkron állapot látszik, a felső gomb kizárólag az Adatkezelést nyithatja meg.


## v1.9.7 BÉTA – kézi teszt
1. JSON-mentés mindkét eszközön. GitHub Actions legyen zöld.
2. Beállítások → Adatkezelés → Felhőelőzmény ellenőrzése (csak olvasás). Látható a helyi és felhőállapot-áttekintés.
3. Helyi tesztrekord létrehozása után újabb csak olvasó ellenőrzés: pozitív módosított adatkategóriaszám, feltöltés nélkül.
4. Kézi szinkron iPad, utána iPhone; adatok megmaradnak.
5. Sikeres kézi szinkron után ismételt csak olvasó ellenőrzés: 0 helyi módosított kategória.
6. Diagnosztika másolása: nincs benne rendszám, járműadat, Drive ID vagy token.


## v1.9.8 célzott ellenőrzés

1. Készíts friss, külön megőrzött JSON-mentést mindkét eszközön.
2. GitHub Actions: Safety & Release Check zöld.
3. Adatkezelés → Helyi állapotellenőrzés (csak olvasás): helyi adatállomány szerkezete, hibák/figyelmeztetések száma és szinkronalap látható.
4. Kapcsolat nélküli módban is lehessen futtatni, és ne induljon Drive-kérés.
5. Új rekord mentése után az ellenőrzés ismét lefut; a rekord nem változik, nem tűnik el.
6. iPad majd iPhone kézi szinkron, ellenőrzés és diagnosztika a korábbi módon.
7. Éles adatokon ne kezdeményezz egyszerre feltöltést több eszközről.


## v1.9.9 kiadási próbák
1. Beállítások → Adatkezelés → v2.0 előkészítő ellenőrzés: megjelenik az összesített jelentés, személyes rekordadatok nélkül.
2. Ellenőrzőjelentés másolása: a vágólapra ugyanaz a szöveg kerül; hiba esetén a felület tájékoztat.
3. JSON biztonsági mentés továbbra is külön, kézi művelet.
4. iPhone/iPad: kézi szinkron egymás után; az automatikus szinkron nem kapcsolható be.
5. Gyári és meglévő állományban az ellenőrzés semmit nem ír át.


## v2.0 STABLE – kiadás utáni füstteszt
1. Telepítés után ellenőrizd a v2.0 STABLE feliratot, a GitHub Actions zöld eredményét és a frissített service worker működését.
2. Offline nyisd meg az alkalmazást; ellenőrizd a meglévő járműadatokat.
3. Nyisd meg és használd a Határidők natív naptárválasztóját PC-n, az iPhone/iPad megjelenést is ellenőrizd.
4. Készíts külön JSON-mentést minden használt eszközön.
5. Kézi Drive-szinkronizáció iPad -> iPhone, majd vissza, egymást követően; ellenőrizd, hogy egy tesztrekord megmarad.
6. Az automatikus feltöltés maradjon kikapcsolva.


## v2.1.1 BÉTA – KÍSÉRLETI automatikus szinkron
A v2.0 STABLE kiadástól külön tesztverzió. Alapértelmezett mód: kézi szinkron. Az Adatkezelésben eszközönként, Google-kapcsolat és előzetes sikeres kézi szinkron után, külön figyelmeztetés jóváhagyásával lehet bekapcsolni. Előtérbe kerüléskor kb. 3 mp, helyi mentés után kb. 20 mp késleltetés; csak online és érvényes token mellett. Automatikus újrabejelentkezést nem próbál. Konfliktus, több felhőág, hiba esetén felfüggesztés és kézi ellenőrzés. A Drive NEM ad atomi többkészülékes zárolást: ne engedélyezd egyszerre két készüléken éles adatokkal! Előbb készíts ellenőrizhető külön JSON-exportokat.


## v2.1.1 – Szinkronizáció eredményének megjelenítése
1. iPaden módosíts egy határidőt; az automatikus szinkron után a felső állapotban legalább 1 feltöltött rekordot kell látnod.
2. iPhone-on előtérbe lépve a szinkron után legalább 1 letöltött rekord jelenjen meg.
3. Módosítás nélküli új szinkron: 0 / 0.
4. Helyi rekord törlésének átvételét és külön rekordok módosítását is ellenőrizd.
5. Navigálj másik menüpontra, majd indítsd újra a PWA-t: a legutóbbi sikeres szinkronjelzés maradjon látható.
6. Google-token lejárta vagy hiba esetén nem szabad hamis új sikert kijelezni.


## v2.1.2 célzott teszt
1. Offline mentés automatikus móddal: jelenjen meg a feltöltésre váró változás; a helyi rekord maradjon meg.
2. Lejárt Google-hozzáférés: látható újracsatlakozási figyelmeztetés, automatikus OAuth-ablak nélkül.
3. Sikertelen automatikus szinkron: a hiba maradjon látható; az előző siker ne tűnjön az aktuális művelet eredményének.
4. Sikeres kézi feloldás után: hiba törlődik; a sikeres rekord-darabszámok megmaradnak.
5. iPad/iPhone közötti szokásos kétirányú teszt.


## v2.1 RC1 – készülékes tesztmátrix
1. Külön JSON-mentés iPhone-ról és iPadről, ellenőrzött exportfájlokkal.
2. Verziócímke v2.1 RC1; GitHub Actions teljesen zöld.
3. Kétirányú automatikus szinkron külön, egymás utáni tesztmódosításokkal.
4. Gyorsan egymás után létrehozott módosítások mind megjelennek a másik eszközön.
5. Offline szerkesztés, hálózat visszakapcsolása, státuszüzenetek.
6. Lejárt Google-token: nincs felugró bejelentkezés, kézi újracsatlakozás után szinkron.
7. Ütközés: automatikus próba megáll, helyi adatok megmaradnak.
8. PWA offline újranyitás, PC dátummező, JSON export/import ellenőrzése.
