/**
 * localStorage utilities for User dashboard scrolling notice configuration
 */

const NOTICE_KEY = 'user_notice_config';

export interface NoticeConfig {
  enabled: boolean;
  text: string;
}

export function loadNoticeConfig(): NoticeConfig {
  try {
    const stored = localStorage.getItem(NOTICE_KEY);
    if (!stored) return { enabled: false, text: '' };
    return JSON.parse(stored) as NoticeConfig;
  } catch (error) {
    console.error('Error loading notice config:', error);
    return { enabled: false, text: '' };
  }
}

export function saveNoticeConfig(config: NoticeConfig): void {
  try {
    localStorage.setItem(NOTICE_KEY, JSON.stringify(config));
    window.dispatchEvent(new CustomEvent('notice-config-updated', { detail: config }));
  } catch (error) {
    console.error('Error saving notice config:', error);
  }
}
