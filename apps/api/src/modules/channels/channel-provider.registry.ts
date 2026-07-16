import type { ChannelProvider } from '../../application/interfaces/channel-provider.interface.js';

/**
 * The Plugin System's registry. Providers register themselves here at
 * composition-root time; ChannelsService looks providers up by key and
 * never imports a concrete provider class directly. Adding Facebook,
 * WhatsApp, Telegram, TikTok, or Email in a future milestone means:
 * write the provider class, register it here — nothing else in this
 * module changes.
 */
export class ChannelProviderRegistry {
  private readonly providers = new Map<string, ChannelProvider>();

  register(provider: ChannelProvider): void {
    if (this.providers.has(provider.key)) {
      throw new Error(`A channel provider with key "${provider.key}" is already registered.`);
    }
    this.providers.set(provider.key, provider);
  }

  get(key: string): ChannelProvider | undefined {
    return this.providers.get(key);
  }
}
