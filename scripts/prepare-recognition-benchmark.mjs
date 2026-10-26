// Download a fixed public benchmark sample. Photos stay in ignored private-data.
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
const holdout=process.argv.includes('--holdout');
const destination=new URL(holdout?'../private-data/recognition-holdout/':'../private-data/recognition-benchmark/',import.meta.url);
await fs.mkdir(destination,{recursive:true});
const dataset='detection-datasets/fashionpedia',revision='80845435ce686b8a9dbf70a05452fbfb8e09cdd7';
const url='https://datasets-server.huggingface.co/rows?dataset='+dataset+'&config=default&split=val&offset='+(holdout?30:0)+'&length=30';
const response=await fetch(url,{signal:AbortSignal.timeout(45000)});
if(!response.ok)throw Error('Dataset request failed: '+response.status);
const payload=await response.json();
if(payload.rows?.length!==30||payload.partial)throw Error('Incomplete benchmark rows.');
const map={0:'top',1:'top',2:'top',3:'layer',4:'layer',6:'bottom',7:'bottom',8:'bottom',9:'layer',10:'onepiece',11:'onepiece',14:'accessory',23:'shoes',24:'accessory',25:'accessory'};
const photos=[];
// Sequential downloads keep requests/bandwidth bounded and progress explicit.
for(const entry of payload.rows){
 const row=entry.row,source=new URL(row.image.src);
 if(source.protocol!=='https:'||source.hostname!=='datasets-server.huggingface.co'||!source.pathname.includes(revision))throw Error('Unexpected dataset asset source or revision.');
 const r=await fetch(source,{signal:AbortSignal.timeout(45000)});
 if(!r.ok)throw Error('Photo download failed: '+row.image_id+' '+r.status);
 const bytes=Buffer.from(await r.arrayBuffer());if(bytes.length>8*1024*1024)throw Error('Photo exceeds import limit.');
 const filename=row.image_id+'.jpg';await fs.writeFile(new URL(filename,destination),bytes);
 const expected=[];let ignoredAnnotations=0;
 row.objects.category.forEach((id,index)=>{
  if(!map[id]){ignoredAnnotations++;return;}
  const [left,top,right,bottom]=row.objects.bbox[index];
  expected.push({category:map[id],box:{x:left/row.width,y:top/row.height,width:(right-left)/row.width,height:(bottom-top)/row.height}});
 });
 photos.push({id:String(row.image_id),row:entry.row_idx,file:filename,width:row.width,height:row.height,sha256:createHash('sha256').update(bytes).digest('hex'),expected,ignoredAnnotations});
 console.log('Prepared '+photos.length+'/30: '+row.image_id+' ('+expected.length+' supported garments)');
}
await fs.writeFile(new URL('manifest.json',destination),JSON.stringify({dataset,revision,split:'val',selection:holdout?'Validation rows 30–59, reserved before candidate selection; no quality-based selection.':'First 30 validation rows, before running inference; no quality-based selection.',annotationFormat:'Pascal VOC corners converted to normalised x/y/width/height',scope:'Supported garment categories only; garment parts and unsupported accessory types excluded.',sources:['https://huggingface.co/datasets/detection-datasets/fashionpedia','https://fashionpedia.github.io/home/data_license.html'],photos},null,2));
