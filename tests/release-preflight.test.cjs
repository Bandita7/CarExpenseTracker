'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const src=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
test('előellenőrzés és jelentésmásolás elérhető',()=>{
 assert.match(src,/toolButton\('v2\.0 előkészítő ellenőrzés',releasePreflightCheck\)/);
 assert.match(src,/toolButton\('Ellenőrzőjelentés másolása',releasePreflightCopy\)/);
 assert.match(src,/id="release-preflight-result"/);
});
test('a preflight nem módosít adatot és külön kezeli a tényleges mentést',()=>{
 const code=src.split('async function releasePreflightCheck(){')[1]?.split('async function releasePreflightCopy(){')[0];
 assert.ok(code);
 assert.match(code,/await read\(\)/);
 assert.match(code,/JSON-körút ellenőrzés/);
 assert.match(code,/syncBaseRead\(\)/);
 assert.match(code,/nem ellenőrzi a külső mentés létezését/);
 for(const forbidden of ['syncNow(', 'driveSave(', 'restoreCommit(', 'persist(', 'syncBaseWrite(', 'store.put(', 'driveFetch(']){
  assert.ok(!code.includes(forbidden),'Nem megengedett módosító művelet: '+forbidden);
 }
});
test('nem közöl rekordértékeket vagy azonosítókat a preflight szövegben',()=>{
 const code=src.split('async function releasePreflightCheck(){')[1]?.split('async function releasePreflightCopy(){')[0];
 assert.ok(code);
 assert.ok(!code.includes('JSON.stringify(saved,null'));
 assert.ok(!code.includes('vehicleId'));
 assert.ok(!code.includes('access_token'));
});
