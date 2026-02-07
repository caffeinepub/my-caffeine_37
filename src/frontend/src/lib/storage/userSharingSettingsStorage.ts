import { safeGetItem, safeSetItem } from './safeStorage';

export interface UserSharingSettings {
  distributionMode: 'equal' | 'weighted' | 'manual';
  defaultSharePercentage: number;
  minUsers: number;
}

const STORAGE_KEY = 'userSharingSettings';

const DEFAULT_SETTINGS: UserSharingSettings = {
  distributionMode: 'equal',
  defaultSharePercentage: 100,
  minUsers: 1,
};

export function loadUserSharingSettings(): UserSharingSettings {
  return safeGetItem<UserSharingSettings>(STORAGE_KEY, DEFAULT_SETTINGS) || DEFAULT_SETTINGS;
}

export function saveUserSharingSettings(settings: UserSharingSettings): void {
  safeSetItem(STORAGE_KEY, settings);
  window.dispatchEvent(new CustomEvent('storage-update', { detail: { key: STORAGE_KEY } }));
}
