import { loadNormalizedProductionHistory, NormalizedProductionEntry } from '../../../lib/storage/productionHistoryStorage';

export interface WorkerProductionSummary {
  workerName: string;
  totalDouble: number;
  totalSingle: number;
  totalEarnings: number;
}

export function aggregateProductionByWorker(): WorkerProductionSummary[] {
  const entries = loadNormalizedProductionHistory();
  const workerMap = new Map<string, WorkerProductionSummary>();

  entries.forEach((entry) => {
    entry.names.forEach((workerName) => {
      const existing = workerMap.get(workerName);
      if (existing) {
        existing.totalDouble += entry.quantityDouble || 0;
        existing.totalSingle += entry.quantitySingle || 0;
        existing.totalEarnings += entry.total || 0;
      } else {
        workerMap.set(workerName, {
          workerName,
          totalDouble: entry.quantityDouble || 0,
          totalSingle: entry.quantitySingle || 0,
          totalEarnings: entry.total || 0,
        });
      }
    });
  });

  return Array.from(workerMap.values());
}
