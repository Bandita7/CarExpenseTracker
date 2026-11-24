'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const source=html.split("const FOREGROUND_CHECK_KEY=")[1].split('async function syncDiagnostic(){')[0];
test('Opt-in felhőellenőrzés UI and default OFF',()=>{
 assert.match(html,/id="sync-foreground-check"/);
 assert.match(html,/fg\.checked=foregroundCheckEnabled\(\)/);
 assert.match(html,/const FOREGROUND_CHECK_KEY='carForegroundCloudCheckV1'/);
});
test('Automatic sync remains disabled and foreground check cannot upload',()=>{
 assert.match(html,/function autoSyncEnabled\(\)\{return false\}/);
 for(const bad of ['syncNow(', 'syncUpload(', 'syncCommitLocal(', 'driveLogin(', 'requestAccessToken(', 'driveSave(']) assert.ok(!source.includes(bad),'Unsafe operation in foreground scheduler: '+bad);
 assert.match(source,/syncReadOnlyHealth\(true\)/);
});
test('Only active token, visible online page, free Drive, 5 minute throttle',()=>{
 for(const part of ['!driveBusy','!!driveToken','Date.now()<driveTokenExpiry','navigator.onLine',"document.visibilityState==='visible'",'5*60*1000','!autoSyncApplying']) assert.ok(source.includes(part),part);
});
test('Disabled settings block scheduling; opt-in enables only read-only check',()=>{
 const script=`const FOREGROUND_CHECK_KEY='carForegroundCloudCheckV1';`+source;
 let enabled=false, online=true, busy=false, visible='visible', token='token',exp=999999999,now=1000000,triggered=0;
 let timer=null;
 const context={localStorage:{getItem:()=>enabled?'1':'0'},document:{visibilityState:'visible'},navigator:{onLine:true},Date:{now:()=>now},setTimeout:cb=>{timer=cb;return 1},clearTimeout:()=>{timer=null},driveBusy:false,driveToken:'x',driveTokenExpiry:99999999,autoSyncApplying:false,syncReadOnlyHealth:()=>{triggered++;return Promise.resolve()}};
 vm.createContext(context);vm.runInContext(script,context);
 assert.equal(vm.runInContext('foregroundCheckEnabled()',context),false);
 vm.runInContext("queueForegroundReadOnlyCheck('foreground')",context);assert.equal(timer,null);
 enabled=true;vm.runInContext("queueForegroundReadOnlyCheck('foreground')",context);assert.equal(typeof timer,'function');timer();assert.equal(triggered,1);
 vm.runInContext("queueForegroundReadOnlyCheck('foreground')",context);assert.equal(triggered,1);
 now+=300001;context.navigator.onLine=false;timer=null;vm.runInContext("queueForegroundReadOnlyCheck('foreground')",context);assert.equal(timer,null);
});
