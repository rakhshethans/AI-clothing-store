import {readFile,mkdir,writeFile,rename} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {validateCatalog} from '../public/domain.js';
export async function importCatalog(inputPath,rightsPath,outputPath){
  const [raw,permission]=await Promise.all([readFile(inputPath,'utf8'),readFile(rightsPath,'utf8')]);
  const records=validateCatalog(JSON.parse(raw),JSON.parse(permission));
  const output=path.resolve(outputPath);await mkdir(path.dirname(output),{recursive:true});
  const temp=output+'.staged';await writeFile(temp,JSON.stringify({importedAt:new Date().toISOString(),records},null,2));
  await rename(temp,output);return {count:records.length,output};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const [input,rights,output]=process.argv.slice(2);
  if(!input||!rights||!output){console.error('Usage: node scripts/import-catalog.mjs INPUT.json RIGHTS.json OUTPUT.json');process.exitCode=1;}
  else try{const result=await importCatalog(input,rights,output);console.log('Validated and staged '+result.count+' records. Snapshot: '+result.output+'\nNot connected to public catalogue automatically. Review rights and freshness first.');}catch(e){console.error('Import rejected: '+e.message);process.exitCode=1;}
}
