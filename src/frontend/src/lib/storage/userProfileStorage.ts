const PROFILE_PHOTO_PREFIX = 'profile_photo_';
const ADMIN_PROFILE_PHOTO_KEY = 'admin_profile_photo';

export function getProfilePhoto(userName: string): string | null {
  try {
    return localStorage.getItem(`${PROFILE_PHOTO_PREFIX}${userName}`);
  } catch (error) {
    console.error('Error getting profile photo:', error);
    return null;
  }
}

export function setProfilePhoto(userName: string, dataUrl: string): void {
  try {
    localStorage.setItem(`${PROFILE_PHOTO_PREFIX}${userName}`, dataUrl);
  } catch (error) {
    console.error('Error setting profile photo:', error);
    throw new Error('ছবি সংরক্ষণ করতে সমস্যা হয়েছে');
  }
}

export function removeProfilePhoto(userName: string): void {
  try {
    localStorage.removeItem(`${PROFILE_PHOTO_PREFIX}${userName}`);
  } catch (error) {
    console.error('Error removing profile photo:', error);
  }
}

export function getAdminProfilePhoto(): string | null {
  try {
    return localStorage.getItem(ADMIN_PROFILE_PHOTO_KEY);
  } catch (error) {
    console.error('Error getting admin profile photo:', error);
    return null;
  }
}

export function setAdminProfilePhoto(dataUrl: string): void {
  try {
    localStorage.setItem(ADMIN_PROFILE_PHOTO_KEY, dataUrl);
  } catch (error) {
    console.error('Error setting admin profile photo:', error);
    throw new Error('ছবি সংরক্ষণ করতে সমস্যা হয়েছে');
  }
}
