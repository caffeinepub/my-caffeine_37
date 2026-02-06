import { ReactNode } from 'react';
import { Button } from '../../../components/ui/button';
import { ArrowLeft } from 'lucide-react';
import DashboardFooter from '../../../components/layout/DashboardFooter';

interface AdminLayoutShellProps {
  title: string;
  children: ReactNode;
  headerActions?: ReactNode;
  onBack?: () => void;
}

export default function AdminLayoutShell({ title, children, headerActions, onBack }: AdminLayoutShellProps) {
  return (
    <div className="min-h-screen flex flex-col dashboard-professional-bg">
      {/* Fixed Header - Dashboard gradient */}
      <div className="fixed top-0 left-0 right-0 z-20 dashboard-gradient text-white px-3 py-3 shadow-md border-b-2 border-blue-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {onBack && (
              <Button
                onClick={onBack}
                className="bg-white hover:bg-gray-100 text-blue-800 border-2 border-gray-300 px-3 py-1.5 rounded-lg font-bold shadow-sm text-xs"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                ফিরে যান
              </Button>
            )}
            <h2 className="text-lg font-bold">{title}</h2>
          </div>
          {headerActions && <div>{headerActions}</div>}
        </div>
      </div>

      {/* Scrollable Content with professional background */}
      <div className="flex-1 overflow-y-auto pt-[60px] pb-[72px] dashboard-professional-bg">
        <div className="container mx-auto py-2 px-2 max-w-7xl">
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden">
            <div className="p-4">{children}</div>
          </div>
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-20">
        <DashboardFooter onSupportClick={() => {}} />
      </div>
    </div>
  );
}
