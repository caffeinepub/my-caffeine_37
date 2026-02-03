import { useState, useEffect } from 'react';
import { useSession } from '../../../state/session/useSession';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '../../../components/ui/table';
import { Badge } from '../../../components/ui/badge';
import { safeGetItem } from '../../../lib/storage/safeStorage';
import { ArrowLeft } from 'lucide-react';

interface PaymentEntry {
  id: number;
  date: string;
  names: string[];
  name?: string;
  amount: number;
  perHead: number;
  note: string;
}

interface PaymentHistoryViewProps {
  onBack: () => void;
}

export default function PaymentHistoryView({ onBack }: PaymentHistoryViewProps) {
  const { session } = useSession();
  const [history, setHistory] = useState<{ type: string; entry: PaymentEntry; myAmount: number }[]>([]);

  useEffect(() => {
    loadHistory();
  }, [session?.userName]);

  const loadHistory = () => {
    if (!session?.userName) return;

    const histories = safeGetItem<{ loan: PaymentEntry[]; nasta: PaymentEntry[] }>(
      'histories',
      { loan: [], nasta: [] }
    );

    if (histories) {
      const loans = histories.loan
        .filter((h) => {
          if (Array.isArray(h.names)) return h.names.includes(session.userName!);
          return h.name === session.userName;
        })
        .map((h) => ({
          type: 'Payment',
          entry: h,
          myAmount: Array.isArray(h.names) ? h.perHead : h.amount,
        }));

      const nastas = histories.nasta
        .filter((h) => {
          if (Array.isArray(h.names)) return h.names.includes(session.userName!);
          return h.name === session.userName;
        })
        .map((h) => ({
          type: 'Nasta',
          entry: h,
          myAmount: Array.isArray(h.names) ? h.perHead : h.amount,
        }));

      const combined = [...loans, ...nastas].sort((a, b) => b.entry.id - a.entry.id);
      setHistory(combined);
    }
  };

  const totalAmount = history.reduce((sum, h) => sum + h.myAmount, 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-red-600 text-white py-6 px-4">
        <div className="container mx-auto max-w-4xl">
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-white hover:bg-red-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Payment & Expenses</h1>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Payment Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{item.entry.date}</TableCell>
                      <TableCell>
                        <Badge variant={item.type === 'Payment' ? 'destructive' : 'secondary'}>
                          {item.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.entry.note}</TableCell>
                      <TableCell className="text-right font-medium">৳{item.myAmount.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={3} className="font-bold">TOTAL</TableCell>
                    <TableCell className="text-right font-bold">৳{totalAmount.toFixed(2)}</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
