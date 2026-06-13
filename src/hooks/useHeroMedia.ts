import { useCallback, useEffect, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import type { MediaFile } from '../types';

export const useHeroMedia = () => {
  const [media, setMedia] = useState<MediaFile | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!supabase) {
      setMedia(null);
      setLoading(false);
      setError('Supabase chưa cấu hình, chưa có hero media.');
      return;
    }

    setLoading(true);
    const { data, error: fetchError } = await supabase
      .from('media_files')
      .select('*')
      .eq('type', 'image')
      .eq('is_hero', true)
      .order('order_index', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (fetchError) {
      setMedia(null);
      setError(fetchError.message);
    } else {
      setMedia((data as MediaFile | null) ?? null);
      setError(null);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { media, loading, error, refresh };
};
