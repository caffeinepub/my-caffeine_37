import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Checkbox } from '../../../components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { notify } from '../../../components/feedback/notify';
import { Trash2, Lock, Unlock } from 'lucide-react';
import { ConfirmDialog } from '../../../components/feedback/ConfirmDialog';
import { loadWorkerRates, saveWorkerRates, type WorkerRate } from '../../../lib/storage/workerRatesStorage';
import { loadSelectedWorkers, toggleWorkerSelection, removeDeletedWorker } from '../../../lib/storage/adminSelectedWorkersStorage';

export default function WorkerRateSettingsSection() {
  const [workerRates, setWorkerRates] = useState<WorkerRate[]>([]);
  const [selectedWorkers, setSelectedWorkers] = useState<string[]>([]);
  const [newWorkerName, setNewWorkerName] = useState('');
  const [deleteWorker, setDeleteWorker] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const rates = loadWorkerRates();
    const selected = loadSelectedWorkers();
    setWorkerRates(rates);
    setSelectedWorkers(selected);
  };

  const handleAddWorker = () => {
    const name = newWorkerName.trim();
    if (!name) {
      notify.error('কর্মীর নাম লিখুন');
      return;
    }

    if (workerRates.some((w) => w.name === name)) {
      notify.error('এই কর্মী ইতিমধ্যে বিদ্যমান');
      return;
    }

    const updated = [...workerRates, { name, rateDouble: 0, rateSingle: 0, locked: false }];
    setWorkerRates(updated);
    saveWorkerRates(updated);
    setNewWorkerName('');

    notify.success('কর্মী সফলভাবে যোগ করা হয়েছে');
  };

  const handleDeleteConfirm = () => {
    if (!deleteWorker) return;

    const updated = workerRates.filter((w) => w.name !== deleteWorker);
    setWorkerRates(updated);
    saveWorkerRates(updated);

    // Remove from selected workers
    removeDeletedWorker(deleteWorker);
    setSelectedWorkers(loadSelectedWorkers());

    notify.success('কর্মী মুছে ফেলা হয়েছে');
    setDeleteWorker(null);
  };

  const handleRateChange = (workerName: string, field: 'rateDouble' | 'rateSingle', value: number) => {
    const updated = workerRates.map((w) =>
      w.name === workerName ? { ...w, [field]: value } : w
    );
    setWorkerRates(updated);
    saveWorkerRates(updated);
  };

  const handleToggleSelection = (workerName: string) => {
    toggleWorkerSelection(workerName);
    setSelectedWorkers(loadSelectedWorkers());
  };

  const handleToggleLock = (workerName: string) => {
    const updated = workerRates.map((w) =>
      w.name === workerName ? { ...w, locked: !w.locked } : w
    );
    setWorkerRates(updated);
    saveWorkerRates(updated);
  };

  return (
    <>
      <div className="space-y-6">
        <Card className="border-2 border-gray-200 shadow-lg rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-slate-600 to-slate-700 border-b-2">
            <CardTitle className="text-lg font-bold text-white">কর্মী ও রেট সেটিংস</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="flex gap-2">
              <Input
                placeholder="নতুন কর্মীর নাম লিখুন"
                value={newWorkerName}
                onChange={(e) => setNewWorkerName(e.target.value)}
                className="flex-1 admin-input-style"
              />
              <Button 
                onClick={handleAddWorker}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl"
              >
                যোগ করুন
              </Button>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">লক</TableHead>
                    <TableHead className="w-12">নির্বাচন</TableHead>
                    <TableHead>নাম</TableHead>
                    <TableHead>সিঙ্গেল রেট</TableHead>
                    <TableHead>ডাবল রেট</TableHead>
                    <TableHead className="text-center">অ্যাকশন</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workerRates.map((worker) => {
                    const isLocked = worker.locked ?? false;
                    return (
                      <TableRow key={worker.name} className={isLocked ? 'bg-gray-50' : ''}>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleLock(worker.name)}
                            className={isLocked ? 'text-red-600 hover:text-red-700' : 'text-gray-400 hover:text-gray-600'}
                          >
                            {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Checkbox
                            checked={selectedWorkers.includes(worker.name)}
                            onCheckedChange={() => handleToggleSelection(worker.name)}
                            disabled={isLocked}
                          />
                        </TableCell>
                        <TableCell className={`font-medium ${isLocked ? 'text-gray-600' : 'text-gray-900'}`}>
                          {worker.name}
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={worker.rateSingle}
                            onChange={(e) => handleRateChange(worker.name, 'rateSingle', Number(e.target.value))}
                            className="w-24 admin-input-style"
                            disabled={isLocked}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={worker.rateDouble}
                            onChange={(e) => handleRateChange(worker.name, 'rateDouble', Number(e.target.value))}
                            className="w-24 admin-input-style"
                            disabled={isLocked}
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteWorker(worker.name)}
                            className="text-destructive hover:text-destructive"
                            disabled={isLocked}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        open={!!deleteWorker}
        onOpenChange={(open) => !open && setDeleteWorker(null)}
        title="কর্মী মুছুন"
        description="আপনি কি নিশ্চিত যে আপনি এই কর্মী মুছে ফেলতে চান?"
        onConfirm={handleDeleteConfirm}
        confirmText="হ্যাঁ, মুছুন"
        cancelText="না"
        variant="destructive"
      />
    </>
  );
}
