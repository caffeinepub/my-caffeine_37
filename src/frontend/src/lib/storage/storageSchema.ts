const STORAGE_VERSION_KEY = 'smart_hisab_storage_version';
const CURRENT_VERSION = '2.0';

const LEGACY_KEYS = [
  'smart_hisab_session',
  'approved_users',
  'pending_reqs',
  'workers',
  'rates',
  'accounts',
  'histories',
];

/**
 * Performs a one-time localStorage reset to clear old data structure
 * and establish a new consistent schema.
 */
export function ensureStorageSchema(): void {
  try {
    const currentVersion = localStorage.getItem(STORAGE_VERSION_KEY);
    
    if (currentVersion === CURRENT_VERSION) {
      // Already migrated, nothing to do
      return;
    }

    // Clear all legacy keys
    LEGACY_KEYS.forEach((key) => {
      localStorage.removeItem(key);
    });

    // Mark as migrated
    localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_VERSION);
    
    console.log('Storage schema reset completed successfully');
  } catch (error) {
    console.error('Error during storage schema reset:', error);
  }
}
