let localRecognitionWorker=null;
export function stopLocalRecognition(){localRecognitionWorker?.terminate();localRecognitionWorker=null;}
export function recogniseLocalPhoto(image,{signal,onProgress=()=>{}}={}){
 if(signal?.aborted)return Promise.reject(new DOMException('Cancelled','AbortError'));
 return new Promise((resolve,reject)=>{
  let timer;
  const cleanup=()=>{clearTimeout(timer);signal?.removeEventListener('abort',abort);};
  const fail=error=>{cleanup();stopLocalRecognition();reject(error);};
  const abort=()=>fail(new DOMException('Cancelled','AbortError'));
  try{
   localRecognitionWorker??=new Worker('/wardrobe-recognition-worker.js',{type:'module'});
   signal?.addEventListener('abort',abort,{once:true});
   timer=setTimeout(()=>fail(new Error('Local recognition took too long. Try a clearer photo or mark pieces manually.')),180000);
   localRecognitionWorker.onerror=()=>fail(new Error('Local recognition is unavailable in this browser. Manual marking still works.'));
   localRecognitionWorker.onmessage=({data})=>{
    if(data.type==='progress')onProgress(data.message);
    if(data.type==='error')fail(new Error(data.message));
    if(data.type==='result'){cleanup();resolve(data.data);}
   };
   localRecognitionWorker.postMessage({image});
  }catch(error){fail(error);}
 });
}
