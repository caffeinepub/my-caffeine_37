import { useState } from 'react';
import DashboardFrame from '../../components/layout/DashboardFrame';
import DashboardFooter from '../../components/layout/DashboardFooter';
import AdminSummaryCards from './components/AdminSummaryCards';
import AdminGridMenu from './components/AdminGridMenu';
import AdminLayoutShell from './components/AdminLayoutShell';
import ProductionSection from './sections/ProductionSection';
import WorkSection from './sections/WorkSection';
import NastaSection from './sections/NastaSection';
import PaymentLoanSection from './sections/PaymentLoanSection';
import UserRequestsSection from './sections/UserRequestsSection';
import SystemSettingsSection from './sections/SystemSettingsSection';
import WorkerRateSettingsSection from './sections/WorkerRateSettingsSection';
import FinalBalanceSection from './sections/FinalBalanceSection';
import CompanyReportSection from './sections/CompanyReportSection';
import SupportView from '../support/SupportView';
import { AdminView } from './components/adminNavTypes';
import { useSession } from '../../state/session/useSession';
import { ConfirmDialog } from '../../components/feedback/ConfirmDialog';
import { LogOut, DollarSign, Calculator, MessageCircle } from 'lucide-react';
import { useBranding } from '../../hooks/useBranding';
import { notify } from '../../components/feedback/notify';
import { getLabelText } from '../../lib/storage/labelSettingsStorage';

