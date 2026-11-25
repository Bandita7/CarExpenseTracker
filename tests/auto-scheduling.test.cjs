'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const start=html.indexOf('let autoSyncTimer=null,autoSyncApplying=false');
const end=html.indexOf("document.addEventListener('visibilitychange'",start);
assert(start>=0&&end>start);
const src=html.slice(start,end);
function scenario(){
 let now=100000,tid=0;
 const timers=new Map(),calls=[];
 const store=new Map([['carAutoSync','1'],['carAutoSyncPaused','0']]);
 const ctx={
   Date:{now:()=>now},
   localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)},
   navigator:{onLine:true},document:{visibilityState:'visible'},
   driveToken:'test',driveTokenExpiry:999999,driveBusy:false,
   syncAttentionRefresh:()=>Promise.resolve(),
   syncNow:(automatic)=>calls.push(automatic),
   setTimeout:(fn,ms)=>{const id=++tid;timers.set(id,{fn,at:now+ms});return id},
   clearTimeout:(id)=>timers.delete(id),
   $:()=>null
 };
 vm.createContext(ctx);vm.runInContext(src,ctx);
 function advance(ms){const target=now+ms;for(let i=0;i<30;i++){
   const next=[...timers.entries()].filter(([,v])=>v.at<=target).sort((a,b)=>a[1].at-b[1].at)[0];
   if(!next)break;now=next[1].at;timers.delete(next[0]);next[1].fn();
 }now=target}
 return {ctx,calls,advance,timers,store,now:()=>now};
}
test('Automatikus mentés után 20 másodperccel indul, nem azonnal',()=>{
 const x=scenario();x.ctx.queueAutoSync('local-save');x.advance(19999);assert.equal(x.calls.length,0);x.advance(1);assert.deepEqual(x.calls,[true]);
});
test('Cooldown alatt érkezett előtérkérés nem vész el',()=>{
 const x=scenario();x.ctx.queueAutoSync('foreground');x.advance(3000);assert.equal(x.calls.length,1);
 x.ctx.queueAutoSync('foreground');x.advance(11999);assert.equal(x.calls.length,1);
 x.advance(1);assert.equal(x.calls.length,2);
});
test('Drive-busy állapot közbeni mentés később indul',()=>{
 const x=scenario();x.ctx.driveBusy=true;x.ctx.queueAutoSync('local-save');
 x.advance(50000);assert.equal(x.calls.length,0);
 x.ctx.driveBusy=false;x.ctx.drainDeferredAutoSync();x.advance(2999);assert.equal(x.calls.length,0);
 x.advance(1);assert.equal(x.calls.length,1);
});
test('Szüneteltetett mód nem futtat később várakozó szinkront',()=>{
 const x=scenario();x.ctx.driveBusy=true;x.ctx.queueAutoSync('local-save');
 x.ctx.setAutoSyncPaused(true);x.ctx.driveBusy=false;x.ctx.drainDeferredAutoSync();x.advance(30000);
 assert.equal(x.calls.length,0);
});
test('Lejárt tokennel és kikapcsolt automatikus módban nincs indítás',()=>{
 const x=scenario();x.ctx.driveTokenExpiry=1;x.ctx.queueAutoSync('local-save');x.advance(30000);assert.equal(x.calls.length,0);
 const y=scenario();y.store.set('carAutoSync','0');y.ctx.queueAutoSync('foreground');y.advance(30000);assert.equal(y.calls.length,0);
});
