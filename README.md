# CarExpense Tracker v1.3.1 – PWA frissítési javítás

A v1.3.0 szinkronizációs funkciói változatlanok.

- Service worker már nem hív skipWaiting-et telepítéskor; a felhasználó aktiválhatja a várakozó frissítést.
- Frissítés után újratöltés controllerchange esetén és iOS tartalék ellenőrzéssel.
- Kézi frissítésellenőrzés újratöltéssel akkor is, ha már nincs várakozó worker.
- Navigáció hálózati frissítése cache:no-store móddal.
- IndexedDB-t nem töröl és nem módosít.

A már beragadt 1.2.1 verzióból az új service worker aktiválásához esetleg két megnyitás szükséges. Ne töröld a PWA-t; szükség esetén Safari-ban nyisd meg a GitHub Pages címet, majd térj vissza a kezdőképernyős apphoz.
