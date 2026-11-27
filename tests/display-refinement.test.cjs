'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const style=html.split('<style>')[1].split('</style>')[0];
test('Font preference offers four device-local sizes',()=>{
 assert.match(html,/FONT_SIZE_KEY='carDisplayFontSize'/);
 assert.match(html,/localStorage\.setItem\(FONT_SIZE_KEY,value\)/);
 for(const name of ['small','normal','large','xlarge'])assert.match(style,new RegExp('data-font-size="'+name+'"'));
 assert.match(html,/id="appearance-font-setting"/);
});
test('Density is independent of font size and has visible row changes',()=>{
 assert.match(html,/changeLayoutPref\('density',density.value\)/);
 assert.match(html,/changeLayoutPref\('font',fontSetting.value\)/);
 assert.match(style,/data-density="compact"[^}]*\.scroll td/);
 assert.match(style,/padding:4px 6px!important/);
});
test('Mobile controls retain safe dimensions and date overlay',()=>{
 assert.match(style,/min-height:44px/);
 assert.match(style,/\.vehicle-date-display/);
 assert.match(html,/function autoSyncEnabled\(\)/);
});
