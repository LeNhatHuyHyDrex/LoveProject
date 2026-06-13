import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FileText, Home, Image, LayoutDashboard, LogOut, Milestone, Settings } from 'lucide-react';
import clsx from 'clsx';
import { useAdminAuth } from '../hooks/useAdminAuth';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/letters', label: 'Letters', icon: FileText },
  { to: '/admin/timeline', label: 'Timeline', icon: Milestone },
  { to: '/admin/media', label: 'Media', icon: Image },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export const AdminLayout = () => {
  const { signOut, session } = useAdminAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#100b14] text-white">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-white/10 bg-[#160f1d]/95 px-4 py-5 backdrop-blur-xl lg:block">
        <NavLink to="/" className="mb-8 flex items-center gap-3 rounded-2xl px-2 py-2">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-rose-300 text-[#351225]">
            <Home className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-sm font-bold">Love Admin</span>
            <span className="block text-xs text-white/50">Heli & bé Quắn</span>
          </span>
        </NavLink>
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition',
                    isActive
                      ? 'bg-white/14 text-amber-100'
                      : 'text-white/70 hover:bg-white/8 hover:text-white',
                  )
                }
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
        <div className="absolute bottom-5 left-4 right-4">
          <p className="mb-3 truncate text-xs text-white/45">{session?.user.email}</p>
          <button
            type="button"
            onClick={handleSignOut}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-3 py-2.5 text-sm text-white/75 transition hover:bg-white/10"
          >
            <LogOut className="h-4 w-4" />
            Đăng xuất
          </button>
        </div>
      </aside>
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#160f1d]/90 px-4 py-3 backdrop-blur-xl lg:hidden">
        <div className="mb-3 flex items-center justify-between">
          <NavLink to="/admin" className="font-bold">
            Love Admin
          </NavLink>
          <button
            type="button"
            onClick={handleSignOut}
            className="grid h-10 w-10 place-items-center rounded-xl border border-white/10"
            aria-label="Đăng xuất"
            title="Đăng xuất"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
        <nav className="flex gap-2 overflow-x-auto pb-1">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  clsx(
                    'inline-flex min-h-10 shrink-0 items-center gap-2 rounded-xl px-3 text-xs',
                    isActive ? 'bg-white/16 text-amber-100' : 'bg-white/7 text-white/70',
                  )
                }
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </header>
      <main className="min-h-screen px-4 py-6 lg:ml-64 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};
