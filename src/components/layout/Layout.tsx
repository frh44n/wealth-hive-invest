
import { ReactNode } from 'react';
import Navigation from './Navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
  requireAuth?: boolean;
  adminOnly?: boolean;
}

const Layout = ({ children, requireAuth = false, adminOnly = false }: LayoutProps) => {
  const { user, isLoading, isAdmin } = useAuth();
  const location = useLocation();

  // Show loading state while authentication is being determined
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to login if authentication is required but user is not authenticated
  if (requireAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to home if page is admin-only but user is not an admin
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Show authenticated layout with navigation
  if (user) {
    return (
      <div className="flex flex-col min-h-screen pb-16">
        <main className="flex-1">
          {children}
        </main>
        <Navigation />
      </div>
    );
  }

  // Show unauthenticated layout (no navigation)
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default Layout;
