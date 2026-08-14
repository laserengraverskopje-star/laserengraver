function tok(){return sessionStorage.getItem('adminToken')||'';}
function authHeaders(){return {'Authorization':`Bearer ${tok()}`,'Content-Type':'application/json'};}
function setVal(id,v){const e=document.getElementById(id);if(e)e.value=v??'';}
let originalAdminUsername='';
let originalSiteTitle='';
function setCheck(id,v){const e=document.getElementById(id);if(e)e.checked=String(v)==='true';}
function show(id,msg){const e=document.getElementById(id);e.textContent=msg;e.style.display='block';setTimeout(()=>e.style.display='none',4500);}
async function load(){
  try{const r=await fetch('/api/site-settings',{cache:'no-store'});const d=await r.json();if(r.status===401){location.href='login.html';return;}if(!r.ok||!d.success&&!d.siteName)throw new Error(d.error||'Грешка при читање поставки.');
    ['siteName','siteTitle','siteDescription','phone','email','address','mapsUrl','facebookUrl','instagramUrl','workingHours','offerSuccessMessage'].forEach(k=>setVal(k,d[k]));
    originalSiteTitle=d.siteTitle||'';
    setVal('notificationEmail',d.notificationEmail||''); setCheck('notifyMessages',d.notifyMessages??true); setCheck('notifyOffers',d.notifyOffers??true);
    setCheck('offersEnabled',d.offersEnabled??true); setCheck('offerRequirePhone',d.offerRequirePhone??true); setCheck('offerRequireService',d.offerRequireService??true); setVal('maxExtraImages',d.maxExtraImages||3); setVal('galleryColumns',d.galleryColumns??0); setCheck('openMainOnExtraClick',d.openMainOnExtraClick??true);
    // admin-only fields come from the authenticated settings endpoint below
    const full=await fetch('/api/settings-admin',{cache:'no-store',headers:{'Authorization':`Bearer ${tok()}`}}); if(full.ok){const x=await full.json();if(x.success){originalAdminUsername=x.admin_username||'';setVal('admin_username',originalAdminUsername);setVal('notificationEmail',x.notificationEmail||'');setCheck('notifyMessages',x.notifyMessages);setCheck('notifyOffers',x.notifyOffers);setVal('autoRefresh', (x.adminAutoRefresh||30)+' секунди');}}
    document.getElementById('apiStatus').textContent='Online';
  }catch(e){document.getElementById('apiStatus').textContent='Грешка';show('err',e.message);}
}
async function save(){
 const siteNameValue=siteName.value.trim();
 const currentSiteTitle=siteTitle.value.trim();
 // If the browser title was never customized separately, keep it synchronized with the site/company name.
 const syncedTitle=(!currentSiteTitle || currentSiteTitle===originalSiteTitle) ? siteNameValue : currentSiteTitle;
 if(syncedTitle!==currentSiteTitle) setVal('siteTitle',syncedTitle);
 const settings={siteName:siteNameValue,siteTitle:syncedTitle,siteDescription:siteDescription.value.trim(),phone:phone.value.trim(),email:email.value.trim(),address:address.value.trim(),mapsUrl:mapsUrl.value.trim(),facebookUrl:facebookUrl.value.trim(),instagramUrl:instagramUrl.value.trim(),workingHours:workingHours.value.trim(),notificationEmail:notificationEmail.value.trim(),notifyMessages:String(notifyMessages.checked),notifyOffers:String(notifyOffers.checked),offersEnabled:String(offersEnabled.checked),offerRequirePhone:String(offerRequirePhone.checked),offerRequireService:String(offerRequireService.checked),offerSuccessMessage:offerSuccessMessage.value.trim(),maxExtraImages:maxExtraImages.value,galleryColumns:galleryColumns.value,openMainOnExtraClick:String(openMainOnExtraClick.checked)};
 const username=admin_username.value.trim(), newPassword=admin_password.value, current=currentPassword.value;
 const adminChanged=(username && username!==originalAdminUsername) || !!newPassword;
 if(adminChanged)settings.admin_username=username; if(newPassword)settings.admin_password=newPassword;
 if(adminChanged&&!current){show('err','За промена на Admin податоците внеси ја тековната лозинка.');return;}
 try{saveBtn.disabled=true;const r=await fetch('/api/site-settings',{method:'POST',headers:authHeaders(),body:JSON.stringify({settings,currentPassword:current})});const d=await r.json();if(r.status===401){location.href='login.html';return;}if(!r.ok||!d.success)throw new Error(d.error||'Грешка при зачувување.');
   show('ok','✓ Поставките се успешно зачувани.');admin_password.value='';currentPassword.value='';
   // New credentials invalidate the old token; ask for login again deliberately.
   if(adminChanged){sessionStorage.removeItem('adminToken');sessionStorage.removeItem('adminLogged');setTimeout(()=>location.href='login.html',900);}
 }catch(e){show('err',e.message);}finally{saveBtn.disabled=false;}
}
saveBtn.addEventListener('click',save);load();
