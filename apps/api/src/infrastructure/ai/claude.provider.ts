import type { AiProvider, AiReplyRequest } from '../../application/interfaces/ai-provider.interface.js';
import { appConfig } from '../../config/app.config.js';

export class ClaudeProvider implements AiProvider {
  readonly key = 'claude';

  async generateReply(request: AiReplyRequest): Promise<string> {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': appConfig.ai.claudeApiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-latest',
        max_tokens: 1024,
        messages: [
          ...request.conversationHistory.map((m) => ({ role: m.role, content: m.content })),
          { role: 'user', content: request.prompt },
        ],
      }),
    });
    const body = (await res.json()) as { content?: { text?: string }[]; error?: { message: string } };
    if (!res.ok || !body.content?.[0]?.text) {
      throw new Error(`Claude reply generation failed: ${body.error?.message ?? res.statusText}`);
    }
    return body.content[0].text;
  }
}
