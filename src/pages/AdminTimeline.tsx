import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { ArrowDown, ArrowUp, Plus, RefreshCw, Save, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import { fallbackTimeline } from '../data/fallbackData';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import type { MediaFile, TimelineItem } from '../types';

type TimelineForm = {
  title: string;
  display_date: string;
  actual_date: string;
  description: string;
  mood: string;
  is_highlight: boolean;
  is_published: boolean;
  order_index: number;
};

const emptyForm: TimelineForm = {
  title: '',
  display_date: '',
  actual_date: '',
  description: '',
  mood: '',
  is_highlight: false,
  is_published: true,
  order_index: 0,
};

const attachMedia = (items: TimelineItem[], media: MediaFile[]) =>
  items.map((item) => ({
    ...item,
    media: media.filter((file) => file.timeline_item_id === item.id),
  }));

export const AdminTimeline = () => {
  const [items, setItems] = useState<TimelineItem[]>([]);
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [form, setForm] = useState<TimelineForm>(emptyForm);
  const [selectedMediaIds, setSelectedMediaIds] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [saving, setSaving] = useState(false);

  const sortedItems = useMemo(
    () => [...items].sort((a, b) => a.order_index - b.order_index),
    [items],
  );

  const selectedMedia = useMemo(
    () => media.filter((file) => selectedMediaIds.includes(file.id)),
    [media, selectedMediaIds],
  );

  const load = async () => {
    if (!supabase) {
      const fallbackMedia = fallbackTimeline.flatMap((item) => item.media);
      setMedia(fallbackMedia);
      setItems(fallbackTimeline);
      setLoading(false);
      return;
    }

    setLoading(true);
    const [{ data: timelineData, error: timelineError }, { data: mediaData, error: mediaError }] =
      await Promise.all([
        supabase.from('timeline_items').select('*').order('order_index', { ascending: true }),
        supabase.from('media_files').select('*').order('order_index', { ascending: true }),
      ]);

    if (timelineError || mediaError) {
      toast.error(timelineError?.message ?? mediaError?.message ?? 'Không tải được timeline.');
    } else {
      const mediaRows = (mediaData ?? []) as MediaFile[];
      setMedia(mediaRows);
      setItems(attachMedia((timelineData ?? []) as TimelineItem[], mediaRows));
    }

    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setForm({
      ...emptyForm,
      order_index: sortedItems.length + 1,
    });
    setSelectedMediaIds([]);
  };

  useEffect(() => {
    if (!editingId && form.order_index === 0 && sortedItems.length > 0) {
      setForm((current) => ({ ...current, order_index: sortedItems.length + 1 }));
    }
  }, [editingId, form.order_index, sortedItems.length]);

  const editItem = (item: TimelineItem) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      display_date: item.display_date ?? '',
      actual_date: item.actual_date ?? '',
      description: item.description ?? '',
      mood: item.mood ?? '',
      is_highlight: item.is_highlight,
      is_published: item.is_published,
      order_index: item.order_index,
    });
    setSelectedMediaIds(media.filter((file) => file.timeline_item_id === item.id).map((file) => file.id));
  };

  const syncMedia = async (itemId: string) => {
    if (!supabase) {
      return;
    }

    const client = supabase;

    await Promise.all(
      media
        .filter((file) => selectedMediaIds.includes(file.id) || file.timeline_item_id === itemId)
        .map((file) => {
          const nextTimelineId = selectedMediaIds.includes(file.id) ? itemId : null;
          return client
            .from('media_files')
            .update({ timeline_item_id: nextTimelineId })
            .eq('id', file.id);
        }),
    );
  };

  const saveItem = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!supabase) {
      toast.error('Supabase chưa cấu hình, không thể lưu timeline.');
      return;
    }

    setSaving(true);
    const payload = {
      title: form.title,
      display_date: form.display_date || null,
      actual_date: form.actual_date || null,
      description: form.description || null,
      mood: form.mood || null,
      is_highlight: form.is_highlight,
      is_published: form.is_published,
      order_index: Number(form.order_index) || 0,
      updated_at: new Date().toISOString(),
    };

    if (editingId) {
      const { error } = await supabase.from('timeline_items').update(payload).eq('id', editingId);

      if (error) {
        toast.error(error.message);
        setSaving(false);
        return;
      }

      await syncMedia(editingId);
      toast.success('Đã cập nhật mốc timeline.');
    } else {
      const { data, error } = await supabase
        .from('timeline_items')
        .insert(payload)
        .select('id')
        .single();

      if (error || !data) {
        toast.error(error?.message ?? 'Không tạo được mốc mới.');
        setSaving(false);
        return;
      }

      await syncMedia((data as { id: string }).id);
      toast.success('Đã thêm mốc timeline.');
    }

    setSaving(false);
    resetForm();
    await load();
  };

  const deleteItem = async (item: TimelineItem) => {
    if (!supabase) {
      toast.error('Supabase chưa cấu hình, không thể xóa.');
      return;
    }

    if (!window.confirm(`Xóa mốc "${item.title}"?`)) {
      return;
    }

    const { error } = await supabase.from('timeline_items').delete().eq('id', item.id);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Đã xóa mốc timeline.');
      await load();
    }
  };

  const moveItem = async (item: TimelineItem, direction: -1 | 1) => {
    if (!supabase) {
      toast.error('Supabase chưa cấu hình, không thể đổi thứ tự.');
      return;
    }

    const currentIndex = sortedItems.findIndex((current) => current.id === item.id);
    const target = sortedItems[currentIndex + direction];

    if (!target) {
      return;
    }

    const [{ error: currentError }, { error: targetError }] = await Promise.all([
      supabase.from('timeline_items').update({ order_index: target.order_index }).eq('id', item.id),
      supabase.from('timeline_items').update({ order_index: item.order_index }).eq('id', target.id),
    ]);

    if (currentError || targetError) {
      toast.error(currentError?.message ?? targetError?.message ?? 'Không đổi được thứ tự.');
    } else {
      await load();
    }
  };

  const toggleMedia = (mediaId: string) => {
    setSelectedMediaIds((current) =>
      current.includes(mediaId)
        ? current.filter((id) => id !== mediaId)
        : [...current, mediaId],
    );
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-amber-100/70">
            Kỷ niệm
          </p>
          <h1 className="mt-2 font-display text-4xl">Admin Timeline</h1>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={resetForm}
            className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-white/12 px-4 text-sm text-white/80 transition hover:bg-white/10"
          >
            <Plus className="h-4 w-4" />
            Mốc mới
          </button>
          <button
            type="button"
            onClick={() => void load()}
            className="grid h-11 w-11 place-items-center rounded-2xl border border-white/12 text-white/80 transition hover:bg-white/10"
            aria-label="Tải lại timeline"
            title="Tải lại timeline"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {!isSupabaseConfigured ? (
        <div className="mb-5 rounded-3xl border border-amber-100/25 bg-amber-100/10 p-4 text-sm text-amber-50">
          Supabase chưa cấu hình. Trang này đang hiển thị timeline demo và không thể lưu.
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(360px,0.85fr)_minmax(0,1fr)]">
        <section className="rounded-3xl border border-white/10 bg-white/[0.08] p-5">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-semibold">{editingId ? 'Sửa mốc' : 'Thêm mốc'}</h2>
            {editingId ? (
              <button
                type="button"
                onClick={resetForm}
                className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 text-white/70"
                aria-label="Hủy sửa"
                title="Hủy sửa"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>
          <form className="space-y-4" onSubmit={saveItem}>
            <label className="block">
              <span className="mb-2 block text-sm text-white/70">Title</span>
              <input
                value={form.title}
                onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                required
                className="min-h-11 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-white outline-none focus:border-amber-100/60"
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm text-white/70">Display date</span>
                <input
                  value={form.display_date}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, display_date: event.target.value }))
                  }
                  className="min-h-11 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-white outline-none focus:border-amber-100/60"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm text-white/70">Actual date</span>
                <input
                  type="date"
                  value={form.actual_date}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, actual_date: event.target.value }))
                  }
                  className="min-h-11 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-white outline-none focus:border-amber-100/60"
                />
              </label>
            </div>
            <label className="block">
              <span className="mb-2 block text-sm text-white/70">Description</span>
              <textarea
                value={form.description}
                onChange={(event) =>
                  setForm((current) => ({ ...current, description: event.target.value }))
                }
                rows={5}
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-7 text-white outline-none focus:border-amber-100/60"
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm text-white/70">Mood</span>
                <input
                  value={form.mood}
                  onChange={(event) => setForm((current) => ({ ...current, mood: event.target.value }))}
                  className="min-h-11 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-white outline-none focus:border-amber-100/60"
                />
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
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex min-h-11 items-center gap-3 rounded-2xl border border-white/10 bg-black/15 px-4 text-sm text-white/75">
                <input
                  type="checkbox"
                  checked={form.is_highlight}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, is_highlight: event.target.checked }))
                  }
                />
                Highlight
              </label>
              <label className="flex min-h-11 items-center gap-3 rounded-2xl border border-white/10 bg-black/15 px-4 text-sm text-white/75">
                <input
                  type="checkbox"
                  checked={form.is_published}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, is_published: event.target.checked }))
                  }
                />
                Published
              </label>
            </div>
            <div>
              <p className="mb-2 text-sm text-white/70">Gán media</p>
              <div className="max-h-52 space-y-2 overflow-y-auto rounded-2xl border border-white/10 bg-black/15 p-3">
                {media.length === 0 ? (
                  <p className="text-sm text-white/45">Chưa có media. Hãy upload ở trang Media.</p>
                ) : (
                  media.map((file) => (
                    <label
                      key={file.id}
                      className="flex cursor-pointer items-center gap-3 rounded-xl px-2 py-2 text-sm text-white/75 hover:bg-white/8"
                    >
                      <input
                        type="checkbox"
                        checked={selectedMediaIds.includes(file.id)}
                        onChange={() => toggleMedia(file.id)}
                      />
                      <span className="truncate">
                        {file.caption || file.alt || file.public_id || file.url}
                      </span>
                    </label>
                  ))
                )}
              </div>
            </div>
            <button
              type="submit"
              disabled={saving || loading || !isSupabaseConfigured}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-amber-100 px-5 text-sm font-bold text-[#351225] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-55"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Đang lưu...' : 'Lưu mốc'}
            </button>
          </form>

          <div className="mt-6 rounded-3xl border border-white/10 bg-black/18 p-4">
            <p className="mb-3 text-sm font-semibold text-amber-100">Preview card</p>
            <div className="rounded-2xl border border-white/12 bg-white/10 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-amber-100/75">
                {form.display_date || 'Display date'}
              </p>
              <h3 className="mt-2 font-display text-2xl">{form.title || 'Title timeline'}</h3>
              <p className="mt-2 text-sm leading-6 text-white/60">
                {form.description || 'Description sẽ hiển thị tại đây.'}
              </p>
              {selectedMedia.length > 0 ? (
                <p className="mt-3 text-xs text-white/45">{selectedMedia.length} media được gán</p>
              ) : null}
            </div>
          </div>
        </section>

        <section className="space-y-3">
          {loading ? (
            <div className="rounded-3xl border border-white/10 bg-white/[0.08] p-5 text-white/55">
              Đang tải timeline...
            </div>
          ) : sortedItems.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/[0.08] p-5 text-white/55">
              Chưa có mốc timeline.
            </div>
          ) : (
            sortedItems.map((item, index) => (
              <article
                key={item.id}
                className="rounded-3xl border border-white/10 bg-white/[0.08] p-4 transition hover:bg-white/[0.11]"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <button type="button" onClick={() => editItem(item)} className="text-left">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-white/45">
                      <span>#{item.order_index}</span>
                      <span>{item.display_date}</span>
                      <span>{item.is_published ? 'Published' : 'Draft'}</span>
                      {item.is_highlight ? <span className="text-amber-100">Highlight</span> : null}
                    </div>
                    <h2 className="mt-1 font-display text-2xl">{item.title}</h2>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/55">
                      {item.description}
                    </p>
                    <p className="mt-2 text-xs text-white/40">{item.media.length} media</p>
                  </button>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => void moveItem(item, -1)}
                      disabled={index === 0}
                      className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-white/70 disabled:opacity-35"
                      aria-label="Move up"
                      title="Move up"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => void moveItem(item, 1)}
                      disabled={index === sortedItems.length - 1}
                      className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-white/70 disabled:opacity-35"
                      aria-label="Move down"
                      title="Move down"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => void deleteItem(item)}
                      className="grid h-10 w-10 place-items-center rounded-xl border border-rose-200/20 text-rose-200"
                      aria-label="Xóa mốc"
                      title="Xóa mốc"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </div>
  );
};
