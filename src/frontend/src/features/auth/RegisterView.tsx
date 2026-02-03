import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { safeGetItem, safeSetItem } from '../../lib/storage/safeStorage';
import { notify } from '../../components/feedback/notify';

interface RegisterViewProps {
  onSwitchToLogin: () => void;
}

interface PendingRequest {
  name: string;
  mob: string;
  pass: string;
}

export default function RegisterView({ onSwitchToLogin }: RegisterViewProps) {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !mobile.trim() || !password) {
      notify.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      const pendingRequests = safeGetItem<PendingRequest[]>('pending_reqs', []) || [];
      pendingRequests.push({ name: name.trim(), mob: mobile.trim(), pass: password });
      safeSetItem('pending_reqs', pendingRequests);

      notify.success('Registration request submitted! Wait for admin approval.');
      
      setTimeout(() => {
        onSwitchToLogin();
      }, 1500);
    } catch (error) {
      notify.error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <img
              src="/assets/generated/smart-hisab-logo.dim_512x512.png"
              alt="Smart Hisab Pro"
              className="w-24 h-24 rounded-2xl shadow-2xl"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">স্মার্ট হিসাব প্রো</h1>
            <p className="text-slate-300 mt-2">Create New Account</p>
          </div>
        </div>

        {/* Register Card */}
        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white">Register</CardTitle>
            <CardDescription className="text-slate-300">
              Submit your details for admin approval
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-200">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobile" className="text-slate-200">Mobile Number</Label>
                <Input
                  id="mobile"
                  type="text"
                  placeholder="01xxxxxxxxx"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-200">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="******"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? 'Submitting...' : 'Submit Registration'}
              </Button>
            </form>
            <div className="mt-4 text-center">
              <button
                onClick={onSwitchToLogin}
                className="text-sm text-slate-400 hover:text-slate-300 transition-colors"
              >
                Already have an account? Login
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-slate-400">
          © 2026. Built with ❤️ using{' '}
          <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300">
            caffeine.ai
          </a>
        </div>
      </div>
    </div>
  );
}
