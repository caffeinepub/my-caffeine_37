const COMPANY_REPORT_KEY = 'company_reports';

export type ReportType = 'payment'; // Simplified to single type

export interface CompanyReportEntry {
  id: string;
  date: string;
  type: ReportType; // Keep for backward compatibility
  amount: number;
  note: string;
  timestamp: number;
}

/**
 * Get all company report entries with safe handling of legacy data
 */
export function getCompanyReports(): CompanyReportEntry[] {
  try {
    const stored = localStorage.getItem(COMPANY_REPORT_KEY);
    if (stored) {
      const entries = JSON.parse(stored);
      // Normalize legacy entries: treat 'taken' as payment, ignore 'due'
      return entries
        .filter((e: any) => !e.type || e.type === 'taken' || e.type === 'payment')
        .map((e: any) => ({
          ...e,
          type: 'payment' as ReportType,
          amount: Number(e.amount || 0),
        }));
    }
  } catch (error) {
    console.error('Error loading company reports:', error);
  }
  return [];
}

/**
 * Add a new payment entry
 */
export function addCompanyReport(entry: Omit<CompanyReportEntry, 'id' | 'timestamp' | 'type'>): void {
  try {
    const reports = getCompanyReports();
    const newEntry: CompanyReportEntry = {
      ...entry,
      type: 'payment',
      id: Date.now().toString(),
      timestamp: Date.now(),
    };
    reports.push(newEntry);
    localStorage.setItem(COMPANY_REPORT_KEY, JSON.stringify(reports));
  } catch (error) {
    console.error('Error saving company report:', error);
  }
}

/**
 * Delete a payment entry by ID
 */
export function deleteCompanyReport(id: string): void {
  try {
    const reports = getCompanyReports().filter((report) => report.id !== id);
    localStorage.setItem(COMPANY_REPORT_KEY, JSON.stringify(reports));
  } catch (error) {
    console.error('Error deleting company report:', error);
  }
}

/**
 * Calculate total work earned from production history
 */
export function getTotalWorkEarned(): number {
  try {
    const productionHistory = JSON.parse(localStorage.getItem('productionHistory') || '[]');
    return productionHistory.reduce((sum: number, entry: any) => {
      const total = Number(entry.total || entry.totalAmount || 0);
      return sum + total;
    }, 0);
  } catch (error) {
    console.error('Error calculating total work earned:', error);
    return 0;
  }
}
