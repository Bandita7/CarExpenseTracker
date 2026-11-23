// v1.8.0: test actual driveFetch implementation extracted from shipped index.html.
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const a=html.indexOf('const DRIVE_READ_RETRY_STATUSES=');
const b=html.indexOf('// v1.6: read-only',a);
assert(a>0&&b>a,'Read retry implementation missing');
const source=html.slice(a,b);
function harness(impl){
 let calls=0;const ctx={Headers,Set,Date,Error,Promise, navigator:{onLine:true},driveToken:'token',driveTokenExpiry:Date.now()+60000,driveClearToken:()=>{ctx.driveToken=null},setTimeout:(f,ms)=>{f();return 1},fetch:async(url,options)=>{calls++;return impl(calls,options)}};
 vm.createContext(ctx);vm.runInContext(source,ctx);return {fetch:(path,opts)=>vm.runInContext('driveFetch',ctx)(path,opts),calls:()=>calls,ctx};
}
const ok=()=>({ok:true,status:200});
test('GET átmeneti 503 után sikeres, két próbával',async()=>{const h=harness(i=>i===1?({ok:false,status:503,json:async()=>({error:{message:'Busy'}})}):ok());assert.equal((await h.fetch('/drive/v3/files')).status,200);assert.equal(h.calls(),2)});
test('GET 429 után legfeljebb 3 olvasás',async()=>{const h=harness(()=>({ok:false,status:429,json:async()=>({})}));await assert.rejects(h.fetch('/drive/v3/files'),/429/);assert.equal(h.calls(),3)});
test('GET hálózati hiba után újrapróbál',async()=>{const h=harness(i=>i===1?Promise.reject(Error('Lost')):ok());await h.fetch('/drive/v3/files');assert.equal(h.calls(),2)});
test('POST 503 esetén SOHA nem ismétel',async()=>{const h=harness(()=>({ok:false,status:503,json:async()=>({})}));await assert.rejects(h.fetch('/upload/drive/v3/files',{method:'POST',body:'x'}),/nem próbálkozunk automatikusan újra/);assert.equal(h.calls(),1)});
test('POST bizonytalan hálózati hibánál SOHA nem ismétel',async()=>{const h=harness(()=>Promise.reject(Error('Lost response')));await assert.rejects(h.fetch('/upload/drive/v3/files',{method:'POST',body:'x'}),/bizonytalan/);assert.equal(h.calls(),1)});
test('GET 401 nem ismétlődik, token törlődik',async()=>{const h=harness(()=>({ok:false,status:401,json:async()=>({})}));await assert.rejects(h.fetch('/drive/v3/files'),/401/);assert.equal(h.calls(),1);assert.equal(h.ctx.driveToken,null)});
test('GET 403 nem ismétlődik',async()=>{const h=harness(()=>({ok:false,status:403,json:async()=>({})}));await assert.rejects(h.fetch('/drive/v3/files'),/403/);assert.equal(h.calls(),1)});
test('Offline GET nem kezdeményez kérést',async()=>{const h=harness(()=>ok());h.ctx.navigator.onLine=false;await assert.rejects(h.fetch('/drive/v3/files'),/internetkapcsolat/);assert.equal(h.calls(),0)});
