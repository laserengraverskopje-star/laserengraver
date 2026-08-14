import { getSettings } from './_settings.js';
export async function onRequestPost(context) {
  try {
    const body = await context.request.json();

    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim();
    const phone = String(body.phone || '').trim();
    const service = String(body.service || '').trim();
    const material = String(body.material || '').trim();
    const dimensions = String(body.dimensions || '').trim();
    const description = String(body.description || '').trim();

    const siteSettings = await getSettings(context.env);
    if (siteSettings.offersEnabled !== 'true') {
      return Response.json({ success:false, error:'Барањето за понуда моментално не е достапно.' }, {status:503});
    }
    if (siteSettings.offerRequirePhone === 'true' && !phone) {
      return Response.json({ success:false, error:'Телефонскиот број е задолжителен.' }, {status:400});
    }
    if (siteSettings.offerRequireService === 'true' && !service) {
      return Response.json({ success:false, error:'Изберете услуга.' }, {status:400});
    }

    if (!name || !email || !description || (siteSettings.offerRequirePhone === 'true' && !phone) || (siteSettings.offerRequireService === 'true' && !service)) {
      return Response.json({
        success: false,
        error: 'Пополнете ги задолжителните полиња.'
      }, { status: 400 });
    }

    // Keep the request in D1 so the Admin Dashboard can count and manage it.
    await context.env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        service TEXT NOT NULL,
        material TEXT DEFAULT '',
        dimensions TEXT DEFAULT '',
        description TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `).run();

    // Older databases may not have created_at.
    try {
      const columns = await context.env.DB.prepare(`PRAGMA table_info(requests)`).all();
      const hasCreatedAt = (columns.results || []).some(c => c.name === 'created_at');
      if (!hasCreatedAt) {
        await context.env.DB.prepare(`ALTER TABLE requests ADD COLUMN created_at TEXT DEFAULT CURRENT_TIMESTAMP`).run();
      }
    } catch (_) {}

    await context.env.DB.prepare(`
      INSERT INTO requests
      (name, email, phone, service, material, dimensions, description)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
      .bind(name, email, phone, service, material, dimensions, description)
      .run();

    // Preserve the previous email workflow without making the browser submit
    // directly to FormSubmit. Database storage remains successful even if the
    // external notification service is temporarily unavailable.
    try {
      if (siteSettings.notifyOffers !== 'true' || !siteSettings.notificationEmail) throw new Error('notifications-disabled');
      await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(siteSettings.notificationEmail)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          service,
          material,
          dimensions,
          message: description,
          _subject: 'Ново барање од laserengraver.mk',
          _template: 'table',
          _captcha: 'false'
        })
      });
    } catch (_) {
      // Do not fail the user's request because an external email provider is down.
    }

    return Response.json({
      success: true,
      message: 'Барањето е успешно испратено.'
    });
  } catch (err) {
    return Response.json({
      success: false,
      error: err.message || 'Грешка при испраќање.'
    }, { status: 500 });
  }
}
