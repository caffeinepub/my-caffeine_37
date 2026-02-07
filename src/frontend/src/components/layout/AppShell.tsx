import { useState, useEffect } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { LogOut, Calculator } from 'lucide-react';
import { useBranding } from '../../hooks/useBranding';
import { useDashboardOverrides } from '../../hooks/useDashboardOverrides';
import MtLoanPasswordPrompt from '../../features/mt-loan/MtLoanPasswordPrompt';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const { clear, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { branding } = useBranding();
  const { getLabel } = useDashboardOverrides();
  const [showMtLoanPrompt, setShowMtLoanPrompt] = useState(false);

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    const confirmLogout = window.confirm(
      getLabel('logoutConfirmText', 'Are you sure you want to logout?') || 'Are you sure you want to logout?'
    );
    if (confirmLogout) {
      await clear();
      queryClient.clear();
    }
  };

  const handleMtLoanClick = () => {
    setShowMtLoanPrompt(true);
  };

  const handleCalculatorClick = () => {
    // Placeholder for calculator functionality
    alert('Calculator feature coming soon!');
  };

  return (
    <>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Header */}
        <header
          className={`sticky top-0 z-50 transition-all duration-300 ${
            isScrolled
              ? 'bg-white/80 backdrop-blur-md border-b-2 border-blue-200 shadow-lg'
              : 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 border-b-2 border-blue-400'
          }`}
        >
          <div className="max-w-7xl mx-auto px-3 py-2 flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center gap-2">
              {branding.logoDataUrl && (
                <img
                  src={branding.logoDataUrl}
                  alt="Logo"
                  className="w-8 h-8 object-contain rounded-full"
                />
              )}
              <h1
                className={`text-base font-bold transition-colors ${
                  isScrolled
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'
                    : 'text-white'
                }`}
              >
                {branding.companyName}
              </h1>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleMtLoanClick}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all touch-manipulation ${
                  isScrolled
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                MT-LOAN
              </button>
              <button
                onClick={() => alert('Support feature coming soon!')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all touch-manipulation ${
                  isScrolled
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {getLabel('supportButtonLabel', 'সাপোর্ট') || 'সাপোর্ট'}
              </button>
              <button
                onClick={handleCalculatorClick}
                className={`p-2 rounded-lg transition-all touch-manipulation ${
                  isScrolled
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:from-teal-600 hover:to-cyan-600'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <Calculator className="w-4 h-4" />
              </button>
              {identity && (
                <button
                  onClick={handleLogout}
                  className={`p-2 rounded-lg transition-all touch-manipulation ${
                    isScrolled
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-3 text-center text-xs border-t-2 border-blue-400">
          <p>
            © 2026. Built with ❤️ using{' '}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-blue-200 transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </footer>
      </div>

      <MtLoanPasswordPrompt
        open={showMtLoanPrompt}
        onOpenChange={setShowMtLoanPrompt}
      />
    </>
  );
}
