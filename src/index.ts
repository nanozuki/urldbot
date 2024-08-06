import { Hono } from 'hono';
import { env } from 'hono/adapter';
import { Bot } from './Bot';

type Bindings = {
  [key in keyof CloudflareBindings]: CloudflareBindings[key];
};

const app = new Hono<{ Bindings: Bindings }>();

interface Env extends Record<string, unknown> {
  URLDBOT_TELEGRAM_TOKEN: string;
  URLDBOT_WEBHOOK_HOST: string;
}

app.post('/updates/:token', async (c) => {
  const { URLDBOT_TELEGRAM_TOKEN } = env<Env, typeof c>(c);
  if (c.req.param('token') != URLDBOT_TELEGRAM_TOKEN) {
    c.text('Unauthorized', 401);
  }
  const req = await c.req.json();
  console.log('req', req);
  const bot = new Bot(URLDBOT_TELEGRAM_TOKEN);
  const res = await bot.handleUpdate(req);
  console.log('res: ', res);
  return c.json(res);
});

export default app;
