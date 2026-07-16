export interface ChannelConnection {
  provider: string;
  status: string;
  externalAccountId: string;
}

export interface AvailableChannel {
  key: string;
  name: string;
  available: boolean;
}

export const AVAILABLE_CHANNELS: AvailableChannel[] = [
  { key: 'instagram', name: 'إنستجرام', available: true },
  { key: 'whatsapp', name: 'واتساب', available: false },
  { key: 'telegram', name: 'تيليجرام', available: false },
  { key: 'tiktok', name: 'تيك توك', available: false },
];
