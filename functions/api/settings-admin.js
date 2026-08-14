import { getSettings, isAdminRequest } from './_settings.js';
export async function onRequestGet(context){
  try{
    if(!(await isAdminRequest(context))) return Response.json({success:false,error:'Неовластен пристап.'},{status:401});
    const s=await getSettings(context.env);
    return Response.json({success:true,admin_username:s.admin_username||'',notificationEmail:s.notificationEmail||'',notifyMessages:s.notifyMessages==='true',notifyOffers:s.notifyOffers==='true',adminAutoRefresh:s.adminAutoRefresh||'30'},{headers:{'Cache-Control':'no-store'}});
  }catch(err){return Response.json({success:false,error:err.message||'Грешка.'},{status:500});}
}
