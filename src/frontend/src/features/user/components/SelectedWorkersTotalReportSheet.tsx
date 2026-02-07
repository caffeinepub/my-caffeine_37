import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { X } from 'lucide-react';
import { loadSelectedWorkers } from '../../../lib/storage/adminSelectedWorkersStorage';
import { safeGetItem } from '../../../lib/storage/safeStorage';

interface SelectedWorkersTotalReportSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SelectedWorkersTotalReportSheet({ isOpen, onClose }: SelectedWorkersTotalReportSheetProps) {
  const [selectedWorkers, setSelectedWorkers] = useState<string[]>([]);
  const [totalWork, setTotalWork] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [totalDue, setTotalDue] = useState(0);

  useEffect(() => {
    if (isOpen) {
      loadReportData();
    }
  }, [isOpen]);

  const loadReportData = () => {
    const selected = loadSelectedWorkers();
    setSelectedWorkers(selected);

    if (selected.length === 0) {
      setTotalWork(0);
      setTotalCost(0);
      setTotalDue(0);
      return;
    }

    const accounts = safeGetItem<Record<string, { bill: number; cost: number }>>('accounts', {}) || {};
    
    let work = 0;
    let cost = 0;

    selected.forEach((workerName) => {
      const account = accounts[workerName];
      if (account) {
        work += account.bill || 0;
        cost += account.cost || 0;
      }
    });

    setTotalWork(work);
    setTotalCost(cost);
    setTotalDue(work - cost);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 animate-in fade-in">
      <div className="w-full max-w-2xl bg-white rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-purple-600">
          <h2 className="text-xl font-bold text-white">নির্বাচিত কর্মীদের মোট রিপোর্ট</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {selectedWorkers.length === 0 ? (
            <Card className="border-amber-200">
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground py-8">
                  কোনো কর্মী নির্বাচন করা হয়নি। অ্যাডমিন প্যানেল থেকে কর্মী নির্বাচন করুন।
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Selected Workers List */}
              <Card className="border-blue-200">
                <CardHeader className="bg-blue-50">
                  <CardTitle className="text-base">নির্বাচিত কর্মী ({selectedWorkers.length})</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex flex-wrap gap-2">
                    {selectedWorkers.map((worker) => (
                      <span
                        key={worker}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                      >
                        {worker}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Totals Summary */}
              <Card className="border-emerald-200">
                <CardHeader className="bg-emerald-50">
                  <CardTitle className="text-base">মোট হিসাব</CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex justify-between items-center p-3 bg-cyan-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">মোট কাজ (বিল)</span>
                    <span className="text-lg font-bold text-cyan-700">৳{totalWork.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-rose-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">মোট খরচ</span>
                    <span className="text-lg font-bold text-rose-700">৳{totalCost.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg border-2 border-emerald-300">
                    <span className="text-base font-bold text-gray-800">মোট বাকি</span>
                    <span className="text-xl font-bold text-emerald-700">৳{totalDue.toFixed(0)}</span>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-4 border-t bg-gray-50">
          <Button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold"
          >
            বন্ধ করুন
          </Button>
        </div>
      </div>
    </div>
  );
}
