function token() {
  return sessionStorage.getItem('adminToken') || '';
}

function esc(v) {
  return String(v ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
}

async function loadRequests() {
  const response = await fetch("/api/requests", {
    cache: 'no-store',
    headers: { 'Authorization': `Bearer ${token()}` }
  });

  if (response.status === 401) {
    sessionStorage.clear();
    location.href = 'login.html';
    return;
  }

  const requests = await response.json();
  if (!response.ok || !Array.isArray(requests)) {
    throw new Error(requests.error || 'Грешка при читање на понудите.');
  }

  const tbody = document.getElementById("offersTable");
  tbody.innerHTML = requests.length ? requests.map(r => `
    <tr>
      <td>${esc(r.id)}</td>
      <td>${esc(r.name)}</td>
      <td>${esc(r.email)}</td>
      <td>${esc(r.phone)}</td>
      <td>${esc(r.service)}</td>
      <td>${esc(r.material || '')}</td>
      <td>${esc(r.created_at || '')}</td>
      <td><button onclick="deleteRequest(${Number(r.id)})">Избриши</button></td>
    </tr>
  `).join('') : '<tr><td colspan="8">Нема понуди.</td></tr>';
}

async function deleteRequest(id){
  if(!confirm("Избриши ја понудата?")) return;

  const response = await fetch("/api/delete-request", {
    method:"POST",
    headers:{"Content-Type":"application/json",'Authorization':`Bearer ${token()}`},
    body:JSON.stringify({id})
  });

  if (response.status === 401) {
    sessionStorage.clear();
    location.href = 'login.html';
    return;
  }

  const data = await response.json();
  if (!response.ok || !data.success) {
    alert(data.error || 'Грешка при бришење.');
    return;
  }
  loadRequests().catch(err => alert(err.message));
}

loadRequests().catch(err => alert(err.message));
