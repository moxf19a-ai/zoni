import type { JSX } from 'react';
import { Instagram, CheckCircle2, Sparkles, TrendingUp, MessageSquare } from 'lucide-react';

/** A realistic, entirely-fake dashboard mockup built from our own UI tokens — no stock photos. */
export function ProductMockup(): JSX.Element {
  return (
    <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/80 shadow-2xl backdrop-blur-xl">
      {/* Window chrome */}
      <div className="flex items-center gap-1.5 border-b border-white/10 bg-white/[0.03] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
        <span className="mx-auto text-xs text-white/30">app.zoni.chat</span>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-px bg-white/5 p-px">
        {[
          { label: 'رسائل اليوم', value: '248', icon: MessageSquare },
          { label: 'معدل رد الـ AI', value: '96%', icon: Sparkles },
          { label: 'نمو المحادثات', value: '+18%', icon: TrendingUp },
        ].map((s) => (
          <div key={s.label} className="bg-zinc-900 p-3.5">
            <s.icon className="h-3.5 w-3.5 text-accent-500" />
            <p className="mt-2 text-lg font-bold text-white">{s.value}</p>
            <p className="text-[11px] text-white/40">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Conversation list */}
      <div className="space-y-1.5 p-3">
        {[
          { name: 'سارة أحمد', msg: 'عايزة أعرف سعر الشحن للقاهرة', time: '2د', active: true },
          { name: 'محمود جمال', msg: 'متوفر مقاس L؟', time: '5د', active: false },
        ].map((c) => (
          <div
            key={c.name}
            className={`flex items-center gap-3 rounded-xl p-2.5 ${c.active ? 'bg-white/[0.06]' : ''}`}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent-500 to-accent-700 text-xs font-bold text-white">
              {c.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white">{c.name}</span>
                <span className="text-[11px] text-white/30">{c.time}</span>
              </div>
              <p className="truncate text-xs text-white/40">{c.msg}</p>
            </div>
          </div>
        ))}

        {/* AI suggestion bubble */}
        <div className="mr-12 mt-2 rounded-xl rounded-tr-sm border border-accent-500/20 bg-accent-500/10 p-3">
          <div className="mb-1.5 flex items-center gap-1.5">
            <Sparkles className="h-3 w-3 text-accent-400" />
            <span className="text-[10px] font-medium text-accent-400">اقتراح الذكاء الاصطناعي</span>
          </div>
          <p className="text-xs text-white/70">أهلًا سارة! الشحن للقاهرة بياخد 2-3 أيام وسعره 50 جنيه 🚚</p>
        </div>
      </div>

      {/* Footer status bar */}
      <div className="flex items-center gap-2 border-t border-white/10 bg-white/[0.02] px-4 py-3">
        <Instagram className="h-4 w-4 text-accent-500" />
        <span className="text-xs text-white/50">متصل بإنستجرام</span>
        <CheckCircle2 className="mr-auto h-4 w-4 text-emerald-500" />
      </div>
    </div>
  );
}
