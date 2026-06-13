import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircleHeart } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useFloatingMedia } from '../hooks/useFloatingMedia';
import { useSettings } from '../hooks/useSettings';
import { FloatingPhotos } from '../components/FloatingPhotos';
import { IntroModal } from '../components/IntroModal';
import { ParticleBackground } from '../components/ParticleBackground';
import type { LoveChoice } from '../types';

export const Home = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const { media: floatingMedia } = useFloatingMedia();
  const [busyChoice, setBusyChoice] = useState<LoveChoice | null>(null);

  const handleChoose = async (choice: LoveChoice) => {
    setBusyChoice(choice);

    try {
      if (supabase) {
        await supabase.from('love_responses').insert({
          choice,
          user_agent: navigator.userAgent,
        });
      }
    } finally {
      navigate(choice === 'accept' ? '/accept' : '/gentle');
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      <ParticleBackground />
      <FloatingPhotos enabled={settings.enable_floating_photos} media={floatingMedia} />
      <section className="relative z-20 flex min-h-screen items-end justify-center px-5 pb-10 pt-28">
        <div className="max-w-xl text-center">
          <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-amber-100 backdrop-blur-xl">
            <MessageCircleHeart className="h-4 w-4" />
            Một câu hỏi nhỏ của Heli
          </div>
          <p className="text-sm leading-7 text-rose-50/75">
            Trang này được chuẩn bị để lưu lại một khoảnh khắc thật mềm. Bé chỉ cần chọn điều đúng
            với trái tim mình.
          </p>
        </div>
      </section>
      <IntroModal settings={settings} busyChoice={busyChoice} onChoose={handleChoose} />
    </main>
  );
};
