import { useState, useEffect } from 'react';
import { useSession } from '../../state/session/useSession';
import { safeGetItem } from '../../lib/storage/safeStorage';
import ProductionHistoryView from './production/ProductionHistoryView';
import WorkHistoryView from './work/WorkHistoryView';
import PaymentHistoryView from './payment/PaymentHistoryView';
import NastaHistoryView from './payment/NastaHistoryView';
import ProfileSettingsView from './profile/ProfileSettingsView';
import SupportView from '../support/SupportView';
import DashboardFrame from '../../components/layout/DashboardFrame';
import DashboardFooter from '../../components/layout/DashboardFooter';
import PopupModal from '../../components/layout/PopupModal';
import { ConfirmDialog } from '../../components/feedback/ConfirmDialog';
import { LogOut } from 'lucide-react';
import UserKpiSummary from './components/UserKpiSummary';
import ClockCard from './components/ClockCard';
import ActionTile from '../../components/dashboard/ActionTile';
import {
  lowerSectionBorder,
  lowerSectionPadding,
  lowerSectionRadius,
  lowerSectionShadow,
  lowerSectionBg,
  kpiGroupBorder,
  kpiGroupPadding,
  kpiGroupRadius,
  kpiGroupShadow,
  kpiGroupBg,
} from '../../components/dashboard/dashboardBorders';
import { getProfilePhoto } from '../../lib/storage/userProfileStorage';
import { useUserNotice } from '../../hooks/useUserNotice';

type ViewMode = 'dashboard' | 'production' | 'work' | 'payment' | 'nasta' | 'profile' | 'support';

export default function UserDashboard() {
  const { session, logout } = useSession();
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [totalWork, setTotalWork] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [totalDue, setTotalDue] = useState(0);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const noticeConfig = useUserNotice();

  useEffect(() => {
    if (session?.userName) {
      loadUserData();
      const photo = getProfilePhoto(session.userName);
      setProfilePhoto(photo);
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

  const renderModalContent = () => {
    switch (viewMode) {
      case 'production':
        return <ProductionHistoryView onBack={() => setViewMode('dashboard')} />;
      case 'work':
        return <WorkHistoryView onBack={() => setViewMode('dashboard')} />;
      case 'payment':
        return <PaymentHistoryView onBack={() => setViewMode('dashboard')} />;
      case 'nasta':
        return <NastaHistoryView />;
      case 'profile':
        return <ProfileSettingsView onBack={() => setViewMode('dashboard')} />;
      case 'support':
        return <SupportView onBack={() => setViewMode('dashboard')} />;
      default:
        return null;
    }
  };

  if (viewMode === 'profile' || viewMode === 'support') {
    return renderModalContent();
  }

  return (
    <>
      <DashboardFrame>
        <div className="flex flex-col h-full">
          {/* Fixed Header - Dashboard gradient with prominent username */}
          <div className="dashboard-gradient px-3 py-3 flex items-center justify-between shadow-md border-b-2 border-blue-900">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/50 shadow-md flex-shrink-0">
                {profilePhoto ? (
                  <img
                    src={profilePhoto}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-teal-400 to-cyan-500" />
                )}
              </div>
              <div className="flex flex-col items-center min-w-0 flex-1">
                <h1 className="text-2xl font-black text-white tracking-wide leading-tight truncate" style={{ fontFamily: 'Impact, sans-serif' }}>
                  {session?.userName || 'User'}
                </h1>
                <span className="text-white/90 text-xs font-medium">ID: {session?.userId || 'N/A'}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowLogoutDialog(true)}
              className="flex-shrink-0 px-2.5 py-1.5 rounded-full bg-red-600 border-2 border-red-700 shadow-md flex items-center gap-1 hover:bg-red-700 transition-all active:scale-95 touch-manipulation"
            >
              <LogOut className="w-3.5 h-3.5 text-white" />
              <span className="text-white font-bold text-[10px]">LOGOUT</span>
            </button>
          </div>

          {/* Scrollable Content with professional background */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden pb-[72px] px-2 dashboard-professional-bg">
            {/* Notice Marquee */}
            {noticeConfig.enabled && noticeConfig.text && (
              <div className="mt-2 mb-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-1.5 px-3 rounded-lg shadow-md overflow-hidden">
                <div className="marquee-container">
                  <div className="marquee-content">
                    <span className="font-bold text-xs">{noticeConfig.text}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Clock Card - Reduced size */}
            <div className="mt-2 mb-2">
              <ClockCard />
            </div>

            {/* KPI Summary - Wrapped in bordered container */}
            <div className={`mb-2 ${kpiGroupBorder} ${kpiGroupPadding} ${kpiGroupRadius} ${kpiGroupShadow} ${kpiGroupBg}`}>
              <UserKpiSummary totalWork={totalWork} totalCost={totalCost} totalDue={totalDue} />
            </div>

            {/* Action Tiles - Wrapped in bordered container with reduced size */}
            <div className={`${lowerSectionBorder} ${lowerSectionPadding} ${lowerSectionRadius} ${lowerSectionShadow} ${lowerSectionBg}`}>
              <div className="grid grid-cols-2 gap-2 w-full">
                <ActionTile
                  label="প্রোডাকশন"
                  icon="/assets/generated/icon-production.dim_256x256.png"
                  onClick={() => setViewMode('production')}
                  bgGradient="from-emerald-500 to-teal-600"
                  size="small"
                />
                <ActionTile
                  label="কাজ"
                  icon="/assets/generated/icon-work.dim_256x256.png"
                  onClick={() => setViewMode('work')}
                  bgGradient="from-cyan-500 to-blue-600"
                  size="small"
                />
                <ActionTile
                  label="নাস্তা"
                  icon="/assets/generated/icon-nasta.dim_256x256.png"
                  onClick={() => setViewMode('nasta')}
                  bgGradient="from-amber-500 to-orange-600"
                  size="small"
                />
                <ActionTile
                  label="পেমেন্ট/লোন"
                  icon="/assets/generated/icon-payment-loan.dim_256x256.png"
                  onClick={() => setViewMode('payment')}
                  bgGradient="from-rose-500 to-pink-600"
                  size="small"
                />
              </div>
            </div>
          </div>

          {/* Fixed Footer */}
          <div className="fixed bottom-0 left-0 right-0 z-20">
            <DashboardFooter 
              onSupportClick={() => setViewMode('support')} 
              onSettingsClick={() => setViewMode('profile')}
            />
          </div>
        </div>
      </DashboardFrame>

      {/* Popup Modal for History Views */}
      <PopupModal
        isOpen={viewMode === 'production' || viewMode === 'work' || viewMode === 'payment' || viewMode === 'nasta'}
        onClose={() => setViewMode('dashboard')}
      >
        {renderModalContent()}
      </PopupModal>

      {/* Logout Confirmation Dialog */}
      <ConfirmDialog
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
        title="Confirm Logout"
        description="Are you sure you want to log out?"
        onConfirm={handleLogout}
        confirmText="Yes, Log out"
        cancelText="Cancel"
        variant="default"
      />
    </>
  );
}
