
'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
test('Auto sync is opt-in and defaults OFF, explicit confirmation and baseline required',()=>{
 const src=html.match(/function autoSyncEnabled\(\)\{[^\n]+/)[0];
 const ctx={localStorage:{getItem:()=>null}};vm.runInNewContext(src+';globalThis.testValue=autoSyncEnabled()',ctx);assert.equal(ctx.testValue,false);
 assert.match(html,/auto\.onchange=async\(\)=>/);
 assert.match(html,/await syncBaseRead\(\)/);
 assert.match(html,/KÍSÉRLETI AUTOMATIKUS SZINKRON/);
 assert.match(html,/localStorage\.setItem\('carAutoSync','1'\)/);
});
test('No token refresh, first-sync or cloud fork merge silently on automatic path',()=>{
 assert.match(html,/if\(automatic&&\(!autoSyncEnabled\(\)/);
 assert.match(html,/if\(history\.heads\.length>1&&automatic\)/);
 assert.match(html,/if\(automatic\)throw Error\('Közben egy másik készülék új felhőágat/);
 assert.match(html,/if\(automatic\)autoSyncApplying=true/);
 assert.match(html,/if\(automatic\)autoSyncApplying=false/);
 assert.match(html,/if\(automatic\)setAutoSyncPaused\(true\)/);
});
test('Experimental autosync is not silently enabled by the stable version',()=>{
 assert.match(html,/id="sync-auto"/);
 assert.match(html,/auto\.checked=autoSyncEnabled\(\)/);
 assert.match(html,/automatikus.*szinkron.*alapból KI/i);
});
