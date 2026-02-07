import { ReactNode } from 'react';

interface DashboardFrameProps {
  children: ReactNode;
}

export default function DashboardFrame({ children }: DashboardFrameProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-0.5 dashboard-professional-bg">
      <div className="relative w-full max-w-md border-3 border-gray-800 rounded-none shadow-2xl overflow-hidden dashboard-professional-bg" style={{ height: '100dvh' }}>
        {children}
      </div>
    </div>
  );
}
