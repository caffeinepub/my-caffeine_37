import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import AppShell from '../../components/layout/AppShell';
import ProductionSection from './sections/ProductionSection';
import WorkSection from './sections/WorkSection';
import NastaSection from './sections/NastaSection';
import PaymentLoanSection from './sections/PaymentLoanSection';
import SettingsSection from './sections/SettingsSection';
import { Factory, FileText, Coffee, Wallet, Settings } from 'lucide-react';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('production');

  return (
    <AppShell>
      <div className="container mx-auto py-6 px-4 max-w-7xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-slate-100 dark:bg-slate-800">
            <TabsTrigger value="production" className="flex items-center gap-2">
              <Factory className="w-4 h-4" />
              <span className="hidden sm:inline">Production</span>
            </TabsTrigger>
            <TabsTrigger value="work" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Work</span>
            </TabsTrigger>
            <TabsTrigger value="nasta" className="flex items-center gap-2">
              <Coffee className="w-4 h-4" />
              <span className="hidden sm:inline">Nasta</span>
            </TabsTrigger>
            <TabsTrigger value="payment" className="flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              <span className="hidden sm:inline">Payment</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="production">
            <ProductionSection />
          </TabsContent>

          <TabsContent value="work">
            <WorkSection />
          </TabsContent>

          <TabsContent value="nasta">
            <NastaSection />
          </TabsContent>

          <TabsContent value="payment">
            <PaymentLoanSection />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsSection />
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
