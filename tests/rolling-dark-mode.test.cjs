'use strict';
const {test}=require('node:test');const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const code=html.match(/function fuelRollingSeries\(points,windowSize\)\{[\s\S]*?\n\}/)?.[0];
assert.ok(code,'The rolling average implementation must exist');
const rolling=vm.runInNewContext(code+';fuelRollingSeries;');
const points=Array.from({length:11},(_,i)=>({liters:30+i,distance:500+i*30}));
for(const n of [3,5,10])test(`weighted moving fuel consumption over ${n} segments`,()=>{
 const result=rolling(points,n);assert.equal(result.length,points.length-n+1);assert.equal(result[0][0],n-1);
 const sample=points.slice(0,n),expected=100*sample.reduce((a,p)=>a+p.liters,0)/sample.reduce((a,p)=>a+p.distance,0);
 assert.ok(Math.abs(result[0][1]-expected)<1e-12);
});
test('reject unsupported window sizes',()=>assert.throws(()=>rolling(points,4),/Érvénytelen/));
test('too few valid sections yields no rolling samples',()=>assert.equal(rolling(points.slice(0,2),3).length,0));
test('theme and rolling settings remain device-local, outside sync model',()=>{
 assert.match(html,/const THEME_KEY='carAppearanceTheme',ROLLING_KEY='carRollingFuelWindow'/);
 assert.match(html,/localStorage\.setItem\(THEME_KEY,value\)/);
 assert.match(html,/localStorage\.setItem\(ROLLING_KEY,String\(rollingFuelWindow\)\)/);
 assert.match(html,/prefers-color-scheme: dark/);
 assert.match(html,/html\[data-theme="dark"\] \.chart/);
 assert.match(html,/html\[data-theme="dark"\] \.deadline-date-control/);
 assert.match(html,/<option value="10"/);
 assert.match(html,/v2\.1 STABLE/);
});
