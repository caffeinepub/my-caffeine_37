import { ReactNode } from 'react';

interface ActionTileProps {
  icon: string | ReactNode;
  label: string;
  onClick: () => void;
  bgGradient: string;
  size?: 'admin' | 'user' | 'small';
}

export default function ActionTile({ icon, label, onClick, bgGradient, size = 'admin' }: ActionTileProps) {
  // Size variants for different contexts - updated for rounded square tiles
  const sizeClasses = {
    admin: {
      container: 'rounded-3xl p-6 border-3 border-gray-300 aspect-square',
      icon: 'w-16 h-16',
      text: 'text-base',
    },
    user: {
      container: 'rounded-3xl p-5 border-2 border-gray-300 aspect-square',
      icon: 'w-14 h-14',
      text: 'text-sm',
    },
    small: {
      container: 'rounded-2xl p-3 border-2 border-gray-300 aspect-square',
      icon: 'w-10 h-10',
      text: 'text-xs',
    },
  };

  const styles = sizeClasses[size];

  return (
    <button
      onClick={onClick}
      className={`bg-gradient-to-br ${bgGradient} ${styles.container} shadow-lg hover:scale-105 transition-transform active:scale-95 touch-manipulation`}
    >
      <div className="flex flex-col items-center justify-center gap-2 h-full">
        {typeof icon === 'string' ? (
          <img src={icon} alt={label} className={styles.icon} />
        ) : (
          <div className={`${styles.icon} flex items-center justify-center`}>{icon}</div>
        )}
        <p className={`text-white ${styles.text} font-bold text-center leading-tight`}>{label}</p>
      </div>
    </button>
  );
}
