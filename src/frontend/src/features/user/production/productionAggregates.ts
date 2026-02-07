import { safeGetArray } from '../../../lib/storage/safeStorage';

interface ProductionEntry {
  id: string;
  date: string;
  names: string[];
  quantityDouble: number;
  quantitySingle: number;
  rateDouble: number;
  rateSingle: number;
  total: number;
  timestamp: number;
}

export interface WorkerProductionSummary {
  workerName: string;
  totalDouble: number;
  totalSingle: number;
  totalEarnings: number;
}

export function aggregateProductionByWorker(): WorkerProductionSummary[] {
  const entries = safeGetArray<ProductionEntry>('productionHistory');
  const workers = safeGetArray<string>('workers');

  const workerMap = new Map<string, WorkerProductionSummary>();

  // Initialize all workers with zero values
  workers.forEach((worker) => {
    workerMap.set(worker, {
      workerName: worker,
      totalDouble: 0,
      totalSingle: 0,
      totalEarnings: 0,
    });
  });

  // Aggregate production data
  entries.forEach((entry) => {
    entry.names.forEach((workerName) => {
      const existing = workerMap.get(workerName);
      if (existing) {
        existing.totalDouble += entry.quantityDouble || 0;
        existing.totalSingle += entry.quantitySingle || 0;
        existing.totalEarnings += entry.total || 0;
      } else {
        // Worker not in list but has production data
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
