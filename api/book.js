export default async function handler(req, res) {
  // Разрешаем CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Метод не поддерживается' });
  }

  try {
    const { name, phone, service, date, time, notes } = req.body;

    if (!name || !phone || !service || !date || !time) {
      return res.status(400).json({ success: false, error: 'Все поля, кроме комментария, обязательны' });
    }

    const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;
    const googleSheetUrl = process.env.GOOGLE_SHEET_API_URL;

    // 1. Отправка в Google Таблицу (CRM)
    let sheetSuccess = false;
    let sheetErrorMsg = '';
    if (googleSheetUrl) {
      try {
        const sheetResponse = await fetch(googleSheetUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, phone, service, date, time, notes }),
        });
        
        if (sheetResponse.ok) {
          sheetSuccess = true;
        } else {
          sheetErrorMsg = `Статус ответа: ${sheetResponse.status}`;
        }
      } catch (err) {
        sheetErrorMsg = err.message;
      }
    } else {
      sheetErrorMsg = 'GOOGLE_SHEET_API_URL не задан';
    }

    // 2. Отправка в Telegram-бот
    let telegramSuccess = false;
    let telegramErrorMsg = '';
    if (telegramToken && telegramChatId) {
      try {
        const messageText = `
<b>Новая запись в салон MIENNE</b>

<b>Клиент:</b> ${name}
<b>Телефон:</b> ${phone}
<b>Услуга:</b> ${service}
<b>Дата:</b> ${date}
<b>Время:</b> ${time}
<b>Комментарий:</b> ${notes || 'отсутствует'}

<b>Запись в CRM:</b> ${sheetSuccess ? 'Успешно' : 'Ошибка (' + sheetErrorMsg + ')'}
        `.trim();

        const tgResponse = await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: telegramChatId,
            text: messageText,
            parse_mode: 'HTML',
          }),
        });

        if (tgResponse.ok) {
          telegramSuccess = true;
        } else {
          const tgErrData = await tgResponse.json();
          telegramErrorMsg = tgErrData.description || `Статус: ${tgResponse.status}`;
        }
      } catch (err) {
        telegramErrorMsg = err.message;
      }
    } else {
      telegramErrorMsg = 'TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID не заданы';
    }

    // Возвращаем результат
    if (sheetSuccess || telegramSuccess) {
      return res.status(200).json({
        success: true,
        sheet: { success: sheetSuccess, error: sheetErrorMsg },
        telegram: { success: telegramSuccess, error: telegramErrorMsg }
      });
    } else {
      return res.status(500).json({
        success: false,
        error: 'Не удалось отправить данные ни в один из сервисов',
        sheet: { error: sheetErrorMsg },
        telegram: { error: telegramErrorMsg }
      });
    }

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
