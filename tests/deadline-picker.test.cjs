'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const a=html.indexOf('function deadlineNeedsTouchDisplay('),b=html.indexOf('function edit(',a);
assert(a>0&&b>a);const src=html.slice(a,b);
function render(ua,platform,touches){
 const ctx={navigator:{userAgent:ua,platform,maxTouchPoints:touches},esc:s=>String(s??''),date:s=>s,selectHtml:()=>''};
 vm.createContext(ctx);vm.runInContext(src,ctx);
 return vm.runInContext('inputField',ctx)('deadlines',['dueDate','Esedékesség','date',1],{dueDate:'2026-12-01'});
}
test('PC-s Chrome: Tankolásokéval azonos natív dátummező, nincs rejtett overlay',()=>{
 const s=render('Mozilla/5.0 (Windows NT 10.0) Chrome/158','Win32',0);
 assert.match(s,/type="date"/);assert.doesNotMatch(s,/deadline-date-control/);assert.doesNotMatch(s,/deadline-date-display/);
});
test('PC-s Edge érintőkijelzővel is natív mező',()=>{assert.doesNotMatch(render('Mozilla/5.0 (Windows NT 10.0) Edg/158','Win32',10),/deadline-date-control/)});
test('iPhone-on a korábbi egységes dátum-kijelzés marad',()=>{assert.match(render('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0)','iPhone',5),/deadline-date-control/)});
test('iPad modern desktop UA alatt is megtartja a korábbi kijelzést',()=>{assert.match(render('Mozilla/5.0 (Macintosh; Intel Mac OS X)','MacIntel',5),/deadline-date-control/)});
test('Mac desktop natív dátumvezérlő',()=>{assert.doesNotMatch(render('Mozilla/5.0 (Macintosh; Intel Mac OS X)','MacIntel',0),/deadline-date-control/)});
