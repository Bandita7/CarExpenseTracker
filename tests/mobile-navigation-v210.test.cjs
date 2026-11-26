'use strict';
const {test}=require('node:test'), assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
test('mobile drawer and hamburger follow common preference',()=>{assert.match(html,/data-menu-side="right".*mobile-menu-toggle/);assert.match(html,/data-menu-side="right".*mobile-menu-panel/);assert.match(html,/function changeLayoutPref/);});
test('navigation menu closes when selecting a tab',()=>assert.match(html,/function setTab\(k\)\{closeMobileMenu\(\)/));
test('appearance settings are device-local',()=>{assert.match(html,/MENU_SIDE_KEY='carMenuSide'/);assert.match(html,/DENSITY_KEY='carDisplayDensity'/);assert.match(html,/function renderAppearanceSettings/);});
test('iOS date input is width constrained',()=>assert.match(html,/input\[type="date"\].*max-width:100%!important/));
