import ActionTile from '../../../components/dashboard/ActionTile';
import { AdminView } from './adminNavTypes';
import { useDashboardOverrides } from '../../../hooks/useDashboardOverrides';
import { getLabelText } from '../../../lib/storage/labelSettingsStorage';

interface AdminGridMenuProps {
  onNavigate: (view: AdminView) => void;
}

export default function AdminGridMenu({ onNavigate }: AdminGridMenuProps) {
  const { getLabel } = useDashboardOverrides();

  return (
    <div className="space-y-3">
      {/* Row 1 */}
      <div className="grid grid-cols-3 gap-3">
        <ActionTile
          icon="/assets/generated/icon-production.dim_256x256.png"
          label={getLabelText('productionTile') || getLabel('productionLabel') || 'প্রোডাকশন'}
          onClick={() => onNavigate('production')}
          bgGradient="from-emerald-500 to-teal-600"
          size="admin"
        />
        <ActionTile
          icon="/assets/generated/icon-work.dim_256x256.png"
          label={getLabelText('workTile') || getLabel('workLabel') || 'কাজ'}
          onClick={() => onNavigate('work')}
          bgGradient="from-blue-500 to-cyan-600"
          size="admin"
        />
        <ActionTile
          icon="/assets/generated/icon-due-balance.dim_256x256.png"
          label={getLabelText('companyReportTile') || 'কোম্পানি রিপোর্ট'}
          onClick={() => onNavigate('company-report')}
          bgGradient="from-indigo-500 to-purple-600"
          size="admin"
        />
      </div>

      <div className="border-t-2 border-gray-300" />

      {/* Row 2 */}
      <div className="grid grid-cols-3 gap-3">
        <ActionTile
          icon="/assets/generated/icon-nasta.dim_256x256.png"
          label={getLabelText('nastaTile') || getLabel('nastaLabel') || 'নাস্তা'}
          onClick={() => onNavigate('nasta')}
          bgGradient="from-orange-500 to-amber-600"
          size="admin"
        />
        <ActionTile
          icon="/assets/generated/icon-payment-loan.dim_256x256.png"
          label={getLabelText('paymentTile') || getLabel('paymentLabel') || 'পেমেন্ট/লোন'}
          onClick={() => onNavigate('payment')}
          bgGradient="from-pink-500 to-rose-600"
          size="admin"
        />
        <ActionTile
          icon="/assets/generated/icon-due-balance.dim_256x256.png"
          label={getLabelText('finalBalanceTile') || 'চূড়ান্ত ব্যালেন্স'}
          onClick={() => onNavigate('final-balance')}
          bgGradient="from-violet-500 to-purple-600"
          size="admin"
        />
      </div>

      <div className="border-t-2 border-gray-300" />

      {/* Row 3 */}
      <div className="grid grid-cols-3 gap-3">
        <ActionTile
          icon="/assets/generated/icon-user-request.dim_256x256.png"
          label={getLabelText('userRequestsTile') || 'ইউজার রিকুয়েস্ট'}
          onClick={() => onNavigate('user-requests')}
          bgGradient="from-sky-500 to-blue-600"
          size="admin"
        />
        <ActionTile
          icon="/assets/generated/icon-settings.dim_256x256.png"
          label={getLabelText('settingsTile') || getLabel('settingsLabel') || 'সেটিংস'}
          onClick={() => onNavigate('settings')}
          bgGradient="from-slate-500 to-gray-600"
          size="admin"
        />
        <ActionTile
          icon="/assets/generated/icon-worker-rate.dim_256x256.png"
          label={getLabelText('workerRateTile') || getLabel('rateLabel') || 'রেট'}
          onClick={() => onNavigate('worker-rate-settings')}
          bgGradient="from-teal-500 to-emerald-600"
          size="admin"
        />
      </div>
    </div>
  );
}
