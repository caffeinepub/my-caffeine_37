import { ReactNode } from 'react';

interface DashboardFrameProps {
  children: ReactNode;
}

export default function DashboardFrame({ children }: DashboardFrameProps) {
  return (
    <div className="min-h-screen bg-gray-100 p-1">
      <div className="border-4 border-gray-900 rounded-3xl bg-white h-[calc(100dvh-0.5rem)] overflow-hidden flex flex-col shadow-2xl">
        {children}
      </div>
    </div>
  );
}
