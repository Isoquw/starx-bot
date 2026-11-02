
export default {
  async fetch(request, env) {
    if (request.method === "GET") {
      return new Response("⭐ StarLux Bot is running!");
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    let update;

    try {
      update = await request.json();
    } catch {
      return new Response("Invalid JSON", { status: 400 });
    }

    const message = update.message;
    const chatId = message?.chat?.id;
    const text = message?.text;

    if (!chatId || !text) {
      return new Response("OK");
    }

    let keyboard = [
      [{ text: "⭐ Купить Stars" }],
      [{ text: "💎 Прайс-лист" }, { text: "📞 Поддержка" }]
    ];

    let answer = "⭐ Добро пожаловать в StarLux!\n\nВыбери действие:";

    if (text === "/start" || text === "⬅️ Назад") {
      answer = "⭐ Добро пожаловать в StarLux!\n\nВыбери действие:";
    }

    else if (text === "⭐ Купить Stars") {
      answer = "⭐ Выбери количество Stars:";

      keyboard = [
        [{ text: "50 ⭐" }, { text: "100 ⭐" }],
        [{ text: "250 ⭐" }, { text: "500 ⭐" }],
        [{ text: "1000 ⭐" }],
        [{ text: "⬅️ Назад" }]
      ];
    }

    else if (["50 ⭐", "100 ⭐", "250 ⭐", "500 ⭐", "1000 ⭐"].includes(text)) {
      answer = `⭐ StarLux\n\nТы выбрал: ${text}\n\nДля оформления заказа напиши в поддержку:\n@YOUR_USERNAME`;

      keyboard = [
        [{ text: "📞 Поддержка" }],
        [{ text: "⬅️ Назад" }]
      ];
    }

    else if (text === "💎 Прайс-лист") {
      answer = "💎 ПРАЙС-ЛИСТ STARLUX\n\n" +
        "50 ⭐ — уточнить цену\n" +
        "100 ⭐ — уточнить цену\n" +
        "250 ⭐ — уточнить цену\n" +
        "500 ⭐ — уточнить цену\n" +
        "1000 ⭐ — уточнить цену\n\n" +
        "Для покупки обращайся в поддержку.";
    }

    else if (text === "📞 Поддержка") {
      answer = "📞 Поддержка StarLux\n\n" +
        "По вопросам покупки и оплаты:\n" +
        "@YOUR_USERNAME";
    }

    else {
      answer = "⭐ Используй кнопки меню StarLux.";
    }

    const response = await fetch(
      `https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: answer,
          reply_markup: {
            keyboard,
            resize_keyboard: true
          }
        })
      }
    );

    if (!response.ok) {
      return new Response("Telegram API error", { status: 502 });
    }

    return new Response("OK");
  }
};
