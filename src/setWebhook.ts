// setWebhook for bot
// The webhook configuration takes effect continuously after it is set once. So you don't need to set it every time
// you build or deploy, you just need to set it once when you change it.

import { Bot } from './Bot';

export const token = process.env.URLDBOT_TELEGRAM_TOKEN;
const host = process.env.URLDBOT_WEBHOOK_HOST;

if (!token || !host) {
  throw new Error('Missing environment variables');
}

const bot = new Bot(token);
await bot.registerWebhook(host);
