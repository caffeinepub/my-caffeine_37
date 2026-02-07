import { safeGetArray, safeSetItem } from './safeStorage';

/**
 * Normalized production entry shape for UI rendering
 * Handles both admin-created and legacy user entries
 */
export interface NormalizedProductionEntry {
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

/**
 * Load and normalize production history entries
 * Ensures all entries have consistent shape for UI rendering
 */
export function loadNormalizedProductionHistory(): NormalizedProductionEntry[] {
  const raw = safeGetArray<any>('productionHistory');
  
  return raw.map((entry) => {
    // Normalize worker names (support legacy keys)
    let names: string[] = [];
    if (Array.isArray(entry.names)) {
      names = entry.names;
    } else if (Array.isArray(entry.workerNames)) {
      names = entry.workerNames;
    } else if (typeof entry.name === 'string') {
      names = [entry.name];
    } else {
      names = ['Unknown worker'];
    }

    // Normalize quantities
    const quantityDouble = Number(entry.quantityDouble || 0);
    const quantitySingle = Number(entry.quantitySingle || 0);
    const rateDouble = Number(entry.rateDouble || 0);
    const rateSingle = Number(entry.rateSingle || 0);

    // Compute total if missing
    let total = Number(entry.total || entry.totalAmount || 0);
    if (total === 0 && (quantityDouble > 0 || quantitySingle > 0)) {
      total = quantityDouble * rateDouble + quantitySingle * rateSingle;
    }

    return {
      id: entry.id?.toString() || Date.now().toString(),
      date: entry.date || new Date().toISOString().split('T')[0],
      names,
      quantityDouble,
      quantitySingle,
      rateDouble,
      rateSingle,
      total,
      timestamp: entry.timestamp || Date.now(),
    };
  });
}

/**
 * Save production history (no normalization, just persistence)
 */
export function saveProductionHistory(entries: NormalizedProductionEntry[]): void {
  safeSetItem('productionHistory', entries);
}
