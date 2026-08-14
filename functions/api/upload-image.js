import { isAdminRequest, getAdminCredentials, getSettings } from './_settings.js';
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

    if (!(await isAdminRequest(context))) {
      return Response.json({ success:false, error:'Неовластен пристап.' }, {status:401});
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
      image_path: `https://images.laserengraver.mk/${uniqueName}`,
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