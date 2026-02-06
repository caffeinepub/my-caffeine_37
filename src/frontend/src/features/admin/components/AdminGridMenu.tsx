import { AdminView } from './adminNavTypes';
import ActionTile from '../../../components/dashboard/ActionTile';

interface AdminGridMenuProps {
  onNavigate: (view: AdminView) => void;
}

export default function AdminGridMenu({ onNavigate }: AdminGridMenuProps) {
  const workItems = [
    {
      id: 'production' as AdminView,
      label: 'প্রোডাকশন',
      icon: '/assets/generated/icon-production.dim_256x256.png',
      bgColor: 'from-green-500 to-green-600',
    },
    {
      id: 'work' as AdminView,
      label: 'কাজ',
      icon: '/assets/generated/icon-work.dim_256x256.png',
      bgColor: 'from-pink-500 to-pink-600',
    },
    {
      id: 'nasta' as AdminView,
      label: 'নাস্তা',
      icon: '/assets/generated/icon-nasta.dim_256x256.png',
      bgColor: 'from-slate-600 to-slate-700',
    },
  ];

  const moneyItems = [
    {
      id: 'payment' as AdminView,
      label: 'পেমেন্ট/লোন',
      icon: '/assets/generated/icon-payment-loan.dim_256x256.png',
      bgColor: 'from-blue-700 to-blue-800',
    },
    {
      id: 'company-report' as AdminView,
      label: 'কোম্পানি রিপোর্ট',
      icon: '/assets/generated/icon-workers.dim_256x256.png',
      bgColor: 'from-orange-500 to-orange-600',
    },
    {
      id: 'final-balance' as AdminView,
      label: 'চূড়ান্ত ব্যালেন্স',
      icon: '/assets/generated/icon-due-balance.dim_256x256.png',
      bgColor: 'from-purple-500 to-purple-600',
    },
  ];

  const settingsItems = [
    {
      id: 'user-requests' as AdminView,
      label: 'রিকোয়েস্ট',
      icon: '/assets/generated/icon-user-request.dim_256x256.png',
      bgColor: 'from-teal-500 to-teal-600',
    },
    {
      id: 'settings' as AdminView,
      label: 'সেটিংস',
      icon: '/assets/generated/icon-settings.dim_256x256.png',
      bgColor: 'from-gray-700 to-gray-800',
    },
    {
      id: 'worker-rate-settings' as AdminView,
      label: 'রেট',
      icon: '/assets/generated/icon-worker-rate.dim_256x256.png',
      bgColor: 'from-red-500 to-red-600',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Work Group - Bordered Container */}
      <div className="border-4 border-gray-900 rounded-3xl p-4 bg-white shadow-2xl">
        <div className="grid grid-cols-3 gap-3">
          {workItems.map((item) => (
            <ActionTile
              key={item.id}
              icon={item.icon}
              label={item.label}
              onClick={() => onNavigate(item.id)}
              bgGradient={item.bgColor}
              size="small"
            />
          ))}
        </div>
      </div>

      {/* Money Group - Bordered Container */}
      <div className="border-4 border-gray-900 rounded-3xl p-4 bg-white shadow-2xl">
        <div className="grid grid-cols-3 gap-3">
          {moneyItems.map((item) => (
            <ActionTile
              key={item.id}
              icon={item.icon}
              label={item.label}
              onClick={() => onNavigate(item.id)}
              bgGradient={item.bgColor}
              size="small"
            />
          ))}
        </div>
      </div>

      {/* Settings Group - Bordered Container */}
      <div className="border-4 border-gray-900 rounded-3xl p-4 bg-white shadow-2xl">
        <div className="grid grid-cols-3 gap-3">
          {settingsItems.map((item) => (
            <ActionTile
              key={item.id}
              icon={item.icon}
              label={item.label}
              onClick={() => onNavigate(item.id)}
              bgGradient={item.bgColor}
              size="small"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
