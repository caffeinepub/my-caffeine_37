const BRANDING_KEY = 'app_branding';

export interface BrandingSettings {
  companyName: string;
  channelName: string;
  logoDataUrl: string | null;
}

const DEFAULT_BRANDING: BrandingSettings = {
  companyName: 'MT Management',
  channelName: 'Main Channel',
  logoDataUrl: null,
};

export function getBrandingSettings(): BrandingSettings {
  try {
    const stored = localStorage.getItem(BRANDING_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_BRANDING, ...parsed };
    }
  } catch (error) {
    console.error('Error loading branding settings:', error);
  }
  return DEFAULT_BRANDING;
}

export function setBrandingSettings(settings: Partial<BrandingSettings>): void {
  try {
    const current = getBrandingSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(BRANDING_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('branding-updated', { detail: updated }));
  } catch (error) {
    console.error('Error saving branding settings:', error);
  }
}

export function getLogoUrl(): string {
  const settings = getBrandingSettings();
  return settings.logoDataUrl || '/assets/generated/mt-management-logo-v2.dim_512x512.png';
}

export function getLoginCircleImage(): string {
  const settings = getBrandingSettings();
  return settings.logoDataUrl || '/assets/generated/login-hero-illustration.dim_1024x1024.png';
}
