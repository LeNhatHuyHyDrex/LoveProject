import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { ArrowLeft, Heart, HeartHandshake, ShieldCheck } from 'lucide-react';
import { useFloatingMedia } from '../hooks/useFloatingMedia';
import { useHeroMedia } from '../hooks/useHeroMedia';
import { useLetter } from '../hooks/useLetters';
import { useSettings } from '../hooks/useSettings';
import { useTimeline } from '../hooks/useTimeline';
import { FloatingPhotos } from '../components/FloatingPhotos';
import { HeroMediaBackdrop } from '../components/HeroMediaBackdrop';
import { LoveLetter } from '../components/LoveLetter';
import { MusicToggle } from '../components/MusicToggle';
import { ParticleBackground } from '../components/ParticleBackground';
import { Timeline } from '../components/Timeline';

export const AcceptPage = () => {
  const { letter, error: letterError } = useLetter('accept');
  const { items, error: timelineError } = useTimeline();
  const { settings } = useSettings();
  const { media: floatingMedia } = useFloatingMedia();
  const { media: heroMedia } = useHeroMedia();

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
      <ParticleBackground variant={settings.theme} />
      <HeroMediaBackdrop media={heroMedia} />
      <FloatingPhotos
        enabled={settings.enable_floating_photos}
        media={floatingMedia}
      />
      <MusicToggle settings={settings} />
      <section className="relative z-20 mx-auto flex min-h-[92svh] max-w-6xl flex-col items-center justify-center px-3 pb-10 pt-20 sm:min-h-[88vh] sm:px-6 sm:pb-12 sm:pt-24 lg:px-8">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-100/25 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-100 backdrop-blur-xl sm:mb-8 sm:text-xs sm:tracking-[0.25em]">
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
        <section className="mx-auto max-w-4xl px-3 pb-20 sm:px-6 sm:pb-24 lg:px-8">
          <div className="rounded-[22px] border border-white/20 bg-white/[0.13] p-4 text-white shadow-glow backdrop-blur-2xl sm:rounded-[28px] sm:p-8">
            <div className="mb-5 flex items-center gap-3 text-amber-100">
              <ShieldCheck className="h-6 w-6" />
              <span className="text-xs font-semibold uppercase tracking-[0.24em]">
                Lời hứa nhỏ của Heli
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl">Heli sẽ học cách thương bé tốt hơn.</h2>
            <p className="mt-4 text-sm leading-7 text-rose-50/75 sm:text-base">
              Không phải bằng những lời nói, mà bằng những hành động thiết thực, sự lắng nghe, sự thấu hiểu,
              và bé luôn có một vị trí rất quan trọng trong lòng Heli không thay thế được.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-100/15 px-4 py-2 text-sm text-amber-100">
              <HeartHandshake className="h-4 w-4" />
              Heli sẽ cố gắn luôn ghi nhớ những gì mình đã nói.
              </div>
              <Link
                to="/"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/12 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-amber-100"
              >
                <ArrowLeft className="h-4 w-4" />
                Đọc lại từ đầu
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};
