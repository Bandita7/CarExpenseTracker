'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const sw=fs.readFileSync(path.join(__dirname,'../sw.js'),'utf8');
test('RC1 release label is consistent in PWA',()=>{
 assert.match(html,/<title>CarExpense Tracker v2\.0 RC1<\/title>/);
 assert.match(html,/id="about-version">v2\.0 RC1/);
 assert.match(sw,/carexpense-v2\.0\.0-rc1/);
});
test('Release history retains the previous beta',()=>{
 const notes=html.match(/const RELEASE_NOTES=\[([\s\S]*?)\];/)[1];
 assert.ok(notes.indexOf("['v2.0 RC1'")<notes.indexOf("['v1.9.9 BÉTA'"));
});
test('Automated write sync remains disabled in RC1',()=>{
 assert.match(html,/function autoSyncEnabled\(\)\{return false\}/);
 assert.match(html,/auto\.disabled=true/);
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
