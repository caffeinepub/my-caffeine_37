import { useState } from 'react';
import AdminLayoutShell from './components/AdminLayoutShell';
import { AdminView } from './components/adminNavTypes';
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
import AdminSummaryCards from './components/AdminSummaryCards';
import AdminGridMenu from './components/AdminGridMenu';
import MtLoanPasswordPrompt from '../mt-loan/MtLoanPasswordPrompt';

export default function AdminPanel() {
  const [currentView, setCurrentView] = useState<AdminView>('dashboard');
  const [showMtLoanPrompt, setShowMtLoanPrompt] = useState(false);

  const handleMtLoanClick = () => {
    setShowMtLoanPrompt(true);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <div className="space-y-3">
            <div className="mb-2">
              <h2 className="text-base font-bold text-gray-800 px-1">
                টাকার সারসংক্ষেপ
              </h2>
            </div>
            <AdminSummaryCards />

            <div className="mb-2 mt-3">
              <h2 className="text-base font-bold text-gray-800 px-1">
                এডমিন প্যানেল সেকশন
              </h2>
            </div>
            <AdminGridMenu onNavigate={setCurrentView} />

            <div className="mt-4 pt-4 border-t-2 border-gray-200">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleMtLoanClick}
                  className="py-3 px-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-xl shadow-lg transition-all touch-manipulation"
                >
                  MT-LOAN
                </button>
                <button
                  onClick={() => setCurrentView('support')}
                  className="py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-xl shadow-lg transition-all touch-manipulation"
                >
                  সাপোর্ট
                </button>
              </div>
            </div>
          </div>
        );
      case 'production':
        return <ProductionSection />;
      case 'work':
        return <WorkSection />;
      case 'nasta':
        return <NastaSection />;
      case 'payment':
        return <PaymentLoanSection />;
      case 'user-requests':
        return <UserRequestsSection />;
      case 'settings':
        return <SystemSettingsSection />;
      case 'worker-rate-settings':
        return <WorkerRateSettingsSection />;
      case 'final-balance':
        return <FinalBalanceSection />;
      case 'company-report':
        return <CompanyReportSection />;
      case 'support':
        return <SupportView onBack={() => setCurrentView('dashboard')} />;
      default:
        return <div>Unknown view</div>;
    }
  };

  return (
    <>
      <AdminLayoutShell
        currentView={currentView}
        onNavigate={setCurrentView}
        onMtLoanClick={handleMtLoanClick}
      >
        {renderContent()}
      </AdminLayoutShell>

      <MtLoanPasswordPrompt
        open={showMtLoanPrompt}
        onOpenChange={setShowMtLoanPrompt}
      />
    </>
  );
}
