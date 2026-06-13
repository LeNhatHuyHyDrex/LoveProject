import { useEffect, useState, type FormEvent } from 'react';
import { Save } from 'lucide-react';
import { toast } from 'sonner';
import { useSettings } from '../hooks/useSettings';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import type { AppSettings } from '../types';

export const AdminSettings = () => {
  const { settings: loadedSettings, loading } = useSettings();
  const [settings, setSettings] = useState<AppSettings>(loadedSettings);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setSettings(loadedSettings);
  }, [loadedSettings]);

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!supabase) {
      toast.error('Supabase chưa cấu hình, không thể lưu settings.');
      return;
    }

    setSaving(true);
    const rows = Object.entries(settings).map(([key, value]) => ({
      key,
      value,
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase.from('app_settings').upsert(rows, { onConflict: 'key' });
    setSaving(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Đã lưu settings.');
    }
  };

  const update = <Key extends keyof AppSettings>(key: Key, value: AppSettings[Key]) => {
    setSettings((current) => ({ ...current, [key]: value }));
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-amber-100/70">
          Cấu hình
        </p>
        <h1 className="mt-2 font-display text-4xl">Admin Settings</h1>
      </div>

      {!isSupabaseConfigured ? (
        <div className="mb-5 rounded-3xl border border-amber-100/25 bg-amber-100/10 p-4 text-sm text-amber-50">
          Supabase chưa cấu hình. Trang public đang dùng settings demo.
        </div>
      ) : null}

      <form className="space-y-5 rounded-3xl border border-white/10 bg-white/[0.08] p-5" onSubmit={save}>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm text-white/70">Site title</span>
            <input
              value={settings.site_title}
              onChange={(event) => update('site_title', event.target.value)}
              className="min-h-11 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-white outline-none focus:border-amber-100/60"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-white/70">Theme</span>
            <select
              value={settings.theme}
              onChange={(event) => update('theme', event.target.value)}
              className="min-h-11 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-white outline-none focus:border-amber-100/60"
            >
              <option value="luxury-romantic">Luxury romantic</option>
              <option value="night-healing">Night healing</option>
              <option value="soft-pearl">Soft pearl</option>
            </select>
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm text-white/70">Tên Heli</span>
            <input
              value={settings.heli_name}
              onChange={(event) => update('heli_name', event.target.value)}
              className="min-h-11 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-white outline-none focus:border-amber-100/60"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-white/70">Tên bé Quắn</span>
            <input
              value={settings.lover_name}
              onChange={(event) => update('lover_name', event.target.value)}
              className="min-h-11 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-white outline-none focus:border-amber-100/60"
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-2 block text-sm text-white/70">Intro question</span>
          <textarea
            value={settings.intro_question}
            onChange={(event) => update('intro_question', event.target.value)}
            rows={3}
            className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-7 text-white outline-none focus:border-amber-100/60"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm text-white/70">Background music URL</span>
          <input
            value={settings.background_music_url}
            onChange={(event) => update('background_music_url', event.target.value)}
            placeholder="Cloudinary audio URL hoặc link mp3"
            className="min-h-11 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-white outline-none placeholder:text-white/30 focus:border-amber-100/60"
          />
        </label>

        <div className="grid gap-3 md:grid-cols-2">
          <label className="flex min-h-12 items-center gap-3 rounded-2xl border border-white/10 bg-black/15 px-4 text-sm text-white/75">
            <input
              type="checkbox"
              checked={settings.enable_music}
              onChange={(event) => update('enable_music', event.target.checked)}
            />
            Bật nhạc nền
          </label>
          <label className="flex min-h-12 items-center gap-3 rounded-2xl border border-white/10 bg-black/15 px-4 text-sm text-white/75">
            <input
              type="checkbox"
              checked={settings.enable_floating_photos}
              onChange={(event) => update('enable_floating_photos', event.target.checked)}
            />
            Bật floating photos
          </label>
        </div>

        <button
          type="submit"
          disabled={saving || loading || !isSupabaseConfigured}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-amber-100 px-5 text-sm font-bold text-[#351225] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-55"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Đang lưu...' : 'Lưu settings'}
        </button>
      </form>
    </div>
  );
};
