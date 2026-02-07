import { useState, useEffect } from 'react';
import { useSession } from '../../../state/session/useSession';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { safeGetItem } from '../../../lib/storage/safeStorage';

interface NastaEntry {
  id: number;
  date: string;
  names: string[];
  name?: string;
  amount: number;
  perHead: number;
  note: string;
}

export default function NastaHistoryView() {
  const { session } = useSession();
  const [history, setHistory] = useState<NastaEntry[]>([]);
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

      const histories = safeGetItem<{ nasta?: NastaEntry[] }>(
        'histories',
        { nasta: [] }
      );

      if (!histories) {
        setHistory([]);
        setIsLoading(false);
        return;
      }

      const nastaArray = Array.isArray(histories.nasta) ? histories.nasta : [];

      const userNasta = nastaArray
        .filter((h) => {
          if (!h) return false;
          if (Array.isArray(h.names)) return h.names.includes(session.userName!);
          return h.name === session.userName;
        })
        .sort((a, b) => (b.id || 0) - (a.id || 0));

      setHistory(userNasta);
    } catch (error) {
      console.error('Error loading nasta history:', error);
      setHistory([]);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateMyAmount = (entry: NastaEntry): number => {
    return Array.isArray(entry.names) ? (entry.perHead || 0) : (entry.amount || 0);
  };

  const totalAmount = history.reduce((sum, h) => sum + calculateMyAmount(h), 0);

  return (
    <div className="min-h-full bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-3">
      <Card className="shadow-xl border-2 border-orange-200">
        <CardHeader className="bg-gradient-to-r from-orange-100 to-amber-100 py-3">
          <CardTitle className="text-xl font-bold text-orange-900">নাস্তার বিবরণ</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 px-2">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-600 border-t-transparent"></div>
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
                  history.map((entry) => (
                    <div key={entry.id} className="bg-white border-2 border-orange-200 rounded-lg p-3 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-orange-900">{entry.date || '-'}</div>
                          <div className="text-sm text-gray-600 mt-1 break-words">
                            {entry.note || '-'}
                          </div>
                        </div>
                        <div className="text-right ml-2 flex-shrink-0">
                          <div className="text-lg font-bold text-orange-700">
                            ৳{calculateMyAmount(entry).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              {/* Total Summary */}
              {history.length > 0 && (
                <div className="mt-4 bg-orange-200 rounded-lg p-4 border-2 border-orange-300">
                  <div className="flex justify-between items-center">
                    <div className="text-base font-bold text-orange-900">সর্বমোট</div>
                    <div className="text-2xl font-bold text-orange-900">
                      ৳{totalAmount.toFixed(2)}
                    </div>
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
