import { useState, useEffect } from 'react';
import { getBrandingSettings, setBrandingSettings, BrandingSettings } from '../lib/branding/brandingStorage';

export function useBranding() {
  const [branding, setBranding] = useState<BrandingSettings>(getBrandingSettings());

  useEffect(() => {
    const handleBrandingUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<BrandingSettings>;
      setBranding(customEvent.detail);
    };

    window.addEventListener('branding-updated', handleBrandingUpdate);
    return () => window.removeEventListener('branding-updated', handleBrandingUpdate);
  }, []);

  const updateBranding = (updates: Partial<BrandingSettings>) => {
    setBrandingSettings(updates);
    setBranding(getBrandingSettings());
  };

  return { branding, updateBranding };
}
