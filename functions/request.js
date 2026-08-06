export async function onRequestPost(context) {
  return new Response(
    JSON.stringify({
      success: true,
      message: "API работи!"
    }),
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
}