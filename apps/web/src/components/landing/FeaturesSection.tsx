import type { JSX } from 'react';
import { motion } from 'framer-motion';
import { Zap, Inbox, ShieldCheck, Layers } from 'lucide-react';
import { Reveal } from './Reveal';

const features = [
  {
    icon: Zap,
    title: 'رد فوري وذكي',
    desc: 'الذكاء الاصطناعي بيفهم سياق المحادثة ويرد بأسلوب طبيعي، على مدار الساعة من غير توقف.',
  },
  {
    icon: Inbox,
    title: 'صندوق وارد موحّد',
    desc: 'كل محادثاتك من كل القنوات في مكان واحد منظّم — فريقك يشتغل من شاشة واحدة بس.',
  },
  {
    icon: Layers,
    title: 'قابلة للتوسع',
    desc: 'منصة مبنية من الأساس عشان تكبر معاك — قنوات جديدة، فريق أكبر، عملاء أكتر.',
  },
  {
    icon: ShieldCheck,
    title: 'أمان مؤسسي',
    desc: 'بياناتك وتوكنات حساباتك متشفّرة بالكامل، ومحمية بمعايير أمان صارمة من أول يوم.',
  },
];

export function FeaturesSection(): JSX.Element {
  return (
    <section id="features" className="relative mx-auto max-w-6xl px-6 py-32">
      <Reveal>
        <div className="text-center">
          <span className="text-xs font-medium uppercase tracking-widest text-accent-600 dark:text-accent-400">
            المميزات
          </span>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
            كل اللي محتاجه في مكان واحد
          </h2>
        </div>
      </Reveal>

      <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-2">
        {features.map((f, i) => (
          <Reveal key={f.title} delay={i * 0.08}>
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="group relative h-full overflow-hidden rounded-2xl border border-zinc-200/70 bg-white/60 p-7 shadow-sm backdrop-blur-sm transition-colors hover:border-accent-300 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-accent-500/30"
            >
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-accent-500/0 blur-2xl transition-colors group-hover:bg-accent-500/10" />
              <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-accent-600/10 text-accent-600 dark:text-accent-400">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="relative mt-5 text-lg font-semibold text-zinc-900 dark:text-white">
                {f.title}
              </h3>
              <p className="relative mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                {f.desc}
              </p>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
