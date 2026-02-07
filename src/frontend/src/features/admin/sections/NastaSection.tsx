import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { safeGetItem, safeSetItem } from '../../../lib/storage/safeStorage';
import { loadWorkerRates } from '../../../lib/storage/workerRatesStorage';
import { notify } from '../../../components/feedback/notify';
import { ConfirmDialog } from '../../../components/feedback/ConfirmDialog';
import { useSingleConfirmSubmit } from '../../../hooks/useSingleConfirmSubmit';
import { Trash2 } from 'lucide-react';
import { computeEqualSplit } from '../../../utils/moneySplit';

interface NastaEntry {
  id: number;
  date: string;
  names: string[];
  amount: number;
  perHead: number;
  note: string;
}

interface Histories {
  nasta?: NastaEntry[];
}

interface Account {
  nasta?: number;
}

export default function NastaSection() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [selectedWorkers, setSelectedWorkers] = useState<string[]>([]);
  const [entries, setEntries] = useState<NastaEntry[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { isSaving, showConfirm, setShowConfirm, handleSubmit: handleConfirmSubmit } = useSingleConfirmSubmit(
    async () => {
      await saveEntry();
    }
  );

  const workers = loadWorkerRates().map((w) => w.name);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = () => {
    const histories = safeGetItem<Histories>('histories', { nasta: [] });
    const nastaArray = Array.isArray(histories?.nasta) ? histories.nasta : [];
    setEntries(nastaArray.sort((a, b) => (b.id || 0) - (a.id || 0)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedWorkers.length === 0) {
      notify.error('অন্তত একজন কর্মী নির্বাচন করুন');
      return;
    }

    if (!amount || Number(amount) <= 0) {
      notify.error('সঠিক পরিমাণ লিখুন');
      return;
    }

    setShowConfirm(true);
  };

  const saveEntry = async () => {
    const totalAmount = Number(amount);
    const perHead = computeEqualSplit(totalAmount, selectedWorkers.length);

    const histories = safeGetItem<Histories>('histories', { nasta: [] });
    const nastaArray = Array.isArray(histories?.nasta) ? histories.nasta : [];

    const newEntry: NastaEntry = {
      id: Date.now(),
      date,
      names: selectedWorkers,
      amount: totalAmount,
      perHead,
      note,
    };

    const updatedNasta = [newEntry, ...nastaArray];
    safeSetItem('histories', { ...histories, nasta: updatedNasta });

    // Update accounts for each worker
    selectedWorkers.forEach((workerName) => {
      const accountKey = `account_${workerName}`;
      const account = safeGetItem<Account>(accountKey, {});
      const currentNasta = (account?.nasta) || 0;
      safeSetItem(accountKey, { ...account, nasta: currentNasta + perHead });
    });

    setAmount('');
    setNote('');
    setSelectedWorkers([]);
    loadEntries();
    notify.success('নাস্তা সফলভাবে যোগ করা হয়েছে');
  };

  const handleDelete = () => {
    if (deleteId === null) return;

    const histories = safeGetItem<Histories>('histories', { nasta: [] });
    const nastaArray = Array.isArray(histories?.nasta) ? histories.nasta : [];

    const entryToDelete = nastaArray.find((e) => e.id === deleteId);
    if (!entryToDelete) {
      notify.error('এন্ট্রি খুঁজে পাওয়া যায়নি');
      setDeleteId(null);
      return;
    }

    // Compute per-head amount with fallback for legacy entries
    const perHead = entryToDelete.perHead ?? computeEqualSplit(entryToDelete.amount, entryToDelete.names.length);

    // Reverse account updates
    entryToDelete.names.forEach((workerName) => {
      const accountKey = `account_${workerName}`;
      const account = safeGetItem<Account>(accountKey, {});
      const currentNasta = (account?.nasta) || 0;
      safeSetItem(accountKey, { ...account, nasta: currentNasta - perHead });
    });

    const updatedNasta = nastaArray.filter((e) => e.id !== deleteId);
    safeSetItem('histories', { ...histories, nasta: updatedNasta });

    loadEntries();
    setDeleteId(null);
    notify.success('নাস্তা মুছে ফেলা হয়েছে');
  };

  const toggleWorker = (workerName: string) => {
    setSelectedWorkers((prev) =>
      prev.includes(workerName) ? prev.filter((w) => w !== workerName) : [...prev, workerName]
    );
  };

  return (
    <>
      <div className="space-y-6">
        <Card className="border-amber-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500">
            <CardTitle className="text-lg text-white">নতুন নাস্তা যোগ করুন</CardTitle>
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
                          ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg scale-105'
                          : 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 hover:from-gray-300 hover:to-gray-400'
                      }`}
                    >
                      {worker}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">মোট পরিমাণ (৳)</Label>
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="border-2"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="note">নোট</Label>
                <Textarea
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={2}
                  className="border-2"
                />
              </div>

              <Button 
                type="submit" 
                disabled={isSaving}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold py-3"
              >
                {isSaving ? 'সংরক্ষণ করা হচ্ছে...' : 'জমা দিন'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-amber-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500">
            <CardTitle className="text-lg text-white">নাস্তা ইতিহাস</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>তারিখ</TableHead>
                    <TableHead>নাম</TableHead>
                    <TableHead className="text-right">মোট</TableHead>
                    <TableHead className="text-right">প্রতি জন</TableHead>
                    <TableHead className="text-center">অ্যাকশন</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        কোনো এন্ট্রি নেই
                      </TableCell>
                    </TableRow>
                  ) : (
                    entries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell className="font-medium">{entry.date}</TableCell>
                        <TableCell>{entry.names.join(', ')}</TableCell>
                        <TableCell className="text-right font-bold text-amber-700">
                          ৳{entry.amount.toFixed(0)}
                        </TableCell>
                        <TableCell className="text-right text-sm text-gray-600">
                          ৳{entry.perHead.toFixed(0)}
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
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title="নিশ্চিত করুন"
        description="আপনি কি এই নাস্তা এন্ট্রি সংরক্ষণ করতে চান?"
        onConfirm={handleConfirmSubmit}
        confirmText="হ্যাঁ, সংরক্ষণ করুন"
        cancelText="না"
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="এন্ট্রি মুছুন"
        description="আপনি কি নিশ্চিত যে আপনি এই এন্ট্রি মুছে ফেলতে চান?"
        onConfirm={handleDelete}
        confirmText="হ্যাঁ, মুছুন"
        cancelText="না"
        variant="destructive"
      />
    </>
  );
}
