"use strict";
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const section=html.split('async function localStabilityCheck(){')[1]?.split('async function showCurrentAudit(){')[0];
test('local stability check exists and is linked to settings',()=>{
 assert.ok(section);assert.match(html,/toolButton\('Helyi állapotellenőrzés \(csak olvasás\)',localStabilityCheck\)/);
 assert.match(html,/id="local-stability-result"/);
});
test('stability check re-reads IndexedDB and audits local state and base',()=>{
 assert.match(section,/const saved=await read\(\)/);
 assert.match(section,/inspectBackup\(saved\)/);
 assert.match(section,/await syncBaseRead\(\)/);
 assert.match(section,/inspectBackup\(base\.snapshot\)/);
});
test('stability check cannot write local data or call Drive',()=>{
 for(const forbidden of ['persist(', 'syncCommitLocal(', 'driveFetch(', 'syncNow(', 'driveSave(', 'syncBaseWrite(', 'restoreCommit(', 'store.put(', 'store.delete(']){
  assert.ok(!section.includes(forbidden),forbidden);
 }
});
test('stability check reports uncertainty without claiming cloud verification',()=>{
 assert.match(section,/nem ellenőrzi a Drive aktuális tartalmát/);
 assert.match(section,/Őrizz meg külön JSON-mentést/);
 assert.match(section,/storage\?\.estimate/);
});
