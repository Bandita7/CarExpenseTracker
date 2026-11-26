const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const h=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
test('Mobil PDF offline generálással, nem window.print hívással',()=>{assert.match(h,/function makeHistoryPdf\(/);assert.match(h,/navigator\.share\(\{files:/);assert.match(h,/saveHistoryPdf\(blob,filename\)/);assert.doesNotMatch(h,/report-print'\)\.onclick=\(\)=>.*window\.print/)});
test('Járműfotó tömörítés, méretkorlát és adatlap',()=>{assert.match(h,/VEHICLE_PHOTO_MAX_BYTES=95000/);assert.match(h,/function compressVehiclePhoto\(/);assert.match(h,/state\.photoDataUrl=await compressVehiclePhoto/);assert.match(h,/vehiclePhotoHtml\(v\)/)});
test('A riportalapon is szerepel a járműfotó és tördelés',()=>{assert.match(h,/vehiclePhotoHtml\(car,'report-photo'\)/);assert.match(h,/overflow-wrap:anywhere/);assert.match(h,/function makeHistoryPdf\(/)});
