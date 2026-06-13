import { useCallback, useEffect, useState } from 'react';
import { getDefaultLetter } from '../data/fallbackData';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import type { Letter, LetterType } from '../types';

export const useLetter = (type: LetterType) => {
  const [letter, setLetter] = useState<Letter>(getDefaultLetter(type));
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!supabase) {
      setLetter(getDefaultLetter(type));
      setLoading(false);
      setError('Supabase chưa cấu hình, đang dùng thư mặc định.');
      return;
    }

    setLoading(true);
    const { data, error: fetchError } = await supabase
      .from('letters')
      .select('*')
      .eq('type', type)
      .maybeSingle();

    if (fetchError || !data) {
      setLetter(getDefaultLetter(type));
      setError(fetchError?.message ?? 'Chưa có thư trong Supabase.');
    } else {
      setLetter(data as Letter);
      setError(null);
    }

    setLoading(false);
  }, [type]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { letter, loading, error, refresh };
};
