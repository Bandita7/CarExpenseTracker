'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
test('Határidő mező valódi natív dátum inputot használ',()=>{
 assert.ok(html.includes('class="deadline-date-control"'));
 assert.ok(html.includes('input data-key="${key}" type="date"'));
});
test('Asztali hover + fine pointer esetén natív dátummező látható',()=>{
 const css=html.split('@media (hover:hover) and (pointer:fine){')[1]?.split('@media(max-width:1399px)',1)[0]||'';
 assert.ok(css.includes('.deadline-form-fields .deadline-date-display{display:none}'));
 assert.ok(css.includes('opacity:1!important'));
 assert.ok(css.includes('appearance:auto'));
});
test('Mobil érintőeszközön továbbra is natív date input olvassa az értéket',()=>{
 assert.ok(html.includes('input[type=date]{position:absolute!important'));
 assert.ok(html.includes('opacity:0!important'));
});
