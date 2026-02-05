import { Home, Factory, FileText, Coffee, Wallet, Settings } from 'lucide-react';
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
    { id: 'settings' as AdminView, icon: Settings, label: 'সেটিংস' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg z-50 safe-area-inset-bottom">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-6 gap-0">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center justify-center py-2.5 px-1 transition-colors active:scale-95 ${
                  isActive
                    ? 'text-primary bg-primary/5'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-primary' : ''}`} />
                <span className="text-[10px] font-medium leading-tight">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
