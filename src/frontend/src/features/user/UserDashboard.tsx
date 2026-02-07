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
import { Button } from '../../components/ui/button';
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
import { useDashboardOverrides } from '../../hooks/useDashboardOverrides';

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
  const { getLabel } = useDashboardOverrides();

  useEffect(() => {
    if (session?.userName) {
      loadAccountData();
      loadProfilePhoto();
    }
  }, [session?.userName]);

  const loadAccountData = () => {
    const accounts = safeGetItem<Record<string, { bill: number; cost: number }>>('accounts', {}) || {};
    const account = accounts[session?.userName || ''];
    if (account) {
      setTotalWork(account.bill || 0);
      setTotalCost(account.cost || 0);
      setTotalDue((account.bill || 0) - (account.cost || 0));
    }
  };

  const loadProfilePhoto = () => {
    if (session?.userName) {
      const photo = getProfilePhoto(session.userName);
      setProfilePhoto(photo);
    }
  };

  const handleLogout = () => {
    logout();
    setShowLogoutDialog(false);
  };

  if (viewMode === 'production') {
    return (
      <DashboardFrame>
        <div className="flex flex-col h-full">
          <ProductionHistoryView onBack={() => setViewMode('dashboard')} />
        </div>
      </DashboardFrame>
    );
  }

  if (viewMode === 'work') {
    return (
      <DashboardFrame>
        <div className="flex flex-col h-full">
          <WorkHistoryView onBack={() => setViewMode('dashboard')} />
        </div>
      </DashboardFrame>
    );
  }

  if (viewMode === 'payment') {
    return (
      <DashboardFrame>
        <div className="flex flex-col h-full">
          <PaymentHistoryView onBack={() => setViewMode('dashboard')} />
        </div>
      </DashboardFrame>
    );
  }

  if (viewMode === 'nasta') {
    return (
      <DashboardFrame>
        <div className="flex flex-col h-full">
          <NastaHistoryView onBack={() => setViewMode('dashboard')} />
        </div>
      </DashboardFrame>
    );
  }

  if (viewMode === 'profile') {
    return (
      <DashboardFrame>
        <div className="flex flex-col h-full">
          <ProfileSettingsView onBack={() => setViewMode('dashboard')} />
        </div>
      </DashboardFrame>
    );
  }

  if (viewMode === 'support') {
    return (
      <DashboardFrame>
        <div className="flex flex-col h-full">
          <SupportView onBack={() => setViewMode('dashboard')} />
        </div>
      </DashboardFrame>
    );
  }

  return (
    <DashboardFrame>
      <div className="flex flex-col h-full border-l-2 border-r-2 border-black/10">
        {/* Header - reduced padding */}
        <div className="flex-shrink-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {profilePhoto ? (
                <img src={profilePhoto} alt="Profile" className="w-10 h-10 rounded-full border-2 border-white object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-lg font-bold">
                  {session?.userName?.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <div className="text-lg font-bold">{session?.userName}</div>
              </div>
            </div>
            <Button
              onClick={() => setShowLogoutDialog(true)}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              লগআউট
            </Button>
          </div>
        </div>

        {/* Notice Bar - sticky and reduced height */}
        {noticeConfig.enabled && noticeConfig.text && (
          <div className="flex-shrink-0 sticky top-0 z-10 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-1.5 text-center text-sm font-medium">
            {noticeConfig.text}
          </div>
        )}

        {/* Scrollable Content - reduced gaps */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
          <div className="p-3 space-y-2">
            {/* Clock Card - reduced spacing */}
            <ClockCard />

            {/* KPI Summary - reduced spacing */}
            <div className={`${kpiGroupBorder} ${kpiGroupPadding} ${kpiGroupRadius} ${kpiGroupShadow} ${kpiGroupBg}`}>
              <UserKpiSummary totalDue={totalDue} totalWork={totalWork} totalCost={totalCost} />
            </div>

            {/* Action Tiles - 2x2 grid */}
            <div className={`space-y-2 ${lowerSectionBorder} ${lowerSectionPadding} ${lowerSectionRadius} ${lowerSectionShadow} ${lowerSectionBg}`}>
              {/* Row 1: Production + Work */}
              <div className="grid grid-cols-2 gap-2">
                <ActionTile
                  label={getLabel('userProductionLabel', 'প্রোডাকশন')}
                  icon="/assets/generated/icon-production.dim_256x256.png"
                  onClick={() => setViewMode('production')}
                  bgGradient="from-emerald-500 to-teal-600"
                  size="user"
                />
                <ActionTile
                  label={getLabel('userWorkLabel', 'কাজ')}
                  icon="/assets/generated/icon-work.dim_256x256.png"
                  onClick={() => setViewMode('work')}
                  bgGradient="from-cyan-500 to-blue-600"
                  size="user"
                />
              </div>

              {/* Row 2: Payment + Nasta */}
              <div className="grid grid-cols-2 gap-2">
                <ActionTile
                  label={getLabel('userPaymentLabel', 'পেমেন্ট/লোন')}
                  icon="/assets/generated/icon-payment-loan.dim_256x256.png"
                  onClick={() => setViewMode('payment')}
                  bgGradient="from-rose-500 to-pink-600"
                  size="user"
                />
                <ActionTile
                  label={getLabel('userNastaLabel', 'নাস্তা')}
                  icon="/assets/generated/icon-nasta.dim_256x256.png"
                  onClick={() => setViewMode('nasta')}
                  bgGradient="from-amber-500 to-orange-600"
                  size="user"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <DashboardFooter
          onSupportClick={() => setViewMode('support')}
          onSettingsClick={() => setViewMode('profile')}
        />

        {/* Logout Confirmation Dialog */}
        <ConfirmDialog
          open={showLogoutDialog}
          onOpenChange={setShowLogoutDialog}
          onConfirm={handleLogout}
          title="লগআউট নিশ্চিত করুন"
          description="আপনি কি নিশ্চিত যে আপনি লগআউট করতে চান?"
          confirmText="হ্যাঁ, লগআউট করুন"
          cancelText="বাতিল"
        />
      </div>
    </DashboardFrame>
  );
}
