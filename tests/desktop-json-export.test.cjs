'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const start=html.indexOf('function download(obj,name){');
const end=html.indexOf('function safeMsg(s){',start);
assert.ok(start>0&&end>start);
const src=html.slice(start,end);
function setup(ua='Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130.0.0.0'){
 const log=[],notices=[]; let confirmReturn=true, data={vehicles:[{id:'v1'}]};
 const node={style:{},click(){log.push('click')},remove(){log.push('remove')}};
 const sandbox={navigator:{userAgent:ua,platform:'Win32',maxTouchPoints:0},document:{createElement(){log.push('create');return node},body:{appendChild(n){assert.equal(n,node);log.push('append')}}},URL:{createObjectURL(){log.push('url');return 'blob:example'},revokeObjectURL(){log.push('revoke')}},Blob:class{constructor(a,b){this.parts=a;this.config=b}},File:class{constructor(){throw Error('PC should not create mobile File')}},setTimeout(){},safeMsg(x){notices.push(x)},confirm(){log.push('confirm');return confirmReturn},data,Date,};
 const context=vm.createContext(sandbox);vm.runInContext(src,context);
 return {context,log,notices,setConfirm(v){confirmReturn=v}};
}
test('PC export starts direct download with attached anchor, no restore confirmation',async()=>{
 const s=setup();const ok=await s.context.backup();assert.equal(ok,true);
 assert.ok(s.log.indexOf('append')>=0&&s.log.indexOf('append')<s.log.indexOf('click'));
 assert.equal(s.log.includes('confirm'),false);
 assert.match(s.notices.at(-1),/Letöltések/);
 assert.doesNotMatch(s.notices.at(-1),/visszaállítás/);
});
test('Before data replacement, a desktop backup requires positive confirmation',async()=>{
 const s=setup();s.setConfirm(false);
 const ok=await s.context.backupBeforeReplace('TEST');assert.equal(ok,false);
 assert.ok(s.log.includes('click')&&s.log.includes('confirm'));
});
test('Mobile share route remains eligible on iPhone',()=>{
 const s=setup('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)');
 assert.equal(s.context.mobileFileSharePreferred(),true);
});
