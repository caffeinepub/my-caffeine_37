import { createContext, useState, useEffect, ReactNode } from 'react';
import { Session, SessionContextValue, LoginResult, ApprovedUser, UpdateProfileParams } from './sessionTypes';
import { safeGetItem, safeSetItem, safeRemoveItem, safeGetArray } from '../../lib/storage/safeStorage';
import { ensureStorageSchema } from '../../lib/storage/storageSchema';
import { ensureUserIds, getUserId } from '../../lib/storage/userIdStorage';

export const SessionContext = createContext<SessionContextValue | undefined>(undefined);

const SESSION_KEY = 'smart_hisab_session';
const ADMIN_USERNAME = 'Mamun220';
const ADMIN_PASSWORD = 'Mamun220';

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Perform one-time storage reset before restoring session
    ensureStorageSchema();
    
    // Ensure all approved users have IDs
    ensureUserIds();
    
    // Try to restore session from localStorage
    const savedSession = safeGetItem<Session>(SESSION_KEY);
    if (savedSession) {
      // If user session, ensure userId is populated
      if (savedSession.role === 'user' && savedSession.userName && !savedSession.userId) {
        const userId = getUserId(savedSession.userName);
        if (userId) {
          savedSession.userId = userId;
          safeSetItem(SESSION_KEY, savedSession);
        }
      }
      setSession(savedSession);
    }
    setIsInitializing(false);
  }, []);

  const login = async (usernameOrMobile: string, password: string): Promise<LoginResult> => {
    try {
      // Check admin credentials first
      if (usernameOrMobile === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        const adminSession: Session = { role: 'admin' };
        setSession(adminSession);
        safeSetItem(SESSION_KEY, adminSession);
        return { success: true };
      }

      // Ensure all users have IDs before login
      ensureUserIds();

      // Check worker/user credentials - use safeGetArray to handle both old and new formats
      const approvedUsers = safeGetArray<ApprovedUser>('approved_users');
      
      if (!Array.isArray(approvedUsers) || approvedUsers.length === 0) {
        return { 
          success: false, 
          error: 'কোনো অনুমোদিত ইউজার পাওয়া যায়নি। অ্যাডমিনের সাথে যোগাযোগ করুন।' 
        };
      }

      // Find user by mobile (primary) or name (secondary)
      const user = approvedUsers.find((u) => {
        if (!u || typeof u !== 'object') return false;
        return u.mob === usernameOrMobile || u.name === usernameOrMobile;
      });

      if (!user) {
        return { 
          success: false, 
          error: 'ইউজার খুঁজে পাওয়া যায়নি বা অনুমোদিত নয়। অ্যাডমিনের সাথে যোগাযোগ করুন।' 
        };
      }

      if (user.pass !== password) {
        return { 
          success: false, 
          error: 'ভুল পাসওয়ার্ড। আবার চেষ্টা করুন।' 
        };
      }

      // Get user ID
      const userId = getUserId(user.name) || 0;

      // Worker login successful - always include userName, mobile, and userId
      const userSession: Session = {
        role: 'user',
        userName: user.name,
        mobile: user.mob,
        userId,
      };
      setSession(userSession);
      safeSetItem(SESSION_KEY, userSession);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: 'লগইন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।' 
      };
    }
  };

  const updateUserProfile = async (params: UpdateProfileParams): Promise<LoginResult> => {
    try {
      if (!session || session.role !== 'user' || !session.userName) {
        return { success: false, error: 'সেশন পাওয়া যায়নি' };
      }

      const approvedUsers = safeGetArray<ApprovedUser>('approved_users');
      const userIndex = approvedUsers.findIndex((u) => u.name === session.userName);

      if (userIndex === -1) {
        return { success: false, error: 'ইউজার খুঁজে পাওয়া যায়নি' };
      }

      const currentUser = approvedUsers[userIndex];

      // Handle mobile change
      if (params.mobile) {
        // Check for duplicate mobile
        const duplicateMobile = approvedUsers.some(
          (u, idx) => idx !== userIndex && u.mob === params.mobile
        );
        if (duplicateMobile) {
          return { success: false, error: 'এই মোবাইল নাম্বার ইতিমধ্যে ব্যবহৃত হচ্ছে' };
        }

        // Update mobile
        approvedUsers[userIndex] = { ...currentUser, mob: params.mobile };
        safeSetItem('approved_users', approvedUsers);

        // Update session
        const updatedSession: Session = {
          ...session,
          mobile: params.mobile,
        };
        setSession(updatedSession);
        safeSetItem(SESSION_KEY, updatedSession);

        return { success: true };
      }

      // Handle password change
      if (params.currentPassword && params.newPassword) {
        // Verify current password
        if (currentUser.pass !== params.currentPassword) {
          return { success: false, error: 'বর্তমান পাসওয়ার্ড ভুল' };
        }

        // Update password
        approvedUsers[userIndex] = { ...currentUser, pass: params.newPassword };
        safeSetItem('approved_users', approvedUsers);

        return { success: true };
      }

      return { success: false, error: 'কোনো পরিবর্তন করা হয়নি' };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: 'প্রোফাইল আপডেট করতে সমস্যা হয়েছে' };
    }
  };

  const logout = () => {
    setSession(null);
    safeRemoveItem(SESSION_KEY);
  };

  return (
    <SessionContext.Provider value={{ session, isInitializing, login, logout, updateUserProfile }}>
      {children}
    </SessionContext.Provider>
  );
}
