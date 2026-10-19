// Lightweight app scroll progress. No campaign, media observers or animation library.
export function mountMotion(){
 const bar=document.querySelector('#prog'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let frame=0,active=true;
 const update=()=>{frame=0;if(!active||!bar)return;const depth=document.documentElement.scrollHeight-innerHeight;const progress=depth>0?Math.min(1,Math.max(0,scrollY/depth)):0;bar.style.transform='scaleX('+progress+')';};
 const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);reduced.addEventListener('change',schedule);schedule();
 return ()=>{active=false;cancelAnimationFrame(frame);removeEventListener('scroll',schedule);removeEventListener('resize',schedule);reduced.removeEventListener('change',schedule);};
}
