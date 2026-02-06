import { useState } from 'react';
import { useSession } from '../../state/session/useSession';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import RegisterView from './RegisterView';
import { useBranding } from '../../hooks/useBranding';
import { getLoginCircleImage } from '../../lib/branding/brandingStorage';

export default function LoginView() {
  const { login } = useSession();
  const { branding } = useBranding();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showRegister, setShowRegister] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('ইউজারনেম এবং পাসওয়ার্ড উভয়ই লিখুন');
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await login(username, password);
      
      if (!result.success) {
        setError(result.error || 'লগইন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('লগইন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setIsLoading(false);
    }
  };

  if (showRegister) {
    return <RegisterView onSwitchToLogin={() => setShowRegister(false)} />;
  }

  const circleImage = getLoginCircleImage();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center dashboard-professional-bg p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Hero Circle - Read-only, synced with branding logo */}
        <div className="flex justify-center mb-6">
          <div className="relative w-48 h-48 rounded-full bg-white shadow-2xl flex items-center justify-center overflow-hidden">
            <img
              src={circleImage}
              alt="Hero"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Brand Name - Text only, no box */}
        <div className="text-center">
          <h1 className="text-4xl font-black text-slate-800 tracking-tight drop-shadow-lg">
            {branding.companyName}
          </h1>
          <p className="text-slate-700 mt-2 text-sm drop-shadow">Worker Management System</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-slate-700 font-semibold">মোবাইল নাম্বার</Label>
              <Input
                id="username"
                type="text"
                placeholder="01XXX-XXXXXX"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-gradient-to-r from-cyan-100 to-blue-100 border-slate-300 text-slate-800 placeholder:text-slate-500 rounded-2xl h-12"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700 font-semibold">পাসওয়ার্ড</Label>
              <Input
                id="password"
                type="password"
                placeholder="******"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gradient-to-r from-amber-100 to-orange-100 border-slate-300 text-slate-800 placeholder:text-slate-500 rounded-2xl h-12"
                disabled={isLoading}
              />
            </div>
            {error && (
              <div className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-2xl p-3">
                {error}
              </div>
            )}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold shadow-lg rounded-2xl h-12 text-lg"
              disabled={isLoading}
            >
              {isLoading ? 'লগইন হচ্ছে...' : 'প্রবেশ করুন'}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Button
              onClick={() => setShowRegister(true)}
              disabled={isLoading}
              variant="outline"
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-bold border-2 border-teal-700 shadow-md rounded-2xl h-11"
            >
              নতুন ইউজার রেজিস্ট্রেশন
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-slate-700">
          © 2026. Built with ❤️ using{' '}
          <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 font-semibold">
            caffeine.ai
          </a>
        </div>
      </div>
    </div>
  );
}
