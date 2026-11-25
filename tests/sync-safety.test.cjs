// No third-party dependencies. Functions are extracted verbatim from the shipped app.
'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
function slice(start,end){const a=html.indexOf(start);if(a<0)throw Error('Function not found: '+start);const b=html.indexOf(end,a+start.length);if(b<0)throw Error('End not found: '+end);return html.slice(a,b)}
const source=[
 slice('const DATA_REQUIRED=','// No IndexedDB schema upgrade'),
 slice('const SYNC_KEYS=','async function syncList('),
 slice('async function syncLoadHistory(files,mediaCache=null){','async function syncUpload('),
].join('\n');
const context=vm.createContext({structuredClone,Map,Set,URLSearchParams,Date,JSON,Error,Number,String,Array,Object,console});
vm.runInContext(source,context);
function get(name){return vm.runInContext(name,context)}
const audit=get('inspectBackup'),validate=get('validateBackup'),merge=get('syncMerge'),same=get('syncSameRecords');
const load=get('syncLoadHistory'),mergeHeads=get('syncMergeCloudHeads');
const blank=()=>({schemaVersion:2,vehicles:[{id:'v',name:'Tesztjármű'}],fuel:[],services:[],master:[],tyres:[],cycles:[],expenses:[],fuelTypes:[],maintenanceOverrides:[],deadlines:[]});
const copy=x=>structuredClone(x);
const due=(id,title,date='2026-12-01')=>({id,vehicleId:'v',title,dueDate:date});
function errIncludes(fn,part){assert.throws(fn,e=>e.message.includes(part))}
function feed(files){
 const entries=Object.entries(files);context.driveFetch=async url=>{
  const id=decodeURIComponent(url.split('/files/')[1]?.split('?')[0]||'');
  if(!(id in files))throw Error('Hálózati hiba: '+id);
  return {json:async()=>copy(files[id])};
 };
 return entries.map(([id])=>({id,name:'CarExpense_sync_'+id+'.json',createdTime:'2026-11-22T12:00:00Z'}));
}
const node=(parents,data,old=false)=>old?{format:'carexpense-sync-v1',parent:parents[0]||null,data}:{format:'carexpense-sync-v2',parents,data};

