// Vanilla motion. All observers, media playback and scheduled frames are disposed on routing.
export function mountMotion(){
  const campaign=document.querySelector('.campaign'),progress=document.querySelector('#prog');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)'),cleanups=[];
  let frame=0,active=true;
  const stage=campaign?.querySelector('.campaign-stage'),model=campaign?.querySelector('.campaign-model'),wordmark=campaign?.querySelector('.campaign-wordmark');
  const reveals=[...(campaign?.querySelectorAll('.campaign-reveal')||[])],parallax=campaign?.querySelector('.campaign-parallax img');
  const clamp=n=>Math.min(1,Math.max(0,n));
  function update(){
    frame=0;if(!active)return;
    const depth=document.documentElement.scrollHeight-innerHeight;
    if(progress)progress.style.transform='scaleX('+(depth>0?clamp(scrollY/depth):0)+')';
    if(!campaign||reduced.matches)return;
    const y=Math.min(stage.offsetHeight,Math.max(0,-stage.getBoundingClientRect().top));
    model.style.transform='translateY('+(-y*.06)+'px) scale('+(1+y*.00006)+')';wordmark.style.transform='translateY('+(y*.14)+'px)';
    for(const el of reveals){const r=el.getBoundingClientRect();el.style.setProperty('--p',clamp((innerHeight-r.top)/(innerHeight*.8)));}
    if(parallax){const r=parallax.parentElement.getBoundingClientRect();parallax.style.transform='translateY('+((innerHeight*.5-r.top-r.height*.5)*.06)+'px) scale(1.12)';}
  }
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};
  addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);
  cleanups.push(()=>removeEventListener('scroll',schedule),()=>removeEventListener('resize',schedule));
  if(campaign){
    const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('in');observer.unobserve(entry.target);}},{threshold:.06});
    campaign.querySelectorAll('.rv').forEach((el,i)=>{el.style.setProperty('--delay',(i%3)*70+'ms');observer.observe(el);});
    campaign.classList.toggle('motion-ready',!reduced.matches);cleanups.push(()=>observer.disconnect());
    const video=campaign.querySelector('video'),toggle=campaign.querySelector('.video-toggle'),status=campaign.querySelector('.video-status');
    let visible=false,manualPause=false,manualPlay=false;
    const setToggle=()=>{toggle.textContent=video.paused?'Play film':'Pause film';toggle.setAttribute('aria-label',video.paused?'Play fabric film':'Pause fabric film');};
    const loadVideo=()=>{if(!video.hasAttribute('src')){video.src=video.dataset.videoSrc;video.load();}};
    const play=()=>{loadVideo();video.play().catch(()=>{status.textContent='Film paused. Tap Play film to try again.';setToggle();});};
    const videoObserver=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible){loadVideo();if((!reduced.matches||manualPlay)&&!manualPause&&!document.hidden)play();}else video.pause();},{threshold:.1});
    videoObserver.observe(video);
    toggle.onclick=()=>{if(video.paused){manualPause=false;manualPlay=true;status.textContent='';play();}else{manualPause=true;manualPlay=false;video.pause();}};
    video.addEventListener('play',setToggle);video.addEventListener('pause',setToggle);
    video.addEventListener('error',()=>{status.textContent='The reference film could not load. You can retry with Play film.';setToggle();});
    const visibility=()=>{if(document.hidden)video.pause();else if(visible&&!manualPause&&(!reduced.matches||manualPlay))play();};document.addEventListener('visibilitychange',visibility);
    const motionChange=()=>{campaign.classList.toggle('motion-ready',!reduced.matches);if(reduced.matches){video.pause();model.style.transform='';wordmark.style.transform='';if(parallax)parallax.style.transform='';}schedule();};reduced.addEventListener('change',motionChange);
    cleanups.push(()=>{videoObserver.disconnect();video.pause();video.removeAttribute('src');video.load();document.removeEventListener('visibilitychange',visibility);reduced.removeEventListener('change',motionChange);});
    campaign.querySelectorAll('[data-editorial-target]').forEach(link=>{link.onclick=e=>{e.preventDefault();campaign.querySelector('#'+link.dataset.editorialTarget)?.scrollIntoView({behavior:reduced.matches?'instant':'smooth'});};});
  }
  schedule();document.fonts.ready.then(()=>{if(active)schedule();});
  return ()=>{active=false;cancelAnimationFrame(frame);cleanups.forEach(fn=>fn());};
}
