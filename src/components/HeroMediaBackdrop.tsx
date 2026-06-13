import type { MediaFile } from '../types';

export const HeroMediaBackdrop = ({ media }: { media: MediaFile | null }) => {
  if (!media?.url) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden" aria-hidden="true">
      <img
        src={media.url}
        alt=""
        className="h-full w-full object-cover opacity-22 blur-[1px] saturate-125 sm:opacity-28"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,rgba(255,255,255,0.12),transparent_24%),linear-gradient(90deg,rgba(42,16,45,0.72),rgba(101,34,73,0.42),rgba(42,16,45,0.72)),linear-gradient(180deg,rgba(18,7,22,0.72),rgba(18,7,22,0.2)_42%,rgba(18,7,22,0.78))]" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#120716] to-transparent" />
    </div>
  );
};
