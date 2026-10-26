import test from 'node:test';
import assert from 'node:assert/strict';
import {recogniseLocalPhoto,stopLocalRecognition} from '../public/wardrobe-recognition.js';
class FakeWorker {
 static instances=[];
 constructor(){this.sent=[];FakeWorker.instances.push(this);}
 postMessage(message){this.sent.push(message);}
 terminate(){this.terminated=true;}
 reply(type,data={},requestId=this.sent.at(-1).requestId){this.onmessage({data:{type,requestId,...data}});}
}
test('recognition serialises image requests and ignores stale replies',async()=>{
 const original=globalThis.Worker;globalThis.Worker=FakeWorker;
 try{
  const first=recogniseLocalPhoto('first-pixels'),second=recogniseLocalPhoto('second-pixels');
  const worker=FakeWorker.instances.at(-1);assert.equal(worker.sent.length,1);
  assert.deepEqual(Object.keys(worker.sent[0]).sort(),['image','requestId']);
  const firstId=worker.sent[0].requestId;
  worker.reply('result',{data:{items:[{name:'model output'}]}});assert.deepEqual(await first,{items:[{name:'model output'}]});assert.equal(worker.sent.length,2);
  worker.reply('result',{data:{items:['stale']}},firstId);
  worker.reply('result',{data:{items:[]}});assert.deepEqual(await second,{items:[]});
 }finally{stopLocalRecognition();globalThis.Worker=original;}
});
test('queued cancellation preserves active inference; active cancellation restarts safely',async()=>{
 const original=globalThis.Worker;globalThis.Worker=FakeWorker;
 try{
  const a=new AbortController(),b=new AbortController();
  const first=recogniseLocalPhoto('a',{signal:a.signal}),second=recogniseLocalPhoto('b',{signal:b.signal}),third=recogniseLocalPhoto('c');
  const rejectedSecond=assert.rejects(second,{name:'AbortError'});b.abort();await rejectedSecond;
  const old=FakeWorker.instances.at(-1);assert.equal(old.terminated,undefined);assert.equal(old.sent.length,1);
  const rejectedFirst=assert.rejects(first,{name:'AbortError'});a.abort();await rejectedFirst;assert.equal(old.terminated,true);
  const fresh=FakeWorker.instances.at(-1);assert.notEqual(fresh,old);assert.equal(fresh.sent[0].image,'c');
  old.reply('result',{data:{items:['stale worker']}});fresh.reply('result',{data:{items:[]}});assert.deepEqual(await third,{items:[]});
 }finally{stopLocalRecognition();globalThis.Worker=original;}
});
test('stopping or worker failure settles every queued request',async()=>{
 const original=globalThis.Worker;globalThis.Worker=FakeWorker;
 try{
  const jobs=[recogniseLocalPhoto('a'),recogniseLocalPhoto('b')];const rejected=jobs.map(p=>assert.rejects(p,{name:'AbortError'}));stopLocalRecognition();await Promise.all(rejected);
  const jobs2=[recogniseLocalPhoto('c'),recogniseLocalPhoto('d')];const failed=jobs2.map(p=>assert.rejects(p,/unavailable/));FakeWorker.instances.at(-1).onerror();await Promise.all(failed);
  const last=recogniseLocalPhoto('e',{onProgress(){throw Error('view removed');}});const worker=FakeWorker.instances.at(-1);worker.reply('progress',{message:'Finding clothes'});worker.reply('result',{data:{items:[]}});assert.deepEqual(await last,{items:[]});
 }finally{stopLocalRecognition();globalThis.Worker=original;}
});
