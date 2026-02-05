export type AdminView = 
  | 'dashboard' 
  | 'production' 
  | 'work' 
  | 'nasta' 
  | 'payment' 
  | 'user-requests'
  | 'settings'
  | 'worker-rate-settings'
  | 'final-balance'
  | 'company-report'
  | 'support';

export interface AdminNavItem {
  id: AdminView;
  label: string;
  icon: string;
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { id: 'dashboard', label: 'ড্যাশবোর্ড', icon: 'home' },
  { id: 'production', label: 'প্রোডাকশন', icon: 'factory' },
  { id: 'work', label: 'কাজ', icon: 'file-text' },
  { id: 'nasta', label: 'নাস্তা', icon: 'coffee' },
  { id: 'payment', label: 'পেমেন্ট', icon: 'wallet' },
  { id: 'user-requests', label: 'ইউজার রিকুয়েস্ট', icon: 'users' },
  { id: 'settings', label: 'সেটিংস', icon: 'settings' },
  { id: 'worker-rate-settings', label: 'কর্মী ও রেট সেটিংস', icon: 'user-cog' },
  { id: 'final-balance', label: 'চূড়ান্ত ব্যালেন্স', icon: 'dollar-sign' },
  { id: 'company-report', label: 'কোম্পানি রিপোর্ট', icon: 'file-text' },
  { id: 'support', label: 'সাপোর্ট', icon: 'message-circle' },
];
