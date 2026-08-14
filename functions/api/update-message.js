import { isAdminRequest, getAdminCredentials, getSettings } from './_settings.js';
async function isAdmin(context) { return isAdminRequest(context); }

async function ensureSchema(env) {
  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT DEFAULT '',
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'new',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `).run();
  try {
    const columns = await env.DB.prepare(`PRAGMA table_info(contact_messages)`).all();
    const hasStatus = (columns.results || []).some(c => c.name === 'status');
    if (!hasStatus) await env.DB.prepare(`ALTER TABLE contact_messages ADD COLUMN status TEXT NOT NULL DEFAULT 'new'`).run();
  } catch (_) {}
}

export async function onRequestPost(context) {
  try {
    if (!(await isAdmin(context))) return Response.json({success:false,error:'Неовластен пристап.'},{status:401});
    const body = await context.request.json();
    const id = Number(body.id);
    const status = String(body.status || '').trim();
    if (!Number.isInteger(id) || id < 1) return Response.json({success:false,error:'Невалиден ID.'},{status:400});
    if (!['new','read'].includes(status)) return Response.json({success:false,error:'Невалиден статус.'},{status:400});
    await ensureSchema(context.env);
    const result = await context.env.DB.prepare(`UPDATE contact_messages SET status = ? WHERE id = ?`).bind(status,id).run();
    if (Number(result?.meta?.changes || 0) === 0) return Response.json({success:false,error:'Пораката не е пронајдена.'},{status:404});
    return Response.json({success:true,status});
  } catch (err) {
    return Response.json({success:false,error:err.message || 'Грешка при промена на статусот.'},{status:500});
  }
}
