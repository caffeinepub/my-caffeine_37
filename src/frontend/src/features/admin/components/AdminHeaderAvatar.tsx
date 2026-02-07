import { Avatar, AvatarImage, AvatarFallback } from '../../../components/ui/avatar';
import { useInternetIdentity } from '../../../hooks/useInternetIdentity';
import { getProfilePhoto } from '../../../lib/storage/userProfileStorage';
import { getBrandingSettings } from '../../../lib/branding/brandingStorage';
import { User } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AdminHeaderAvatar() {
  const { identity } = useInternetIdentity();
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!identity) {
      setAvatarSrc(null);
      return;
    }

    // Try to get profile photo from localStorage
    const principal = identity.getPrincipal().toString();
    const storedPhoto = getProfilePhoto(principal);
    
    if (storedPhoto) {
      setAvatarSrc(storedPhoto);
      return;
    }

    // Try branding logo as fallback
    const branding = getBrandingSettings();
    if (branding.logoDataUrl) {
      setAvatarSrc(branding.logoDataUrl);
      return;
    }

    // Use generated placeholder
    setAvatarSrc('/assets/generated/admin-avatar-placeholder.dim_128x128.png');
  }, [identity]);

  if (!identity) return null;

  return (
    <Avatar className="w-9 h-9 border-2 border-white shadow-md">
      <AvatarImage src={avatarSrc || undefined} alt="Admin" />
      <AvatarFallback className="bg-white text-purple-700">
        <User className="w-5 h-5" />
      </AvatarFallback>
    </Avatar>
  );
}
