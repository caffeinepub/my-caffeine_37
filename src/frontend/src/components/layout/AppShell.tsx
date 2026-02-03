import { ReactNode } from 'react';
import { useSession } from '../../state/session/useSession';
import { Button } from '../ui/button';
import { LogOut } from 'lucide-react';

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const { logout } = useSession();

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/assets/generated/smart-hisab-logo.dim_512x512.png"
              alt="Smart Hisab Pro"
              className="w-10 h-10 rounded-lg"
            />
            <div>
              <h1 className="text-xl font-bold">স্মার্ট হিসাব প্রো</h1>
              <p className="text-xs text-slate-300">Admin Panel</p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="text-white hover:bg-slate-800"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>
      <main>{children}</main>
      <footer className="bg-slate-900 text-slate-400 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm">
          © 2026. Built with ❤️ using{' '}
          <a
            href="https://caffeine.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:text-emerald-300"
          >
            caffeine.ai
          </a>
        </div>
      </footer>
    </div>
  );
}
