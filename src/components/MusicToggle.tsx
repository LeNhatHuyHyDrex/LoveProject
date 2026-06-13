import { useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import type { AppSettings } from '../types';

export const MusicToggle = ({ settings }: { settings: AppSettings }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  if (!settings.enable_music || !settings.background_music_url) {
    return null;
  }

  const toggle = async () => {
    if (!audioRef.current) {
      return;
    }

    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
      return;
    }

    try {
      await audioRef.current.play();
      setPlaying(true);
    } catch {
      setPlaying(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <audio ref={audioRef} src={settings.background_music_url} loop preload="none" />
      <button
        type="button"
        onClick={toggle}
        className="grid h-12 w-12 place-items-center rounded-full border border-white/25 bg-white/15 text-white shadow-glow backdrop-blur-xl transition hover:bg-white/25 focus:outline-none focus:ring-2 focus:ring-amber-200"
        aria-label={playing ? 'Tắt nhạc nền' : 'Bật nhạc nền'}
        title={playing ? 'Tắt nhạc nền' : 'Bật nhạc nền'}
      >
        {playing ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
      </button>
    </div>
  );
};
