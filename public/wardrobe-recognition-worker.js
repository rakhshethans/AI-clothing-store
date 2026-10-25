import {pipeline,env,RawImage} from './local-recognition/transformers.min.js';
import {localGarmentLabels,localGarmentDrafts} from './wardrobe-recognition-domain.js';
env.allowRemoteModels=false;
env.allowLocalModels=true;
env.localModelPath='/local-recognition/models/';
env.backends.onnx.wasm.wasmPaths='/local-recognition/';
env.backends.onnx.wasm.numThreads=1;
env.backends.onnx.wasm.proxy=false;
let detector;
self.onmessage=async({data})=>{
 try{
  if(!detector){self.postMessage({type:'progress',message:'Loading the local model. The first run can take a little longer.'});detector=await pipeline('zero-shot-object-detection','Xenova/owlvit-base-patch32',{device:'wasm',dtype:'q8',local_files_only:true});}
  self.postMessage({type:'progress',message:'Finding visible clothes on this device.'});
  const image=await RawImage.read(data.image);
  const predictions=await detector(image,Object.keys(localGarmentLabels),{threshold:.1,top_k:60});
  self.postMessage({type:'result',data:localGarmentDrafts(predictions,image.width,image.height)});
 }catch(error){self.postMessage({type:'error',message:'Local recognition could not finish. You can mark the pieces manually. '+error.message});}
};
