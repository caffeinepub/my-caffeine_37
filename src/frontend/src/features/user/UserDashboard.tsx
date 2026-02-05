import { useState, useEffect } from 'react';
import { useSession } from '../../state/session/useSession';
import { safeGetItem } from '../../lib/storage/safeStorage';
import ProductionHistoryView from './production/ProductionHistoryView';
import WorkHistoryView from './work/WorkHistoryView';
import PaymentHistoryView from './payment/PaymentHistoryView';
import ProfileSettingsView from './profile/ProfileSettingsView';
import SupportView from '../support/SupportView';
import DashboardFrame from '../../components/layout/DashboardFrame';
import DashboardFooter from '../../components/layout/DashboardFooter';
import { ConfirmDialog } from '../../components/feedback/ConfirmDialog';
import { LogOut } from 'lucide-react';
import UserKpiSummary from './components/UserKpiSummary';

type ViewMode = 'dashboard' | 'production' | 'work' | 'payment' | 'profile' | 'support';

export default function UserDashboard() {
  const { session, logout } = useSession();
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [totalWork, setTotalWork] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [totalDue, setTotalDue] = useState(0);

  useEffect(() => {
    if (session?.userName) {
      loadUserData();
    }
  }, [session?.userName]);

  const loadUserData = () => {
    if (!session?.userName) return;

    const accounts = safeGetItem<Record<string, { bill: number; cost: number }>>('accounts', {}) || {};
    const acc = accounts[session.userName] || { bill: 0, cost: 0 };
    
    setTotalWork(acc.bill);
    setTotalCost(acc.cost);
    setTotalDue(acc.bill - acc.cost);
  };

  const handleLogout = () => {
    logout();
    setShowLogoutDialog(false);
  };

  if (viewMode === 'production') {
    return <ProductionHistoryView onBack={() => setViewMode('dashboard')} />;
  }

  if (viewMode === 'work') {
    return <WorkHistoryView onBack={() => setViewMode('dashboard')} />;
  }

  if (viewMode === 'payment') {
    return <PaymentHistoryView onBack={() => setViewMode('dashboard')} />;
  }

  if (viewMode === 'profile') {
    return <ProfileSettingsView onBack={() => setViewMode('dashboard')} />;
  }

  if (viewMode === 'support') {
    return <SupportView onBack={() => setViewMode('dashboard')} />;
  }

  return (
    <>
      <DashboardFrame>
        <div className="flex flex-col h-full">
          {/* Fixed Header */}
          <div className="fixed top-0 left-0 right-0 z-20 bg-gradient-to-r from-purple-500 via-pink-400 to-orange-400 px-3 py-4 flex items-center justify-between shadow-xl">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center overflow-hidden border-2 border-white shadow-lg">
                <img
                  src="/assets/generated/worker-avatar-placeholder.dim_512x512.png"
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-white">{session?.userName || 'User'}</h1>
                  <span className="px-2 py-0.5 bg-white/30 backdrop-blur-sm rounded-full text-[10px] font-bold text-white border border-white/50">
                    v14
                  </span>
                </div>
                <p className="text-xs text-white/90">User Dashboard</p>
              </div>
            </div>
            <button
              onClick={() => setShowLogoutDialog(true)}
              className="flex-shrink-0 px-3 py-2 rounded-xl bg-white/20 backdrop-blur-sm border-2 border-white/40 shadow-xl flex items-center gap-2 hover:bg-white/30 transition-all"
            >
              <LogOut className="w-5 h-5 text-white" />
              <span className="text-white font-bold text-xs">Log out</span>
            </button>
          </div>

          {/* Sticky KPI Cards with top padding for fixed header */}
          <div className="sticky top-[88px] z-10 bg-white px-3 py-3 shadow-lg mt-[88px]">
            <UserKpiSummary totalDue={totalDue} totalWork={totalWork} totalCost={totalCost} />
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 px-3 py-4 overflow-y-auto pb-32">
            {/* Action Grid */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setViewMode('production')}
                className="bg-gradient-to-br from-green-600 to-green-700 rounded-3xl p-6 shadow-xl border-2 border-gray-700 hover:scale-105 transition-transform active:scale-95"
              >
                <div className="flex flex-col items-center gap-3">
                  <img
                    src="/assets/generated/icon-production.dim_256x256.png"
                    alt="প্রোডাকশন"
                    className="w-16 h-16"
                  />
                  <p className="text-white text-base font-bold">প্রোডাকশন</p>
                </div>
              </button>

              <button
                onClick={() => setViewMode('work')}
                className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-6 shadow-xl border-2 border-gray-700 hover:scale-105 transition-transform active:scale-95"
              >
                <div className="flex flex-col items-center gap-3">
                  <img
                    src="/assets/generated/icon-work.dim_256x256.png"
                    alt="কাজ"
                    className="w-16 h-16"
                  />
                  <p className="text-white text-base font-bold">কাজ</p>
                </div>
              </button>

              <button
                onClick={() => setViewMode('payment')}
                className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-6 shadow-xl border-2 border-gray-700 hover:scale-105 transition-transform active:scale-95"
              >
                <div className="flex flex-col items-center gap-3">
                  <img
                    src="/assets/generated/icon-payment-loan.dim_256x256.png"
                    alt="পেমেন্ট"
                    className="w-16 h-16"
                  />
                  <p className="text-white text-base font-bold">পেমেন্ট</p>
                </div>
              </button>

              <button
                onClick={() => setViewMode('profile')}
                className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-3xl p-6 shadow-xl border-2 border-gray-700 hover:scale-105 transition-transform active:scale-95"
              >
                <div className="flex flex-col items-center gap-3">
                  <img
                    src="/assets/generated/icon-settings.dim_256x256.png"
                    alt="প্রোফাইল সেটিংস"
                    className="w-16 h-16"
                  />
                  <p className="text-white text-base font-bold">প্রোফাইল সেটিংস</p>
                </div>
              </button>
            </div>
          </div>

          {/* Fixed Footer */}
          <div className="fixed bottom-0 left-0 right-0 z-20">
            <DashboardFooter onSupportClick={() => setViewMode('support')} />
          </div>
        </div>
      </DashboardFrame>

      <ConfirmDialog
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
        title="লগআউট নিশ্চিত করুন"
        description="আপনি কি নিশ্চিত যে আপনি লগআউট করতে চান?"
        onConfirm={handleLogout}
        confirmText="হ্যাঁ, লগআউট করুন"
        cancelText="না, থাকুন"
        variant="default"
      />
    </>
  );
}
