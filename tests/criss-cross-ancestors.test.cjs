'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const first=html.indexOf('const SYNC_KEYS='), start=html.indexOf('async function syncLoadHistory('), end=html.indexOf('// v1.8.2 – Read-after-write verification',start);
const fn=html.slice(first,html.indexOf('async function syncList()',first))+html.slice(start,end);
function runGraph(entries){
 const files=entries.map(e=>({id:e.id,name:e.id,createdTime:'2026-01-01T00:00:00Z',modifiedTime:'2026-01-01T00:00:00Z',size:123,md5Checksum:e.id}));
 const map=Object.fromEntries(entries.map(e=>[e.id,{format:'carexpense-sync-v2',parents:e.parents,data:e.snapshot}]));
 const ctx={Map,Set,Date,Error,JSON,Promise,structuredClone,console,syncMetrics:null,
  driveFetch:async url=>({json:async()=>map[url.match(/files\/([^?]+)/)[1]]}),validateBackup:v=>v};
 vm.createContext(ctx);vm.runInContext(fn,ctx);
 return ctx.syncLoadHistory(files,new Map()).then(history=>({history,merge:decisions=>ctx.syncMergeCloudHeads(history,decisions||{})}));
}
const snap=(fuel=[],services=[])=>({schemaVersion:2,vehicles:[{id:'a'},{id:'b'}],fuel,services});
const root={id:'root',parents:[],snapshot:snap()};
test('criss-cross: azonos maximális közös ősi rekordállapotoknál nincs téves leállás',async()=>{
 const a={id:'a',parents:['root'],snapshot:snap()};const b={id:'b',parents:['root'],snapshot:snap()};
 const x={id:'x',parents:['a','b'],snapshot:snap([{id:'f',vehicleId:'a',cost:100}])};
 const y={id:'y',parents:['a','b'],snapshot:snap([],[{id:'s',vehicleId:'b',cost:200}])};
 const {history,merge}=await runGraph([root,a,b,x,y]);
 assert.equal(history.commonAncestorInfo(['x','y']).maximal.length,2);
 const r=merge();assert.equal(r.conflicts.length,0);assert.equal(r.result.fuel[0].id,'f');assert.equal(r.result.services[0].id,'s');
});
test('criss-cross: eltérő közös ősi rekordok + eltérő végpontok: kézi feloldás szükséges',async()=>{
 const a={id:'a',parents:['root'],snapshot:snap([{id:'f',cost:1}])};const b={id:'b',parents:['root'],snapshot:snap([{id:'f',cost:2}])};
 const x={id:'x',parents:['a','b'],snapshot:snap([{id:'f',cost:1}])};const y={id:'y',parents:['a','b'],snapshot:snap([{id:'f',cost:2}])};
 const {merge}=await runGraph([root,a,b,x,y]);const r=merge();
 assert.equal(r.result,null);assert.equal(r.conflicts.length,1);assert.equal(r.conflicts[0].id,'f');
 assert.equal(r.conflicts[0].choiceKey,'branch-1 / fuel / f');
 const selected=merge({'branch-1 / fuel / f':'remote'});assert.equal(selected.conflicts.length,0);assert.equal(selected.result.fuel[0].cost,2);
});
test('criss-cross: eltérő ősök, de azonos végpontok: ütközés nélkül elfogadható',async()=>{
 const a={id:'a',parents:['root'],snapshot:snap([{id:'f',cost:1}])};const b={id:'b',parents:['root'],snapshot:snap([{id:'f',cost:2}])};
 const x={id:'x',parents:['a','b'],snapshot:snap([{id:'f',cost:3}])};const y={id:'y',parents:['a','b'],snapshot:snap([{id:'f',cost:3}])};
 const {merge}=await runGraph([root,a,b,x,y]);const r=merge();assert.equal(r.conflicts.length,0);assert.equal(r.result.fuel[0].cost,3);
});
test('criss-cross: több végpont esetén ambiguitásnál nincs automatikus választás',async()=>{
 const a={id:'a',parents:['root'],snapshot:snap([{id:'f',cost:1}])};const b={id:'b',parents:['root'],snapshot:snap([{id:'f',cost:2}])};
 const x={id:'x',parents:['a','b'],snapshot:snap([{id:'f',cost:1}])};const y={id:'y',parents:['a','b'],snapshot:snap([{id:'f',cost:2}])};const z={id:'z',parents:['a','b'],snapshot:snap([{id:'f',cost:3}])};
 const {merge}=await runGraph([root,a,b,x,y,z]);assert.throws(()=>merge(),/Több felhőág/);
});
