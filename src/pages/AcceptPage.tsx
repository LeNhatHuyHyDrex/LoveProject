import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Heart, HeartHandshake, ShieldCheck } from 'lucide-react';
import { useFloatingMedia } from '../hooks/useFloatingMedia';
import { useLetter } from '../hooks/useLetters';
import { useSettings } from '../hooks/useSettings';
import { useTimeline } from '../hooks/useTimeline';
import { FloatingPhotos } from '../components/FloatingPhotos';
import { LoveLetter } from '../components/LoveLetter';
import { MusicToggle } from '../components/MusicToggle';
import { ParticleBackground } from '../components/ParticleBackground';
import { Timeline } from '../components/Timeline';

export const AcceptPage = () => {
  const { letter, error: letterError } = useLetter('accept');
  const { items, error: timelineError } = useTimeline();
  const { settings } = useSettings();
  const { media: floatingMedia } = useFloatingMedia();

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      return;
    }

    const end = Date.now() + 1200;
    const frame = () => {
      confetti({
        particleCount: 4,
        startVelocity: 24,
        spread: 72,
        origin: { x: Math.random(), y: 0.2 },
        colors: ['#f9a8d4', '#fde68a', '#ffffff', '#f0abfc'],
      });

      if (Date.now() < end) {
        window.requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      <ParticleBackground />
      <FloatingPhotos
        enabled={settings.enable_floating_photos}
        media={floatingMedia}
      />
      <MusicToggle settings={settings} />
      <section className="relative z-20 mx-auto flex min-h-[88vh] max-w-6xl flex-col items-center justify-center px-4 pb-12 pt-24 sm:px-6 lg:px-8">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-amber-100/25 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-amber-100 backdrop-blur-xl">
          <Heart className="h-4 w-4 fill-current" />
          Bé đã chọn Heli
        </div>
        <LoveLetter letter={letter} variant="accept" />
        {letterError || timelineError ? (
          <p className="mt-5 rounded-2xl border border-amber-100/20 bg-black/20 px-4 py-3 text-center text-xs text-amber-100/85 backdrop-blur">
            Đang dùng dữ liệu demo vì Supabase chưa sẵn sàng hoặc chưa có dữ liệu.
          </p>
        ) : null}
      </section>
      <div className="relative z-20">
        <Timeline items={items} />
        <section className="mx-auto max-w-4xl px-4 pb-24 sm:px-6 lg:px-8">
          <div className="rounded-[28px] border border-white/20 bg-white/[0.13] p-6 text-white shadow-glow backdrop-blur-2xl sm:p-8">
            <div className="mb-5 flex items-center gap-3 text-amber-100">
              <ShieldCheck className="h-6 w-6" />
              <span className="text-xs font-semibold uppercase tracking-[0.24em]">
                Lời hứa nhỏ của Heli
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl">Heli sẽ học cách thương bé tốt hơn.</h2>
            <p className="mt-4 text-sm leading-7 text-rose-50/75 sm:text-base">
              Không phải bằng những lời quá lớn, mà bằng sự hiện diện, sự lắng nghe, những lần dịu
              lại đúng lúc, và cách Heli luôn đặt bé ở một vị trí rất được trân trọng.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-amber-100/15 px-4 py-2 text-sm text-amber-100">
              <HeartHandshake className="h-4 w-4" />
              Từ hôm nay, Heli nghiêm túc với điều quý giá này.
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};
