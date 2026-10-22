// Owner's no-spend policy: no provider requests, even if credentials are present.
const recognitionDisabledMessage='Automatic recognition is disabled to avoid API charges. You can mark several pieces in one photo manually.';
export function recognitionConfig(){return {enabled:false,model:'',reason:'no-spend'};}
export async function recogniseGarments(){throw Object.assign(new Error(recognitionDisabledMessage),{status:503});}
export function createWardrobeApi(){
 const send=(res,status,data)=>{res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(data));};
 return async function wardrobeApi(req,res,url){
  if(url.pathname==='/api/wardrobe/status'&&req.method==='GET'){send(res,200,{enabled:false,reason:'no-spend'});return;}
  if(url.pathname!=='/api/wardrobe/recognise'||req.method!=='POST'){send(res,405,{error:'Method not allowed.'});return;}
  send(res,503,{error:recognitionDisabledMessage,reason:'no-spend'});
 };
}
