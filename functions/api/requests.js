export async function onRequestGet(context) {

  const { results } = await context.env.DB.prepare(`
    SELECT *
    FROM requests
    ORDER BY id DESC
  `).all();

  return Response.json(results);

}