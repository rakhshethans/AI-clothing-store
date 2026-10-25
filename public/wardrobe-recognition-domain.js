// Local detector output -> existing review drafts. No network or storage.
export const localGarmentLabels={
 'a shirt':'top','a T-shirt':'top','a sweater':'top',
 'trousers':'bottom','jeans':'bottom','shorts':'bottom','a skirt':'bottom',
 'a dress':'onepiece','a jumpsuit':'onepiece',
 'a jacket':'layer','a coat':'layer','a cardigan':'layer',
 'a shoe':'shoes','a handbag':'accessory','a scarf':'accessory','a hat':'accessory'
};
export function localGarmentDrafts(predictions,width,height){
 if(!Array.isArray(predictions)||!Number.isFinite(width)||!Number.isFinite(height)||width<=0||height<=0)throw new Error('Invalid local recognition result.');
 const candidates=[];
 for(const prediction of predictions){
  const category=localGarmentLabels[prediction.label],b=prediction.box;
  if(!category||!Number.isFinite(prediction.score)||prediction.score<.1||prediction.score>1||!b||!['xmin','ymin','xmax','ymax'].every(k=>Number.isFinite(b[k])))continue;
  const x=Math.max(0,Math.min(1,b.xmin/width)),y=Math.max(0,Math.min(1,b.ymin/height));
  const right=Math.max(0,Math.min(1,b.xmax/width)),bottom=Math.max(0,Math.min(1,b.ymax/height));
  if(right-x<.03||bottom-y<.03)continue;
  candidates.push({name:prediction.label.replace(/^a /,'').replace(/^./,c=>c.toUpperCase()),category,
   colour:'white',pattern:'solid',fit:'regular',formality:1,warmth:1,
   confidence:prediction.score,box:{x,y,width:right-x,height:bottom-y}});
 }
 const kept=[];
 for(const item of candidates.sort((a,b)=>b.confidence-a.confidence)){
  const duplicate=kept.some(other=>{
   const a=item.box,b=other.box;
   const intersection=Math.max(0,Math.min(a.x+a.width,b.x+b.width)-Math.max(a.x,b.x))*Math.max(0,Math.min(a.y+a.height,b.y+b.height)-Math.max(a.y,b.y));
   return intersection/(a.width*a.height+b.width*b.height-intersection)>.65;
  });
  if(!duplicate)kept.push(item);
  if(kept.length===20)break;
 }
 return {items:kept};
}
