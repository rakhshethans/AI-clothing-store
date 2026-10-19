export const observedAt = '2026-10-17T10:30:00Z';
export const retailers = [
  { id: 'form', name: 'FORM Studio', delivery: 350, freeOver: 7500, domain: 'example.com' },
  { id: 'common', name: 'Common Ground', delivery: 299, freeOver: 6000, domain: 'example.org' },
  { id: 'offday', name: 'Offday Supply', delivery: 450, freeOver: 9000, domain: 'example.net' }
];
const designs = [
  ['Everyday boxy tee','tops','tee',1800,'Relaxed cotton silhouette'],
  ['Heavyweight crewneck','tops','sweater',3200,'Easy layering, structured drape'],
  ['Oxford stripe shirt','tops','shirt',3500,'A crisp everyday layer'],
  ['Rib-knit polo','tops','polo',2800,'Textured weekend staple'],
  ['Wide-leg twill trousers','bottoms','trousers',3900,'Relaxed shape, full length'],
  ['Straight-leg denim','bottoms','jeans',4200,'Classic silhouette, everyday wear'],
  ['Utility cargo trousers','bottoms','cargo',4600,'Easy shape with utility pockets'],
  ['Pleated relaxed trousers','bottoms','trousers',4400,'Soft tailoring for every day'],
  ['Cropped work jacket','layers','jacket',5800,'Boxy outer layer, clean lines'],
  ['Oversized overshirt','layers','shirt',4800,'A versatile midweight layer'],
  ['Soft-knit cardigan','layers','cardigan',4500,'An effortless finishing layer'],
  ['Lightweight bomber','layers','bomber',6500,'Rounded shape, minimal details'],
  ['Low-profile trainers','shoes','shoe',5500,'Simple everyday silhouette'],
  ['Canvas court trainers','shoes','shoe',3800,'Clean shape, contrast sole'],
  ['Everyday shoulder bag','accessories','bag',2600,'A small carry for the essentials'],
  ['Canvas tote','accessories','tote',1400,'Room for the everyday essentials']
];
const palette = [
  ['Ink','#292c31'],['Ecru','#e3ddce'],['Olive','#737968'],['Blue','#8196ad'],
  ['Brown','#93735d'],['Grey','#a5a5a1'],['Black','#262626'],['Cream','#e8e1d1']
];
export const products = designs.flatMap((d, i) => retailers.map((r, j) => {
  const colour = palette[(i + j * 3) % palette.length];
  const price = d[3] + j * 400;
  const id = 'tl-' + String(i * 3 + j + 1).padStart(3, '0');
  const sizes = d[1] === 'shoes' ? ['UK 6','UK 7','UK 8','UK 9','UK 10'] : d[1] === 'accessories' ? ['One size'] : ['XS','S','M','L','XL'];
  return { id, name:d[0], category:d[1], shape:d[2], price, colour:colour[0], hex:colour[1],
    description:d[4], retailerId:r.id, sizes, availableSizes:sizes.filter((_,k) => (i+j+k)%7 !== 0),
    stock:i===11&&j===2?'out_of_stock':'in_stock', style:i%2===0?'minimal':'casual',
    source:'controlled-sample', observedAt, currency:'GBP', imageRights:'original-project-illustration',
    url:'https://' + r.domain + '/?sample=' + id, sample:true };
}));
export const outfits = [
  {id:'quiet-weekend',name:'The quiet weekend',tag:'SOFT NEUTRALS',description:'A little structure. A lot of ease. Make the everyday feel considered.',items:['tl-002','tl-013','tl-032'],background:'#e8e4da'},
  {id:'city-uniform',name:'Your city uniform',tag:'EVERYDAY UTILITY',description:'Relaxed proportions, an easy layer, and somewhere to be.',items:['tl-004','tl-020','tl-027'],background:'#dde1d7'},
  {id:'off-the-clock',name:'Off the clock',tag:'COLOUR, QUIETLY',description:'Easy layers and a muted palette for the days with no agenda.',items:['tl-010','tl-016','tl-030'],background:'#e6ddd5'}
];
export function garmentSvg(p, background = '#efeee9') {
  const c=p.hex; let shape='';
  if(['tee','shirt','polo','sweater','cardigan','jacket','bomber'].includes(p.shape)) {
    const long=p.shape!=='tee'&&p.shape!=='polo';
    shape='<path d="M85 72 117 57 Q140 72 163 57 L195 72 '+(long?'225 177 199 187 181 118':'217 119 194 137 181 115')+' 185 232 Q140 242 95 232 L99 115 '+(long?'81 187 55 177':'86 137 63 119')+'Z" fill="'+c+'" stroke="#000" stroke-opacity=".13" stroke-width="2"/>';
    shape+='<path d="M117 57 Q140 89 163 57" fill="none" stroke="#000" stroke-opacity=".22" stroke-width="5"/>';
    if(['shirt','polo','jacket','cardigan'].includes(p.shape)) shape+='<path d="M140 78V231 M117 57 128 90 140 78 152 90 163 57" stroke="#000" stroke-opacity=".2" fill="none" stroke-width="2"/>';
    if(p.shape==='jacket') shape+='<path d="M108 114h22v27h-22z M151 114h22v27h-22z" fill="none" stroke="#000" stroke-opacity=".22" stroke-width="2"/>';
  } else if(['trousers','jeans','cargo'].includes(p.shape)) {
    shape='<path d="M99 48H181L195 250 150 254 140 131 130 254 85 250Z" fill="'+c+'" stroke="#000" stroke-opacity=".17" stroke-width="2"/><path d="M100 62H181 M140 62v66 M106 73l-8 36 M174 73l8 36" stroke="#000" stroke-opacity=".24" fill="none" stroke-width="2"/>';
    if(p.shape==='cargo') shape+='<path d="M93 151h29v35H91 M158 151h29l2 35h-29" fill="none" stroke="#000" stroke-opacity=".24" stroke-width="2"/>';
  } else if(p.shape==='shoe') {
    shape='<path d="M61 164 88 112 120 126 151 151 207 169Q228 181 221 199H60Q44 185 61 164Z" fill="'+c+'" stroke="#000" stroke-opacity=".16" stroke-width="2"/><path d="M57 191h166v17H57Z" fill="#e1ddcf"/><path d="m104 137 28 4m-17 3 27 4m-16 3 28 4" stroke="#f7f4ea" stroke-width="5"/>';
  } else {
    shape='<rect x="81" y="112" width="118" height="119" rx="'+(p.shape==='tote'?4:25)+'" fill="'+c+'" stroke="#000" stroke-opacity=".16" stroke-width="2"/><path d="M104 125V91a36 36 0 0 1 72 0v34" stroke="'+c+'" stroke-width="10" fill="none"/>';
  }
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 310"><rect width="280" height="310" fill="'+background+'"/><ellipse cx="140" cy="278" rx="70" ry="8" fill="#000" opacity=".045"/>'+shape+'</svg>';
}
export const imageUrl = (p,bg) => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(garmentSvg(p,bg));
