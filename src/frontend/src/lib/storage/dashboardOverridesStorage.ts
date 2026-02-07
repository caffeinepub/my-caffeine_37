/**
 * localStorage utilities for dashboard label/value overrides
 * Allows admin to customize section text/name/value across dashboards
 */

const OVERRIDES_KEY = 'dashboard_overrides';

export interface DashboardOverrides {
  // KPI card titles
  kpiDueTitle?: string;
  kpiWorkTitle?: string;
  kpiTakenTitle?: string;
  
  // Admin grid menu labels
  productionLabel?: string;
  workLabel?: string;
  rateLabel?: string;
  paymentLabel?: string;
  nastaLabel?: string;
  balanceLabel?: string;
  requestLabel?: string;
  settingsLabel?: string;
  reportLabel?: string;
  
  // User action tile labels
  userProductionLabel?: string;
  userWorkLabel?: string;
  userPaymentLabel?: string;
  userNastaLabel?: string;
  
  // User logout and dialog labels
  logoutButtonLabel?: string;
  logoutDialogTitle?: string;
  logoutDialogDescription?: string;
  logoutConfirmText?: string;
  logoutCancelText?: string;
  
  // Footer button labels
  supportButtonLabel?: string;
  settingsButtonLabel?: string;
  chatButtonLabel?: string;
}

export function loadDashboardOverrides(): DashboardOverrides {
  try {
    const stored = localStorage.getItem(OVERRIDES_KEY);
    if (!stored) return {};
    return JSON.parse(stored) as DashboardOverrides;
  } catch (error) {
    console.error('Error loading dashboard overrides:', error);
    return {};
  }
}

export function saveDashboardOverrides(overrides: DashboardOverrides): void {
  try {
    localStorage.setItem(OVERRIDES_KEY, JSON.stringify(overrides));
    // Dispatch event for live updates
    window.dispatchEvent(new CustomEvent('dashboard-overrides-updated', { detail: overrides }));
  } catch (error) {
    console.error('Error saving dashboard overrides:', error);
  }
}

export function resetDashboardOverrides(): void {
  try {
    localStorage.removeItem(OVERRIDES_KEY);
    window.dispatchEvent(new CustomEvent('dashboard-overrides-updated', { detail: {} }));
  } catch (error) {
    console.error('Error resetting dashboard overrides:', error);
  }
}
