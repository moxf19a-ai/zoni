import type { AiProvider, AiReplyRequest } from '../../application/interfaces/ai-provider.interface.js';
import { appConfig } from '../../config/app.config.js';

export class GeminiProvider implements AiProvider {
  readonly key = 'gemini';

  async generateReply(request: AiReplyRequest): Promise<string> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${appConfig.ai.geminiApiKey}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          ...request.conversationHistory.map((m) => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }],
          })),
          { role: 'user', parts: [{ text: request.prompt }] },
        ],
      }),
    });
    const body = (await res.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
      error?: { message: string };
    };
    const text = body.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!res.ok || !text) {
      throw new Error(`Gemini reply generation failed: ${body.error?.message ?? res.statusText}`);
    }
    return text;
  }
}
