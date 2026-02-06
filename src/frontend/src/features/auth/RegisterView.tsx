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

      // Get next available user ID
      const USER_ID_COUNTER_KEY = 'user_id_counter';
      let counter = parseInt(localStorage.getItem(USER_ID_COUNTER_KEY) || '0', 10);
      counter++;
      localStorage.setItem(USER_ID_COUNTER_KEY, counter.toString());

      // Add to pending requests with pre-assigned ID
      pendingRequests.push({ 
        name: trimmedName, 
        mob: trimmedMobile, 
        pass: password,
        userId: counter
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
    <div className="min-h-screen flex flex-col items-center justify-center register-bg p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <img
              src="/assets/generated/smart-hisab-logo.dim_512x512.png"
              alt="Smart Hisab Pro"
              className="w-24 h-24 rounded-2xl shadow-2xl border-4 border-white/50"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white drop-shadow-lg">স্মার্ট হিসাব প্রো</h1>
            <p className="text-white/90 mt-2 drop-shadow">নতুন অ্যাকাউন্ট তৈরি করুন</p>
          </div>
        </div>

        {/* Register Card with vibrant styling */}
        <Card className="border-2 border-white/30 bg-white/95 backdrop-blur-lg shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-t-lg">
            <CardTitle className="text-white text-xl">রেজিস্ট্রেশন ফর্ম</CardTitle>
            <CardDescription className="text-white/90">আপনার তথ্য দিয়ে নিবন্ধন করুন</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-700 font-semibold">নাম</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="আপনার নাম লিখুন"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                  className="border-2 border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile" className="text-slate-700 font-semibold">মোবাইল নম্বর</Label>
                <Input
                  id="mobile"
                  type="tel"
                  placeholder="মোবাইল নম্বর লিখুন"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  disabled={isLoading}
                  className="border-2 border-cyan-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700 font-semibold">পাসওয়ার্ড</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="পাসওয়ার্ড লিখুন"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="border-2 border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold py-3 shadow-lg border-2 border-teal-700"
              >
                {isLoading ? 'জমা হচ্ছে...' : 'রেজিস্ট্রেশন করুন'}
              </Button>
            </form>

            <div className="text-center pt-4 border-t-2 border-gray-200">
              <p className="text-slate-600 mb-2">ইতিমধ্যে অ্যাকাউন্ট আছে?</p>
              <Button
                type="button"
                variant="outline"
                onClick={onSwitchToLogin}
                disabled={isLoading}
                className="w-full border-2 border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold"
              >
                লগইন করুন
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
