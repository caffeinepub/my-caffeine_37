import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { ArrowLeft } from 'lucide-react';
import { useSession } from '../../../state/session/useSession';
import { notify } from '../../../components/feedback/notify';
import { safeGetItem, safeSetItem } from '../../../lib/storage/safeStorage';
import { useBranding } from '../../../hooks/useBranding';

interface ProfileSettingsViewProps {
  onBack: () => void;
}

interface ApprovedUser {
  mob: string;
  pass: string;
}

export default function ProfileSettingsView({ onBack }: ProfileSettingsViewProps) {
  const { session } = useSession();
  const { branding } = useBranding();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      notify.error('সব ঘর পূরণ করুন');
      return;
    }

    if (newPassword !== confirmPassword) {
      notify.error('নতুন পাসওয়ার্ড মিলছে না');
      return;
    }

    const approvedUsers = safeGetItem<ApprovedUser[]>('approved_users', []);
    const userIndex = approvedUsers.findIndex((u) => u.mob === session?.userName);

    if (userIndex === -1) {
      notify.error('ইউজার খুঁজে পাওয়া যায়নি');
      return;
    }

    if (approvedUsers[userIndex].pass !== currentPassword) {
      notify.error('বর্তমান পাসওয়ার্ড ভুল');
      return;
    }

    approvedUsers[userIndex].pass = newPassword;
    safeSetItem('approved_users', approvedUsers);

    notify.success('পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const profileImageUrl = branding.logoDataUrl || '/assets/generated/worker-avatar-placeholder.dim_512x512.png';

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg border-b-2 border-white/20 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              onClick={onBack}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 back-button-colored"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-bold section-title-accent">প্রোফাইল সেটিংস</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 space-y-6 pb-24">
        {/* Profile Photo */}
        <Card className="border-2 border-gray-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 border-b-2">
            <CardTitle className="text-lg text-white">প্রোফাইল ফটো</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-purple-200 shadow-lg">
                <img 
                  src={profileImageUrl}
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-sm text-gray-600 text-center">
                প্রোফাইল ছবি সিস্টেম সেটিংস থেকে আপডেট করা হয়
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details */}
        <Card className="border-2 border-gray-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 border-b-2">
            <CardTitle className="text-lg text-white">প্রোফাইল তথ্য</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div>
              <Label className="font-semibold">মোবাইল নম্বর</Label>
              <Input
                value={session?.userName || ''}
                disabled
                className="mt-1 bg-gray-100 border-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Password Change */}
        <Card className="border-2 border-gray-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 border-b-2">
            <CardTitle className="text-lg text-white">পাসওয়ার্ড পরিবর্তন</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <Label htmlFor="currentPassword" className="font-semibold">বর্তমান পাসওয়ার্ড</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="mt-1 border-2"
                />
              </div>
              <div>
                <Label htmlFor="newPassword" className="font-semibold">নতুন পাসওয়ার্ড</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 border-2"
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword" className="font-semibold">নতুন পাসওয়ার্ড নিশ্চিত করুন</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 border-2"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold py-3"
              >
                পাসওয়ার্ড পরিবর্তন করুন
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
