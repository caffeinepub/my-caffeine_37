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

  if (viewMode !== 'dashboard') {
    return (
      <DashboardFrame>
        <PopupModal isOpen={true} onClose={() => setViewMode('dashboard')}>
          {renderModalContent()}
        </PopupModal>
      </DashboardFrame>
    );
  }

  return (
    <>
      <DashboardFrame>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="dashboard-gradient px-3 py-2 shadow-lg flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {profilePhoto ? (
                  <img src={profilePhoto} alt="Profile" className="w-10 h-10 rounded-full border-2 border-white object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-white/20 border-2 border-white flex items-center justify-center">
                    <span className="text-white font-bold text-base">{session?.userName?.charAt(0).toUpperCase()}</span>
                  </div>
                )}
                <div className="flex flex-col">
                  <div className="text-white text-xs font-medium leading-tight">
                    Username: <span className="font-bold">{session?.userName}</span>
                  </div>
                  <div className="text-white text-xs font-medium leading-tight">
                    Id no: <span className="font-bold">{session?.userId}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowLogoutDialog(true)}
                className="bg-white/90 hover:bg-white p-1.5 rounded-lg shadow-md hover:shadow-lg transition-all active:scale-95 touch-manipulation"
              >
                <LogOut className="w-4 h-4 text-red-600" />
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto pb-16">
            <div className="p-2 space-y-2">
              {/* Notice */}
              {noticeConfig.enabled && noticeConfig.text && (
                <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg px-2 py-1.5 marquee-container">
                  <div className="marquee-content">
                    <p className="text-yellow-900 font-semibold text-xs">{noticeConfig.text}</p>
                  </div>
                </div>
              )}

              {/* Clock */}
              <ClockCard />

              {/* KPI Summary */}
              <div className={`${kpiGroupBg} ${kpiGroupRadius} ${kpiGroupPadding} ${kpiGroupShadow} ${kpiGroupBorder}`}>
                <UserKpiSummary totalDue={totalDue} totalWork={totalWork} totalCost={totalCost} />
              </div>

              {/* Action Tiles */}
              <div className={`${lowerSectionBg} ${lowerSectionRadius} ${lowerSectionPadding} ${lowerSectionShadow} ${lowerSectionBorder}`}>
                <div className="grid grid-cols-2 gap-2">
                  <ActionTile
                    icon="/assets/generated/icon-production.dim_256x256.png"
                    label="Production"
                    onClick={() => setViewMode('production')}
                    bgGradient="from-emerald-500 to-teal-600"
                    size="small"
                  />
                  <ActionTile
                    icon="/assets/generated/icon-nasta.dim_256x256.png"
                    label="Snacks"
                    onClick={() => setViewMode('nasta')}
                    bgGradient="from-amber-500 to-orange-600"
                    size="small"
                  />
                  <ActionTile
                    icon="/assets/generated/icon-payment-loan.dim_256x256.png"
                    label="Payment/Loan"
                    onClick={() => setViewMode('payment')}
                    bgGradient="from-rose-500 to-pink-600"
                    size="small"
                  />
                  <ActionTile
                    icon="/assets/generated/icon-work.dim_256x256.png"
                    label="Work"
                    onClick={() => setViewMode('work')}
                    bgGradient="from-cyan-500 to-blue-600"
                    size="small"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Fixed Footer */}
          <div className="flex-shrink-0">
            <DashboardFooter
              onSupportClick={() => setViewMode('support')}
              onSettingsClick={() => setViewMode('profile')}
            />
          </div>
        </div>
      </DashboardFrame>

      <ConfirmDialog
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
        title="Logout"
        description="Are you sure you want to logout?"
        onConfirm={handleLogout}
        confirmText="Yes, logout"
        cancelText="Cancel"
      />
    </>
  );
}
