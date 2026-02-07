/**
 * localStorage utilities for Admin dashboard layout rules
 * Manages section placement/order, per-row count, and size variants
 */

const LAYOUT_RULES_KEY = 'admin_dashboard_layout_rules';

export interface SectionLayoutRule {
  sectionKey: string;
  label: string;
  serial: number;
  perRow: number; // how many tiles per row for this section
  size: 'small' | 'large';
  icon?: string;
  gradient?: string;
}

export function loadLayoutRules(): SectionLayoutRule[] {
  try {
    const stored = localStorage.getItem(LAYOUT_RULES_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as SectionLayoutRule[];
    return parsed.sort((a, b) => a.serial - b.serial);
  } catch (error) {
    console.error('Error loading layout rules:', error);
    return [];
  }
}

export function saveLayoutRules(rules: SectionLayoutRule[]): void {
  try {
    localStorage.setItem(LAYOUT_RULES_KEY, JSON.stringify(rules));
    window.dispatchEvent(new CustomEvent('layout-rules-updated', { detail: rules }));
  } catch (error) {
    console.error('Error saving layout rules:', error);
  }
}

export function upsertLayoutRule(rule: SectionLayoutRule): void {
  const current = loadLayoutRules();
  const idx = current.findIndex(r => r.sectionKey === rule.sectionKey);
  if (idx >= 0) {
    current[idx] = rule;
  } else {
    current.push(rule);
  }
  saveLayoutRules(current);
}

export function deleteLayoutRule(sectionKey: string): void {
  const current = loadLayoutRules();
  const filtered = current.filter(r => r.sectionKey !== sectionKey);
  saveLayoutRules(filtered);
}
