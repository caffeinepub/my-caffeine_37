const SUPPORT_MESSAGES_KEY = 'support_messages';

export interface SupportMessage {
  id: string;
  from: string;
  fromRole: 'user' | 'admin';
  message: string;
  timestamp: number;
}

export interface SupportThread {
  userId: string;
  userName: string;
  messages: SupportMessage[];
  lastMessageTime: number;
}

export function getSupportThreads(): SupportThread[] {
  try {
    const stored = localStorage.getItem(SUPPORT_MESSAGES_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading support threads:', error);
  }
  return [];
}

export function getUserThread(userId: string): SupportThread | null {
  const threads = getSupportThreads();
  return threads.find((t) => t.userId === userId) || null;
}

export function addSupportMessage(userId: string, userName: string, message: string, fromRole: 'user' | 'admin'): void {
  try {
    const threads = getSupportThreads();
    let thread = threads.find((t) => t.userId === userId);

    const newMessage: SupportMessage = {
      id: Date.now().toString(),
      from: fromRole === 'admin' ? 'Admin' : userName,
      fromRole,
      message,
      timestamp: Date.now(),
    };

    if (thread) {
      thread.messages.push(newMessage);
      thread.lastMessageTime = Date.now();
    } else {
      thread = {
        userId,
        userName,
        messages: [newMessage],
        lastMessageTime: Date.now(),
      };
      threads.push(thread);
    }

    localStorage.setItem(SUPPORT_MESSAGES_KEY, JSON.stringify(threads));
  } catch (error) {
    console.error('Error saving support message:', error);
  }
}
