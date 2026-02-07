import { LucideIcon } from 'lucide-react';

interface FooterAction {
  label: string;
  onClick: () => void;
  icon: LucideIcon;
}

interface DashboardFooterProps {
  leftAction: FooterAction;
  centerAction: FooterAction;
  rightAction: FooterAction;
}

export default function DashboardFooter({ leftAction, centerAction, rightAction }: DashboardFooterProps) {
  return (
    <div className="bg-white/95 backdrop-blur-md border-t-2 border-gray-300 shadow-2xl pb-safe-bottom">
      <div className="px-2 py-2">
        <div className="grid grid-cols-3 gap-2">
          {/* Left Button */}
          <button
            onClick={leftAction.onClick}
            className="flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl shadow-lg transition-all active:scale-95 border-2 border-blue-800 min-h-[56px] touch-manipulation"
          >
            <leftAction.icon className="w-5 h-5 flex-shrink-0" />
            <span className="text-[10px] font-bold leading-tight text-center px-1 truncate w-full min-w-0">
              {leftAction.label}
            </span>
          </button>

          {/* Center Button */}
          <button
            onClick={centerAction.onClick}
            className="flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 text-white rounded-2xl shadow-lg transition-all active:scale-95 border-2 border-teal-800 min-h-[56px] touch-manipulation"
          >
            <centerAction.icon className="w-5 h-5 flex-shrink-0" />
            <span className="text-[10px] font-bold leading-tight text-center px-1 truncate w-full min-w-0">
              {centerAction.label}
            </span>
          </button>

          {/* Right Button */}
          <button
            onClick={rightAction.onClick}
            className="flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-purple-600 to-pink-700 hover:from-purple-700 hover:to-pink-800 text-white rounded-2xl shadow-lg transition-all active:scale-95 border-2 border-purple-800 min-h-[56px] touch-manipulation"
          >
            <rightAction.icon className="w-5 h-5 flex-shrink-0" />
            <span className="text-[10px] font-bold leading-tight text-center px-1 truncate w-full min-w-0">
              {rightAction.label}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
