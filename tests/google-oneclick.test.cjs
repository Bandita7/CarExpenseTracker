'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
function functionSource(name){
 const start=source.indexOf('function '+name+'(');
 assert(start>=0,'missing '+name);
 const brace=source.indexOf('{',start);
 let depth=0,inString=null,escaped=false;
 for(let i=brace;i<source.length;i++){
  const c=source[i];
  if(inString){if(escaped)escaped=false;else if(c==='\\')escaped=true;else if(c===inString)inString=null;continue}
  if(c==='"'||c==="'"||c==='`'){inString=c;continue}
  if(c==='{')depth++;
  else if(c==='}'&&--depth===0)return source.slice(start,i+1);
 }
 throw Error('unclosed function '+name);
}
const raw=functionSource('driveButtons');
function verifyButton({token,remembered,expiry=Date.now()+100000,busy=false}){
 const elements={};for(const id of ['drive-save','drive-refresh','drive-logout','drive-restore','drive-login','drive-backups','sync-now','sync-test'])elements[id]={disabled:false,value:'backup'};
 const context={driveToken:token,driveTokenExpiry:expiry,driveBusy:busy,driveRemembered:()=>remembered,$:id=>elements[id]};
 vm.createContext(context);vm.runInContext(raw+'\ndriveButtons();',context);return elements;
}
test('lejárt token és korábban csatlakoztatott fiók: egygombos szinkron engedélyezett',()=>{
 const e=verifyButton({token:null,remembered:true});assert.equal(e['sync-now'].disabled,false);assert.equal(e['sync-now'].textContent,'Google-csatlakozás és szinkronizálás');assert.equal(e['drive-save'].disabled,true)
});
test('sosem csatlakoztatott fiók: szinkron gomb letiltva',()=>{
 const e=verifyButton({token:null,remembered:false});assert.equal(e['sync-now'].disabled,true)
});
test('érvényes token: változatlan kézi szinkron',()=>{
 const e=verifyButton({token:'access-token',remembered:true});assert.equal(e['sync-now'].disabled,false);assert.equal(e['sync-now'].textContent,'Szinkronizálás most')
});
test('folyamatban lévő Drive-művelet: gomb letiltva',()=>{
 const e=verifyButton({token:null,remembered:true,busy:true});assert.equal(e['sync-now'].disabled,true)
});
test('a kapcsolat helyreállítása csak sikeres token és mentéslista után indítja a kézi szinkront',()=>{
 assert(source.includes("if(resumeSync){syncNotice('✓ Google-kapcsolat helyreállt."));
 assert(source.includes("return syncNow(false)"));
 assert(source.includes("if(resumeSync)syncNotice('A Google-kapcsolat helyreállt, de a Drive-olvasás sikertelen."));
 assert(source.includes('login.onclick=()=>driveLogin(false)'));
});
