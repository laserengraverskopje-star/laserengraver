export async function onRequestGet(context) {
  try {
    const key = context.params.key;

    if (!key) {
      return new Response('Missing image key', {
        status: 400
      });
    }

    const object = await context.env.IMAGES.get(key);

    if (!object) {
      return new Response('Image not found', {
        status: 404
      });
    }

    const headers = new Headers();

    object.writeHttpMetadata(headers);

    headers.set('etag', object.httpEtag);
    headers.set(
      'cache-control',
      'public, max-age=31536000, immutable'
    );

    return new Response(object.body, {
      headers
    });

  } catch (err) {
    return new Response(
      JSON.stringify({
        success: false,
        error: err.message
      }),
      {
        status: 500,
        headers: {
          'content-type': 'application/json'
        }
      }
    );
  }
}