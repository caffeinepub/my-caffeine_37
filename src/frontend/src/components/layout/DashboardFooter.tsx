import { Button } from '../ui/button';
import { MessageCircle, LucideIcon } from 'lucide-react';

interface FooterAction {
  label: string;
  onClick: () => void;
  icon?: LucideIcon;
}

interface DashboardFooterProps {
  leftAction?: FooterAction;
  centerAction?: FooterAction;
  rightAction?: FooterAction;
}

export default function DashboardFooter({
  leftAction,
  centerAction,
  rightAction,
}: DashboardFooterProps) {
  return (
    <div className="bg-white/95 backdrop-blur-md border-t-2 border-gray-300 shadow-2xl pb-safe-bottom">
      <div className="container mx-auto px-3 py-2.5">
        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-2">
          <div className="grid grid-cols-3 gap-2">
            {/* Left Action */}
            <div className="flex justify-start">
              {leftAction && (
                <Button
                  onClick={leftAction.onClick}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-full px-3 sm:px-4 py-2 shadow-lg transition-all text-xs sm:text-sm whitespace-nowrap min-h-[44px]"
                >
                  {leftAction.icon && <leftAction.icon className="w-4 h-4 mr-1" />}
                  {leftAction.label}
                </Button>
              )}
            </div>

            {/* Center Action */}
            <div className="flex justify-center">
              {centerAction && (
                <Button
                  onClick={centerAction.onClick}
                  className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold rounded-full px-3 sm:px-4 py-2 shadow-lg transition-all text-xs sm:text-sm whitespace-nowrap min-h-[44px]"
                >
                  {centerAction.icon ? (
                    <centerAction.icon className="w-4 h-4 mr-1" />
                  ) : (
                    <MessageCircle className="w-4 h-4 mr-1" />
                  )}
                  {centerAction.label}
                </Button>
              )}
            </div>

            {/* Right Action */}
            <div className="flex justify-end">
              {rightAction && (
                <Button
                  onClick={rightAction.onClick}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-full px-3 sm:px-4 py-2 shadow-lg transition-all text-xs sm:text-sm whitespace-nowrap min-h-[44px]"
                >
                  {rightAction.icon && <rightAction.icon className="w-4 h-4 mr-1" />}
                  {rightAction.label}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
