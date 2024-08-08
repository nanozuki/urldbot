import type { ApiResponse, Update, ApiMethods } from '@grammyjs/types';
import { doctors, cleaner } from './doctors';
import { getUrlFromMessage, Reply } from './doctor';

export class Bot {
  constructor(private token: string) {}

  private methodUrl(method: string) {
    return `https://api.telegram.org/bot${this.token}/${method}`;
  }

  private async callApi<T>(method: string, body: object): Promise<T> {
    const url = this.methodUrl(method);
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (response.status !== 200) {
      throw new Error(`Failed to call API: HTTP ${response.status}`);
    }
    const res = (await response.json()) as ApiResponse<T>;
    if (!res.ok) {
      throw new Error(`Failed to call API: ${res.description}`);
    }
    return res.result;
  }

  async registerWebhook(host: string): Promise<void> {
    await this.callApi<boolean>('setWebhook', {
      url: `https://${host}/updates/${this.token}`,
      allowed_updates: ['inline_query', 'message', 'edited_message'],
    });
    return;
  }

  async handleUpdate(update: Update): Promise<object> {
    console.log(update);
    if (update.inline_query) {
      const replies = await getReply(update.inline_query.query);
      const anwser: InlineQueryAnswer = {
        method: 'answerInlineQuery',
        inline_query_id: update.inline_query.id,
        results: replies.map((reply, i) => ({
          type: 'article',
          id: (i + 1).toString(),
          title: reply.title,
          input_message_content: {
            message_text: reply.href,
          },
        })),
      };
      return anwser;
    }
    const message = update.message || update.edited_message;
    if (message?.text) {
      const replies = await getReply(message.text);
      for (const reply of replies) {
        await this.callApi<boolean>('sendMessage', {
          chat_id: message.chat.id,
          text: reply.href,
          link_preview_options: { is_disabled: false },
        });
      }
      if (replies.length === 0) {
        return {
          method: 'sendMessage',
          chat_id: message.chat.id,
          text: 'No supported URL found.',
        };
      }
    }
    return {};
  }
}

async function getReply(message: string): Promise<Reply[]> {
  const u = getUrlFromMessage(message);
  if (!u) {
    return [];
  }
  for (const doctor of doctors) {
    const replies = await doctor(u);
    if (replies.length > 0) {
      return replies;
    }
  }
  return cleaner(u);
}

type InlineQueryAnswer = Parameters<
  ApiMethods<void>['answerInlineQuery']
>[0] & { method: 'answerInlineQuery' };
