async function ensureSchema(env) {
  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT DEFAULT '',
      message TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `).run();
}

async function isAdmin(context) {
  const auth = context.request.headers.get('Authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
  const username = context.env.ADMIN_USERNAME;
  const password = context.env.ADMIN_PASSWORD;
  return !!(username && password && token && token === btoa(`${username}:${password}`));
}

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
    await context.env.DB.prepare(`
      INSERT INTO contact_messages (name, email, phone, message)
      VALUES (?, ?, ?, ?)
    `).bind(name, email, phone, message).run();

    // Keep email notification available while the message is also stored in D1.
    try {
      await fetch('https://formsubmit.co/ajax/laserengraverskopje@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          message,
          _subject: 'Нова контакт порака од laserengraver.mk',
          _template: 'table',
          _captcha: 'false'
        })
      });
    } catch (_) {}

    return Response.json({ success: true, message: 'Пораката е успешно испратена.' });
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
    const { results } = await context.env.DB.prepare(`
      SELECT id, name, email, phone, message, created_at
      FROM contact_messages
      ORDER BY id DESC
    `).all();
    return Response.json(results || [], { headers: { 'Cache-Control': 'no-store' } });
  } catch (err) {
    return Response.json({ success: false, error: err.message || 'Грешка при читање пораки.' }, { status: 500 });
  }
}

export async function onRequestPostDelete(context) {
  // Kept for compatibility if a deployment maps this handler explicitly.
  return Response.json({ success: false, error: 'Unsupported operation.' }, { status: 405 });
}
