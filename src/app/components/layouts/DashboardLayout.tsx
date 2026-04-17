import { Outlet, Link, useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import {
  GraduationCap,
  LayoutDashboard,
  FileText,
  Upload,
  Bell,
  LogOut,
  Users,
  ClipboardList,
  DollarSign,
  BookOpen,
  Settings,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

export function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavigationItems = () => {
    switch (user?.role) {
      case 'candidate':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
          { icon: FileText, label: 'Application', path: '/dashboard/application' },
          { icon: Upload, label: 'Documents', path: '/dashboard/documents' },
          { icon: Bell, label: 'Notifications', path: '/dashboard/notifications' }
        ];
      case 'admin':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
          { icon: Users, label: 'Applications', path: '/admin/applications' },
          { icon: ClipboardList, label: 'Verification', path: '/admin/verification' },
          { icon: Settings, label: 'Settings', path: '/admin/settings' }
        ];
      case 'hod':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/hod/dashboard' },
          { icon: Users, label: 'Candidates', path: '/hod/candidates' },
          { icon: BookOpen, label: 'Course Management', path: '/hod/courses' }
        ];
      case 'exam':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/exam/dashboard' },
          { icon: ClipboardList, label: 'Results', path: '/exam/results' },
          { icon: FileText, label: 'Reports', path: '/exam/reports' }
        ];
      case 'registrar':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/registrar/dashboard' },
          { icon: Users, label: 'Enrollments', path: '/registrar/enrollments' },
          { icon: FileText, label: 'Records', path: '/registrar/records' }
        ];
      case 'accounts':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/accounts/dashboard' },
          { icon: DollarSign, label: 'Payments', path: '/accounts/payments' },
          { icon: FileText, label: 'Reports', path: '/accounts/reports' }
        ];
      default:
        return [];
    }
  };

  const navItems = getNavigationItems();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-md hover:bg-gray-100"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <Link to="/" className="flex items-center gap-2">
                <GraduationCap className="w-8 h-8 text-[#1E3A8A]" />
                <span className="font-semibold text-gray-900 hidden sm:block">MTU Portal</span>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
            ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            mt-16 lg:mt-0
          `}
        >
          <nav className="p-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-[#1E3A8A] transition-colors"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Mobile overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden mt-16"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
