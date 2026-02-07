import { MessageCircle, Settings } from 'lucide-react';
import { useDashboardOverrides } from '../../hooks/useDashboardOverrides';

interface DashboardFooterProps {
  onSupportClick?: () => void;
  onSettingsClick?: () => void;
  showSettings?: boolean;
}

export default function DashboardFooter({ onSupportClick, onSettingsClick, showSettings = true }: DashboardFooterProps) {
  const { getLabel } = useDashboardOverrides();

  return (
    <div className="flex-shrink-0 bg-white border-t-2 border-gray-300 px-4 py-3 pb-safe-bottom shadow-inner">
      <div className="flex items-center justify-center gap-3">
        {onSupportClick && (
          <button
            onClick={onSupportClick}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-full font-medium transition-all shadow-md hover:shadow-lg"
          >
            <MessageCircle className="w-5 h-5" />
            <span>{getLabel('supportButtonLabel', 'সাপোর্ট / চ্যাট')}</span>
          </button>
        )}
        {showSettings && onSettingsClick && (
          <button
            onClick={onSettingsClick}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-600 to-slate-600 hover:from-gray-700 hover:to-slate-700 text-white rounded-full font-medium transition-all shadow-md hover:shadow-lg"
          >
            <Settings className="w-5 h-5" />
            <span>{getLabel('settingsButtonLabel', 'সেটিংস')}</span>
          </button>
        )}
      </div>
    </div>
  );
}
