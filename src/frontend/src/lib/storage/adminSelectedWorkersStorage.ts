import { safeGetArray, safeSetItem } from './safeStorage';

const SELECTED_WORKERS_KEY = 'adminSelectedWorkers';

/**
 * Load the list of admin-selected workers for user panel report.
 */
export function loadSelectedWorkers(): string[] {
  return safeGetArray<string>(SELECTED_WORKERS_KEY);
}

/**
 * Save the list of admin-selected workers.
 */
export function saveSelectedWorkers(workers: string[]): void {
  safeSetItem(SELECTED_WORKERS_KEY, workers);
}

/**
 * Toggle a worker's selection status.
 */
export function toggleWorkerSelection(workerName: string): void {
  const selected = loadSelectedWorkers();
  const index = selected.indexOf(workerName);
  
  if (index >= 0) {
    selected.splice(index, 1);
  } else {
    selected.push(workerName);
  }
  
  saveSelectedWorkers(selected);
}

/**
 * Remove deleted workers from the selected list.
 */
export function removeDeletedWorker(workerName: string): void {
  const selected = loadSelectedWorkers();
  const filtered = selected.filter((w) => w !== workerName);
  saveSelectedWorkers(filtered);
}

/**
 * Check if a worker is selected.
 */
export function isWorkerSelected(workerName: string): boolean {
  const selected = loadSelectedWorkers();
  return selected.includes(workerName);
}

/**
 * Initialize selected workers key if missing.
 */
export function initializeSelectedWorkers(): void {
  const existing = safeGetArray<string>(SELECTED_WORKERS_KEY);
  if (existing.length === 0) {
    safeSetItem(SELECTED_WORKERS_KEY, []);
  }
}
