import { useBranding } from '../../hooks/useBranding';
import { getLogoUrl } from '../../lib/branding/brandingStorage';
import { MessageCircle } from 'lucide-react';

interface DashboardFooterProps {
  onSupportClick: () => void;
}

export default function DashboardFooter({ onSupportClick }: DashboardFooterProps) {
  const { branding } = useBranding();
  const logoUrl = getLogoUrl();

  return (
    <div className="bg-gradient-to-r from-green-600 via-green-500 to-green-600 px-4 py-3 shadow-2xl">
      <button
        onClick={onSupportClick}
        className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-2xl bg-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all active:scale-95"
      >
        <MessageCircle className="w-6 h-6 text-green-600" />
        <span className="text-green-900 font-bold text-lg">সাপোর্ট / চ্যাট</span>
      </button>
    </div>
  );
}
