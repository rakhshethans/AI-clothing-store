import {recogniseLocalPhoto,stopLocalRecognition} from './wardrobe-recognition.js';
const find=id=>document.getElementById(id);
let aborter=null,lastReport=null,busy=false,assets=null;
function idle(){busy=false;find('run').disabled=!assets?.enabled;find('photo').disabled=false;find('cancel').disabled=true;}
try{assets=await(await fetch('/api/wardrobe/local-status',{cache:'no-store'})).json();find('device-status').textContent=assets.enabled?'Local model ready. This device will load about '+Math.round(assets.totalBytes/1024/1024)+' MiB of model/runtime files from your computer.':'Local model files are unavailable. Install the free assets on your computer first.';}catch{find('device-status').textContent='Cannot reach the local preview. Check that the computer and phone use the same Wi-Fi.';}
idle();
find('cancel').onclick=()=>aborter?.abort();
window.addEventListener('pagehide',()=>{aborter?.abort();stopLocalRecognition();});
find('phone-form').onsubmit=async event=>{
 event.preventDefault();if(busy||!assets?.enabled)return;
 const file=find('photo').files[0];if(!file)return;
 if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>8*1024*1024){find('progress').textContent='Choose a JPEG, PNG or WebP under 8 MB.';return;}
 busy=true;lastReport=null;find('export').hidden=true;find('report').hidden=true;find('report').value='';find('results').replaceChildren();find('run').disabled=true;find('photo').disabled=true;find('cancel').disabled=false;find('progress').textContent='Preparing the photo.';aborter=new AbortController();
 let bitmap;
 try{
  bitmap=await createImageBitmap(file);if(aborter.signal.aborted)throw new DOMException('Cancelled','AbortError');
  if(bitmap.width*bitmap.height>20000000)throw Error('Use a photo under 20 megapixels.');
  const scale=Math.min(1,1600/Math.max(bitmap.width,bitmap.height)),canvas=document.createElement('canvas');canvas.width=Math.round(bitmap.width*scale);canvas.height=Math.round(bitmap.height*scale);canvas.getContext('2d').drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close();bitmap=null;
  const began=performance.now(),output=await recogniseLocalPhoto(canvas.toDataURL('image/jpeg',.85),{signal:aborter.signal,onProgress:message=>find('progress').textContent=message});
  if(aborter.signal.aborted)throw new DOMException('Cancelled','AbortError');
  const elapsed=Math.round(performance.now()-began);
  for(const item of output.items){
   const article=document.createElement('article'),title=document.createElement('h2'),score=document.createElement('p'),image=document.createElement('img'),crop=document.createElement('canvas');
   const b=item.box;crop.width=Math.max(1,Math.round(b.width*canvas.width));crop.height=Math.max(1,Math.round(b.height*canvas.height));crop.getContext('2d').drawImage(canvas,b.x*canvas.width,b.y*canvas.height,b.width*canvas.width,b.height*canvas.height,0,0,crop.width,crop.height);
   image.src=crop.toDataURL('image/jpeg',.85);image.alt=item.name;title.textContent=item.name;score.textContent=item.category+' · score '+item.confidence.toFixed(2);article.append(image,title,score);find('results').append(article);
  }
  lastReport={timestamp:new Date().toISOString(),userAgent:navigator.userAgent,secureContext:isSecureContext,mode:'local-wasm-experimental',modelAssetBytes:assets.totalBytes,imageSize:{width:canvas.width,height:canvas.height},milliseconds:elapsed,detectedPieces:output.items.map(({name,category,confidence,box})=>({name,category,modelScore:confidence,box})),photoIncluded:false};
  find('progress').textContent=output.items.length+' candidate pieces in '+(elapsed/1000).toFixed(1)+' seconds. Check every result against your photo.';find('export').hidden=false;
 }catch(error){const message=error.name==='AbortError'?'Recognition cancelled.':String(error.message).replace(/data:image\/[^\s]+/g,'[photo omitted]').slice(0,500);find('progress').textContent=message;lastReport={timestamp:new Date().toISOString(),userAgent:navigator.userAgent,secureContext:isSecureContext,mode:'local-wasm-experimental',completed:false,error:message,capabilities:{worker:typeof Worker!=='undefined',wasm:typeof WebAssembly!=='undefined',imageBitmap:typeof createImageBitmap!=='undefined'},photoIncluded:false};find('export').hidden=false;}
 finally{bitmap?.close();stopLocalRecognition();idle();}
};
find('export').onclick=()=>{if(!lastReport)return;find('report').value=JSON.stringify(lastReport,null,2);find('report').hidden=false;find('report').focus();find('report').select();};
