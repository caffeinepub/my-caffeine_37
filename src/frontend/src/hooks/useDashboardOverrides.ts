import { useState, useEffect } from 'react';
import { loadDashboardOverrides, DashboardOverrides } from '../lib/storage/dashboardOverridesStorage';

export function useDashboardOverrides() {
  const [overrides, setOverrides] = useState<DashboardOverrides>(() => loadDashboardOverrides());

  useEffect(() => {
    const handleUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<DashboardOverrides>;
      setOverrides(customEvent.detail || {});
    };

    window.addEventListener('dashboard-overrides-updated', handleUpdate);
    return () => window.removeEventListener('dashboard-overrides-updated', handleUpdate);
  }, []);

  const getLabel = (key: keyof DashboardOverrides, fallback?: string): string | undefined => {
    return overrides[key] || fallback;
  };

  return { overrides, getLabel };
}
