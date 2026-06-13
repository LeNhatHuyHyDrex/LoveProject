import { Link } from 'react-router-dom';
import { ArrowLeft, Moon, Stars } from 'lucide-react';
import { useLetter } from '../hooks/useLetters';
import { useSettings } from '../hooks/useSettings';
import { LoveLetter } from '../components/LoveLetter';
import { MusicToggle } from '../components/MusicToggle';
import { ParticleBackground } from '../components/ParticleBackground';

export const GentlePage = () => {
  const { letter } = useLetter('gentle');
  const { settings } = useSettings();

  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      <ParticleBackground variant="night" />
      <MusicToggle settings={settings} />
      <section className="relative z-20 mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-sky-100/25 bg-white/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-sky-100 backdrop-blur-xl">
          <Moon className="h-4 w-4" />
          Không áp lực, chỉ dịu dàng
        </div>
        <LoveLetter letter={letter} variant="gentle" />
        <div className="mt-8 grid w-full max-w-3xl gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
          <div className="rounded-3xl border border-white/15 bg-white/[0.09] p-5 text-sm leading-7 text-sky-50/76 backdrop-blur-xl">
            <div className="mb-3 flex items-center gap-2 text-sky-100">
              <Stars className="h-5 w-5" />
              <span className="font-semibold">Một điều Heli muốn bé nhớ</span>
            </div>
            Bé không cần phải vội. Bé cứ thở, cứ là bé, cứ để mọi thứ đi theo nhịp mà bé thấy bình
            yên nhất.
          </div>
          <Link
            to="/"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/12 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-sky-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại đọc lại từ đầu
          </Link>
        </div>
      </section>
    </main>
  );
};
