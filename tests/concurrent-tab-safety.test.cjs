'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const lockStart=html.indexOf('const SYNC_BROWSER_LOCK=');
const coreStart=html.indexOf('async function syncNowCore(',lockStart);
const coreEnd=html.indexOf('function driveLogout()',coreStart);
assert(lockStart>=0 && coreStart>lockStart && coreEnd>coreStart);
const wrapper=html.slice(lockStart,coreStart);
const core=html.slice(coreStart,coreEnd);
function lockHarness(kind){
 let called=0;const messages=[];
 const ctx={driveBusy:false, syncNotice:m=>messages.push(m),navigator:{},Error,Promise};
 if(kind==='available')ctx.navigator.locks={request:async(name,opts,fn)=>{assert.equal(name,'carexpense-drive-sync-v1');assert.equal(opts.ifAvailable,true);return fn({name})}};
 if(kind==='occupied')ctx.navigator.locks={request:async(name,opts,fn)=>fn(null)};
 ctx.syncNowCore=async()=>{called++};
 vm.createContext(ctx);
 vm.runInContext(wrapper,ctx);
 return {run:()=>vm.runInContext('syncNow',ctx)(false),stats:()=>({called,messages})};
}
test('Web Locks megfogja a többablakos ütközést',async()=>{const t=lockHarness('occupied');await t.run();assert.equal(t.stats().called,0);assert.match(t.stats().messages[0],/másik ablakában/)});
test('Web Locks engedélyezett szinkron végrehajtás',async()=>{const t=lockHarness('available');await t.run();assert.equal(t.stats().called,1)});
test('Web Locks nélküli böngészőben megmarad a régi kézi működés',async()=>{const t=lockHarness('missing');await t.run();assert.equal(t.stats().called,1)});
function coreHarness(changed){
 const clean={schemaVersion:2,vehicles:[],fuel:[],services:[],master:[],tyres:[],cycles:[],expenses:[],fuelTypes:[],maintenanceOverrides:[],deadlines:[]};
 let historyReads=0,commits=0;const messages=[];
 const same={remoteId:'head-1',snapshot:clean};
 const history={signature:'head-1',heads:[{id:'head-1',snapshot:clean}],nodes:new Map([['head-1',{id:'head-1',snapshot:clean}]]),descendsFrom:()=>true};
 const ctx={
  structuredClone,Error,Promise,console,driveBusy:false,syncStage:'teszt',data:clean,vehicle:'',autoSyncTimer:null,syncPending:null,syncDecisions:{},SYNC_KEYS:['vehicles','fuel','services','master','tyres','cycles','expenses','fuelTypes','maintenanceOverrides','deadlines'],
  $:()=>null,driveButtons:()=>{},syncStep:()=>{},syncNotice:m=>messages.push(m),syncList:async()=>[],
  syncLoadHistory:async()=>{historyReads++;return changed&&historyReads===3?{...history,signature:'head-2'}:history},
  syncVerifiedMediaRead:async()=>new Map(),syncVerifiedMediaWrite:async()=>{},
  syncBaseRead:async()=>same,validateBackup:x=>x,syncCompare:(a,b)=>JSON.stringify(a)===JSON.stringify(b),
  syncSameRecords:(a,b)=>JSON.stringify(a)===JSON.stringify(b),syncRows:(x,k)=>x[k]||[],
  syncMerge:()=>({result:clean,conflicts:[],counts:{local:0,remote:0}}),
  syncCommitLocal:async()=>{commits++},setAutoSyncPaused:()=>{},hideSyncReview:()=>{},
  render:()=>{},updateSyncLocalState:()=>{},safeMsg:()=>{},confirm:()=>true,
 };
 vm.createContext(ctx);vm.runInContext(core,ctx);
 return {run:()=>vm.runInContext('syncNowCore',ctx)(false),stats:()=>({historyReads,commits,messages})};
}
test('Változatlan felhő: helyi szinkronalap menthető',async()=>{const h=coreHarness(false);await h.run();assert.equal(h.stats().commits,1);assert.equal(h.stats().historyReads,3)});
test('Végső ellenőrzéskor változott felhő: helyi szinkronalap NEM módosul',async()=>{const h=coreHarness(true);await h.run();assert.equal(h.stats().commits,0);assert.match(h.stats().messages.at(-1),/felhőállapot a helyi mentés előtt megváltozott/)});
