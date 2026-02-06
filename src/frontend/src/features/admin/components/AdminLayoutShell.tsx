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
    <div className="min-h-screen flex flex-col">
      {/* Fixed Header - Unified clean style */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-white text-gray-800 px-6 py-5 shadow-md border-b-2 border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {onBack && (
              <Button
                onClick={onBack}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 border-2 border-gray-300 px-4 py-2 rounded-xl font-bold shadow-sm"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                ফিরে যান
              </Button>
            )}
            <h2 className="text-2xl font-bold">{title}</h2>
          </div>
          {headerActions && <div>{headerActions}</div>}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pt-[100px] pb-24 bg-gray-100">
        <div className="container mx-auto py-4 px-4 max-w-7xl">
          <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden">
            <div className="p-6">{children}</div>
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
