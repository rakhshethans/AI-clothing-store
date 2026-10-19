let pendingInstall=null,pwaStarted=false;
export function refreshInstallUI(){
  const help=document.querySelector('#install-help'),button=document.querySelector('#install-app');
  if(!help)return;
  if(location.protocol==='file:'){help.textContent='This direct-file preview cannot be installed. Use the Node server on localhost for desktop testing, or host this project over HTTPS for home-screen installation on your phone.';}
  else if(!window.isSecureContext){help.textContent='Home-screen installation needs HTTPS. A phone accessing a plain-HTTP development address cannot use this as an installable app.';}
  else if(matchMedia('(display-mode: standalone)').matches){help.textContent='You’re using Threadline in its own app window. Your data still belongs to this browser and device.';}
  else{help.textContent='On iPhone: Safari → Share → Add to Home Screen. On Android: use the browser’s Install app or Add to Home screen option. Install availability depends on your browser.';}
  if(button){button.hidden=!pendingInstall;button.onclick=async()=>{if(!pendingInstall)return;await pendingInstall.prompt();await pendingInstall.userChoice;pendingInstall=null;refreshInstallUI();};}
}
export function initialisePWA(){
  if(pwaStarted)return;pwaStarted=true;
  window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();pendingInstall=event;refreshInstallUI();});
  window.addEventListener('appinstalled',()=>{pendingInstall=null;refreshInstallUI();});
  if(location.protocol!=='file:'&&window.isSecureContext&&'serviceWorker' in navigator){navigator.serviceWorker.register('/sw.js').catch(()=>{/* The app remains usable if offline registration is unavailable. */});}
}
