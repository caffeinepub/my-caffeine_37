export interface Session {
  role: 'admin' | 'user';
  userName?: string;
  mobile?: string;
  userId?: number; // Stable auto-generated user ID
}

export interface LoginResult {
  success: boolean;
  error?: string;
}

export interface UpdateProfileParams {
  mobile?: string;
  currentPassword?: string;
  newPassword?: string;
}

export interface SessionContextValue {
  session: Session | null;
  isInitializing: boolean;
  login: (usernameOrMobile: string, password: string) => Promise<LoginResult>;
  logout: () => void;
  updateUserProfile: (params: UpdateProfileParams) => Promise<LoginResult>;
}

export interface ApprovedUser {
  name: string;
  mob: string;
  pass: string;
  userId?: number; // Optional for backward compatibility
}

export interface PendingRequest {
  name: string;
  mob: string;
  pass: string;
}
