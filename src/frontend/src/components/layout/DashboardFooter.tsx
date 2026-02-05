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
    <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 px-4 py-4 rounded-t-3xl shadow-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl px-4 py-2 shadow-lg">
          <img
            src={logoUrl}
            alt={branding.companyName}
            className="h-8 w-8 object-contain"
          />
          <div className="text-white">
            <p className="text-base font-black tracking-wider">{branding.companyName}</p>
          </div>
        </div>
        <button
          onClick={onSupportClick}
          className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 shadow-xl hover:shadow-2xl hover:scale-105 transition-all active:scale-95"
          title="সাপোর্ট"
        >
          <MessageCircle className="w-6 h-6 text-white" />
          <span className="text-white font-bold text-sm">সাপোর্ট</span>
        </button>
      </div>
    </div>
  );
}
