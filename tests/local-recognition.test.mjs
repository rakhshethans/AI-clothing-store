import test from 'node:test';
import assert from 'node:assert/strict';
import {localGarmentDrafts,garmentPredictions,recognitionImageSize,hasImageDetail,recognitionThreadCount} from '../public/wardrobe-recognition-domain.js';
import {validateDetections} from '../public/wardrobe-domain.js';
const prediction=(label,score,box)=>({label,score,box});
const box={xmin:10,ymin:20,xmax:50,ymax:80};
test('local recognition clamps crops, maps garments and rejects unknown/invalid results',()=>{
 const result=localGarmentDrafts([prediction('top',.6,box),prediction('shoes',.4,{xmin:60,ymin:50,xmax:120,ymax:100}),prediction('person',.9,box),prediction('outer',.01,box),prediction('bottom',.8,{...box,xmax:NaN})],100,100);
 assert.equal(validateDetections(result).length,2);assert.equal(result.items[0].category,'top');assert.equal(result.items[1].category,'shoes');assert.equal(result.items[1].box.width,.4);
});
test('local recognition suppresses alternate-label duplicates but keeps separate clothes',()=>{
 const result=localGarmentDrafts([prediction('top',.5,box),prediction('top',.7,box),prediction('bottom',.6,{xmin:60,ymin:20,xmax:95,ymax:90})],100,100);
 assert.equal(result.items.length,2);assert.equal(result.items[0].name,'Top');assert.equal(result.items[1].category,'bottom');
 assert.deepEqual(localGarmentDrafts([],100,100),{items:[]});assert.throws(()=>localGarmentDrafts([],0,100));
});

import {handleRequest} from '../server.mjs';
async function request(url,method='GET'){
 const result={headers:{}};
 await handleRequest({url,method},{setHeader(k,v){result.headers[k.toLowerCase()]=v;},writeHead(status,h={}){result.status=status;Object.entries(h).forEach(([k,v])=>this.setHeader(k,v));},end(body){result.body=body===undefined?'':String(body);}});
 return result;
}
test('local model routes expose only public assets and never allow uploads',async()=>{
 const status=await request('/api/wardrobe/local-status');assert.equal(status.status,200);assert.equal(JSON.parse(status.body).mode,'local-experimental');assert.equal(status.headers['cache-control'],'no-store');
 assert.equal((await request('/local-recognition/ready.json')).status,404);
 assert.equal((await request('/local-recognition/../../.env')).status,404);
 assert.equal((await request('/local-recognition/transformers.min.js','POST')).status,405);
 const worker=await request('/wardrobe-recognition-worker.js');assert.equal(worker.status,200);assert.ok(worker.body.includes('env.allowRemoteModels=false'));assert.ok(!worker.body.includes('/api/wardrobe/recognise'));
});

test('clothing model preserves the last class and uses independent sigmoid scores',()=>{
 const values=new Float32Array(14).fill(-8);values[6]=2;values[7]=1;
 const out={logits:{dims:[1,2,7],data:values},pred_boxes:{dims:[1,2,4],data:new Float32Array([.5,.5,.2,.4,.1,.1,.1,.1])}};
 const predicted=garmentPredictions(out,100,100);assert.equal(predicted[0].label,'top');assert.equal(predicted[1].label,'bag');assert.ok(Math.abs(predicted[0].score-1/(1+Math.exp(-2)))<1e-6);
 assert.equal(localGarmentDrafts(predicted,100,100).items.length,2);
 assert.throws(()=>garmentPredictions({...out,logits:{...out.logits,dims:[1,2,8]}},100,100));
});
test('layered garments survive suppression and visible small shoes are retained',()=>{
 const small={xmin:70,ymin:80,xmax:72,ymax:84};
 const items=localGarmentDrafts([prediction('top',.8,box),prediction('outer',.7,box),prediction('top',.6,box),prediction('shoes',.9,small),prediction('collar',.99,box)],100,100).items;
 assert.equal(items.length,3);assert.ok(items.some(p=>p.category==='shoes'));assert.ok(items.some(p=>p.category==='top'));assert.ok(items.some(p=>p.category==='layer'));assert.equal(localGarmentDrafts([prediction('__proto__',.9,box)],100,100).items.length,0);
});
test('model resizing preserves aspect and enforces finite bounded dimensions',()=>{
 assert.deepEqual(recognitionImageSize(1024,683),{height:800,width:1199});assert.deepEqual(recognitionImageSize(683,1024),{width:800,height:1199});
 for(const dimensions of [[1,1600],[1600,1],[1600,1600]]){const size=recognitionImageSize(...dimensions);assert.ok(size.width>=1&&size.height>=1&&size.width<=1333&&size.height<=1333);}
 assert.throws(()=>recognitionImageSize(NaN,100));
});

test('flat colour controls have no garment evidence; real edges remain eligible',()=>{
 assert.equal(hasImageDetail(new Uint8Array([255,255,255,255,255,255])),false);assert.equal(hasImageDetail(new Uint8Array([255,0,0,255,0,0])),false);assert.equal(hasImageDetail(new Uint8Array([0,0,0,2,0,0])),true);assert.throws(()=>hasImageDetail([]));
});

test('CPU parallelism requires isolation and shared memory and stays bounded',()=>{
 assert.equal(recognitionThreadCount(),1);
 assert.equal(recognitionThreadCount({isolated:true,sharedMemory:true,cores:16}),2);
 for(const options of [{isolated:false,sharedMemory:true,cores:16},{isolated:true,sharedMemory:false,cores:16},{isolated:true,sharedMemory:true,cores:2},{isolated:true,sharedMemory:true,cores:NaN}])assert.equal(recognitionThreadCount(options),1);
});
