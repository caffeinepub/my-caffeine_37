import { useState, useEffect } from 'react';
import { useSession } from '../../../state/session/useSession';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { safeGetItem } from '../../../lib/storage/safeStorage';
import { computeUserAmount } from '../../work/workAmount';

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
    if (!session?.userName) return 0;
    return computeUserAmount(entry, session.userName);
  };

  const totalTk = history.reduce((sum, h) => sum + calculateMyAmount(h), 0);

  return (
    <div className="min-h-full bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 p-3">
      <Card className="shadow-xl border-2 border-pink-200">
        <CardHeader className="bg-gradient-to-r from-pink-100 to-rose-100 py-3">
          <CardTitle className="text-xl font-bold text-pink-900">কাজের বিবরণ</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 px-2">
          <div className="space-y-2">
            {history.map((entry) => (
              <div key={entry.id} className="bg-white border-2 border-pink-200 rounded-lg p-3 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-pink-900">{entry.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-pink-700">৳{calculateMyAmount(entry).toFixed(2)}</div>
                  </div>
                </div>
                <div className="flex gap-4 text-sm">
                  <span className="text-gray-700">সিঙ্গেল: <span className="font-semibold">{entry.s}</span></span>
                  <span className="text-gray-700">ডাবল: <span className="font-semibold">{entry.d}</span></span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Total Summary */}
          <div className="mt-4 bg-pink-200 rounded-lg p-4 border-2 border-pink-300">
            <div className="flex justify-between items-center">
              <div className="text-base font-bold text-pink-900">সর্বমোট</div>
              <div className="text-2xl font-bold text-pink-900">৳{totalTk.toFixed(2)}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
