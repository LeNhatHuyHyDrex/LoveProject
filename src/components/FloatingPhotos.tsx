import type { MediaFile } from '../types';

const positions = [
  { top: '9%', left: '3%', rotate: '-8deg' },
  { top: '18%', right: '4%', rotate: '7deg' },
  { bottom: '17%', left: '5%', rotate: '6deg' },
  { bottom: '9%', right: '7%', rotate: '-5deg' },
  { top: '46%', left: '-1%', rotate: '8deg' },
  { top: '56%', right: '-2%', rotate: '-7deg' },
  { top: '4%', left: '42%', rotate: '4deg' },
  { bottom: '4%', left: '44%', rotate: '-3deg' },
];

export const FloatingPhotos = ({
  enabled,
  media,
}: {
  enabled: boolean;
  media: MediaFile[];
}) => {
  const photos = media.filter((item) => item.type === 'image').slice(0, positions.length);

  if (!enabled || photos.length === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-10 hidden overflow-hidden lg:block" aria-hidden="true">
      {photos.map((photo, index) => {
        const position = positions[index];

        return (
          <img
            key={photo.id}
            src={photo.thumbnail_url || photo.url}
            alt=""
            loading="lazy"
            className="absolute h-36 w-28 rounded-[10px] border border-white/20 object-cover opacity-35 blur-[0.4px] shadow-2xl animate-floatSlow"
            style={{
              ...position,
              transform: `rotate(${position.rotate})`,
              animationDelay: `${index * 0.65}s`,
            }}
          />
        );
      })}
    </div>
  );
};
