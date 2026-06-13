import clsx from 'clsx';
import { CalendarHeart, Gem } from 'lucide-react';
import type { TimelineItem as TimelineItemType } from '../types';
import { MediaGallery } from './MediaGallery';

export const TimelineItem = ({ item, index }: { item: TimelineItemType; index: number }) => {
  const isRight = index % 2 === 1;

  return (
    <div
      className={clsx(
        'timeline-reveal relative flex w-full pl-9 opacity-0 md:pl-0',
        isRight ? 'md:justify-end' : 'md:justify-start',
      )}
    >
      <span className="absolute left-4 top-7 z-10 block h-4 w-4 -translate-x-1/2 rounded-full border-2 border-amber-100 bg-rose-300 shadow-[0_0_24px_rgba(253,186,116,0.65)] md:left-1/2 md:top-8" />
      <article
        className={clsx(
          'group relative w-full rounded-[22px] border p-4 text-white shadow-glow backdrop-blur-2xl sm:p-6 md:w-[calc(50%-2.25rem)] md:rounded-[24px]',
          item.is_highlight
            ? 'border-amber-100/35 bg-white/[0.16]'
            : 'border-white/18 bg-white/[0.11]',
        )}
      >
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/16 bg-white/10 px-3 py-1.5 text-xs text-rose-50/78">
            <CalendarHeart className="h-4 w-4 text-amber-100" />
            {item.display_date ?? 'Một ngày đặc biệt'}
          </span>
          {item.mood ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100/15 px-3 py-1.5 text-xs font-medium text-amber-100">
              <Gem className="h-3.5 w-3.5" />
              {item.mood}
            </span>
          ) : null}
        </div>
        <h3 className="font-display text-2xl leading-tight text-white sm:text-3xl">{item.title}</h3>
        {item.description ? (
          <p className="mt-4 text-sm leading-7 text-rose-50/78 sm:text-[15px]">{item.description}</p>
        ) : null}
        <MediaGallery media={item.media} />
      </article>
    </div>
  );
};
