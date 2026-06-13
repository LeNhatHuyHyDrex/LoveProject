import { motion } from 'framer-motion';
import { Heart, NotebookPen } from 'lucide-react';
import type { Letter } from '../types';

const splitContent = (content: string) => content.split('\n').filter((line) => line.trim().length > 0);

export const LoveLetter = ({ letter, variant = 'accept' }: { letter: Letter; variant?: Letter['type'] }) => (
  <motion.article
    initial={{ opacity: 0, y: 28, scale: 0.98 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.7, ease: 'easeOut' }}
    className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-[22px] border border-white/25 bg-white/[0.14] p-4 text-white shadow-glow backdrop-blur-2xl sm:rounded-[28px] sm:p-8 lg:p-10"
  >
    <div className="mb-5 flex items-center gap-3 text-amber-100 sm:mb-6">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-amber-100/35 bg-amber-100/15 sm:h-11 sm:w-11">
        {variant === 'accept' ? (
          <Heart className="h-5 w-5 fill-current" />
        ) : (
          <NotebookPen className="h-5 w-5" />
        )}
      </span>
      <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-100/75 sm:text-xs sm:tracking-[0.25em]">
        Lá thư của Heli
      </span>
    </div>
    <h2 className="font-display text-[2rem] leading-tight text-white sm:text-5xl">{letter.title}</h2>
    <div className="mt-6 space-y-4 text-[15px] leading-7 text-rose-50/88 sm:mt-7 sm:space-y-5 sm:text-base sm:leading-8">
      {splitContent(letter.content).map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
  </motion.article>
);
