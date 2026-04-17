import { RouterProvider } from 'react-router';
import { AuthProvider } from './context/AuthContext';
import { ApplicationProvider } from './context/ApplicationContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Toaster } from './components/ui/sonner';
import { router } from './routes';

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ApplicationProvider>
          <RouterProvider router={router} />
          <Toaster position="top-right" />
        </ApplicationProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
