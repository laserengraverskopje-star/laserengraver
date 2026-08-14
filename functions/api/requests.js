import { isAdminRequest, getAdminCredentials, getSettings } from './_settings.js';
async function isAdmin(context) { return isAdminRequest(context); }

export async function onRequestGet(context) {
  try {
    if (!(await isAdmin(context))) {
      return Response.json({ success: false, error: 'Неовластен пристап.' }, { status: 401 });
    }

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

    try {
      const columns = await context.env.DB.prepare(`PRAGMA table_info(requests)`).all();
      const hasCreatedAt = (columns.results || []).some(c => c.name === 'created_at');
      if (!hasCreatedAt) {
        await context.env.DB.prepare(`ALTER TABLE requests ADD COLUMN created_at TEXT DEFAULT CURRENT_TIMESTAMP`).run();
      }
    } catch (_) {}

    const { results } = await context.env.DB.prepare(`
      SELECT id, name, email, phone, service, material, dimensions, description, created_at
      FROM requests
      ORDER BY id DESC
    `).all();

    return Response.json(results || [], { headers: { 'Cache-Control': 'no-store' } });
  } catch (err) {
    return Response.json({ success: false, error: err.message || 'Грешка при читање на понуди.' }, { status: 500 });
  }
}
