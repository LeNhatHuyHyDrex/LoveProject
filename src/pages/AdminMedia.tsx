import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { ImageOff, Pencil, Save, Trash2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { getYouTubeThumbnail } from '../lib/youtube';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { isCloudinaryConfigured, uploadToCloudinary } from '../lib/cloudinary';
import type { MediaFile, MediaType, TimelineItem } from '../types';

type MediaForm = {
  type: MediaType;
  url: string;
  thumbnail_url: string;
  public_id: string;
  caption: string;
  alt: string;
  timeline_item_id: string;
  is_floating: boolean;
  is_hero: boolean;
  order_index: number;
};

const emptyForm: MediaForm = {
  type: 'image',
  url: '',
  thumbnail_url: '',
  public_id: '',
  caption: '',
  alt: '',
  timeline_item_id: '',
  is_floating: false,
  is_hero: false,
  order_index: 0,
};

export const AdminMedia = () => {
  const [form, setForm] = useState<MediaForm>(emptyForm);
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const [{ data: mediaData, error: mediaError }, { data: timelineData, error: timelineError }] =
      await Promise.all([
        supabase.from('media_files').select('*').order('order_index', { ascending: true }),
        supabase.from('timeline_items').select('*').order('order_index', { ascending: true }),
      ]);

    if (mediaError || timelineError) {
      toast.error(mediaError?.message ?? timelineError?.message ?? 'Không tải được media.');
    } else {
      setMedia((mediaData ?? []) as MediaFile[]);
      setTimeline((timelineData ?? []) as TimelineItem[]);
    }

    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const reset = () => {
    setEditingId(null);
    setForm({
      ...emptyForm,
      order_index: media.length + 1,
    });
  };

  useEffect(() => {
    if (!editingId && form.order_index === 0 && media.length > 0) {
      setForm((current) => ({ ...current, order_index: media.length + 1 }));
    }
  }, [editingId, form.order_index, media.length]);

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setUploading(true);

    try {
      const result = await uploadToCloudinary(file);
      setForm((current) => ({
        ...current,
        type: result.resource_type === 'video' ? 'video' : 'image',
        url: result.secure_url,
        thumbnail_url: result.thumbnail_url ?? '',
        public_id: result.public_id,
        caption: current.caption || result.original_filename || '',
      }));
      toast.success('Upload Cloudinary thành công.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Upload thất bại.');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!supabase) {
      toast.error('Supabase chưa cấu hình, không thể lưu media.');
      return;
    }

    setSaving(true);
    const thumbnail =
      form.thumbnail_url || (form.type === 'youtube' ? getYouTubeThumbnail(form.url) : null);
    const payload = {
      type: form.type,
      url: form.url,
      thumbnail_url: thumbnail || null,
      public_id: form.public_id || null,
      caption: form.caption || null,
      alt: form.alt || null,
      timeline_item_id: form.timeline_item_id || null,
      is_floating: form.is_floating,
      is_hero: form.is_hero,
      order_index: Number(form.order_index) || 0,
    };

    const { error } = editingId
      ? await supabase.from('media_files').update(payload).eq('id', editingId)
      : await supabase.from('media_files').insert(payload);

    setSaving(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success(editingId ? 'Đã cập nhật media.' : 'Đã thêm media.');
    reset();
    await load();
  };

  const edit = (file: MediaFile) => {
    setEditingId(file.id);
    setForm({
      type: file.type,
      url: file.url,
      thumbnail_url: file.thumbnail_url ?? '',
      public_id: file.public_id ?? '',
      caption: file.caption ?? '',
      alt: file.alt ?? '',
      timeline_item_id: file.timeline_item_id ?? '',
      is_floating: file.is_floating,
      is_hero: file.is_hero,
      order_index: file.order_index,
    });
  };

  const remove = async (file: MediaFile) => {
    if (!supabase) {
      toast.error('Supabase chưa cấu hình, không thể xóa.');
      return;
    }

    if (!window.confirm('Xóa media record này khỏi Supabase? File trên Cloudinary sẽ không bị xóa.')) {
      return;
    }

    const { error } = await supabase.from('media_files').delete().eq('id', file.id);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Đã xóa media record.');
      await load();
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-amber-100/70">
            Ảnh và video
          </p>
          <h1 className="mt-2 font-display text-4xl">Admin Media</h1>
        </div>
        <button
          type="button"
          onClick={reset}
          className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-white/12 px-4 text-sm text-white/80 transition hover:bg-white/10"
        >
          <X className="h-4 w-4" />
          Clear form
        </button>
      </div>

      {!isSupabaseConfigured ? (
        <div className="mb-5 rounded-3xl border border-amber-100/25 bg-amber-100/10 p-4 text-sm text-amber-50">
          Supabase chưa cấu hình. Không thể lưu media, nhưng public site vẫn chạy bằng fallback data.
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(360px,0.82fr)_minmax(0,1fr)]">
        <section className="rounded-3xl border border-white/10 bg-white/[0.08] p-5">
          <h2 className="mb-5 font-semibold">{editingId ? 'Sửa media' : 'Thêm media'}</h2>
          <div className="mb-5 rounded-2xl border border-white/10 bg-black/18 p-4">
            <p className="mb-3 text-sm text-white/70">Upload Cloudinary</p>
            <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-2xl bg-rose-200 px-4 text-sm font-bold text-[#351225] transition hover:scale-[1.01] aria-disabled:pointer-events-none aria-disabled:opacity-50">
              <Upload className="h-4 w-4" />
              {uploading ? 'Đang upload...' : 'Chọn ảnh/video'}
              <input
                type="file"
                accept="image/*,video/*"
                className="sr-only"
                disabled={!isCloudinaryConfigured || uploading}
                onChange={handleUpload}
              />
            </label>
            {!isCloudinaryConfigured ? (
              <p className="mt-3 text-xs leading-5 text-amber-100/80">
                Chưa có `VITE_CLOUDINARY_CLOUD_NAME` hoặc `VITE_CLOUDINARY_UPLOAD_PRESET`.
              </p>
            ) : null}
          </div>

          <form className="space-y-4" onSubmit={save}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm text-white/70">Type</span>
                <select
                  value={form.type}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, type: event.target.value as MediaType }))
                  }
                  className="min-h-11 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-white outline-none focus:border-amber-100/60"
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                  <option value="youtube">YouTube</option>
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm text-white/70">Order index</span>
                <input
                  type="number"
                  value={form.order_index}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, order_index: Number(event.target.value) }))
                  }
                  className="min-h-11 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-white outline-none focus:border-amber-100/60"
                />
              </label>
            </div>
            <label className="block">
              <span className="mb-2 block text-sm text-white/70">URL</span>
              <input
                value={form.url}
                onChange={(event) => setForm((current) => ({ ...current, url: event.target.value }))}
                required
                placeholder="Cloudinary URL, YouTube URL hoặc ảnh ngoài"
                className="min-h-11 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-white outline-none placeholder:text-white/30 focus:border-amber-100/60"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm text-white/70">Thumbnail URL</span>
              <input
                value={form.thumbnail_url}
                onChange={(event) =>
                  setForm((current) => ({ ...current, thumbnail_url: event.target.value }))
                }
                placeholder="Có thể bỏ trống với YouTube"
                className="min-h-11 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-white outline-none placeholder:text-white/30 focus:border-amber-100/60"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm text-white/70">Timeline item</span>
              <select
                value={form.timeline_item_id}
                onChange={(event) =>
                  setForm((current) => ({ ...current, timeline_item_id: event.target.value }))
                }
                className="min-h-11 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-white outline-none focus:border-amber-100/60"
              >
                <option value="">Không gán timeline</option>
                {timeline.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.order_index}. {item.title}
                  </option>
                ))}
              </select>
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm text-white/70">Caption</span>
                <input
                  value={form.caption}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, caption: event.target.value }))
                  }
                  className="min-h-11 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-white outline-none focus:border-amber-100/60"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm text-white/70">Alt</span>
                <input
                  value={form.alt}
                  onChange={(event) => setForm((current) => ({ ...current, alt: event.target.value }))}
                  className="min-h-11 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-white outline-none focus:border-amber-100/60"
                />
              </label>
            </div>
            <label className="block">
              <span className="mb-2 block text-sm text-white/70">Public ID</span>
              <input
                value={form.public_id}
                onChange={(event) =>
                  setForm((current) => ({ ...current, public_id: event.target.value }))
                }
                className="min-h-11 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-white outline-none focus:border-amber-100/60"
              />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex min-h-11 items-center gap-3 rounded-2xl border border-white/10 bg-black/15 px-4 text-sm text-white/75">
                <input
                  type="checkbox"
                  checked={form.is_floating}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, is_floating: event.target.checked }))
                  }
                />
                Floating photo
              </label>
              <label className="flex min-h-11 items-center gap-3 rounded-2xl border border-white/10 bg-black/15 px-4 text-sm text-white/75">
                <input
                  type="checkbox"
                  checked={form.is_hero}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, is_hero: event.target.checked }))
                  }
                />
                Hero media
              </label>
            </div>
            <button
              type="submit"
              disabled={saving || !isSupabaseConfigured}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-amber-100 px-5 text-sm font-bold text-[#351225] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-55"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Đang lưu...' : 'Lưu media'}
            </button>
          </form>
        </section>

        <section className="space-y-3">
          {loading ? (
            <div className="rounded-3xl border border-white/10 bg-white/[0.08] p-5 text-white/55">
              Đang tải media...
            </div>
          ) : media.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/[0.08] p-5 text-white/55">
              Chưa có media. Upload hoặc paste URL ở form bên trái.
            </div>
          ) : (
            media.map((file) => (
              <article
                key={file.id}
                className="grid gap-4 rounded-3xl border border-white/10 bg-white/[0.08] p-4 md:grid-cols-[160px_1fr_auto]"
              >
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/20">
                  {file.type === 'image' || file.thumbnail_url ? (
                    <img
                      src={file.thumbnail_url || file.url}
                      alt={file.alt ?? file.caption ?? 'Media'}
                      loading="lazy"
                      className="aspect-video w-full object-cover"
                    />
                  ) : (
                    <div className="grid aspect-video place-items-center text-white/35">
                      <ImageOff className="h-7 w-7" />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap gap-2 text-xs text-white/45">
                    <span>{file.type}</span>
                    {file.is_floating ? <span>floating</span> : null}
                    {file.is_hero ? <span>hero</span> : null}
                  </div>
                  <h2 className="mt-1 truncate font-semibold">{file.caption || file.public_id || 'Media file'}</h2>
                  <p className="mt-2 break-all text-xs leading-5 text-white/45">{file.url}</p>
                </div>
                <div className="flex gap-2 md:flex-col">
                  <button
                    type="button"
                    onClick={() => edit(file)}
                    className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-white/75"
                    aria-label="Sửa media"
                    title="Sửa media"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => void remove(file)}
                    className="grid h-10 w-10 place-items-center rounded-xl border border-rose-200/20 text-rose-200"
                    aria-label="Xóa media"
                    title="Xóa media"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </div>
  );
};