export default function AdminPanel() {
  const [activeView, setActiveView] = useState<AdminView>('dashboard');
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const { logout } = useSession();
  const { branding } = useBranding();

  const handleLogoutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowLogoutDialog(true);
  };

  const handleLogoutConfirm = () => {
    logout();
    setShowLogoutDialog(false);
  };

  const handleMTLoanClick = () => {
    notify.info('MT-LOAN ফিচার শীঘ্রই আসছে');
  };

  const handleCalculatorClick = () => {
    notify.info('ক্যালকুলেটর শীঘ্রই আসছে');
  };

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <DashboardFrame>
            <div className="flex flex-col h-full">
              {/* Fixed Header - Version 45 style */}
              <div className="fixed top-0 left-0 right-0 z-20 dashboard-gradient px-4 py-3 flex items-center justify-between shadow-lg border-b-2 border-blue-900 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  {branding.logoDataUrl && (
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/30">
                      <img
                        src={branding.logoDataUrl}
                        alt="Logo"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <h1 className="text-xl font-bold section-title-accent tracking-wide">
                    ADMIN PANEL
                  </h1>
                </div>
                <button
                  type="button"
                  onClick={handleLogoutClick}
                  className="flex-shrink-0 px-4 py-2 rounded-full bg-red-600 border-2 border-red-700 shadow-md flex items-center gap-2 hover:bg-red-700 transition-all active:scale-95 touch-manipulation"
                >
                  <LogOut className="w-4 h-4 text-white" />
                  <span className="text-white font-bold text-sm">LOGOUT</span>
                </button>
              </div>

              {/* Scrollable Content with professional background */}
              <div className="flex-1 overflow-y-auto pt-[64px] pb-[88px] px-2 dashboard-professional-bg">
                {/* Summary Cards - Compact spacing */}
                <div className="mt-2 mb-2">
                  <AdminSummaryCards />
                </div>

                {/* Grid Menu - Compact spacing */}
                <div className="mb-2">
                  <AdminGridMenu onNavigate={setActiveView} />
                </div>
              </div>

              {/* Fixed Footer */}
              <div className="fixed bottom-0 left-0 right-0 z-20">
                <DashboardFooter 
                  leftAction={{
                    label: 'MT-LOAN',
                    onClick: handleMTLoanClick,
                    icon: DollarSign,
                  }}
                  centerAction={{
                    label: 'সাপোর্ট / চ্যাট',
                    onClick: () => setActiveView('support'),
                    icon: MessageCircle,
                  }}
                  rightAction={{
                    label: 'ক্যালকুলেটর',
                    onClick: handleCalculatorClick,
                    icon: Calculator,
                  }}
                />
              </div>
            </div>
          </DashboardFrame>
        );
      case 'production':
        return (
          <AdminLayoutShell 
            title={getLabelText('productionSection') || 'প্রোডাকশন ম্যানেজমেন্ট'} 
            onBack={() => setActiveView('dashboard')}
            onLeftButtonClick={handleMTLoanClick}
            onRightButtonClick={handleCalculatorClick}
          >
            <ProductionSection />
          </AdminLayoutShell>
        );
      case 'work':
        return (
          <AdminLayoutShell 
            title={getLabelText('workSection') || 'কাজের ম্যানেজমেন্ট'} 
            onBack={() => setActiveView('dashboard')}
            onLeftButtonClick={handleMTLoanClick}
            onRightButtonClick={handleCalculatorClick}
          >
            <WorkSection />
          </AdminLayoutShell>
        );
      case 'nasta':
        return (
          <AdminLayoutShell 
            title={getLabelText('nastaSection') || 'নাস্তা ম্যানেজমেন্ট'} 
            onBack={() => setActiveView('dashboard')}
            onLeftButtonClick={handleMTLoanClick}
            onRightButtonClick={handleCalculatorClick}
          >
            <NastaSection />
          </AdminLayoutShell>
        );
      case 'payment':
        return (
          <AdminLayoutShell 
            title={getLabelText('paymentSection') || 'পেমেন্ট ও লোন ম্যানেজমেন্ট'} 
            onBack={() => setActiveView('dashboard')}
            onLeftButtonClick={handleMTLoanClick}
            onRightButtonClick={handleCalculatorClick}
          >
            <PaymentLoanSection />
          </AdminLayoutShell>
        );
      case 'user-requests':
        return (
          <AdminLayoutShell 
            title={getLabelText('userRequestsSection') || 'ইউজার রিকুয়েস্ট'} 
            onBack={() => setActiveView('dashboard')}
            onLeftButtonClick={handleMTLoanClick}
            onRightButtonClick={handleCalculatorClick}
          >
            <UserRequestsSection />
          </AdminLayoutShell>
        );
      case 'settings':
        return (
          <AdminLayoutShell 
            title={getLabelText('settingsSection') || 'সিস্টেম সেটিংস'} 
            onBack={() => setActiveView('dashboard')}
            onLeftButtonClick={handleMTLoanClick}
            onRightButtonClick={handleCalculatorClick}
          >
            <SystemSettingsSection />
          </AdminLayoutShell>
        );
      case 'worker-rate-settings':
        return (
          <AdminLayoutShell 
            title={getLabelText('workerRateSection') || 'কর্মী ও রেট সেটিংস'} 
            onBack={() => setActiveView('dashboard')}
            onLeftButtonClick={handleMTLoanClick}
            onRightButtonClick={handleCalculatorClick}
          >
            <WorkerRateSettingsSection />
          </AdminLayoutShell>
        );
      case 'final-balance':
        return (
          <AdminLayoutShell 
            title={getLabelText('finalBalanceSection') || 'চূড়ান্ত ব্যালেন্স'} 
            onBack={() => setActiveView('dashboard')}
            onLeftButtonClick={handleMTLoanClick}
            onRightButtonClick={handleCalculatorClick}
          >
            <FinalBalanceSection />
          </AdminLayoutShell>
        );
      case 'company-report':
        return (
          <AdminLayoutShell 
            title={getLabelText('companyReportSection') || 'কোম্পানি রিপোর্ট'} 
            onBack={() => setActiveView('dashboard')}
            onLeftButtonClick={handleMTLoanClick}
            onRightButtonClick={handleCalculatorClick}
          >
            <CompanyReportSection />
          </AdminLayoutShell>
        );
      case 'support':
        return <SupportView onBack={() => setActiveView('dashboard')} />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="min-h-screen">{renderContent()}</div>
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
