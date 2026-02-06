import { useState, useEffect } from 'react';
import { NoticeConfig, loadNoticeConfig } from '../lib/storage/noticeStorage';

export function useUserNotice() {
  const [config, setConfig] = useState<NoticeConfig>(() => loadNoticeConfig());

  useEffect(() => {
    const handleUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<NoticeConfig>;
      setConfig(customEvent.detail || { enabled: false, text: '' });
    };

    window.addEventListener('notice-config-updated', handleUpdate);
    return () => window.removeEventListener('notice-config-updated', handleUpdate);
  }, []);

  return config;
}
