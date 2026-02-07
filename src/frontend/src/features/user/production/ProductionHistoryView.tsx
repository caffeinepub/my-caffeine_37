import { useState, useEffect } from 'react';
import { useSession } from '../../../state/session/useSession';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { safeGetItem } from '../../../lib/storage/safeStorage';
import { formatWorkerNames } from './workerNameFormat';

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
    <div className="min-h-full bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 p-3">
      <Card className="shadow-xl border-2 border-emerald-200">
        <CardHeader className="bg-gradient-to-r from-emerald-100 to-teal-100 py-3">
          <CardTitle className="text-xl font-bold text-emerald-900">প্রোডাকশন</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 px-2">
          <div className="space-y-2">
            {history.length === 0 ? (
              <div className="text-center text-muted-foreground py-12 text-base">
                কোনো রেকর্ড নেই
              </div>
            ) : (
              history.map((entry) => (
                <div key={entry.id} className="bg-white border-2 border-emerald-200 rounded-lg p-3 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-emerald-900">{entry.date || '-'}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        {formatWorkerNames(entry).join(', ')}
                      </div>
                    </div>
                    <div className="text-right ml-2 flex-shrink-0">
                      <div className="text-base font-bold text-emerald-700">
                        {entry.totalBody} বডি
                      </div>
                      <div className="text-lg font-bold text-emerald-700">
                        ৳{entry.totalTk.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Total Summary */}
          {history.length > 0 && (
            <div className="mt-4 bg-emerald-200 rounded-lg p-4 border-2 border-emerald-300">
              <div className="flex justify-between items-center mb-2">
                <div className="text-base font-bold text-emerald-900">মোট বডি</div>
                <div className="text-xl font-bold text-emerald-900">{totalBody}</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-base font-bold text-emerald-900">সর্বমোট টাকা</div>
                <div className="text-2xl font-bold text-emerald-900">৳{totalTk.toFixed(2)}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
