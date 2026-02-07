import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Textarea } from '../../../components/ui/textarea';
import { Switch } from '../../../components/ui/switch';
import { notify } from '../../../components/feedback/notify';
import { getBrandingSettings, setBrandingSettings } from '../../../lib/branding/brandingStorage';
import { loadDashboardOverrides, saveDashboardOverrides, DashboardOverrides } from '../../../lib/storage/dashboardOverridesStorage';
import { loadNoticeConfig, saveNoticeConfig, NoticeConfig } from '../../../lib/storage/noticeStorage';
import { loadAdminCredentials, saveAdminCredentials, AdminCredentials } from '../../../lib/storage/adminCredentialsStorage';
import { Camera, Lock } from 'lucide-react';

export default function SystemSettingsSection() {
  const [activeTab, setActiveTab] = useState('branding');

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5 gap-1">
          <TabsTrigger 
            value="branding"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:font-bold bg-purple-100 text-purple-900 hover:bg-purple-200 transition-all"
          >
            ব্র্যান্ডিং
          </TabsTrigger>
          <TabsTrigger 
            value="labels"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white data-[state=active]:font-bold bg-blue-100 text-blue-900 hover:bg-blue-200 transition-all"
          >
            লেবেল এডিট
          </TabsTrigger>
          <TabsTrigger 
            value="notice"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-600 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:font-bold bg-amber-100 text-amber-900 hover:bg-amber-200 transition-all"
          >
            নোটিশ
          </TabsTrigger>
          <TabsTrigger 
            value="admin"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-rose-600 data-[state=active]:text-white data-[state=active]:font-bold bg-red-100 text-red-900 hover:bg-red-200 transition-all"
          >
            Admin
          </TabsTrigger>
          <TabsTrigger 
            value="sections"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:font-bold bg-emerald-100 text-emerald-900 hover:bg-emerald-200 transition-all"
          >
            সেকশন
          </TabsTrigger>
        </TabsList>

        <TabsContent value="branding">
          <BrandingTab />
        </TabsContent>

        <TabsContent value="labels">
          <LabelsTab />
        </TabsContent>

        <TabsContent value="notice">
          <NoticeTab />
        </TabsContent>

        <TabsContent value="admin">
          <AdminSettingsTab />
        </TabsContent>

        <TabsContent value="sections">
          <SectionsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function BrandingTab() {
  const [branding, setBranding] = useState(getBrandingSettings());

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        const updated = { ...branding, logoDataUrl: dataUrl };
        setBranding(updated);
        setBrandingSettings(updated);
        notify.success('লোগো আপলোড সফল হয়েছে');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setBrandingSettings(branding);
    notify.success('ব্র্যান্ডিং সেটিংস সংরক্ষিত হয়েছে');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>ব্র্যান্ডিং সেটিংস</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>কোম্পানি লোগো</Label>
          <div className="flex items-center gap-4">
            {branding.logoDataUrl && (
              <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-300">
                <img
                  src={branding.logoDataUrl}
                  alt="Company Logo"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <label htmlFor="logo-upload" className="cursor-pointer">
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-colors font-bold">
                <Camera className="w-5 h-5" />
                <span>লোগো আপলোড করুন</span>
              </div>
              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </label>
          </div>
          <p className="text-sm text-muted-foreground">
            এই লোগোটি লগইন পেজ এবং হেডারে প্রদর্শিত হবে
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyName">কোম্পানির নাম</Label>
          <Input
            id="companyName"
            value={branding.companyName}
            onChange={(e) => setBranding({ ...branding, companyName: e.target.value })}
            placeholder="কোম্পানির নাম লিখুন"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="channelName">চ্যানেলের নাম</Label>
          <Input
            id="channelName"
            value={branding.channelName}
            onChange={(e) => setBranding({ ...branding, channelName: e.target.value })}
            placeholder="চ্যানেলের নাম লিখুন"
          />
        </div>

        <Button onClick={handleSave} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold">
          সংরক্ষণ করুন
        </Button>
      </CardContent>
    </Card>
  );
}

function LabelsTab() {
  const [overrides, setOverrides] = useState<DashboardOverrides>(loadDashboardOverrides());

  const handleSave = () => {
    saveDashboardOverrides(overrides);
    notify.success('লেবেল সেটিংস সংরক্ষিত হয়েছে');
  };

  const sections = [
    { key: 'productionLabel' as keyof DashboardOverrides, label: 'প্রোডাকশন' },
    { key: 'workLabel' as keyof DashboardOverrides, label: 'কাজ' },
    { key: 'nastaLabel' as keyof DashboardOverrides, label: 'নাস্তা' },
    { key: 'paymentLabel' as keyof DashboardOverrides, label: 'পেমেন্ট/লোন' },
    { key: 'requestLabel' as keyof DashboardOverrides, label: 'ইউজার রিকুয়েস্ট' },
    { key: 'settingsLabel' as keyof DashboardOverrides, label: 'সেটিংস' },
    { key: 'rateLabel' as keyof DashboardOverrides, label: 'রেট' },
    { key: 'balanceLabel' as keyof DashboardOverrides, label: 'চূড়ান্ত ব্যালেন্স' },
    { key: 'reportLabel' as keyof DashboardOverrides, label: 'কোম্পানি রিপোর্ট' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>ড্যাশবোর্ড লেবেল কাস্টমাইজ করুন</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sections.map((section) => (
          <div key={section.key} className="space-y-2">
            <Label htmlFor={section.key}>{section.label}</Label>
            <Input
              id={section.key}
              value={overrides[section.key] || ''}
              onChange={(e) => setOverrides({ ...overrides, [section.key]: e.target.value })}
              placeholder={section.label}
            />
          </div>
        ))}

        <Button onClick={handleSave} className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold">
          সংরক্ষণ করুন
        </Button>
      </CardContent>
    </Card>
  );
}

function NoticeTab() {
  const [config, setConfig] = useState<NoticeConfig>(loadNoticeConfig());

  const handleSave = () => {
    saveNoticeConfig(config);
    notify.success('নোটিশ সেটিংস সংরক্ষিত হয়েছে');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>ইউজার ড্যাশবোর্ড নোটিশ</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="notice-enabled">নোটিশ সক্রিয় করুন</Label>
          <Switch
            id="notice-enabled"
            checked={config.enabled}
            onCheckedChange={(checked) => setConfig({ ...config, enabled: checked })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notice-text">নোটিশ টেক্সট</Label>
          <Textarea
            id="notice-text"
            value={config.text}
            onChange={(e) => setConfig({ ...config, text: e.target.value })}
            placeholder="নোটিশ টেক্সট লিখুন..."
            rows={3}
          />
        </div>

        <Button onClick={handleSave} className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold">
          সংরক্ষণ করুন
        </Button>
      </CardContent>
    </Card>
  );
}

function AdminSettingsTab() {
  const [credentials, setCredentials] = useState<AdminCredentials>(loadAdminCredentials());
  const [error, setError] = useState<string>('');

  const handleSave = () => {
    setError('');
    
    if (!credentials.username.trim() || !credentials.password.trim()) {
      setError('Username and password cannot be empty');
      notify.error('Username and password cannot be empty');
      return;
    }

    try {
      saveAdminCredentials(credentials);
      notify.success('Admin credentials updated successfully. Please log out and log in again with the new credentials.');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save credentials';
      setError(errorMessage);
      notify.error(errorMessage);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="w-5 h-5" />
          Admin Credentials
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-amber-800">
            <strong>Important:</strong> After changing your admin credentials, you will need to log out and log in again with the new username and password.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="admin-username">Admin Username</Label>
          <Input
            id="admin-username"
            type="text"
            value={credentials.username}
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
            placeholder="Enter admin username"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="admin-password">Admin Password</Label>
          <Input
            id="admin-password"
            type="password"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            placeholder="Enter admin password"
          />
        </div>

        <Button onClick={handleSave} className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold">
          Save Admin Credentials
        </Button>
      </CardContent>
    </Card>
  );
}

function SectionsTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>সেকশন ম্যানেজমেন্ট</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-lg font-medium mb-2">সেকশন ম্যানেজমেন্ট</p>
          <p className="text-sm">
            এখানে আপনি নতুন সেকশন যোগ করতে পারবেন এবং প্রতিটি সেকশনের জন্য ডিফল্ট রেট এবং ইউজার-নির্দিষ্ট রেট সেট করতে পারবেন।
          </p>
          <p className="text-sm mt-4 text-amber-600 font-medium">
            এই ফিচারটি শীঘ্রই আসছে...
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
