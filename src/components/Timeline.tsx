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
    <section className="relative mx-auto mt-16 w-full max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-100/70">
          Con đường kỷ niệm
        </p>
        <h2 className="mt-3 font-display text-4xl text-white sm:text-5xl">Timeline của đôi ta</h2>
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
        <div className="relative space-y-6 md:space-y-10">
          <span className="absolute left-4 top-0 hidden h-full w-px bg-gradient-to-b from-transparent via-amber-100/40 to-transparent md:left-1/2 md:block" />
          {items.map((item, index) => (
            <TimelineItem key={item.id} item={item} index={index} />
          ))}
        </div>
      )}
    </section>
  );
};
