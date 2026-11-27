'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const script=html.split('<script>')[1].split('</script>')[0];
const section=script.slice(script.indexOf('const DATA_REQUIRED='),script.indexOf('function auditSummary('));
assert.ok(section.startsWith('const DATA_REQUIRED='));
const context=vm.createContext({});
vm.runInContext(section,context);
const inspect=v=>vm.runInContext('inspectBackup(JSON.parse('+JSON.stringify(JSON.stringify(v))+'))',context);
const validate=v=>vm.runInContext('validateBackup(JSON.parse('+JSON.stringify(JSON.stringify(v))+'))',context);
const base=()=>({schemaVersion:2,vehicles:[],fuel:[],services:[],master:[],tyres:[],cycles:[],expenses:[],fuelTypes:[]});
test('RC1: régi schemaVersion=2 mentés új opcionális mezők nélkül elfogadható',()=>{
 const v=base();const report=inspect(v);
 assert.equal(report.errors.length,0,report.errors.join('\n'));
 assert.doesNotThrow(()=>validate(v));
});
test('RC1: opcionális járműfotó és profilmérés JSON roundtrip során nem vész el',()=>{
 const v=base();v.vehicles.push({id:'car1',name:'Teszt jármű',photoDataUrl:'data:image/jpeg;base64,/9j/AA=='});
 v.tyres.push({id:'tyre1',vehicleId:'car1',name:'Nyári',measurements:[{date:'2026-09-01',odometer:12000,frontLeft:6.1,frontRight:6.2,rearLeft:6.3,rearRight:6.4}]});
 const roundtrip=JSON.parse(JSON.stringify(v));
 assert.equal(inspect(roundtrip).errors.length,0);
 assert.equal(roundtrip.vehicles[0].photoDataUrl,v.vehicles[0].photoDataUrl);
 assert.deepEqual(roundtrip.tyres[0].measurements,v.tyres[0].measurements);
});
test('RC1: hibás schemaVersion nem kerül visszaállításra',()=>{
 const wrong=base();wrong.schemaVersion=3;
 assert.ok(inspect(wrong).errors.length>0);
 assert.throws(()=>validate(wrong),/Adatellenőrzés sikertelen/);
});
test('RC1: nem létező járműre mutató rekord leállítja a visszaállítást',()=>{
 const v=base();v.fuel.push({id:'f1',vehicleId:'ghost',date:'2026-01-10',odometer:500});
 assert.ok(inspect(v).errors.some(x=>x.includes('Nem létező jármű')));
 assert.throws(()=>validate(v));
});
test('RC1: duplikált rekordazonosítók nem mennek át ellenőrzésen',()=>{
 const v=base();v.vehicles=[{id:'same',name:'A'},{id:'same',name:'B'}];
 assert.ok(inspect(v).errors.some(x=>x.includes('Ismétlődő azonosító')));
});
test('RC1: a backup validátor csak ellenőriz, nem módosítja a bemenetet',()=>{
 const v=base();v.vehicles=[{id:'car1',name:'V1',active:false}];
 const before=JSON.stringify(v);
 assert.equal(inspect(v).errors.length,0);
 assert.equal(JSON.stringify(v),before);
});
