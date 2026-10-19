import test from 'node:test';
import assert from 'node:assert/strict';
import {validateWardrobePiece,validateDetections,validateGarmentBox,rankWardrobeOutfits,colourHarmony} from '../public/wardrobe-domain.js';
import {sampleWardrobePieces} from '../public/wardrobe-samples.js';
const item=(id,category,overrides={})=>({id,name:id,category,colour:'navy',pattern:'solid',fit:'regular',formality:1,warmth:1,available:true,...overrides});
const base=[item('shirt','top',{colour:'white',formality:2}),item('tee','top',{colour:'cream'}),item('jeans','bottom',{colour:'blue'}),item('trousers','bottom',{formality:2}),item('trainers','shoes',{colour:'white',warmth:0}),item('loafers','shoes',{colour:'brown',formality:2,warmth:0}),item('coat','layer',{colour:'grey',warmth:2,formality:2})];
test('multi-garment detection preserves separate boxes and rejects unknown categories and invalid crops',()=>{
 const result=validateDetections({items:base.slice(0,2).map((p,i)=>({...p,box:{x:i*.5,y:0,width:.45,height:1},confidence:.8}))});assert.equal(result.length,2);assert.notDeepEqual(result[0].box,result[1].box);
 assert.throws(()=>validateWardrobePiece({...base[0],category:'person'}));assert.throws(()=>validateGarmentBox({x:.8,y:0,width:.5,height:1}));assert.throws(()=>validateDetections({items:[{...result[0],confidence:NaN}]}));assert.deepEqual(validateDetections({items:[]}),[]);
});
test('recommendations contain only available owned pieces and complete outfits',()=>{
 const wardrobe=[...base,item('laundry','top',{available:false})];const result=rankWardrobeOutfits(wardrobe);assert.ok(result.outfits.length>=2);
 for(const look of result.outfits){assert.ok(look.items.every(p=>wardrobe.includes(p)&&p.available));assert.ok(look.items.some(p=>p.category==='shoes'));assert.ok(look.items.some(p=>p.category==='top'));assert.ok(look.items.some(p=>p.category==='bottom'));assert.ok(look.reasons.length>=2);}
 assert.equal(new Set(result.outfits.map(o=>o.id)).size,result.outfits.length);
});
test('smart, active, weather and anchor constraints stay explicit rather than relaxing silently',()=>{
 const smart=rankWardrobeOutfits(base,{occasion:'smart',weather:'mild',anchor:'shirt'});assert.ok(smart.outfits.length);assert.ok(smart.outfits.every(o=>o.items.every(p=>p.formality>=2)&&o.items.some(p=>p.id==='shirt')));
 const cold=rankWardrobeOutfits(base,{weather:'cold'});assert.ok(cold.outfits.length);assert.ok(cold.outfits.every(o=>o.items.filter(p=>p.category!=='shoes').reduce((s,p)=>s+p.warmth,0)>=3));
 assert.ok(rankWardrobeOutfits(base,{weather:'warm'}).outfits.every(o=>o.items.every(p=>p.warmth<2)));
 assert.equal(rankWardrobeOutfits(base,{occasion:'active'}).outfits.length,0);assert.equal(rankWardrobeOutfits(base,{anchor:'not-owned'}).outfits.length,0);
 assert.equal(rankWardrobeOutfits([base[0]]).outfits.length,0);
});
test('one-pieces work without invented trousers and accessories can anchor a look',()=>{
 const dress=item('dress','onepiece');const outfit=rankWardrobeOutfits([dress,base[4]]);assert.equal(outfit.outfits.length,1);assert.equal(outfit.outfits[0].items.length,2);
 const scarf=item('scarf','accessory');const anchored=rankWardrobeOutfits([...base,scarf],{anchor:'scarf'});assert.ok(anchored.outfits.length);assert.ok(anchored.outfits.every(o=>o.items.some(p=>p.id==='scarf')));
});
test('colour direction changes contrast preference without pretending to measure good taste',()=>{assert.ok(colourHarmony('blue','orange','bold').score>colourHarmony('blue','orange','quiet').score);assert.ok(colourHarmony('white','green').score>0);assert.ok(colourHarmony('blue','purple').score>0);});
test('sample wardrobe has 16 distinct labelled pieces and supports everyday, smart and cold outfits',()=>{
 assert.equal(sampleWardrobePieces.length,16);assert.equal(new Set(sampleWardrobePieces.map(p=>p.id)).size,16);
 assert.equal(new Set(sampleWardrobePieces.map(p=>p.category)).size,6);
 for(const p of sampleWardrobePieces){assert.doesNotThrow(()=>validateWardrobePiece(p));assert.equal(p.sample,true);assert.match(p.image,/^data:image\/svg\+xml/);}
 for(const prefs of [{occasion:'casual'},{occasion:'smart'},{weather:'cold'}])assert.ok(rankWardrobeOutfits(sampleWardrobePieces,prefs).outfits.length>=3);
});
