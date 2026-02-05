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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, [session?.userName]);

  const loadHistory = () => {
    setIsLoading(true);
    
    try {
      if (!session?.userName) {
        setHistory([]);
        setIsLoading(false);
        return;
      }

      const histories = safeGetItem<{ loan?: PaymentEntry[]; nasta?: PaymentEntry[] }>(
        'histories',
        { loan: [], nasta: [] }
      );

      if (!histories) {
        setHistory([]);
        setIsLoading(false);
        return;
      }

      const loanArray = Array.isArray(histories.loan) ? histories.loan : [];
      const nastaArray = Array.isArray(histories.nasta) ? histories.nasta : [];

      const loans = loanArray
        .filter((h) => {
          if (!h) return false;
          if (Array.isArray(h.names)) return h.names.includes(session.userName!);
          return h.name === session.userName;
        })
        .map((h) => ({
          type: 'Payment',
          entry: h,
          myAmount: Array.isArray(h.names) ? (h.perHead || 0) : (h.amount || 0),
        }));

      const nastas = nastaArray
        .filter((h) => {
          if (!h) return false;
          if (Array.isArray(h.names)) return h.names.includes(session.userName!);
          return h.name === session.userName;
        })
        .map((h) => ({
          type: 'Nasta',
          entry: h,
          myAmount: Array.isArray(h.names) ? (h.perHead || 0) : (h.amount || 0),
        }));

      const combined = [...loans, ...nastas].sort((a, b) => (b.entry.id || 0) - (a.entry.id || 0));
      setHistory(combined);
    } catch (error) {
      console.error('Error loading payment history:', error);
      setHistory([]);
    } finally {
      setIsLoading(false);
    }
  };

  const totalAmount = history.reduce((sum, h) => sum + h.myAmount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 text-white py-6 px-4 shadow-xl">
        <div className="container mx-auto max-w-4xl">
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-white hover:bg-white/20 mb-4 font-bold"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            ফিরে যান
          </Button>
          <h1 className="text-3xl font-bold">পেমেন্ট ও খরচ</h1>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 py-6">
        <Card className="shadow-xl border-2 border-purple-200">
          <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100">
            <CardTitle className="text-purple-900">আপনার পেমেন্ট রেকর্ড</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
                <p className="mt-4 text-muted-foreground">লোড হচ্ছে...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>তারিখ</TableHead>
                      <TableHead>ধরন</TableHead>
                      <TableHead>বিবরণ</TableHead>
                      <TableHead className="text-right">পরিমাণ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground py-12">
                          কোনো রেকর্ড নেই
                        </TableCell>
                      </TableRow>
                    ) : (
                      history.map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">{item.entry.date || '-'}</TableCell>
                          <TableCell>
                            <Badge variant={item.type === 'Payment' ? 'destructive' : 'secondary'} className="font-bold">
                              {item.type}
                            </Badge>
                          </TableCell>
                          <TableCell>{item.entry.note || '-'}</TableCell>
                          <TableCell className="text-right font-bold text-lg">৳{item.myAmount.toFixed(2)}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                  {history.length > 0 && (
                    <TableFooter>
                      <TableRow className="bg-purple-100">
                        <TableCell colSpan={3} className="font-bold text-lg">সর্বমোট</TableCell>
                        <TableCell className="text-right font-bold text-xl text-purple-900">৳{totalAmount.toFixed(2)}</TableCell>
                      </TableRow>
                    </TableFooter>
                  )}
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
