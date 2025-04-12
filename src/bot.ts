import dotenv from "dotenv";
import { Telegraf, Context, Markup } from "telegraf";
import { Update, Message, InlineKeyboardMarkup, UserFromGetMe } from "telegraf/typings/core/types/typegram";

dotenv.config();

const BOT_TOKEN: string | undefined = process.env.BOT_TOKEN;

if (!BOT_TOKEN) {
  throw new Error("Не задан BOT_TOKEN в .env");
}

// Инициализация бота с типами контекста
const bot: Telegraf<Context<Update>> = new Telegraf<Context<Update>>(BOT_TOKEN);

// Команда /start
bot.start((ctx) => {
  ctx.reply("...");
});

// Обработка любых входящих сообщений
bot.on("message", async (ctx) => {
  const message: Message.TextMessage = ctx.message as Message.TextMessage;

  // Проверка, есть ли текст в сообщении
  if (!message.text) {
    return ctx.reply("Сообщение не содержит текста.");
  }

  const forwardedText: string = message.text;

  // Варианты кнопок
  const keyboard: Markup.Markup<InlineKeyboardMarkup> = Markup.inlineKeyboard([
    [Markup.button.callback("Create new lead in the CRM", "create_lead")],
    [Markup.button.callback("Skip this", "skip")],
  ]);

  await ctx.reply(forwardedText, keyboard);
});

// Кнопка: Create new lead in the CRM
bot.action("create_lead", async (ctx) => {
  await ctx.answerCbQuery(); // подтверждение
});

// Кнопка: Skip this
bot.action("skip", async (ctx) => {
  await ctx.reply("Закончил работу с сообщением");
  await ctx.answerCbQuery(); // подтверждение
});

// Функция запуска бота
export async function launchBot(): Promise<void> {
  try {
    const info: UserFromGetMe = await bot.telegram.getMe();
    console.log(`Бот @${info.username} успешно запущен!`);
    await bot.launch();
  } catch (error) {
    console.error("Ошибка запуска бота:", error);
  }

  // Корректное завершение
  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));
}
