'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const body=html.split('// v2.7 – printable vehicle report.')[1].split('function renderDashboard(){')[0];
test('PDF report uses an offline client-side generator without network calls',()=>{assert.match(body,/function makeHistoryPdf\(/);assert.match(body,/function saveHistoryPdf\(/);assert.doesNotMatch(body,/fetch\(|driveUpload|driveSave|saveData\(/)});
test('Sensitive details default to off',()=>{assert.match(body,/identifiers:false,amounts:false,notes:false/)});
test('One vehicle only and no baseline services',()=>{assert.match(body,/r\.vehicleId===carId/);assert.match(body,/!x\.baseline/)});
test('Escape report cells',()=>{assert.match(body,/row\.map\(cell=>'<td>'\+esc\(cell/)});
test('Entry point in tabs and print CSS',()=>{assert.match(html,/report:'PDF autóelőélet'/);assert.match(html,/@media print\{/);assert.match(html,/renderVehicleReport\(\)/)});
