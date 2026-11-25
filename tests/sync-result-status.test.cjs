"use strict";
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const start=source.indexOf('function syncDeltaCount('),end=source.indexOf("let syncStage='indítás'",start);
const helpers=source.slice(start,end);
function run(before,after){const ctx={SYNC_KEYS:['deadlines','fuel'],syncRows:(x,k)=>Array.isArray(x?.[k])?x[k]:[],syncIndex:(rows)=>new Map(rows.map(r=>[r.id,r])),syncCompare:(a,b)=>JSON.stringify(a)===JSON.stringify(b),Date,localStorage:{setItem:()=>{}},$:()=>null};vm.createContext(ctx);vm.runInContext(helpers,ctx);return ctx.syncDeltaCount(before,after)}
test('új rekord számít',()=>assert.equal(run({deadlines:[]},{deadlines:[{id:'a',dueDate:'2026-01-01'}]}),1));
test('módosított rekord számít',()=>assert.equal(run({deadlines:[{id:'a',dueDate:'2026-01-01'}]},{deadlines:[{id:'a',dueDate:'2026-02-01'}]}),1));
test('törölt rekord számít',()=>assert.equal(run({deadlines:[{id:'a'}]},{deadlines:[]}),1));
test('változatlan rekord 0',()=>assert.equal(run({deadlines:[{id:'a'}]},{deadlines:[{id:'a'}]}),0));
test('állapot mező és megőrzés bekötve',()=>{assert.match(source,/id="sync-last-result"/);assert.match(source,/syncShowResult\(syncResultSummary/);assert.match(source,/syncRestoreResult\(\)/);assert.match(source,/carLastSuccessfulSyncSummary/)});
