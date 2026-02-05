import { AdminView } from './adminNavTypes';

interface AdminGridMenuProps {
  onNavigate: (view: AdminView) => void;
}

export default function AdminGridMenu({ onNavigate }: AdminGridMenuProps) {
  const topRowItems = [
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
      bgColor: 'from-purple-500 to-purple-600',
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
      bgColor: 'from-blue-600 to-blue-700',
    },
  ];

  const bottomRowItems = [
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
    <div className="space-y-3">
      {/* Top Row - 3 buttons */}
      <div className="grid grid-cols-3 gap-2">
        {topRowItems.map((item, index) => (
          <button
            key={index}
            onClick={() => onNavigate(item.id)}
            className={`bg-gradient-to-br ${item.bgColor} rounded-2xl p-4 shadow-lg hover:scale-105 transition-transform active:scale-95`}
          >
            <div className="flex flex-col items-center gap-2">
              <img src={item.icon} alt={item.label} className="w-12 h-12" />
              <p className="text-white text-xs font-bold text-center leading-tight">{item.label}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Money Group - Bordered Container */}
      <div className="border-4 border-gray-800 rounded-3xl p-3 bg-gradient-to-br from-gray-50 to-gray-100 shadow-xl">
        <div className="grid grid-cols-3 gap-2">
          {moneyItems.map((item, index) => (
            <button
              key={index}
              onClick={() => onNavigate(item.id)}
              className={`bg-gradient-to-br ${item.bgColor} rounded-2xl p-4 shadow-lg hover:scale-105 transition-transform active:scale-95`}
            >
              <div className="flex flex-col items-center gap-2">
                <img src={item.icon} alt={item.label} className="w-12 h-12" />
                <p className="text-white text-xs font-bold text-center leading-tight">{item.label}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Row - 3 buttons */}
      <div className="grid grid-cols-3 gap-2">
        {bottomRowItems.map((item, index) => (
          <button
            key={index}
            onClick={() => onNavigate(item.id)}
            className={`bg-gradient-to-br ${item.bgColor} rounded-2xl p-4 shadow-lg hover:scale-105 transition-transform active:scale-95`}
          >
            <div className="flex flex-col items-center gap-2">
              <img src={item.icon} alt={item.label} className="w-12 h-12" />
              <p className="text-white text-xs font-bold text-center leading-tight">{item.label}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
