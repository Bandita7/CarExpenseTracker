'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const h=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
test('Graph has accessible, precise tooltip on each SVG point',()=>{
 assert.match(h,/data-chart-tooltip=\"1\"/);
 assert.match(h,/class=\"chart-point\" tabindex=\"0\" data-tip=/);
 assert.match(h,/function showChartTip\(point\)/);
 assert.match(h,/document\.addEventListener\('pointerover'/);
 assert.match(h,/document\.addEventListener\('click'/);
});
test('Records can be filtered by text/date/category, non-destructively',()=>{
 assert.match(h,/listStart=''/);assert.match(h,/listEnd=''/);assert.match(h,/listCategory=''/);
 assert.match(h,/Dátumtól/);assert.match(h,/Dátumig/);assert.match(h,/Kategóriaszűrő/);
 assert.match(h,/r\.category===listCategory/);assert.match(h,/Szűrők törlése/);
});
test('Archive keeps data and can be reversed',()=>{
 assert.match(h,/showArchivedVehicles/);assert.match(h,/Visszaaktivál/);
 assert.match(h,/r\.active=archived/);
 assert.match(h,/Az adatai megmaradnak/);
});
