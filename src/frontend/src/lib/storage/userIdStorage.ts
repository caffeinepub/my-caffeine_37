/**
 * localStorage utilities for stable auto-generated user IDs
 * Each approved user gets a unique numeric ID (Id-1, Id-2, etc.)
 */

import { safeGetArray, safeSetItem } from './safeStorage';
import { ApprovedUser } from '../../state/session/sessionTypes';

const USER_ID_COUNTER_KEY = 'user_id_counter';

export interface ApprovedUserWithId extends ApprovedUser {
  userId: number;
}

/**
 * Ensures all approved users have stable user IDs
 * Returns the updated array with IDs assigned
 * Only assigns IDs to users that don't have one (legacy users)
 */
export function ensureUserIds(): ApprovedUserWithId[] {
  const approvedUsers = safeGetArray<ApprovedUser>('approved_users');
  let counter = parseInt(localStorage.getItem(USER_ID_COUNTER_KEY) || '0', 10);
  let needsUpdate = false;
  
  const usersWithIds: ApprovedUserWithId[] = approvedUsers.map((user) => {
    // Check if user already has an ID (from previous assignment or from pending request)
    const existingUser = user as ApprovedUserWithId;
    if (existingUser.userId && typeof existingUser.userId === 'number') {
      // Update counter to ensure it's at least as high as existing IDs
      if (existingUser.userId > counter) {
        counter = existingUser.userId;
      }
      return existingUser;
    }
    
    // Assign new ID only to legacy users without one
    counter++;
    needsUpdate = true;
    return { ...user, userId: counter };
  });
  
  // Save updated counter and users only if changes were made
  if (needsUpdate) {
    localStorage.setItem(USER_ID_COUNTER_KEY, counter.toString());
    safeSetItem('approved_users', usersWithIds);
  }
  
  return usersWithIds;
}

/**
 * Gets the user ID for a specific user by name or mobile
 */
export function getUserId(nameOrMobile: string): number | null {
  const users = ensureUserIds();
  const user = users.find((u) => u.name === nameOrMobile || u.mob === nameOrMobile);
  return user?.userId || null;
}
