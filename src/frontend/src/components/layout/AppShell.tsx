import { ReactNode, useState } from 'react';
import { useSession } from '../../state/session/useSession';
import { Button } from '../ui/button';
import { LogOut } from 'lucide-react';
import { ConfirmDialog } from '../feedback/ConfirmDialog';

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const { logout } = useSession();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogoutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowLogoutDialog(true);
  };

  const handleLogoutConfirm = () => {
    logout();
    setShowLogoutDialog(false);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50">
        <header className="gradient-primary text-white shadow-lg sticky top-0 z-40">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/assets/generated/smart-hisab-logo.dim_512x512.png"
                alt="Smart Hisab Pro"
                className="w-10 h-10 rounded-lg shadow-md"
              />
              <div>
                <h1 className="text-lg font-bold">স্মার্ট হিসাব প্রো</h1>
                <p className="text-[10px] text-white/80">Admin Panel</p>
              </div>
            </div>
            <Button
              onClick={handleLogoutClick}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10 touch-manipulation"
            >
              <LogOut className="w-4 h-4 mr-1" />
              <span className="text-xs">Logout</span>
            </Button>
          </div>
        </header>
        <main>{children}</main>
        <footer className="gradient-slate text-white/80 py-4 mt-8 mb-16">
          <div className="container mx-auto px-4 text-center text-xs">
            © 2026. Built with ❤️ using{' '}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-300 hover:text-cyan-200"
            >
              caffeine.ai
            </a>
          </div>
        </footer>
      </div>
      <ConfirmDialog
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
        title="Confirm Logout"
        description="Are you sure you want to log out?"
        onConfirm={handleLogoutConfirm}
        confirmText="Yes, Log out"
        cancelText="Cancel"
        variant="default"
      />
    </>
  );
}
