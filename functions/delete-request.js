export async function onRequestPost(context) {
  try {
    const { id } = await context.request.json();

    await context.env.DB.prepare(
      "DELETE FROM requests WHERE id = ?"
    )
      .bind(id)
      .run();

    return Response.json({
      success: true
    });

  } catch (err) {

    return Response.json({
      success: false,
      error: err.message
    }, {
      status: 500
    });

  }
}