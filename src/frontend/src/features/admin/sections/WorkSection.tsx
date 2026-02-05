import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { safeGetItem, safeSetItem, safeGetArray } from '../../../lib/storage/safeStorage';
import { notify } from '../../../components/feedback/notify';
import { ConfirmDialog } from '../../../components/feedback/ConfirmDialog';
import { Trash2 } from 'lucide-react';

interface WorkEntry {
  id: string;
  date: string;
  names: string[];
  singleRate: number;
  doubleRate: number;
  singleCount: number;
  doubleCount: number;
  amounts: Record<string, number>;
  timestamp: number;
}

export default function WorkSection() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedWorkers, setSelectedWorkers] = useState<string[]>([]);
  const [singleCount, setSingleCount] = useState('');
  const [doubleCount, setDoubleCount] = useState('');
  const [workers, setWorkers] = useState<string[]>([]);
  const [history, setHistory] = useState<WorkEntry[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    loadWorkers();
    loadHistory();
  }, []);

  const loadWorkers = () => {
    const workerList = safeGetArray<string>('workers');
    setWorkers(workerList);
  };

  const loadHistory = () => {
    const entries = safeGetArray<WorkEntry>('workHistory');
    setHistory(entries.sort((a, b) => b.timestamp - a.timestamp));
  };

  const toggleWorker = (worker: string) => {
    setSelectedWorkers((prev) =>
      prev.includes(worker) ? prev.filter((w) => w !== worker) : [...prev, worker]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedWorkers.length === 0) {
      notify.error('অন্তত একজন কর্মী নির্বাচন করুন');
      return;
    }

    const rates = safeGetItem<Record<string, { single: number; double: number }>>('workerRates', {}) || {};
    const amounts: Record<string, number> = {};

    selectedWorkers.forEach((worker) => {
      const rate = rates[worker] || { single: 0, double: 0 };
      amounts[worker] = Number(singleCount) * rate.single + Number(doubleCount) * rate.double;
    });

    const entry: WorkEntry = {
      id: Date.now().toString(),
      date,
      names: selectedWorkers,
      singleRate: 0,
      doubleRate: 0,
      singleCount: Number(singleCount),
      doubleCount: Number(doubleCount),
      amounts,
      timestamp: Date.now(),
    };

    const entries = safeGetArray<WorkEntry>('workHistory');
    entries.push(entry);
    safeSetItem('workHistory', entries);

    const accounts = safeGetItem<Record<string, { bill: number; cost: number }>>('accounts', {}) || {};
    selectedWorkers.forEach((worker) => {
      if (!accounts[worker]) {
        accounts[worker] = { bill: 0, cost: 0 };
      }
      accounts[worker].bill += amounts[worker];
    });
    safeSetItem('accounts', accounts);

    setSelectedWorkers([]);
    setSingleCount('');
    setDoubleCount('');
    loadHistory();
    notify.success('কাজ সফলভাবে যোগ করা হয়েছে');
  };

  const handleDelete = () => {
    if (!deleteId) return;

    const entries = safeGetArray<WorkEntry>('workHistory');
    const entry = entries.find((e) => e.id === deleteId);
    if (!entry) return;

    const accounts = safeGetItem<Record<string, { bill: number; cost: number }>>('accounts', {}) || {};
    entry.names.forEach((worker) => {
      if (accounts[worker] && entry.amounts[worker]) {
        accounts[worker].bill -= entry.amounts[worker];
      }
    });
    safeSetItem('accounts', accounts);

    const updated = entries.filter((e) => e.id !== deleteId);
    safeSetItem('workHistory', updated);

    loadHistory();
    setDeleteId(null);
    notify.success('এন্ট্রি মুছে ফেলা হয়েছে');
  };

  return (
    <>
      <div className="space-y-6">
        <Card className="border-cyan-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-cyan-500 to-blue-500">
            <CardTitle className="text-lg text-white">নতুন কাজ যোগ করুন</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date">তারিখ</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="border-2"
                />
              </div>

              <div className="space-y-2">
                <Label>কর্মী নির্বাচন করুন</Label>
                <div className="grid grid-cols-2 gap-2">
                  {workers.map((worker) => (
                    <Button
                      key={worker}
                      type="button"
                      onClick={() => toggleWorker(worker)}
                      className={`font-bold transition-all ${
                        selectedWorkers.includes(worker)
                          ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg scale-105'
                          : 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 hover:from-gray-300 hover:to-gray-400'
                      }`}
                    >
                      {worker}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="singleCount">সিঙ্গেল সংখ্যা</Label>
                  <Input
                    id="singleCount"
                    type="number"
                    value={singleCount}
                    onChange={(e) => setSingleCount(e.target.value)}
                    placeholder="সিঙ্গেল"
                    className="border-2"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doubleCount">ডাবল সংখ্যা</Label>
                  <Input
                    id="doubleCount"
                    type="number"
                    value={doubleCount}
                    onChange={(e) => setDoubleCount(e.target.value)}
                    placeholder="ডাবল"
                    className="border-2"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold py-3">
                সাবমিট করুন
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-cyan-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-cyan-500 to-blue-500">
            <CardTitle className="text-lg text-white">কাজের হিস্ট্রি</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>তারিখ</TableHead>
                    <TableHead>নাম</TableHead>
                    <TableHead>সিঙ্গেল</TableHead>
                    <TableHead>ডাবল</TableHead>
                    <TableHead className="text-right">মোট</TableHead>
                    <TableHead className="text-center">অ্যাকশন</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        কোনো এন্ট্রি নেই
                      </TableCell>
                    </TableRow>
                  ) : (
                    history.map((entry) => {
                      const total = Object.values(entry.amounts).reduce((sum, amt) => sum + amt, 0);
                      return (
                        <TableRow key={entry.id}>
                          <TableCell className="font-medium">{entry.date}</TableCell>
                          <TableCell>{entry.names.join(', ')}</TableCell>
                          <TableCell>{entry.singleCount}</TableCell>
                          <TableCell>{entry.doubleCount}</TableCell>
                          <TableCell className="text-right font-bold text-cyan-700">
                            ৳{total.toFixed(0)}
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteId(entry.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="এন্ট্রি মুছে ফেলুন"
        description="আপনি কি নিশ্চিত যে আপনি এই এন্ট্রি মুছে ফেলতে চান?"
        onConfirm={handleDelete}
        confirmText="হ্যাঁ, মুছে ফেলুন"
        cancelText="না"
        variant="destructive"
      />
    </>
  );
}
