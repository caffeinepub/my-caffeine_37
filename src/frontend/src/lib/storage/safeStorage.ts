export function safeGetItem<T>(key: string, defaultValue: T | null = null): T | null {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return defaultValue;
  }
}

export function safeSetItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing ${key} to localStorage:`, error);
  }
}

export function safeRemoveItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
  }
}

/**
 * Safely reads an array from localStorage, normalizing unexpected formats.
 * Returns an empty array if the value is missing, null, or not an array.
 */
export function safeGetArray<T>(key: string): T[] {
  try {
    const item = localStorage.getItem(key);
    if (!item) return [];
    
    const parsed = JSON.parse(item);
    
    // If it's already an array, return it
    if (Array.isArray(parsed)) {
      return parsed as T[];
    }
    
    // If it's an object (old format), convert to array
    if (parsed && typeof parsed === 'object') {
      return Object.values(parsed) as T[];
    }
    
    // Otherwise return empty array
    return [];
  } catch (error) {
    console.error(`Error reading array ${key} from localStorage:`, error);
    return [];
  }
}

/**
 * Validates that a value is a proper array before returning it.
 */
export function validateArray<T>(value: unknown, fallback: T[] = []): T[] {
  if (Array.isArray(value)) {
    return value;
  }
  return fallback;
}
