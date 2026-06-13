import { motion } from 'framer-motion';
import { Heart, Moon } from 'lucide-react';
import type { AppSettings, LoveChoice } from '../types';

export const IntroModal = ({
  settings,
  busyChoice,
  onChoose,
}: {
  settings: AppSettings;
  busyChoice: LoveChoice | null;
  onChoose: (choice: LoveChoice) => void;
}) => (
  <div className="fixed inset-0 z-40 grid place-items-center px-4 py-8">
    <div className="absolute inset-0 bg-[#120716]/55 backdrop-blur-sm" />
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative w-full max-w-xl overflow-hidden rounded-[28px] border border-white/20 bg-white/15 p-6 text-center text-white shadow-glow backdrop-blur-2xl sm:p-8"
    >
      <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full border border-amber-100/40 bg-amber-100/15 text-amber-100 shadow-gold">
        <Heart className="h-8 w-8 fill-current" />
      </div>
      <p className="mb-3 text-sm font-medium uppercase tracking-[0.28em] text-amber-100/80">
        {settings.heli_name} có một điều muốn hỏi {settings.lover_name}…
      </p>
      <h1 className="font-display text-3xl leading-tight text-white sm:text-5xl">
        {settings.intro_question}
      </h1>
      <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-rose-50/78 sm:text-base">
        Bé cứ trả lời theo trái tim của bé nha. Dù câu trả lời là gì, Heli vẫn trân trọng sự thật
        lòng của bé.
      </p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => onChoose('accept')}
          disabled={Boolean(busyChoice)}
          className="group inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-300 via-pink-300 to-amber-200 px-5 py-3 text-sm font-bold text-[#3a1026] shadow-gold transition hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-amber-100 disabled:cursor-wait disabled:opacity-70"
        >
          <Heart className="h-5 w-5 fill-current transition group-hover:rotate-6" />
          {busyChoice === 'accept' ? 'Đang lưu...' : 'Dạ, bé đồng ý với Heli 💖'}
        </button>
        <button
          type="button"
          onClick={() => onChoose('gentle')}
          disabled={Boolean(busyChoice)}
          className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/18 focus:outline-none focus:ring-2 focus:ring-rose-100 disabled:cursor-wait disabled:opacity-70"
        >
          <Moon className="h-5 w-5" />
          {busyChoice === 'gentle' ? 'Đang lưu...' : 'Bé cần thêm thời gian 🌙'}
        </button>
      </div>
    </motion.div>
  </div>
);
