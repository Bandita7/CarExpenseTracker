'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const src=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
test('DOT format is bounded',()=>{assert.match(src,/week<1\|\|week>53/);assert.match(src,/function tyreDotLabel/)});
test('Tread history retains optional legacy records',()=>{assert.match(src,/Array\.isArray\(set\.treadMeasurements\)/);assert.match(src,/function tyreLatestLabel/)});
test('Four measured wheel positions and date validation',()=>{for(const pos of ["fl","fr","rl","rr"])assert.ok(src.includes("['"+pos+"',"));assert.match(src,/function validTyreMeasurement/)});
test('Measurements persisted on existing tyre record',()=>{assert.match(src,/set\.treadMeasurements=before\.filter/);assert.match(src,/await persist\(\);render\(\);openTyreMeasurements/)});
