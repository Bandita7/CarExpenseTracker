'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const fragment=html.split('function syncReadinessSummary(')[1].split('async function syncReadOnlyHealth(',1)[0];
function run(local,base,kind,heads){const ctx={SYNC_KEYS:['fuel','services','deadlines'],syncCompare:(a,b)=>JSON.stringify(a)===JSON.stringify(b),syncRows:(o,k)=>o?.[k]||[],local,base,kind,heads};vm.createContext(ctx);return vm.runInContext('function syncReadinessSummary('+fragment+'; syncReadinessSummary(local,base,kind,heads)',ctx)}
test('közös alap nélkül nem állít változásmentességet',()=>{const r=run({fuel:[]},null,'initial',1);assert.equal(r.changed,null);assert.match(r.display,/nincs korábbi közös/)});
test('változatlan helyi rekordok: 0 kategória',()=>{const d={fuel:[{id:1}],services:[],deadlines:[]};const r=run(d,{snapshot:d},'none',1);assert.equal(r.changed,0);assert.match(r.display,/nincs helyi módosítás/)});
test('csak különböző kategóriákat számol, személyes rekordot nem közöl',()=>{const r=run({fuel:[{id:1,plate:'SECRET'}],services:[{id:2}],deadlines:[]},{snapshot:{fuel:[],services:[],deadlines:[]}},'remote',1);assert.equal(r.changed,2);assert.doesNotMatch(r.display,/SECRET/);assert.match(r.display,/új felhőmódosítás/)});
test('párhuzamos felhőágak figyelmeztetése',()=>{const r=run({fuel:[]},{snapshot:{fuel:[]}},'fork',2);assert.match(r.display,/párhuzamos felhőágak/);assert.equal(r.heads,2)});
test('csak olvasó útvonal; nincs feltöltés, vagy helyi commit',()=>{const body=html.split('async function syncReadOnlyHealth(automatic=false){')[1].split('// v1.9.4: opt-in, foreground-only',1)[0];for(const forbidden of ['syncUpload(', 'syncCommitLocal(', 'driveLogin(', 'syncNow('])assert.equal(body.includes(forbidden),false,forbidden);assert.match(body,/syncReadinessSummary\(data,base,pendingCloud,history.heads.length\)/)});
test('automatikus szinkron továbbra is tiltott',()=>assert.match(html,/function autoSyncEnabled\(\)\{return false\}/));
