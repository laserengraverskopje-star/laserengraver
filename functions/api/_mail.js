function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function rowsHtml(fields) {
  return fields.map(([label, value]) =>
    `<tr><td style="padding:8px 10px;font-weight:700;border:1px solid #ddd;background:#f6f6f6">${esc(label)}</td><td style="padding:8px 10px;border:1px solid #ddd">${esc(value).replace(/\n/g, '<br>')}</td></tr>`
  ).join('');
}

export async function sendNotificationEmail(env, { to, subject, text, fields = [], replyTo = '' }) {
  const recipient = String(to || '').trim();
  if (!recipient) return { sent: false, provider: 'none', error: 'Нема внесено e-mail за известувања.' };

  const apiKey = String(env.RESEND_API_KEY || '').trim();
  const from = String(env.RESEND_FROM || '').trim();

  if (!apiKey || !from) {
    return {
      sent: false,
      provider: 'resend',
      status: 500,
      error: 'Resend не е конфигуриран: недостасува RESEND_API_KEY или RESEND_FROM.'
    };
  }

  try {
    const html = `<div style="font-family:Arial,sans-serif"><h2>${esc(subject)}</h2><table style="border-collapse:collapse;width:100%;max-width:760px">${rowsHtml(fields)}</table></div>`;
    const payload = { from, to: [recipient], subject, text, html };
    if (replyTo) payload.reply_to = [replyTo];

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const responseText = await response.text();
    let data = {};
    try { data = responseText ? JSON.parse(responseText) : {}; } catch (_) {}

    if (response.ok && data?.id) {
      return { sent: true, provider: 'resend', status: response.status, messageId: data.id };
    }

    const apiError = data?.message || data?.name || data?.error || responseText || `HTTP ${response.status}`;
    return {
      sent: false,
      provider: 'resend',
      status: response.status,
      error: String(apiError),
      retryAfter: response.headers.get('retry-after'),
      rateLimitRemaining: response.headers.get('ratelimit-remaining'),
      rateLimitReset: response.headers.get('ratelimit-reset')
    };
  } catch (err) {
    return {
      sent: false,
      provider: 'resend',
      status: 0,
      error: err?.message || 'Грешка при Resend e-mail сервисот.'
    };
  }
}
