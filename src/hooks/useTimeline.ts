import { useCallback, useEffect, useState } from 'react';
import { fallbackTimeline } from '../data/fallbackData';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import type { MediaFile, TimelineItem } from '../types';

const attachMedia = (items: TimelineItem[], media: MediaFile[]) =>
  items.map((item) => ({
    ...item,
    media: media
      .filter((file) => file.timeline_item_id === item.id)
      .sort((a, b) => a.order_index - b.order_index),
  }));

export const useTimeline = () => {
  const [items, setItems] = useState<TimelineItem[]>(fallbackTimeline);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!supabase) {
      setItems(fallbackTimeline);
      setLoading(false);
      setError('Supabase chưa cấu hình, đang dùng timeline demo.');
      return;
    }

    setLoading(true);
    const [{ data: timelineData, error: timelineError }, { data: mediaData, error: mediaError }] =
      await Promise.all([
        supabase
          .from('timeline_items')
          .select('*')
          .eq('is_published', true)
          .order('order_index', { ascending: true }),
        supabase.from('media_files').select('*').order('order_index', { ascending: true }),
      ]);

    if (timelineError || mediaError) {
      setItems(fallbackTimeline);
      setError(timelineError?.message ?? mediaError?.message ?? 'Không tải được timeline.');
    } else {
      setItems(
        attachMedia((timelineData ?? []) as TimelineItem[], (mediaData ?? []) as MediaFile[]),
      );
      setError(null);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { items, loading, error, refresh };
};
