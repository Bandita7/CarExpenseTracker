'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const start=html.indexOf('async function syncConvergeUploadedFork('),end=html.indexOf('let syncDecisions=',start);
assert(start>0&&end>start);
const helper=html.slice(start,end);
const clone=x=>structuredClone(x);
function harness(opts={}){
 const local={schemaVersion:2,vehicles:[{id:'car-a'},{id:'car-b'}],fuel:[{id:'fuel-a',vehicleId:'car-a',cost:100}],services:[]};
 let uploads=0,commit=0,paused=false,listings=0,verified=0;
 const context={Promise,Error,structuredClone,JSON,Date,console,data:clone(local),
  syncStep:()=>{},syncNotice:()=>{},
  syncCompare:(a,b)=>JSON.stringify(a)===JSON.stringify(b),
  setAutoSyncPaused:v=>{paused=v},
  syncMergeCloudHeads:()=>opts.merge||{conflicts:[],result:{...clone(local),services:[{id:'srv-b',vehicleId:'car-b',cost:200}]}},
  validateBackup:v=>v,
  syncList:async()=>{listings++;return[]},
  syncLoadHistory:async()=>{if(listings===1)return {signature:opts.changed?'changed':'same'};return {heads:opts.third?[{id:'joined'},{id:'third'}]:[{id:'joined'}]}}
  ,syncUpload:async()=>{uploads++;return 'joined'},
  syncVerifiedMediaWrite:async()=>{},
  syncConfirmStableHead:async()=>{verified++},
  syncCommitLocal:async()=>{commit++}
 };
 vm.createContext(context);vm.runInContext(helper,context);
 const after={heads:[{id:'ours'},{id:'theirs'}],signature:'same'};
 return {run:()=>vm.runInContext('syncConvergeUploadedFork',context)('ours',after,new Map(),local),stats:()=>({uploads,commit,paused,listings,verified})};
}
test('külön autók módosításai egy közös pillanatképbe kerülnek',async()=>{
 const h=harness(),r=await h.run();assert.equal(r.id,'joined');assert.equal(r.result.fuel[0].id,'fuel-a');assert.equal(r.result.services[0].id,'srv-b');assert.deepEqual(h.stats(),{uploads:1,commit:0,paused:false,listings:2,verified:1});
});
test('azonos rekord ütközésénél nem történik feltöltés',async()=>{
 const h=harness({merge:{conflicts:[{key:'fuel',id:'fuel-a'}]}});await assert.rejects(h.run(),/azonos rekordot érintő/);assert.equal(h.stats().uploads,0);assert.equal(h.stats().paused,true);
});
test('újabb változás előfeltétel-ellenőrzéskor megállítja a feltöltést',async()=>{
 const h=harness({changed:true});await assert.rejects(h.run(),/Újabb felhőváltozás/);assert.equal(h.stats().uploads,0);
});
test('harmadik felhőág után nincs ismételt feltöltés vagy helyi commit',async()=>{
 const h=harness({third:true});await assert.rejects(h.run(),/további felhőág/);assert.equal(h.stats().uploads,1);assert.equal(h.stats().commit,0);assert.equal(h.stats().paused,true);
});
test('hiányzó saját feltöltési ág mellett nincs automatikus egyesítés',async()=>{
 // Important invariant is also checked before merging.
 assert.match(helper,/after\.heads\.some\(h=>h\.id===uploadedId\)/);
});
test('új funkció kizárólag feltöltés utáni felhőág-eltérésnél aktiválódik',()=>{
 const main=html.slice(html.indexOf('async function syncNowCore('),html.indexOf('function driveLogout('));
 assert.match(main,/syncConvergeUploadedFork\(newId,after,mediaCache,local\)/);
 assert.match(main,/newId=join\.id;result=join\.result/);
 assert.match(main,/syncCommitLocal\(result,newId,local,/);
 assert.match(html,/function autoSyncEnabled\(\)\{try\{return localStorage\.getItem\('carAutoSync'\)==='1'\}catch\{return false\}\}/);
});
