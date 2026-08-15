import { getSettings, isAdminRequest } from './_settings.js';
import { sendNotificationEmail } from './_mail.js';

export async function onRequestPost(context) {
  try {
    if (!(await isAdminRequest(context))) {
      return Response.json({ success: false, error: 'Неовластен пристап.' }, { status: 401 });
    }
    const settings = await getSettings(context.env);
    if (!settings.notificationEmail) {
      return Response.json({ success: false, error: 'Прво внеси e-mail за известувања.' }, { status: 400 });
    }
    const mail = await sendNotificationEmail(context.env, {
      to: settings.notificationEmail,
      subject: 'Тест e-mail — Laser Engraver',
      text: 'Ова е тест порака од Admin панелот. Ако ја гледаш, e-mail известувањата функционираат.',
      fields: [['Статус', 'Тест e-mail успешно испратен.']]
    });
    if (!mail.sent) {
      return Response.json({ success: false, error: mail.error || 'E-mail не е испратен.', provider: mail.provider }, { status: 502 });
    }
    return Response.json({ success: true, provider: mail.provider, messageId: mail.messageId || '' });
  } catch (err) {
    return Response.json({ success: false, error: err.message || 'Грешка при тестирање на e-mail.' }, { status: 500 });
  }
}
