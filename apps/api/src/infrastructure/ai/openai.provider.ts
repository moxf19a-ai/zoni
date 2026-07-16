import type { AiProvider, AiReplyRequest } from '../../application/interfaces/ai-provider.interface.js';
import { appConfig } from '../../config/app.config.js';

export class OpenAiProvider implements AiProvider {
  readonly key = 'openai';

  async generateReply(request: AiReplyRequest): Promise<string> {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${appConfig.ai.openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          ...request.conversationHistory.map((m) => ({ role: m.role, content: m.content })),
          { role: 'user', content: request.prompt },
        ],
      }),
    });
    const body = (await res.json()) as { choices?: { message?: { content?: string } }[]; error?: { message: string } };
    if (!res.ok || !body.choices?.[0]?.message?.content) {
      throw new Error(`OpenAI reply generation failed: ${body.error?.message ?? res.statusText}`);
    }
    return body.choices[0].message.content;
  }
}
