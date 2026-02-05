import { safeGetItem } from '../../lib/storage/safeStorage';

interface WorkEntry {
  names: string[];
  s: number;
  d: number;
  details?: { name: string; bill: number }[];
}

/**
 * Compute the amount for a specific user in a work entry.
 * Uses details when present, otherwise computes from localStorage rates.
 */
export function computeUserAmount(entry: WorkEntry, userName: string): number {
  // If details exist, use them
  if (entry.details && entry.details.length > 0) {
    const userDetail = entry.details.find((d) => d.name === userName);
    return userDetail ? userDetail.bill : 0;
  }

  // Legacy fallback: compute from localStorage rates
  const rates = safeGetItem<Record<string, { s: number; d: number }>>('rates', {}) || {};
  const userRate = rates[userName];
  
  if (!userRate) return 0;
  
  return entry.s * userRate.s + entry.d * userRate.d;
}

/**
 * Compute the group total amount for a work entry.
 * Uses sum of details when present, otherwise computes from localStorage rates for all selected workers.
 */
export function computeGroupTotal(entry: WorkEntry): number {
  // If details exist, sum them
  if (entry.details && entry.details.length > 0) {
    return entry.details.reduce((sum, d) => sum + d.bill, 0);
  }

  // Legacy fallback: compute from localStorage rates for all workers in the entry
  const rates = safeGetItem<Record<string, { s: number; d: number }>>('rates', {}) || {};
  let total = 0;

  entry.names.forEach((name) => {
    const userRate = rates[name];
    if (userRate) {
      total += entry.s * userRate.s + entry.d * userRate.d;
    }
  });

  return total;
}
