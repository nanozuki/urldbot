import type { ApiResponse, Update, ApiMethods } from '@grammyjs/types';

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
      allowed_updates: ['inline_query'],
    });
    return;
  }

  async handleUpdate(update: Update): Promise<object> {
    console.log(update);
    if (update.inline_query) {
      const anwser: InlineQueryAnswer = {
        method: 'answerInlineQuery',
        inline_query_id: update.inline_query.id,
        results: [
          {
            type: 'article',
            id: '1',
            title: 'Echo',
            input_message_content: {
              message_text: update.inline_query.query,
            },
          },
        ],
      };
      return anwser;
    }
    return {};
  }
}

type InlineQueryAnswer = Parameters<
  ApiMethods<void>['answerInlineQuery']
>[0] & { method: 'answerInlineQuery' };
