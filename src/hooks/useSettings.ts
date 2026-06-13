import { useCallback, useEffect, useState } from 'react';
import { defaultSettings } from '../data/fallbackData';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import type { AppSettings, SettingsRow } from '../types';

const normalizeSettings = (rows: SettingsRow[]) => {
  const merged: Record<string, unknown> = { ...defaultSettings };

  rows.forEach((row) => {
    merged[row.key] = row.value;
  });

  return merged as AppSettings;
};

export const useSettings = () => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!supabase) {
      setSettings(defaultSettings);
      setLoading(false);
      setError('Supabase chưa cấu hình, đang dùng dữ liệu demo.');
      return;
    }

    setLoading(true);
    const { data, error: fetchError } = await supabase.from('app_settings').select('*');

    if (fetchError) {
      setSettings(defaultSettings);
      setError(fetchError.message);
    } else {
      setSettings(normalizeSettings((data ?? []) as SettingsRow[]));
      setError(null);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { settings, loading, error, refresh };
};
