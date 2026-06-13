import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Image, Milestone, Settings, Timer, UsersRound } from 'lucide-react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import type { LoveResponse } from '../types';

type DashboardStats = {
  timeline: number;
  media: number;
  latestResponse: LoveResponse | null;
};

const quickLinks = [
  { to: '/admin/letters', label: 'Sửa thư', icon: FileText },
  { to: '/admin/timeline', label: 'Timeline', icon: Milestone },
  { to: '/admin/media', label: 'Media', icon: Image },
  { to: '/admin/settings', label: 'Cài đặt', icon: Settings },
];

export const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    timeline: 0,
    media: 0,
    latestResponse: null,
  });
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    const load = async () => {
      if (!supabase) {
        setLoading(false);
        return;
      }

      const [
        { count: timelineCount },
        { count: mediaCount },
        { data: latestResponse },
      ] = await Promise.all([
        supabase.from('timeline_items').select('*', { count: 'exact', head: true }),
        supabase.from('media_files').select('*', { count: 'exact', head: true }),
        supabase
          .from('love_responses')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle(),
      ]);

      setStats({
        timeline: timelineCount ?? 0,
        media: mediaCount ?? 0,
        latestResponse: (latestResponse as LoveResponse | null) ?? null,
      });
      setLoading(false);
    };

    void load();
  }, []);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-amber-100/70">
          Love Confession
        </p>
        <h1 className="mt-2 font-display text-4xl">Dashboard</h1>
        <p className="mt-2 text-sm text-white/55">
          Quản lý nội dung public, timeline, media và các phản hồi của người nhận.
        </p>
      </div>

      {!isSupabaseConfigured ? (
        <div className="mb-6 rounded-3xl border border-amber-100/25 bg-amber-100/10 p-5 text-sm leading-6 text-amber-50">
          Supabase chưa cấu hình nên admin chỉ hiển thị khung giao diện. Public site vẫn chạy bằng
          fallback data.
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-white/[0.08] p-5">
          <Milestone className="mb-4 h-6 w-6 text-amber-100" />
          <p className="text-3xl font-bold">{loading ? '...' : stats.timeline}</p>
          <p className="mt-1 text-sm text-white/52">Timeline items</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/[0.08] p-5">
          <Image className="mb-4 h-6 w-6 text-rose-200" />
          <p className="text-3xl font-bold">{loading ? '...' : stats.media}</p>
          <p className="mt-1 text-sm text-white/52">Media files</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/[0.08] p-5">
          <UsersRound className="mb-4 h-6 w-6 text-sky-100" />
          <p className="text-3xl font-bold">
            {stats.latestResponse?.choice === 'accept'
              ? 'Accept'
              : stats.latestResponse?.choice === 'gentle'
                ? 'Gentle'
                : 'Chưa có'}
          </p>
          <p className="mt-1 text-sm text-white/52">
            {stats.latestResponse
              ? new Date(stats.latestResponse.created_at).toLocaleString('vi-VN')
              : 'Response mới nhất'}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        {quickLinks.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-3xl border border-white/10 bg-white/[0.08] p-5 transition hover:-translate-y-1 hover:bg-white/[0.12]"
            >
              <Icon className="mb-5 h-6 w-6 text-amber-100" />
              <span className="font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.08] p-5">
        <div className="mb-3 flex items-center gap-2 text-amber-100">
          <Timer className="h-5 w-5" />
          <span className="font-semibold">Gợi ý vận hành</span>
        </div>
        <p className="text-sm leading-7 text-white/60">
          Upload media lên Cloudinary, lưu URL ở Supabase, sau đó gán media vào từng mốc timeline.
          Video chỉ được tải khi người xem click mở modal.
        </p>
      </div>
    </div>
  );
};
