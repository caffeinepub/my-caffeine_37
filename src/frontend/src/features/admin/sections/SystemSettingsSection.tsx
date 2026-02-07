import { useState, useRef, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { notify } from '../../../components/feedback/notify';
import { loadLabelSettings, saveLabelSettings, type LabelEntry } from '../../../lib/storage/labelSettingsStorage';
import { loadLayoutRules, saveLayoutRules, type SectionLayoutRule } from '../../../lib/storage/adminDashboardLayoutRulesStorage';
import { getBrandingSettings, setBrandingSettings, type BrandingSettings } from '../../../lib/branding/brandingStorage';
import { exportBackup, importBackup } from '../../../lib/storage/backupRestore';
import { Upload, Download, Plus, Trash2, Image as ImageIcon, X } from 'lucide-react';
import { loadCustomSections, saveCustomSections, type CustomSection } from '../../../lib/storage/customSectionsStorage';
import { loadUserSharingSettings, saveUserSharingSettings, type UserSharingSettings } from '../../../lib/storage/userSharingSettingsStorage';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { useInternetIdentity } from '../../../hooks/useInternetIdentity';
import { setAdminProfilePhoto, getAdminProfilePhoto } from '../../../lib/storage/userProfileStorage';
import { loadMtLoanSettings, saveMtLoanSettings, type MtLoanSettings } from '../../../lib/storage/mtLoanSettingsStorage';

export default function SystemSettingsSection() {
  const [activeTab, setActiveTab] = useState('labels');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const profilePhotoInputRef = useRef<HTMLInputElement>(null);
  const { identity } = useInternetIdentity();

  // MT Loan settings state
  const [mtLoanSettings, setMtLoanSettings] = useState<MtLoanSettings>(() => loadMtLoanSettings());

  // Labels state
  const [labels, setLabels] = useState<LabelEntry[]>(() => loadLabelSettings());

  // Layout state
  const [layoutRules, setLayoutRules] = useState<SectionLayoutRule[]>(() => loadLayoutRules());
  const [customSections, setCustomSections] = useState<CustomSection[]>(() => loadCustomSections());

  // Branding state
  const [branding, setBranding] = useState<BrandingSettings>(() => getBrandingSettings());

  // User sharing state
  const [userSharing, setUserSharing] = useState<UserSharingSettings>(() => loadUserSharingSettings());

  // Profile photo state
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    // Load existing profile photo
    const existingPhoto = getAdminProfilePhoto();
    setProfilePhotoPreview(existingPhoto);
  }, []);

  const handleSaveMtLoanSettings = () => {
    if (!mtLoanSettings.name.trim()) {
      notify.error('নাম প্রয়োজন');
      return;
    }
    if (!mtLoanSettings.password.trim()) {
      notify.error('পাসওয়ার্ড প্রয়োজন');
      return;
    }
    saveMtLoanSettings(mtLoanSettings);
    notify.success('MT Loan সেটিংস সংরক্ষিত হয়েছে');
  };

  const handleSaveLabels = () => {
    saveLabelSettings(labels);
    notify.success('লেবেল সংরক্ষিত হয়েছে');
  };

  const handleSaveLayout = () => {
    saveLayoutRules(layoutRules);
    saveCustomSections(customSections);
    notify.success('লেআউট সংরক্ষিত হয়েছে');
  };

  const handleSaveBranding = () => {
    setBrandingSettings(branding);
    notify.success('ব্র্যান্ডিং সংরক্ষিত হয়েছে');
  };

  const handleSaveUserSharing = () => {
    saveUserSharingSettings(userSharing);
    notify.success('ইউজার শেয়ারিং সেটিংস সংরক্ষিত হয়েছে');
  };

  const handleAddCustomSection = () => {
    const newSection: CustomSection = {
      id: `custom-${Date.now()}`,
      label: 'নতুন সেকশন',
      size: 'medium',
      placement: 'bottom',
    };
    setCustomSections([...customSections, newSection]);
  };

  const handleRemoveCustomSection = (id: string) => {
    setCustomSections(customSections.filter(s => s.id !== id));
  };

  const handleExportBackup = () => {
    exportBackup();
  };

  const handleImportBackup = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await importBackup(file);
      // Reload all settings after import
      setMtLoanSettings(loadMtLoanSettings());
      setLabels(loadLabelSettings());
      setLayoutRules(loadLayoutRules());
      setCustomSections(loadCustomSections());
      setBranding(getBrandingSettings());
      setUserSharing(loadUserSharingSettings());
      notify.success('ব্যাকআপ সফলভাবে ইম্পোর্ট হয়েছে');
    } catch (error) {
      notify.error('ব্যাকআপ ইম্পোর্ট ব্যর্থ হয়েছে');
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      notify.error('শুধুমাত্র ইমেজ ফাইল আপলোড করুন');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setBranding({ ...branding, logoDataUrl: dataUrl });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setBranding({ ...branding, logoDataUrl: null });
  };

  const handleProfilePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      notify.error('শুধুমাত্র ইমেজ ফাইল (JPG, PNG, GIF, WebP) আপলোড করুন');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setProfilePhotoPreview(dataUrl);
      
      try {
        setAdminProfilePhoto(dataUrl);
        // Dispatch custom event for immediate UI refresh
        window.dispatchEvent(new CustomEvent('admin-profile-photo-updated'));
        notify.success('প্রোফাইল ছবি সংরক্ষিত হয়েছে');
      } catch (error) {
        notify.error('ছবি সংরক্ষণ করতে সমস্যা হয়েছে');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveProfilePhoto = () => {
    setProfilePhotoPreview(null);
    try {
      localStorage.removeItem('admin_profile_photo');
      window.dispatchEvent(new CustomEvent('admin-profile-photo-updated'));
      notify.success('প্রোফাইল ছবি মুছে ফেলা হয়েছে');
    } catch (error) {
      notify.error('ছবি মুছতে সমস্যা হয়েছে');
    }
  };

  return (
    <div className="space-y-4">
      {/* MT Loan Settings Card - Top Section */}
      <Card className="border-2 border-orange-200 shadow-xl rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 border-b-2">
          <CardTitle className="text-lg font-bold text-white">MT Loan সেটিংস</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div>
            <Label htmlFor="mt-loan-name" className="text-sm font-semibold text-gray-700">
              নাম
            </Label>
            <Input
              id="mt-loan-name"
              type="text"
              value={mtLoanSettings.name}
              onChange={(e) => setMtLoanSettings({ ...mtLoanSettings, name: e.target.value })}
              placeholder="MT Loan ইউজারের নাম"
              className="mt-2 border-2 admin-input-style"
            />
          </div>
          <div>
            <Label htmlFor="mt-loan-password" className="text-sm font-semibold text-gray-700">
              পাসওয়ার্ড
            </Label>
            <Input
              id="mt-loan-password"
              type="password"
              value={mtLoanSettings.password}
              onChange={(e) => setMtLoanSettings({ ...mtLoanSettings, password: e.target.value })}
              placeholder="পাসওয়ার্ড সেট করুন"
              className="mt-2 border-2 admin-input-style"
            />
          </div>
          <Button
            onClick={handleSaveMtLoanSettings}
            className="w-full font-bold bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white py-3 rounded-xl shadow-lg touch-manipulation"
          >
            সংরক্ষণ করুন
          </Button>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200 p-2 mb-4 shadow-md">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5 gap-2 bg-transparent h-auto">
            <TabsTrigger 
              value="labels" 
              className="text-xs sm:text-sm font-bold py-3 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
            >
              লেবেল
            </TabsTrigger>
            <TabsTrigger 
              value="layout" 
              className="text-xs sm:text-sm font-bold py-3 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
            >
              লেআউট
            </TabsTrigger>
            <TabsTrigger 
              value="branding" 
              className="text-xs sm:text-sm font-bold py-3 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
            >
              ব্র্যান্ডিং
            </TabsTrigger>
            <TabsTrigger 
              value="sharing" 
              className="text-xs sm:text-sm font-bold py-3 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
            >
              শেয়ারিং
            </TabsTrigger>
            <TabsTrigger 
              value="backup" 
              className="text-xs sm:text-sm font-bold py-3 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
            >
              ব্যাকআপ
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Labels Tab */}
        <TabsContent value="labels" className="space-y-3 mt-4">
          <Card className="border-2 border-gray-200 shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 border-b-2">
              <CardTitle className="text-lg font-bold text-white">সব লেবেল পরিবর্তন করুন</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-3">
                  {labels.map((label, index) => (
                    <div key={label.key} className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 border-2 rounded-xl bg-gray-50 shadow-sm">
                      <div>
                        <Label className="text-xs font-semibold text-gray-700">সিরিয়াল</Label>
                        <Input
                          type="number"
                          value={label.serial}
                          onChange={(e) => {
                            const updated = [...labels];
                            updated[index].serial = parseInt(e.target.value) || 0;
                            setLabels(updated);
                          }}
                          className="mt-1 border-2 admin-input-style"
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-semibold text-gray-700">ডিফল্ট নাম</Label>
                        <Input
                          value={label.defaultLabel}
                          disabled
                          className="mt-1 bg-gray-100 border-2"
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-semibold text-gray-700">কাস্টম নাম</Label>
                        <Input
                          value={label.overrideLabel || ''}
                          onChange={(e) => {
                            const updated = [...labels];
                            updated[index].overrideLabel = e.target.value || undefined;
                            setLabels(updated);
                          }}
                          placeholder="খালি রাখলে ডিফল্ট"
                          className="mt-1 border-2 admin-input-style"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="mt-4">
                <Button 
                  onClick={handleSaveLabels} 
                  className="w-full font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-xl shadow-lg"
                >
                  লেবেল সংরক্ষণ করুন
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Layout Tab */}
        <TabsContent value="layout" className="space-y-3 mt-4">
          <Card className="border-2 border-gray-200 shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 border-b-2">
              <CardTitle className="text-lg font-bold text-white">কাস্টম সেকশন যোগ করুন</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              <ScrollArea className="h-[300px] pr-4">
                {customSections.map((section, index) => (
                  <div key={section.id} className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3 border-2 rounded-xl mb-3 bg-gray-50 shadow-sm">
                    <div>
                      <Label className="text-xs font-semibold">লেবেল</Label>
                      <Input
                        value={section.label}
                        onChange={(e) => {
                          const updated = [...customSections];
                          updated[index].label = e.target.value;
                          setCustomSections(updated);
                        }}
                        className="mt-1 border-2 admin-input-style"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-semibold">সাইজ</Label>
                      <Select
                        value={section.size}
                        onValueChange={(value: 'small' | 'medium' | 'large') => {
                          const updated = [...customSections];
                          updated[index].size = value;
                          setCustomSections(updated);
                        }}
                      >
                        <SelectTrigger className="mt-1 border-2 admin-select-trigger">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="admin-select-content">
                          <SelectItem value="small">ছোট</SelectItem>
                          <SelectItem value="medium">মাঝারি</SelectItem>
                          <SelectItem value="large">বড়</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs font-semibold">স্থান</Label>
                      <Select
                        value={section.placement}
                        onValueChange={(value: 'top' | 'bottom') => {
                          const updated = [...customSections];
                          updated[index].placement = value;
                          setCustomSections(updated);
                        }}
                      >
                        <SelectTrigger className="mt-1 border-2 admin-select-trigger">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="admin-select-content">
                          <SelectItem value="top">উপরে</SelectItem>
                          <SelectItem value="bottom">নিচে</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-end">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveCustomSection(section.id)}
                        className="w-full font-bold rounded-lg touch-manipulation"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </ScrollArea>
              <Button 
                onClick={handleAddCustomSection} 
                variant="outline" 
                className="w-full font-bold border-2 rounded-xl touch-manipulation"
              >
                <Plus className="w-4 h-4 mr-2" />
                নতুন সেকশন যোগ করুন
              </Button>
              <Button 
                onClick={handleSaveLayout} 
                className="w-full font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-xl shadow-lg touch-manipulation"
              >
                লেআউট সংরক্ষণ করুন
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Branding Tab */}
        <TabsContent value="branding" className="space-y-3 mt-4">
          {/* Admin Profile Photo Card */}
          <Card className="border-2 border-gray-200 shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-teal-500 to-cyan-500 border-b-2">
              <CardTitle className="text-lg font-bold text-white">এডমিন প্রোফাইল ছবি</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              <div className="flex flex-col items-center gap-3">
                {profilePhotoPreview ? (
                  <div className="relative">
                    <img
                      src={profilePhotoPreview}
                      alt="Profile Preview"
                      className="w-32 h-32 rounded-full object-cover border-4 border-teal-500 shadow-lg"
                    />
                    <button
                      onClick={handleRemoveProfilePhoto}
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-2 shadow-lg hover:bg-red-700 transition-all touch-manipulation"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-300">
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                <input
                  ref={profilePhotoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePhotoUpload}
                  className="hidden"
                />
                <Button
                  onClick={() => profilePhotoInputRef.current?.click()}
                  className="w-full font-bold bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white py-3 rounded-xl shadow-lg touch-manipulation"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {profilePhotoPreview ? 'ছবি পরিবর্তন করুন' : 'ছবি আপলোড করুন'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Company Branding Card */}
          <Card className="border-2 border-gray-200 shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 border-b-2">
              <CardTitle className="text-lg font-bold text-white">কোম্পানি ব্র্যান্ডিং</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              <div>
                <Label className="text-sm font-semibold text-gray-700">কোম্পানির নাম</Label>
                <Input
                  value={branding.companyName}
                  onChange={(e) => setBranding({ ...branding, companyName: e.target.value })}
                  placeholder="কোম্পানির নাম"
                  className="mt-2 border-2 admin-input-style"
                />
              </div>
              <div>
                <Label className="text-sm font-semibold text-gray-700">চ্যানেলের নাম</Label>
                <Input
                  value={branding.channelName}
                  onChange={(e) => setBranding({ ...branding, channelName: e.target.value })}
                  placeholder="চ্যানেলের নাম"
                  className="mt-2 border-2 admin-input-style"
                />
              </div>
              <div>
                <Label className="text-sm font-semibold text-gray-700">লোগো</Label>
                <div className="mt-2 flex flex-col items-center gap-3">
                  {branding.logoDataUrl ? (
                    <div className="relative">
                      <img
                        src={branding.logoDataUrl}
                        alt="Logo Preview"
                        className="w-32 h-32 object-contain border-2 border-gray-300 rounded-lg"
                      />
                      <button
                        onClick={handleRemoveLogo}
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-2 shadow-lg hover:bg-red-700 transition-all touch-manipulation"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                      <ImageIcon className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <Button
                    onClick={() => logoInputRef.current?.click()}
                    variant="outline"
                    className="w-full font-bold border-2 rounded-xl touch-manipulation"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {branding.logoDataUrl ? 'লোগো পরিবর্তন করুন' : 'লোগো আপলোড করুন'}
                  </Button>
                </div>
              </div>
              <Button 
                onClick={handleSaveBranding} 
                className="w-full font-bold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 rounded-xl shadow-lg touch-manipulation"
              >
                ব্র্যান্ডিং সংরক্ষণ করুন
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sharing Tab */}
        <TabsContent value="sharing" className="space-y-3 mt-4">
          <Card className="border-2 border-gray-200 shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-pink-500 to-rose-500 border-b-2">
              <CardTitle className="text-lg font-bold text-white">ইউজার শেয়ারিং সেটিংস</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div>
                <Label className="text-sm font-semibold text-gray-700">বিতরণ মোড</Label>
                <Select
                  value={userSharing.distributionMode}
                  onValueChange={(value: 'equal' | 'weighted' | 'manual') => 
                    setUserSharing({ ...userSharing, distributionMode: value })
                  }
                >
                  <SelectTrigger className="mt-2 border-2 admin-select-trigger">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="admin-select-content">
                    <SelectItem value="equal">সমান ভাগ</SelectItem>
                    <SelectItem value="weighted">ওজনযুক্ত ভাগ</SelectItem>
                    <SelectItem value="manual">ম্যানুয়াল ভাগ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-semibold text-gray-700">ডিফল্ট শেয়ার শতাংশ</Label>
                <Input
                  type="number"
                  value={userSharing.defaultSharePercentage}
                  onChange={(e) => 
                    setUserSharing({ 
                      ...userSharing, 
                      defaultSharePercentage: parseFloat(e.target.value) || 0 
                    })
                  }
                  placeholder="শতাংশ"
                  className="mt-2 border-2 admin-input-style"
                />
              </div>
              <div>
                <Label className="text-sm font-semibold text-gray-700">সর্বনিম্ন ইউজার</Label>
                <Input
                  type="number"
                  value={userSharing.minUsers}
                  onChange={(e) => 
                    setUserSharing({ 
                      ...userSharing, 
                      minUsers: parseInt(e.target.value) || 1 
                    })
                  }
                  placeholder="সর্বনিম্ন ইউজার সংখ্যা"
                  className="mt-2 border-2 admin-input-style"
                />
              </div>
              <Button 
                onClick={handleSaveUserSharing} 
                className="w-full font-bold bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white py-3 rounded-xl shadow-lg touch-manipulation"
              >
                শেয়ারিং সেটিংস সংরক্ষণ করুন
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Backup Tab */}
        <TabsContent value="backup" className="space-y-3 mt-4">
          <Card className="border-2 border-gray-200 shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 border-b-2">
              <CardTitle className="text-lg font-bold text-white">ব্যাকআপ এবং রিস্টোর</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              <Button 
                onClick={handleExportBackup} 
                className="w-full font-bold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 rounded-xl shadow-lg touch-manipulation"
              >
                <Download className="w-4 h-4 mr-2" />
                ব্যাকআপ ডাউনলোড করুন
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImportBackup}
                className="hidden"
              />
              <Button 
                onClick={() => fileInputRef.current?.click()} 
                variant="outline"
                className="w-full font-bold border-2 rounded-xl touch-manipulation"
              >
                <Upload className="w-4 h-4 mr-2" />
                ব্যাকআপ আপলোড করুন
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
