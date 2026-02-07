import { ReactNode } from 'react';
import { Button } from '../../../components/ui/button';
import { ArrowLeft, DollarSign, Calculator, MessageCircle } from 'lucide-react';
import DashboardFooter from '../../../components/layout/DashboardFooter';
import { notify } from '../../../components/feedback/notify';
import AdminHeaderAvatar from './AdminHeaderAvatar';

interface AdminLayoutShellProps {
  title: string;
  children: ReactNode;
  headerActions?: ReactNode;
  onBack?: () => void;
  showFooter?: boolean;
  onLeftButtonClick?: () => void;
  onRightButtonClick?: () => void;
  leftButtonLabel?: string;
  rightButtonLabel?: string;
}

export default function AdminLayoutShell({ 
  title, 
  children, 
  headerActions, 
  onBack,
  showFooter = true,
  onLeftButtonClick,
  onRightButtonClick,
  leftButtonLabel,
  rightButtonLabel
}: AdminLayoutShellProps) {
  const handleMTLoanClick = () => {
    notify.info('MT-LOAN ফিচার শীঘ্রই আসছে');
  };

  const handleCalculatorClick = () => {
    notify.info('ক্যালকুলেটর শীঘ্রই আসছে');
  };

  return (
    <div className="min-h-screen flex flex-col dashboard-professional-bg">
      {/* Fixed Header - Dashboard gradient with enhanced border/shadow */}
      <div className="fixed top-0 left-0 right-0 z-20 dashboard-gradient text-white px-3 py-3 shadow-lg border-b-2 border-blue-900 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {onBack && (
              <Button
                onClick={onBack}
                className="back-button-colored px-3 py-1.5 rounded-lg text-xs flex-shrink-0"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                ফিরে যান
              </Button>
            )}
            <h2 className="text-base sm:text-lg font-bold section-title-accent truncate">{title}</h2>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {headerActions}
            <AdminHeaderAvatar />
          </div>
        </div>
      </div>

      {/* Scrollable Content with professional background */}
      <div className="flex-1 overflow-y-auto pt-[60px] pb-[88px] dashboard-professional-bg">
        <div className="container mx-auto py-3 px-3 max-w-7xl">
          <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 overflow-hidden">
            <div className="p-5 sm:p-6">{children}</div>
          </div>
        </div>
      </div>

      {/* Fixed Footer */}
      {showFooter && (
        <div className="fixed bottom-0 left-0 right-0 z-20">
          <DashboardFooter 
            leftAction={{
              label: leftButtonLabel || 'MT-LOAN',
              onClick: onLeftButtonClick || handleMTLoanClick,
              icon: DollarSign,
            }}
            centerAction={{
              label: 'সাপোর্ট / চ্যাট',
              onClick: () => {},
              icon: MessageCircle,
            }}
            rightAction={{
              label: rightButtonLabel || 'ক্যালকুলেটর',
              onClick: onRightButtonClick || handleCalculatorClick,
              icon: Calculator,
            }}
          />
        </div>
      )}
    </div>
  );
}
