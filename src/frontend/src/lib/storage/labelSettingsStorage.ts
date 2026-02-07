/**
 * localStorage utilities for label entries with serial/order and optional override text
 * Supports reorderable label management including the three admin totals
 */

const LABEL_SETTINGS_KEY = 'label_settings';

export interface LabelEntry {
  key: string;
  defaultLabel: string;
  overrideLabel?: string;
  serial: number;
}

const DEFAULT_LABELS: LabelEntry[] = [
  { key: 'totalTaken', defaultLabel: 'মোট নেওয়া', serial: 1 },
  { key: 'totalWork', defaultLabel: 'মোট কাজ', serial: 2 },
  { key: 'totalDue', defaultLabel: 'আমার কাছে পাওনা', serial: 3 },
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
