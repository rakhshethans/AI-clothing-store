import {localRecognitionPolicy as policy} from './recognition-config.js';
import {validateGarmentBox} from './wardrobe-domain.js';
export const localGarmentLabels={bag:'accessory',bottom:'bottom',dress:'onepiece',hat:'accessory',outer:'layer',shoes:'shoes',top:'top'};
const names={bag:'Bag',bottom:'Bottom',dress:'One-piece',hat:'Hat',outer:'Outer layer',shoes:'Shoes',top:'Top'};
export function recognitionImageSize(width,height){
 if(![width,height].every(v=>Number.isInteger(v)&&v>0))throw Error('Invalid image dimensions.');
 const short=Math.min(width,height),long=Math.max(width,height);
 let targetShort=policy.shortestEdge;
 if(long/short*targetShort>policy.longestEdge)targetShort=Math.max(1,Math.floor(policy.longestEdge*short/long));
 return width<=height?{width:targetShort,height:Math.min(policy.longestEdge,Math.floor(targetShort*height/width))}:{height:targetShort,width:Math.min(policy.longestEdge,Math.floor(targetShort*width/height))};
}
// Conditional DETR uses independent sigmoid scores, not softmax or a background class.
export function garmentPredictions(output,width,height){
 const logits=output?.logits,boxes=output?.pred_boxes,classes=policy.labels.length;
 if(logits?.dims?.length!==3||logits.dims[0]!==1||logits.dims[2]!==classes||!Number.isInteger(logits.dims[1])||logits.dims[1]<1||logits.dims[1]>1000||boxes?.dims?.length!==3||boxes.dims[0]!==1||boxes.dims[1]!==logits.dims[1]||boxes.dims[2]!==4||logits.data?.length!==logits.dims[1]*classes||boxes.data?.length!==logits.dims[1]*4||![width,height].every(v=>Number.isFinite(v)&&v>0))throw Error('Invalid local model output.');
 const predictions=[];
 for(let q=0;q<logits.dims[1];q++){
  let best=-Infinity,label=-1,valid=true;
  for(let c=0;c<classes;c++){const value=logits.data[q*classes+c];if(!Number.isFinite(value)){valid=false;break;}if(value>best){best=value;label=c;}}
  const [cx,cy,w,h]=Array.from(boxes.data.slice(q*4,q*4+4));
  if(!valid||![cx,cy,w,h].every(Number.isFinite)||w<=0||h<=0)continue;
  const score=best>=0?1/(1+Math.exp(-best)):Math.exp(best)/(1+Math.exp(best));
  if(score<policy.threshold)continue;
  predictions.push({label:policy.labels[label],score,box:{xmin:(cx-w/2)*width,ymin:(cy-h/2)*height,xmax:(cx+w/2)*width,ymax:(cy+h/2)*height}});
 }
 return predictions;
}
export function localGarmentDrafts(predictions,width,height){
 if(!Array.isArray(predictions)||predictions.length>1000||![width,height].every(v=>Number.isFinite(v)&&v>0))throw Error('Invalid local recognition result.');
 const candidates=[];
 for(const prediction of predictions){
  const category=Object.hasOwn(localGarmentLabels,prediction.label)?localGarmentLabels[prediction.label]:null,b=prediction.box;
  if(!category||!Number.isFinite(prediction.score)||prediction.score<policy.threshold||prediction.score>1||!b||!['xmin','ymin','xmax','ymax'].every(k=>Number.isFinite(b[k])))continue;
  const x=Math.max(0,Math.min(1,b.xmin/width)),y=Math.max(0,Math.min(1,b.ymin/height));
  const right=Math.max(0,Math.min(1,b.xmax/width)),bottom=Math.max(0,Math.min(1,b.ymax/height));
  let box;try{box=validateGarmentBox({x,y,width:right-x,height:bottom-y});}catch{continue;}
  candidates.push({name:names[prediction.label],category,colour:'white',pattern:'solid',fit:'regular',formality:1,warmth:1,confidence:prediction.score,box});
 }
 const kept=[];
 for(const item of candidates.sort((a,b)=>b.confidence-a.confidence)){
  const duplicate=kept.some(other=>{
   if(other.category!==item.category)return false;
   const a=item.box,b=other.box;
   const intersection=Math.max(0,Math.min(a.x+a.width,b.x+b.width)-Math.max(a.x,b.x))*Math.max(0,Math.min(a.y+a.height,b.y+b.height)-Math.max(a.y,b.y));
   return intersection/(a.width*a.height+b.width*b.height-intersection)>policy.nmsIoU;
  });
  if(!duplicate)kept.push(item);
  if(kept.length===policy.maxItems)break;
 }
 return {items:kept};
}

// A flat-colour image has no spatial evidence from which to identify clothes.
export function hasImageDetail(data,channels=3){
 if(!data||![3,4].includes(channels)||data.length<channels||data.length%channels)throw Error('Invalid image pixels.');
 const min=[255,255,255],max=[0,0,0];
 for(let i=0;i<data.length;i+=channels)for(let c=0;c<3;c++){const value=data[i+c];if(!Number.isFinite(value)||value<0||value>255)throw Error('Invalid image pixels.');min[c]=Math.min(min[c],value);max[c]=Math.max(max[c],value);if(max[c]-min[c]>=policy.minimumSpatialRange)return true;}
 return false;
}
