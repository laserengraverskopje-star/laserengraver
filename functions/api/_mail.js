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

  // Preferred provider: Cloudflare Email Sending API.
  // Configure these as production secrets/variables in Cloudflare Pages:
  // CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_EMAIL_API_TOKEN, MAIL_FROM
  const accountId = String(env.CLOUDFLARE_ACCOUNT_ID || '').trim();
  const apiToken = String(env.CLOUDFLARE_EMAIL_API_TOKEN || '').trim();
  const from = String(env.MAIL_FROM || '').trim();

  if (accountId && apiToken && from) {
    try {
      const html = `<div style="font-family:Arial,sans-serif"><h2>${esc(subject)}</h2><table style="border-collapse:collapse;width:100%;max-width:760px">${rowsHtml(fields)}</table></div>`;
      const payload = { from, to: [recipient], subject, text, html };
      if (replyTo) payload.reply_to = [replyTo];
      const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(accountId)}/email/sending/send`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok && data?.success) {
        return { sent: true, provider: 'cloudflare', messageId: data?.result?.message_id || '' };
      }
      const apiError = data?.errors?.map(e => e.message).join('; ') || `HTTP ${response.status}`;
      return { sent: false, provider: 'cloudflare', error: apiError };
    } catch (err) {
      return { sent: false, provider: 'cloudflare', error: err.message || 'Грешка при Cloudflare Email Sending.' };
    }
  }

  // Compatibility fallback for the existing project setup.
  // FormSubmit requires the destination address to be activated once.
  try {
    const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(recipient)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        ...Object.fromEntries(fields.map(([label, value]) => [label, value])),
        message: text,
        _subject: subject,
        _template: 'table',
        _captcha: 'false',
        ...(replyTo ? { _replyto: replyTo } : {})
      })
    });
    const data = await response.json().catch(() => ({}));
    if (response.ok && (data.success === true || data.success === 'true')) {
      return { sent: true, provider: 'formsubmit' };
    }
    const error = data?.message || data?.error || `HTTP ${response.status}`;
    return { sent: false, provider: 'formsubmit', error: String(error) };
  } catch (err) {
    return { sent: false, provider: 'formsubmit', error: err.message || 'Грешка при e-mail сервисот.' };
  }
}
