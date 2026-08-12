function createToken(username, password) {
  return btoa(`${username}:${password}`);
}

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();

    const username = String(body.username || '');
    const password = String(body.password || '');

    const ADMIN_USERNAME = context.env.ADMIN_USERNAME;
    const ADMIN_PASSWORD = context.env.ADMIN_PASSWORD;
    console.log("ADMIN ENV:", {
    username: !!ADMIN_USERNAME,
    password: !!ADMIN_PASSWORD
    });
    if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
      return Response.json(
        {
          success: false,
          error: 'Admin credentials are not configured.'
        },
        { status: 500 }
      );
    }

    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return Response.json(
        {
          success: false,
          error: 'Погрешно корисничко име или лозинка.'
        },
        { status: 401 }
      );
    }

    const token = createToken(ADMIN_USERNAME, ADMIN_PASSWORD);

    return Response.json({
      success: true,
      token
    });

  } catch (err) {
    return Response.json(
      {
        success: false,
        error: 'Невалидно барање.'
      },
      { status: 400 }
    );
  }
}