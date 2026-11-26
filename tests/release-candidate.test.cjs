'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const sw=fs.readFileSync(path.join(__dirname,'../sw.js'),'utf8');
test('STABLE release label is consistent in PWA',()=>{
 assert.match(html,/<title>CarExpense Tracker v2\.8\.0 BÉTA<\/title>/);
 assert.match(html,/id="about-version">v2\.8\.0 BÉTA/);
 assert.match(sw,/carexpense-v2\.8\.0/);
});
test('Release history retains the previous beta',()=>{
 const notes=html.match(/const RELEASE_NOTES=\[([\s\S]*?)\];/)[1];
 assert.ok(notes.indexOf("['v2.1.0 BÉTA'")<notes.indexOf("['v2.0 STABLE'"));
});
test('Automated write sync requires opt in for experimental BETA',()=>{
 assert.match(html,/function autoSyncEnabled\(\)\{try\{return localStorage\.getItem\('carAutoSync'\)==='1'\}catch\{return false\}\}/);
 assert.match(html,/auto\.disabled=false/);
});
test('Export and import retain explicit user confirmation',()=>{
 assert.match(html,/async function backupBeforeReplace\(reason\)/);
 assert.match(html,/async function saveJsonToFiles\(/);
 assert.match(html,/function backupReview\(/);
 assert.match(html,/async function restoreCommit\(/);
});
test('Read-only local and preflight review remain available',()=>{
 assert.match(html,/Helyi állapotellenőrzés \(csak olvasás\)/);
 assert.match(html,/async function releasePreflightCheck\(/);
 assert.match(html,/async function localStabilityCheck\(/);
});
test('Offline navigation has an app-shell fallback',()=>{
 assert.match(sw,/if\(e\.request\.mode===\'navigate\'\)/);
 assert.match(sw,/caches\.match\(\'\.\/index\.html\'\)/);
});
