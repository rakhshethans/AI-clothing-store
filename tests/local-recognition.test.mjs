import test from 'node:test';
import assert from 'node:assert/strict';
import {localGarmentDrafts} from '../public/wardrobe-recognition-domain.js';
import {validateDetections} from '../public/wardrobe-domain.js';
const prediction=(label,score,box)=>({label,score,box});
const box={xmin:10,ymin:20,xmax:50,ymax:80};
test('local recognition clamps crops, maps garments and rejects unknown/invalid results',()=>{
 const result=localGarmentDrafts([prediction('a shirt',.6,box),prediction('a shoe',.4,{xmin:60,ymin:50,xmax:120,ymax:100}),prediction('a person',.9,box),prediction('a coat',.01,box),prediction('jeans',.8,{...box,xmax:NaN})],100,100);
 assert.equal(validateDetections(result).length,2);assert.equal(result.items[0].category,'top');assert.equal(result.items[1].category,'shoes');assert.equal(result.items[1].box.width,.4);
});
test('local recognition suppresses alternate-label duplicates but keeps separate clothes',()=>{
 const result=localGarmentDrafts([prediction('a shirt',.5,box),prediction('a T-shirt',.7,box),prediction('jeans',.6,{xmin:60,ymin:20,xmax:95,ymax:90})],100,100);
 assert.equal(result.items.length,2);assert.equal(result.items[0].name,'T-shirt');assert.equal(result.items[1].category,'bottom');
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
