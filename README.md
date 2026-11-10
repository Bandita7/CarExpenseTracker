# CarExpense Tracker v1.4.0 BÉTA

## Változások
- Automatikus szinkronizáció ütközéskor **tartósan szünetel** ezen az eszközön (localStorage); sikeres kézi szinkronizáció oldja fel.
- Látható figyelmeztetés az Adatkezelés panelen.
- Pontosabb helyi változásjelzés: nem állítja, hogy a felhő biztosan naprakész.
- Súgó frissítve; új szinkronizációs, PWA-frissítési, verziótörténeti és névjegy fejezetek.
- Korábbi v1.3.1 PWA-frissítési javítás megmaradt.

## Korlátozás
A Google Drive pillanatképekhez nincs tranzakcionális szerveroldali zárolás; pontosan egyidejű két feltöltésnél továbbra is lehet versenyhelyzet. Az automatikus mód ezért béta. A külön JSON-mentések továbbra is szükségesek.

## Teszt
1. JSON-mentés mindkét eszközön.
2. GitHub Pages frissítés a teljes ZIP-tartalommal; ne telepítsd újra a PWA-t.
3. Súgó új témák és verzió ellenőrzése.
4. Ütközéses teszt: kézi alapállapot, két külön módosítás, majd automatikus szinkron. Ellenőrizd a szüneteltetést; utána kézi feloldást.
