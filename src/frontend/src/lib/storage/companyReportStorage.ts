const COMPANY_REPORT_KEY = 'company_reports';

export type ReportType = 'due' | 'taken';

export interface CompanyReportEntry {
  id: string;
  date: string;
  type: ReportType;
  amount: number;
  note: string;
  timestamp: number;
}

export function getCompanyReports(): CompanyReportEntry[] {
  try {
    const stored = localStorage.getItem(COMPANY_REPORT_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading company reports:', error);
  }
  return [];
}

export function addCompanyReport(entry: Omit<CompanyReportEntry, 'id' | 'timestamp'>): void {
  try {
    const reports = getCompanyReports();
    const newEntry: CompanyReportEntry = {
      ...entry,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };
    reports.push(newEntry);
    localStorage.setItem(COMPANY_REPORT_KEY, JSON.stringify(reports));
  } catch (error) {
    console.error('Error saving company report:', error);
  }
}

export function getReportsByType(type: ReportType): CompanyReportEntry[] {
  return getCompanyReports().filter((report) => report.type === type);
}

export function deleteCompanyReport(id: string): void {
  try {
    const reports = getCompanyReports().filter((report) => report.id !== id);
    localStorage.setItem(COMPANY_REPORT_KEY, JSON.stringify(reports));
  } catch (error) {
    console.error('Error deleting company report:', error);
  }
}
