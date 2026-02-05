import { useEffect, useState } from 'react';
import { safeGetItem } from '../../../lib/storage/safeStorage';

export default function AdminSummaryCards() {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalDue, setTotalDue] = useState(0);

  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = () => {
    const accounts = safeGetItem<Record<string, { bill: number; cost: number }>>('accounts', {}) || {};

    let income = 0;
    let expense = 0;

    Object.values(accounts).forEach((acc) => {
      income += acc.bill;
      expense += acc.cost;
    });

    setTotalIncome(income);
    setTotalExpense(expense);
    setTotalDue(income - expense);
  };

  return (
    <div className="w-full px-2">
      <div className="flex justify-center gap-3">
        {/* মোট কাজ - Green Circle */}
        <div className="flex-1 max-w-[140px]">
          <div className="relative aspect-square w-full">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-500 to-green-600 shadow-2xl border-4 border-green-400 flex flex-col items-center justify-center p-4">
              <p className="text-white text-xs font-bold mb-2 text-center">মোট কাজ</p>
              <div className="bg-black/80 rounded-full px-3 py-1.5 min-w-[60px]">
                <p className="text-white text-sm font-bold text-center">{totalIncome.toFixed(0)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* মোট নেওয়া - Orange Circle */}
        <div className="flex-1 max-w-[140px]">
          <div className="relative aspect-square w-full">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 shadow-2xl border-4 border-orange-400 flex flex-col items-center justify-center p-4">
              <p className="text-white text-xs font-bold mb-2 text-center">মোট নেওয়া</p>
              <div className="bg-black/80 rounded-full px-3 py-1.5 min-w-[60px]">
                <p className="text-white text-sm font-bold text-center">{totalExpense.toFixed(0)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* পাওনা - Red Circle */}
        <div className="flex-1 max-w-[140px]">
          <div className="relative aspect-square w-full">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-500 to-red-600 shadow-2xl border-4 border-red-400 flex flex-col items-center justify-center p-4">
              <p className="text-white text-xs font-bold mb-2 text-center">পাওনা</p>
              <div className="bg-black/80 rounded-full px-3 py-1.5 min-w-[60px]">
                <p className="text-white text-sm font-bold text-center">{totalDue.toFixed(0)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
