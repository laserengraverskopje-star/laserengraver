async function isAdmin(context) {
  const auth = context.request.headers.get('Authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
  const username = context.env.ADMIN_USERNAME;
  const password = context.env.ADMIN_PASSWORD;
  return !!(username && password && token && token === btoa(`${username}:${password}`));
}

export async function onRequestPost(context) {
  try {
    if (!(await isAdmin(context))) {
      return Response.json({ success: false, error: 'Неовластен пристап.' }, { status: 401 });
    }
    const { id } = await context.request.json();
    if (!id) return Response.json({ success: false, error: 'Недостасува ID.' }, { status: 400 });

    const result = await context.env.DB.prepare(`DELETE FROM contact_messages WHERE id = ?`).bind(id).run();
    return Response.json({ success: true, deleted: Number(result?.meta?.changes || 0) });
  } catch (err) {
    return Response.json({ success: false, error: err.message || 'Грешка при бришење.' }, { status: 500 });
  }
}
