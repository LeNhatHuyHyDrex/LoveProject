import { useEffect, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { TimelineItem as TimelineItemType } from '../types';
import { TimelineItem } from './TimelineItem';

export const Timeline = ({ items }: { items: TimelineItemType[] }) => {
  const timelineKey = useMemo(
    () => items.map((item) => `${item.id}:${item.order_index}`).join('|'),
    [items],
  );

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      document.querySelectorAll('.timeline-reveal').forEach((element) => {
        element.classList.remove('opacity-0');
      });
      return undefined;
    }

    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.timeline-reveal').forEach((element) => {
        gsap.fromTo(
          element,
          { opacity: 0, y: 44, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.72,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 82%',
            },
          },
        );
      });
    });

    return () => context.revert();
  }, [timelineKey]);

  return (
    <section className="relative mx-auto mt-12 w-full max-w-6xl px-3 pb-16 sm:mt-16 sm:px-6 sm:pb-20 lg:px-8">
      <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-amber-100/70 sm:text-xs sm:tracking-[0.3em]">
          Con đường kỷ niệm
        </p>
        <h2 className="mt-3 font-display text-3xl text-white sm:text-5xl">Timeline của đôi ta</h2>
        <p className="mt-4 text-sm leading-7 text-rose-50/70">
          Mỗi mốc là một đoạn rất nhỏ, nhưng khi ghép lại thì thành lý do Heli muốn ở cạnh bé lâu
          hơn.
        </p>
      </div>
      {items.length === 0 ? (
        <div className="rounded-[24px] border border-white/18 bg-white/[0.1] p-6 text-center text-sm leading-7 text-rose-50/72 backdrop-blur-xl">
          Chưa có mốc timeline nào được publish. Vào admin để thêm timeline hoặc bật published cho các
          mốc hiện có.
        </div>
      ) : (
        <div className="relative space-y-5 md:space-y-10">
          <span className="absolute left-4 top-0 block h-full w-px bg-gradient-to-b from-transparent via-amber-100/40 to-transparent md:left-1/2" />
          {items.map((item, index) => (
            <TimelineItem key={item.id} item={item} index={index} />
          ))}
        </div>
      )}
    </section>
  );
};
