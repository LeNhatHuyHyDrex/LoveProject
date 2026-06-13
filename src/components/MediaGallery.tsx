import { useState } from 'react';
import { motion } from 'framer-motion';
import { ImageOff, Play } from 'lucide-react';
import { getYouTubeThumbnail } from '../lib/youtube';
import type { MediaFile } from '../types';
import { VideoModal } from './VideoModal';

const getPreview = (media: MediaFile) => {
  if (media.thumbnail_url) {
    return media.thumbnail_url;
  }

  if (media.type === 'youtube') {
    return getYouTubeThumbnail(media.url);
  }

  return media.type === 'image' ? media.url : '';
};

export const MediaGallery = ({ media }: { media: MediaFile[] }) => {
  const [activeVideo, setActiveVideo] = useState<MediaFile | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  if (media.length === 0) {
    return null;
  }

  return (
    <>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {media.map((item) => {
          const preview = getPreview(item);
          const failed = failedImages[item.id];

          if (item.type === 'image') {
            return (
              <motion.figure
                key={item.id}
                whileHover={{ y: -4, rotateX: 2, rotateY: -2 }}
                className="overflow-hidden rounded-2xl border border-white/14 bg-white/8"
              >
                {failed ? (
                  <div className="grid aspect-[4/3] place-items-center text-rose-100/60">
                    <ImageOff className="h-8 w-8" />
                  </div>
                ) : (
                  <img
                    src={item.url}
                    alt={item.alt ?? item.caption ?? 'Ảnh kỷ niệm'}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover"
                    onError={() =>
                      setFailedImages((current) => ({
                        ...current,
                        [item.id]: true,
                      }))
                    }
                  />
                )}
                {item.caption ? (
                  <figcaption className="px-4 py-3 text-xs leading-5 text-rose-50/72">
                    {item.caption}
                  </figcaption>
                ) : null}
              </motion.figure>
            );
          }

          return (
            <motion.button
              type="button"
              key={item.id}
              whileHover={{ y: -4, rotateX: 2, rotateY: -2 }}
              onClick={() => setActiveVideo(item)}
              className="group relative overflow-hidden rounded-2xl border border-white/14 bg-[#1a0d1d] text-left"
            >
              <div className="aspect-video w-full">
                {preview ? (
                  <img
                    src={preview}
                    alt={item.alt ?? item.caption ?? 'Video kỷ niệm'}
                    loading="lazy"
                    className="h-full w-full object-cover opacity-85 transition group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full animate-shimmer bg-[linear-gradient(90deg,rgba(255,255,255,0.06),rgba(255,255,255,0.16),rgba(255,255,255,0.06))] bg-[length:420px_100%]" />
                )}
              </div>
              <span className="absolute inset-0 grid place-items-center bg-black/20">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-white/90 text-[#3b1029] shadow-gold transition group-hover:scale-105">
                  <Play className="ml-1 h-6 w-6 fill-current" />
                </span>
              </span>
              {item.caption ? (
                <span className="absolute bottom-0 left-0 right-0 bg-black/45 px-4 py-3 text-xs text-white backdrop-blur">
                  {item.caption}
                </span>
              ) : null}
            </motion.button>
          );
        })}
      </div>
      <VideoModal media={activeVideo} onClose={() => setActiveVideo(null)} />
    </>
  );
};
