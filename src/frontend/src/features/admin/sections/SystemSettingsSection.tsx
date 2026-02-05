import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { useBranding } from '../../../hooks/useBranding';
import { notify } from '../../../components/feedback/notify';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';

export default function SystemSettingsSection() {
  const { branding, updateBranding } = useBranding();
  const [companyName, setCompanyName] = useState(branding.companyName);
  const [channelName, setChannelName] = useState(branding.channelName);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const handleSave = () => {
    updateBranding({
      companyName,
      channelName,
    });
    notify.success('সেটিংস সফলভাবে সংরক্ষিত হয়েছে');
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        updateBranding({ logoDataUrl: dataUrl });
        notify.success('লোগো আপলোড সফল হয়েছে');
      };
      reader.readAsDataURL(file);
      setLogoFile(file);
    }
  };

  const handleResetLogo = () => {
    updateBranding({ logoDataUrl: null });
    setLogoFile(null);
    notify.success('লোগো রিসেট করা হয়েছে');
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="branding" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="branding">ব্র্যান্ডিং সেটিংস</TabsTrigger>
          <TabsTrigger value="calculation">হিসাব সেটিংস</TabsTrigger>
        </TabsList>

        <TabsContent value="branding">
          <Card className="border-indigo-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500">
              <CardTitle className="text-lg text-white">ওয়েবসাইট ব্র্যান্ডিং সেটিংস</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label htmlFor="companyName">কোম্পানির নাম</Label>
                <Input
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="কোম্পানির নাম লিখুন"
                  className="border-2"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="channelName">চ্যানেলের নাম</Label>
                <Input
                  id="channelName"
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value)}
                  placeholder="চ্যানেলের নাম লিখুন"
                  className="border-2"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo">কোম্পানি লোগো</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="flex-1 border-2"
                  />
                  <Button variant="outline" onClick={handleResetLogo} className="border-2">
                    রিসেট
                  </Button>
                </div>
                {branding.logoDataUrl && (
                  <div className="mt-2">
                    <img
                      src={branding.logoDataUrl}
                      alt="Logo Preview"
                      className="w-24 h-24 object-contain border-2 rounded"
                    />
                  </div>
                )}
              </div>

              <Button onClick={handleSave} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3">
                সংরক্ষণ করুন
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calculation">
          <Card className="border-cyan-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-cyan-500 to-blue-500">
              <CardTitle className="text-lg text-white">হিসাব পদ্ধতি সেটিংস</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border-2 border-emerald-200">
                  <h3 className="font-bold text-lg mb-2 text-emerald-800">কাস্টম হিসাব</h3>
                  <p className="text-sm text-gray-700 mb-3">প্রতিটি কর্মীর জন্য আলাদা আলাদা পরিমাণ নির্ধারণ করুন</p>
                  <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold">
                    কাস্টম হিসাব সেটআপ
                  </Button>
                </div>

                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                  <h3 className="font-bold text-lg mb-2 text-blue-800">সমানভাগ হিসাব</h3>
                  <p className="text-sm text-gray-700 mb-3">সকল কর্মীর মধ্যে সমান ভাগে বিতরণ করুন</p>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold">
                    সমানভাগ হিসাব সেটআপ
                  </Button>
                </div>

                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
                  <h3 className="font-bold text-lg mb-2 text-purple-800">নির্দিষ্ট ইউজার হিসাব</h3>
                  <p className="text-sm text-gray-700 mb-3">নির্দিষ্ট কর্মীদের জন্য বিশেষ হিসাব পদ্ধতি</p>
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold">
                    নির্দিষ্ট ইউজার সেটআপ
                  </Button>
                </div>
              </div>

              <div className="mt-6 p-4 bg-amber-50 rounded-xl border-2 border-amber-200">
                <p className="text-sm text-amber-800 font-medium">
                  💡 টিপস: এই সেটিংস ব্যবহার করে আপনি বিভিন্ন ধরনের হিসাব পদ্ধতি প্রয়োগ করতে পারবেন। প্রতিটি অপশন আলাদা আলাদা কাজের জন্য উপযুক্ত।
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
