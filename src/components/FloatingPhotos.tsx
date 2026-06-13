import type { MediaFile } from '../types';

const desktopPositions = [
  { top: '9%', left: '3%', rotate: '-8deg' },
  { top: '18%', right: '4%', rotate: '7deg' },
  { bottom: '17%', left: '5%', rotate: '6deg' },
  { bottom: '9%', right: '7%', rotate: '-5deg' },
  { top: '46%', left: '-1%', rotate: '8deg' },
  { top: '56%', right: '-2%', rotate: '-7deg' },
  { top: '4%', left: '42%', rotate: '4deg' },
  { bottom: '4%', left: '44%', rotate: '-3deg' },
];

const mobilePositions = [
  { top: '7%', left: '-18px', rotate: '-8deg' },
  { top: '18%', right: '-18px', rotate: '7deg' },
  { top: '56%', left: '-22px', rotate: '6deg' },
  { bottom: '8%', right: '-20px', rotate: '-6deg' },
  { bottom: '22%', left: '-24px', rotate: '-4deg' },
  { top: '42%', right: '-24px', rotate: '5deg' },
];

export const FloatingPhotos = ({
  enabled,
  media,
}: {
  enabled: boolean;
  media: MediaFile[];
}) => {
  const photos = media.filter((item) => item.type === 'image').slice(0, desktopPositions.length);

  if (!enabled || photos.length === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden" aria-hidden="true">
      <div className="block lg:hidden">
        {photos.slice(0, mobilePositions.length).map((photo, index) => {
          const position = mobilePositions[index];

          return (
            <img
              key={`mobile-${photo.id}`}
              src={photo.thumbnail_url || photo.url}
              alt=""
              loading="lazy"
              className="absolute h-[104px] w-[78px] rounded-[12px] border border-white/18 object-cover opacity-28 blur-[0.2px] shadow-2xl animate-floatSlow sm:h-32 sm:w-24"
              style={{
                ...position,
                transform: `rotate(${position.rotate})`,
                animationDelay: `${index * 0.7}s`,
              }}
            />
          );
        })}
      </div>
      <div className="hidden lg:block">
      {photos.map((photo, index) => {
        const position = desktopPositions[index];

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
    </div>
  );
};
