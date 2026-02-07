import { safeGetItem, safeSetItem } from './safeStorage';

export interface AdminCredentials {
  username: string;
  password: string;
}

const ADMIN_CREDENTIALS_KEY = 'admin_credentials';

const DEFAULT_CREDENTIALS: AdminCredentials = {
  username: 'Mamun220',
  password: 'Mamun220',
};

export function loadAdminCredentials(): AdminCredentials {
  const stored = safeGetItem<AdminCredentials>(ADMIN_CREDENTIALS_KEY, DEFAULT_CREDENTIALS);
  return stored;
}

export function saveAdminCredentials(credentials: AdminCredentials): void {
  if (!credentials.username || !credentials.password) {
    throw new Error('Username and password cannot be empty');
  }
  safeSetItem(ADMIN_CREDENTIALS_KEY, credentials);
}

export function validateAdminCredentials(username: string, password: string): boolean {
  const stored = loadAdminCredentials();
  return stored.username === username && stored.password === password;
}
