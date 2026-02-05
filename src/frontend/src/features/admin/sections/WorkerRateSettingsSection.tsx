import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { safeGetItem, safeSetItem } from '../../../lib/storage/safeStorage';
import { notify } from '../../../components/feedback/notify';
import { Trash2 } from 'lucide-react';
import { ConfirmDialog } from '../../../components/feedback/ConfirmDialog';

export default function WorkerRateSettingsSection() {
  const [workers, setWorkers] = useState<string[]>([]);
  const [rates, setRates] = useState<Record<string, { s: number; d: number }>>({});
  const [newWorkerName, setNewWorkerName] = useState('');
  const [deleteWorker, setDeleteWorker] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const loadedWorkers = safeGetItem<string[]>('workers', []) || [];
    const loadedRates = safeGetItem<Record<string, { s: number; d: number }>>('rates', {}) || {};
    setWorkers(loadedWorkers);
    setRates(loadedRates);
  };

  const handleAddWorker = () => {
    const name = newWorkerName.trim();
    if (!name) {
      notify.error('কর্মীর নাম লিখুন');
      return;
    }

    if (workers.includes(name)) {
      notify.error('এই কর্মী ইতিমধ্যে বিদ্যমান');
      return;
    }

    const updatedWorkers = [...workers, name];
    const updatedRates = { ...rates, [name]: { s: 0, d: 0 } };

    setWorkers(updatedWorkers);
    setRates(updatedRates);
    safeSetItem('workers', updatedWorkers);
    safeSetItem('rates', updatedRates);
    setNewWorkerName('');

    notify.success('কর্মী সফলভাবে যোগ করা হয়েছে');
  };

  const handleDeleteConfirm = () => {
    if (!deleteWorker) return;

    const updatedWorkers = workers.filter((w) => w !== deleteWorker);
    const updatedRates = { ...rates };
    delete updatedRates[deleteWorker];

    setWorkers(updatedWorkers);
    setRates(updatedRates);
    safeSetItem('workers', updatedWorkers);
    safeSetItem('rates', updatedRates);

    notify.success('কর্মী মুছে ফেলা হয়েছে');
    setDeleteWorker(null);
  };

  const handleRateChange = (worker: string, type: 's' | 'd', value: number) => {
    const updatedRates = {
      ...rates,
      [worker]: { ...rates[worker], [type]: value },
    };
    setRates(updatedRates);
    safeSetItem('rates', updatedRates);
  };

  return (
    <>
      <div className="space-y-6">
        <Card className="border-slate-200">
          <CardHeader className="bg-slate-50">
            <CardTitle className="text-lg">কর্মী ও রেট সেটিংস</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="flex gap-2">
              <Input
                placeholder="নতুন কর্মীর নাম লিখুন"
                value={newWorkerName}
                onChange={(e) => setNewWorkerName(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleAddWorker}>যোগ করুন</Button>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>নাম</TableHead>
                    <TableHead>সিঙ্গেল রেট</TableHead>
                    <TableHead>ডাবল রেট</TableHead>
                    <TableHead className="text-center">অ্যাকশন</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workers.map((worker) => (
                    <TableRow key={worker}>
                      <TableCell className="font-medium">{worker}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={rates[worker]?.s || 0}
                          onChange={(e) => handleRateChange(worker, 's', Number(e.target.value))}
                          className="w-24"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={rates[worker]?.d || 0}
                          onChange={(e) => handleRateChange(worker, 'd', Number(e.target.value))}
                          className="w-24"
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteWorker(worker)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        open={!!deleteWorker}
        onOpenChange={(open) => !open && setDeleteWorker(null)}
        title="কর্মী মুছে ফেলুন"
        description={`আপনি কি নিশ্চিত যে আপনি ${deleteWorker} কে মুছে ফেলতে চান?`}
        onConfirm={handleDeleteConfirm}
        confirmText="হ্যাঁ, মুছে ফেলুন"
        cancelText="না"
        variant="destructive"
      />
    </>
  );
}
