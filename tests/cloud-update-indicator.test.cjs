 'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const js=html.split('let cloudUpdateKind=')[1].split('// v1.9.3: diagnostic reports')[0];
function boot(){
 const banner={textContent:'',appendChild(button){this.lastButton=button},classList:{values:new Set(['hidden']),add(x){this.values.add(x)},remove(x){this.values.delete(x)},toggle(x,v){v?this.add(x):this.remove(x)},contains(x){return this.values.has(x)}}};
 const ctx={document:{createElement(){return {style:{},click(){this.onclick?.()}}}},$:()=>banner,syncSameRecords:(a,b)=>JSON.stringify(a)===JSON.stringify(b)};
 vm.createContext(ctx);vm.runInContext('let cloudUpdateKind='+js,ctx);return {ctx,banner};
}
test('Visible persistent banner appears on remote change and clears after success',()=>{
 const {ctx,banner}=boot();vm.runInContext("cloudUpdateSet('remote')",ctx);assert.match(banner.textContent,/Új módosítások/);assert.equal(banner.classList.contains('hidden'),false);
 vm.runInContext("cloudUpdateSet('none')",ctx);assert.equal(banner.classList.contains('hidden'),true);
});
test('Same base needs no alert, changed remote requires manual sync',()=>{
 const {ctx}=boot();const base={remoteId:'old',snapshot:{fuel:[]}};
 const hist={heads:[{id:'new',snapshot:{fuel:[{id:1}]}}],nodes:new Map([['old',{snapshot:{fuel:[]}}]]),descendsFrom:()=>true};
 ctx.h=hist;ctx.b=base;assert.equal(vm.runInContext('cloudUpdateClassify(h,b)',ctx),'remote');
 hist.heads[0].snapshot={fuel:[]};assert.equal(vm.runInContext('cloudUpdateClassify(h,b)',ctx),'none');
});
test('Fork, changed base, initial cloud are distinguished',()=>{
 const {ctx}=boot();ctx.h={heads:[{id:'a',snapshot:{}},{id:'b',snapshot:{}}],nodes:new Map(),descendsFrom:()=>false};
 assert.equal(vm.runInContext('cloudUpdateClassify(h,null)',ctx),'fork');
 ctx.h.heads.pop();assert.equal(vm.runInContext('cloudUpdateClassify(h,null)',ctx),'initial');
 ctx.b={remoteId:'old',snapshot:{}};assert.equal(vm.runInContext('cloudUpdateClassify(h,b)',ctx),'warning');
});
test('Read-only inspection owns the alert; sync clears on success and auto-sync stays off',()=>{
 assert.match(html,/const pendingCloud=cloudUpdateClassify\(history,base\);\s*cloudUpdateSet\(pendingCloud\)/);
 assert.match(html,/syncOutcome='success';\s*cloudUpdateSet\('none'\)/);
 assert.match(html,/function autoSyncEnabled\(\)\{return false\}/);
 assert.match(html,/id="cloud-update-banner"/);
 const readOnly=html.split('async function syncReadOnlyHealth(automatic=false){')[1].split('// v1.9.4: opt-in, foreground-only')[0];
 for(const bad of ['syncNow(', 'syncUpload(', 'syncCommitLocal(', 'driveLogin('])assert.equal(readOnly.includes(bad),false,bad);
});

test('Banner gomb csak valódi kattintásra indítja a meglévő kézi sync gombot',()=>{
 const {ctx,banner}=boot();const events=[];
 ctx.setTab=k=>events.push('open:'+k);
 ctx.safeMsg=message=>events.push('notice:'+message);
 ctx.$=id=>id==='sync-now'?{disabled:false,click:()=>events.push('sync-click')}:banner;
 vm.runInContext("cloudUpdateSet('remote')",ctx);
 assert.equal(events.length,0,'a kijelzés önmagában nem indíthat szinkront');
 assert.equal(banner.lastButton.textContent,'Szinkronizálás most');
 banner.lastButton.click();
 assert.deepEqual(events,['open:settings','sync-click']);
});
test('Párhuzamos ágakhoz kézi sync gomb; warning és initial csak az adatkezelést nyitja',()=>{
 const {ctx,banner}=boot();const events=[];
 ctx.setTab=k=>events.push('open:'+k);ctx.safeMsg=message=>events.push('notice');
 ctx.$=id=>id==='sync-now'?{disabled:false,click:()=>events.push('sync-click')}:banner;
 vm.runInContext("cloudUpdateSet('fork')",ctx);banner.lastButton.click();
 assert.deepEqual(events,['open:settings','sync-click']);
 events.length=0;vm.runInContext("cloudUpdateSet('warning')",ctx);
 assert.equal(banner.lastButton.textContent,'Adatkezelés megnyitása');
 banner.lastButton.click();assert.deepEqual(events,['open:settings']);
 events.length=0;vm.runInContext("cloudUpdateSet('initial')",ctx);banner.lastButton.click();assert.deepEqual(events,['open:settings']);
});
test('Letiltott szinkrongombot a banner nem kerüli meg',()=>{
 const {ctx,banner}=boot();const events=[];
 ctx.setTab=k=>events.push('open:'+k);ctx.safeMsg=message=>events.push('notice');
 ctx.$=id=>id==='sync-now'?{disabled:true,click:()=>events.push('BAD-sync-click')}:banner;
 vm.runInContext("cloudUpdateSet('remote')",ctx);banner.lastButton.click();
 assert.deepEqual(events,['open:settings','notice']);
});
test('A banner nem hívja közvetlenül a szinkronmotort vagy az OAuth-ot',()=>{
 const action=html.split('function cloudUpdateAction(){')[1].split('function cloudUpdateClassify(',1)[0];
 assert.match(action,/setTab\('settings'\)/);
 assert.match(action,/button\.click\(\)/);
 for(const forbidden of ['syncNow(', 'syncNowCore(', 'driveLogin(', 'syncUpload(', 'syncCommitLocal(']) assert.ok(!action.includes(forbidden),forbidden);
});
