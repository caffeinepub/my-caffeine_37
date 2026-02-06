import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

interface PopupModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function PopupModal({ isOpen, onClose, children }: PopupModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-2"
        onClick={onClose}
      >
        <div
          className="w-full max-w-5xl h-[95vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button - Top Right */}
          <div className="flex justify-end p-3 border-b border-gray-200 bg-gradient-to-r from-blue-500 via-teal-500 to-purple-600 flex-shrink-0">
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-red-500 hover:bg-red-600 transition-colors shadow-lg"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
