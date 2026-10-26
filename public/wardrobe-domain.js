// Shared validation and transparent styling heuristics; no network or storage.
export const wardrobeCategories=['top','bottom','onepiece','layer','shoes','accessory'];
export const wardrobeColours=['black','white','cream','grey','navy','beige','brown','blue','green','olive','red','pink','orange','yellow','purple','multicolour'];
export const wardrobePatterns=['solid','striped','checked','printed'];
export const wardrobeFits=['fitted','regular','relaxed'];
export function validateWardrobePiece(raw){
 if(!raw||typeof raw.name!=='string'||!raw.name.trim()||raw.name.trim().length>80)throw new Error('Give each piece a name of up to 80 characters.');
 for(const [key,values] of [['category',wardrobeCategories],['colour',wardrobeColours],['pattern',wardrobePatterns],['fit',wardrobeFits]])if(!values.includes(raw[key]))throw new Error('Choose a valid '+key+'.');
 if(!Number.isInteger(raw.formality)||raw.formality<0||raw.formality>3||!Number.isInteger(raw.warmth)||raw.warmth<0||raw.warmth>2)throw new Error('Choose a valid dress level and weight.');
 return {name:raw.name.trim(),category:raw.category,colour:raw.colour,pattern:raw.pattern,fit:raw.fit,formality:raw.formality,warmth:raw.warmth};
}
export function validateGarmentBox(box){
 if(!box||!['x','y','width','height'].every(k=>Number.isFinite(box[k])))throw new Error('A garment crop is missing.');
 const {x,y,width,height}=box;
 if(x<0||y<0||width<0.01||height<0.01||x+width>1.001||y+height>1.001)throw new Error('Keep every crop inside the photo, with a visible area.');
 return {x,y,width:Math.min(width,1-x),height:Math.min(height,1-y)};
}
export function validateDetections(value){
 if(!value||!Array.isArray(value.items)||value.items.length>20)throw new Error('The recogniser returned an invalid garment list.');
 return value.items.map(item=>{
  if(!Number.isFinite(item.confidence)||item.confidence<0||item.confidence>1)throw new Error('The recogniser returned invalid confidence.');
  return {...validateWardrobePiece(item),box:validateGarmentBox(item.box),confidence:item.confidence};
 });
}
const neutral=new Set(['black','white','cream','grey','navy','beige','brown']);
// Coarse artist's colour wheel, deliberately approximate for editable named colours.
const hues={red:0,orange:60,yellow:120,olive:150,green:180,blue:240,purple:300,pink:330};
export function colourHarmony(a,b,mood='balanced'){
 if(a===b)return {score:4,reason:'Tonal colours keep the palette connected.'};
 if(neutral.has(a)&&neutral.has(b))return {score:4,reason:'A neutral palette makes these pieces easy to combine.'};
 if(neutral.has(a)||neutral.has(b))return {score:4,reason:'A neutral base gives the accent colour room.'};
 if(a==='multicolour'||b==='multicolour')return {score:0,reason:'Check the colours in the print together.'};
 const gap=Math.min(Math.abs(hues[a]-hues[b]),360-Math.abs(hues[a]-hues[b]));
 if(gap<=60)return {score:4,reason:'Neighbouring colours create a related palette.'};
 if(gap>=150)return {score:mood==='bold'?5:mood==='quiet'?-2:1,reason:'Complementary colours give this look a stronger contrast.'};
 return {score:mood==='bold'?1:-1,reason:'This is a more expressive colour mix.'};
}
export function rankWardrobeOutfits(pieces,preferences={}){
 const {occasion='casual',weather='mild',mood='balanced',anchor='',limit=6,feedback={}}=preferences;
 const ranges={casual:[0,2],smart:[2,3],evening:[1,3],active:[0,0]};
 const range=ranges[occasion]||ranges.casual;
 const owned=pieces.filter(p=>p.available!==false&&p.id&&wardrobeCategories.includes(p.category));
 if(anchor&&!owned.some(p=>p.id===anchor))return {outfits:[],message:'Your starting piece is unavailable. Choose another piece.'};
 const suitable=p=>p.formality>=range[0]&&p.formality<=range[1]&&(weather!=='warm'||p.warmth<2);
 const group=cat=>owned.filter(p=>p.category===cat&&suitable(p)).sort((a,b)=>Number(b.id===anchor)-Number(a.id===anchor)||Number(!!b.favourite)-Number(!!a.favourite)||String(a.id).localeCompare(String(b.id))).slice(0,30);
 const tops=group('top'),bottoms=group('bottom'),dresses=group('onepiece'),shoes=group('shoes'),layers=group('layer'),accessories=group('accessory');
 if(!shoes.length||(!dresses.length&&(!tops.length||!bottoms.length)))return {outfits:[],message:'Add an available top and bottom (or a one-piece), plus shoes that fit these preferences. No missing pieces will be invented.'};
 const bases=[];for(const top of tops)for(const bottom of bottoms)bases.push([top,bottom]);for(const dress of dresses)bases.push([dress]);
 const candidates=[];
 const scoreCombo=(items,allowCold=false)=>{
  let score=0;const reasons=[];const main=items.filter(p=>p.category!=='shoes'&&p.category!=='accessory');
  const first=colourHarmony(main[0].colour,(main[1]||items.find(p=>p.category==='shoes')).colour,mood);score+=first.score;reasons.push(first.reason);
  for(let i=0;i<items.length;i++)for(let j=i+1;j<items.length;j++){
   if(Math.abs(items[i].formality-items[j].formality)>1)return null;
   score+=colourHarmony(items[i].colour,items[j].colour,mood).score;
  }
  const prints=items.filter(p=>p.pattern!=='solid').length;score+=prints<=1?4:mood==='bold'?0:-4;
  if(prints===1)reasons.push('One patterned piece is supported by quieter solids.');
  if(prints>1)reasons.push('Mixed patterns make this a more experimental option.');
  const top=items.find(p=>p.category==='top'),bottom=items.find(p=>p.category==='bottom');
  if(top&&bottom){if(top.fit==='relaxed'&&bottom.fit==='relaxed'){score+=mood==='bold'?1:-1;reasons.push('A relaxed silhouette throughout; try a tuck if you want more definition.');}else if(top.fit!==bottom.fit){score+=3;reasons.push('Contrasting volumes give the silhouette some balance.');}}
  const weight=items.filter(p=>!['shoes','accessory'].includes(p.category)).reduce((s,p)=>s+p.warmth,0);
  if(weather==='cold'&&weight<3&&!allowCold)return null;
  score+=items.reduce((s,p)=>s+(p.favourite?2:0),0);
  if(mood==='quiet')score+=items.filter(p=>neutral.has(p.colour)).length;
  if(occasion==='evening')score+=items.filter(p=>p.category!=='accessory').reduce((sum,p)=>sum+3*(p.formality>=2?1:-1),0);
  // Average pair harmony so extra layers do not win simply by creating more pairs.
  const pairCount=items.length*(items.length-1)/2;
  score-=items.filter(p=>p.category==='layer').length*(weather==='warm'?6:2);
  score-=items.filter(p=>p.category==='accessory').length;
  score/=Math.max(1,Math.sqrt(pairCount));
  reasons.push(occasion==='active'?'Sportswear dress levels stay consistent.':occasion==='smart'?'Every piece is marked smart or formal.':occasion==='evening'&&items.filter(p=>p.category!=='accessory').every(p=>p.formality>=2)?'Smarter pieces give this an evening-ready direction.':'The pieces have compatible dress levels.');
  if(weather==='cold')reasons.push('Warmer pieces and layering suit your cold-weather preference.');
  if(weather==='warm')reasons.push('Heavy pieces are excluded for your warm-weather preference.');
  const id=items.map(p=>p.id).sort().join('|');if(!allowCold&&feedback[id]===1){score+=4;reasons.push('You marked this combination as one you would wear.');}return {id,items,score,reasons:[...new Set(reasons)]};
 };
 // Bound work without silently dropping the chosen anchor. Beam by colour/fit quality first.
 let partial=[];for(const base of bases)for(const shoe of shoes){const r=scoreCombo([...base,shoe],true);if(r)partial.push(r);}
 partial.sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id));
 const anchored=partial.filter(r=>r.items.some(p=>p.id===anchor));
 partial=[...new Map([...anchored.slice(0,160),...partial.slice(0,160)].map(r=>[r.id,r])).values()];
 const accessory=accessories.find(p=>p.id===anchor);
 for(const base of partial){const variants=weather==='cold'?layers:[null,...layers];for(const layer of variants){const main=[...base.items,...(layer?[layer]:[])];
  const suggested=accessories.filter(p=>Math.abs(p.formality-main[0].formality)<=1).map(p=>({piece:p,match:main.reduce((sum,q)=>sum+colourHarmony(p.colour,q.colour,mood).score,0)+(p.favourite?2:0)})).sort((a,b)=>b.match-a.match||a.piece.id.localeCompare(b.piece.id)).slice(0,2).map(p=>p.piece);
  for(const extra of accessory?[accessory]:[null,...suggested]){const items=[...main,...(extra?[extra]:[])];if(anchor&&!items.some(p=>p.id===anchor))continue;const r=scoreCombo(items);if(r&&feedback[r.id]!==-1)candidates.push(r);}
 }}
 candidates.sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id));
 const unique=[...new Map(candidates.map(r=>[r.id,r])).values()];const chosen=[];
 // Greedily vary pieces so the first screen is not six copies of the same outfit.
 while(unique.length&&chosen.length<Math.min(limit,12)){
  unique.sort((a,b)=>{const adjusted=r=>r.score-chosen.reduce((s,c)=>s+2*r.items.filter(p=>c.items.some(q=>q.id===p.id)).length,0);return adjusted(b)-adjusted(a)||a.id.localeCompare(b.id);});chosen.push(unique.shift());
 }
 return {outfits:chosen,message:chosen.length?'Suggestions from your wardrobe, not a judgment of taste.':'No complete outfit fits these preferences. Try another occasion, weather setting or starting piece.'};
}
