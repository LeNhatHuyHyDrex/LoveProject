import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AdminLayout } from './components/AdminLayout';
import { LoadingScreen } from './components/LoadingScreen';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminAuthProvider } from './hooks/useAdminAuth';

const Home = lazy(() => import('./pages/Home').then((module) => ({ default: module.Home })));
const AcceptPage = lazy(() =>
  import('./pages/AcceptPage').then((module) => ({ default: module.AcceptPage })),
);
const GentlePage = lazy(() =>
  import('./pages/GentlePage').then((module) => ({ default: module.GentlePage })),
);
const AdminLogin = lazy(() =>
  import('./pages/AdminLogin').then((module) => ({ default: module.AdminLogin })),
);
const AdminDashboard = lazy(() =>
  import('./pages/AdminDashboard').then((module) => ({ default: module.AdminDashboard })),
);
const AdminLetters = lazy(() =>
  import('./pages/AdminLetters').then((module) => ({ default: module.AdminLetters })),
);
const AdminTimeline = lazy(() =>
  import('./pages/AdminTimeline').then((module) => ({ default: module.AdminTimeline })),
);
const AdminMedia = lazy(() =>
  import('./pages/AdminMedia').then((module) => ({ default: module.AdminMedia })),
);
const AdminSettings = lazy(() =>
  import('./pages/AdminSettings').then((module) => ({ default: module.AdminSettings })),
);

export const App = () => (
  <AdminAuthProvider>
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/accept" element={<AcceptPage />} />
        <Route path="/gentle" element={<GentlePage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="letters" element={<AdminLetters />} />
          <Route path="timeline" element={<AdminTimeline />} />
          <Route path="media" element={<AdminMedia />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
    <Toaster richColors position="top-right" />
  </AdminAuthProvider>
);
