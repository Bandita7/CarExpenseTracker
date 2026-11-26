'use strict';
const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8'),sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
test('v2.1 stable release is first, RC2 and RC1 are preserved',()=>{assert.match(html,/const RELEASE_NOTES=\[\s*\['v2\.7\.0 BÉTA'/);assert.match(html,/\['v2\.1 RC2'/);assert.match(html,/\['v2\.1 RC1'/);});
test('stable cache bumped and desktop backup remains a browser download',()=>{assert.match(sw,/carexpense-v2\.7\.0/);assert.match(html,/async function saveJsonToFiles\(/);assert.match(html,/async function backupBeforeReplace\(/);});
