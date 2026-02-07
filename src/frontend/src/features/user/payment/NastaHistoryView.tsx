import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { safeGetItem } from '../../../lib/storage/safeStorage';
import { useSession } from '../../../state/session/useSession';
import { ArrowLeft } from 'lucide-react';
import { getPerHeadAmount } from '../../../utils/moneySplit';

interface NastaEntry {
  id: number;
  date: string;
  names: string[];
  amount: number;
  perHead?: number;
  note: string;
}

interface Histories {
  nasta?: NastaEntry[];
}

interface NastaHistoryViewProps {
  onBack: () => void;
}

export default function NastaHistoryView({ onBack }: NastaHistoryViewProps) {
  const { session } = useSession();
  const [entries, setEntries] = useState<NastaEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEntries();
  }, [session?.userName]);

  const loadEntries = () => {
    setIsLoading(true);
    try {
      const histories = safeGetItem<Histories>('histories', { nasta: [] });
      const nastaArray = Array.isArray(histories?.nasta) ? histories.nasta : [];
      
      // Filter entries for current user
      const userEntries = nastaArray.filter((entry) =>
        entry.names?.includes(session?.userName || '')
      );

      setEntries(userEntries.sort((a, b) => (b.id || 0) - (a.id || 0)));
    } catch (error) {
      console.error('Error loading nasta history:', error);
      setEntries([]);
    } finally {
      setIsLoading(false);
    }
  };

  const totalAmount = entries.reduce((sum, entry) => sum + getPerHeadAmount(entry), 0);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="back-button-colored -ml-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <CardTitle className="text-lg text-white section-title-accent">নাস্তা ইতিহাস</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoading ? (
            <p className="text-center text-muted-foreground py-8">লোড হচ্ছে...</p>
          ) : entries.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">কোনো এন্ট্রি নেই</p>
          ) : (
            <div className="space-y-4">
              {entries.map((entry) => (
                <Card key={entry.id} className="border-amber-200">
                  <CardContent className="pt-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1 flex-1">
                        <p className="text-sm text-muted-foreground">{entry.date}</p>
                        <p className="text-lg font-bold text-amber-700">
                          ৳{getPerHeadAmount(entry).toFixed(2)}
                        </p>
                        {entry.note && (
                          <p className="text-sm text-muted-foreground break-words">
                            {entry.note}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <div className="pt-4 border-t-2">
                <div className="flex justify-between items-center">
                  <span className="text-base font-bold">মোট:</span>
                  <span className="text-xl font-bold text-amber-700">
                    ৳{totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
