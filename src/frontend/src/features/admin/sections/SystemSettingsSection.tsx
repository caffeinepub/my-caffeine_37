import { useState, useRef } from 'react';
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

export default function SystemSettingsSection() {
  const [activeTab, setActiveTab] = useState('labels');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Labels state
  const [labels, setLabels] = useState<LabelEntry[]>(() => loadLabelSettings());

  // Layout state
  const [layoutRules, setLayoutRules] = useState<SectionLayoutRule[]>(() => loadLayoutRules());
  const [customSections, setCustomSections] = useState<CustomSection[]>(() => loadCustomSections());

  // Branding state
  const [branding, setBranding] = useState<BrandingSettings>(() => getBrandingSettings());

  // User sharing state
  const [userSharing, setUserSharing] = useState<UserSharingSettings>(() => loadUserSharingSettings());

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

  return (
    <div className="space-y-5">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200 p-2 mb-5 shadow-md">
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
        <TabsContent value="labels" className="space-y-4 mt-6">
          <Card className="border-2 border-gray-200 shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 border-b-2">
              <CardTitle className="text-lg font-bold text-white">সব লেবেল পরিবর্তন করুন</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ScrollArea className="h-[450px] pr-4">
                <div className="space-y-4">
                  {labels.map((label, index) => (
                    <div key={label.key} className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 border-2 rounded-xl bg-gray-50 shadow-sm">
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
              <div className="mt-6">
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
        <TabsContent value="layout" className="space-y-4 mt-6">
          <Card className="border-2 border-gray-200 shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 border-b-2">
              <CardTitle className="text-lg font-bold text-white">কাস্টম সেকশন যোগ করুন</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <ScrollArea className="h-[350px] pr-4">
                {customSections.map((section, index) => (
                  <div key={section.id} className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 border-2 rounded-xl mb-3 bg-gray-50 shadow-sm">
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
                        className="w-full font-bold rounded-lg"
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
                className="w-full font-bold border-2 rounded-xl"
              >
                <Plus className="w-4 h-4 mr-2" />
                নতুন সেকশন যোগ করুন
              </Button>
              <Button 
                onClick={handleSaveLayout} 
                className="w-full font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-xl shadow-lg"
              >
                লেআউট সংরক্ষণ করুন
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Branding Tab */}
        <TabsContent value="branding" className="space-y-4 mt-6">
          <Card className="border-2 border-gray-200 shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-teal-500 to-cyan-500 border-b-2">
              <CardTitle className="text-lg font-bold text-white">ব্র্যান্ডিং সেটিংস</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div>
                <Label className="font-semibold">কোম্পানির নাম</Label>
                <Input
                  value={branding.companyName}
                  onChange={(e) => setBranding({ ...branding, companyName: e.target.value })}
                  className="mt-1 border-2 admin-input-style"
                />
              </div>
              <div>
                <Label className="font-semibold">চ্যানেলের নাম</Label>
                <Input
                  value={branding.channelName}
                  onChange={(e) => setBranding({ ...branding, channelName: e.target.value })}
                  className="mt-1 border-2 admin-input-style"
                />
              </div>
              
              {/* Logo Upload Section */}
              <div className="space-y-3">
                <Label className="text-base font-bold">ব্র্যান্ড লোগো</Label>
                
                {branding.logoDataUrl ? (
                  <div className="space-y-3">
                    <div className="relative w-32 h-32 mx-auto border-2 border-gray-300 rounded-lg overflow-hidden">
                      <img
                        src={branding.logoDataUrl}
                        alt="Brand Logo"
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={handleRemoveLogo}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => logoInputRef.current?.click()}
                      className="w-full font-bold border-2 rounded-xl"
                    >
                      <ImageIcon className="w-4 h-4 mr-2" />
                      লোগো পরিবর্তন করুন
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-32 h-32 mx-auto border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                      <ImageIcon className="w-12 h-12 text-gray-400" />
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => logoInputRef.current?.click()}
                      className="w-full font-bold border-2 rounded-xl"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      লোগো আপলোড করুন
                    </Button>
                  </div>
                )}
                
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                
                <p className="text-xs text-gray-500 text-center">
                  সুপারিশকৃত: বর্গাকার ইমেজ (512x512px বা তার বেশি)
                </p>
              </div>

              <Button 
                onClick={handleSaveBranding} 
                className="w-full font-bold bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white py-3 rounded-xl shadow-lg"
              >
                ব্র্যান্ডিং সংরক্ষণ করুন
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sharing Tab */}
        <TabsContent value="sharing" className="space-y-4 mt-6">
          <Card className="border-2 border-gray-200 shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 border-b-2">
              <CardTitle className="text-lg font-bold text-white">ইউজার শেয়ারিং সেটিংস</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div>
                <Label className="font-semibold">ডিস্ট্রিবিউশন মোড</Label>
                <Select
                  value={userSharing.distributionMode}
                  onValueChange={(value: 'equal' | 'weighted' | 'manual') => 
                    setUserSharing({ ...userSharing, distributionMode: value })
                  }
                >
                  <SelectTrigger className="mt-1 border-2 admin-select-trigger">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="admin-select-content">
                    <SelectItem value="equal">সমান ভাগ</SelectItem>
                    <SelectItem value="weighted">ওজন অনুযায়ী</SelectItem>
                    <SelectItem value="manual">ম্যানুয়াল</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={handleSaveUserSharing} 
                className="w-full font-bold bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white py-3 rounded-xl shadow-lg"
              >
                শেয়ারিং সংরক্ষণ করুন
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Backup Tab */}
        <TabsContent value="backup" className="space-y-4 mt-6">
          <Card className="border-2 border-gray-200 shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 border-b-2">
              <CardTitle className="text-lg font-bold text-white">ব্যাকআপ ও রিস্টোর</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <Button 
                onClick={handleExportBackup} 
                variant="outline" 
                className="w-full font-bold border-2 rounded-xl"
              >
                <Download className="w-4 h-4 mr-2" />
                ব্যাকআপ ডাউনলোড করুন
              </Button>
              <Button 
                onClick={() => fileInputRef.current?.click()} 
                variant="outline" 
                className="w-full font-bold border-2 rounded-xl"
              >
                <Upload className="w-4 h-4 mr-2" />
                ব্যাকআপ আপলোড করুন
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImportBackup}
                className="hidden"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
