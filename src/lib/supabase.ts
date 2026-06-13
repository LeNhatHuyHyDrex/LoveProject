import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() ?? '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ?? '';

const hasRealValue = (value: string) =>
  value.length > 0 && !value.includes('your_') && !value.includes('example');

export const isSupabaseConfigured = hasRealValue(supabaseUrl) && hasRealValue(supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export const requireSupabase = () => {
  if (!supabase) {
    throw new Error('Supabase chưa được cấu hình. Hãy kiểm tra file .env.');
  }

  return supabase;
};
