'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const loadSrc=html.slice(html.indexOf('async function syncLoadHistory('),html.indexOf('function syncMergeCloudHeads('));
const dbSrc=html.slice(html.indexOf("const SYNC_MEDIA_CACHE_KEY='"),html.indexOf('async function syncBaseRead('));
const meta=(id,md5='digest-1')=>({id,name:`CarExpense_sync_${id}.json`,modifiedTime:'2026-11-24T08:00:00Z',size:'250',md5Checksum:md5,createdTime:'2026-11-24T08:00:00Z'});
const payload=(parents=[],id='a')=>({format:'carexpense-sync-v2',parents,data:{schemaVersion:2,vehicles:[{id}]}});
function harness(storage){
 const cloud={a:payload(),b:payload(['a'],'b')};let reads=0;
 const db={transaction:(_store,mode)=>{
  const tx={oncomplete:null,onerror:null,onabort:null};
  tx.objectStore=()=>({
   get:()=>{const req={};queueMicrotask(()=>{req.result=storage.value;req.onsuccess?.()});return req},
   put:(v)=>{if(storage.fail)throw Error('QuotaExceeded');storage.value=structuredClone(v);queueMicrotask(()=>tx.oncomplete?.())},
   delete:()=>{const req={};queueMicrotask(()=>{delete storage.value;req.onsuccess?.()});return req}
  });return tx;
 }};
 const ctx={Map,Set,Error,Promise,db,structuredClone,request:r=>new Promise(resolve=>{r.onsuccess=()=>resolve(r.result)}),
  validateBackup:x=>{if(x.schemaVersion!==2)throw Error('bad data');return x},
  driveFetch:async url=>{reads++;return {json:async()=>cloud[decodeURIComponent(url.split('/files/')[1].split('?')[0])]}}};
 vm.createContext(ctx);vm.runInContext(dbSrc+'\n'+loadSrc,ctx);
 return {read:()=>vm.runInContext('syncVerifiedMediaRead',ctx)(),
  write:(cache,files)=>vm.runInContext('syncVerifiedMediaWrite',ctx)(cache,files),
  load:(files,cache)=>vm.runInContext('syncLoadHistory',ctx)(files,cache),reads:()=>reads,cloud};
}
test('Verified MD5 snapshot survives browser-like process restart and avoids media GET',async()=>{
 const storage={};const files=[meta('a'),meta('b')];
 const first=harness(storage),one=await first.read();
 assert.equal((await first.load(files,one)).heads[0].id,'b');assert.equal(first.reads(),2);
 await first.write(one,files);assert.equal(storage.value.length,2);
 const second=harness(storage),two=await second.read();
 assert.equal((await second.load(files,two)).heads[0].id,'b');assert.equal(second.reads(),0);
});
test('Changed Drive MD5 invalidates persisted media and downloads again',async()=>{
 const storage={},first=harness(storage),files=[meta('a')];const cache=await first.read();
 await first.load(files,cache);await first.write(cache,files);
 const next=harness(storage);await next.load([meta('a','digest-CHANGED')],await next.read());
 assert.equal(next.reads(),1);
});
test('Missing Drive MD5 never persists snapshots; future sync downloads again',async()=>{
 const storage={},files=[meta('a',null)];const first=harness(storage),cache=await first.read();
 await first.load(files,cache);await first.write(cache,files);assert.equal(storage.value.length,0);
 const next=harness(storage);await next.load(files,await next.read());assert.equal(next.reads(),1);
});
test('IndexedDB quota failure does not prevent verified cloud history use',async()=>{
 const storage={fail:true};const h=harness(storage),cache=await h.read(),files=[meta('a')];
 assert.equal((await h.load(files,cache)).heads.length,1);
 await assert.doesNotReject(h.write(cache,files));
});
test('New Drive branch downloads only new snapshot while using persisted ancestors',async()=>{
 const storage={},first=harness(storage),files=[meta('a')],cache=await first.read();
 await first.load(files,cache);await first.write(cache,files);
 const next=harness(storage),current=await next.read();
 const result=await next.load([meta('a'),meta('b')],current);
 assert.equal(result.heads[0].id,'b');assert.equal(next.reads(),1);
});
