/**
 * localStorage utilities for label entries with serial/order and optional override text
 * Supports reorderable label management including the three admin totals and all section labels
 */

const LABEL_SETTINGS_KEY = 'label_settings';

export interface LabelEntry {
  key: string;
  defaultLabel: string;
  overrideLabel?: string;
  serial: number;
}

const DEFAULT_LABELS: LabelEntry[] = [
  // Admin totals
  { key: 'totalTaken', defaultLabel: 'মোট নেওয়া', serial: 1 },
  { key: 'totalWork', defaultLabel: 'মোট কাজ', serial: 2 },
  { key: 'totalDue', defaultLabel: 'আমার কাছে পাওনা', serial: 3 },
  
  // Section labels
  { key: 'productionSection', defaultLabel: 'প্রোডাকশন ম্যানেজমেন্ট', serial: 4 },
  { key: 'workSection', defaultLabel: 'কাজের ম্যানেজমেন্ট', serial: 5 },
  { key: 'nastaSection', defaultLabel: 'নাস্তা ম্যানেজমেন্ট', serial: 6 },
  { key: 'paymentSection', defaultLabel: 'পেমেন্ট ও লোন ম্যানেজমেন্ট', serial: 7 },
  { key: 'userRequestsSection', defaultLabel: 'ইউজার রিকুয়েস্ট', serial: 8 },
  { key: 'settingsSection', defaultLabel: 'সিস্টেম সেটিংস', serial: 9 },
  { key: 'workerRateSection', defaultLabel: 'কর্মী ও রেট সেটিংস', serial: 10 },
  { key: 'finalBalanceSection', defaultLabel: 'চূড়ান্ত ব্যালেন্স', serial: 11 },
  { key: 'companyReportSection', defaultLabel: 'কোম্পানি রিপোর্ট', serial: 12 },
  
  // Grid menu labels
  { key: 'productionTile', defaultLabel: 'প্রোডাকশন', serial: 13 },
  { key: 'workTile', defaultLabel: 'কাজ', serial: 14 },
  { key: 'companyReportTile', defaultLabel: 'কোম্পানি রিপোর্ট', serial: 15 },
  { key: 'nastaTile', defaultLabel: 'নাস্তা', serial: 16 },
  { key: 'paymentTile', defaultLabel: 'পেমেন্ট/লোন', serial: 17 },
  { key: 'finalBalanceTile', defaultLabel: 'চূড়ান্ত ব্যালেন্স', serial: 18 },
  { key: 'userRequestsTile', defaultLabel: 'ইউজার রিকুয়েস্ট', serial: 19 },
  { key: 'settingsTile', defaultLabel: 'সেটিংস', serial: 20 },
  { key: 'workerRateTile', defaultLabel: 'রেট', serial: 21 },
  
  // User-related labels
  { key: 'userCurrent', defaultLabel: 'ইউজার কারেন্ট', serial: 22 },
];

export function loadLabelSettings(): LabelEntry[] {
  try {
    const stored = localStorage.getItem(LABEL_SETTINGS_KEY);
    if (!stored) {
      return DEFAULT_LABELS;
    }
    const parsed = JSON.parse(stored) as LabelEntry[];
    // Merge with defaults to ensure all default labels exist
    const merged = [...DEFAULT_LABELS];
    parsed.forEach(entry => {
      const idx = merged.findIndex(m => m.key === entry.key);
      if (idx >= 0) {
        merged[idx] = entry;
      } else {
        merged.push(entry);
      }
    });
    return merged.sort((a, b) => a.serial - b.serial);
  } catch (error) {
    console.error('Error loading label settings:', error);
    return DEFAULT_LABELS;
  }
}

export function saveLabelSettings(labels: LabelEntry[]): void {
  try {
    localStorage.setItem(LABEL_SETTINGS_KEY, JSON.stringify(labels));
    window.dispatchEvent(new CustomEvent('label-settings-updated', { detail: labels }));
  } catch (error) {
    console.error('Error saving label settings:', error);
  }
}

export function upsertLabelEntry(entry: LabelEntry): void {
  const current = loadLabelSettings();
  const idx = current.findIndex(e => e.key === entry.key);
  if (idx >= 0) {
    current[idx] = entry;
  } else {
    current.push(entry);
  }
  saveLabelSettings(current);
}

export function getLabelText(key: string): string {
  const labels = loadLabelSettings();
  const entry = labels.find(e => e.key === key);
  if (!entry) return key;
  return entry.overrideLabel || entry.defaultLabel;
}
