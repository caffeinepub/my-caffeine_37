import { createContext, useState, useEffect, ReactNode } from 'react';
import { Session, SessionContextValue, LoginResult, UpdateProfileParams, ApprovedUser } from './sessionTypes';
import { safeGetArray, safeSetItem } from '../../lib/storage/safeStorage';
import { ensureUserIds } from '../../lib/storage/userIdStorage';
import { validateAdminCredentials } from '../../lib/storage/adminCredentialsStorage';
import { useQueryClient } from '@tanstack/react-query';

export const SessionContext = createContext<SessionContextValue | null>(null);

interface SessionProviderProps {
  children: ReactNode;
}

const SESSION_KEY = 'user_session';

export function SessionProvider({ children }: SessionProviderProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    // Restore session from localStorage
    const savedSession = localStorage.getItem(SESSION_KEY);
    if (savedSession) {
      try {
        const parsedSession = JSON.parse(savedSession) as Session;
        
        // If it's a user session, ensure user IDs are assigned and get the correct ID
        if (parsedSession.role === 'user' && parsedSession.userName) {
          const usersWithIds = ensureUserIds();
          const user = usersWithIds.find((u) => u.name === parsedSession.userName);
          if (user) {
            parsedSession.userId = user.userId;
          }
        }
        
        setSession(parsedSession);
      } catch (error) {
        console.error('Failed to restore session:', error);
        localStorage.removeItem(SESSION_KEY);
      }
    }
    setIsInitializing(false);
  }, []);

  const login = async (usernameOrMobile: string, password: string): Promise<LoginResult> => {
    // Admin login - check against stored credentials
    if (validateAdminCredentials(usernameOrMobile, password)) {
      const adminSession: Session = { role: 'admin' };
      setSession(adminSession);
      localStorage.setItem(SESSION_KEY, JSON.stringify(adminSession));
      return { success: true };
    }

    // User login - ensure all users have IDs first
    const usersWithIds = ensureUserIds();
    const user = usersWithIds.find(
      (u) => (u.name === usernameOrMobile || u.mob === usernameOrMobile) && u.pass === password
    );

    if (user) {
      const userSession: Session = {
        role: 'user',
        userName: user.name,
        mobile: user.mob,
        userId: user.userId
      };
      setSession(userSession);
      localStorage.setItem(SESSION_KEY, JSON.stringify(userSession));
      return { success: true };
    }

    return { success: false, error: 'Invalid credentials' };
  };

  const logout = () => {
    setSession(null);
    localStorage.removeItem(SESSION_KEY);
    // Clear all cached queries on logout
    queryClient.clear();
  };

  const updateUserProfile = async (params: UpdateProfileParams): Promise<LoginResult> => {
    if (!session || session.role !== 'user' || !session.userName) {
      return { success: false, error: 'Not logged in as user' };
    }

    try {
      const approvedUsers = safeGetArray<ApprovedUser>('approved_users');
      const userIndex = approvedUsers.findIndex((u) => u.name === session.userName);

      if (userIndex === -1) {
        return { success: false, error: 'User not found' };
      }

      const user = approvedUsers[userIndex];

      // Verify current password if changing password
      if (params.currentPassword && user.pass !== params.currentPassword) {
        return { success: false, error: 'Current password is incorrect' };
      }

      // Update user data
      if (params.mobile) {
        user.mob = params.mobile;
      }
      if (params.newPassword) {
        user.pass = params.newPassword;
      }

      approvedUsers[userIndex] = user;
      safeSetItem('approved_users', approvedUsers);

      // Update session
      const updatedSession: Session = {
        ...session,
        mobile: user.mob,
      };
      setSession(updatedSession);
      localStorage.setItem(SESSION_KEY, JSON.stringify(updatedSession));

      return { success: true };
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: 'Failed to update profile' };
    }
  };

  const value: SessionContextValue = {
    session,
    isInitializing,
    login,
    logout,
    updateUserProfile,
  };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}
