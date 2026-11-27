'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
const workflow=fs.readFileSync(path.join(root,'.github/workflows/safety-check.yml'),'utf8');
const seed=html.match(/<script id="seed" type="application\/json">([^<]*)<\/script>/);
test('RC1: gyári adatállomány továbbra is schemaVersion=2 és üres próbaadat',()=>{
 assert.ok(seed);const data=JSON.parse(seed[1]);assert.equal(data.schemaVersion,2);
 assert.equal(data.vehicles.length,0);assert.equal(data.fuel.length,0);
});
test('RC1: PWA cache elkülönül v2.10.2-től, offline fallback megmarad',()=>{
 assert.match(sw,/carexpense-v3\.0\.0-rc1/);
 assert.match(sw,/caches\.match\('\.\/index\.html'\)/);
 assert.match(sw,/SKIP_WAITING/);
});
test('RC1: automatikus Drive-szinkron csak készülékoldali opt-in',()=>{
 assert.match(html,/localStorage\.getItem\('carAutoSync'\)==='1'/);
 assert.match(html,/function autoSyncPaused\(/);
 assert.match(html,/autoSyncDeferred/);
});
test('RC1: járműképek tömörített JPEG-ként méretkorláttal',()=>{
 assert.match(html,/const VEHICLE_PHOTO_MAX_BYTES=95000/);
 assert.match(html,/async function compressVehiclePhoto\(/);
 assert.match(html,/photoDataUrl/);
});
test('RC1: iOS date overlay, menügesztus és PDF-generátor a forrásban maradt',()=>{
 assert.match(html,/vehicle-date-control/);
 assert.match(html,/mobile-menu-panel/);
 assert.match(html,/function.*[Pp]df|pdf/i);
});
test('RC1: GitHub Actions továbbra is a release és Node teszteket futtatja',()=>{
 assert.match(workflow,/node scripts\/release-check\.cjs/);
 assert.match(workflow,/node --test tests\/\*\.test\.cjs/);
});
