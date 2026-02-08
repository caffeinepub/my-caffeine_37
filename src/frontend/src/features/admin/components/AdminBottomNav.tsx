import { Home, Factory, FileText, Coffee, Wallet } from 'lucide-react';
import { AdminView } from './adminNavTypes';

interface AdminBottomNavProps {
  activeView: AdminView;
  onNavigate: (view: AdminView) => void;
}

export default function AdminBottomNav({ activeView, onNavigate }: AdminBottomNavProps) {
  const navItems = [
    { id: 'dashboard' as AdminView, icon: Home, label: 'হোম' },
    { id: 'production' as AdminView, icon: Factory, label: 'প্রোডাকশন' },
    { id: 'work' as AdminView, icon: FileText, label: 'কাজ' },
    { id: 'nasta' as AdminView, icon: Coffee, label: 'নাস্তা' },
    { id: 'payment' as AdminView, icon: Wallet, label: 'পেমেন্ট' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-slate-300 shadow-2xl z-50 pb-safe-bottom py-3">
      <div className="grid grid-cols-5 gap-2 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl transition-all touch-manipulation active:scale-95 min-h-[64px] border-2 ${
                isActive
                  ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg border-blue-400'
                  : 'text-slate-600 hover:bg-slate-100 border-slate-300'
              }`}
            >
              <Icon className={`${isActive ? 'w-6 h-6' : 'w-5 h-5'} mb-1.5`} />
              <span className={`text-[10px] font-medium leading-tight text-center ${isActive ? 'font-bold' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
