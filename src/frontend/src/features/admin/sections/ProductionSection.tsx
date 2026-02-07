import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { safeGetArray, safeSetItem } from '../../../lib/storage/safeStorage';
import { notify } from '../../../components/feedback/notify';
import { ConfirmDialog } from '../../../components/feedback/ConfirmDialog';
import { useSingleConfirmSubmit } from '../../../hooks/useSingleConfirmSubmit';
import { Trash2 } from 'lucide-react';

interface ProductionEntry {
  id: string;
  date: string;
  names: string[];
  quantityDouble: number;
  quantitySingle: number;
  rateDouble: number;
  rateSingle: number;
  total: number;
  timestamp: number;
}

export default function ProductionSection() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedWorkers, setSelectedWorkers] = useState<string[]>([]);
  const [quantityDouble, setQuantityDouble] = useState('');
  const [quantitySingle, setQuantitySingle] = useState('');
  const [rateDouble, setRateDouble] = useState('');
  const [rateSingle, setRateSingle] = useState('');
  const [workers, setWorkers] = useState<string[]>([]);
  const [history, setHistory] = useState<ProductionEntry[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { isSaving, showConfirm, setShowConfirm, handleSubmit: handleConfirmSubmit } = useSingleConfirmSubmit(
    async () => {
      await saveProduction();
    }
  );

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

    if (!quantityDouble || !quantitySingle || !rateDouble || !rateSingle) {
      notify.error('সব ঘর পূরণ করুন');
      return;
    }

    const qtyDouble = Number(quantityDouble);
    const qtySingle = Number(quantitySingle);
    const rtDouble = Number(rateDouble);
    const rtSingle = Number(rateSingle);

    if (qtyDouble < 0 || qtySingle < 0 || rtDouble < 0 || rtSingle < 0) {
      notify.error('মান ঋণাত্মক হতে পারে না');
      return;
    }

    setShowConfirm(true);
  };

  const saveProduction = async () => {
    const qtyDouble = Number(quantityDouble);
    const qtySingle = Number(quantitySingle);
    const rtDouble = Number(rateDouble);
    const rtSingle = Number(rateSingle);

    const total = qtyDouble * rtDouble + qtySingle * rtSingle;
    const entry: ProductionEntry = {
      id: Date.now().toString(),
      date,
      names: selectedWorkers,
      quantityDouble: qtyDouble,
      quantitySingle: qtySingle,
      rateDouble: rtDouble,
      rateSingle: rtSingle,
      total,
      timestamp: Date.now(),
    };

    const entries = safeGetArray<ProductionEntry>('productionHistory');
    entries.push(entry);
    safeSetItem('productionHistory', entries);

    // Production section no longer updates accounts (report-only)

    setSelectedWorkers([]);
    setQuantityDouble('');
    setQuantitySingle('');
    setRateDouble('');
    setRateSingle('');
    loadHistory();
    notify.success('প্রোডাকশন সফলভাবে যোগ করা হয়েছে');
  };

  const handleDelete = () => {
    if (!deleteId) return;

    const entries = safeGetArray<ProductionEntry>('productionHistory');
    
    // Production section no longer updates accounts (report-only)

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

              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rateDouble" className="text-sm">রেট</Label>
                    <Input
                      id="rateDouble"
                      type="number"
                      min="0"
                      step="0.01"
                      value={rateDouble}
                      onChange={(e) => setRateDouble(e.target.value)}
                      className="border-2"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rateSingle" className="text-sm">রেট</Label>
                    <Input
                      id="rateSingle"
                      type="number"
                      min="0"
                      step="0.01"
                      value={rateSingle}
                      onChange={(e) => setRateSingle(e.target.value)}
                      className="border-2"
                      required
                    />
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isSaving}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-3"
              >
                {isSaving ? 'সংরক্ষণ করা হচ্ছে...' : 'জমা দিন'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-emerald-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500">
            <CardTitle className="text-lg text-white">প্রোডাকশন ইতিহাস</CardTitle>
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
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title="নিশ্চিত করুন"
        description="আপনি কি এই প্রোডাকশন এন্ট্রি সংরক্ষণ করতে চান?"
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
