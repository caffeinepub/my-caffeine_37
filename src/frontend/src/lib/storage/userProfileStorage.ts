const PROFILE_PHOTO_PREFIX = 'profile_photo_';

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
