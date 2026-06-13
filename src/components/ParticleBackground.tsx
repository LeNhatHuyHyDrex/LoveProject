import { useMemo } from 'react';

export const ParticleBackground = ({ variant = 'rose' }: { variant?: 'rose' | 'night' }) => {
  const particles = useMemo(
    () =>
      Array.from({ length: 28 }, (_, index) => ({
        id: index,
        left: `${(index * 37) % 100}%`,
        top: `${(index * 53) % 100}%`,
        delay: `${(index % 9) * 0.45}s`,
        size: `${4 + (index % 4)}px`,
      })),
    [],
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div
        className={
          variant === 'night'
            ? 'absolute inset-0 bg-[linear-gradient(145deg,#0b1028_0%,#25143f_48%,#3b1637_100%)]'
            : 'absolute inset-0 bg-[linear-gradient(145deg,#2a102d_0%,#652249_45%,#f6b6b8_100%)]'
        }
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_8%,rgba(255,246,210,0.22),transparent_26%),radial-gradient(circle_at_12%_82%,rgba(251,207,232,0.18),transparent_30%),radial-gradient(circle_at_88%_72%,rgba(124,58,237,0.14),transparent_28%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:48px_48px] opacity-30" />
      {particles.map((particle) => (
        <span
          key={particle.id}
          className={
            variant === 'night'
              ? 'absolute rounded-full bg-sky-100/70 shadow-[0_0_18px_rgba(224,242,254,0.7)] animate-twinkle'
              : 'absolute rounded-full bg-amber-100/70 shadow-[0_0_18px_rgba(254,243,199,0.65)] animate-twinkle'
          }
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
            animationDelay: particle.delay,
          }}
        />
      ))}
    </div>
  );
};
