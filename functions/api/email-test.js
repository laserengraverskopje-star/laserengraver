import { isAdminRequest, getSettings } from './_settings.js';
import { sendNotificationEmail } from './_mail.js';

export async function onRequestPost(context) {
  try {
    if (!(await isAdminRequest(context))) return Response.json({ success:false, error:'Неовластен пристап.' }, {status:401});
    const settings = await getSettings(context.env);
    if (!settings.notificationEmail) return Response.json({success:false,error:'Нема внесено e-mail за известувања.'},{status:400});
    const mail = await sendNotificationEmail(context.env, {
      to: settings.notificationEmail,
      subject: 'Тест e-mail – laserengraver.mk',
      text: 'Ова е тест порака од Admin панелот на laserengraver.mk.',
      fields: [['Статус','Тестирањето на Resend е завршено.'],['E-mail',settings.notificationEmail]]
    });
    return Response.json({success: !!mail.sent, emailSent: !!mail.sent, status: mail.status ?? null, provider: mail.provider, messageId: mail.messageId || '', error: mail.error || ''});
  } catch (err) {
    return Response.json({success:false,error:err.message||'Грешка при тестирање на e-mail.'},{status:500});
  }
}
