import { useEffect, useState } from 'react';
import AdminBottomNav from './AdminBottomNav';
import { AdminView } from './adminNavTypes';
import { ArrowLeft, LogOut } from 'lucide-react';
import AdminHeaderAvatar from './AdminHeaderAvatar';
import { useSession } from '../../../state/session/useSession';

interface AdminLayoutShellProps {
  children: React.ReactNode;
  currentView: AdminView;
  onNavigate: (view: AdminView) => void;
  onMtLoanClick: () => void;
}

export default function AdminLayoutShell({
  children,
  currentView,
  onNavigate,
  onMtLoanClick,
}: AdminLayoutShellProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const { logout } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getViewTitle = (): string => {
    switch (currentView) {
      case 'dashboard':
        return 'এডমিন ড্যাশবোর্ড';
      case 'production':
        return 'উৎপাদন';
      case 'work':
        return 'কাজ';
      case 'nasta':
        return 'নাস্তা';
      case 'payment':
        return 'পেমেন্ট/লোন';
      case 'user-requests':
        return 'ইউজার রিকোয়েস্ট';
      case 'settings':
        return 'সেটিংস';
      case 'worker-rate-settings':
        return 'ওয়ার্কার রেট';
      case 'final-balance':
        return 'ফাইনাল ব্যালেন্স';
      case 'company-report':
        return 'কোম্পানি রিপোর্ট';
      case 'support':
        return 'সাপোর্ট';
      default:
        return 'Admin Panel';
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pb-24 touch-manipulation">
      {/* Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/80 backdrop-blur-md border-b-2 border-blue-200 shadow-lg'
            : 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 border-b-2 border-blue-400'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {currentView !== 'dashboard' && (
              <button
                onClick={() => onNavigate('dashboard')}
                className={`p-2 rounded-lg transition-all touch-manipulation ${
                  isScrolled
                    ? 'hover:bg-gray-100'
                    : 'hover:bg-white/20'
                }`}
              >
                <ArrowLeft
                  className={`w-5 h-5 ${
                    isScrolled ? 'text-gray-700' : 'text-white'
                  }`}
                />
              </button>
            )}
            <h1
              className={`text-lg font-bold transition-colors ${
                isScrolled
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'
                  : 'text-white'
              }`}
            >
              {getViewTitle()}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {currentView === 'dashboard' && (
              <button
                onClick={onMtLoanClick}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all touch-manipulation ${
                  isScrolled
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                MT-LOAN
              </button>
            )}
            <button
              onClick={handleLogout}
              className={`p-2 rounded-lg transition-all touch-manipulation ${
                isScrolled
                  ? 'hover:bg-gray-100'
                  : 'hover:bg-white/20'
              }`}
              title="Logout"
            >
              <LogOut
                className={`w-5 h-5 ${
                  isScrolled ? 'text-gray-700' : 'text-white'
                }`}
              />
            </button>
            <AdminHeaderAvatar />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4">
        {children}
      </main>

      {/* Bottom Navigation */}
      <AdminBottomNav activeView={currentView} onNavigate={onNavigate} />
    </div>
  );
}
