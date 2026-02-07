import { Avatar, AvatarImage, AvatarFallback } from '../../../components/ui/avatar';
import { useInternetIdentity } from '../../../hooks/useInternetIdentity';
import { getAdminProfilePhoto } from '../../../lib/storage/userProfileStorage';
import { getBrandingSettings } from '../../../lib/branding/brandingStorage';
import { User } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AdminHeaderAvatar() {
  const { identity } = useInternetIdentity();
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);

  const loadAvatar = () => {
    if (!identity) {
      setAvatarSrc(null);
      return;
    }

    // Priority: admin profile photo > branding logo > placeholder
    const adminPhoto = getAdminProfilePhoto();
    if (adminPhoto) {
      setAvatarSrc(adminPhoto);
      return;
    }

    const branding = getBrandingSettings();
    if (branding.logoDataUrl) {
      setAvatarSrc(branding.logoDataUrl);
      return;
    }

    setAvatarSrc('/assets/generated/admin-avatar-placeholder.dim_128x128.png');
  };

  useEffect(() => {
    loadAvatar();

    // Listen for profile photo updates
    const handleProfilePhotoUpdate = () => {
      loadAvatar();
    };

    window.addEventListener('admin-profile-photo-updated', handleProfilePhotoUpdate);
    window.addEventListener('storage', handleProfilePhotoUpdate);

    return () => {
      window.removeEventListener('admin-profile-photo-updated', handleProfilePhotoUpdate);
      window.removeEventListener('storage', handleProfilePhotoUpdate);
    };
  }, [identity]);

  if (!identity) return null;

  return (
    <Avatar className="w-10 h-10 border-2 border-white/50 shadow-lg">
      <AvatarImage src={avatarSrc || undefined} alt="Admin Avatar" />
      <AvatarFallback className="bg-white/20 text-white">
        <User className="w-5 h-5" />
      </AvatarFallback>
    </Avatar>
  );
}
