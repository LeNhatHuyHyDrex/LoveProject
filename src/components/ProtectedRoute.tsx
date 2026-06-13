import { Navigate } from 'react-router-dom';
import { isSupabaseConfigured } from '../lib/supabase';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { LoadingScreen } from './LoadingScreen';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, isAdmin, loading } = useAdminAuth();

  if (loading) {
    return <LoadingScreen label="Đang kiểm tra quyền admin..." />;
  }

  if (!isSupabaseConfigured || !session || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};
