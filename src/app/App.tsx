import { RouterProvider } from 'react-router';
import { AuthProvider } from './context/AuthContext';
import { ApplicationProvider } from './context/ApplicationContext';
import { Toaster } from './components/ui/sonner';
import { router } from './routes';

export default function App() {
  return (
    <AuthProvider>
      <ApplicationProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" />
      </ApplicationProvider>
    </AuthProvider>
  );
}
