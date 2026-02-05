import { ReactNode } from 'react';
import { Button } from '../../../components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface AdminLayoutShellProps {
  title: string;
  children: ReactNode;
  headerActions?: ReactNode;
  onBack?: () => void;
}

export default function AdminLayoutShell({ title, children, headerActions, onBack }: AdminLayoutShellProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50">
      <div className="container mx-auto py-4 px-4 max-w-7xl">
        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden">
          <div className="gradient-primary text-white px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {onBack && (
                  <Button
                    onClick={onBack}
                    className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/40 px-4 py-2 rounded-xl font-bold shadow-lg"
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
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
