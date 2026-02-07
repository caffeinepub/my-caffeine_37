import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Button } from '../../../components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { loadNormalizedProductionHistory, NormalizedProductionEntry } from '../../../lib/storage/productionHistoryStorage';

interface ProductionHistoryViewProps {
  onBack: () => void;
}

export default function ProductionHistoryView({ onBack }: ProductionHistoryViewProps) {
  const [history, setHistory] = useState<NormalizedProductionEntry[]>([]);

  useEffect(() => {
    loadProductionData();
  }, []);

  const loadProductionData = () => {
    const entries = loadNormalizedProductionHistory();
    setHistory(entries.sort((a, b) => b.timestamp - a.timestamp));
  };

  // Compute summary totals
  const uniqueWorkers = new Set<string>();
  history.forEach((entry) => {
    entry.names.forEach((name) => uniqueWorkers.add(name));
  });

  const grandTotalDouble = history.reduce((sum, e) => sum + e.quantityDouble, 0);
  const grandTotalSingle = history.reduce((sum, e) => sum + e.quantitySingle, 0);
  const grandTotalAmount = history.reduce((sum, e) => sum + e.total, 0);

  return (
    <div className="min-h-full bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 p-3">
      <Card className="shadow-xl border-2 border-emerald-200">
        <CardHeader className="bg-gradient-to-r from-emerald-100 to-teal-100 py-3">
          <div className="flex items-center gap-3">
            <Button
              onClick={onBack}
              variant="ghost"
              size="sm"
              className="hover:bg-emerald-200 text-emerald-900"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <CardTitle className="text-xl font-bold text-emerald-900">প্রোডাকশন</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-4 px-2">
          {history.length === 0 ? (
            <div className="text-center text-muted-foreground py-8 text-sm">
              কোনো রেকর্ড নেই
            </div>
          ) : (
            <>
              {/* Summary Section */}
              <div className="mb-4 bg-emerald-100 rounded-lg p-4 border-2 border-emerald-300">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-emerald-700">মোট কর্মী</div>
                    <div className="text-lg font-bold text-emerald-900">{uniqueWorkers.size}</div>
                  </div>
                  <div>
                    <div className="text-xs text-emerald-700">মোট ডাবল</div>
                    <div className="text-lg font-bold text-emerald-900">{grandTotalDouble}</div>
                  </div>
                  <div>
                    <div className="text-xs text-emerald-700">মোট সিঙ্গেল</div>
                    <div className="text-lg font-bold text-emerald-900">{grandTotalSingle}</div>
                  </div>
                  <div>
                    <div className="text-xs text-emerald-700">সর্বমোট টাকা</div>
                    <div className="text-lg font-bold text-emerald-900">৳{grandTotalAmount.toFixed(0)}</div>
                  </div>
                </div>
              </div>

              {/* History Table */}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">তারিখ</TableHead>
                      <TableHead className="text-xs">কর্মীর নাম</TableHead>
                      <TableHead className="text-xs text-right">ডাবল</TableHead>
                      <TableHead className="text-xs text-right">সিঙ্গেল</TableHead>
                      <TableHead className="text-xs text-right">মোট টাকা</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell className="text-xs font-medium">{entry.date}</TableCell>
                        <TableCell className="text-xs">{entry.names.join(', ')}</TableCell>
                        <TableCell className="text-xs text-right">{entry.quantityDouble}</TableCell>
                        <TableCell className="text-xs text-right">{entry.quantitySingle}</TableCell>
                        <TableCell className="text-xs text-right font-bold text-emerald-700">
                          ৳{entry.total.toFixed(0)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
