import { safeGetItem, safeSetItem } from './safeStorage';
import { notify } from '../../components/feedback/notify';

interface BackupData {
  version: string;
  timestamp: number;
  data: {
    approved_users?: any;
    pending_reqs?: any;
    workers?: any;
    rates?: any;
    accounts?: any;
    histories?: any;
    branding?: any;
    dashboard_overrides?: any;
    label_settings?: any;
    admin_totals?: any;
    layout_rules?: any;
    notice_config?: any;
  };
}

const BACKUP_VERSION = '1.0';

const BACKUP_KEYS = [
  'approved_users',
  'pending_reqs',
  'workers',
  'rates',
  'accounts',
  'histories',
  'branding',
  'dashboard_overrides',
  'label_settings',
  'admin_totals',
  'layout_rules',
  'notice_config',
];

/**
 * Export current app data to a JSON backup file
 */
export function exportBackup(): void {
  try {
    const backupData: BackupData = {
      version: BACKUP_VERSION,
      timestamp: Date.now(),
      data: {},
    };

    // Collect all whitelisted keys
    BACKUP_KEYS.forEach((key) => {
      const value = safeGetItem(key, null);
      if (value !== null) {
        backupData.data[key as keyof typeof backupData.data] = value;
      }
    });

    // Create downloadable JSON file
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `smart-hisab-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    notify.success('ব্যাকআপ সফলভাবে ডাউনলোড হয়েছে');
  } catch (error) {
    console.error('Backup export error:', error);
    notify.error('ব্যাকআপ এক্সপোর্ট ব্যর্থ হয়েছে');
  }
}

/**
 * Import and restore app data from a JSON backup file
 */
export function importBackup(file: File): Promise<void> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const backupData: BackupData = JSON.parse(content);

        // Validate backup structure
        if (!backupData.version || !backupData.data) {
          throw new Error('Invalid backup file structure');
        }

        // Restore all data keys
        Object.entries(backupData.data).forEach(([key, value]) => {
          if (BACKUP_KEYS.includes(key)) {
            safeSetItem(key, value);
          }
        });

        notify.success('ব্যাকআপ সফলভাবে রিস্টোর হয়েছে');
        resolve();
      } catch (error) {
        console.error('Backup import error:', error);
        notify.error('ব্যাকআপ ইমপোর্ট ব্যর্থ হয়েছে - ফাইল সঠিক নয়');
        reject(error);
      }
    };

    reader.onerror = () => {
      notify.error('ফাইল পড়তে ব্যর্থ হয়েছে');
      reject(new Error('File read error'));
    };

    reader.readAsText(file);
  });
}
