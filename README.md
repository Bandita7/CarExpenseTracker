# CarExpense Tracker PWA v0.8.2

Telepítés GitHub Pages-re: töltsd fel a ZIP tartalmát a repository gyökerébe. Settings → Pages → Deploy from a branch → main / (root) → Save.

Az alkalmazás helyi IndexedDB-t használ. **Ne tölts fel személyes JSON-mentést a nyilvános repositoryba!** Az adatok nem szinkronizálódnak eszközök között. iOS-en Safari → Megosztás → Hozzáadás a főképernyőhöz. Első alkalommal online kell megnyitni.

Offline használat: a telepítés után a service worker az alkalmazás fájljait gyorsítótárazza; az adatok külön a böngésző helyi adatbázisában maradnak. Rendszeres JSON export ajánlott.
