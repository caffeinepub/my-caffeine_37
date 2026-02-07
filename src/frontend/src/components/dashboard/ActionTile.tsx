import { ReactNode } from 'react';

interface ActionTileProps {
  icon: string | ReactNode;
  label: string;
  onClick: () => void;
  bgGradient: string;
  size?: 'admin' | 'user' | 'small';
}

export default function ActionTile({ icon, label, onClick, bgGradient, size = 'admin' }: ActionTileProps) {
  // Size variants optimized for mobile viewport with thin black borders
  const sizeClasses = {
    admin: {
      container: 'rounded-2xl p-4 border-2 border-black w-full min-w-0',
      icon: 'w-12 h-12',
      text: 'text-sm',
      gap: 'gap-2',
    },
    user: {
      container: 'rounded-2xl p-4 border-2 border-black w-full min-w-0',
      icon: 'w-12 h-12',
      text: 'text-sm',
      gap: 'gap-2',
    },
    small: {
      container: 'rounded-xl p-2 border-2 border-black w-full min-w-0',
      icon: 'w-8 h-8',
      text: 'text-xs',
      gap: 'gap-1.5',
    },
  };

  const styles = sizeClasses[size];

  return (
    <button
      onClick={onClick}
      className={`bg-gradient-to-br ${bgGradient} ${styles.container} shadow-md active:scale-95 transition-transform touch-manipulation`}
      style={{ aspectRatio: size === 'small' ? '1.1' : '1' }}
    >
      <div className={`flex flex-col items-center justify-center ${styles.gap} h-full`}>
        {typeof icon === 'string' ? (
          <img src={icon} alt={label} className={styles.icon} />
        ) : (
          <div className={`${styles.icon} flex items-center justify-center`}>{icon}</div>
        )}
        <p className={`text-white ${styles.text} font-bold text-center leading-tight break-words`}>{label}</p>
      </div>
    </button>
  );
}
