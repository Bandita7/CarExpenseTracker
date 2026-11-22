#!/usr/bin/env node
'use strict';
const fs=require('node:fs'), path=require('node:path'), assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'manifest.webmanifest'),'utf8'));
const cacheMatch=sw.match(/const CACHE='carexpense-v(\d+\.\d+\.\d+)'/);
assert(cacheMatch,'A service worker cache-verziója hiányzik.');
const version=cacheMatch[1];
const label=`v${version} BÉTA`;
const checks=[
 ['index.html <title>',html.includes(`<title>CarExpense Tracker ${label}</title>`)],
 ['látható fejléc',new RegExp(`<header>[\\s\\S]*?${label.replaceAll('.','\\.')}`).test(html)],
 ['Névjegy verzió',html.includes(`id="about-version">${label} ▸`)],
 ['Súgó aktuális verzió',html.includes(`CarExpense Tracker ${label} · Használati útmutató`)],
 ['verziótörténet első bejegyzése',html.includes(`const RELEASE_NOTES=[\n ['${label}'`)],
 ['cache név',sw.includes(`const CACHE='carexpense-v${version}'`)],
 ['service worker fájl',fs.existsSync(path.join(root,'sw.js'))],
 ['manifest',!!manifest.name && !!manifest.icons?.length],
 ['ikon 192',fs.existsSync(path.join(root,'icons/icon-192.png'))],
 ['ikon 512',fs.existsSync(path.join(root,'icons/icon-512.png'))],
 ['automatikus szinkron tiltott',html.includes('function autoSyncEnabled(){return false}')],
];
const releaseSection=html.split('const RELEASE_NOTES=[',2)[1]?.split('];',1)[0]||'';
const releases=[...releaseSection.matchAll(/\['(v\d+(?:\.\d+)*(?: BÉTA)?)','/g)].map(m=>m[1]);
checks.push(['verziótörténet duplikációmentes',new Set(releases).size===releases.length]);
const nums=releases.map(x=>x.match(/\d+/g).map(Number));
const desc=nums.every((a,i)=>i===0||((a[0]-nums[i-1][0])||((a[1]??0)-(nums[i-1][1]??0))||((a[2]??0)-(nums[i-1][2]??0)))<=0);
checks.push(['verziótörténet csökkenő sorrend',desc]);
checks.push(['korábbi verziók szerepelnek',releases.includes('v1.7.7 BÉTA')&&releases.includes('v1.6.0 BÉTA')]);
for(const [name,ok] of checks)console.log(`${ok?'OK':'HIBA'} ${name}`);
assert(!checks.some(([,ok])=>!ok),'Hibás kiadási ellenőrzés');
console.log(`Összesen ${checks.length} sikeres kiadási ellenőrzés`);
