export const DEFAULT_SETTINGS = {
  siteName: 'Laser Engraver Skopje',
  siteTitle: 'Laser Engraver | laserengraver.mk',
  siteDescription: 'Laser engraving, laser cutting, personalized gifts, industrial marking, Skopje, Macedonia',
  phone: '+389 78 266 424',
  email: 'laserengraverskopje@gmail.com',
  address: 'Skopje - Makedonija',
  mapsUrl: 'https://www.google.com/maps?q=42.006683,21.511728',
  facebookUrl: '',
  instagramUrl: '',
  workingHours: 'По договор',
  notificationEmail: 'laserengraverskopje@gmail.com',
  notifyMessages: 'true',
  notifyOffers: 'true',
  offersEnabled: 'true',
  offerRequirePhone: 'true',
  offerRequireService: 'true',
  offerSuccessMessage: 'Вашето барање е успешно испратено. Ќе ве контактираме во најкраток можен рок.',
  maxExtraImages: '3',
  galleryColumns: '0',
  openMainOnExtraClick: 'true',
  adminAutoRefresh: '30'
};

export async function ensureSettingsSchema(env) {
  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL DEFAULT '',
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
    await env.DB.prepare(`
      INSERT OR IGNORE INTO site_settings (key, value, updated_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
    `).bind(key, String(value)).run();
  }

  // Migrate current environment credentials into the settings store once.
  if (env.ADMIN_USERNAME) {
    await env.DB.prepare(`INSERT OR IGNORE INTO site_settings (key, value, updated_at) VALUES ('admin_username', ?, CURRENT_TIMESTAMP)`)
      .bind(String(env.ADMIN_USERNAME)).run();
  }
  if (env.ADMIN_PASSWORD) {
    await env.DB.prepare(`INSERT OR IGNORE INTO site_settings (key, value, updated_at) VALUES ('admin_password', ?, CURRENT_TIMESTAMP)`)
      .bind(String(env.ADMIN_PASSWORD)).run();
  }
}

export async function getSettings(env) {
  await ensureSettingsSchema(env);
  const { results } = await env.DB.prepare(`SELECT key, value FROM site_settings`).all();
  const settings = { ...DEFAULT_SETTINGS };
  for (const row of (results || [])) settings[row.key] = row.value;
  return settings;
}

export async function getAdminCredentials(env) {
  const settings = await getSettings(env);
  return {
    username: settings.admin_username || env.ADMIN_USERNAME || '',
    password: settings.admin_password || env.ADMIN_PASSWORD || ''
  };
}

export async function isAdminRequest(context) {
  const auth = context.request.headers.get('Authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
  if (!token) return false;
  const { username, password } = await getAdminCredentials(context.env);
  return !!(username && password && token === btoa(`${username}:${password}`));
}

export async function publicSettings(env) {
  const s = await getSettings(env);
  return {
    siteName: s.siteName,
    siteTitle: s.siteTitle,
    siteDescription: s.siteDescription,
    phone: s.phone,
    email: s.email,
    address: s.address,
    mapsUrl: s.mapsUrl,
    facebookUrl: s.facebookUrl,
    instagramUrl: s.instagramUrl,
    workingHours: s.workingHours,
    offersEnabled: s.offersEnabled === 'true',
    offerRequirePhone: s.offerRequirePhone === 'true',
    offerRequireService: s.offerRequireService === 'true',
    offerSuccessMessage: s.offerSuccessMessage,
    maxExtraImages: Math.min(3, Math.max(1, Number(s.maxExtraImages || 3))),
    galleryColumns: Math.min(6, Math.max(0, Number(s.galleryColumns || 0))),
    openMainOnExtraClick: s.openMainOnExtraClick !== 'false'
  };
}
