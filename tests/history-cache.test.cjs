'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const a=html.indexOf('async function syncLoadHistory('),b=html.indexOf('function syncMergeCloudHeads(',a);
assert(a>0&&b>a,'cannot find history function');
const src=html.slice(a,b);
const payload=(parents=[],marker='a')=>({format:'carexpense-sync-v2',parents,data:{schemaVersion:2,vehicles:[{id:marker}]}});
const meta=(id,modifiedTime='2026-11-23T18:00:00Z',size='123')=>({id,name:`CarExpense_sync_${id}.json`,createdTime:'2026-11-23T18:00:00Z',modifiedTime,size});
function harness(table){let reads=0;const ctx={Map,Set,Error,validateBackup:b=>{if(b.schemaVersion!==2)throw Error('schema');return b},driveFetch:async url=>{reads++;const id=decodeURIComponent(url.split('/files/')[1].split('?')[0]);return {json:async()=>table[id]}}};vm.createContext(ctx);vm.runInContext(src,ctx);const load=vm.runInContext('syncLoadHistory',ctx);return {load,reads:()=>reads};}
test('Változatlan régi előzményt nem tölti újra ugyanazon műveleten belül',async()=>{const h=harness({a:payload(),b:payload(['a'],'b')});const c=new Map();let r=await h.load([meta('a'),meta('b')],c);assert.equal(r.heads[0].id,'b');assert.equal(h.reads(),2);r=await h.load([meta('a'),meta('b')],c);assert.equal(r.heads[0].id,'b');assert.equal(h.reads(),2)});
test('Új felhőágat újra letölt és észlel',async()=>{const h=harness({a:payload(),b:payload(['a'],'b'),c:payload(['a'],'c')});const c=new Map();await h.load([meta('a'),meta('b')],c);const r=await h.load([meta('a'),meta('b'),meta('c')],c);assert.equal(h.reads(),3);assert.equal(r.heads.length,2)});
test('Azonos fájl-azonosító eltérő módosítási idővel újra letöltendő',async()=>{const h=harness({a:payload()});const c=new Map();await h.load([meta('a')],c);await h.load([meta('a','2026-11-23T19:00:00Z')],c);assert.equal(h.reads(),2)});
test('Hiányzó módosítási idő vagy méret esetén nincsen gyorsítótárazás',async()=>{const h=harness({a:payload()});const c=new Map();const m=meta('a');delete m.size;await h.load([m],c);await h.load([m],c);assert.equal(h.reads(),2)});
test('Felhőfájl törlése esetén az előzményhiány biztonságosan megállítja a szinkront',async()=>{const h=harness({a:payload(),b:payload(['a'],'b')});const c=new Map();await h.load([meta('a'),meta('b')],c);await assert.rejects(h.load([meta('b')],c),/Hiányos felhőelőzmény/)});
test('Felhő-revízió aláírása megváltozik, ha egy létező fájl módosítási ideje vagy mérete változik',async()=>{
 const h=harness({a:payload(),b:payload(['a'],'b')});const c=new Map();
 const first=await h.load([meta('a'),meta('b')],c);
 const changed=await h.load([meta('a','2026-11-23T20:00:00Z'),meta('b')],c);
 assert.notEqual(first.signature,changed.signature);
 const unchanged=await h.load([meta('a','2026-11-23T20:00:00Z'),meta('b')],c);
 assert.equal(changed.signature,unchanged.signature);
 const resized=await h.load([meta('a','2026-11-23T20:00:00Z','555'),meta('b')],c);
 assert.notEqual(unchanged.signature,resized.signature);
});
