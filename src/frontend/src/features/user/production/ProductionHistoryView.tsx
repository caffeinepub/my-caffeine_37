import { useState, useEffect } from 'react';
import { useSession } from '../../../state/session/useSession';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '../../../components/ui/table';
import { safeGetItem } from '../../../lib/storage/safeStorage';
import { formatWorkerNames } from './workerNameFormat';
import { ArrowLeft } from 'lucide-react';
import DashboardFooter from '../../../components/layout/DashboardFooter';

interface BoardWorkEntry {
  id: number;
  date: string;
  names: string[];
  name?: string;
  s: number;
  d: number;
  totalBody: number;
  totalTk: number;
}

interface ProductionHistoryViewProps {
  onBack: () => void;
}

export default function ProductionHistoryView({ onBack }: ProductionHistoryViewProps) {
  const { session } = useSession();
  const [history, setHistory] = useState<BoardWorkEntry[]>([]);

  useEffect(() => {
    loadHistory();
  }, [session?.userName]);

  const loadHistory = () => {
    if (!session?.userName) return;

    const histories = safeGetItem<{ boardWork: BoardWorkEntry[] }>('histories', { boardWork: [] });
    if (histories) {
      const userHistory = histories.boardWork.filter((h) => {
        if (Array.isArray(h.names)) {
          return h.names.includes(session.userName!);
        }
        return h.name === session.userName;
      });

      setHistory(userHistory);
    }
  };

  const totalBody = history.reduce((sum, h) => sum + h.totalBody, 0);
  const totalTk = history.reduce((sum, h) => sum + h.totalTk, 0);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-slate-900 text-white py-6 px-4 shadow-xl">
        <div className="container mx-auto max-w-4xl">
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-white hover:bg-slate-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Production History</h1>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pt-[140px] pb-24 bg-slate-50">
        <div className="container mx-auto max-w-4xl px-4 py-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Production Records</CardTitle>
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
                      <TableHead className="text-center">Total</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>{entry.date}</TableCell>
                        <TableCell className="text-sm">
                          {formatWorkerNames(entry).join(', ')}
                        </TableCell>
                        <TableCell className="text-center">{entry.s}</TableCell>
                        <TableCell className="text-center">{entry.d}</TableCell>
                        <TableCell className="text-center">{entry.totalBody}</TableCell>
                        <TableCell className="text-right font-medium">৳{entry.totalTk.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={4} className="font-bold">TOTAL</TableCell>
                      <TableCell className="text-center font-bold">{totalBody}</TableCell>
                      <TableCell className="text-right font-bold">৳{totalTk.toFixed(2)}</TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-20">
        <DashboardFooter onSupportClick={() => {}} />
      </div>
    </div>
  );
}
