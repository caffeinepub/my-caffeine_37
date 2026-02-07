import { safeGetItem, safeSetItem, safeGetArray } from './safeStorage';
import { migrateLegacyRates } from './workerRatesStorage';
import { initializeSelectedWorkers } from './adminSelectedWorkersStorage';

const CURRENT_VERSION = 5;
const VERSION_KEY = 'storageVersion';

interface HistoriesV3 {
  production?: any[];
  work?: any[];
  nasta?: any[];
  loan?: any[];
}

const EMPTY_HISTORIES: HistoriesV3 = {
  production: [],
  work: [],
  nasta: [],
  loan: [],
};

/**
 * Run non-destructive storage migrations.
 * Preserves existing data while normalizing structures.
 */
export function runStorageMigrations(): void {
  const currentVersion = safeGetItem<number>(VERSION_KEY, 0) || 0;

  if (currentVersion < 1) {
    migrateV0toV1();
  }

  if (currentVersion < 2) {
    migrateV1toV2();
  }

  if (currentVersion < 3) {
    migrateV2toV3();
  }

  if (currentVersion < 4) {
    migrateV3toV4();
  }

  if (currentVersion < 5) {
    migrateV4toV5();
  }

  safeSetItem(VERSION_KEY, CURRENT_VERSION);
}

/**
 * V0 → V1: Rename pendingRequests to pending_reqs
 */
function migrateV0toV1(): void {
  const oldKey = 'pendingRequests';
  const newKey = 'pending_reqs';

  try {
    const item = localStorage.getItem(oldKey);
    if (item !== null) {
      const existing = JSON.parse(item);
      safeSetItem(newKey, existing);
      localStorage.removeItem(oldKey);
    }
  } catch (error) {
    console.error('Error migrating V0 to V1:', error);
  }
}

/**
 * V1 → V2: Normalize histories structure
 */
function migrateV1toV2(): void {
  const historiesKey = 'histories';
  const existing = safeGetItem<HistoriesV3>(historiesKey, EMPTY_HISTORIES);

  if (existing && typeof existing === 'object') {
    const normalized: HistoriesV3 = {
      production: Array.isArray(existing.production) ? existing.production : [],
      work: Array.isArray(existing.work) ? existing.work : [],
      nasta: Array.isArray(existing.nasta) ? existing.nasta : [],
      loan: Array.isArray(existing.loan) ? existing.loan : [],
    };
    safeSetItem(historiesKey, normalized);
  }
}

/**
 * V2 → V3: Ensure histories arrays exist
 */
function migrateV2toV3(): void {
  const historiesKey = 'histories';
  const existing = safeGetItem<HistoriesV3>(historiesKey, EMPTY_HISTORIES);

  if (!existing || Object.keys(existing).length === 0) {
    safeSetItem(historiesKey, EMPTY_HISTORIES);
  }
}

/**
 * V3 → V4: Unify worker rates and initialize selected workers
 */
function migrateV3toV4(): void {
  // Migrate legacy rates to unified format
  migrateLegacyRates();

  // Initialize selected workers key if missing
  initializeSelectedWorkers();

  // Ensure workers list exists
  const workers = safeGetArray<string>('workers');
  if (workers.length === 0) {
    const rates = safeGetItem<Record<string, { s: number; d: number }>>('rates', {});
    if (rates && Object.keys(rates).length > 0) {
      safeSetItem('workers', Object.keys(rates));
    }
  }
}

/**
 * V4 → V5: Normalize company report entries (treat legacy 'taken' as payment)
 */
function migrateV4toV5(): void {
  try {
    const companyReports = safeGetItem<any[]>('company_reports', []);
    if (Array.isArray(companyReports) && companyReports.length > 0) {
      const normalized = companyReports
        .filter((e: any) => !e.type || e.type === 'taken' || e.type === 'payment')
        .map((e: any) => ({
          ...e,
          type: 'payment',
          amount: Number(e.amount || 0),
        }));
      safeSetItem('company_reports', normalized);
    }
  } catch (error) {
    console.error('Error migrating company reports:', error);
  }
}
