const ADMIN_TOTALS_KEY = 'admin_totals';

export interface AdminTotals {
  totalTaken: number;
  totalWork: number;
  totalDue: number;
}

export function loadAdminTotals(): AdminTotals {
  try {
    const stored = localStorage.getItem(ADMIN_TOTALS_KEY);
    if (!stored) {
      return { totalTaken: 0, totalWork: 0, totalDue: 0 };
    }
    return JSON.parse(stored) as AdminTotals;
  } catch (error) {
    console.error('Error loading admin totals:', error);
    return { totalTaken: 0, totalWork: 0, totalDue: 0 };
  }
}

export function saveAdminTotals(totals: AdminTotals): void {
  try {
    localStorage.setItem(ADMIN_TOTALS_KEY, JSON.stringify(totals));
  } catch (error) {
    console.error('Error saving admin totals:', error);
  }
}
