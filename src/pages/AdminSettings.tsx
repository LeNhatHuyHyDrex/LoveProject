import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { Music2, Save, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { useSettings } from '../hooks/useSettings';
import { isCloudinaryConfigured, uploadToCloudinary } from '../lib/cloudinary';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import type { AppSettings } from '../types';

export const AdminSettings = () => {
  const { settings: loadedSettings, loading } = useSettings();
  const [settings, setSettings] = useState<AppSettings>(loadedSettings);
  const [saving, setSaving] = useState(false);
  const [uploadingMusic, setUploadingMusic] = useState(false);

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

  const uploadMusic = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setUploadingMusic(true);

    try {
      const result = await uploadToCloudinary(file);
      setSettings((current) => ({
        ...current,
        background_music_url: result.secure_url,
        enable_music: true,
      }));
      toast.success('Upload nhạc thành công. Bấm Lưu settings để áp dụng.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Upload nhạc thất bại.');
    } finally {
      setUploadingMusic(false);
      event.target.value = '';
    }
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

        <div className="rounded-3xl border border-white/10 bg-black/15 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="mb-1 block text-sm text-white/70">Upload nhạc nền</span>
              <p className="text-xs leading-5 text-white/42">
                Chọn file mp3/m4a/wav. Upload xong URL sẽ tự điền vào ô bên dưới.
              </p>
            </div>
            <label
              aria-disabled={!isCloudinaryConfigured || uploadingMusic}
              className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-2xl bg-rose-200 px-4 text-sm font-bold text-[#351225] transition hover:scale-[1.01] aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
            >
              <Upload className="h-4 w-4" />
              {uploadingMusic ? 'Đang upload...' : 'Upload nhạc'}
              <input
                type="file"
                accept="audio/*,.mp3,.m4a,.wav,.ogg"
                className="sr-only"
                disabled={!isCloudinaryConfigured || uploadingMusic}
                onChange={uploadMusic}
              />
            </label>
          </div>
          {!isCloudinaryConfigured ? (
            <p className="mt-3 rounded-2xl border border-amber-100/20 bg-amber-100/10 px-3 py-2 text-xs leading-5 text-amber-100">
              Cần cấu hình Cloudinary trong `.env` trước khi upload nhạc.
            </p>
          ) : null}
          {settings.background_music_url ? (
            <a
              href={settings.background_music_url}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex min-h-10 items-center justify-center gap-2 rounded-2xl border border-white/10 px-4 text-sm text-white/75 transition hover:bg-white/10"
            >
              <Music2 className="h-4 w-4" />
              Nghe thử nhạc hiện tại
            </a>
          ) : null}
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
