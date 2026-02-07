const MT_LOAN_AUTH_KEY = 'mt_loan_authorized';

export function setMtLoanAuthorized(): void {
  try {
    sessionStorage.setItem(MT_LOAN_AUTH_KEY, 'true');
  } catch (error) {
    console.error('Error setting MT Loan authorization:', error);
  }
}

export function isMtLoanAuthorized(): boolean {
  try {
    return sessionStorage.getItem(MT_LOAN_AUTH_KEY) === 'true';
  } catch (error) {
    console.error('Error checking MT Loan authorization:', error);
    return false;
  }
}

export function clearMtLoanAuthorization(): void {
  try {
    sessionStorage.removeItem(MT_LOAN_AUTH_KEY);
  } catch (error) {
    console.error('Error clearing MT Loan authorization:', error);
  }
}
