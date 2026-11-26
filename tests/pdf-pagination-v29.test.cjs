'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const pdf=html.split('function makeHistoryPdf(')[1].split('function saveHistoryPdf(')[0];
test('Szakaszmagasság előzetes számítása és teljes táblázat egyben tartása',()=>{
 assert.match(pdf,/const fullHeight=headingSize\+headMetrics\.height/);
 assert.match(pdf,/if\(fullHeight<=usable && y\+fullHeight>bottom\)newPage\(\)/);
});
test('Cím, oszlopfejléc, legalább két első rekord egyben marad',()=>{
 assert.match(pdf,/const minRows=Math\.min\(2,bodyMetrics\.length\)/);
 assert.match(pdf,/else if\(y\+minHeight>bottom\)newPage\(\)/);
});
test('Folytatódó táblázatnál oszlopfejléc ismétlődik',()=>{
 assert.match(pdf,/if\(y\+current\.height>bottom\)\{newPage\(\);drawRow\(headMetrics,true\)\}/);
});
test('Mobil PDF megosztás és asztali letöltés megmarad',()=>{
 assert.match(html,/navigator\.share\(\{files:/);
 assert.match(html,/saveHistoryPdf\(blob,filename\)/);
});
test('Világos/sötét mód és akadálymentes fókusz megmarad',()=>{
 assert.match(html,/html\[data-theme="dark"\] \.report-ui/);
 assert.match(html,/button:focus-visible/);
});
