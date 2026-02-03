import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '../../../components/ui/table';
import { safeGetItem, safeSetItem } from '../../../lib/storage/safeStorage';
import { notify } from '../../../components/feedback/notify';
import { Trash2 } from 'lucide-react';

interface LoanEntry {
  id: number;
  date: string;
  names: string[];
  amount: number;
  perHead: number;
  note: string;
}

export default function PaymentLoanSection() {
  const [workers, setWorkers] = useState<string[]>([]);
  const [selectedWorkers, setSelectedWorkers] = useState<string[]>([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [amount, setAmount] = useState(0);
  const [note, setNote] = useState('');
  const [history, setHistory] = useState<LoanEntry[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const loadedWorkers = safeGetItem<string[]>('workers', []) || [];
    setWorkers(loadedWorkers);

    const histories = safeGetItem<{ loan: LoanEntry[] }>('histories', { loan: [] });
    if (histories) {
      setHistory(histories.loan || []);
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

    if (amount <= 0) {
      notify.error('Please enter a valid amount');
      return;
    }

    const accounts = safeGetItem<Record<string, { bill: number; cost: number }>>('accounts', {}) || {};
    const perHead = amount / selectedWorkers.length;

    selectedWorkers.forEach((w) => {
      if (!accounts[w]) accounts[w] = { bill: 0, cost: 0 };
      accounts[w].cost += perHead;
    });

    const newEntry: LoanEntry = {
      id: Date.now(),
      date,
      names: selectedWorkers,
      amount,
      perHead,
      note: note || 'Payment',
    };

    const histories = safeGetItem<{ boardWork: any[]; userWork: any[]; nasta: any[]; loan: LoanEntry[] }>(
      'histories',
      { boardWork: [], userWork: [], nasta: [], loan: [] }
    );
    
    if (histories) {
      histories.loan.unshift(newEntry);
      safeSetItem('histories', histories);
      safeSetItem('accounts', accounts);
      setHistory(histories.loan);
    }

    setSelectedWorkers([]);
    setAmount(0);
    setNote('');

    notify.success('Payment entry saved successfully');
  };

  const handleDelete = (index: number) => {
    if (!confirm('Are you sure you want to delete this entry?')) return;

    const histories = safeGetItem<{ boardWork: any[]; userWork: any[]; nasta: any[]; loan: LoanEntry[] }>(
      'histories',
      { boardWork: [], userWork: [], nasta: [], loan: [] }
    );
    const accounts = safeGetItem<Record<string, { bill: number; cost: number }>>('accounts', {}) || {};

    if (histories) {
      const item = histories.loan[index];
      item.names.forEach((n) => {
        if (accounts[n]) accounts[n].cost -= item.perHead;
      });

      histories.loan.splice(index, 1);
      safeSetItem('histories', histories);
      safeSetItem('accounts', accounts);
      setHistory(histories.loan);
    }

    notify.success('Entry deleted successfully');
  };

  const totalAmount = history.reduce((sum, h) => sum + h.amount, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Payment / Loan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Date</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>

          <div>
            <Label>Amount</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="0.00"
            />
          </div>

          <div>
            <Label>Note</Label>
            <Input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Payment description"
            />
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
                      ? 'bg-red-600 text-white border-red-600'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {worker}
                </button>
              ))}
            </div>
          </div>

          <Button onClick={handleSave} className="w-full bg-red-600 hover:bg-red-700">
            Save Payment Entry
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Workers</TableHead>
                  <TableHead>Note</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((entry, index) => (
                  <TableRow key={entry.id}>
                    <TableCell>{entry.date}</TableCell>
                    <TableCell className="text-sm">{entry.names.join(', ')}</TableCell>
                    <TableCell>{entry.note}</TableCell>
                    <TableCell className="text-right font-medium">৳{entry.amount.toFixed(2)}</TableCell>
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
                  <TableCell colSpan={3} className="font-bold">TOTAL</TableCell>
                  <TableCell className="text-right font-bold">৳{totalAmount.toFixed(2)}</TableCell>
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
