# CarExpense Tracker v1.1.0 BÉTA

A v1.0.2-re épülő, kompatibilis frissítés.

## Újdonságok
- JSON biztonsági mentésnél iOS-en a rendszer megosztási lapja nyílik meg, ahol a „Mentés a Fájlokba” opció választható. Ha ez nem támogatott, hagyományos letöltés indul.
- Az importfolyamat megvárja a mentési művelet lezárását, és megszakításkor nem importál.
- A szinkronizáció ellenőrzi, hogy közben nem változott-e a helyi adatállomány.
- A felületen egyértelműen szerepel, hogy a háttérszinkron még nincs bekapcsolva.

## Fontos korlát
A két készülék pontosan egyidejű felhőírása továbbra sem teljesen védett. Egyelőre kézzel, egymás után szinkronizálj. Az automatikus szinkronizáció bevezetéséhez felhőoldali ütközésbiztos írási protokoll szükséges.

## Telepítés
A ZIP teljes tartalmát töltsd fel a GitHub Pages repository gyökerébe, megtartva az icons mappát. A felhasználói adatok helyben, az IndexedDB-ben maradnak.
