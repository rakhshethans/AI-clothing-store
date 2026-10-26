import test from 'node:test';
import assert from 'node:assert/strict';
import {boxIoU,evaluatePhoto,summariseRecognition} from '../scripts/recognition-evaluation.mjs';
const a={category:'top',box:{x:0,y:0,width:.4,height:.4}},b={category:'bottom',box:{x:.5,y:.5,width:.4,height:.4}};
test('detection metrics penalise duplicates, wrong categories and missed garments',()=>{
 const r=evaluatePhoto([a,b],[{...a,confidence:.9},{...a,confidence:.8},{...b,category:'layer',confidence:.7}]);
 assert.equal(r.truePositives,1);assert.equal(r.falsePositives,2);assert.equal(r.falseNegatives,1);assert.equal(r.duplicates,1);
 const s=summariseRecognition([r]);assert.equal(s.precision,1/3);assert.equal(s.recall,.5);assert.equal(s.byCategory.bottom.recall,0);
});
test('metrics require localisation and preserve empty-control false positives',()=>{
 assert.equal(boxIoU(a.box,a.box),1);assert.equal(boxIoU(a.box,b.box),0);
 assert.equal(evaluatePhoto([a],[{...a,box:b.box,confidence:.9}]).truePositives,0);
 const blank=evaluatePhoto([],[{...a,confidence:.9}]);assert.equal(blank.falsePositives,1);assert.equal(summariseRecognition([blank]).recall,null);
 assert.throws(()=>evaluatePhoto([a],[{...a,confidence:NaN}]));assert.throws(()=>boxIoU({...a.box,width:0},b.box));
});
