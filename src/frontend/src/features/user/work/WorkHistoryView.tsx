import { useState, useEffect } from 'react';
import { useSession } from '../../../state/session/useSession';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { safeGetItem } from '../../../lib/storage/safeStorage';

interface WorkEntry {
  id: number;
  date: string;
  names: string[];
  name?: string;
  s: number;
  d: number;
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

    const histories = safeGetItem<{ work: WorkEntry[] }>('histories', { work: [] });
    if (histories) {
      const userHistory = histories.work.filter((h) => {
        if (Array.isArray(h.names)) {
          return h.names.includes(session.userName!);
        }
        return h.name === session.userName;
      });

      setHistory(userHistory);
    }
  };

  const totalS = history.reduce((sum, h) => sum + h.s, 0);
  const totalD = history.reduce((sum, h) => sum + h.d, 0);
  const totalTk = history.reduce((sum, h) => sum + h.totalTk, 0);

  return (
    <div className="min-h-full bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 p-3">
      <Card className="shadow-xl border-2 border-cyan-200">
        <CardHeader className="bg-gradient-to-r from-cyan-100 to-blue-100 py-3">
          <CardTitle className="text-xl font-bold text-cyan-900">কাজ</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 px-2">
          <div className="space-y-2">
            {history.length === 0 ? (
              <div className="text-center text-muted-foreground py-12 text-base">
                কোনো রেকর্ড নেই
              </div>
            ) : (
              history.map((entry) => (
                <div key={entry.id} className="bg-white border-2 border-cyan-200 rounded-lg p-3 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-cyan-900">{entry.date || '-'}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        সিঙ্গেল: {entry.s} | ডাবল: {entry.d}
                      </div>
                    </div>
                    <div className="text-right ml-2 flex-shrink-0">
                      <div className="text-lg font-bold text-cyan-700">৳{entry.totalTk.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Total Summary */}
          {history.length > 0 && (
            <div className="mt-4 bg-cyan-200 rounded-lg p-4 border-2 border-cyan-300">
              <div className="flex justify-between items-center mb-2">
                <div className="text-base font-bold text-cyan-900">মোট সিঙ্গেল</div>
                <div className="text-xl font-bold text-cyan-900">{totalS}</div>
              </div>
              <div className="flex justify-between items-center mb-2">
                <div className="text-base font-bold text-cyan-900">মোট ডাবল</div>
                <div className="text-xl font-bold text-cyan-900">{totalD}</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-base font-bold text-cyan-900">সর্বমোট টাকা</div>
                <div className="text-2xl font-bold text-cyan-900">৳{totalTk.toFixed(2)}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
