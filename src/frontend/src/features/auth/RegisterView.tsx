import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { notify } from '../../components/feedback/notify';
import { safeGetItem, safeSetItem } from '../../lib/storage/safeStorage';
import { ArrowLeft } from 'lucide-react';

interface PendingRequest {
  mob: string;
  pass: string;
  timestamp: number;
}

interface ApprovedUser {
  mob: string;
  pass: string;
}

interface RegisterViewProps {
  onBack: () => void;
}

export default function RegisterView({ onBack }: RegisterViewProps) {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [voterIdType, setVoterIdType] = useState<'nid' | 'birth'>('nid');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!mobile || !password || !confirmPassword) {
      notify.error('সব ঘর পূরণ করুন');
      return;
    }

    if (password !== confirmPassword) {
      notify.error('পাসওয়ার্ড মিলছে না');
      return;
    }

    // Check if mobile already exists in approved users
    const approvedUsers = safeGetItem<ApprovedUser[]>('approved_users', []);
    const existsInApproved = approvedUsers.some((u) => u.mob === mobile);

    if (existsInApproved) {
      notify.error('এই মোবাইল নম্বর ইতিমধ্যে নিবন্ধিত');
      return;
    }

    // Check if mobile already exists in pending requests
    const pendingReqs = safeGetItem<PendingRequest[]>('pending_reqs', []);
    const existsInPending = pendingReqs.some((r) => r.mob === mobile);

    if (existsInPending) {
      notify.error('এই মোবাইল নম্বরের জন্য ইতিমধ্যে অনুরোধ পাঠানো হয়েছে');
      return;
    }

    // Add to pending requests
    const newRequest: PendingRequest = {
      mob: mobile,
      pass: password,
      timestamp: Date.now(),
    };

    pendingReqs.push(newRequest);
    safeSetItem('pending_reqs', pendingReqs);

    notify.success('নিবন্ধন অনুরোধ পাঠানো হয়েছে। অনুমোদনের জন্য অপেক্ষা করুন।');
    setMobile('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <Card className="w-full max-w-md border-2 border-gray-200 shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white relative">
          <Button
            onClick={onBack}
            variant="ghost"
            size="sm"
            className="absolute left-2 top-2 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <CardTitle className="text-center text-xl font-bold pt-6">নতুন নিবন্ধন</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mobile" className="font-semibold">মোবাইল নম্বর</Label>
              <Input
                id="mobile"
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="01XXXXXXXXX"
                className="border-2"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="font-semibold">পাসওয়ার্ড</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="পাসওয়ার্ড লিখুন"
                className="border-2"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="font-semibold">পাসওয়ার্ড নিশ্চিত করুন</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="পাসওয়ার্ড পুনরায় লিখুন"
                className="border-2"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="font-semibold">ভোটার আইডি ধরন</Label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  onClick={() => setVoterIdType('nid')}
                  className={`font-bold transition-all border-2 ${
                    voterIdType === 'nid'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 shadow-lg'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                  }`}
                >
                  NID
                </Button>
                <Button
                  type="button"
                  onClick={() => setVoterIdType('birth')}
                  className={`font-bold transition-all border-2 ${
                    voterIdType === 'birth'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 shadow-lg'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                  }`}
                >
                  জন্ম নিবন্ধন
                </Button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3"
            >
              নিবন্ধন করুন
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
