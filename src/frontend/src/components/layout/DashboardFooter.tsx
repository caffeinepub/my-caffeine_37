import { MessageCircle, Settings } from 'lucide-react';

interface DashboardFooterProps {
  onSupportClick: () => void;
  onSettingsClick?: () => void;
}

export default function DashboardFooter({ onSupportClick, onSettingsClick }: DashboardFooterProps) {
  return (
    <div className="dashboard-gradient px-2 py-1.5 shadow-2xl">
      <div className="flex items-center gap-2">
        {/* Settings button - bottom-left */}
        {onSettingsClick && (
          <button
            onClick={onSettingsClick}
            className="flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-xl bg-white shadow-lg hover:shadow-xl hover:scale-105 transition-all active:scale-95 touch-manipulation"
          >
            <Settings className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-blue-900 font-bold text-[10px]">সেটিংস</span>
          </button>
        )}

        {/* Support/Chat button - takes remaining space */}
        <button
          onClick={onSupportClick}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-white shadow-lg hover:shadow-xl hover:scale-105 transition-all active:scale-95 touch-manipulation"
        >
          <MessageCircle className="w-4 h-4 text-teal-600" />
          <span className="text-teal-900 font-bold text-xs">সাপোর্ট / চ্যাট</span>
        </button>
      </div>
    </div>
  );
}
