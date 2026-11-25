'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
test('v2.1 STABLE has fresh PWA cache and preserves previous release',()=>{
 assert.match(sw,/carexpense-v2\.1\.0-stable/);
 assert.match(html,/const RELEASE_NOTES=\[\s*\['v2\.1 STABLE'/);
 assert.match(html,/\['v2\.1\.3 BÉTA'/);
});
test('Auto sync requires explicit opt in and conflict pause safeguards',()=>{
 assert.match(html,/localStorage\.getItem\('carAutoSync'\)==='1'/);
 assert.match(html,/function autoSyncPaused\(/);
 assert.match(html,/autoSyncDeferred/);
});
test('JSON recovery and secure read-only inspection stay available',()=>{
 assert.match(html,/async function backupBeforeReplace\(/);
 assert.match(html,/async function localStabilityCheck\(/);
 assert.match(html,/async function releasePreflightCheck\(/);
});
