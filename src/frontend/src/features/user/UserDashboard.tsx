import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { useSession } from '../../state/session/useSession';
import { safeGetItem } from '../../lib/storage/safeStorage';
import { useDashboardOverrides } from '../../hooks/useDashboardOverrides';
import { useUserNotice } from '../../hooks/useUserNotice';
import { useBranding } from '../../hooks/useBranding';
import ProductionHistoryView from './production/ProductionHistoryView';
import WorkHistoryView from './work/WorkHistoryView';
import PaymentHistoryView from './payment/PaymentHistoryView';
import NastaHistoryView from './payment/NastaHistoryView';
import ProfileSettingsView from './profile/ProfileSettingsView';
import UserKpiSummary from './components/UserKpiSummary';
import ClockCard from './components/ClockCard';
import ActionTile from '../../components/dashboard/ActionTile';
import DashboardFooter from '../../components/layout/DashboardFooter';
import { 
  Package, 
  Briefcase, 
  DollarSign, 
  Coffee, 
  Settings,
  Home,
  MessageCircle
} from 'lucide-react';

type ViewMode = 'dashboard' | 'production' | 'work' | 'payment' | 'nasta' | 'settings';

interface Account {
  production?: number;
  work?: number;
  payment?: number;
  nasta?: number;
}

export default function UserDashboard() {
  const { session } = useSession();
  const { getLabel } = useDashboardOverrides();
  const noticeConfig = useUserNotice();
  const { branding } = useBranding();
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [kpiData, setKpiData] = useState({
    production: 0,
    work: 0,
    payment: 0,
    nasta: 0,
    balance: 0,
  });

  useEffect(() => {
    if (session?.userName) {
      loadKpiData();
    }
  }, [session?.userName]);

  const loadKpiData = () => {
    if (!session?.userName) return;

    const accountKey = `account_${session.userName}`;
    const account = safeGetItem<Account>(accountKey, {});

    const production = account.production || 0;
    const work = account.work || 0;
    const payment = account.payment || 0;
    const nasta = account.nasta || 0;
    const balance = production + work - payment - nasta;

    setKpiData({ production, work, payment, nasta, balance });
  };

  const handleBack = () => {
    setViewMode('dashboard');
    loadKpiData();
  };

  const handleHome = () => {
    setViewMode('dashboard');
    loadKpiData();
  };

  if (viewMode === 'production') {
    return <ProductionHistoryView onBack={handleBack} />;
  }

  if (viewMode === 'work') {
    return <WorkHistoryView onBack={handleBack} />;
  }

  if (viewMode === 'payment') {
    return <PaymentHistoryView onBack={handleBack} />;
  }

  if (viewMode === 'nasta') {
    return <NastaHistoryView onBack={handleBack} />;
  }

  if (viewMode === 'settings') {
    return <ProfileSettingsView onBack={handleBack} />;
  }

  const profileImageUrl = branding.logoDataUrl || '/assets/generated/worker-avatar-placeholder.dim_512x512.png';
  const totalDue = kpiData.balance;
  const totalWork = kpiData.production + kpiData.work;
  const totalCost = kpiData.payment + kpiData.nasta;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg border-b-2 border-white/20 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-md">
                <img 
                  src={profileImageUrl}
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-lg font-bold">{session?.userName || 'User'}</h1>
                <p className="text-xs text-white/80">ড্যাশবোর্ড</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Scrolling Notice */}
      {noticeConfig.enabled && noticeConfig.text && (
        <div className="bg-yellow-100 border-b-2 border-yellow-300 py-2 overflow-hidden">
          <div className="animate-marquee whitespace-nowrap">
            <span className="text-sm font-semibold text-yellow-900 px-4">
              {noticeConfig.text}
            </span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 space-y-6 pb-24">
        {/* Clock Card */}
        <ClockCard />

        {/* KPI Summary */}
        <UserKpiSummary
          totalDue={totalDue}
          totalWork={totalWork}
          totalCost={totalCost}
        />

        {/* Action Tiles */}
        <Card className="border-2 border-gray-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-gray-100 to-gray-200 border-b-2">
            <CardTitle className="text-base font-bold text-gray-800">
              দ্রুত অ্যাক্সেস
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-3">
              <ActionTile
                icon={<Package className="w-12 h-12 text-white" />}
                label={getLabel('userProductionLabel') || 'প্রোডাকশন'}
                onClick={() => setViewMode('production')}
                bgGradient="from-blue-500 to-blue-600"
                size="user"
              />
              <ActionTile
                icon={<Briefcase className="w-12 h-12 text-white" />}
                label={getLabel('userWorkLabel') || 'কাজ'}
                onClick={() => setViewMode('work')}
                bgGradient="from-green-500 to-green-600"
                size="user"
              />
              <ActionTile
                icon={<DollarSign className="w-12 h-12 text-white" />}
                label={getLabel('userPaymentLabel') || 'পেমেন্ট'}
                onClick={() => setViewMode('payment')}
                bgGradient="from-purple-500 to-purple-600"
                size="user"
              />
              <ActionTile
                icon={<Coffee className="w-12 h-12 text-white" />}
                label={getLabel('userNastaLabel') || 'নাস্তা'}
                onClick={() => setViewMode('nasta')}
                bgGradient="from-orange-500 to-orange-600"
                size="user"
              />
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <DashboardFooter
        leftAction={{
          label: 'হোম',
          onClick: handleHome,
          icon: Home,
        }}
        centerAction={{
          label: getLabel('supportButtonLabel') || 'সাপোর্ট',
          onClick: () => {},
          icon: MessageCircle,
        }}
        rightAction={{
          label: getLabel('settingsButtonLabel') || 'সেটিংস',
          onClick: () => setViewMode('settings'),
          icon: Settings,
        }}
      />
    </div>
  );
}
