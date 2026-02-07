import { safeGetItem } from '../../lib/storage/safeStorage';
import { loadWorkerRates } from '../../lib/storage/workerRatesStorage';

interface WorkEntry {
  names: string[];
  s: number;
  d: number;
  details?: { name: string; bill: number }[];
  perWorkerAmounts?: Record<string, number>;
}

/**
 * Compute the amount for a specific user in a work entry.
 * Uses perWorkerAmounts when present, otherwise computes from rates.
 */
export function computeUserAmount(entry: WorkEntry, userName: string): number {
  // If perWorkerAmounts exist, use them (new format)
  if (entry.perWorkerAmounts && entry.perWorkerAmounts[userName] !== undefined) {
    return entry.perWorkerAmounts[userName];
  }

  // If details exist, use them (legacy format)
  if (entry.details) {
    const detail = entry.details.find((d) => d.name === userName);
    return detail?.bill || 0;
  }

  // Fallback: compute from rates
  const rates = loadWorkerRates();
  const rate = rates.find((r) => r.name === userName);
  
  if (!rate) {
    // Try legacy rates as last resort
    const legacyRates = safeGetItem<Record<string, { s: number; d: number }>>('rates', {}) || {};
    const legacyRate = legacyRates[userName];
    if (legacyRate) {
      return entry.d * legacyRate.d + entry.s * legacyRate.s;
    }
    return 0;
  }

  return entry.d * rate.rateDouble + entry.s * rate.rateSingle;
}

/**
 * Compute the total amount for all workers in a work entry.
 */
export function computeGroupTotal(entry: WorkEntry): number {
  // If perWorkerAmounts exist, sum them
  if (entry.perWorkerAmounts) {
    return Object.values(entry.perWorkerAmounts).reduce((sum, amount) => sum + amount, 0);
  }

  // If details exist, sum them
  if (entry.details) {
    return entry.details.reduce((sum, d) => sum + d.bill, 0);
  }

  // Fallback: compute from rates for all workers
  const rates = loadWorkerRates();
  let total = 0;

  entry.names.forEach((name) => {
    const rate = rates.find((r) => r.name === name);
    if (rate) {
      total += entry.d * rate.rateDouble + entry.s * rate.rateSingle;
    } else {
      // Try legacy rates
      const legacyRates = safeGetItem<Record<string, { s: number; d: number }>>('rates', {}) || {};
      const legacyRate = legacyRates[name];
      if (legacyRate) {
        total += entry.d * legacyRate.d + entry.s * legacyRate.s;
      }
    }
  });

  return total;
}
