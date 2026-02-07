import { safeGetItem, safeSetItem, safeRemoveItem } from './safeStorage';

const MT_LOAN_IDENTITY_KEY = 'mt_loan_identity';

export interface MtLoanIdentity {
  name: string;
  createdAt: number;
}

export function createMtLoanIdentity(name: string): void {
  const identity: MtLoanIdentity = {
    name,
    createdAt: Date.now(),
  };
  safeSetItem(MT_LOAN_IDENTITY_KEY, identity);
}

export function getMtLoanIdentity(): MtLoanIdentity | null {
  return safeGetItem<MtLoanIdentity | null>(MT_LOAN_IDENTITY_KEY, null);
}

export function clearMtLoanIdentity(): void {
  safeRemoveItem(MT_LOAN_IDENTITY_KEY);
}
