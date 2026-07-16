import type { JSX } from 'react';
import { motion } from 'framer-motion';
import { Instagram, MessageCircle, Send, Music2 } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Reveal } from './Reveal';

const channels = [
  {
    key: 'instagram',
    icon: Instagram,
    name: 'إنستجرام',
    desc: 'رد تلقائي على الرسائل والتعليقات مباشرة.',
    active: true,
  },
  {
    key: 'whatsapp',
    icon: MessageCircle,
    name: 'واتساب',
    desc: 'تواصل فوري مع عملائك على أكتر تطبيق مراسلة انتشارًا.',
    active: false,
  },
  {
    key: 'telegram',
    icon: Send,
    name: 'تيليجرام',
    desc: 'أتمتة كاملة لقنواتك ومجموعاتك.',
    active: false,
  },
  {
    key: 'tiktok',
    icon: Music2,
    name: 'تيك توك',
    desc: 'حوّل تفاعل المحتوى لمحادثات حقيقية.',
    active: false,
  },
];

export function ChannelsSection(): JSX.Element {
  return (
    <section id="channels" className="relative bg-zinc-50 py-32 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="text-center">
            <span className="text-xs font-medium uppercase tracking-widest text-accent-600 dark:text-accent-400">
              القنوات
            </span>
            <h2 className="mt-3 text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
              كل قنوات عملائك، منصة واحدة
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-zinc-500 dark:text-zinc-400">
              بنبدأ بإنستجرام، وباقي القنوات في الطريق.
            </p>
          </div>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {channels.map((c, i) => (
            <Reveal key={c.key} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={`relative h-full rounded-2xl border p-6 transition-colors ${
                  c.active
                    ? 'border-accent-300 bg-white shadow-md dark:border-accent-500/30 dark:bg-white/[0.04]'
                    : 'border-zinc-200 bg-white/50 dark:border-white/10 dark:bg-white/[0.02]'
                }`}
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                    c.active ? 'bg-accent-600 text-white' : 'bg-zinc-200 text-zinc-500 dark:bg-white/10 dark:text-white/40'
                  }`}
                >
                  <c.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-semibold text-zinc-900 dark:text-white">{c.name}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">{c.desc}</p>
                <div className="mt-4">
                  <Badge tone={c.active ? 'success' : 'neutral'}>
                    {c.active ? 'متاح الآن' : 'قريبًا'}
                  </Badge>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
