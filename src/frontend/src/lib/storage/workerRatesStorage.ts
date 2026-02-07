import { safeGetItem, safeSetItem } from './safeStorage';

export interface WorkerRate {
  name: string;
  rateDouble: number;
  rateSingle: number;
  locked?: boolean; // New field for lock state
}

const WORKER_RATES_KEY = 'worker_rates';
const LEGACY_RATES_KEY = 'rates';

/**
 * Load worker rates from unified storage with backward compatibility
 */
export function loadWorkerRates(): WorkerRate[] {
  // Try new unified format first
  const unified = safeGetItem<WorkerRate[]>(WORKER_RATES_KEY, []);
  if (unified && Array.isArray(unified) && unified.length > 0) {
    // Ensure locked field exists (default false for legacy entries)
    return unified.map(w => ({ ...w, locked: w.locked ?? false }));
  }

  // Fallback to legacy format
  const legacy = safeGetItem<Record<string, { rateDouble: number; rateSingle: number }>>(LEGACY_RATES_KEY, {});
  if (!legacy || Object.keys(legacy).length === 0) {
    return [];
  }

  const migrated: WorkerRate[] = Object.entries(legacy).map(([name, rates]) => ({
    name,
    rateDouble: rates.rateDouble,
    rateSingle: rates.rateSingle,
    locked: false,
  }));

  // Save migrated data to new format
  if (migrated.length > 0) {
    saveWorkerRates(migrated);
  }

  return migrated;
}

/**
 * Save worker rates to unified storage and sync with legacy format
 */
export function saveWorkerRates(rates: WorkerRate[]): void {
  // Save to new unified format
  safeSetItem(WORKER_RATES_KEY, rates);

  // Sync to legacy format for backward compatibility
  const legacyMap: Record<string, { rateDouble: number; rateSingle: number }> = {};
  rates.forEach((rate) => {
    legacyMap[rate.name] = {
      rateDouble: rate.rateDouble,
      rateSingle: rate.rateSingle,
    };
  });
  safeSetItem(LEGACY_RATES_KEY, legacyMap);
}

/**
 * Get rate for a specific worker
 */
export function getWorkerRate(workerName: string): WorkerRate | null {
  const rates = loadWorkerRates();
  return rates.find((r) => r.name === workerName) || null;
}

/**
 * Toggle lock state for a worker
 */
export function toggleWorkerLock(workerName: string): void {
  const rates = loadWorkerRates();
  const updated = rates.map((r) =>
    r.name === workerName ? { ...r, locked: !r.locked } : r
  );
  saveWorkerRates(updated);
}

/**
 * Check if a worker is locked
 */
export function isWorkerLocked(workerName: string): boolean {
  const rate = getWorkerRate(workerName);
  return rate?.locked ?? false;
}

/**
 * Migrate legacy rates to unified format (called by storage migrations)
 */
export function migrateLegacyRates(): void {
  const unified = safeGetItem<WorkerRate[]>(WORKER_RATES_KEY, []);
  if (unified && Array.isArray(unified) && unified.length > 0) {
    // Already migrated
    return;
  }

  const legacy = safeGetItem<Record<string, { rateDouble: number; rateSingle: number }>>(LEGACY_RATES_KEY, {});
  if (!legacy || Object.keys(legacy).length === 0) {
    return;
  }

  const migrated: WorkerRate[] = Object.entries(legacy).map(([name, rates]) => ({
    name,
    rateDouble: rates.rateDouble,
    rateSingle: rates.rateSingle,
    locked: false,
  }));

  if (migrated.length > 0) {
    saveWorkerRates(migrated);
  }
}