test('érvényes és régi, opcionális kulcsok nélküli v2 mentés',()=>{assert.equal(audit(blank()).errors.length,0);const x=blank();delete x.deadlines;delete x.maintenanceOverrides;assert.equal(audit(x).errors.length,0)});
test('duplikált azonosító blokkolása',()=>{const x=blank();x.fuel=[{id:'a',vehicleId:'v'},{id:'a',vehicleId:'v'}];errIncludes(()=>validate(x),'azonosító')});
test('árva járműhivatkozás blokkolása',()=>{const x=blank();x.expenses=[{id:'x',vehicleId:'nemletezo'}];errIncludes(()=>validate(x),'jármű')});
test('hibás kilométeróra blokkolása',()=>{const x=blank();x.fuel=[{id:'a',vehicleId:'v',odometer:-10}];errIncludes(()=>validate(x),'kilométeróra')});
test('tankolási időrend csak figyelmeztet',()=>{const x=blank();x.fuel=[{id:'a',vehicleId:'v',date:'2026-11-01',odometer:500},{id:'b',vehicleId:'v',date:'2026-11-02',odometer:400}];assert.equal(audit(x).errors.length,0);assert(audit(x).warnings.some(w=>w.includes('visszafelé')))});
test('technikai metaadat eltérése nem szinkronütközés',()=>{const a=blank(),b=blank();a.exportedAt='A';b.exportedAt='B';assert(same(a,b))});
test('független rekord létrehozása összeolvad',()=>{const base=blank(),a=copy(base),b=copy(base);a.deadlines.push(due('a','iPhone'));b.deadlines.push(due('b','iPad'));const r=merge(base,a,b);assert.equal(r.conflicts.length,0);assert.deepEqual(new Set(r.result.deadlines.map(x=>x.id)),new Set(['a','b']))});
test('azonos rekord eltérő módosítása explicit konfliktus',()=>{const base=blank();base.deadlines=[due('x','Teszt')];const a=copy(base),b=copy(base);a.deadlines[0].dueDate='2026-12-02';b.deadlines[0].dueDate='2026-12-03';const r=merge(base,a,b);assert.equal(r.conflicts.length,1);assert.equal(r.conflicts[0].choiceKey,'device / deadlines / x')});
test('törlés és módosítás: konfliktus, nem csendes visszaállítás',()=>{const base=blank();base.deadlines=[due('x','Teszt')];const a=copy(base),b=copy(base);a.deadlines=[];b.deadlines[0].title='Módosított';const r=merge(base,a,b);assert.equal(r.conflicts.length,1);const erased=merge(base,a,b,{'device / deadlines / x':'local'});assert.equal(erased.result.deadlines.length,0);const kept=merge(base,a,b,{'device / deadlines / x':'remote'});assert.equal(kept.result.deadlines[0].title,'Módosított')});
test('azonos törlés nem hozza vissza a rekordot',()=>{const base=blank();base.deadlines=[due('x','Teszt')];const a=copy(base),b=copy(base);a.deadlines=[];b.deadlines=[];assert.equal(merge(base,a,b).result.deadlines.length,0)});
test('két felhőág közös őssel egyesíthető',async()=>{const root=blank(),a=copy(root),b=copy(root);a.deadlines.push(due('a','A'));b.deadlines.push(due('b','B'));const h=await load(feed({root:node([],root,true),a:node(['root'],a),b:node(['root'],b)}));assert.equal(h.heads.length,2);const r=mergeHeads(h,{});assert.equal(r.conflicts.length,0);assert.deepEqual(new Set(r.result.deadlines.map(x=>x.id)),new Set(['a','b']))});
test('felhőági ütközésnél nincs önkényes döntés',async()=>{const root=blank();root.deadlines.push(due('x','Alap'));const a=copy(root),b=copy(root);a.deadlines[0].title='A';b.deadlines[0].title='B';const h=await load(feed({root:node([],root),a:node(['root'],a),b:node(['root'],b)}));assert.equal(mergeHeads(h,{}).conflicts.length,1)});
test('hiányzó szülő visszautasítása',async()=>{await assert.rejects(load(feed({a:node(['absent'],blank())})),/Hiányos felhőelőzmény/)});
test('ciklusos előzmény visszautasítása',async()=>{await assert.rejects(load(feed({a:node(['b'],blank()),b:node(['a'],blank())})),/körkörös/)});
test('külön gyökerek visszautasítása',async()=>{await assert.rejects(load(feed({a:node([],blank()),b:node([],blank())})),/külön gyökér/)});
test('megszakadt felhőletöltés nem szolgáltat részeredményt',async()=>{const files=feed({a:node([],blank()),b:node(['a'],blank())});context.driveFetch=async url=>{if(url.includes('/b?'))throw Error('Hálózati hiba');return {json:async()=>node([],blank())}};await assert.rejects(load(files),/Hálózati hiba/)});
test('tranzakció forráskódban egyben írja az adatot és szinkronalapot',()=>{const f=slice('async function syncCommitLocal(', 'async function read(){');assert(f.includes("db.transaction('state','readwrite')"));assert(f.includes("store.put(checked,'all')"));assert(f.includes("'syncBase'"));assert(f.includes("'syncRecovery'"));assert(f.includes('t.abort()'))});
test('helyreállítás egy tranzakcióban törli a syncBase-t',()=>{const f=slice('async function restoreCommit(', 'async function localRecovery(');assert(f.includes("db.transaction('state','readwrite')"));assert(f.includes("store.put(next,'all')"));assert(f.includes("store.delete('syncBase')"));assert(f.includes("'restoreRecovery'"))});
test('automatikus szinkron jelenleg tiltva',()=>{assert(html.includes("function autoSyncEnabled(){try{return localStorage.getItem('carAutoSync')==='1'}catch{return false}}"));});
