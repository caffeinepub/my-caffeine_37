import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { safeGetItem } from '../../../lib/storage/safeStorage';

export default function FinalBalanceSection() {
  const [workers, setWorkers] = useState<string[]>([]);
  const [accounts, setAccounts] = useState<Record<string, { bill: number; cost: number }>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const loadedWorkers = safeGetItem<string[]>('workers', []) || [];
    const loadedAccounts = safeGetItem<Record<string, { bill: number; cost: number }>>('accounts', {}) || {};
    setWorkers(loadedWorkers);
    setAccounts(loadedAccounts);
  };

  return (
    <div className="space-y-6">
      <Card className="border-slate-200">
        <CardHeader className="bg-slate-50">
          <CardTitle className="text-lg">চূড়ান্ত ব্যালেন্স</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>কর্মী</TableHead>
                  <TableHead className="text-right">মোট কাজ</TableHead>
                  <TableHead className="text-right">খরচ/লোন</TableHead>
                  <TableHead className="text-right">বাকি</TableHead>
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
    </div>
  );
}
