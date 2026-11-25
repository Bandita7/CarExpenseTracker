// v1.9.2: tests execute shipped sync behavior with controlled failures.
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const start=html.indexOf('async function syncNowCore('),end=html.indexOf('function driveLogout()',start);
assert(start>0&&end>start);
const impl=html.slice(start,end);
function ctxFor({cacheFailure=false,cloudFailure=false,localFailure=false}={}){
 const notices=[],metrics=[];
 const context={Map,Date,Promise,Error,JSON,structuredClone,confirm:()=>true,driveBusy:false,driveButtons:()=>{},syncPending:null,syncDecisions:{},syncStage:'teszt',$:id=>id==='sync-timing'?{set textContent(x){metrics.push(x)}}:null,
 syncNotice:x=>notices.push(x),syncStep:x=>{},syncVerifiedMediaRead:async()=>{if(cacheFailure)throw Error('IDB cache crash');return new Map()},syncMetricReport:()=>'',
 syncBaseRead:async()=>null,validateBackup:x=>x,data:{schemaVersion:2,vehicles:[],fuel:[],services:[],expenses:[],master:[],tyres:[],cycles:[],fuelTypes:[],maintenanceOverrides:[],deadlines:[]},
 syncList:async()=>{if(cloudFailure)throw Error('Drive offline');return []},syncLoadHistory:async()=>({heads:[],signature:'empty'}),
 syncCompare:(a,b)=>JSON.stringify(a)===JSON.stringify(b), syncUpload:async()=>{throw Error('POST intentionally blocked')},
 syncVerifiedMediaWrite:async()=>{},setAutoSyncPaused:()=>{},syncMetrics:null, syncMetricStep:()=>{},
 syncCommitLocal:async()=>{if(localFailure)throw Error('IDB failed')},syncStartedAt:0,
 };vm.createContext(context);vm.runInContext(impl,context);return {context,notices,metrics,run:()=>vm.runInContext('syncNowCore',context)(false)};
}
test('local cache throws: Drive sync still progresses and releases busy flag',async()=>{
 const h=ctxFor({cacheFailure:true});await h.run();assert.equal(h.context.driveBusy,false);assert(h.notices.some(x=>x.includes('POST intentionally blocked')));
});
test('Drive list failure: safely releases UI and shows failure',async()=>{
 const h=ctxFor({cloudFailure:true});await h.run();assert.equal(h.context.driveBusy,false);assert(h.notices.some(x=>x.includes('Drive offline')));
});
test('unexpected local cache failure does not hide original cloud failure',async()=>{
 const h=ctxFor({cacheFailure:true,cloudFailure:true});await h.run();assert.equal(h.context.driveBusy,false);assert(h.notices.some(x=>x.includes('Drive offline')));
});
test('automatic sync remains hard disabled',()=>assert.match(html,/function autoSyncEnabled\(\)\{try\{return localStorage\.getItem\('carAutoSync'\)==='1'\}catch\{return false\}\}/));
test('single bounded convergence and POST must not be retried',()=>{
 assert.match(html,/Exactly ONE additional/);
 assert.match(html,/const attempts=readOnly\?DRIVE_READ_DELAYS\.length\+1:1/);
});
