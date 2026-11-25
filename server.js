
const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const OpenAI = require("openai");

const app = express();
app.use(express.json());

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  polling: true
});
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

bot.onText(/\/start/, async (msg) => {
  await bot.sendMessage(
    msg.chat.id,
    "¡Hola! 🤖 Soy TUSTORE AI, tu asistente inteligente de TuStore Tech. ¿En qué puedo ayudarte?"
  );
});

bot.on("message", async (msg) => {
  if (!msg.text || msg.text.startsWith("/")) return;

  try {
    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: msg.text
    });

    await bot.sendMessage(
      msg.chat.id,
      response.output_text || "No pude generar una respuesta."
    );
  } catch (error) {
    console.error("Error:", error.message);
    await bot.sendMessage(
      msg.chat.id,
      "Estoy teniendo un problema técnico. Intentá nuevamente."
    );
  }
});

app.get("/", (req, res) => {
  res.send("TUSTORE AI está funcionando.");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor TUSTORE AI iniciado.");
});
