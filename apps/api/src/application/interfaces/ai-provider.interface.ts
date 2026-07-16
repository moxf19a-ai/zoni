export interface AiReplyRequest {
  conversationHistory: { role: 'user' | 'assistant'; content: string }[];
  prompt: string;
}

export interface AiProvider {
  readonly key: string;
  generateReply(request: AiReplyRequest): Promise<string>;
}
