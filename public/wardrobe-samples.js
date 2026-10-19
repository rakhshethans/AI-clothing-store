// Original vector illustrations and fictional clothes for testing, not owned/product matches.
const sampleShapes={
 tee:'<path d="m80 65 35-20h50l35 20 35 45-35 25-20-25v145H80V110l-20 25-35-25Z"/>',
 shirt:'<path d="m80 65 35-20h50l35 20 35 75-35 18-20-48v145H80V110l-20 48-35-18Z"/><path d="m115 45 25 35 25-35M140 80v175" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="3"/>',
 knit:'<path d="m75 65 45-18h40l45 18 35 130-32 12-28-97v145H80V110l-28 97-32-12Z"/><path d="M120 47q20 35 40 0M80 235h100" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="5"/>',
 trousers:'<path d="M75 45h130l-6 88-14 142h-48l3-152-17 152H75l-5-142Z"/><path d="M75 62h129M140 63v60" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="3"/>',
 skirt:'<path d="M95 50h90l44 205H51Z"/><path d="M95 65h90M115 70 96 245M165 70l19 175" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="3"/>',
 jacket:'<path d="m85 60 35-18h40l35 18 40 135-35 13-20-90v142H80V118l-20 90-35-13Z"/><path d="m120 42 20 55 20-55M140 97v163M90 175h35v30H90m65-30h15v30h-15" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="3"/>',
 coat:'<path d="m95 35 27-10h36l27 10 48 160-32 12-22-92 20 165H61l20-165-22 92-32-12Z"/><path d="m122 25 18 65 18-65M140 90v190M70 205h126" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="3"/>',
 dress:'<path d="m110 35 30 15 30-15 20 45-20 35 52 160H58l52-160-20-35Z"/><path d="M110 115h60M115 40q25 40 50 0" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="3"/>',
 shoes:'<path d="m55 105 35-16 28 42 52 15q42 0 48 35v17H48q-15-38 7-93ZM55 215l35-16 28 42 52 15q42 0 48 35v7H48q-15-28 7-83Z" transform="translate(0 -30)"/><path d="M48 163h170M48 263h170m-115-138 28-9m-14 22 28-9m-42 86 28-9m-14 22 28-9" fill="none" stroke="#eee" stroke-width="4"/>',
 bag:'<rect x="57" y="105" width="166" height="145" rx="10"/><path d="M100 105V75a40 40 0 0 1 80 0v30" fill="none" stroke="currentColor" stroke-width="12"/>',
 scarf:'<path d="M85 40h70l-5 150h45v70h-90L90 140Z"/><path d="M108 242v38m15-38v38m15-38v38m15-38v38m15-38v38m15-38v38" fill="none" stroke="currentColor" stroke-width="4"/>'
};
const sampleSpec=[
 ['White cotton tee','top','white','tee','#f7f5ee',1,0,'regular'],
 ['Blue Oxford shirt','top','blue','shirt','#8baeca',2,0,'regular'],
 ['Navy striped tee','top','navy','tee','#26374b',1,0,'regular','striped'],
 ['Cream wool jumper','top','cream','knit','#d8cdb7',2,2,'relaxed'],
 ['Green sweatshirt','top','green','knit','#597360',1,1,'relaxed'],
 ['Indigo straight jeans','bottom','blue','trousers','#3d5876',1,1,'regular'],
 ['Charcoal tailored trousers','bottom','grey','trousers','#51545a',2,1,'regular'],
 ['Beige wide-leg trousers','bottom','beige','trousers','#b7a183',2,0,'relaxed'],
 ['Black midi skirt','bottom','black','skirt','#343438',2,1,'regular'],
 ['Olive chore jacket','layer','olive','jacket','#737957',1,1,'relaxed'],
 ['Camel wool coat','layer','brown','coat','#ac8057',2,2,'regular'],
 ['Black day dress','onepiece','black','dress','#303036',2,1,'fitted'],
 ['White leather trainers','shoes','white','shoes','#e4e1d9',1,0,'regular'],
 ['Brown loafers','shoes','brown','shoes','#6f4c37',2,0,'regular'],
 ['Tan shoulder bag','accessory','brown','bag','#a8784d',2,0,'regular'],
 ['Burgundy scarf','accessory','red','scarf','#813d49',2,2,'regular']
];
export const sampleWardrobePieces=sampleSpec.map(([name,category,colour,shape,hex,formality,warmth,fit,pattern='solid'],index)=>{
 const stripe=pattern==='striped'?'<defs><pattern id="stripe" width="14" height="14" patternUnits="userSpaceOnUse"><rect width="14" height="7" fill="#e3dfd5"/></pattern><mask id="garment"><g fill="#fff">'+sampleShapes[shape]+'</g></mask></defs><rect width="280" height="310" fill="url(#stripe)" mask="url(#garment)"/>':'';
 const svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 310"><rect width="280" height="310" fill="#e8e5de"/><g fill="'+hex+'" color="'+hex+'" stroke="#101010" stroke-opacity=".13" stroke-width="1.5">'+sampleShapes[shape]+'</g>'+stripe+'</svg>';
 return {id:'wardrobe-sample-'+String(index+1).padStart(2,'0'),name,category,colour,pattern,fit,formality,warmth,image:'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg),sample:true,available:true,favourite:false,createdAt:0};
});
