import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { getYouTubeEmbedUrl } from '../lib/youtube';
import type { MediaFile } from '../types';

export const VideoModal = ({
  media,
  onClose,
}: {
  media: MediaFile | null;
  onClose: () => void;
}) => (
  <AnimatePresence>
    {media ? (
      <motion.div
        className="fixed inset-0 z-[70] grid place-items-center bg-black/72 px-4 py-8 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-white/20 bg-[#09070f] shadow-2xl"
          initial={{ opacity: 0, scale: 0.94, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 18 }}
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-black/60 text-white backdrop-blur transition hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Đóng video"
            title="Đóng video"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="aspect-video w-full bg-black">
            {media.type === 'youtube' ? (
              <iframe
                className="h-full w-full"
                src={getYouTubeEmbedUrl(media.url)}
                title={media.caption ?? 'Video kỷ niệm'}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <video className="h-full w-full" src={media.url} controls preload="metadata" autoPlay />
            )}
          </div>
          {media.caption ? (
            <p className="border-t border-white/10 px-5 py-4 text-sm text-white/78">{media.caption}</p>
          ) : null}
        </motion.div>
      </motion.div>
    ) : null}
  </AnimatePresence>
);
