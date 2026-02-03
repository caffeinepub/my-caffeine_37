import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '../../../components/ui/table';
import { safeGetItem, safeSetItem } from '../../../lib/storage/safeStorage';
import { notify } from '../../../components/feedback/notify';
import { Trash2 } from 'lucide-react';

interface BoardWorkEntry {
  id: number;
  date: string;
  names: string[];
  s: number;
  d: number;
  totalBody: number;
  totalTk: number;
}

export default function ProductionSection() {
  const [workers, setWorkers] = useState<string[]>([]);
  const [selectedWorkers, setSelectedWorkers] = useState<string[]>([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [single, setSingle] = useState(0);
  const [double, setDouble] = useState(0);
  const [rateS, setRateS] = useState(0);
  const [rateD, setRateD] = useState(0);
  const [history, setHistory] = useState<BoardWorkEntry[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const loadedWorkers = safeGetItem<string[]>('workers', []) || [];
    setWorkers(loadedWorkers);

    const histories = safeGetItem<{ boardWork: BoardWorkEntry[] }>('histories', { boardWork: [] });
    if (histories) {
      setHistory(histories.boardWork || []);
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

    if (rateS <= 0 && rateD <= 0) {
      notify.error('Please enter at least one rate');
      return;
    }

    const totalTk = single * rateS + double * rateD;
    const newEntry: BoardWorkEntry = {
      id: Date.now(),
      date,
      names: selectedWorkers,
      s: single,
      d: double,
      totalBody: single + double,
      totalTk,
    };

    const histories = safeGetItem<{ boardWork: BoardWorkEntry[]; userWork: any[]; nasta: any[]; loan: any[] }>(
      'histories',
      { boardWork: [], userWork: [], nasta: [], loan: [] }
    );
    
    if (histories) {
      histories.boardWork.unshift(newEntry);
      safeSetItem('histories', histories);
      setHistory(histories.boardWork);
    }

    setSelectedWorkers([]);
    setSingle(0);
    setDouble(0);
    setRateS(0);
    setRateD(0);

    notify.success('Production entry saved successfully');
  };

  const handleDelete = (index: number) => {
    if (!confirm('Are you sure you want to delete this entry?')) return;

    const histories = safeGetItem<{ boardWork: BoardWorkEntry[]; userWork: any[]; nasta: any[]; loan: any[] }>(
      'histories',
      { boardWork: [], userWork: [], nasta: [], loan: [] }
    );
    
    if (histories) {
      histories.boardWork.splice(index, 1);
      safeSetItem('histories', histories);
      setHistory(histories.boardWork);
    }

    notify.success('Entry deleted successfully');
  };

  const totalBody = history.reduce((sum, h) => sum + h.totalBody, 0);
  const totalTk = history.reduce((sum, h) => sum + h.totalTk, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Production Entry (Board Rate)</CardTitle>
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
                      ? 'bg-slate-900 text-white border-slate-900'
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Rate (Single)</Label>
              <Input
                type="number"
                value={rateS}
                onChange={(e) => setRateS(Number(e.target.value))}
                placeholder="0"
              />
            </div>
            <div>
              <Label>Rate (Double)</Label>
              <Input
                type="number"
                value={rateD}
                onChange={(e) => setRateD(Number(e.target.value))}
                placeholder="0"
              />
            </div>
          </div>

          <Button onClick={handleSave} className="w-full">
            Save Production Entry
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Production History</CardTitle>
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
                  <TableCell colSpan={3} className="font-bold">TOTAL</TableCell>
                  <TableCell className="text-center font-bold">{totalBody}</TableCell>
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
