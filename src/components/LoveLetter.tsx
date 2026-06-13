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
    className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-[28px] border border-white/25 bg-white/[0.14] p-5 text-white shadow-glow backdrop-blur-2xl sm:p-8 lg:p-10"
  >
    <div className="mb-6 flex items-center gap-3 text-amber-100">
      <span className="grid h-11 w-11 place-items-center rounded-full border border-amber-100/35 bg-amber-100/15">
        {variant === 'accept' ? (
          <Heart className="h-5 w-5 fill-current" />
        ) : (
          <NotebookPen className="h-5 w-5" />
        )}
      </span>
      <span className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-100/75">
        Lá thư của Heli
      </span>
    </div>
    <h2 className="font-display text-3xl leading-tight text-white sm:text-5xl">{letter.title}</h2>
    <div className="mt-7 space-y-5 text-[15px] leading-8 text-rose-50/86 sm:text-base">
      {splitContent(letter.content).map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
  </motion.article>
);
