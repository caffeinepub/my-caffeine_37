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
import { LogOut, Camera } from 'lucide-react';
import UserKpiSummary from './components/UserKpiSummary';
import ClockCard from './components/ClockCard';
import ActionTile from '../../components/dashboard/ActionTile';

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
          {/* Fixed Header - Unified clean style */}
          <div className="fixed top-0 left-0 right-0 z-20 bg-white px-3 py-4 flex items-center justify-between shadow-md border-b-2 border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-gray-300 shadow-sm">
                <img
                  src="/assets/generated/worker-avatar-placeholder.dim_512x512.png"
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">{session?.userName || 'User'}</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-full bg-gray-100 border-2 border-gray-300 shadow-sm hover:bg-gray-200 transition-all">
                <Camera className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={() => setShowLogoutDialog(true)}
                className="px-4 py-2 rounded-full bg-red-600 border-2 border-red-700 shadow-md flex items-center gap-2 hover:bg-red-700 transition-all"
              >
                <span className="text-white font-bold text-sm">LOGOUT</span>
              </button>
            </div>
          </div>

          {/* Scrollable Content with top padding for fixed header */}
          <div className="flex-1 overflow-y-auto pt-[88px] pb-24 px-3 bg-gray-100">
            {/* Clock Card - Only on User Dashboard */}
            <div className="mt-3 mb-3">
              <ClockCard />
            </div>

            {/* KPI Summary - Now wrapped in bordered container */}
            <div className="mb-4">
              <UserKpiSummary totalDue={totalDue} totalWork={totalWork} totalCost={totalCost} />
            </div>

            {/* Action Grid - 3 tiles in first row, 1 tile in second row */}
            <div className="border-4 border-gray-900 rounded-3xl p-4 bg-white shadow-2xl">
              <div className="space-y-3">
                {/* First row: 3 tiles */}
                <div className="grid grid-cols-3 gap-3">
                  <ActionTile
                    icon="/assets/generated/icon-production.dim_256x256.png"
                    label="প্রোডাকশন"
                    onClick={() => setViewMode('production')}
                    bgGradient="from-green-600 to-green-700"
                    size="small"
                  />
                  <ActionTile
                    icon="/assets/generated/icon-work.dim_256x256.png"
                    label="কাজ"
                    onClick={() => setViewMode('work')}
                    bgGradient="from-pink-600 to-pink-700"
                    size="small"
                  />
                  <ActionTile
                    icon="/assets/generated/icon-nasta.dim_256x256.png"
                    label="নাস্তা"
                    onClick={() => setViewMode('payment')}
                    bgGradient="from-slate-600 to-slate-700"
                    size="small"
                  />
                </div>

                {/* Second row: 1 tile aligned left */}
                <div className="grid grid-cols-3 gap-3">
                  <ActionTile
                    icon="/assets/generated/icon-payment-loan.dim_256x256.png"
                    label="পেমেন্ট/লোন"
                    onClick={() => setViewMode('payment')}
                    bgGradient="from-blue-700 to-blue-800"
                    size="small"
                  />
                </div>
              </div>
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
