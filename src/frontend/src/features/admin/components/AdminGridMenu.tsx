import { AdminView } from './adminNavTypes';
import ActionTile from '../../../components/dashboard/ActionTile';
import { lowerSectionBorder, lowerSectionPadding, lowerSectionRadius, lowerSectionShadow, lowerSectionBg } from '../../../components/dashboard/dashboardBorders';
import { useDashboardOverrides } from '../../../hooks/useDashboardOverrides';

interface AdminGridMenuProps {
  onNavigate: (view: AdminView) => void;
}

export default function AdminGridMenu({ onNavigate }: AdminGridMenuProps) {
  const { getLabel } = useDashboardOverrides();

  const row1Items: Array<{ view: AdminView; icon: string; label: string; gradient: string }> = [
    { view: 'production', icon: '/assets/generated/icon-production.dim_256x256.png', label: getLabel('productionLabel', 'প্রোডাকশন'), gradient: 'from-emerald-500 to-teal-600' },
    { view: 'work', icon: '/assets/generated/icon-work.dim_256x256.png', label: getLabel('workLabel', 'কাজ'), gradient: 'from-cyan-500 to-blue-600' },
    { view: 'company-report', icon: '/assets/generated/icon-due-balance.dim_256x256.png', label: getLabel('reportLabel', 'কোম্পানি রিপোর্ট'), gradient: 'from-purple-500 to-pink-600' },
  ];

  const row2Items: Array<{ view: AdminView; icon: string; label: string; gradient: string }> = [
    { view: 'nasta', icon: '/assets/generated/icon-nasta.dim_256x256.png', label: getLabel('nastaLabel', 'নাস্তা'), gradient: 'from-amber-500 to-orange-600' },
    { view: 'payment', icon: '/assets/generated/icon-payment-loan.dim_256x256.png', label: getLabel('paymentLabel', 'পেমেন্ট/লোন'), gradient: 'from-rose-500 to-pink-600' },
    { view: 'final-balance', icon: '/assets/generated/icon-due-balance.dim_256x256.png', label: getLabel('balanceLabel', 'চূড়ান্ত ব্যালেন্স'), gradient: 'from-indigo-500 to-purple-600' },
  ];

  const row3Items: Array<{ view: AdminView; icon: string; label: string; gradient: string }> = [
    { view: 'user-requests', icon: '/assets/generated/icon-user-request.dim_256x256.png', label: getLabel('requestLabel', 'ইউজার রিকুয়েস্ট'), gradient: 'from-blue-500 to-cyan-600' },
    { view: 'settings', icon: '/assets/generated/icon-settings.dim_256x256.png', label: getLabel('settingsLabel', 'সেটিংস'), gradient: 'from-gray-500 to-slate-600' },
    { view: 'worker-rate-settings', icon: '/assets/generated/icon-worker-rate.dim_256x256.png', label: getLabel('rateLabel', 'রেট'), gradient: 'from-teal-500 to-green-600' },
  ];

  return (
    <div className={`space-y-2 ${lowerSectionBorder} ${lowerSectionPadding} ${lowerSectionRadius} ${lowerSectionShadow} ${lowerSectionBg}`}>
      {/* Row 1 */}
      <div className="grid grid-cols-3 gap-2">
        {row1Items.map((item) => (
          <ActionTile
            key={item.view}
            label={item.label}
            icon={item.icon}
            onClick={() => onNavigate(item.view)}
            bgGradient={item.gradient}
            size="admin"
          />
        ))}
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-3 gap-2">
        {row2Items.map((item) => (
          <ActionTile
            key={item.view}
            label={item.label}
            icon={item.icon}
            onClick={() => onNavigate(item.view)}
            bgGradient={item.gradient}
            size="admin"
          />
        ))}
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-3 gap-2">
        {row3Items.map((item) => (
          <ActionTile
            key={item.view}
            label={item.label}
            icon={item.icon}
            onClick={() => onNavigate(item.view)}
            bgGradient={item.gradient}
            size="admin"
          />
        ))}
      </div>
    </div>
  );
}
