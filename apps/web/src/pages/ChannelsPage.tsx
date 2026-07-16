import type { JSX } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { listChannelConnections, getConnectUrl } from '../services/channels.service';
import { AVAILABLE_CHANNELS } from '../types/channel.types';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

const ERROR_MESSAGES: Record<string, string> = {
  CHANNEL_ALREADY_CONNECTED: 'الحساب ده متصل بالفعل بمستخدم تاني.',
  CHANNEL_CONNECTION_FAILED: 'حصلت مشكلة أثناء الاتصال. جرّب تاني.',
  CHANNEL_INVALID_OAUTH_STATE: 'انتهت صلاحية طلب الاتصال. جرّب تاني من هنا.',
};

export function ChannelsPage(): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();
  const connectedParam = searchParams.get('connected');
  const errorParam = searchParams.get('error');

  const { data: connections, isLoading } = useQuery({
    queryKey: ['channel-connections'],
    queryFn: listChannelConnections,
  });

  const connectMutation = useMutation({
    mutationFn: getConnectUrl,
    onSuccess: (url) => {
      window.location.href = url;
    },
  });

  const dismissBanner = (): void => {
    searchParams.delete('connected');
    searchParams.delete('error');
    setSearchParams(searchParams, { replace: true });
  };

  const connectionByProvider = new Map((connections ?? []).map((c) => [c.provider, c]));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">القنوات</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          اربط قنوات التواصل بتاعتك عشان تبدأ تستقبل وترد على رسائل عملائك.
        </p>
      </div>

      {connectedParam && (
        <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-300">
          <span>تم ربط الحساب بنجاح ✅</span>
          <button onClick={dismissBanner} className="text-emerald-600 hover:underline">إخفاء</button>
        </div>
      )}
      {errorParam && (
        <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-900/30 dark:text-red-300">
          <span>{ERROR_MESSAGES[errorParam] ?? 'حصلت مشكلة غير متوقعة.'}</span>
          <button onClick={dismissBanner} className="text-red-600 hover:underline">إخفاء</button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {AVAILABLE_CHANNELS.map((channel) => {
          const connection = connectionByProvider.get(channel.key);
          const isConnected = connection?.status === 'active';

          return (
            <Card key={channel.key} className="flex flex-col gap-3 p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-600 text-sm font-bold text-white">
                    {channel.name.charAt(0)}
                  </div>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">{channel.name}</span>
                </div>
                {!channel.available && <Badge tone="neutral">قريبًا</Badge>}
                {channel.available && isConnected && <Badge tone="success">متصل</Badge>}
              </div>

              {channel.available && (
                <Button
                  variant={isConnected ? 'secondary' : 'primary'}
                  disabled={isLoading || connectMutation.isPending}
                  onClick={() => connectMutation.mutate(channel.key)}
                >
                  {isConnected ? 'إعادة الربط' : 'ربط الحساب'}
                </Button>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
