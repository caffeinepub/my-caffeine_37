import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '../../../components/ui/table';
import { safeGetItem, safeSetItem } from '../../../lib/storage/safeStorage';
import { notify } from '../../../components/feedback/notify';
import { Trash2 } from 'lucide-react';

interface WorkEntry {
  id: number;
  date: string;
  names: string[];
  s: number;
  d: number;
  details: { name: string; bill: number }[];
  totalBody: number;
  totalTk: number;
}

export default function WorkSection() {
  const [workers, setWorkers] = useState<string[]>([]);
  const [rates, setRates] = useState<Record<string, { s: number; d: number }>>({});
  const [selectedWorkers, setSelectedWorkers] = useState<string[]>([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [single, setSingle] = useState(0);
  const [double, setDouble] = useState(0);
  const [history, setHistory] = useState<WorkEntry[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const loadedWorkers = safeGetItem<string[]>('workers', []) || [];
    const loadedRates = safeGetItem<Record<string, { s: number; d: number }>>('rates', {}) || {};
    setWorkers(loadedWorkers);
    setRates(loadedRates);

    const histories = safeGetItem<{ userWork: WorkEntry[] }>('histories', { userWork: [] });
    if (histories) {
      setHistory(histories.userWork || []);
    }
  };

  const toggleWorker = (worker: string) => {
    setSelectedWorkers((prev) =>
      prev.includes(worker) ? prev.filter((w) => w !== worker) : [...prev, worker]
    );
  };

  const handleSave = () => {
    if (selectedWorkers.length === 0) {
      notify.error('Please select at least one worker');
      return;
    }

    const accounts = safeGetItem<Record<string, { bill: number; cost: number }>>('accounts', {}) || {};
    const details: { name: string; bill: number }[] = [];
    let totalBillForGroup = 0;

    selectedWorkers.forEach((w) => {
      if (!accounts[w]) accounts[w] = { bill: 0, cost: 0 };
      const rS = rates[w]?.s || 0;
      const rD = rates[w]?.d || 0;
      const bill = single * rS + double * rD;

      accounts[w].bill += bill;
      totalBillForGroup += bill;
      details.push({ name: w, bill });
    });

    const newEntry: WorkEntry = {
      id: Date.now(),
      date,
      names: selectedWorkers,
      s: single,
      d: double,
      details,
      totalBody: (single + double) * selectedWorkers.length,
      totalTk: totalBillForGroup,
    };

    const histories = safeGetItem<{ boardWork: any[]; userWork: WorkEntry[]; nasta: any[]; loan: any[] }>(
      'histories',
      { boardWork: [], userWork: [], nasta: [], loan: [] }
    );
    
    if (histories) {
      histories.userWork.unshift(newEntry);
      safeSetItem('histories', histories);
      safeSetItem('accounts', accounts);
      setHistory(histories.userWork);
    }

    setSelectedWorkers([]);
    setSingle(0);
    setDouble(0);

    notify.success('Work entry saved successfully');
  };

  const handleDelete = (index: number) => {
    if (!confirm('Are you sure you want to delete this entry?')) return;

    const histories = safeGetItem<{ boardWork: any[]; userWork: WorkEntry[]; nasta: any[]; loan: any[] }>(
      'histories',
      { boardWork: [], userWork: [], nasta: [], loan: [] }
    );
    const accounts = safeGetItem<Record<string, { bill: number; cost: number }>>('accounts', {}) || {};

    if (histories) {
      const item = histories.userWork[index];
      if (item.details) {
        item.details.forEach((d) => {
          if (accounts[d.name]) accounts[d.name].bill -= d.bill;
        });
      }

      histories.userWork.splice(index, 1);
      safeSetItem('histories', histories);
      safeSetItem('accounts', accounts);
      setHistory(histories.userWork);
    }

    notify.success('Entry deleted successfully');
  };

  const totalTk = history.reduce((sum, h) => sum + h.totalTk, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Work Entry (User Rate)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Date</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>

          <div>
            <Label>Select Workers</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {workers.map((worker) => (
                <button
                  key={worker}
                  onClick={() => toggleWorker(worker)}
                  className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                    selectedWorkers.includes(worker)
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {worker}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Single (Qty)</Label>
              <Input
                type="number"
                value={single}
                onChange={(e) => setSingle(Number(e.target.value))}
                placeholder="0"
              />
            </div>
            <div>
              <Label>Double (Qty)</Label>
              <Input
                type="number"
                value={double}
                onChange={(e) => setDouble(Number(e.target.value))}
                placeholder="0"
              />
            </div>
          </div>

          <Button onClick={handleSave} className="w-full bg-emerald-600 hover:bg-emerald-700">
            Save Work Entry
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Work History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Workers</TableHead>
                  <TableHead className="text-center">S</TableHead>
                  <TableHead className="text-center">D</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((entry, index) => (
                  <TableRow key={entry.id}>
                    <TableCell>{entry.date}</TableCell>
                    <TableCell className="text-sm">{entry.names.join(', ')}</TableCell>
                    <TableCell className="text-center">{entry.s}</TableCell>
                    <TableCell className="text-center">{entry.d}</TableCell>
                    <TableCell className="text-right font-medium">৳{entry.totalTk.toFixed(2)}</TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={4} className="font-bold">TOTAL</TableCell>
                  <TableCell className="text-right font-bold">৳{totalTk.toFixed(2)}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
