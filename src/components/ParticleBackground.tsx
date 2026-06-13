import { useMemo } from 'react';

type BackgroundVariant = 'luxury-romantic' | 'night-healing' | 'soft-pearl' | 'rose' | 'night' | string;

const themeClasses: Record<string, { base: string; glow: string; grid: string; particle: string }> = {
  'luxury-romantic': {
    base: 'absolute inset-0 bg-[linear-gradient(145deg,#2a102d_0%,#652249_45%,#f6b6b8_100%)]',
    glow:
      'absolute inset-0 bg-[radial-gradient(circle_at_50%_8%,rgba(255,246,210,0.22),transparent_26%),radial-gradient(circle_at_12%_82%,rgba(251,207,232,0.18),transparent_30%),radial-gradient(circle_at_88%_72%,rgba(124,58,237,0.14),transparent_28%)]',
    grid:
      'absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:48px_48px] opacity-30',
    particle:
      'absolute rounded-full bg-amber-100/70 shadow-[0_0_18px_rgba(254,243,199,0.65)] animate-twinkle',
  },
  'night-healing': {
    base: 'absolute inset-0 bg-[linear-gradient(145deg,#07111f_0%,#17264a_45%,#3b1642_100%)]',
    glow:
      'absolute inset-0 bg-[radial-gradient(circle_at_62%_12%,rgba(186,230,253,0.24),transparent_25%),radial-gradient(circle_at_20%_78%,rgba(165,180,252,0.16),transparent_30%),radial-gradient(circle_at_90%_70%,rgba(244,114,182,0.12),transparent_30%)]',
    grid:
      'absolute inset-0 bg-[linear-gradient(rgba(224,242,254,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(224,242,254,0.035)_1px,transparent_1px)] bg-[size:52px_52px] opacity-25',
    particle:
      'absolute rounded-full bg-sky-100/75 shadow-[0_0_18px_rgba(224,242,254,0.75)] animate-twinkle',
  },
  'soft-pearl': {
    base: 'absolute inset-0 bg-[linear-gradient(145deg,#3b162f_0%,#9b4766_45%,#f5d0d6_100%)]',
    glow:
      'absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(255,255,255,0.24),transparent_24%),radial-gradient(circle_at_14%_76%,rgba(253,230,138,0.15),transparent_30%),radial-gradient(circle_at_88%_70%,rgba(251,207,232,0.2),transparent_28%)]',
    grid:
      'absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:44px_44px] opacity-25',
    particle:
      'absolute rounded-full bg-white/75 shadow-[0_0_18px_rgba(255,255,255,0.72)] animate-twinkle',
  },
};

const normalizeVariant = (variant: BackgroundVariant) => {
  if (variant === 'night') {
    return 'night-healing';
  }

  if (variant === 'rose') {
    return 'luxury-romantic';
  }

  return themeClasses[variant] ? variant : 'luxury-romantic';
};

export const ParticleBackground = ({ variant = 'luxury-romantic' }: { variant?: BackgroundVariant }) => {
  const theme = themeClasses[normalizeVariant(variant)];
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
      <div className={theme.base} />
      <div className={theme.glow} />
      <div className={theme.grid} />
      {particles.map((particle) => (
        <span
          key={particle.id}
          className={theme.particle}
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
