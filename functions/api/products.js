function ensureSchema(env) {
  return env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS catalog_items (
      slot_id TEXT PRIMARY KEY,
      gallery TEXT NOT NULL,
      slot INTEGER NOT NULL,
      image_path TEXT NOT NULL,
      category TEXT DEFAULT '',
      name TEXT DEFAULT '',
      price TEXT DEFAULT '',
      description TEXT DEFAULT '',
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `).run();
}

export async function onRequestGet(context) {
  try {
    await ensureSchema(context.env);

    // Migrate the older price records once, if they exist.
    try {
      const old = await context.env.DB.prepare(`
        SELECT id, image_path, name, price, description FROM products
      `).all();
      for (const row of (old.results || [])) {
        const match = String(row.image_path || '').match(/images\/galerija\s*([12])\/(\d+)\./i);
        if (!match) continue;
        const gallery = match[1] === '2' ? 'gallery2' : 'gallery1';
        const slot = Number(match[2]);
        const slotId = `g${match[1]}-${slot}`;
        await context.env.DB.prepare(`
          INSERT OR IGNORE INTO catalog_items
            (slot_id, gallery, slot, image_path, category, name, price, description, updated_at)
          VALUES (?, ?, ?, ?, '', ?, ?, ?, CURRENT_TIMESTAMP)
        `).bind(slotId, gallery, slot, row.image_path, row.name || '', row.price || '', row.description || '').run();
      }
    } catch (_) {
      // The legacy table may not exist on a fresh deployment.
    }

    const { results } = await context.env.DB.prepare(`
      SELECT slot_id, gallery, slot, image_path, category, name, price, description, updated_at
      FROM catalog_items
      ORDER BY gallery ASC, slot ASC
    `).all();

    return Response.json(results || []);
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const { username, password, slot_id, gallery, slot, image_path, category = '', name = '', price = '', description = '' } = body;

    if (username !== 'sharkylive' || password !== 'SharkyLive@50') {
      return Response.json({ success: false, error: 'Неовластен пристап.' }, { status: 401 });
    }
    if (!slot_id || !gallery || !slot || !image_path) {
      return Response.json({ success: false, error: 'Недостасуваат податоци за производот.' }, { status: 400 });
    }

    await ensureSchema(context.env);

    await context.env.DB.prepare(`
      INSERT INTO catalog_items
        (slot_id, gallery, slot, image_path, category, name, price, description, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(slot_id) DO UPDATE SET
        gallery = excluded.gallery,
        slot = excluded.slot,
        image_path = excluded.image_path,
        category = excluded.category,
        name = excluded.name,
        price = excluded.price,
        description = excluded.description,
        updated_at = CURRENT_TIMESTAMP
    `).bind(slot_id, gallery, Number(slot), image_path, category, name, price, description).run();

    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}
