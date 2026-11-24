'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const h=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
test('A felhő aláírása az összes fájl metaadatát is tartalmazza',()=>{
 const src=h.slice(h.indexOf('async function syncLoadHistory('),h.indexOf('function syncMergeCloudHeads('));
 assert.match(src,/files\.map\(f=>\[f\.id,f\.modifiedTime\?\?null,f\.size\?\?null,f\.md5Checksum\?\?null\]\)/);
 assert.match(src,/JSON\.stringify\(\{heads:heads\.map\(h=>h\.id\),files:revisionSignature\}\)/);
});
test('A szinkron preflight és végső vizsgálata a kibővített aláírást veti össze',()=>{
 const src=h.slice(h.indexOf('async function syncNowCore('),h.indexOf('function driveLogout('));
 assert.match(src,/checkHistory\.signature!==history\.signature/);
 assert.match(src,/finalHistory\.signature!==history\.signature/);
});
test('Részletes időmérés számlál és törli az ideiglenes metrikákat',()=>{
 assert.match(h,/syncMetrics=\{get:0,retry:0,cacheHit:0,media:0/);
 assert.match(h,/syncMetrics\.retry\+\+/);
 assert.match(h,/syncMetrics\.cacheHit\+\+/);
 assert.match(h,/typeof syncMetrics!==['\"]undefined['\"]\)syncMetrics=null/);
});
