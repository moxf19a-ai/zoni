import type { JSX } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';
import { AmbientBackground } from './AmbientBackground';
import { ProductMockup } from './ProductMockup';

const trustBadges = [
  { icon: Sparkles, label: 'مدعوم بالذكاء الاصطناعي' },
  { icon: ShieldCheck, label: 'تكامل رسمي مع Meta' },
  { icon: Zap, label: 'إعداد في دقائق' },
];

export function HeroSection(): JSX.Element {
  return (
    <section className="relative overflow-hidden bg-zinc-950 text-white">
      <AmbientBackground />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 px-6 py-28 lg:grid-cols-2 lg:py-36">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-center lg:text-right"
        >
          <h1 className="text-5xl font-extrabold leading-[1.08] tracking-tight md:text-6xl lg:text-[4.2rem]">
            منصة واحدة تدير
            <br />
            <span className="bg-gradient-to-l from-accent-400 to-accent-600 bg-clip-text text-transparent">
              كل تواصلك مع عملائك
            </span>
          </h1>
          <p className="mx-auto mt-7 max-w-lg text-lg leading-relaxed text-white/60 lg:mx-0">
            الذكاء الاصطناعي بيرد على عملائك على مدار الساعة، وانت بتكبّر بيزنسك —
            كل المحادثات، كل القنوات، في مكان واحد ذكي.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <Link to="/register">
              <Button variant="primary" className="gap-2 px-7 py-3.5 text-base shadow-lg shadow-accent-600/20">
                ابدأ رحلتك مع Zoni
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <a href="#features">
              <Button
                variant="secondary"
                className="border-white/10 bg-white/5 px-7 py-3.5 text-base text-white backdrop-blur hover:bg-white/10"
              >
                شوف إزاي تشتغل
              </Button>
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 lg:justify-start">
            {trustBadges.map((b) => (
              <div key={b.label} className="flex items-center gap-1.5 text-xs text-white/40">
                <b.icon className="h-3.5 w-3.5 text-accent-500" />
                {b.label}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="flex justify-center"
        >
          <ProductMockup />
        </motion.div>
      </div>
    </section>
  );
}
