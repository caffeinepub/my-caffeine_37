import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { safeGetArray, safeSetItem, safeGetItem } from '../../../lib/storage/safeStorage';
import { notify } from '../../../components/feedback/notify';
import { ConfirmDialog } from '../../../components/feedback/ConfirmDialog';
import { useSingleConfirmSubmit } from '../../../hooks/useSingleConfirmSubmit';
import { Trash2 } from 'lucide-react';
import { loadWorkerRates, type WorkerRate } from '../../../lib/storage/workerRatesStorage';

interface WorkEntry {
  id: string;
  date: string;
  names: string[];
  quantityDouble: number;
  quantitySingle: number;
  perWorkerAmounts: Record<string, number>;
  grandTotal: number;
  timestamp: number;
}

export default function WorkSection() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedWorkers, setSelectedWorkers] = useState<string[]>([]);
  const [quantityDouble, setQuantityDouble] = useState('');
  const [quantitySingle, setQuantitySingle] = useState('');
  const [workerRates, setWorkerRates] = useState<WorkerRate[]>([]);
  const [history, setHistory] = useState<WorkEntry[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { isSaving, showConfirm, setShowConfirm, handleSubmit: handleConfirmSubmit } = useSingleConfirmSubmit(
    async () => {
      await saveWork();
    }
  );

  useEffect(() => {
    loadWorkers();
    loadHistory();
  }, []);

  const loadWorkers = () => {
    const rates = loadWorkerRates();
    setWorkerRates(rates);
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

    if (!quantityDouble || !quantitySingle) {
      notify.error('সব ঘর পূরণ করুন');
      return;
    }

    const qtyDouble = Number(quantityDouble);
    const qtySingle = Number(quantitySingle);

    if (qtyDouble < 0 || qtySingle < 0) {
      notify.error('মান ঋণাত্মক হতে পারে না');
      return;
    }

    // Validate that all selected workers have rates
    const missingRates = selectedWorkers.filter((w) => {
      const rate = workerRates.find((r) => r.name === w);
      return !rate || (rate.rateDouble === 0 && rate.rateSingle === 0);
    });
    
    if (missingRates.length > 0) {
      notify.error(`রেট নেই: ${missingRates.join(', ')}`);
      return;
    }

    setShowConfirm(true);
  };

  const saveWork = async () => {
    const qtyDouble = Number(quantityDouble);
    const qtySingle = Number(quantitySingle);

    const perWorkerAmounts: Record<string, number> = {};
    let grandTotal = 0;

    selectedWorkers.forEach((workerName) => {
      const rate = workerRates.find((r) => r.name === workerName);
      if (rate) {
        const amount = qtyDouble * rate.rateDouble + qtySingle * rate.rateSingle;
        perWorkerAmounts[workerName] = amount;
        grandTotal += amount;
      }
    });

    const entry: WorkEntry = {
      id: Date.now().toString(),
      date,
      names: selectedWorkers,
      quantityDouble: qtyDouble,
      quantitySingle: qtySingle,
      perWorkerAmounts,
      grandTotal,
      timestamp: Date.now(),
    };

    const entries = safeGetArray<WorkEntry>('workHistory');
    entries.push(entry);
    safeSetItem('workHistory', entries);

    // Update accounts: Work increases bill (earnings)
    const accounts = safeGetItem<Record<string, { bill: number; cost: number }>>('accounts', {}) || {};
    selectedWorkers.forEach((worker) => {
      if (!accounts[worker]) {
        accounts[worker] = { bill: 0, cost: 0 };
      }
      accounts[worker].bill += perWorkerAmounts[worker] || 0;
    });
    safeSetItem('accounts', accounts);

    setSelectedWorkers([]);
    setQuantityDouble('');
    setQuantitySingle('');
    loadHistory();
    notify.success('কাজ সফলভাবে যোগ করা হয়েছে');
  };

  const handleDelete = () => {
    if (!deleteId) return;

    const entries = safeGetArray<WorkEntry>('workHistory');
    const entry = entries.find((e) => e.id === deleteId);
    if (!entry) return;

    // Reverse account updates: decrease bill (earnings)
    const accounts = safeGetItem<Record<string, { bill: number; cost: number }>>('accounts', {}) || {};
    entry.names.forEach((worker) => {
      if (accounts[worker]) {
        accounts[worker].bill -= entry.perWorkerAmounts[worker] || 0;
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
                  {workerRates.map((worker) => (
                    <Button
                      key={worker.name}
                      type="button"
                      onClick={() => toggleWorker(worker.name)}
                      className={`font-bold transition-all ${
                        selectedWorkers.includes(worker.name)
                          ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg scale-105'
                          : 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 hover:from-gray-300 hover:to-gray-400'
                      }`}
                    >
                      {worker.name}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantityDouble" className="text-sm">ডাবল</Label>
                    <Input
                      id="quantityDouble"
                      type="number"
                      min="0"
                      step="1"
                      value={quantityDouble}
                      onChange={(e) => setQuantityDouble(e.target.value)}
                      className="border-2"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantitySingle" className="text-sm">সিঙ্গেল</Label>
                    <Input
                      id="quantitySingle"
                      type="number"
                      min="0"
                      step="1"
                      value={quantitySingle}
                      onChange={(e) => setQuantitySingle(e.target.value)}
                      className="border-2"
                      required
                    />
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isSaving}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold py-3"
              >
                {isSaving ? 'সংরক্ষণ করা হচ্ছে...' : 'জমা দিন'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-cyan-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-cyan-500 to-blue-500">
            <CardTitle className="text-lg text-white">কাজের ইতিহাস</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>তারিখ</TableHead>
                    <TableHead>নাম</TableHead>
                    <TableHead>ডাবল</TableHead>
                    <TableHead>সিঙ্গেল</TableHead>
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
                        <TableCell>{entry.quantityDouble}</TableCell>
                        <TableCell>{entry.quantitySingle}</TableCell>
                        <TableCell className="text-right font-bold text-cyan-700">
                          ৳{entry.grandTotal.toFixed(0)}
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
        title="Confirm Submission"
        description="Are you sure you want to save this work entry?"
        onConfirm={handleConfirmSubmit}
        confirmText="Yes, Save"
        cancelText="Cancel"
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Entry"
        description="Are you sure you want to delete this entry?"
        onConfirm={handleDelete}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </>
  );
}
