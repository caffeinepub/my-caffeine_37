export interface Session {
  role: 'admin' | 'user';
  userName?: string;
  mobile?: string;
}

export interface SessionContextValue {
  session: Session | null;
  isInitializing: boolean;
  login: (mobile: string, password: string) => Promise<boolean>;
  logout: () => void;
}
