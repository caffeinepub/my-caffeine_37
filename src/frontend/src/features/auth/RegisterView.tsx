import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { safeGetArray, safeSetItem } from '../../lib/storage/safeStorage';
import { notify } from '../../components/feedback/notify';
import { PendingRequest, ApprovedUser } from '../../state/session/sessionTypes';

interface RegisterViewProps {
  onSwitchToLogin: () => void;
}

export default function RegisterView({ onSwitchToLogin }: RegisterViewProps) {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !mobile.trim() || !password) {
      notify.error('সব ফিল্ড পূরণ করুন');
      return;
    }

    setIsLoading(true);

    try {
      const trimmedName = name.trim();
      const trimmedMobile = mobile.trim();

      // Check for duplicate mobile in pending requests
      const pendingRequests = safeGetArray<PendingRequest>('pending_reqs');
      const mobileExistsInPending = pendingRequests.some((req) => req.mob === trimmedMobile);
      
      if (mobileExistsInPending) {
        notify.error('এই মোবাইল নম্বর দিয়ে ইতিমধ্যে রেজিস্ট্রেশন রিকোয়েস্ট করা হয়েছে');
        setIsLoading(false);
        return;
      }

      // Check for duplicate name in pending requests
      const nameExistsInPending = pendingRequests.some((req) => req.name === trimmedName);
      
      if (nameExistsInPending) {
        notify.error('এই নাম দিয়ে ইতিমধ্যে রেজিস্ট্রেশন রিকোয়েস্ট করা হয়েছে');
        setIsLoading(false);
        return;
      }

      // Check for duplicate mobile in approved users
      const approvedUsers = safeGetArray<ApprovedUser>('approved_users');
      const mobileExistsInApproved = approvedUsers.some((user) => user.mob === trimmedMobile);
      
      if (mobileExistsInApproved) {
        notify.error('এই মোবাইল নম্বর দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট আছে');
        setIsLoading(false);
        return;
      }

      // Check for duplicate name in approved users
      const nameExistsInApproved = approvedUsers.some((user) => user.name === trimmedName);
      
      if (nameExistsInApproved) {
        notify.error('এই নাম দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট আছে');
        setIsLoading(false);
        return;
      }

      // Add to pending requests
      pendingRequests.push({ 
        name: trimmedName, 
        mob: trimmedMobile, 
        pass: password 
      });
      safeSetItem('pending_reqs', pendingRequests);

      notify.success('রেজিস্ট্রেশন রিকোয়েস্ট জমা হয়েছে! অ্যাডমিন অনুমোদনের জন্য অপেক্ষা করুন।');
      
      setTimeout(() => {
        onSwitchToLogin();
      }, 1500);
    } catch (error) {
      console.error('Registration error:', error);
      notify.error('রেজিস্ট্রেশন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <img
              src="/assets/generated/smart-hisab-logo.dim_512x512.png"
              alt="Smart Hisab Pro"
              className="w-24 h-24 rounded-2xl shadow-xl"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">স্মার্ট হিসাব প্রো</h1>
            <p className="text-slate-600 mt-2">নতুন অ্যাকাউন্ট তৈরি করুন</p>
          </div>
        </div>

        {/* Register Card */}
        <Card className="border-primary/20 bg-white/90 backdrop-blur shadow-xl">
          <CardHeader>
            <CardTitle className="text-slate-800">রেজিস্ট্রেশন</CardTitle>
            <CardDescription className="text-slate-600">
              অ্যাডমিন অনুমোদনের জন্য আপনার তথ্য জমা দিন
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-700">পুরো নাম</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="আপনার নাম লিখুন"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white border-slate-300 text-slate-800 placeholder:text-slate-400"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobile" className="text-slate-700">মোবাইল নম্বর</Label>
                <Input
                  id="mobile"
                  type="text"
                  placeholder="01xxxxxxxxx"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="bg-white border-slate-300 text-slate-800 placeholder:text-slate-400"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700">পাসওয়ার্ড</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="******"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white border-slate-300 text-slate-800 placeholder:text-slate-400"
                  disabled={isLoading}
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-success hover:bg-success/90 text-white font-semibold shadow-md"
                disabled={isLoading}
              >
                {isLoading ? 'জমা হচ্ছে...' : 'রেজিস্ট্রেশন জমা দিন'}
              </Button>
            </form>
            <div className="mt-4 text-center">
              <button
                onClick={onSwitchToLogin}
                className="text-sm text-slate-600 hover:text-slate-800 transition-colors"
                disabled={isLoading}
              >
                ইতিমধ্যে অ্যাকাউন্ট আছে? লগইন করুন
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-slate-600">
          © 2026. Built with ❤️ using{' '}
          <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80">
            caffeine.ai
          </a>
        </div>
      </div>
    </div>
  );
}
