import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { Save } from 'lucide-react';
import { toast } from 'sonner';
import { defaultLetters, getDefaultLetter } from '../data/fallbackData';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import type { Letter, LetterType } from '../types';
import { LoveLetter } from '../components/LoveLetter';

export const AdminLetters = () => {
  const [active, setActive] = useState<LetterType>('accept');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const fallback = getDefaultLetter(active);
      setTitle(fallback.title);
      setContent(fallback.content);

      if (!supabase) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const { data, error } = await supabase
        .from('letters')
        .select('*')
        .eq('type', active)
        .maybeSingle();

      if (error || !data) {
        setTitle(fallback.title);
        setContent(fallback.content);
      } else {
        const letter = data as Letter;
        setTitle(letter.title);
        setContent(letter.content);
      }

      setLoading(false);
    };

    void load();
  }, [active]);

  const save = async () => {
    if (!supabase) {
      toast.error('Supabase chưa cấu hình, không thể lưu.');
      return;
    }

    setSaving(true);
    const { error } = await supabase.from('letters').upsert(
      {
        type: active,
        title,
        content,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'type' },
    );
    setSaving(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Đã lưu thư.');
    }
  };

  const preview: Letter = { type: active, title, content };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-amber-100/70">
            Nội dung thư
          </p>
          <h1 className="mt-2 font-display text-4xl">Admin Letters</h1>
        </div>
        <button
          type="button"
          onClick={save}
          disabled={saving || loading || !isSupabaseConfigured}
          className="inline-flex min-h-11 items-center gap-2 rounded-2xl bg-amber-100 px-5 text-sm font-bold text-[#351225] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-55"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Đang lưu...' : 'Save'}
        </button>
      </div>

      <div className="mb-5 inline-flex rounded-2xl border border-white/10 bg-white/[0.07] p-1">
        {defaultLetters.map((letter) => (
          <button
            type="button"
            key={letter.type}
            onClick={() => setActive(letter.type)}
            className={clsx(
              'rounded-xl px-4 py-2 text-sm font-semibold transition',
              active === letter.type ? 'bg-white/16 text-amber-100' : 'text-white/60 hover:text-white',
            )}
          >
            {letter.type === 'accept' ? 'Accept' : 'Gentle'}
          </button>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(420px,0.9fr)]">
        <section className="rounded-3xl border border-white/10 bg-white/[0.08] p-5">
          <label className="block">
            <span className="mb-2 block text-sm text-white/70">Tiêu đề</span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="min-h-12 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-white outline-none focus:border-amber-100/60"
            />
          </label>
          <label className="mt-4 block">
            <span className="mb-2 block text-sm text-white/70">Nội dung</span>
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              rows={18}
              className="w-full resize-y rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-7 text-white outline-none focus:border-amber-100/60"
            />
          </label>
        </section>

        <section className="rounded-3xl border border-white/10 bg-[linear-gradient(145deg,#2a102d,#612346_55%,#b86d78)] p-4">
          <p className="mb-4 text-sm font-semibold text-amber-100">Preview</p>
          <LoveLetter letter={preview} variant={active} />
        </section>
      </div>
    </div>
  );
};
