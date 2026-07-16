import type { JSX } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { MessageSquare, Users, Link2, Sparkles, ArrowLeft, Inbox } from 'lucide-react';
import { useAuthStore } from '../stores/auth.store';
import { getAnalyticsSummary } from '../services/analytics.service';
import { listChannelConnections } from '../services/channels.service';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

const statCards = [
  { key: 'totalConversations', label: 'المحادثات', icon: MessageSquare },
  { key: 'totalContacts', label: 'جهات الاتصال', icon: Users },
] as const;

export function DashboardPage(): JSX.Element {
  const user = useAuthStore((state) => state.user);

  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ['analytics-summary'],
    queryFn: getAnalyticsSummary,
  });

  const { data: connections, isLoading: connectionsLoading } = useQuery({
    queryKey: ['channel-connections'],
    queryFn: listChannelConnections,
  });

  const connectedCount = connections?.filter((c) => c.status === 'active').length ?? 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">الرئيسية</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          أهلاً بيك{user ? `، ${user.email}` : ''} 👋
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {statCards.map((s, i) => (
          <motion.div
            key={s.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <Card className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500 dark:text-zinc-400">{s.label}</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-600/10 text-accent-600 dark:text-accent-400">
                  <s.icon className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-3 text-3xl font-bold text-zinc-900 dark:text-white">
                {summaryLoading ? '—' : (summary?.[s.key] ?? 0)}
              </p>
            </Card>
          </motion.div>
        ))}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500 dark:text-zinc-400">القنوات المتصلة</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-600/10 text-accent-600 dark:text-accent-400">
                <Link2 className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 text-3xl font-bold text-zinc-900 dark:text-white">
              {connectionsLoading ? '—' : connectedCount}
            </p>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Recent conversations / empty state */}
        <Card className="p-6 lg:col-span-2">
          <h2 className="font-semibold text-zinc-900 dark:text-white">آخر المحادثات</h2>
          {summary && summary.totalConversations > 0 ? (
            <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
              روح لصفحة المحادثات عشان تشوف كل حاجة بالتفصيل.
            </p>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-white/5">
                <Inbox className="h-5 w-5 text-zinc-400" />
              </div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                لسه مفيش محادثات. اربط قناة عشان تبدأ تستقبل رسائل.
              </p>
              <Link to="/channels">
                <Button variant="secondary" className="gap-1.5">
                  اربط قناة
                  <ArrowLeft className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          )}
        </Card>

        {/* Quick actions + connection status */}
        <Card className="p-6">
          <h2 className="font-semibold text-zinc-900 dark:text-white">إجراءات سريعة</h2>
          <div className="mt-4 space-y-2">
            <Link to="/channels" className="flex items-center justify-between rounded-lg border border-zinc-200 p-3 text-sm transition-colors hover:border-accent-300 dark:border-white/10 dark:hover:border-accent-500/30">
              <span className="flex items-center gap-2 text-zinc-700 dark:text-zinc-200">
                <Link2 className="h-4 w-4 text-accent-600 dark:text-accent-400" />
                إدارة القنوات
              </span>
              <Badge tone={connectedCount > 0 ? 'success' : 'neutral'}>
                {connectionsLoading ? '...' : connectedCount > 0 ? 'متصل' : 'غير متصل'}
              </Badge>
            </Link>
            <Link to="/inbox" className="flex items-center justify-between rounded-lg border border-zinc-200 p-3 text-sm transition-colors hover:border-accent-300 dark:border-white/10 dark:hover:border-accent-500/30">
              <span className="flex items-center gap-2 text-zinc-700 dark:text-zinc-200">
                <MessageSquare className="h-4 w-4 text-accent-600 dark:text-accent-400" />
                صندوق الوارد
              </span>
            </Link>
            <div className="flex items-center gap-2 rounded-lg bg-accent-600/5 p-3 text-sm text-zinc-500 dark:text-zinc-400">
              <Sparkles className="h-4 w-4 text-accent-600 dark:text-accent-400" />
              الذكاء الاصطناعي جاهز يرد أول ما تربط قناة.
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
