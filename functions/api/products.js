async function ensureSchema(env) {
  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS catalog_items (
      slot_id TEXT PRIMARY KEY,
      gallery TEXT NOT NULL,
      slot INTEGER NOT NULL,
      image_path TEXT NOT NULL,
      category TEXT DEFAULT '',
      name TEXT DEFAULT '',
      price TEXT DEFAULT '',
      description TEXT DEFAULT '',
      extra_images TEXT DEFAULT '[]',
      active INTEGER NOT NULL DEFAULT 1,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  // Existing databases may already have catalog_items without extra_images.
  const columns = await env.DB.prepare(`PRAGMA table_info(catalog_items)`).all();
  const hasExtraImages = (columns.results || []).some(c => c.name === 'extra_images');
  if (!hasExtraImages) {
    await env.DB.prepare(`ALTER TABLE catalog_items ADD COLUMN extra_images TEXT DEFAULT '[]'`).run();
  }

  const hasActive = (columns.results || []).some(c => c.name === 'active');
  if (!hasActive) {
    await env.DB.prepare(`ALTER TABLE catalog_items ADD COLUMN active INTEGER NOT NULL DEFAULT 1`).run();
  }
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
      SELECT slot_id, gallery, slot, image_path, category, name, price, description, extra_images, active, updated_at
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

const {
  token,
  slot_id,
  gallery,
  slot,
  image_path,
  category = '',
  name = '',
  price = '',
  description = '',
  extra_images = []
} = body;

if (!token) {
  return Response.json(
    { success: false, error: 'Неовластен пристап.' },
    { status: 401 }
  );
}

const ADMIN_USERNAME = context.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = context.env.ADMIN_PASSWORD;

if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
  return Response.json(
    { success: false, error: 'Admin credentials are not configured.' },
    { status: 500 }
  );
}

const expectedToken = btoa(`${ADMIN_USERNAME}:${ADMIN_PASSWORD}`);

if (token !== expectedToken) {
  return Response.json(
    { success: false, error: 'Неовластен пристап.' },
    { status: 401 }
  );
}
    const normalizedExtraImages = Array.isArray(extra_images)
      ? extra_images.filter(Boolean).slice(0, 3)
      : (() => {
          try {
            const parsed = JSON.parse(String(extra_images || '[]'));
            return Array.isArray(parsed) ? parsed.filter(Boolean).slice(0, 3) : [];
          } catch (_) {
            return [];
          }
        })();

    if (!slot_id || !gallery || !slot || !image_path) {
      return Response.json({ success: false, error: 'Недостасуваат податоци за производот.' }, { status: 400 });
    }

    await ensureSchema(context.env);

    await context.env.DB.prepare(`
      INSERT INTO catalog_items
        (slot_id, gallery, slot, image_path, category, name, price, description, extra_images, active, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP)
      ON CONFLICT(slot_id) DO UPDATE SET
        gallery = excluded.gallery,
        slot = excluded.slot,
        image_path = excluded.image_path,
        category = excluded.category,
        name = excluded.name,
        price = excluded.price,
        description = excluded.description,
        extra_images = excluded.extra_images,
        active = 1,
        updated_at = CURRENT_TIMESTAMP
    `).bind(slot_id, gallery, Number(slot), image_path, category, name, price, description, JSON.stringify(normalizedExtraImages)).run();

    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function onRequestDelete(context) {
  try {
    const body = await context.request.json();
    const { token, slot_id } = body || {};

    if (!token) {
      return Response.json(
        { success: false, error: 'Неовластен пристап.' },
        { status: 401 }
      );
    }

    const ADMIN_USERNAME = context.env.ADMIN_USERNAME;
    const ADMIN_PASSWORD = context.env.ADMIN_PASSWORD;

    if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
      return Response.json(
        { success: false, error: 'Admin credentials are not configured.' },
        { status: 500 }
      );
    }

    const expectedToken = btoa(`${ADMIN_USERNAME}:${ADMIN_PASSWORD}`);

    if (token !== expectedToken) {
      return Response.json(
        { success: false, error: 'Неовластен пристап.' },
        { status: 401 }
      );
    }

    if (!slot_id) {
      return Response.json(
        { success: false, error: 'Недостасува slot_id.' },
        { status: 400 }
      );
    }

    await ensureSchema(context.env);

    // Ова е СКРИВАЊЕ, не физичко бришење.
    // Ги задржуваме производот, главната слика и дополнителните слики.
    const result = await context.env.DB.prepare(`
      UPDATE catalog_items
      SET active = 0,
          updated_at = CURRENT_TIMESTAMP
      WHERE slot_id = ?
    `).bind(slot_id).run();

    if (!result.meta || result.meta.changes !== 1) {
      return Response.json(
        { success: false, error: 'Производот не е пронајден.' },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      hidden: slot_id
    });
  } catch (err) {
    return Response.json(
      {
        success: false,
        error: err.message || 'Грешка при криење.'
      },
      { status: 500 }
    );
  }
}
