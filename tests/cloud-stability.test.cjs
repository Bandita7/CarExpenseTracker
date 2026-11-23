'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const a=html.indexOf('async function syncConfirmStableHead('),b=html.indexOf('let syncDecisions=',a);
assert(a>0&&b>a);const src=html.slice(a,b);
function harness(heads){let paused=false,reads=0;const ctx={Promise,Error,setTimeout:fn=>fn(),syncList:async()=>[],syncLoadHistory:async()=>{reads++;return {heads}},setAutoSyncPaused:()=>{paused=true}};vm.createContext(ctx);vm.runInContext(src,ctx);return {run:id=>vm.runInContext('syncConfirmStableHead',ctx)(id),stats:()=>({paused,reads})}}
test('Egyező felhő végpontnál tovább enged',async()=>{const h=harness([{id:'new'}]);assert.equal(await h.run('new'),true);assert.equal(h.stats().reads,1)});
test('Párhuzamos felhőág észlelésekor leáll',async()=>{const h=harness([{id:'new'},{id:'other'}]);await assert.rejects(h.run('new'),/új felhőágat/);assert.equal(h.stats().paused,true)});
test('Másik végpont esetén nem lehet késznek jelölni',async()=>{const h=harness([{id:'different'}]);await assert.rejects(h.run('new'),/helyi véglegesítés nélkül|helyi állapotot nem módosítottuk/);assert.equal(h.stats().paused,true)});
test('Első és későbbi feltöltés is meghívja a stabilitás-ellenőrzést',()=>{const section=html.slice(html.indexOf('async function syncNowCore('),html.indexOf('function driveLogout('));assert.match(section,/await syncConfirmStableHead\(id\)/);assert.match(section,/await syncConfirmStableHead\(newId\)/)});
