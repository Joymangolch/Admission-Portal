import { createBrowserRouter, Navigate } from 'react-router';
import { PublicLayout } from './components/layouts/PublicLayout';
import { DashboardLayout } from './components/layouts/DashboardLayout';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { CandidateDashboard } from './pages/candidate/CandidateDashboard';
import { ApplicationForm } from './pages/candidate/ApplicationForm';
import { DocumentUpload } from './pages/candidate/DocumentUpload';
import { NotificationsPage } from './pages/candidate/NotificationsPage';
import { PaymentPage } from './pages/candidate/PaymentPage';
import { ApplicationStatusPage } from './pages/candidate/ApplicationStatusPage';
import { AdmitCardPage } from './pages/candidate/AdmitCardPage';
import { ResultPage } from './pages/candidate/ResultPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ApplicationReviewPage } from './pages/admin/ApplicationReviewPage';
import { UserRoleManagementPage } from './pages/admin/UserRoleManagementPage';
import { ExamManagementPage } from './pages/admin/ExamManagementPage';
import { ResultManagementPage } from './pages/admin/ResultManagementPage';
import { NotificationSystemPage } from './pages/admin/NotificationSystemPage';
import { HODDashboard } from './pages/hod/HODDashboard';
import { ExamDashboard } from './pages/exam/ExamDashboard';
import { RegistrarDashboard } from './pages/registrar/RegistrarDashboard';
import { AccountsDashboard } from './pages/accounts/AccountsDashboard';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />
      },
      {
        path: 'courses',
        element: <div className="container mx-auto py-12 px-4"><h1 className="text-3xl font-bold">Courses Page</h1></div>
      },
      {
        path: 'fees',
        element: <div className="container mx-auto py-12 px-4"><h1 className="text-3xl font-bold">Fee Structure Page</h1></div>
      }
    ]
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <CandidateDashboard />
      },
      {
        path: 'application',
        element: <ApplicationForm />
      },
      {
        path: 'documents',
        element: <DocumentUpload />
      },
      {
        path: 'notifications',
        element: <NotificationsPage />
      },
      {
        path: 'payment',
        element: <PaymentPage />
      },
      {
        path: 'application-status',
        element: <ApplicationStatusPage />
      },
      {
        path: 'admit-card',
        element: <AdmitCardPage />
      },
      {
        path: 'results',
        element: <ResultPage />
      }
    ]
  },
  {
    path: '/admin',
    element: <DashboardLayout />,
    children: [
      {
        path: 'dashboard',
        element: <AdminDashboard />
      },
      {
        path: 'applications',
        element: <div className="text-center py-12"><h2 className="text-2xl font-bold">Applications Management</h2></div>
      },
      {
        path: 'review',
        element: <ApplicationReviewPage />
      },
      {
        path: 'verification',
        element: <div className="text-center py-12"><h2 className="text-2xl font-bold">Document Verification</h2></div>
      },
      {
        path: 'users',
        element: <UserRoleManagementPage />
      },
      {
        path: 'exams',
        element: <ExamManagementPage />
      },
      {
        path: 'results',
        element: <ResultManagementPage />
      },
      {
        path: 'notifications',
        element: <NotificationSystemPage />
      },
      {
        path: 'settings',
        element: <div className="text-center py-12"><h2 className="text-2xl font-bold">Admin Settings</h2></div>
      }
    ]
  },
  {
    path: '/hod',
    element: <DashboardLayout />,
    children: [
      {
        path: 'dashboard',
        element: <HODDashboard />
      },
      {
        path: 'candidates',
        element: <div className="text-center py-12"><h2 className="text-2xl font-bold">Department Candidates</h2></div>
      },
      {
        path: 'courses',
        element: <div className="text-center py-12"><h2 className="text-2xl font-bold">Course Management</h2></div>
      }
    ]
  },
  {
    path: '/exam',
    element: <DashboardLayout />,
    children: [
      {
        path: 'dashboard',
        element: <ExamDashboard />
      },
      {
        path: 'results',
        element: <div className="text-center py-12"><h2 className="text-2xl font-bold">Results Management</h2></div>
      },
      {
        path: 'reports',
        element: <div className="text-center py-12"><h2 className="text-2xl font-bold">Exam Reports</h2></div>
      }
    ]
  },
  {
    path: '/registrar',
    element: <DashboardLayout />,
    children: [
      {
        path: 'dashboard',
        element: <RegistrarDashboard />
      },
      {
        path: 'enrollments',
        element: <div className="text-center py-12"><h2 className="text-2xl font-bold">Student Enrollments</h2></div>
      },
      {
        path: 'records',
        element: <div className="text-center py-12"><h2 className="text-2xl font-bold">Academic Records</h2></div>
      }
    ]
  },
  {
    path: '/accounts',
    element: <DashboardLayout />,
    children: [
      {
        path: 'dashboard',
        element: <AccountsDashboard />
      },
      {
        path: 'payments',
        element: <div className="text-center py-12"><h2 className="text-2xl font-bold">Payment Management</h2></div>
      },
      {
        path: 'reports',
        element: <div className="text-center py-12"><h2 className="text-2xl font-bold">Financial Reports</h2></div>
      }
    ]
  },
  {
    path: '*',
    element: <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Page not found</p>
        <a href="/" className="text-[#1E3A8A] hover:underline">Go back to home</a>
      </div>
    </div>
  }
]);