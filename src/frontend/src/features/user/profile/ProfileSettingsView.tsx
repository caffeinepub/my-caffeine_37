import { useState, useEffect } from 'react';
import { ArrowLeft, Camera, User, Phone, Lock, Settings } from 'lucide-react';
import { useSession } from '../../../state/session/useSession';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { notify } from '../../../components/feedback/notify';
import { getProfilePhoto, setProfilePhoto } from '../../../lib/storage/userProfileStorage';
import DashboardFooter from '../../../components/layout/DashboardFooter';

interface ProfileSettingsViewProps {
  onBack: () => void;
}

export default function ProfileSettingsView({ onBack }: ProfileSettingsViewProps) {
  const { session, updateUserProfile } = useSession();
  const [profilePhoto, setProfilePhotoState] = useState<string | null>(null);
  const [newMobile, setNewMobile] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showMobileDialog, setShowMobileDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session?.userName) {
      const photo = getProfilePhoto(session.userName);
      setProfilePhotoState(photo);
      setNewMobile(session.mobile || '');
    }
  }, [session]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      notify.error('ছবির সাইজ ৫ MB এর কম হতে হবে');
      return;
    }

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
  };

  const handleMobileChange = async () => {
    if (!session?.userName || !newMobile.trim()) {
      notify.error('মোবাইল নাম্বার দিন');
      return;
    }

    if (newMobile === session.mobile) {
      notify.info('এটি আপনার বর্তমান মোবাইল নাম্বার');
      setShowMobileDialog(false);
      return;
    }

    if (!/^01[0-9]{9}$/.test(newMobile)) {
      notify.error('সঠিক মোবাইল নাম্বার দিন (১১ ডিজিট)');
      return;
    }

    setIsLoading(true);
    try {
      const result = await updateUserProfile({ mobile: newMobile });
      if (result.success) {
        notify.success('মোবাইল নাম্বার আপডেট হয়েছে');
        setShowMobileDialog(false);
      } else {
        notify.error(result.error || 'মোবাইল নাম্বার আপডেট করতে সমস্যা হয়েছে');
      }
    } catch (error) {
      notify.error('মোবাইল নাম্বার আপডেট করতে সমস্যা হয়েছে');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      notify.error('সব ফিল্ড পূরণ করুন');
      return;
    }

    if (newPassword !== confirmPassword) {
      notify.error('নতুন পাসওয়ার্ড মিলছে না');
      return;
    }

    if (newPassword.length < 4) {
      notify.error('পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে');
      return;
    }

    setIsLoading(true);
    try {
      const result = await updateUserProfile({ 
        currentPassword, 
        newPassword 
      });
      
      if (result.success) {
        notify.success('পাসওয়ার্ড আপডেট হয়েছে');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setShowPasswordDialog(false);
      } else {
        notify.error(result.error || 'পাসওয়ার্ড আপডেট করতে সমস্যা হয়েছে');
      }
    } catch (error) {
      notify.error('পাসওয়ার্ড আপডেট করতে সমস্যা হয়েছে');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-gradient-to-r from-teal-600 to-cyan-600 px-4 py-6 shadow-lg">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-2xl font-bold text-white">প্রোফাইল সেটিংস</h1>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pt-[100px] pb-24 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="p-4 space-y-4 max-w-2xl mx-auto">
          {/* Profile Photo Card */}
          <Card className="rounded-3xl border-4 border-gray-800 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                প্রোফাইল ছবি
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-teal-500 shadow-lg">
                    {profilePhoto ? (
                      <img
                        src={profilePhoto}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center">
                        <User className="w-16 h-16 text-white" />
                      </div>
                    )}
                  </div>
                  <label
                    htmlFor="photo-upload"
                    className="absolute bottom-0 right-0 p-2 rounded-full bg-teal-600 text-white cursor-pointer hover:bg-teal-700 transition-colors shadow-lg"
                  >
                    <Camera className="w-5 h-5" />
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoUpload}
                    />
                  </label>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  ছবি আপলোড করতে ক্যামেরা আইকনে ক্লিক করুন
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Profile Details Card */}
          <Card className="rounded-3xl border-4 border-gray-800 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                প্রোফাইল তথ্য
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>নাম</Label>
                <Input
                  value={session?.userName || ''}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label>মোবাইল নাম্বার</Label>
                <div className="flex gap-2">
                  <Input
                    value={session?.mobile || ''}
                    disabled
                    className="bg-muted flex-1"
                  />
                  <Button
                    onClick={() => setShowMobileDialog(true)}
                    variant="outline"
                    size="icon"
                  >
                    <Phone className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Change Password Card */}
          <Card className="rounded-3xl border-4 border-gray-800 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                পাসওয়ার্ড পরিবর্তন
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => setShowPasswordDialog(true)}
                className="w-full"
                variant="outline"
              >
                <Lock className="w-4 h-4 mr-2" />
                পাসওয়ার্ড পরিবর্তন করুন
              </Button>
            </CardContent>
          </Card>

          {/* Settings Button Card */}
          <Card className="rounded-3xl border-4 border-gray-800 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                সেটিংস
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => setShowSettingsDialog(true)}
                className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white"
              >
                <Settings className="w-4 h-4 mr-2" />
                সেটিংস খুলুন
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-20">
        <DashboardFooter onSupportClick={() => {}} />
      </div>

      {/* Mobile Change Dialog */}
      <Dialog open={showMobileDialog} onOpenChange={setShowMobileDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>মোবাইল নাম্বার পরিবর্তন</DialogTitle>
            <DialogDescription>
              নতুন মোবাইল নাম্বার দিন
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>নতুন মোবাইল নাম্বার</Label>
              <Input
                type="tel"
                placeholder="01XXXXXXXXX"
                value={newMobile}
                onChange={(e) => setNewMobile(e.target.value)}
                maxLength={11}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowMobileDialog(false)}
              disabled={isLoading}
            >
              বাতিল করুন
            </Button>
            <Button
              onClick={handleMobileChange}
              disabled={isLoading}
            >
              {isLoading ? 'আপডেট হচ্ছে...' : 'আপডেট করুন'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Password Change Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>পাসওয়ার্ড পরিবর্তন</DialogTitle>
            <DialogDescription>
              বর্তমান এবং নতুন পাসওয়ার্ড দিন
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>বর্তমান পাসওয়ার্ড</Label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>নতুন পাসওয়ার্ড</Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>নতুন পাসওয়ার্ড নিশ্চিত করুন</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowPasswordDialog(false)}
              disabled={isLoading}
            >
              বাতিল করুন
            </Button>
            <Button
              onClick={handlePasswordChange}
              disabled={isLoading}
            >
              {isLoading ? 'আপডেট হচ্ছে...' : 'আপডেট করুন'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              সেটিংস
            </DialogTitle>
            <DialogDescription>
              অ্যাপ্লিকেশন সেটিংস এবং পছন্দসমূহ
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <div className="text-center text-muted-foreground">
              <Settings className="w-16 h-16 mx-auto mb-4 text-teal-600" />
              <p className="text-lg font-medium mb-2">সেটিংস বিভাগ</p>
              <p className="text-sm">
                এখানে আপনার অ্যাপ্লিকেশন সেটিংস এবং পছন্দসমূহ পরিচালনা করতে পারবেন।
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setShowSettingsDialog(false)}
              className="w-full"
            >
              বন্ধ করুন
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
