import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { safeGetItem, safeSetItem } from '../../../lib/storage/safeStorage';
import { notify } from '../../../components/feedback/notify';
import {
  loadLabelSettings,
  saveLabelSettings,
  LabelEntry
} from '../../../lib/storage/labelSettingsStorage';
import {
  loadLayoutRules,
  saveLayoutRules,
  SectionLayoutRule
} from '../../../lib/storage/adminDashboardLayoutRulesStorage';
import { ChevronUp, ChevronDown, Trash2, Plus } from 'lucide-react';

export default function SystemSettingsSection() {
  const [activeTab, setActiveTab] = useState('labels');
  
  // Labels tab state
  const [labelEntries, setLabelEntries] = useState<LabelEntry[]>([]);
  
  // Totals tab state
  const [totalTaken, setTotalTaken] = useState('');
  const [totalWork, setTotalWork] = useState('');
  const [totalDue, setTotalDue] = useState('');
  
  // Layout tab state
  const [layoutRules, setLayoutRules] = useState<SectionLayoutRule[]>([]);
  const [newSectionKey, setNewSectionKey] = useState('');
  const [newSectionLabel, setNewSectionLabel] = useState('');
  
  // Branding tab state
  const [companyName, setCompanyName] = useState('');
  const [channelName, setChannelName] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    loadAllSettings();
  }, []);

  const loadAllSettings = () => {
    // Load labels
    const labels = loadLabelSettings();
    setLabelEntries(labels);
    
    // Load totals
    const totals = safeGetItem<{ totalTaken: number; totalWork: number; totalDue: number }>('adminTotals', {
      totalTaken: 0,
      totalWork: 0,
      totalDue: 0
    });
    if (totals) {
      setTotalTaken(totals.totalTaken.toString());
      setTotalWork(totals.totalWork.toString());
      setTotalDue(totals.totalDue.toString());
    }
    
    // Load layout
    const rules = loadLayoutRules();
    setLayoutRules(rules);
    
    // Load branding
    const branding = safeGetItem<{ companyName?: string; channelName?: string; logo?: string }>('branding', {});
    if (branding) {
      setCompanyName(branding.companyName || '');
      setChannelName(branding.channelName || '');
      if (branding.logo) {
        setLogoPreview(branding.logo);
      }
    }
  };

  // Labels tab handlers
  const handleLabelChange = (serial: number, newText: string) => {
    const updated = labelEntries.map((entry) =>
      entry.serial === serial ? { ...entry, overrideLabel: newText } : entry
    );
    setLabelEntries(updated);
  };

  const handleMoveLabel = (serial: number, direction: 'up' | 'down') => {
    const index = labelEntries.findIndex((e) => e.serial === serial);
    if (index === -1) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= labelEntries.length) return;
    
    const updated = [...labelEntries];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    
    // Reassign serials
    updated.forEach((entry, idx) => {
      entry.serial = idx + 1;
    });
    
    setLabelEntries(updated);
  };

  const handleSaveLabels = () => {
    saveLabelSettings(labelEntries);
    notify.success('লেবেল সংরক্ষিত হয়েছে');
  };

  // Totals tab handlers
  const handleSaveTotals = () => {
    const totals = {
      totalTaken: Number(totalTaken) || 0,
      totalWork: Number(totalWork) || 0,
      totalDue: Number(totalDue) || 0
    };
    safeSetItem('adminTotals', totals);
    
    // Update label entries for the three totals
    const updated = labelEntries.map((entry) => {
      if (entry.key === 'totalTaken') return { ...entry, overrideLabel: `${totals.totalTaken} ৳` };
      if (entry.key === 'totalWork') return { ...entry, overrideLabel: `${totals.totalWork} ৳` };
      if (entry.key === 'totalDue') return { ...entry, overrideLabel: `${totals.totalDue} ৳` };
      return entry;
    });
    setLabelEntries(updated);
    saveLabelSettings(updated);
    
    notify.success('মোট সংরক্ষিত হয়েছে');
  };

  // Layout tab handlers
  const handleAddSection = () => {
    if (!newSectionKey || !newSectionLabel) {
      notify.error('সেকশন কী এবং লেবেল লিখুন');
      return;
    }
    
    const newRule: SectionLayoutRule = {
      sectionKey: newSectionKey,
      label: newSectionLabel,
      serial: layoutRules.length + 1,
      perRow: 3,
      size: 'large'
    };
    
    const updated = [...layoutRules, newRule];
    setLayoutRules(updated);
    saveLayoutRules(updated);
    
    setNewSectionKey('');
    setNewSectionLabel('');
    notify.success('সেকশন যোগ করা হয়েছে');
  };

  const handleDeleteSection = (sectionKey: string) => {
    const updated = layoutRules.filter((r) => r.sectionKey !== sectionKey);
    setLayoutRules(updated);
    saveLayoutRules(updated);
    notify.success('সেকশন মুছে ফেলা হয়েছে');
  };

  const handleConfigureSection = (sectionKey: string, field: 'perRow' | 'size', value: any) => {
    const updated = layoutRules.map((r) =>
      r.sectionKey === sectionKey ? { ...r, [field]: value } : r
    );
    setLayoutRules(updated);
    saveLayoutRules(updated);
    notify.success('সেকশন আপডেট হয়েছে');
  };

  // Branding tab handlers
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveBranding = () => {
    const branding = safeGetItem<{ companyName?: string; channelName?: string; logo?: string }>('branding', {}) || {};
    branding.companyName = companyName;
    branding.channelName = channelName;
    if (logoPreview) {
      branding.logo = logoPreview;
    }
    safeSetItem('branding', branding);
    notify.success('ব্র্যান্ডিং সংরক্ষিত হয়েছে');
  };

  return (
    <div className="space-y-6">
      <Card className="border-slate-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-slate-600 to-gray-600">
          <CardTitle className="text-lg text-white">সিস্টেম সেটিংস</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger 
                value="labels" 
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white bg-blue-100 text-blue-900 font-semibold"
              >
                লেবেল
              </TabsTrigger>
              <TabsTrigger 
                value="totals" 
                className="data-[state=active]:bg-green-500 data-[state=active]:text-white bg-green-100 text-green-900 font-semibold"
              >
                মোট
              </TabsTrigger>
              <TabsTrigger 
                value="layout" 
                className="data-[state=active]:bg-purple-500 data-[state=active]:text-white bg-purple-100 text-purple-900 font-semibold"
              >
                লেআউট
              </TabsTrigger>
              <TabsTrigger 
                value="branding" 
                className="data-[state=active]:bg-orange-500 data-[state=active]:text-white bg-orange-100 text-orange-900 font-semibold"
              >
                ব্র্যান্ডিং
              </TabsTrigger>
            </TabsList>

            <TabsContent value="labels" className="space-y-4">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">ক্রম</TableHead>
                      <TableHead>কী</TableHead>
                      <TableHead>লেবেল</TableHead>
                      <TableHead className="text-center">অ্যাকশন</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {labelEntries.map((entry, index) => (
                      <TableRow key={entry.key}>
                        <TableCell className="font-medium">{entry.serial}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{entry.key}</TableCell>
                        <TableCell>
                          <Input
                            value={entry.overrideLabel || entry.defaultLabel}
                            onChange={(e) => handleLabelChange(entry.serial, e.target.value)}
                            className="border-2"
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMoveLabel(entry.serial, 'up')}
                              disabled={index === 0}
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            >
                              <ChevronUp className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMoveLabel(entry.serial, 'down')}
                              disabled={index === labelEntries.length - 1}
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            >
                              <ChevronDown className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <Button 
                onClick={handleSaveLabels}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3"
              >
                লেবেল সংরক্ষণ করুন
              </Button>
            </TabsContent>

            <TabsContent value="totals" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="totalTaken">মোট নেওয়া</Label>
                  <Input
                    id="totalTaken"
                    type="number"
                    value={totalTaken}
                    onChange={(e) => setTotalTaken(e.target.value)}
                    className="border-2"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalWork">মোট কাজ</Label>
                  <Input
                    id="totalWork"
                    type="number"
                    value={totalWork}
                    onChange={(e) => setTotalWork(e.target.value)}
                    className="border-2"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalDue">মোট দেওয়া</Label>
                  <Input
                    id="totalDue"
                    type="number"
                    value={totalDue}
                    onChange={(e) => setTotalDue(e.target.value)}
                    className="border-2"
                  />
                </div>
              </div>
              <Button 
                onClick={handleSaveTotals}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3"
              >
                মোট সংরক্ষণ করুন
              </Button>
            </TabsContent>

            <TabsContent value="layout" className="space-y-4">
              <div className="space-y-4 p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                <h3 className="font-semibold text-purple-900">নতুন সেকশন যোগ করুন</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newSectionKey">সেকশন কী</Label>
                    <Input
                      id="newSectionKey"
                      value={newSectionKey}
                      onChange={(e) => setNewSectionKey(e.target.value)}
                      className="border-2"
                      placeholder="e.g., custom-section"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newSectionLabel">লেবেল</Label>
                    <Input
                      id="newSectionLabel"
                      value={newSectionLabel}
                      onChange={(e) => setNewSectionLabel(e.target.value)}
                      className="border-2"
                      placeholder="e.g., কাস্টম সেকশন"
                    />
                  </div>
                </div>
                <Button 
                  onClick={handleAddSection}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  সেকশন যোগ করুন
                </Button>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>সেকশন</TableHead>
                      <TableHead>লেবেল</TableHead>
                      <TableHead>প্রতি সারি</TableHead>
                      <TableHead>সাইজ</TableHead>
                      <TableHead className="text-center">অ্যাকশন</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {layoutRules.map((rule) => (
                      <TableRow key={rule.sectionKey}>
                        <TableCell className="font-medium text-xs">{rule.sectionKey}</TableCell>
                        <TableCell>{rule.label}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="1"
                            max="6"
                            value={rule.perRow}
                            onChange={(e) => handleConfigureSection(rule.sectionKey, 'perRow', Number(e.target.value))}
                            className="w-20 border-2"
                          />
                        </TableCell>
                        <TableCell>
                          <select
                            value={rule.size}
                            onChange={(e) => handleConfigureSection(rule.sectionKey, 'size', e.target.value as 'small' | 'large')}
                            className="border-2 rounded px-2 py-1"
                          >
                            <option value="small">Small</option>
                            <option value="large">Large</option>
                          </select>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteSection(rule.sectionKey)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="branding" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">কোম্পানির নাম</Label>
                  <Input
                    id="companyName"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="border-2"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="channelName">চ্যানেলের নাম</Label>
                  <Input
                    id="channelName"
                    value={channelName}
                    onChange={(e) => setChannelName(e.target.value)}
                    className="border-2"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="logo">লোগো</Label>
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="border-2"
                  />
                  {logoPreview && (
                    <div className="mt-2">
                      <img src={logoPreview} alt="Logo Preview" className="w-24 h-24 object-contain rounded border-2" />
                    </div>
                  )}
                </div>
              </div>
              <Button 
                onClick={handleSaveBranding}
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold py-3"
              >
                ব্র্যান্ডিং সংরক্ষণ করুন
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
