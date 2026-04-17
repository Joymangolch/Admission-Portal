import { Navigate } from 'react-router';
import { useAuth } from '../app/context/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

/**
 * ProtectedRoute Component
 * 
 * Ensures only authenticated users can access protected pages
 * Optionally restricts access to specific roles
 * 
 * Usage:
 * <ProtectedRoute requiredRoles={['admin', 'registrar']}>
 *   <AdminPage />
 * </ProtectedRoute>
 */
export function ProtectedRoute({ children, requiredRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();

  // Loading state (optional: add loading context if needed)
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role-based access
  if (requiredRoles && user) {
    if (!requiredRoles.includes(user.role)) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
            <p className="text-gray-600 mb-4">
              You don't have permission to access this page.
            </p>
            <a
              href="/dashboard"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Go to Dashboard
            </a>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}

/**
 * Public Route Component
 * 
 * Redirects authenticated users away from public pages (like login)
 * 
 * Usage:
 * <PublicRoute>
 *   <LoginPage />
 * </PublicRoute>
 */
export function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated && user) {
    // Redirect to appropriate dashboard based on role
    const dashboardPaths: Record<string, string> = {
      candidate: '/dashboard',
      admin: '/admin/dashboard',
      hod: '/hod/dashboard',
      exam: '/exam/dashboard',
      registrar: '/registrar/dashboard',
      accounts: '/accounts/dashboard'
    };

    return <Navigate to={dashboardPaths[user.role] || '/dashboard'} replace />;
  }

  return <>{children}</>;
}

/**
 * Admin-Only Route Component
 * 
 * Restricts access to admin and above roles
 * 
 * Usage:
 * <AdminRoute>
 *   <AdminPage />
 * </AdminRoute>
 */
export function AdminRoute({ children }: { children: React.ReactNode }) {
  const adminRoles = ['admin', 'hod', 'registrar'];
  
  return (
    <ProtectedRoute requiredRoles={adminRoles}>
      {children}
    </ProtectedRoute>
  );
}

/**
 * Registrar-Only Route Component
 * 
 * Restricts access to registrar role only
 */
export function RegistrarRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRoles={['registrar']}>
      {children}
    </ProtectedRoute>
  );
}
