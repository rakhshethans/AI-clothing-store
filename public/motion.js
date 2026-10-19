// GSAP is vendored locally. Essential content is visible even if motion cannot initialise.
export function mountMotion(){
  const gsap=window.gsap, ScrollTrigger=window.ScrollTrigger;
  if(!gsap||!ScrollTrigger||!document.querySelector('.hero'))return ()=>{};
  gsap.registerPlugin(ScrollTrigger);
  const mm=gsap.matchMedia();
  const copy=document.querySelector('[data-reveal]');
  if(copy){
    const text=copy.textContent;
    copy.setAttribute('aria-label',text);
    copy.replaceChildren(...text.split(' ').flatMap((word,i)=>{
      const span=document.createElement('span');span.textContent=word;span.setAttribute('aria-hidden','true');
      return i?[document.createTextNode(' '),span]:[span];
    }));
  }
  mm.add('(prefers-reduced-motion: no-preference)',()=>{
    gsap.from('.hero h1',{y:18,opacity:0,duration:.65,ease:'power2.out',clearProps:'transform,opacity'});
    gsap.from('.hero-copy',{y:12,opacity:0,duration:.6,delay:.15,ease:'power2.out',clearProps:'transform,opacity'});
    if(copy)gsap.fromTo(copy.querySelectorAll('span'),{opacity:.16},{opacity:1,stagger:.1,ease:'none',scrollTrigger:{trigger:copy,start:'top 85%',end:'bottom 48%',scrub:.35}});
  });
  mm.add('(min-width: 1000px) and (prefers-reduced-motion: no-preference)',()=>{
    ScrollTrigger.create({trigger:'.style-section',start:'top 70px',end:'bottom bottom-=30px',pin:'.styling-intro',pinSpacing:false,invalidateOnRefresh:true});
  });
  let active=true;
  document.fonts.ready.then(()=>{if(active)ScrollTrigger.refresh();});
  return ()=>{active=false;mm.revert();};
}
