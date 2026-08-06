export async function onRequestPost(context) {
  try {
    const body = await context.request.json();

    const {
      name,
      email,
      phone,
      service,
      material,
      dimensions,
      description
    } = body;

    await context.env.DB.prepare(`
      INSERT INTO requests
      (name, email, phone, service, material, dimensions, description)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
    .bind(
      name,
      email,
      phone,
      service,
      material,
      dimensions,
      description
    )
    .run();

    return Response.json({
      success: true,
      message: "Барањето е зачувано."
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