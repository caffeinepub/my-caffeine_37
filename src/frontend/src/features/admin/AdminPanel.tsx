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
import { LogOut } from 'lucide-react';

export default function AdminPanel() {
  const [activeView, setActiveView] = useState<AdminView>('dashboard');
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const { logout } = useSession();

  const handleLogoutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowLogoutDialog(true);
  };

  const handleLogoutConfirm = () => {
    logout();
    setShowLogoutDialog(false);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <DashboardFrame>
            <div className="flex flex-col h-full">
              {/* Fixed Header */}
              <div className="fixed top-0 left-0 right-0 z-20 bg-gradient-to-r from-blue-600 via-teal-500 to-purple-600 px-3 py-4 flex items-center justify-between shadow-xl">
                <div className="flex-1 text-center">
                  <h1 className="text-2xl font-black text-white tracking-wide drop-shadow-lg" style={{ fontFamily: 'Impact, sans-serif' }}>
                    ADMIN
                  </h1>
                </div>
                <button
                  type="button"
                  onClick={handleLogoutClick}
                  className="flex-shrink-0 px-4 py-2 rounded-full bg-red-600 border-2 border-white shadow-xl flex items-center gap-2 hover:bg-red-700 transition-all active:scale-95 touch-manipulation"
                >
                  <LogOut className="w-5 h-5 text-white" />
                  <span className="text-white font-bold text-sm">LOGOUT</span>
                </button>
              </div>

              {/* Sticky Circular Summary Cards with top padding for fixed header */}
              <div className="sticky top-[72px] z-10 bg-gradient-to-br from-gray-100 to-gray-200 px-3 py-4 shadow-lg mt-[72px]">
                <AdminSummaryCards />
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 px-3 py-4 overflow-y-auto pb-32 bg-gradient-to-br from-gray-50 to-white">
                <AdminGridMenu onNavigate={setActiveView} />
              </div>

              {/* Fixed Footer */}
              <div className="fixed bottom-0 left-0 right-0 z-20">
                <DashboardFooter onSupportClick={() => setActiveView('support')} />
              </div>
            </div>
          </DashboardFrame>
        );
      case 'production':
        return (
          <AdminLayoutShell title="প্রোডাকশন ম্যানেজমেন্ট" onBack={() => setActiveView('dashboard')}>
            <ProductionSection />
          </AdminLayoutShell>
        );
      case 'work':
        return (
          <AdminLayoutShell title="কাজের ম্যানেজমেন্ট" onBack={() => setActiveView('dashboard')}>
            <WorkSection />
          </AdminLayoutShell>
        );
      case 'nasta':
        return (
          <AdminLayoutShell title="নাস্তা ম্যানেজমেন্ট" onBack={() => setActiveView('dashboard')}>
            <NastaSection />
          </AdminLayoutShell>
        );
      case 'payment':
        return (
          <AdminLayoutShell title="পেমেন্ট ও লোন ম্যানেজমেন্ট" onBack={() => setActiveView('dashboard')}>
            <PaymentLoanSection />
          </AdminLayoutShell>
        );
      case 'user-requests':
        return (
          <AdminLayoutShell title="ইউজার রিকুয়েস্ট" onBack={() => setActiveView('dashboard')}>
            <UserRequestsSection />
          </AdminLayoutShell>
        );
      case 'settings':
        return (
          <AdminLayoutShell title="সিস্টেম সেটিংস" onBack={() => setActiveView('dashboard')}>
            <SystemSettingsSection />
          </AdminLayoutShell>
        );
      case 'worker-rate-settings':
        return (
          <AdminLayoutShell title="কর্মী ও রেট সেটিংস" onBack={() => setActiveView('dashboard')}>
            <WorkerRateSettingsSection />
          </AdminLayoutShell>
        );
      case 'final-balance':
        return (
          <AdminLayoutShell title="চূড়ান্ত ব্যালেন্স" onBack={() => setActiveView('dashboard')}>
            <FinalBalanceSection />
          </AdminLayoutShell>
        );
      case 'company-report':
        return (
          <AdminLayoutShell title="কোম্পানি রিপোর্ট" onBack={() => setActiveView('dashboard')}>
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
