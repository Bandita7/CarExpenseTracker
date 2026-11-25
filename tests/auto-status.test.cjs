const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
test('Separate current attention banner from last success',()=>{assert.match(html,/id="sync-attention"/);assert.match(html,/id="sync-last-result"/)});
test('Offline pending data computed from local sync base',()=>{assert.match(html,/syncAttentionRefresh/);assert.match(html,/SYNC_KEYS\.some\(k=>!syncCompare/);assert.match(html,/Offline: helyi változások várnak feltöltésre/)});
test('Expired token blocks and explains auto sync',()=>{assert.match(html,/Google-hozzáférés lejárt vagy hiányzik/);assert.match(html,/if\(!driveToken\|\|Date\.now\(\)>=driveTokenExpiry\)/)});
test('Auto failure persists warning; success clears it',()=>{assert.match(html,/syncAttentionSet\('⚠ Automatikus szinkron hibája/);assert.match(html,/function syncShowResult\(summary\)\{\s*syncAttentionSet\(''\)/)});
test('Manual only OAuth flow retained',()=>{assert.match(html,/driveLogin\(true\)/);assert.match(html,/if\(automatic&&\(!autoSyncEnabled/)});
