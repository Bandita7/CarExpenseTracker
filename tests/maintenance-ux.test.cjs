const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
test('v2.3 displays maintenance overview on dashboard',()=>{assert.match(html,/renderDashboard\(\);renderDeadlineSummary\(\);renderMaintenanceSummary\(\)/);assert.match(html,/function renderMaintenanceSummary\(\)/);});
test('v2.3 maintenance counts cover all statuses',()=>{for(const value of ['Lejárt','Hamarosan','Rendben','Nincs alapadat'])assert.ok(html.includes(value));assert.match(html,/function maintenanceStatusCounts\(plans\)/);});
test('v2.3 maintenance filter stays read only',()=>{assert.match(html,/id="maintenance-state-filter"/);assert.match(html,/sel.onchange=draw;draw\(\)/);assert.match(html,/plans.filter\(p=>chosen===/);});
test('v2.3 rolling-average insufficient data warning',()=>{assert.match(html,/gördülő átlaghoz még nincs elegendő adat/);assert.match(html,/értékelhető szakasz/);});
test('v2.3 retains existing maintenance rules and sync model',()=>{assert.match(html,/function servicePlan\(type\)/);assert.match(html,/function rulesFor\(type\)/);assert.match(html,/const SYNC_KEYS=\[/);assert.match(html,/function autoSyncEnabled\(\)/);});
