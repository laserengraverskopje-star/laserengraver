import { getSettings, isAdminRequest, publicSettings, ensureSettingsSchema } from './_settings.js';

const PUBLIC_KEYS = [
  'siteName','siteTitle','siteDescription','phone','email','address','mapsUrl',
  'facebookUrl','instagramUrl','workingHours','offersEnabled','galleryColumns','offerRequirePhone',
  'offerRequireService','offerSuccessMessage','maxExtraImages','openMainOnExtraClick'
];

export async function onRequestGet(context) {
  try {
    return Response.json(await publicSettings(context.env), { headers: { 'Cache-Control': 'no-store' } });
  } catch (err) {
    return Response.json({ success: false, error: err.message || 'Грешка при читање поставки.' }, { status: 500 });
  }
}

export async function onRequestPost(context) {
  try {
    if (!(await isAdminRequest(context))) {
      return Response.json({ success: false, error: 'Неовластен пристап.' }, { status: 401 });
    }
    await ensureSettingsSchema(context.env);
    const body = await context.request.json();
    const updates = body.settings || {};
    const currentPassword = String(body.currentPassword || '');
    const settings = await getSettings(context.env);

    if (updates.admin_username !== undefined || updates.admin_password !== undefined) {
      const oldPassword = settings.admin_password || context.env.ADMIN_PASSWORD || '';
      if (!currentPassword || currentPassword !== oldPassword) {
        return Response.json({ success: false, error: 'За промена на Admin податоците внеси ја тековната лозинка.' }, { status: 400 });
      }
    }

    for (const key of PUBLIC_KEYS) {
      if (updates[key] === undefined) continue;
      let value = String(updates[key] ?? '');
      if (key === 'maxExtraImages') value = String(Math.min(3, Math.max(1, Number(value || 3))));
      if (key === 'galleryColumns') value = String(Math.min(6, Math.max(0, Number(value || 0))));
      if (['offersEnabled','offerRequirePhone','offerRequireService','openMainOnExtraClick'].includes(key)) value = value === 'true' ? 'true' : 'false';
      await context.env.DB.prepare(`INSERT INTO site_settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP`).bind(key, value).run();
    }

    if (updates.notificationEmail !== undefined) {
      await context.env.DB.prepare(`INSERT INTO site_settings (key, value, updated_at) VALUES ('notificationEmail', ?, CURRENT_TIMESTAMP) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP`).bind(String(updates.notificationEmail || '')).run();
    }
    for (const key of ['notifyMessages','notifyOffers']) {
      if (updates[key] !== undefined) {
        const value = updates[key] === 'true' ? 'true' : 'false';
        await context.env.DB.prepare(`INSERT INTO site_settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP`).bind(key, value).run();
      }
    }
    if (updates.admin_username !== undefined) {
      const value = String(updates.admin_username || '').trim();
      if (!value) return Response.json({ success: false, error: 'Admin username не може да биде празен.' }, { status: 400 });
      await context.env.DB.prepare(`INSERT INTO site_settings (key, value, updated_at) VALUES ('admin_username', ?, CURRENT_TIMESTAMP) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP`).bind(value).run();
    }
    if (updates.admin_password !== undefined && String(updates.admin_password).length) {
      const value = String(updates.admin_password);
      if (value.length < 6) return Response.json({ success: false, error: 'Новата Admin лозинка мора да има најмалку 6 знаци.' }, { status: 400 });
      await context.env.DB.prepare(`INSERT INTO site_settings (key, value, updated_at) VALUES ('admin_password', ?, CURRENT_TIMESTAMP) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP`).bind(value).run();
    }

    return Response.json({ success: true, settings: await getSettings(context.env) }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (err) {
    return Response.json({ success: false, error: err.message || 'Грешка при зачувување на поставките.' }, { status: 500 });
  }
}
