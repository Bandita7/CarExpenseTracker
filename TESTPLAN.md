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


## v1.8.9 – Összevont teszt
1. Külön JSON export mindkét készüléken, v1.8.9 frissítés, GitHub Actions zöld.
2. iPad: módosíts egy teszthatáridőt, kézi szinkron; iPhone: utána kézi szinkron. Ellenőrizd az adatokat.
3. Egy újabb szinkron módosítás nélkül: ellenőrizd az időt és a GET/gyorsítótár értékeket.
4. Egyetlen készüléken: az üzenet ne jelenítsen meg rendszámot, rekordadatot vagy tokent.
5. Ne indíts valóban egyidejű feltöltést éles adatokkal; nincs tranzakciószintű zárolás.


## v1.8.9 BÉTA – Ellenőrzött, tartós gyorsítótár
1. Első szinkron (hideg cache): várhatóan a korábbihoz hasonló idő. 2. Második, változatlan szinkron: a GET és a média letöltésszám várhatóan jelentősen csökken. 3. iPad módosítás → iPhone szinkron: friss fájl letöltése és helyes merge. 4. Újraindítás után ellenőrizzük a gyorsítótár megmaradását. 5. Hibás/módosult/MD5 nélküli fájl nem használhatja a korábbi gyorsítótárat. Minden teszt előtt készíts külön JSON mentést.
