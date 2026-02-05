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

interface ProductionEntry {
  id: string;
  date: string;
  names: string[];
  quantity: number;
  amount: number;
  total: number;
  timestamp: number;
}

export default function ProductionSection() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedWorkers, setSelectedWorkers] = useState<string[]>([]);
  const [quantity, setQuantity] = useState('');
  const [amount, setAmount] = useState('');
  const [workers, setWorkers] = useState<string[]>([]);
  const [history, setHistory] = useState<ProductionEntry[]>([]);
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
    const entries = safeGetArray<ProductionEntry>('productionHistory');
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

    if (!quantity || !amount) {
      notify.error('সকল তথ্য পূরণ করুন');
      return;
    }

    const total = Number(quantity) * Number(amount);
    const entry: ProductionEntry = {
      id: Date.now().toString(),
      date,
      names: selectedWorkers,
      quantity: Number(quantity),
      amount: Number(amount),
      total,
      timestamp: Date.now(),
    };

    const entries = safeGetArray<ProductionEntry>('productionHistory');
    entries.push(entry);
    safeSetItem('productionHistory', entries);

    const accounts = safeGetItem<Record<string, { bill: number; cost: number }>>('accounts', {}) || {};
    selectedWorkers.forEach((worker) => {
      if (!accounts[worker]) {
        accounts[worker] = { bill: 0, cost: 0 };
      }
      accounts[worker].bill += total;
    });
    safeSetItem('accounts', accounts);

    setSelectedWorkers([]);
    setQuantity('');
    setAmount('');
    loadHistory();
    notify.success('প্রোডাকশন সফলভাবে যোগ করা হয়েছে');
  };

  const handleDelete = () => {
    if (!deleteId) return;

    const entries = safeGetArray<ProductionEntry>('productionHistory');
    const entry = entries.find((e) => e.id === deleteId);
    if (!entry) return;

    const accounts = safeGetItem<Record<string, { bill: number; cost: number }>>('accounts', {}) || {};
    entry.names.forEach((worker) => {
      if (accounts[worker]) {
        accounts[worker].bill -= entry.total;
      }
    });
    safeSetItem('accounts', accounts);

    const updated = entries.filter((e) => e.id !== deleteId);
    safeSetItem('productionHistory', updated);

    loadHistory();
    setDeleteId(null);
    notify.success('এন্ট্রি মুছে ফেলা হয়েছে');
  };

  return (
    <>
      <div className="space-y-6">
        <Card className="border-emerald-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500">
            <CardTitle className="text-lg text-white">নতুন প্রোডাকশন যোগ করুন</CardTitle>
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
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg scale-105'
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
                  <Label htmlFor="quantity">পরিমাণ</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="পরিমাণ"
                    className="border-2"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">রেট (৳)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="রেট"
                    className="border-2"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-3">
                সাবমিট করুন
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-emerald-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500">
            <CardTitle className="text-lg text-white">প্রোডাকশন হিস্ট্রি</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>তারিখ</TableHead>
                    <TableHead>নাম</TableHead>
                    <TableHead>পরিমাণ</TableHead>
                    <TableHead>রেট</TableHead>
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
                    history.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell className="font-medium">{entry.date}</TableCell>
                        <TableCell>{entry.names.join(', ')}</TableCell>
                        <TableCell>{entry.quantity}</TableCell>
                        <TableCell>৳{entry.amount}</TableCell>
                        <TableCell className="text-right font-bold text-emerald-700">
                          ৳{entry.total.toFixed(0)}
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
                    ))
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
