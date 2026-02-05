import { TrendingUp, Briefcase, Wallet } from 'lucide-react';

interface UserKpiSummaryProps {
  totalDue: number;
  totalWork: number;
  totalCost: number;
}

export default function UserKpiSummary({ totalDue, totalWork, totalCost }: UserKpiSummaryProps) {
  return (
    <div className="border-4 border-gray-800 rounded-3xl p-3 bg-white shadow-xl">
      {/* Row 1: Full-width Due card */}
      <div className="mb-3">
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-white" />
              <p className="text-white text-base font-bold">আমার মোট পাওনা</p>
            </div>
          </div>
          <div className="bg-black/80 rounded-2xl px-4 py-3">
            <p className="text-white text-3xl font-bold text-center">{totalDue.toFixed(0)} ৳</p>
          </div>
        </div>
      </div>

      {/* Row 2: Two half-width cards */}
      <div className="flex gap-3">
        <div className="flex-1 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="w-5 h-5 text-white" />
            <p className="text-white text-sm font-bold">মোট কাজ</p>
          </div>
          <div className="bg-black/80 rounded-xl px-3 py-2">
            <p className="text-white text-xl font-bold text-center">{totalWork.toFixed(0)} ৳</p>
          </div>
        </div>

        <div className="flex-1 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-5 h-5 text-white" />
            <p className="text-white text-sm font-bold">মোট নেওয়া</p>
          </div>
          <div className="bg-black/80 rounded-xl px-3 py-2">
            <p className="text-white text-xl font-bold text-center">{totalCost.toFixed(0)} ৳</p>
          </div>
        </div>
      </div>
    </div>
  );
}
