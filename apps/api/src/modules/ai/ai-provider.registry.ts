import type { AiProvider } from '../../application/interfaces/ai-provider.interface.js';

export class AiProviderRegistry {
  private readonly providers = new Map<string, AiProvider>();

  register(provider: AiProvider): void {
    if (this.providers.has(provider.key)) {
      throw new Error(`AI provider "${provider.key}" is already registered.`);
    }
    this.providers.set(provider.key, provider);
  }

  get(key: string): AiProvider | undefined {
    return this.providers.get(key);
  }
}
