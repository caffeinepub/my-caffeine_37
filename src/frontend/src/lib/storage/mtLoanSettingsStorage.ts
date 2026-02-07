import { safeGetItem, safeSetItem } from './safeStorage';

const MT_LOAN_SETTINGS_KEY = 'mt_loan_settings';

export interface MtLoanSettings {
  name: string;
  password: string;
}

const DEFAULT_SETTINGS: MtLoanSettings = {
  name: '',
  password: '',
};

export function loadMtLoanSettings(): MtLoanSettings {
  return safeGetItem(MT_LOAN_SETTINGS_KEY, DEFAULT_SETTINGS);
}

export function saveMtLoanSettings(settings: MtLoanSettings): void {
  safeSetItem(MT_LOAN_SETTINGS_KEY, settings);
}

export function validateMtLoanPassword(inputPassword: string): boolean {
  const settings = loadMtLoanSettings();
  return settings.password !== '' && settings.password === inputPassword;
}

export function getMtLoanName(): string {
  const settings = loadMtLoanSettings();
  return settings.name || 'MT Loan User';
}
