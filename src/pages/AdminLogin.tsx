import { useEffect, useState, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Heart, LockKeyhole } from 'lucide-react';
import { toast } from 'sonner';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { isSupabaseConfigured } from '../lib/supabase';

export const AdminLogin = () => {
  const { signIn, isAdmin, session, loading, error } = useAdminAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (session && isAdmin) {
      navigate('/admin', { replace: true });
    }
  }, [isAdmin, navigate, session]);

  if (session && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      await signIn(email, password);
      toast.success('Đăng nhập admin thành công.');
      navigate('/admin', { replace: true });
    } catch (signInError) {
      toast.error(signInError instanceof Error ? signInError.message : 'Không đăng nhập được.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-[linear-gradient(145deg,#130d19,#33172d_48%,#6f2a4d)] px-4 py-10 text-white">
      <section className="w-full max-w-md rounded-[28px] border border-white/16 bg-white/[0.12] p-6 shadow-glow backdrop-blur-2xl sm:p-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-rose-200 text-[#3a1026] shadow-gold">
            <Heart className="h-7 w-7 fill-current" />
          </div>
          <h1 className="font-display text-4xl">Admin Login</h1>
          <p className="mt-2 text-sm text-white/62">Đăng nhập để chỉnh thư, timeline, media và cài đặt.</p>
        </div>

        {!isSupabaseConfigured ? (
          <div className="rounded-2xl border border-amber-100/25 bg-amber-100/10 p-4 text-sm leading-6 text-amber-50">
            Supabase chưa cấu hình. Hãy tạo `.env` từ `.env.example`, điền `VITE_SUPABASE_URL` và
            `VITE_SUPABASE_ANON_KEY`, sau đó chạy lại dev server.
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-2 block text-sm text-white/75">Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="min-h-12 w-full rounded-2xl border border-white/14 bg-white/10 px-4 text-white outline-none transition placeholder:text-white/35 focus:border-amber-100/60"
                placeholder="admin@example.com"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm text-white/75">Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="min-h-12 w-full rounded-2xl border border-white/14 bg-white/10 px-4 text-white outline-none transition placeholder:text-white/35 focus:border-amber-100/60"
                placeholder="••••••••"
              />
            </label>
            {error ? <p className="text-sm text-amber-100">{error}</p> : null}
            <button
              type="submit"
              disabled={submitting || loading}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-300 to-amber-200 px-5 font-bold text-[#351225] shadow-gold transition hover:scale-[1.01] disabled:cursor-wait disabled:opacity-70"
            >
              <LockKeyhole className="h-4 w-4" />
              {submitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>
        )}
      </section>
    </main>
  );
};
