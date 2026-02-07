import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from './state/session/SessionProvider';
import { useSession } from './state/session/useSession';
import LoginView from './features/auth/LoginView';
import RegisterView from './features/auth/RegisterView';
import AdminPanel from './features/admin/AdminPanel';
import UserDashboard from './features/user/UserDashboard';
import BlockedAccountView from './features/auth/BlockedAccountView';
import { runStorageMigrations } from './lib/storage/storageSchema';
import { useActor } from './hooks/useActor';
import { useInternetIdentity } from './hooks/useInternetIdentity';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function AppContent() {
  const { session, isInitializing } = useSession();
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const [isBlocked, setIsBlocked] = useState(false);
  const [checkingBlock, setCheckingBlock] = useState(true);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    async function checkBlockStatus() {
      if (session?.role === 'user' && actor && identity) {
        try {
          const principal = identity.getPrincipal();
          const blocked = await actor.isUserBlocked(principal);
          setIsBlocked(blocked);
        } catch (error) {
          console.error('Error checking block status:', error);
        }
      }
      setCheckingBlock(false);
    }

    if (!isInitializing) {
      checkBlockStatus();
    }
  }, [session, actor, identity, isInitializing]);

  if (isInitializing || (session?.role === 'user' && checkingBlock)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    if (showRegister) {
      return <RegisterView onBack={() => setShowRegister(false)} />;
    }
    return <LoginView onSwitchToRegister={() => setShowRegister(true)} />;
  }

  if (session.role === 'user' && isBlocked) {
    return <BlockedAccountView />;
  }

  if (session.role === 'admin') {
    return <AdminPanel />;
  }

  return <UserDashboard />;
}

export default function App() {
  useEffect(() => {
    runStorageMigrations();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <AppContent />
      </SessionProvider>
    </QueryClientProvider>
  );
}
