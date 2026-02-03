import { createContext, useState, useEffect, ReactNode } from 'react';
import { Session, SessionContextValue } from './sessionTypes';
import { safeGetItem, safeSetItem, safeRemoveItem } from '../../lib/storage/safeStorage';

export const SessionContext = createContext<SessionContextValue | undefined>(undefined);

const SESSION_KEY = 'smart_hisab_session';
const ADMIN_MOBILE = '4444';
const ADMIN_PASSWORD = 'mmmm';

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Try to restore session from localStorage
    const savedSession = safeGetItem<Session>(SESSION_KEY);
    if (savedSession) {
      setSession(savedSession);
    }
    setIsInitializing(false);
  }, []);

  const login = async (mobile: string, password: string): Promise<boolean> => {
    // Check admin credentials
    if (mobile === ADMIN_MOBILE && password === ADMIN_PASSWORD) {
      const adminSession: Session = { role: 'admin' };
      setSession(adminSession);
      safeSetItem(SESSION_KEY, adminSession);
      return true;
    }

    // Check approved users
    const approvedUsers = safeGetItem<Record<string, { name: string; mob: string; pass: string }>>(
      'approved_users',
      {}
    );

    if (!approvedUsers) return false;

    const user = Object.values(approvedUsers).find(
      (u) => u.mob === mobile && u.pass === password
    );

    if (user) {
      const userSession: Session = {
        role: 'user',
        userName: user.name,
        mobile: user.mob,
      };
      setSession(userSession);
      safeSetItem(SESSION_KEY, userSession);
      return true;
    }

    return false;
  };

  const logout = () => {
    setSession(null);
    safeRemoveItem(SESSION_KEY);
  };

  return (
    <SessionContext.Provider value={{ session, isInitializing, login, logout }}>
      {children}
    </SessionContext.Provider>
  );
}
