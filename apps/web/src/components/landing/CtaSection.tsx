import type { JSX } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../ui/Button';
import { Reveal } from './Reveal';

export function CtaSection(): JSX.Element {
  return (
    <section className="relative overflow-hidden bg-zinc-950 py-28 text-center">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-600/20 blur-[100px]" />
      <Reveal>
        <div className="relative mx-auto max-w-xl px-6">
          <h2 className="text-4xl font-bold tracking-tight text-white">جاهز تدير تواصلك بذكاء؟</h2>
          <p className="mt-3 text-lg text-white/50">التسجيل مجاني ومحتاج دقيقتين بس.</p>
          <Link to="/register" className="mt-9 inline-block">
            <Button variant="primary" className="gap-2 px-8 py-3.5 text-base shadow-lg shadow-accent-600/30">
              جرّب Zoni مجانًا
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
