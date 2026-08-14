function token(){return sessionStorage.getItem('adminToken') || '';}
function esc(v){return String(v ?? '').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
function errorBox(message){const e=document.getElementById('error');e.textContent=message||'';e.style.display=message?'block':'none';}
function statusLabel(status){return status==='read'?'Прочитана':'Нова';}
function statusClass(status){return status==='read'?'read':'new';}
async function loadMessages(){
  errorBox('');
  const response=await fetch('/api/contact',{cache:'no-store',headers:{'Authorization':`Bearer ${token()}`}});
  if(response.status===401){sessionStorage.clear();location.href='login.html';return;}
  const data=await response.json();
  if(!response.ok || !data || !Array.isArray(data.messages)) throw new Error(data?.error||'Грешка при читање на пораките.');
  const tbody=document.getElementById('messagesTable');
  const summary=document.getElementById('summary');
  const unread=Number(data.unread||0);
  summary.textContent=`Вкупно: ${data.messages.length} • Нови: ${unread}`;
  tbody.innerHTML=data.messages.length?data.messages.map(m=>`<tr class="${m.status==='new'?'is-new':''}"><td>${esc(m.id)}</td><td><strong>${esc(m.name)}</strong></td><td>${esc(m.email)}</td><td>${esc(m.phone)}</td><td class="message">${esc(m.message)}</td><td>${esc(m.created_at||'')}</td><td><span class="badge ${statusClass(m.status)}">${statusLabel(m.status)}</span></td><td><button class="status-btn" onclick="toggleMessageStatus(${Number(m.id)},'${m.status==='new'?'read':'new'}')">${m.status==='new'?'Означи како прочитана':'Врати во нови'}</button><button class="delete" onclick="deleteMessage(${Number(m.id)})">Избриши</button></td></tr>`).join(''):'<tr><td class="empty" colspan="8">Нема контакт пораки.</td></tr>';
}
async function toggleMessageStatus(id,status){
  const response=await fetch('/api/update-message',{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${token()}`},body:JSON.stringify({id,status})});
  if(response.status===401){sessionStorage.clear();location.href='login.html';return;}
  const data=await response.json();
  if(!response.ok||!data.success){alert(data.error||'Грешка при промена на статусот.');return;}
  loadMessages().catch(e=>errorBox(e.message));
}
async function deleteMessage(id){
  if(!confirm('Избриши ја пораката?'))return;
  const response=await fetch('/api/delete-message',{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${token()}`},body:JSON.stringify({id})});
  if(response.status===401){sessionStorage.clear();location.href='login.html';return;}
  const data=await response.json();
  if(!response.ok||!data.success){alert(data.error||'Грешка при бришење.');return;}
  loadMessages().catch(e=>errorBox(e.message));
}
window.toggleMessageStatus=toggleMessageStatus;
window.deleteMessage=deleteMessage;
loadMessages().catch(e=>errorBox(e.message));