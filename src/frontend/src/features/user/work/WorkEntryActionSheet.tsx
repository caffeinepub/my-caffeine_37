import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { X } from 'lucide-react';

interface WorkEntry {
  id: string;
  date: string;
  names: string[];
  quantityDouble: number;
  quantitySingle: number;
  perWorkerAmounts: Record<string, number>;
  grandTotal: number;
  timestamp: number;
}

interface WorkEntryActionSheetProps {
  entry: WorkEntry;
  userName: string;
  onClose: () => void;
}

export default function WorkEntryActionSheet({ entry, userName, onClose }: WorkEntryActionSheetProps) {
  const myAmount = entry.perWorkerAmounts[userName] || 0;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-cyan-900">কাজের বিস্তারিত</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-4 pt-4">
          <div className="bg-cyan-50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-cyan-900">তারিখ:</span>
              <span className="text-sm font-bold text-cyan-900">{entry.date}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-cyan-900">ডাবল:</span>
              <span className="text-sm font-bold text-cyan-900">{entry.quantityDouble}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-cyan-900">সিঙ্গেল:</span>
              <span className="text-sm font-bold text-cyan-900">{entry.quantitySingle}</span>
            </div>
            
            <div className="flex justify-between items-center pt-2 border-t-2 border-cyan-200">
              <span className="text-base font-bold text-cyan-900">আপনার মোট:</span>
              <span className="text-xl font-bold text-cyan-700">৳{myAmount.toFixed(0)}</span>
            </div>
          </div>
          
          <Button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white"
          >
            বন্ধ করুন
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
