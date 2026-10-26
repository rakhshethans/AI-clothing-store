import {localRecognitionStatus,localRecognitionFiles} from './local-recognition-assets.mjs';
import http from 'node:http';
import {createWardrobeApi} from './wardrobe-api.mjs';
const wardrobeApi=createWardrobeApi();
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {products} from './public/catalog.js';
const root=fileURLToPath(new URL('./public/',import.meta.url));
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.wasm':'application/wasm','.json':'application/json','.txt':'text/plain; charset=utf-8','.onnx':'application/octet-stream','.png':'image/png','.webp':'image/webp','.woff2':'font/woff2','.webmanifest':'application/manifest+json'};
const allowed=new Set(['example.com','example.org','example.net']);
export async function handleRequest(req,res){
  const url=new URL(req.url,'http://localhost');
  res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','no-referrer');
  res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; worker-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob:; connect-src 'self' data:; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'");
  if(url.pathname==='/api/wardrobe/local-status'&&req.method==='GET'){res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(await localRecognitionStatus()));return;}
  if(url.pathname==='/api/wardrobe/status'||url.pathname==='/api/wardrobe/recognise'){await wardrobeApi(req,res,url);return;}
  if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405,{'Allow':'GET, HEAD'});res.end('Method not allowed');return;}
  if(url.pathname==='/health'){res.writeHead(200,{'Content-Type':'application/json'});res.end(JSON.stringify({ok:true,catalogue:'controlled-sample',products:products.length}));return;}
  if(url.pathname.startsWith('/go/')){const p=products.find(p=>p.id===url.pathname.slice(4));if(!p||p.stock!=='in_stock'){res.writeHead(404);res.end('Sample offer unavailable');return;}const target=new URL(p.url);if(!allowed.has(target.hostname)||target.protocol!=='https:'){res.writeHead(400);res.end('Destination not allowed');return;}res.writeHead(302,{'Location':target.href,'Cache-Control':'no-store'});res.end();return;}
  const files={'/recognition-config.js':'recognition-config.js','/phone-check.html':'phone-check.html','/phone-check.js':'phone-check.js','/phone-check.css':'phone-check.css','/wardrobe-recognition.js':'wardrobe-recognition.js','/wardrobe-recognition-domain.js':'wardrobe-recognition-domain.js','/wardrobe-recognition-worker.js':'wardrobe-recognition-worker.js','/wardrobe-samples.js':'wardrobe-samples.js','/wardrobe.css':'wardrobe.css','/wardrobe.js':'wardrobe.js','/wardrobe-domain.js':'wardrobe-domain.js','/':'index.html','/index.html':'index.html','/styles.css':'styles.css','/app.js':'app.js','/domain.js':'domain.js','/catalog.js':'catalog.js','/explore.css':'explore.css','/theme.css':'theme.css','/social.js':'social.js','/social-domain.js':'social-domain.js','/pwa.js':'pwa.js','/sw.js':'sw.js','/manifest.webmanifest':'manifest.webmanifest','/assets/feed-editorial.webp':'assets/feed-editorial.webp','/assets/icon-192.png':'assets/icon-192.png','/assets/icon-512.png':'assets/icon-512.png','/media.js':'media.js','/motion.js':'motion.js','/vendor/gsap.min.js':'vendor/gsap.min.js','/vendor/ScrollTrigger.min.js':'vendor/ScrollTrigger.min.js','/assets/editorial.webp':'assets/editorial.webp','/assets/geist-variable.woff2':'assets/geist-variable.woff2'};
  const asset=url.pathname.startsWith('/local-recognition/')?url.pathname.slice('/local-recognition/'.length):'';
  const name=files[url.pathname]||(localRecognitionFiles.has(asset)?'local-recognition/'+asset:null);if(!name){res.writeHead(404);res.end('Not found');return;}
  try{const bytes=await readFile(path.join(root,name));res.writeHead(200,{'Content-Type':mime[path.extname(name)],'Cache-Control':asset?'private, max-age=31536000, immutable':'no-store'});res.end(req.method==='HEAD'?undefined:bytes);}catch{res.writeHead(500);res.end('Unable to load application file');}
}
export function createServer(){return http.createServer(handleRequest);}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  try{process.loadEnvFile('.env.local');}catch(error){if(error.code!=='ENOENT')throw error;}
  const port=Number(process.env.PORT||4187);const server=createServer();
  server.on('error',e=>{console.error('Unable to start local preview:',e.message);process.exitCode=1;});
  const host=process.env.THREADLINE_LAN_TEST==='1'?'0.0.0.0':'127.0.0.1';
  server.listen(port,host,()=>console.log('Threadline local preview: http://127.0.0.1:'+port+(host==='0.0.0.0'?' (LAN test enabled; phone diagnostic: /phone-check.html)':'')));
}
