import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { aggregateProductionByWorker, WorkerProductionSummary } from './productionAggregates';

interface ProductionHistoryViewProps {
  onBack: () => void;
}

export default function ProductionHistoryView({ onBack }: ProductionHistoryViewProps) {
  const [workerSummaries, setWorkerSummaries] = useState<WorkerProductionSummary[]>([]);

  useEffect(() => {
    loadProductionData();
  }, []);

  const loadProductionData = () => {
    const summaries = aggregateProductionByWorker();
    setWorkerSummaries(summaries);
  };

  const grandTotalDouble = workerSummaries.reduce((sum, w) => sum + w.totalDouble, 0);
  const grandTotalSingle = workerSummaries.reduce((sum, w) => sum + w.totalSingle, 0);
  const grandTotalEarnings = workerSummaries.reduce((sum, w) => sum + w.totalEarnings, 0);

  return (
    <div className="min-h-full bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 p-3">
      <Card className="shadow-xl border-2 border-emerald-200">
        <CardHeader className="bg-gradient-to-r from-emerald-100 to-teal-100 py-3">
          <CardTitle className="text-xl font-bold text-emerald-900">Production</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 px-2">
          <div className="space-y-2">
            {workerSummaries.length === 0 ? (
              <div className="text-center text-muted-foreground py-12 text-base">
                No records
              </div>
            ) : (
              workerSummaries.map((worker) => (
                <div key={worker.workerName} className="bg-white border-2 border-emerald-200 rounded-lg p-3 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="text-base font-bold text-emerald-900">{worker.workerName}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        Double: {worker.totalDouble} | Single: {worker.totalSingle}
                      </div>
                    </div>
                    <div className="text-right ml-2 flex-shrink-0">
                      <div className="text-lg font-bold text-emerald-700">
                        ৳{worker.totalEarnings.toFixed(0)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Grand Total Summary */}
          {workerSummaries.length > 0 && (
            <div className="mt-4 bg-emerald-200 rounded-lg p-4 border-2 border-emerald-300">
              <div className="flex justify-between items-center mb-2">
                <div className="text-base font-bold text-emerald-900">Total Double</div>
                <div className="text-xl font-bold text-emerald-900">{grandTotalDouble}</div>
              </div>
              <div className="flex justify-between items-center mb-2">
                <div className="text-base font-bold text-emerald-900">Total Single</div>
                <div className="text-xl font-bold text-emerald-900">{grandTotalSingle}</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-base font-bold text-emerald-900">Total Earnings</div>
                <div className="text-2xl font-bold text-emerald-900">৳{grandTotalEarnings.toFixed(0)}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
