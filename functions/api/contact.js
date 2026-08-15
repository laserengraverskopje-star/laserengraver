import { isAdminRequest, getAdminCredentials, getSettings } from './_settings.js';
import { sendNotificationEmail } from './_mail.js';
async function ensureSchema(env) {
  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL DEFAULT '',
      email TEXT NOT NULL DEFAULT '',
      phone TEXT DEFAULT '',
      message TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'new',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  // Older deployments may already have contact_messages with an older schema.
  // Add only missing columns so existing messages are preserved.
  const columns = await env.DB.prepare(`PRAGMA table_info(contact_messages)`).all();
  const names = new Set((columns.results || []).map(c => c.name));
  const migrations = [
    ['name', `ALTER TABLE contact_messages ADD COLUMN name TEXT NOT NULL DEFAULT ''`],
    ['email', `ALTER TABLE contact_messages ADD COLUMN email TEXT NOT NULL DEFAULT ''`],
    ['phone', `ALTER TABLE contact_messages ADD COLUMN phone TEXT DEFAULT ''`],
    ['message', `ALTER TABLE contact_messages ADD COLUMN message TEXT NOT NULL DEFAULT ''`],
    ['status', `ALTER TABLE contact_messages ADD COLUMN status TEXT NOT NULL DEFAULT 'new'`],
    ['created_at', `ALTER TABLE contact_messages ADD COLUMN created_at TEXT DEFAULT CURRENT_TIMESTAMP`]
  ];
  for (const [name, sql] of migrations) {
    if (!names.has(name)) await env.DB.prepare(sql).run();
  }
}

async function ensureStatusColumn(env) {
  // Kept for compatibility with earlier versions of the API.
  await ensureSchema(env);
}

async function isAdmin(context) { return isAdminRequest(context); }

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim();
    const phone = String(body.phone || '').trim();
    const message = String(body.message || '').trim();

    if (!name || !email || !message) {
      return Response.json({ success: false, error: 'Пополнете ги задолжителните полиња.' }, { status: 400 });
    }

    await ensureSchema(context.env);
    await ensureStatusColumn(context.env);
    await context.env.DB.prepare(`
      INSERT INTO contact_messages (name, email, phone, message, status)
      VALUES (?, ?, ?, ?, 'new')
    `).bind(name, email, phone, message).run();

    const siteSettings = await getSettings(context.env);
    let emailSent = false;
    const emailExpected = siteSettings.notifyMessages === 'true';
    let emailError = '';
    if (siteSettings.notifyMessages === 'true' && siteSettings.notificationEmail) {
      const mail = await sendNotificationEmail(context.env, {
        to: siteSettings.notificationEmail,
        subject: 'Нова контакт порака од laserengraver.mk',
        replyTo: email,
        text: `Име: ${name}\nE-mail: ${email}\nТелефон: ${phone}\n\nПорака:\n${message}`,
        fields: [
          ['Име', name],
          ['E-mail', email],
          ['Телефон', phone],
          ['Порака', message]
        ]
      });
      emailSent = !!mail.sent;
      emailError = mail.sent ? '' : (mail.error || 'E-mail известувањето не е испратено.');
    }

    return Response.json({ success: true, emailSent, warning: emailExpected && !emailSent ? (emailError || 'Пораката е зачувана, но e-mail известувањето не е испратено.') : '' });
  } catch (err) {
    return Response.json({ success: false, error: err.message || 'Грешка при испраќање.' }, { status: 500 });
  }
}

export async function onRequestGet(context) {
  try {
    if (!(await isAdmin(context))) {
      return Response.json({ success: false, error: 'Неовластен пристап.' }, { status: 401 });
    }
    await ensureSchema(context.env);
    await ensureStatusColumn(context.env);
    const { results } = await context.env.DB.prepare(`
      SELECT id, name, email, phone, message, status, created_at
      FROM contact_messages
      ORDER BY id DESC
    `).all();
    const unread = await context.env.DB.prepare(`SELECT COUNT(*) AS count FROM contact_messages WHERE status = 'new'`).first();
    return Response.json({ messages: results || [], unread: Number(unread?.count || 0) }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (err) {
    return Response.json({ success: false, error: err.message || 'Грешка при читање пораки.' }, { status: 500 });
  }
}

export async function onRequestPostDelete(context) {
  // Kept for compatibility if a deployment maps this handler explicitly.
  return Response.json({ success: false, error: 'Unsupported operation.' }, { status: 405 });
}
