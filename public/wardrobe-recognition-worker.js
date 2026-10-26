import {PreTrainedModel,Tensor,env,RawImage} from './local-recognition/transformers.min.js';
import {localRecognitionPolicy as policy} from './recognition-config.js';
import {recognitionImageSize,garmentPredictions,localGarmentDrafts,hasImageDetail,recognitionThreadCount} from './wardrobe-recognition-domain.js';
env.allowRemoteModels=false;
env.allowLocalModels=true;
env.localModelPath='/local-recognition/models/';
env.backends.onnx.wasm.wasmPaths='/local-recognition/';
env.backends.onnx.wasm.numThreads=recognitionThreadCount({isolated:self.crossOriginIsolated,sharedMemory:typeof SharedArrayBuffer!=='undefined',cores:self.navigator.hardwareConcurrency});
env.backends.onnx.wasm.proxy=false;
let detector;
// Only image pixels enter inference. requestId routes replies; it never affects detections.
self.onmessage=async({data})=>{
 const reply=message=>self.postMessage({...message,requestId:data.requestId});
 try{
  const image=(await RawImage.read(data.image)).rgb();
  if(!hasImageDetail(image.data,image.channels)){reply({type:'result',data:{items:[]}});return;}
  if(!detector){reply({type:'progress',message:'Loading the clothing model on this device. The first run can take longer.'});detector=await PreTrainedModel.from_pretrained(policy.modelId,{device:'wasm',dtype:policy.dtype,local_files_only:true});}
  reply({type:'progress',message:'Finding visible clothes on this device.'});
  const size=recognitionImageSize(image.width,image.height);
  const resized=await image.resize(size.width,size.height,{resample:2}),area=size.width*size.height;
  const values=new Float32Array(3*area),mean=[.485,.456,.406],std=[.229,.224,.225];
  for(let c=0;c<3;c++)for(let i=0;i<area;i++)values[c*area+i]=(resized.data[i*3+c]/255-mean[c])/std[c];
  const output=await detector({pixel_values:new Tensor('float32',values,[1,3,size.height,size.width]),pixel_mask:new Tensor('int64',new BigInt64Array(area).fill(1n),[1,size.height,size.width])});
  reply({type:'result',data:localGarmentDrafts(garmentPredictions(output,image.width,image.height),image.width,image.height)});
 }catch(error){reply({type:'error',message:'Local recognition could not finish. You can mark the pieces manually. '+error.message});}
};
