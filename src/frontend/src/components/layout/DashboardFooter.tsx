import { MessageCircle, Settings } from 'lucide-react';

interface DashboardFooterProps {
  onSupportClick: () => void;
  onSettingsClick?: () => void;
}

export default function DashboardFooter({ onSupportClick, onSettingsClick }: DashboardFooterProps) {
  return (
    <div className="dashboard-gradient px-2 py-2 shadow-2xl">
      <div className="flex items-center gap-2">
        {/* Settings button - bottom-left */}
        {onSettingsClick && (
          <button
            onClick={onSettingsClick}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white shadow-lg hover:shadow-xl hover:scale-105 transition-all active:scale-95 touch-manipulation"
          >
            <Settings className="w-4 h-4 text-blue-600" />
            <span className="text-blue-900 font-bold text-xs">সেটিংস</span>
          </button>
        )}

        {/* Support/Chat button - takes remaining space */}
        <button
          onClick={onSupportClick}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white shadow-lg hover:shadow-xl hover:scale-105 transition-all active:scale-95 touch-manipulation"
        >
          <MessageCircle className="w-5 h-5 text-teal-600" />
          <span className="text-teal-900 font-bold text-sm">সাপোর্ট / চ্যাট</span>
        </button>
      </div>
    </div>
  );
}
