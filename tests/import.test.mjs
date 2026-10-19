import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,readFile,rm} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {importCatalog} from '../scripts/import-catalog.mjs';
import {products} from '../public/catalog.js';
test('repeated imports are idempotent and invalid input preserves last good snapshot',async()=>{
  const parent=fileURLToPath(new URL('../private-data/',import.meta.url));
  await mkdir(parent,{recursive:true});
  const dir=await mkdtemp(path.join(parent,'threadline-test-'));
  try{const input=path.join(dir,'input.json'),rights=path.join(dir,'rights.json'),output=path.join(dir,'snapshot.json');await writeFile(input,JSON.stringify([products[0]]));await writeFile(rights,JSON.stringify({display:true,reference:'controlled-test',allowedDomains:['example.com']}));
    await importCatalog(input,rights,output);await importCatalog(input,rights,output);const original=await readFile(output,'utf8');assert.equal(JSON.parse(original).records.length,1);
    await writeFile(input,'[]');await assert.rejects(()=>importCatalog(input,rights,output),/Empty catalogue/);assert.equal(await readFile(output,'utf8'),original);
  }finally{if(!path.resolve(dir).startsWith(path.resolve(parent)+path.sep))throw new Error('Unsafe test cleanup path');await rm(dir,{recursive:true,force:true});}
});
