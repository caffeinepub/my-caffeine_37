import { SessionProvider } from './state/session/SessionProvider';
import { useSession } from './state/session/useSession';
import LoginView from './features/auth/LoginView';
import AdminPanel from './features/admin/AdminPanel';
import UserDashboard from './features/user/UserDashboard';
import { Toaster } from './components/ui/sonner';
import { ThemeProvider } from 'next-themes';

function AppContent() {
  const { session, isInitializing } = useSession();

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <LoginView />;
  }

  if (session.role === 'admin') {
    return <AdminPanel />;
  }

  return <UserDashboard />;
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <SessionProvider>
        <AppContent />
        <Toaster />
      </SessionProvider>
    </ThemeProvider>
  );
}
