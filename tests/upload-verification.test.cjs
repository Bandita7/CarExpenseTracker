// v1.8.5 – Tests the real readback implementation extracted from index.html.
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const a=html.indexOf('async function syncVerifyUploadedSnapshot('),b=html.indexOf('async function syncUpload(',a);
assert(a>0&&b>a,'verification helper missing');
const source=html.slice(a,b);
function run(loaded,fail){
 let reads=0;
 const ctx={encodeURIComponent,Error,Promise,driveFetch:async()=>{reads++;if(fail)throw Error('Hálózat megszakadt');return {json:async()=>loaded}},syncCompare:(a,b)=>JSON.stringify(a)===JSON.stringify(b),syncSameRecords:(a,b)=>JSON.stringify(a)===JSON.stringify(b),validateBackup:x=>{if(!x||x.schemaVersion!==2)throw Error('Rossz adat');return x}};
 vm.createContext(ctx);vm.runInContext(source,ctx);
 return {check:(id,parents,data)=>vm.runInContext('syncVerifyUploadedSnapshot',ctx)(id,parents,data),reads:()=>reads};
}
const data={schemaVersion:2,vehicles:[{id:'one'}]};
test('Ellenőrzött feltöltés: egyező rekordok és szülők',async()=>{const h=run({format:'carexpense-sync-v2',parents:['a'],data});assert.equal(await h.check('file',['a'],data),true);assert.equal(h.reads(),1)});
test('Eltérő rekordoknál elutasítás',async()=>{const h=run({format:'carexpense-sync-v2',parents:['a'],data:{schemaVersion:2,vehicles:[{id:'other'}]}});await assert.rejects(h.check('file',['a'],data),/eltér/)});
test('Eltérő szülőnél elutasítás',async()=>{const h=run({format:'carexpense-sync-v2',parents:['b'],data});await assert.rejects(h.check('file',['a'],data),/eltér/)});
test('Hibás formátumnál elutasítás',async()=>{const h=run({format:'invalid',parents:['a'],data});await assert.rejects(h.check('file',['a'],data),/eltér/)});
test('GET hálózati hibánál elutasítás',async()=>{const h=run(null,true);await assert.rejects(h.check('file',['a'],data),/Hálózat/);assert.equal(h.reads(),1)});
test('Üres azonosítónál nem küld kérést',async()=>{const h=run({format:'carexpense-sync-v2',parents:[],data});await assert.rejects(h.check('',[],data),/azonosító/);assert.equal(h.reads(),0)});
test('A feltöltés csak pozitív visszaellenőrzés után tér vissza',()=>{
 const segment=html.slice(html.indexOf('async function syncUpload('),html.indexOf('async function syncDiagnostic('));
 assert.match(segment,/if\(postedId\)\{[\s\S]*await syncVerifyUploadedSnapshot\(postedId,parents,snapshot\)[\s\S]*return postedId/);
 assert.match(segment,/Nem történt újabb feltöltés/);
});
