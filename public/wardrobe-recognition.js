let localRecognitionWorker=null,active=null,nextRequestId=0;
const queue=[];
const cancelled=()=>new DOMException('Cancelled','AbortError');
function settle(job,error,data){
 clearTimeout(job.timer);job.signal?.removeEventListener('abort',job.abort);
 error?job.reject(error):job.resolve(data);
}
function discardWorker(){localRecognitionWorker?.terminate();localRecognitionWorker=null;}
export function stopLocalRecognition(){
 discardWorker();const jobs=[...(active?[active]:[]),...queue];active=null;queue.length=0;
 for(const job of jobs)settle(job,cancelled());
}
function failWorker(error){
 discardWorker();const jobs=[...(active?[active]:[]),...queue];active=null;queue.length=0;
 for(const job of jobs)settle(job,error);
}
function startNext(){
 if(active||!queue.length)return;
 const job=active=queue.shift();
 try{
  if(!localRecognitionWorker){
   const worker=localRecognitionWorker=new Worker('/wardrobe-recognition-worker.js',{type:'module'});
   worker.onerror=()=>{if(worker===localRecognitionWorker)failWorker(new Error('Local recognition is unavailable in this browser. Manual marking still works.'));};
   worker.onmessage=({data})=>{
    if(worker!==localRecognitionWorker||!active||data.requestId!==active.id)return;
    if(data.type==='progress'){try{active.onProgress(data.message);}catch{/* A view callback must not strand inference. */}return;}
    if(data.type==='error'){failWorker(new Error(data.message));return;}
    if(data.type==='result'){const finished=active;active=null;settle(finished,null,data.data);startNext();}
   };
  }
  job.timer=setTimeout(()=>failWorker(new Error('Local recognition took too long. Try a clearer photo or mark pieces manually.')),180000);
  localRecognitionWorker.postMessage({requestId:job.id,image:job.image});
 }catch(error){failWorker(error);}
}
export function recogniseLocalPhoto(image,{signal,onProgress=()=>{}}={}){
 if(signal?.aborted)return Promise.reject(cancelled());
 return new Promise((resolve,reject)=>{
  const job={id:++nextRequestId,image,signal,onProgress,resolve,reject};
  job.abort=()=>{
   if(active===job){active=null;discardWorker();settle(job,cancelled());startNext();}
   else{const index=queue.indexOf(job);if(index>=0){queue.splice(index,1);settle(job,cancelled());}}
  };
  signal?.addEventListener('abort',job.abort,{once:true});queue.push(job);startNext();
 });
}
