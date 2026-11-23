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
