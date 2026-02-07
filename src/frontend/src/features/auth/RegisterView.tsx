import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { notify } from '../../components/feedback/notify';
import { safeGetItem, safeSetItem } from '../../lib/storage/safeStorage';
import { PendingRequest } from '../../state/session/sessionTypes';
import { useBranding } from '../../hooks/useBranding';
import { ConfirmDialog } from '../../components/feedback/ConfirmDialog';
import { useSingleConfirmSubmit } from '../../hooks/useSingleConfirmSubmit';

interface RegisterViewProps {
  onBack: () => void;
}

export default function RegisterView({ onBack }: RegisterViewProps) {
  const [name, setName] = useState('');
  const [mob, setMob] = useState('');
  const [pass, setPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [voterIdType, setVoterIdType] = useState<'nid' | 'birth'>('nid');
  const [voterId, setVoterId] = useState('');
  const { branding } = useBranding();

  const handleRegisterConfirm = async () => {
    // Validation
    if (!name.trim()) {
      notify.error('নাম লিখুন');
      return;
    }
    if (!mob.trim()) {
      notify.error('মোবাইল নম্বর লিখুন');
      return;
    }
    if (!pass.trim()) {
      notify.error('পাসওয়ার্ড লিখুন');
      return;
    }
    if (pass !== confirmPass) {
      notify.error('পাসওয়ার্ড মিলছে না');
      return;
    }
    if (!voterId.trim()) {
      notify.error('ভোটার আইডি লিখুন');
      return;
    }

    // Check for duplicates
    const pending = safeGetItem<PendingRequest[]>('pendingRequests', []) || [];
    if (pending.some((p) => p.mob === mob.trim())) {
      notify.error('এই মোবাইল নম্বর দিয়ে ইতিমধ্যে রেজিস্ট্রেশন করা হয়েছে');
      return;
    }

    // Generate userId for pending request
    const maxUserId = pending.reduce((max, p) => Math.max(max, p.userId || 0), 0);
    const newUserId = maxUserId + 1;

    // Save pending request (without voterIdType - not in PendingRequest type)
    const newRequest: PendingRequest = {
      name: name.trim(),
      mob: mob.trim(),
      pass: pass.trim(),
      userId: newUserId,
    };

    pending.push(newRequest);
    safeSetItem('pendingRequests', pending);

    notify.success('রেজিস্ট্রেশন সফল হয়েছে! অনুমোদনের জন্য অপেক্ষা করুন।');
    
    // Reset form
    setName('');
    setMob('');
    setPass('');
    setConfirmPass('');
    setVoterId('');
    setVoterIdType('nid');
    
    // Go back to login
    setTimeout(() => onBack(), 1500);
  };

  const { isSaving, showConfirm, setShowConfirm, handleSubmit } = useSingleConfirmSubmit(handleRegisterConfirm);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  return (
    <>
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
              নতুন একাউন্ট তৈরি করুন
            </p>
          </div>

          {/* Registration Card */}
          <Card className="border-4 border-white/30 shadow-2xl backdrop-blur-sm bg-white/95 rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-teal-500 to-cyan-500 border-b-4 border-white/20">
              <CardTitle className="text-2xl font-bold text-white text-center drop-shadow-md">
                রেজিস্ট্রেশন
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              <form onSubmit={handleFormSubmit} className="space-y-5">
                {/* Name Field */}
                <div>
                  <Label htmlFor="name" className="text-base font-bold text-gray-800">
                    নাম
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="আপনার নাম লিখুন"
                    className="mt-2 border-3 border-gray-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-200 rounded-xl text-base py-3"
                    disabled={isSaving}
                  />
                </div>

                {/* Mobile Field */}
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
                    className="mt-2 border-3 border-gray-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-200 rounded-xl text-base py-3"
                    disabled={isSaving}
                  />
                </div>

                {/* Password Field */}
                <div>
                  <Label htmlFor="pass" className="text-base font-bold text-gray-800">
                    পাসওয়ার্ড
                  </Label>
                  <Input
                    id="pass"
                    type="password"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    placeholder="পাসওয়ার্ড লিখুন"
                    className="mt-2 border-3 border-gray-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-200 rounded-xl text-base py-3"
                    disabled={isSaving}
                  />
                </div>

                {/* Confirm Password Field */}
                <div>
                  <Label htmlFor="confirmPass" className="text-base font-bold text-gray-800">
                    পাসওয়ার্ড নিশ্চিত করুন
                  </Label>
                  <Input
                    id="confirmPass"
                    type="password"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    placeholder="পাসওয়ার্ড আবার লিখুন"
                    className="mt-2 border-3 border-gray-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-200 rounded-xl text-base py-3"
                    disabled={isSaving}
                  />
                </div>

                {/* Voter ID Type Tabs */}
                <div>
                  <Label className="text-base font-bold text-gray-800 mb-3 block">
                    ভোটার আইডি টাইপ
                  </Label>
                  <Tabs value={voterIdType} onValueChange={(v) => setVoterIdType(v as 'nid' | 'birth')}>
                    <TabsList className="grid w-full grid-cols-2 gap-3 bg-transparent h-auto p-0">
                      <TabsTrigger
                        value="nid"
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold py-3 rounded-xl border-3 border-blue-600 shadow-lg data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:shadow-xl transition-all"
                        disabled={isSaving}
                      >
                        NID
                      </TabsTrigger>
                      <TabsTrigger
                        value="birth"
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 rounded-xl border-3 border-purple-600 shadow-lg data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:shadow-xl transition-all"
                        disabled={isSaving}
                      >
                        Birth Certificate
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                {/* Voter ID Field */}
                <div>
                  <Label htmlFor="voterId" className="text-base font-bold text-gray-800">
                    {voterIdType === 'nid' ? 'NID নম্বর' : 'জন্ম সনদ নম্বর'}
                  </Label>
                  <Input
                    id="voterId"
                    type="text"
                    value={voterId}
                    onChange={(e) => setVoterId(e.target.value)}
                    placeholder={voterIdType === 'nid' ? 'NID নম্বর লিখুন' : 'জন্ম সনদ নম্বর লিখুন'}
                    className="mt-2 border-3 border-gray-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-200 rounded-xl text-base py-3"
                    disabled={isSaving}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSaving}
                  className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold py-4 rounded-xl shadow-xl border-3 border-teal-700 transition-all active:scale-95 text-lg touch-manipulation"
                >
                  {isSaving ? 'রেজিস্ট্রেশন হচ্ছে...' : 'রেজিস্ট্রেশন করুন'}
                </Button>
              </form>

              <div className="pt-4 border-t-2 border-gray-200">
                <Button
                  onClick={onBack}
                  variant="outline"
                  disabled={isSaving}
                  className="w-full bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white font-bold py-4 rounded-xl shadow-lg border-3 border-red-600 transition-all active:scale-95 text-lg touch-manipulation"
                >
                  ফিরে যান
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title="রেজিস্ট্রেশন নিশ্চিত করুন"
        description="আপনি কি নিশ্চিত যে আপনি এই তথ্য দিয়ে রেজিস্ট্রেশন করতে চান?"
        onConfirm={handleSubmit}
        confirmText="হ্যাঁ, রেজিস্ট্রেশন করুন"
        cancelText="বাতিল করুন"
        variant="default"
      />
    </>
  );
}
