import { useState, useEffect } from 'react';
import { ArrowLeft, Camera, User, Phone, Lock, Settings } from 'lucide-react';
import { useSession } from '../../../state/session/useSession';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { notify } from '../../../components/feedback/notify';
import { getProfilePhoto, setProfilePhoto } from '../../../lib/storage/userProfileStorage';
import DashboardFooter from '../../../components/layout/DashboardFooter';

interface ProfileSettingsViewProps {
  onBack: () => void;
}

export default function ProfileSettingsView({ onBack }: ProfileSettingsViewProps) {
  const { session } = useSession();
  const [profilePhoto, setProfilePhotoState] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    if (session?.userName) {
      const photo = getProfilePhoto(session.userName);
      setProfilePhotoState(photo);
      setName(session.userName);
    }
  }, [session?.userName]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (session?.userName) {
          setProfilePhoto(session.userName, dataUrl);
          setProfilePhotoState(dataUrl);
          notify.success('প্রোফাইল ছবি আপডেট হয়েছে');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    notify.success('প্রোফাইল সংরক্ষিত হয়েছে');
  };

  const handleChangePassword = () => {
    if (!oldPassword || !newPassword) {
      notify.error('সকল ফিল্ড পূরণ করুন');
      return;
    }
    notify.success('পাসওয়ার্ড পরিবর্তন হয়েছে');
    setOldPassword('');
    setNewPassword('');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-6 shadow-xl">
        <div className="flex items-center gap-4">
          <Button
            onClick={onBack}
            className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/40 px-4 py-2 rounded-xl font-bold"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            ফিরে যান
          </Button>
          <h1 className="text-xl font-bold text-white">সেটিংস</h1>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pt-[100px] pb-24 bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
        <div className="p-4 space-y-4">
          {/* Profile Photo Card */}
          <Card className="shadow-xl border-2 border-blue-200">
            <CardHeader className="bg-gradient-to-r from-blue-100 to-cyan-100 py-3">
              <CardTitle className="text-base font-bold text-blue-900 flex items-center gap-2">
                <Camera className="w-5 h-5" />
                প্রোফাইল ছবি
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex flex-col items-center gap-4">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-300 shadow-lg">
                  {profilePhoto ? (
                    <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-teal-400 to-cyan-500" />
                  )}
                </div>
                <label htmlFor="photo-upload" className="cursor-pointer">
                  <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg transition-colors font-bold text-sm">
                    <Camera className="w-4 h-4" />
                    <span>ছবি আপলোড করুন</span>
                  </div>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Profile Details Card */}
          <Card className="shadow-xl border-2 border-blue-200">
            <CardHeader className="bg-gradient-to-r from-blue-100 to-cyan-100 py-3">
              <CardTitle className="text-base font-bold text-blue-900 flex items-center gap-2">
                <User className="w-5 h-5" />
                প্রোফাইল তথ্য
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm">নাম</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="আপনার নাম"
                  className="border-2 text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm">ফোন নম্বর</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="ফোন নম্বর"
                  className="border-2 text-sm"
                />
              </div>
              <Button
                onClick={handleSaveProfile}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 font-bold text-sm"
              >
                সংরক্ষণ করুন
              </Button>
            </CardContent>
          </Card>

          {/* Password Change Card */}
          <Card className="shadow-xl border-2 border-blue-200">
            <CardHeader className="bg-gradient-to-r from-blue-100 to-cyan-100 py-3">
              <CardTitle className="text-base font-bold text-blue-900 flex items-center gap-2">
                <Lock className="w-5 h-5" />
                পাসওয়ার্ড পরিবর্তন
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="oldPassword" className="text-sm">পুরাতন পাসওয়ার্ড</Label>
                <Input
                  id="oldPassword"
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="পুরাতন পাসওয়ার্ড"
                  className="border-2 text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-sm">নতুন পাসওয়ার্ড</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="নতুন পাসওয়ার্ড"
                  className="border-2 text-sm"
                />
              </div>
              <Button
                onClick={handleChangePassword}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 font-bold text-sm"
              >
                পাসওয়ার্ড পরিবর্তন করুন
              </Button>
            </CardContent>
          </Card>

          {/* App Settings Card */}
          <Card className="shadow-xl border-2 border-blue-200">
            <CardHeader className="bg-gradient-to-r from-blue-100 to-cyan-100 py-3">
              <CardTitle className="text-base font-bold text-blue-900 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                অ্যাপ সেটিংস
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-sm text-muted-foreground text-center py-4">
                অ্যাপ সেটিংস শীঘ্রই আসছে...
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-20">
        <DashboardFooter onSupportClick={() => {}} />
      </div>
    </div>
  );
}
