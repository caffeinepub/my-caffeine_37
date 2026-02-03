import { useState } from 'react';
import { useSession } from '../../state/session/useSession';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';

interface LoginViewProps {
  onSwitchToRegister: () => void;
}

export default function LoginView({ onSwitchToRegister }: LoginViewProps) {
  const { login } = useSession();
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!mobile || !password) {
      setError('Please enter both mobile and password');
      return;
    }

    setIsLoading(true);
    const success = await login(mobile, password);
    setIsLoading(false);

    if (!success) {
      setError('Invalid credentials or account not approved');
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
            <p className="text-slate-300 mt-2">Worker Accounting Management</p>
          </div>
        </div>

        {/* Login Card */}
        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white">Login</CardTitle>
            <CardDescription className="text-slate-300">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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
              {error && (
                <div className="text-sm text-red-400 bg-red-950/30 border border-red-900/50 rounded-md p-3">
                  {error}
                </div>
              )}
              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
            <div className="mt-4 text-center">
              <button
                onClick={onSwitchToRegister}
                className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                Don't have an account? Register
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
