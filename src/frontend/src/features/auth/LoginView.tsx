import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { notify } from '../../components/feedback/notify';
import { useSession } from '../../state/session/useSession';
import { useBranding } from '../../hooks/useBranding';

interface LoginViewProps {
  onSwitchToRegister: () => void;
}

export default function LoginView({ onSwitchToRegister }: LoginViewProps) {
  const [mob, setMob] = useState('');
  const [pass, setPass] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useSession();
  const { branding } = useBranding();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mob.trim() || !pass.trim()) {
      notify.error('সব ফিল্ড পূরণ করুন');
      return;
    }

    setIsLoading(true);
    try {
      await login(mob.trim(), pass.trim());
    } catch (error: any) {
      notify.error(error.message || 'লগইন ব্যর্থ হয়েছে');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Logo/Name */}
        <div className="text-center space-y-3">
          {branding.logoDataUrl && (
            <div className="flex justify-center">
              <img
                src={branding.logoDataUrl}
                alt="Logo"
                className="w-24 h-24 object-contain drop-shadow-2xl"
              />
            </div>
          )}
          <h1 className="text-4xl font-black bg-gradient-to-r from-yellow-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent drop-shadow-lg">
            {branding.companyName}
          </h1>
          <p className="text-white/90 text-sm font-medium drop-shadow-md">
            আপনার একাউন্টে লগইন করুন
          </p>
        </div>

        {/* Login Card */}
        <Card className="border-4 border-white/30 shadow-2xl backdrop-blur-sm bg-white/95 rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 border-b-4 border-white/20">
            <CardTitle className="text-2xl font-bold text-white text-center drop-shadow-md">
              লগইন
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-5">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="mob" className="text-base font-bold text-gray-800">
                  মোবাইল নম্বর
                </Label>
                <Input
                  id="mob"
                  type="text"
                  value={mob}
                  onChange={(e) => setMob(e.target.value)}
                  placeholder="আপনার মোবাইল নম্বর"
                  className="mt-2 border-3 border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 rounded-xl text-base py-3"
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="pass" className="text-base font-bold text-gray-800">
                  পাসওয়ার্ড
                </Label>
                <Input
                  id="pass"
                  type="password"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  placeholder="আপনার পাসওয়ার্ড"
                  className="mt-2 border-3 border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 rounded-xl text-base py-3"
                  disabled={isLoading}
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl shadow-xl border-3 border-blue-700 transition-all active:scale-95 text-lg"
              >
                {isLoading ? 'লগইন হচ্ছে...' : 'লগইন করুন'}
              </Button>
            </form>

            <div className="pt-4 border-t-2 border-gray-200">
              <Button
                onClick={onSwitchToRegister}
                variant="outline"
                className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-bold py-4 rounded-xl shadow-lg border-3 border-teal-600 transition-all active:scale-95 text-lg"
              >
                নতুন রেজিস্ট্রেশন
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
