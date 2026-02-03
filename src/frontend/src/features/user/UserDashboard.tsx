import { useState, useEffect } from 'react';
import { useSession } from '../../state/session/useSession';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { safeGetItem, safeSetItem } from '../../lib/storage/safeStorage';
import ProductionHistoryView from './production/ProductionHistoryView';
import WorkHistoryView from './work/WorkHistoryView';
import PaymentHistoryView from './payment/PaymentHistoryView';
import { Factory, FileText, Wallet, LogOut, Camera } from 'lucide-react';

type ViewMode = 'dashboard' | 'production' | 'work' | 'payment';

export default function UserDashboard() {
  const { session, logout } = useSession();
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [balance, setBalance] = useState(0);
  const [profilePic, setProfilePic] = useState<string>('https://cdn-icons-png.flaticon.com/512/149/149071.png');

  useEffect(() => {
    if (session?.userName) {
      loadUserData();
    }
  }, [session?.userName]);

  const loadUserData = () => {
    if (!session?.userName) return;

    const accounts = safeGetItem<Record<string, { bill: number; cost: number }>>('accounts', {}) || {};
    const acc = accounts[session.userName] || { bill: 0, cost: 0 };
    setBalance(acc.bill - acc.cost);

    const savedPic = safeGetItem<string>(`userPic_${session.userName}`, '');
    if (savedPic) setProfilePic(savedPic);
  };

  const handlePicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !session?.userName) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setProfilePic(result);
      safeSetItem(`userPic_${session.userName}`, result);
    };
    reader.readAsDataURL(file);
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  if (viewMode === 'production') {
    return <ProductionHistoryView onBack={() => setViewMode('dashboard')} />;
  }

  if (viewMode === 'work') {
    return <WorkHistoryView onBack={() => setViewMode('dashboard')} />;
  }

  if (viewMode === 'payment') {
    return <PaymentHistoryView onBack={() => setViewMode('dashboard')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white py-12 px-4 rounded-b-[40px] shadow-2xl">
        <div className="container mx-auto max-w-2xl text-center space-y-6">
          <div className="relative inline-block">
            <img
              src={profilePic}
              alt="Profile"
              className="w-28 h-28 rounded-full border-4 border-emerald-500 object-cover shadow-xl"
            />
            <label
              htmlFor="pic-upload"
              className="absolute bottom-0 right-0 bg-emerald-500 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer border-4 border-slate-800 hover:bg-emerald-600 transition-colors"
            >
              <Camera className="w-5 h-5" />
            </label>
            <input
              id="pic-upload"
              type="file"
              accept="image/*"
              onChange={handlePicUpload}
              className="hidden"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold">{session?.userName}</h2>
            <p className="text-slate-300 text-sm mt-1">Worker ID: #{session?.mobile}</p>
          </div>
        </div>
      </div>

      {/* Balance Card */}
      <div className="container mx-auto max-w-2xl px-4 -mt-8">
        <Card className="border-none shadow-2xl bg-white/95 backdrop-blur">
          <CardContent className="text-center py-8">
            <p className="text-sm text-muted-foreground font-medium mb-2">Current Balance Due</p>
            <h1 className="text-5xl font-bold text-emerald-600">৳{balance.toFixed(2)}</h1>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="container mx-auto max-w-2xl px-4 py-6 space-y-3">
        <Button
          onClick={() => setViewMode('production')}
          className="w-full h-16 bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-between text-lg"
        >
          <span className="flex items-center gap-3">
            <Factory className="w-6 h-6" />
            Production History
          </span>
          <span>→</span>
        </Button>

        <Button
          onClick={() => setViewMode('work')}
          className="w-full h-16 bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-between text-lg"
        >
          <span className="flex items-center gap-3">
            <FileText className="w-6 h-6" />
            Work Details
          </span>
          <span>→</span>
        </Button>

        <Button
          onClick={() => setViewMode('payment')}
          className="w-full h-16 bg-red-600 hover:bg-red-700 text-white flex items-center justify-between text-lg"
        >
          <span className="flex items-center gap-3">
            <Wallet className="w-6 h-6" />
            Payment List
          </span>
          <span>→</span>
        </Button>

        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full h-14 mt-6 border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Logout
        </Button>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-slate-400 py-6">
        © 2026. Built with ❤️ using{' '}
        <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300">
          caffeine.ai
        </a>
      </div>
    </div>
  );
}
