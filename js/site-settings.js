(function(){
  async function applySiteSettings(){
    try{
      const r=await fetch('/api/site-settings',{cache:'no-store'});
      const s=await r.json();
      if(!r.ok || s.success===false) return;
      const title=document.querySelector('title'); if(title&&s.siteTitle) title.textContent=s.siteTitle;
      const desc=document.querySelector('meta[name="description"]'); if(desc&&s.siteDescription) desc.setAttribute('content',s.siteDescription);
      const phone=document.getElementById('contactPhone'); if(phone) phone.textContent='📞 '+(s.phone||'');
      const addr=document.getElementById('contactAddress'); if(addr) addr.textContent='📍 '+(s.address||'');
      const hours=document.getElementById('contactHours'); if(hours) hours.textContent=s.workingHours ? '🕒 '+s.workingHours : '';
      const email=document.getElementById('contactEmail'); if(email) email.textContent=s.email ? '✉️ '+s.email : '';
      const map=document.getElementById('contactMap'); if(map&&s.mapsUrl) map.href=s.mapsUrl;
      const footer=document.getElementById('siteFooter'); if(footer&&s.siteName) footer.textContent='© 2026 '+s.siteName;
      const socials=document.getElementById('contactSocials'); if(socials){
        socials.innerHTML='';
        if(s.facebookUrl) socials.insertAdjacentHTML('beforeend',`<a href="${esc(s.facebookUrl)}" target="_blank" rel="noopener">Facebook</a>`);
        if(s.instagramUrl) socials.insertAdjacentHTML('beforeend',`<a href="${esc(s.instagramUrl)}" target="_blank" rel="noopener">Instagram</a>`);
      }
      const quoteBtn=document.getElementById('quoteBtn'), quoteModal=document.getElementById('quoteModal');
      if(s.offersEnabled===false){ if(quoteBtn) quoteBtn.style.display='none'; if(quoteModal) quoteModal.style.display='none'; }
      else if(quoteBtn){ quoteBtn.style.display=''; }
      const phoneInput=document.querySelector('#quoteForm input[name="phone"]'); if(phoneInput) phoneInput.required=!!s.offerRequirePhone;
      const serviceInput=document.querySelector('#quoteForm select[name="service"]'); if(serviceInput) serviceInput.required=!!s.offerRequireService;
      const success=document.getElementById('successMessage'); if(success&&s.offerSuccessMessage) success.textContent='✅ '+s.offerSuccessMessage;
      window.siteSettings=s;
      if(s.galleryColumns){ const style=document.createElement('style'); style.textContent=`.gallery-grid{grid-template-columns:repeat(${Number(s.galleryColumns)},minmax(0,1fr)) !important}`; document.head.appendChild(style); }
    }catch(e){console.warn('Site settings could not be loaded.',e);}
  }
  function esc(v){return String(v||'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
  document.addEventListener('DOMContentLoaded',applySiteSettings);
})();
