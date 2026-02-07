import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { safeGetArray, safeSetItem } from '../../lib/storage/safeStorage';
import { notify } from '../../components/feedback/notify';
import { useBranding } from '../../hooks/useBranding';

interface PendingRequest {
  name: string;
  mobile: string;
  password: string;
  userId: number;
}

interface RegisterViewProps {
  onBack: () => void;
}

export default function RegisterView({ onBack }: RegisterViewProps) {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const { branding } = useBranding();

  const handleRegister = () => {
    if (!name.trim() || !mobile.trim() || !password.trim()) {
      notify.error('সব ফিল্ড পূরণ করুন');
      return;
    }

    const pendingRequests = safeGetArray<PendingRequest>('pendingRequests');
    const existingRequest = pendingRequests.find(
      (req) => req.name === name.trim() || req.mobile === mobile.trim()
    );

    if (existingRequest) {
      notify.error('এই নাম বা মোবাইল নম্বর ইতিমধ্যে নিবন্ধিত');
      return;
    }

    const nextUserId = Math.max(0, ...pendingRequests.map((r) => r.userId || 0)) + 1;

    const newRequest: PendingRequest = {
      name: name.trim(),
      mobile: mobile.trim(),
      password: password.trim(),
      userId: nextUserId,
    };

    pendingRequests.push(newRequest);
    safeSetItem('pendingRequests', pendingRequests);

    notify.success('রেজিস্ট্রেশন সফল! অনুমোদনের জন্য অপেক্ষা করুন');
    setName('');
    setMobile('');
    setPassword('');
  };

  const logoUrl = branding.logoDataUrl || '/assets/generated/login-hero-illustration.dim_1024x1024.png';
  const companyName = branding.companyName || 'স্মার্ট হিসাব লেজার';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Title */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-32 h-32 rounded-full bg-white shadow-lg flex items-center justify-center p-4">
              <img
                src={logoUrl}
                alt="Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {companyName}
            </h1>
            <p className="text-gray-600 mt-2">নতুন অ্যাকাউন্ট তৈরি করুন</p>
          </div>
        </div>

        {/* Registration Form */}
        <Card className="shadow-xl border-2 border-teal-200">
          <CardHeader className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-t-lg">
            <CardTitle className="text-center text-xl">রেজিস্ট্রেশন ফর্ম</CardTitle>
            <p className="text-center text-sm text-teal-50 mt-1">আপনার তথ্য দিয়ে বিবরণ করুন</p>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base font-medium">নাম</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="আপনার নাম লিখুন"
                className="h-12 text-base border-2 border-teal-200 focus:border-teal-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobile" className="text-base font-medium">মোবাইল নম্বর</Label>
              <Input
                id="mobile"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="মোবাইল নম্বর লিখুন"
                className="h-12 text-base border-2 border-teal-200 focus:border-teal-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-base font-medium">পাসওয়ার্ড</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="পাসওয়ার্ড লিখুন"
                className="h-12 text-base border-2 border-teal-200 focus:border-teal-500"
              />
            </div>

            <Button
              onClick={handleRegister}
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white shadow-lg"
            >
              রেজিস্ট্রেশন করুন
            </Button>
          </CardContent>
        </Card>

        {/* Back to Login */}
        <div className="text-center">
          <p className="text-gray-600 mb-3">ইতিমধ্যে অ্যাকাউন্ট আছে?</p>
          <Button
            onClick={onBack}
            variant="outline"
            className="w-full h-12 text-base font-semibold border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50"
          >
            লগইন করুন
          </Button>
        </div>
      </div>
    </div>
  );
}
