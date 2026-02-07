import { safeGetItem, safeSetItem } from './safeStorage';

export interface CustomSection {
  id: string;
  label: string;
  size: 'small' | 'medium' | 'large';
  placement: 'top' | 'middle' | 'bottom';
}

const STORAGE_KEY = 'customSections';

export function loadCustomSections(): CustomSection[] {
  return safeGetItem<CustomSection[]>(STORAGE_KEY, []) || [];
}

export function saveCustomSections(sections: CustomSection[]): void {
  safeSetItem(STORAGE_KEY, sections);
}
