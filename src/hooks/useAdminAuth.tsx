import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Session } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

type AdminAuthValue = {
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshAdmin: () => Promise<boolean>;
};

const AdminAuthContext = createContext<AdminAuthValue | null>(null);

const isUserAdmin = async (userId: string) => {
  if (!supabase) {
    return false;
  }

  const { data, error } = await supabase
    .from('admin_users')
    .select('user_id')
    .eq('user_id', userId)
    .maybeSingle();

  return !error && Boolean(data);
};

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState<string | null>(null);

  const refreshAdmin = useCallback(async () => {
    const userId = session?.user.id;

    if (!userId) {
      setIsAdmin(false);
      return false;
    }

    const allowed = await isUserAdmin(userId);
    setIsAdmin(allowed);
    return allowed;
  }, [session?.user.id]);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!supabase) {
      throw new Error('Supabase chưa được cấu hình.');
    }

    setError(null);
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError || !data.session) {
      throw new Error(signInError?.message ?? 'Đăng nhập thất bại.');
    }

    const allowed = await isUserAdmin(data.session.user.id);

    if (!allowed) {
      await supabase.auth.signOut();
      setSession(null);
      setIsAdmin(false);
      throw new Error('Tài khoản này chưa có quyền admin.');
    }

    setSession(data.session);
    setIsAdmin(true);
  }, []);

  const signOut = useCallback(async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }

    setSession(null);
    setIsAdmin(false);
  }, []);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      setError('Supabase chưa được cấu hình.');
      return undefined;
    }

    let mounted = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) {
        return;
      }

      setSession(data.session);
      setIsAdmin(data.session ? await isUserAdmin(data.session.user.id) : false);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession);
      setIsAdmin(nextSession ? await isUserAdmin(nextSession.user.id) : false);
      setLoading(false);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(
    () => ({
      session,
      isAdmin,
      loading,
      error,
      signIn,
      signOut,
      refreshAdmin,
    }),
    [error, isAdmin, loading, refreshAdmin, session, signIn, signOut],
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};

export const useAdminAuth = () => {
  const value = useContext(AdminAuthContext);

  if (!value) {
    throw new Error('useAdminAuth phải được dùng bên trong AdminAuthProvider.');
  }

  return value;
};
