import { getAdminCredentials } from './_settings.js';

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const username = String(body.username || '');
    const password = String(body.password || '');
    const creds = await getAdminCredentials(context.env);
    if (!creds.username || !creds.password) return Response.json({ success:false, error:'Admin credentials are not configured.' }, {status:500});
    if (username !== creds.username || password !== creds.password) return Response.json({success:false,error:'Погрешно корисничко име или лозинка.'},{status:401});
    return Response.json({success:true,token:btoa(`${creds.username}:${creds.password}`)});
  } catch (err) { return Response.json({success:false,error:'Невалидно барање.'},{status:400}); }
}
