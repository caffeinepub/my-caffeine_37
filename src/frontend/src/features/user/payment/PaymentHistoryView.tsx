import { useState, useEffect } from 'react';
import { useSession } from '../../../state/session/useSession';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { safeGetItem } from '../../../lib/storage/safeStorage';

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

      const combined = [...loans].sort((a, b) => (b.entry.id || 0) - (a.entry.id || 0));
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
    <div className="min-h-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-3">
      <Card className="shadow-xl border-2 border-blue-200">
        <CardHeader className="bg-gradient-to-r from-blue-100 to-indigo-100 py-3">
          <div className="flex items-center gap-3">
            <Button
              onClick={onBack}
              variant="ghost"
              size="sm"
              className="hover:bg-blue-200 text-blue-900"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <CardTitle className="text-xl font-bold text-blue-900">পেমেন্ট ও লোন</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-4 px-2">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
              <p className="mt-4 text-base text-muted-foreground">লোড হচ্ছে...</p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                {history.length === 0 ? (
                  <div className="text-center text-muted-foreground py-12 text-base">
                    কোনো রেকর্ড নেই
                  </div>
                ) : (
                  history.map((item, idx) => (
                    <div key={idx} className="bg-white border-2 border-blue-200 rounded-lg p-3 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="destructive" className="font-bold text-xs">
                              {item.type}
                            </Badge>
                            <span className="text-sm font-semibold text-blue-900">{item.entry.date || '-'}</span>
                          </div>
                          <div className="text-sm text-gray-600 break-words">
                            {item.entry.note || '-'}
                          </div>
                        </div>
                        <div className="text-right ml-2 flex-shrink-0">
                          <div className="text-lg font-bold text-blue-700">৳{item.myAmount.toFixed(2)}</div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              {/* Total Summary */}
              {history.length > 0 && (
                <div className="mt-4 bg-blue-200 rounded-lg p-4 border-2 border-blue-300">
                  <div className="flex justify-between items-center">
                    <div className="text-base font-bold text-blue-900">সর্বমোট</div>
                    <div className="text-2xl font-bold text-blue-900">৳{totalAmount.toFixed(2)}</div>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
