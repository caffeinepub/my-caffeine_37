import { useState, useEffect } from 'react';
import { useSession } from '../../../state/session/useSession';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '../../../components/ui/table';
import { safeGetItem } from '../../../lib/storage/safeStorage';
import { ArrowLeft } from 'lucide-react';

interface WorkEntry {
  id: number;
  date: string;
  names: string[];
  name?: string;
  s: number;
  d: number;
  details?: { name: string; bill: number }[];
  totalTk: number;
}

interface WorkHistoryViewProps {
  onBack: () => void;
}

export default function WorkHistoryView({ onBack }: WorkHistoryViewProps) {
  const { session } = useSession();
  const [history, setHistory] = useState<WorkEntry[]>([]);

  useEffect(() => {
    loadHistory();
  }, [session?.userName]);

  const loadHistory = () => {
    if (!session?.userName) return;

    const histories = safeGetItem<{ userWork: WorkEntry[] }>('histories', { userWork: [] });
    if (histories) {
      const userHistory = histories.userWork.filter((h) => {
        if (Array.isArray(h.names)) {
          return h.names.includes(session.userName!);
        }
        return h.name === session.userName;
      });

      setHistory(userHistory);
    }
  };

  const calculateMyAmount = (entry: WorkEntry): number => {
    if (entry.details) {
      const myDetail = entry.details.find((d) => d.name === session?.userName);
      return myDetail ? myDetail.bill : 0;
    }
    return entry.totalTk;
  };

  const totalTk = history.reduce((sum, h) => sum + calculateMyAmount(h), 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-emerald-600 text-white py-6 px-4">
        <div className="container mx-auto max-w-4xl">
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-white hover:bg-emerald-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Work Details</h1>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Work Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-center">Single</TableHead>
                    <TableHead className="text-center">Double</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>{entry.date}</TableCell>
                      <TableCell className="text-center">{entry.s}</TableCell>
                      <TableCell className="text-center">{entry.d}</TableCell>
                      <TableCell className="text-right font-medium">
                        ৳{calculateMyAmount(entry).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={3} className="font-bold">TOTAL</TableCell>
                    <TableCell className="text-right font-bold">৳{totalTk.toFixed(2)}</TableCell>
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
