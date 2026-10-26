// Detection evaluation: class-correct one-to-one matching, normalised boxes.
export function boxIoU(a,b){
 for(const box of [a,b])if(!box||!['x','y','width','height'].every(k=>Number.isFinite(box[k]))||box.width<=0||box.height<=0)throw Error('Invalid evaluation box.');
 const area=Math.max(0,Math.min(a.x+a.width,b.x+b.width)-Math.max(a.x,b.x))*Math.max(0,Math.min(a.y+a.height,b.y+b.height)-Math.max(a.y,b.y));
 return area/(a.width*a.height+b.width*b.height-area);
}
export function evaluatePhoto(expected,predicted,iouThreshold=.5){
 if(!Array.isArray(expected)||!Array.isArray(predicted)||!Number.isFinite(iouThreshold)||iouThreshold<0||iouThreshold>1)throw Error('Invalid evaluation inputs.');
 const categories=new Set(['top','bottom','layer','onepiece','shoes','accessory']);
 for(const item of [...expected,...predicted]){if(!categories.has(item.category))throw Error('Invalid evaluation category.');boxIoU(item.box,item.box);}
 for(const item of predicted)if(!Number.isFinite(item.confidence)||item.confidence<0||item.confidence>1)throw Error('Invalid prediction confidence.');
 const matched=new Set(),byCategory={};let tp=0,duplicates=0;
 for(const item of expected){byCategory[item.category]??={expected:0,predicted:0,truePositives:0};byCategory[item.category].expected++;}
 for(const item of [...predicted].sort((a,b)=>b.confidence-a.confidence)){
  byCategory[item.category]??={expected:0,predicted:0,truePositives:0};byCategory[item.category].predicted++;
  let best=-1,overlap=-1;
  expected.forEach((target,index)=>{if(target.category!==item.category||matched.has(index))return;const score=boxIoU(target.box,item.box);if(score>=iouThreshold&&score>overlap){best=index;overlap=score;}});
  if(best>=0){matched.add(best);tp++;byCategory[item.category].truePositives++;}
  else if(expected.some((target,index)=>matched.has(index)&&target.category===item.category&&boxIoU(target.box,item.box)>=iouThreshold))duplicates++;
 }
 return {expected:expected.length,predicted:predicted.length,truePositives:tp,falsePositives:predicted.length-tp,falseNegatives:expected.length-tp,duplicates,byCategory};
}
export function summariseRecognition(rows){
 const summary={photos:rows.length,expected:0,predicted:0,truePositives:0,falsePositives:0,falseNegatives:0,duplicates:0,byCategory:{}};
 for(const row of rows){for(const key of ['expected','predicted','truePositives','falsePositives','falseNegatives','duplicates'])summary[key]+=row[key];for(const [category,counts]of Object.entries(row.byCategory)){summary.byCategory[category]??={expected:0,predicted:0,truePositives:0};for(const key of Object.keys(counts))summary.byCategory[category][key]+=counts[key];}}
 const ratios=counts=>({...counts,precision:counts.predicted?counts.truePositives/counts.predicted:null,recall:counts.expected?counts.truePositives/counts.expected:null});
 for(const category of Object.keys(summary.byCategory))summary.byCategory[category]=ratios(summary.byCategory[category]);
 return ratios(summary);
}
