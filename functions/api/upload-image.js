export async function onRequestPost(context) {
  try {
    const formData = await context.request.formData();

    const file = formData.get('image');

const authHeader = context.request.headers.get('Authorization') || '';
const token = authHeader.replace(/^Bearer\s+/i, '');

    if (!file || typeof file === 'string') {
      return Response.json(
        { success: false, error: 'Не е испратена слика.' },
        { status: 400 }
      );
    }

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

    const expectedToken = btoa(
      `${ADMIN_USERNAME}:${ADMIN_PASSWORD}`
    );

    if (token !== expectedToken) {
      return Response.json(
        { success: false, error: 'Неовластен пристап.' },
        { status: 401 }
      );
    }

    if (!file.type.startsWith('image/')) {
      return Response.json(
        { success: false, error: 'Дозволени се само слики.' },
        { status: 400 }
      );
    }

    const extension = file.name
      .split('.')
      .pop()
      .toLowerCase();

    const allowedExtensions = [
      'jpg',
      'jpeg',
      'png',
      'webp',
      'gif'
    ];

    if (!allowedExtensions.includes(extension)) {
      return Response.json(
        { success: false, error: 'Недозволен формат на слика.' },
        { status: 400 }
      );
    }

    const uniqueName =
      `${Date.now()}-${crypto.randomUUID()}.${extension}`;

    await context.env.IMAGES.put(
      uniqueName,
      file.stream(),
      {
        httpMetadata: {
          contentType: file.type
        }
      }
    );

    return Response.json({
  success: true,
  image_path: `/api/images/${uniqueName}`,
  filename: uniqueName
});

  } catch (err) {
    return Response.json(
      {
        success: false,
        error: err.message
      },
      { status: 500 }
    );
  }
}