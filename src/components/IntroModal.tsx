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
  <div className="fixed inset-0 z-40 grid place-items-center px-3 py-4 sm:px-4 sm:py-8">
    <div className="absolute inset-0 bg-[#120716]/55 backdrop-blur-sm" />
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative max-h-[calc(100svh-2rem)] w-full max-w-xl overflow-y-auto rounded-[24px] border border-white/20 bg-white/15 p-5 text-center text-white shadow-glow backdrop-blur-2xl sm:rounded-[28px] sm:p-8"
    >
      <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full border border-amber-100/40 bg-amber-100/15 text-amber-100 shadow-gold sm:mb-5 sm:h-16 sm:w-16">
        <Heart className="h-7 w-7 fill-current sm:h-8 sm:w-8" />
      </div>
      <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-amber-100/80 sm:text-sm sm:tracking-[0.28em]">
        {settings.heli_name} có một điều muốn hỏi {settings.lover_name}…
      </p>
      <h1 className="font-display text-[2rem] leading-tight text-white sm:text-5xl">
        {settings.intro_question}
      </h1>
      <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-rose-50/78 sm:mt-5 sm:text-base sm:leading-7">
        Bé cứ trả lời theo trái tim của bé nha. Dù câu trả lời là gì, Heli vẫn trân trọng sự thật
        lòng của bé.
      </p>
      <div className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-2">
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
