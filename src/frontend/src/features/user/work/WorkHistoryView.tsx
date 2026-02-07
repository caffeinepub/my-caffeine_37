import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Button } from '../../../components/ui/button';
import { ArrowLeft, Eye } from 'lucide-react';
import { safeGetArray } from '../../../lib/storage/safeStorage';
import { useSession } from '../../../state/session/useSession';
import WorkEntryActionSheet from './WorkEntryActionSheet';

interface WorkEntry {
  id: string;
  date: string;
  names: string[];
  quantityDouble: number;
  quantitySingle: number;
  perWorkerAmounts: Record<string, number>;
  grandTotal: number;
  timestamp: number;
}

interface WorkHistoryViewProps {
  onBack: () => void;
}

export default function WorkHistoryView({ onBack }: WorkHistoryViewProps) {
  const { session } = useSession();
  const [history, setHistory] = useState<WorkEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<WorkEntry | null>(null);

  useEffect(() => {
    loadWorkData();
  }, []);

  const loadWorkData = () => {
    const entries = safeGetArray<WorkEntry>('workHistory');
    const filtered = entries.filter((e) => e.names.includes(session?.userName || ''));
    setHistory(filtered.sort((a, b) => b.timestamp - a.timestamp));
  };

  const totalDouble = history.reduce((sum, e) => sum + e.quantityDouble, 0);
  const totalSingle = history.reduce((sum, e) => sum + e.quantitySingle, 0);
  const totalAmount = history.reduce((sum, e) => {
    const myAmount = e.perWorkerAmounts[session?.userName || ''] || 0;
    return sum + myAmount;
  }, 0);

  return (
    <>
      <div className="min-h-full bg-gradient-to-br from-cyan-50 via-blue-50 to-sky-50 p-3">
        <Card className="shadow-xl border-2 border-cyan-200">
          <CardHeader className="bg-gradient-to-r from-cyan-100 to-blue-100 py-3">
            <div className="flex items-center gap-3">
              <Button
                onClick={onBack}
                variant="ghost"
                size="sm"
                className="hover:bg-cyan-200 text-cyan-900"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <CardTitle className="text-xl font-bold text-cyan-900">কাজ</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4 px-2">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">তারিখ</TableHead>
                    <TableHead className="text-xs text-right">ডাবল</TableHead>
                    <TableHead className="text-xs text-right">সিঙ্গেল</TableHead>
                    <TableHead className="text-xs text-right">মোট</TableHead>
                    <TableHead className="text-xs text-center">অ্যাকশন</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8 text-sm">
                        কোনো রেকর্ড নেই
                      </TableCell>
                    </TableRow>
                  ) : (
                    history.map((entry) => {
                      const myAmount = entry.perWorkerAmounts[session?.userName || ''] || 0;
                      return (
                        <TableRow key={entry.id}>
                          <TableCell className="text-xs font-medium">{entry.date}</TableCell>
                          <TableCell className="text-xs text-right">{entry.quantityDouble}</TableCell>
                          <TableCell className="text-xs text-right">{entry.quantitySingle}</TableCell>
                          <TableCell className="text-xs text-right font-bold text-cyan-700">
                            ৳{myAmount.toFixed(0)}
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedEntry(entry)}
                              className="text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
            
            {history.length > 0 && (
              <div className="mt-4 bg-cyan-200 rounded-lg p-4 border-2 border-cyan-300">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm font-bold text-cyan-900">মোট ডাবল</div>
                  <div className="text-lg font-bold text-cyan-900">{totalDouble}</div>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm font-bold text-cyan-900">মোট সিঙ্গেল</div>
                  <div className="text-lg font-bold text-cyan-900">{totalSingle}</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm font-bold text-cyan-900">সর্বমোট টাকা</div>
                  <div className="text-xl font-bold text-cyan-900">৳{totalAmount.toFixed(0)}</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {selectedEntry && (
        <WorkEntryActionSheet
          entry={selectedEntry}
          userName={session?.userName || ''}
          onClose={() => setSelectedEntry(null)}
        />
      )}
    </>
  );
}
