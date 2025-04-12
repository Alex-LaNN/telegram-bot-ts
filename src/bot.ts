import dotenv from "dotenv";
import { Telegraf, Context, Markup } from "telegraf";
import { Update, Message, InlineKeyboardMarkup, UserFromGetMe } from "telegraf/typings/core/types/typegram";

dotenv.config();

const BOT_TOKEN: string | undefined = process.env.BOT_TOKEN;

if (!BOT_TOKEN) {
  throw new Error("Не задан BOT_TOKEN в .env");
}

// Initializing a Bot with Context Types
const bot: Telegraf<Context<Update>> = new Telegraf<Context<Update>>(BOT_TOKEN);

// Command /start
bot.start((ctx) => {
  ctx.reply("...");
});

// Processing any incoming messages
bot.on("message", async (ctx) => {
  const message: Message.TextMessage = ctx.message as Message.TextMessage;

  // Check if there is text in a message
  if (!message.text) {
    return ctx.reply("Сообщение не содержит текста.");
  }

  const forwardedText: string = message.text;

  // Button options
  const keyboard: Markup.Markup<InlineKeyboardMarkup> = Markup.inlineKeyboard([
    [Markup.button.callback("Create new lead in the CRM", "create_lead")],
    [Markup.button.callback("Skip this", "skip")],
  ]);

  await ctx.reply(forwardedText, keyboard);
});

// Button: Create new lead in the CRM
bot.action("create_lead", async (ctx) => {
  await ctx.answerCbQuery(); // confirm
});

// Button: Skip this
bot.action("skip", async (ctx) => {
  await ctx.reply("Закончил работу с сообщением");
  await ctx.answerCbQuery(); // confirm
});

// Bot launch function
export async function launchBot(): Promise<void> {
  try {
    const info: UserFromGetMe = await bot.telegram.getMe();
    console.log(`Бот @${info.username} успешно запущен!`);
    await bot.launch();
  } catch (error) {
    console.error("Ошибка запуска бота:", error);
  }

  // Correct completion
  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));
}
