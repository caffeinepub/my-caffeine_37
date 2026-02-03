import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { safeGetItem, safeSetItem } from '../../../lib/storage/safeStorage';
import { notify } from '../../../components/feedback/notify';
import ApprovalsSection from './ApprovalsSection';
import { Trash2 } from 'lucide-react';

export default function SettingsSection() {
  const [workers, setWorkers] = useState<string[]>([]);
  const [rates, setRates] = useState<Record<string, { s: number; d: number }>>({});
  const [accounts, setAccounts] = useState<Record<string, { bill: number; cost: number }>>({});
  const [newWorkerName, setNewWorkerName] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const loadedWorkers = safeGetItem<string[]>('workers', []) || [];
    const loadedRates = safeGetItem<Record<string, { s: number; d: number }>>('rates', {}) || {};
    const loadedAccounts = safeGetItem<Record<string, { bill: number; cost: number }>>('accounts', {}) || {};
    setWorkers(loadedWorkers);
    setRates(loadedRates);
    setAccounts(loadedAccounts);
  };

  const handleAddWorker = () => {
    const name = newWorkerName.trim();
    if (!name) {
      notify.error('Please enter a worker name');
      return;
    }

    if (workers.includes(name)) {
      notify.error('Worker already exists');
      return;
    }

    const updatedWorkers = [...workers, name];
    const updatedRates = { ...rates, [name]: { s: 0, d: 0 } };

    setWorkers(updatedWorkers);
    setRates(updatedRates);
    safeSetItem('workers', updatedWorkers);
    safeSetItem('rates', updatedRates);
    setNewWorkerName('');

    notify.success('Worker added successfully');
  };

  const handleDeleteWorker = (name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;

    const updatedWorkers = workers.filter((w) => w !== name);
    const updatedRates = { ...rates };
    delete updatedRates[name];

    setWorkers(updatedWorkers);
    setRates(updatedRates);
    safeSetItem('workers', updatedWorkers);
    safeSetItem('rates', updatedRates);

    notify.success('Worker deleted successfully');
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Final Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Worker</TableHead>
                  <TableHead className="text-right">Total Work</TableHead>
                  <TableHead className="text-right">Expenses/Loan</TableHead>
                  <TableHead className="text-right">Balance Due</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workers.map((worker) => {
                  const acc = accounts[worker] || { bill: 0, cost: 0 };
                  const balance = acc.bill - acc.cost;
                  return (
                    <TableRow key={worker}>
                      <TableCell className="font-medium">{worker}</TableCell>
                      <TableCell className="text-right">৳{acc.bill.toFixed(0)}</TableCell>
                      <TableCell className="text-right">৳{acc.cost.toFixed(0)}</TableCell>
                      <TableCell className="text-right font-bold text-emerald-600">
                        ৳{balance.toFixed(0)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <ApprovalsSection onApprovalChange={loadData} />

      <Card>
        <CardHeader>
          <CardTitle>Worker & Rate Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter new worker name"
              value={newWorkerName}
              onChange={(e) => setNewWorkerName(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleAddWorker}>Add Worker</Button>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Single Rate</TableHead>
                  <TableHead>Double Rate</TableHead>
                  <TableHead className="text-center">Action</TableHead>
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
                        onClick={() => handleDeleteWorker(worker)}
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
  );
}
