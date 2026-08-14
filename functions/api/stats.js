async function requireAdmin(context) {
  const auth = context.request.headers.get('Authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
  const username = context.env.ADMIN_USERNAME;
  const password = context.env.ADMIN_PASSWORD;

  if (!username || !password || !token) return false;
  return token === btoa(`${username}:${password}`);
}

async function ensureMessagesSchema(env) {
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
}

async function ensureMessageStatusColumn(env) {
  try {
    const columns = await env.DB.prepare(`PRAGMA table_info(contact_messages)`).all();
    const hasStatus = (columns.results || []).some(c => c.name === 'status');
    if (!hasStatus) {
      await env.DB.prepare(`ALTER TABLE contact_messages ADD COLUMN status TEXT NOT NULL DEFAULT 'new'`).run();
    }
  } catch (_) {}
}

export async function onRequestGet(context) {
  try {
    if (!(await requireAdmin(context))) {
      return Response.json({ success: false, error: 'Неовластен пристап.' }, { status: 401 });
    }

    await ensureMessagesSchema(context.env);
    await ensureMessageStatusColumn(context.env);
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

    const requestCount = await context.env.DB.prepare(`
      SELECT COUNT(*) AS count FROM requests
    `).first();

    const messageCount = await context.env.DB.prepare(`
      SELECT COUNT(*) AS count FROM contact_messages
    `).first();

    const unreadMessageCount = await context.env.DB.prepare(`
      SELECT COUNT(*) AS count FROM contact_messages WHERE status = 'new'
    `).first();

    // The gallery currently contains 155 real image slots.
    // Keep the count independent from the static asset request because the
    // Pages dev server may not expose the asset binding in local development.
    // Hidden catalog items are subtracted below, so only active gallery images count.
    const GALLERY_IMAGE_TOTAL = 155;
    const imageCount = GALLERY_IMAGE_TOTAL;

    // A hidden product keeps its gallery slot/image in the project, but it must not
    // be included in the public Dashboard image count. Only hidden gallery slots count.
    let hiddenCount = 0;
    try {
      const hidden = await context.env.DB.prepare(`
        SELECT COUNT(*) AS count
        FROM catalog_items
        WHERE active = 0
          AND gallery IN ('gallery1', 'gallery2')
      `).first();
      hiddenCount = Number(hidden?.count || 0);
    } catch (_) {}

    const publicImageCount = Math.max(0, imageCount - hiddenCount);

    // Verify that the D1 database is responsive. The endpoint itself is also
    // behind admin authentication, so this is a real server-side health check.
    await context.env.DB.prepare(`SELECT 1`).first();

    return Response.json({
      success: true,
      images: publicImageCount,
      offers: Number(requestCount?.count || 0),
      messages: Number(messageCount?.count || 0),
      unread_messages: Number(unreadMessageCount?.count || 0),
      status: 'Online',
      checked_at: new Date().toISOString()
    }, {
      headers: { 'Cache-Control': 'no-store' }
    });
  } catch (err) {
    return Response.json({
      success: false,
      status: 'Offline',
      error: err.message || 'Грешка при проверка на статусот.'
    }, { status: 503 });
  }
}
