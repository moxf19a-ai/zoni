import type { JSX } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Link2, Sparkles } from 'lucide-react';
import { Reveal } from './Reveal';

const steps = [
  { icon: UserPlus, title: 'أنشئ حسابك', desc: 'إيميل وباسورد بس، وتقدر تبدأ فورًا.' },
  { icon: Link2, title: 'اربط قنواتك', desc: 'وصّل حساب إنستجرام بتاعك في خطوة واحدة.' },
  { icon: Sparkles, title: 'الذكاء الاصطناعي يبدأ يرد', desc: 'الردود بتحصل لوحدها من غير أي تدخل منك.' },
];

export function StepsSection(): JSX.Element {
  return (
    <section id="steps" className="mx-auto max-w-5xl px-6 py-32">
      <Reveal>
        <div className="text-center">
          <span className="text-xs font-medium uppercase tracking-widest text-accent-600 dark:text-accent-400">
            إزاي تشتغل
          </span>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
            تبدأ في 3 خطوات بسيطة
          </h2>
        </div>
      </Reveal>

      <div className="relative mt-20 grid grid-cols-1 gap-y-14 md:grid-cols-3 md:gap-x-6">
        {/* Connector line (desktop only) */}
        <div className="absolute right-0 top-7 hidden h-px w-full bg-gradient-to-l from-transparent via-zinc-300 to-transparent dark:via-white/15 md:block" />

        {steps.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.15}>
            <div className="relative flex flex-col items-center text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 + 0.1, type: 'spring', stiffness: 200 }}
                className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-900 shadow-lg dark:bg-white"
              >
                <s.icon className="h-6 w-6 text-white dark:text-zinc-900" />
                <span className="absolute -left-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-accent-600 text-xs font-bold text-white">
                  {i + 1}
                </span>
              </motion.div>
              <h3 className="mt-6 font-semibold text-zinc-900 dark:text-white">{s.title}</h3>
              <p className="mt-1.5 max-w-[220px] text-sm text-zinc-500 dark:text-zinc-400">{s.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
