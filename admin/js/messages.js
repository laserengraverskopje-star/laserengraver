function token(){return sessionStorage.getItem('adminToken') || '';}
function esc(v){return String(v ?? '').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
function errorBox(message){const e=document.getElementById('error');e.textContent=message||'';e.style.display=message?'block':'none';}
async function loadMessages(){
  errorBox('');
  const response=await fetch('/api/contact',{cache:'no-store',headers:{'Authorization':`Bearer ${token()}`}});
  if(response.status===401){sessionStorage.clear();location.href='login.html';return;}
  const data=await response.json();
  if(!response.ok || !Array.isArray(data)) throw new Error(data.error||'Грешка при читање на пораките.');
  const tbody=document.getElementById('messagesTable');
  tbody.innerHTML=data.length?data.map(m=>`<tr><td>${esc(m.id)}</td><td>${esc(m.name)}</td><td>${esc(m.email)}</td><td>${esc(m.phone)}</td><td class="message">${esc(m.message)}</td><td>${esc(m.created_at||'')}</td><td><button class="delete" onclick="deleteMessage(${Number(m.id)})">Избриши</button></td></tr>`).join(''):'<tr><td class="empty" colspan="7">Нема контакт пораки.</td></tr>';
}
async function deleteMessage(id){
  if(!confirm('Избриши ја пораката?'))return;
  const response=await fetch('/api/delete-message',{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${token()}`},body:JSON.stringify({id})});
  if(response.status===401){sessionStorage.clear();location.href='login.html';return;}
  const data=await response.json();
  if(!response.ok||!data.success){alert(data.error||'Грешка при бришење.');return;}
  loadMessages().catch(e=>errorBox(e.message));
}
loadMessages().catch(e=>errorBox(e.message));
