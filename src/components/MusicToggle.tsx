import { useEffect, useRef, useState } from 'react';
import { Disc3, Pause, Play } from 'lucide-react';
import type { AppSettings } from '../types';

const formatTime = (value: number) => {
  if (!Number.isFinite(value) || value <= 0) {
    return '0:00';
  }

  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60)
    .toString()
    .padStart(2, '0');

  return `${minutes}:${seconds}`;
};

export const MusicToggle = ({ settings }: { settings: AppSettings }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    setPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, [settings.background_music_url]);

  if (!settings.enable_music || !settings.background_music_url) {
    return null;
  }

  const play = async () => {
    if (!audioRef.current) {
      return;
    }

    try {
      await audioRef.current.play();
      setPlaying(true);
    } catch {
      setPlaying(false);
    }
  };

  const pause = () => {
    audioRef.current?.pause();
    setPlaying(false);
  };

  const toggleExpanded = async () => {
    setExpanded((value) => !value);

    if (!playing) {
      await play();
    }
  };

  const togglePlay = async () => {
    if (playing) {
      pause();
      return;
    }

    await play();
  };

  const seek = (value: string) => {
    const nextTime = Number(value);

    if (!audioRef.current || !Number.isFinite(nextTime)) {
      return;
    }

    audioRef.current.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-5 sm:right-5">
      <audio
        ref={audioRef}
        src={settings.background_music_url}
        loop
        preload="metadata"
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || 0)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <div className="flex max-w-[calc(100vw-2rem)] items-center justify-end gap-2">
        {expanded ? (
          <div className="flex h-14 w-[min(280px,calc(100vw-5.5rem))] items-center gap-3 rounded-full border border-white/18 bg-[#180d1f]/80 px-3 text-white shadow-glow backdrop-blur-2xl sm:w-80">
            <button
              type="button"
              onClick={togglePlay}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-amber-100 text-[#351225] transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-100"
              aria-label={playing ? 'Dừng nhạc' : 'Phát nhạc'}
              title={playing ? 'Dừng nhạc' : 'Phát nhạc'}
            >
              {playing ? <Pause className="h-4 w-4 fill-current" /> : <Play className="ml-0.5 h-4 w-4 fill-current" />}
            </button>
            <div className="min-w-0 flex-1">
              <input
                type="range"
                min={0}
                max={duration || 0}
                step={1}
                value={Math.min(currentTime, duration || currentTime)}
                onChange={(event) => seek(event.target.value)}
                className="h-1.5 w-full cursor-pointer accent-amber-100"
                aria-label="Tua nhạc nền"
              />
              <div className="mt-1 flex justify-between text-[10px] font-medium text-white/55">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          </div>
        ) : null}
        <button
          type="button"
          onClick={toggleExpanded}
          className="relative grid h-14 w-14 shrink-0 place-items-center rounded-full border border-white/25 bg-[radial-gradient(circle,#f8fafc_0_14%,#17111d_15%_38%,#030208_39%_100%)] text-amber-100 shadow-glow transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-100"
          aria-label={expanded ? 'Thu gọn trình phát nhạc' : 'Mở trình phát nhạc'}
          title={expanded ? 'Thu gọn trình phát nhạc' : 'Mở trình phát nhạc'}
        >
          <span
            className={playing ? 'animate-spin' : ''}
            style={playing ? { animationDuration: '3.5s' } : undefined}
          >
            <Disc3 className="h-8 w-8" />
          </span>
          <span className="absolute h-3 w-3 rounded-full bg-amber-100/90 shadow-[0_0_14px_rgba(254,243,199,0.8)]" />
        </button>
      </div>
    </div>
  );
};
