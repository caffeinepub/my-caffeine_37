import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { safeGetArray, safeSetItem, safeGetItem } from '../../../lib/storage/safeStorage';
import { notify } from '../../../components/feedback/notify';
import { ConfirmDialog } from '../../../components/feedback/ConfirmDialog';
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
      notify.error('Select at least one worker');
      return;
    }

    if (!quantityDouble || !quantitySingle || !rateDouble || !rateSingle) {
      notify.error('Fill in all fields');
      return;
    }

    const qtyDouble = Number(quantityDouble);
    const qtySingle = Number(quantitySingle);
    const rtDouble = Number(rateDouble);
    const rtSingle = Number(rateSingle);

    if (qtyDouble < 0 || qtySingle < 0 || rtDouble < 0 || rtSingle < 0) {
      notify.error('Values cannot be negative');
      return;
    }

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

    const accounts = safeGetItem<Record<string, { bill: number; cost: number }>>('accounts', {}) || {};
    selectedWorkers.forEach((worker) => {
      if (!accounts[worker]) {
        accounts[worker] = { bill: 0, cost: 0 };
      }
      accounts[worker].bill += total;
    });
    safeSetItem('accounts', accounts);

    setSelectedWorkers([]);
    setQuantityDouble('');
    setQuantitySingle('');
    setRateDouble('');
    setRateSingle('');
    loadHistory();
    notify.success('Production added successfully');
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
    notify.success('Entry deleted');
  };

  return (
    <>
      <div className="space-y-6">
        <Card className="border-emerald-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500">
            <CardTitle className="text-lg text-white">Add New Production</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="border-2"
                />
              </div>

              <div className="space-y-2">
                <Label>Select Workers</Label>
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
                <Label>Work Quantity</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantityDouble" className="text-sm">Double</Label>
                    <Input
                      id="quantityDouble"
                      type="number"
                      min="0"
                      step="1"
                      value={quantityDouble}
                      onChange={(e) => setQuantityDouble(e.target.value)}
                      placeholder="Double quantity"
                      className="border-2"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantitySingle" className="text-sm">Single</Label>
                    <Input
                      id="quantitySingle"
                      type="number"
                      min="0"
                      step="1"
                      value={quantitySingle}
                      onChange={(e) => setQuantitySingle(e.target.value)}
                      placeholder="Single quantity"
                      className="border-2"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Work Rate</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rateDouble" className="text-sm">Double Rate (৳)</Label>
                    <Input
                      id="rateDouble"
                      type="number"
                      min="0"
                      step="0.01"
                      value={rateDouble}
                      onChange={(e) => setRateDouble(e.target.value)}
                      placeholder="Double rate"
                      className="border-2"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rateSingle" className="text-sm">Single Rate (৳)</Label>
                    <Input
                      id="rateSingle"
                      type="number"
                      min="0"
                      step="0.01"
                      value={rateSingle}
                      onChange={(e) => setRateSingle(e.target.value)}
                      placeholder="Single rate"
                      className="border-2"
                      required
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-3">
                Submit
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-emerald-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500">
            <CardTitle className="text-lg text-white">Production History</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Double</TableHead>
                    <TableHead>Single</TableHead>
                    <TableHead>D-Rate</TableHead>
                    <TableHead>S-Rate</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                        No entries
                      </TableCell>
                    </TableRow>
                  ) : (
                    history.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell className="font-medium">{entry.date}</TableCell>
                        <TableCell>{entry.names.join(', ')}</TableCell>
                        <TableCell>{entry.quantityDouble}</TableCell>
                        <TableCell>{entry.quantitySingle}</TableCell>
                        <TableCell>৳{entry.rateDouble}</TableCell>
                        <TableCell>৳{entry.rateSingle}</TableCell>
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
        title="Delete Entry"
        description="Are you sure you want to delete this entry?"
        onConfirm={handleDelete}
        confirmText="Yes, delete"
        cancelText="No"
        variant="destructive"
      />
    </>
  );
}
