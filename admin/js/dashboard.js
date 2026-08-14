const dashboardState = {
  timer: null,
  loading: false
};

function adminToken() {
  return sessionStorage.getItem('adminToken') || '';
}

function formatCheckedAt(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return 'Последна проверка: —';
  return 'Последна проверка: ' + d.toLocaleString('mk-MK');
}

function setStatus(online, text, time) {
  const el = document.getElementById('statusValue');
  el.textContent = text;
  el.classList.toggle('status-online', online);
  el.classList.toggle('status-offline', !online);
  document.getElementById('statusTime').textContent = time || '—';
}

function showError(message) {
  const box = document.getElementById('errorBox');
  if (!message) {
    box.style.display = 'none';
    box.textContent = '';
    return;
  }
  box.style.display = 'block';
  box.textContent = message;
}

async function loadDashboardStats() {
  if (dashboardState.loading) return;
  dashboardState.loading = true;
  showError('');

  try {
    const token = adminToken();
    if (!token) {
      location.href = 'login.html';
      return;
    }

    const response = await fetch('../api/stats', {
      method: 'GET',
      cache: 'no-store',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.status === 401) {
      sessionStorage.removeItem('adminLogged');
      sessionStorage.removeItem('adminToken');
      location.href = 'login.html';
      return;
    }

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Неуспешна проверка на Dashboard статистиката.');
    }

    document.getElementById('imageCount').textContent = Number(data.images ?? 0);
    document.getElementById('messageCount').textContent = Number(data.messages ?? 0);
    document.querySelector('#messageCount + small').textContent = `вкупно контакт пораки • нови: ${Number(data.unread_messages ?? 0)}`;
    document.getElementById('offerCount').textContent = Number(data.offers ?? 0);
    setStatus(data.status === 'Online', data.status || 'Online', formatCheckedAt(data.checked_at));
  } catch (err) {
    console.error(err);
    setStatus(false, 'Offline', 'Нема врска со API / базата');
    showError(err.message || 'Грешка при поврзување со серверот.');
  } finally {
    dashboardState.loading = false;
  }
}

document.getElementById('refreshBtn').addEventListener('click', loadDashboardStats);
loadDashboardStats();
dashboardState.timer = setInterval(loadDashboardStats, 30000);
