// v1.8.2 – exercise shipped read-after-write implementation without Drive credentials.
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const start=html.indexOf('async function syncFindUploadedSnapshot(');
const end=html.indexOf('async function syncDiagnostic()',start);
assert(start>0&&end>start);
const impl=html.slice(start,end);
const data={schemaVersion:2,vehicles:[],fuel:[],services:[],expenses:[],master:[],tyres:[],cycles:[],fuelTypes:[],maintenanceOverrides:[],deadlines:[]};
function harness(mode){
 let posts=0,reads=0,name='',parent=['base-1'];
 const ctx={Date,Error,Promise,URLSearchParams,encodeURIComponent,JSON,crypto:{randomUUID:()=> '1234-5678'},SYNC_FILE:'CarExpense_sync_',validateBackup:x=>x,syncStep:()=>{},syncCompare:(a,b)=>JSON.stringify(a)===JSON.stringify(b),syncSameRecords:(a,b)=>JSON.stringify(a)===JSON.stringify(b)};
 ctx.driveFetch=async(url,opts={})=>{
  if(opts.method==='POST'){
   posts++;
   const match=String(opts.body).match(/"name":"(CarExpense_sync_[^"]+)"/);assert(match);name=match[1];
   if(mode==='normal')return {json:async()=>({id:'ok-id'})};
   if(mode==='error-recovered'||mode==='error-missing'||mode==='error-tampered'||mode==='error-ambiguous')throw Error('network disconnected after upload');
   if(mode==='missing-id')return {json:async()=>({})};
  }
  reads++;
  if(url.includes('?alt=media'))return {json:async()=>({format:'carexpense-sync-v2',parents:parent,data:mode==='error-tampered'?{...data,vehicles:[{id:'unexpected'}]}:data})};
  if(mode==='error-missing')return {json:async()=>({files:[]})};
  if(mode==='error-ambiguous')return {json:async()=>({files:[{id:'one',name},{id:'two',name}]})};
  return {json:async()=>({files:[{id:'recovered-id',name}]})};
 };
 vm.createContext(ctx);vm.runInContext(impl,ctx);
 return {upload:(d=data)=>vm.runInContext('syncUpload',ctx)(d,parent),stats:()=>({posts,reads})};
}
test('Sikeres POST normál válasznál csak egyszer tölt fel',async()=>{const h=harness('normal');assert.equal(await h.upload(),'ok-id');assert.deepEqual(h.stats(),{posts:1,reads:0})});
test('Elveszett válasz: azonos fájl GET-tel megtalálható, nincs új POST',async()=>{const h=harness('error-recovered');assert.equal(await h.upload(),'recovered-id');assert.deepEqual(h.stats(),{posts:1,reads:2})});
test('Elveszett válasz és nincs megtalált fájl: leáll',async()=>{const h=harness('error-missing');await assert.rejects(h.upload(),/NEM ismételjük meg/);assert.equal(h.stats().posts,1)});
test('Eltérő rekordadatú feltöltés ellenőrzéskor leáll',async()=>{const h=harness('error-tampered');await assert.rejects(h.upload(),/tartalma eltér/);assert.equal(h.stats().posts,1)});
test('Azonos nevű több találat esetén leáll',async()=>{const h=harness('error-ambiguous');await assert.rejects(h.upload(),/NEM ismételjük meg/);assert.equal(h.stats().posts,1)});
test('Hiányzó POST válaszazonosító helyreállítása olvasással',async()=>{const h=harness('missing-id');assert.equal(await h.upload(),'recovered-id');assert.equal(h.stats().posts,1)});
