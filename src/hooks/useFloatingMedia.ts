import { useCallback, useEffect, useState } from 'react';
import { fallbackFloatingMedia } from '../data/fallbackData';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import type { MediaFile } from '../types';

export const useFloatingMedia = () => {
  const [media, setMedia] = useState<MediaFile[]>(fallbackFloatingMedia);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!supabase) {
      setMedia(fallbackFloatingMedia);
      setLoading(false);
      setError('Supabase chưa cấu hình, đang dùng floating photos demo.');
      return;
    }

    setLoading(true);
    const { data, error: fetchError } = await supabase
      .from('media_files')
      .select('*')
      .eq('type', 'image')
      .eq('is_floating', true)
      .order('order_index', { ascending: true })
      .limit(12);

    if (fetchError) {
      setMedia(fallbackFloatingMedia);
      setError(fetchError.message);
    } else {
      const rows = (data ?? []) as MediaFile[];
      setMedia(rows.length > 0 ? rows : fallbackFloatingMedia);
      setError(null);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { media, loading, error, refresh };
};
